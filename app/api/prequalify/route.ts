import { NextResponse } from "next/server";
import { Resend } from "resend";
import Anthropic from "@anthropic-ai/sdk";
import { writeClient } from "@/lib/sanity";
import {
  CONTACT_EMAIL,
  SITE_NAME,
  SITE_URL,
  FREE_BOOKING_URL,
  DNV_INCOME_THRESHOLD,
} from "@/lib/constants";

const resend = new Resend(process.env.RESEND_API_KEY);

const AI_MODEL = "claude-opus-4-8";

type AnswerEntry = { questionId: string; question: string; answer: string };
type WizardResult = { status: "eligible" | "likely" | "not-eligible"; flags: string[] };
type AiAnalysis = {
  score: number;
  tier: "hot" | "warm" | "cold";
  summary: string;
  riskFlags: string[];
  nextSteps: string[];
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function verifyTurnstile(token: string, ip: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  // Not configured yet — allow through so the form keeps working until keys are added
  if (!secret) {
    console.warn("TURNSTILE_SECRET_KEY not set — skipping bot verification");
    return true;
  }
  if (!token) return false;

  const params = new URLSearchParams({ secret, response: token });
  if (ip) params.set("remoteip", ip);

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body: params }
  );
  const outcome = await res.json();
  return outcome.success === true;
}

const ANALYSIS_SCHEMA = {
  type: "object",
  properties: {
    score: { type: "integer", description: "Lead quality score from 0 to 100" },
    tier: { type: "string", enum: ["hot", "warm", "cold"] },
    summary: {
      type: "string",
      description:
        "3-5 sentence plain-English briefing for the consultant: who this lead is, how strong their case is, and what stands out",
    },
    riskFlags: {
      type: "array",
      items: { type: "string" },
      description: "Concrete risks or blockers in this application, most serious first",
    },
    nextSteps: {
      type: "array",
      items: { type: "string" },
      description: "Concrete recommended next steps for the consultant, in order",
    },
  },
  required: ["score", "tier", "summary", "riskFlags", "nextSteps"],
  additionalProperties: false,
} as const;

async function analyzeWithClaude(
  answers: AnswerEntry[],
  result: WizardResult
): Promise<AiAnalysis | null> {
  const anthropic = new Anthropic();

  const qa = answers.map((a) => `- ${a.question}\n  Answer: ${a.answer}`).join("\n");

  const response = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: 2048,
    thinking: { type: "adaptive" },
    output_config: { format: { type: "json_schema", schema: ANALYSIS_SCHEMA } },
    system: `You are a lead-qualification analyst for ${SITE_NAME}, a consultancy helping people obtain Spain's Digital Nomad Visa (DNV) and Non-Lucrative Visa. The minimum income requirement for the DNV is €${DNV_INCOME_THRESHOLD}/month. You receive a prospect's answers from the eligibility questionnaire plus a rule-based verdict. Assess how valuable this lead is to the consultancy and how strong their visa case is. Score: 80-100 = hot (clear case, ready to convert), 50-79 = warm (viable with work), below 50 = cold (weak case or major blockers). Be direct and specific — the consultant reads this to decide whether to prioritize the lead.`,
    messages: [
      {
        role: "user",
        content: `Rule-based verdict: ${result.status}\nRule-based flags:\n${
          result.flags.length ? result.flags.map((f) => `- ${f}`).join("\n") : "(none)"
        }\n\nQuestionnaire answers:\n${qa}`,
      },
    ],
  });

  if (response.stop_reason === "refusal") return null;
  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") return null;

  const parsed = JSON.parse(textBlock.text) as AiAnalysis;
  // Defensive clamp — the schema constrains shape, not ranges
  parsed.score = Math.max(0, Math.min(100, Math.round(parsed.score)));
  if (!["hot", "warm", "cold"].includes(parsed.tier)) {
    parsed.tier = parsed.score >= 80 ? "hot" : parsed.score >= 50 ? "warm" : "cold";
  }
  return parsed;
}

