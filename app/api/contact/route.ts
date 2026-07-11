import { NextResponse } from "next/server";
import { Resend } from "resend";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/constants";

const resend = new Resend(process.env.RESEND_API_KEY);

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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, visa, message, website, turnstileToken } = body;

    // Honeypot: hidden field real users never fill. Pretend success so bots don't adapt.
    if (website) {
      return NextResponse.json({ success: true });
    }

    if (!name || !email || !message || !visa) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    const human = await verifyTurnstile(turnstileToken ?? "", ip);
    if (!human) {
      return NextResponse.json({ error: "Verification failed" }, { status: 403 });
    }

    const safeName = escapeHtml(String(name));
    const safeEmail = escapeHtml(String(email));
    const safePhone = phone ? escapeHtml(String(phone)) : "Not provided";
    const safeVisa = escapeHtml(String(visa));
    const safeMessage = escapeHtml(String(message)).replace(/\n/g, "<br>");

    // Send notification to business
    await resend.emails.send({
      from: `${SITE_NAME} <noreply@digitalnomadinspain.com>`,
      to: CONTACT_EMAIL,
      subject: `New enquiry from ${name} — ${visa}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Phone:</strong> ${safePhone}</p>
        <p><strong>Visa Interest:</strong> ${safeVisa}</p>
        <p><strong>Message:</strong></p>
        <blockquote>${safeMessage}</blockquote>
        <hr>
        <p style="color:#666;font-size:12px;">Sent from ${SITE_NAME} contact form</p>
      `,
    });

    // Send auto-reply to user
    await resend.emails.send({
      from: `${SITE_NAME} <noreply@digitalnomadinspain.com>`,
      to: email,
      subject: `We received your message — ${SITE_NAME}`,
      html: `
        <h2>Thanks for reaching out, ${safeName}!</h2>
        <p>We've received your message and will get back to you within 24 hours (on weekdays).</p>
        <p>In the meantime, you might find answers in our <a href="https://www.digitalnomadinspain.com/faq">FAQ</a>.</p>
        <p>
          Want to speak with us sooner?
          <a href="https://book.lakbyte.com/widget/booking/MRAtDGOOso1sUiM2MKix?am_id=joshua9606">
            Book a free consultation here.
          </a>
        </p>
        <br>
        <p>The ${SITE_NAME} team 🇪🇸</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