function consultantEmailHtml(
  name: string,
  email: string,
  phone: string,
  result: WizardResult,
  answers: AnswerEntry[],
  analysis: AiAnalysis | null,
  leadId: string
) {
  const studioUrl = `${SITE_URL}/studio/structure/leadProfile;${leadId}`;
  const answersRows = answers
    .map(
      (a) =>
        `<tr><td style="padding:4px 8px;border:1px solid #ddd;">${escapeHtml(a.question)}</td><td style="padding:4px 8px;border:1px solid #ddd;">${escapeHtml(a.answer)}</td></tr>`
    )
    .join("");

  const aiSection = analysis
    ? `
      <h3>🤖 AI Analysis — ${analysis.tier.toUpperCase()} (score ${analysis.score}/100)</h3>
      <p>${escapeHtml(analysis.summary)}</p>
      ${analysis.riskFlags.length ? `<p><strong>Risks:</strong></p><ul>${analysis.riskFlags.map((f) => `<li>${escapeHtml(f)}</li>`).join("")}</ul>` : ""}
      ${analysis.nextSteps.length ? `<p><strong>Next steps:</strong></p><ol>${analysis.nextSteps.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ol>` : ""}
    `
    : `<p style="color:#a00;">AI analysis unavailable for this lead — review the answers below.</p>`;

  return `
    <h2>New pre-qualified lead: ${escapeHtml(name)}</h2>
    <p>
      <strong>Email:</strong> ${escapeHtml(email)}<br>
      <strong>Phone:</strong> ${phone ? escapeHtml(phone) : "Not provided"}<br>
      <strong>Eligibility result:</strong> ${escapeHtml(result.status)}
    </p>
    ${aiSection}
    <p><a href="${studioUrl}">Open this lead in Sanity Studio →</a></p>
    <h3>Full questionnaire</h3>
    <table style="border-collapse:collapse;font-size:13px;">${answersRows}</table>
    <hr>
    <p style="color:#666;font-size:12px;">Sent from the ${SITE_NAME} pre-qualification tool</p>
  `;
}

function prospectEmailHtml(name: string, result: WizardResult) {
  const safeName = escapeHtml(name);
  const flagsHtml = result.flags.length
    ? `<p>A few things worth addressing before you apply:</p><ul>${result.flags
        .map((f) => `<li>${escapeHtml(f)}</li>`)
        .join("")}</ul>`
    : "";

  if (result.status === "not-eligible") {
    return `
      <h2>Your Spain visa assessment, ${safeName}</h2>
      <p>Based on your answers, the Digital Nomad Visa doesn't look like a fit for your current situation.</p>
      ${flagsHtml}
      <p>Circumstances change — and there may be alternative routes (like the Non-Lucrative Visa). You can find more detail in our <a href="${SITE_URL}/faq">FAQ</a>, or reply to this email if you'd like us to take a closer look.</p>
      <br>
      <p>The ${SITE_NAME} team 🇪🇸</p>
    `;
  }

  const verdict =
    result.status === "eligible"
      ? "Good news — based on your answers, you look like a strong candidate for Spain's Digital Nomad Visa."
      : "Based on your answers, you're likely eligible for Spain's Digital Nomad Visa, though a few points deserve attention.";

  return `
    <h2>Your Spain visa assessment, ${safeName}</h2>
    <p>${verdict}</p>
    ${flagsHtml}
    <p>
      The fastest way to move forward is a free consultation where we review your case in detail:
      <a href="${FREE_BOOKING_URL}">Book your free consultation here.</a>
    </p>
    <br>
    <p>The ${SITE_NAME} team 🇪🇸</p>
  `;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, answers, result, website, turnstileToken } = body;

    // Honeypot: hidden field real users never fill. Pretend success so bots don't adapt.
    if (website) {
      return NextResponse.json({ success: true });
    }

    if (!name || !email || !Array.isArray(answers) || !result?.status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    const human = await verifyTurnstile(turnstileToken ?? "", ip);
    if (!human) {
      return NextResponse.json({ error: "Verification failed" }, { status: 403 });
    }

    const cleanAnswers: AnswerEntry[] = answers
      .filter((a: AnswerEntry) => a?.question && a?.answer)
      .map((a: AnswerEntry) => ({
        questionId: String(a.questionId ?? ""),
        question: String(a.question).slice(0, 500),
        answer: String(a.answer).slice(0, 500),
      }));
    const cleanResult: WizardResult = {
      status: result.status,
      flags: Array.isArray(result.flags) ? result.flags.map((f: string) => String(f).slice(0, 500)) : [],
    };

    const aiConfigured = Boolean(process.env.ANTHROPIC_API_KEY);

    // 1. Save the lead first — it must survive any downstream failure
    const lead = await writeClient.create({
      _type: "leadProfile",
      name: String(name).slice(0, 200),
      email: String(email).slice(0, 200),
      phone: phone ? String(phone).slice(0, 50) : undefined,
      status: "new",
      submittedAt: new Date().toISOString(),
      resultStatus: cleanResult.status,
      resultFlags: cleanResult.flags,
      answers: cleanAnswers.map((a, i) => ({ _key: `a${i}`, ...a })),
      aiAnalysis: { status: aiConfigured ? "pending" : "skipped" },
    });

    // 2. AI analysis — failure here must not lose the lead or block the emails
    let analysis: AiAnalysis | null = null;
    if (aiConfigured) {
      try {
        analysis = await analyzeWithClaude(cleanAnswers, cleanResult);
        await writeClient
          .patch(lead._id)
          .set(
            analysis
              ? { aiAnalysis: { status: "completed", model: AI_MODEL, ...analysis } }
              : { "aiAnalysis.status": "failed" }
          )
          .commit();
      } catch (err) {
        console.error("AI analysis failed:", err);
        await writeClient
          .patch(lead._id)
          .set({ "aiAnalysis.status": "failed" })
          .commit()
          .catch((e) => console.error("Failed to mark analysis as failed:", e));
      }
    }

    // 3. Emails — log failures but don't fail the request; the lead is saved
    try {
      await resend.emails.send({
        from: `${SITE_NAME} <noreply@digitalnomadinspain.com>`,
        to: CONTACT_EMAIL,
        subject: analysis
          ? `New lead: ${name} — ${analysis.tier.toUpperCase()} (${analysis.score}/100)`
          : `New lead: ${name} — ${cleanResult.status}`,
        html: consultantEmailHtml(
          String(name),
          String(email),
          phone ? String(phone) : "",
          cleanResult,
          cleanAnswers,
          analysis,
          lead._id
        ),
      });

      await resend.emails.send({
        from: `${SITE_NAME} <noreply@digitalnomadinspain.com>`,
        to: String(email),
        subject: `Your Spain visa assessment — ${SITE_NAME}`,
        html: prospectEmailHtml(String(name), cleanResult),
      });
    } catch (err) {
      console.error("Lead notification email failed:", err);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Prequalify error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
