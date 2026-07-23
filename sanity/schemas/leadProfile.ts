import { defineField, defineType } from "sanity";

export default defineType({
  name: "leadProfile",
  title: "Lead Profile",
  type: "document",
  fields: [
    // ── Contact ────────────────────────────────────────────────────────────
    defineField({ name: "name", title: "Name", type: "string", validation: (R) => R.required() }),
    defineField({ name: "email", title: "Email", type: "string", validation: (R) => R.required() }),
    defineField({ name: "phone", title: "Phone", type: "string" }),

    // ── Triage ─────────────────────────────────────────────────────────────
    defineField({
      name: "status",
      title: "Triage Status",
      type: "string",
      options: {
        list: [
          { title: "🆕 New", value: "new" },
          { title: "📞 Contacted", value: "contacted" },
          { title: "✅ Qualified", value: "qualified" },
          { title: "❌ Rejected", value: "rejected" },
        ],
        layout: "radio",
      },
      initialValue: "new",
    }),
    defineField({ name: "notes", title: "My Notes", type: "text", rows: 4 }),
    defineField({ name: "submittedAt", title: "Submitted At", type: "datetime", readOnly: true }),

    // ── Eligibility snapshot (from the wizard) ─────────────────────────────
    defineField({
      name: "resultStatus",
      title: "Wizard Result",
      type: "string",
      options: {
        list: [
          { title: "Eligible", value: "eligible" },
          { title: "Likely Eligible", value: "likely" },
          { title: "Not Eligible", value: "not-eligible" },
        ],
      },
      readOnly: true,
    }),
    defineField({
      name: "resultFlags",
      title: "Risk Flags (rule-based)",
      type: "array",
      of: [{ type: "string" }],
      readOnly: true,
    }),
    defineField({
      name: "answers",
      title: "Wizard Answers",
      type: "array",
      readOnly: true,
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "questionId", title: "ID", type: "string" }),
            defineField({ name: "question", title: "Question", type: "string" }),
            defineField({ name: "answer", title: "Answer", type: "string" }),
          ],
          preview: {
            select: { title: "question", subtitle: "answer" },
          },
        },
      ],
    }),

    // ── AI analysis ────────────────────────────────────────────────────────
    defineField({
      name: "aiAnalysis",
      title: "AI Analysis",
      type: "object",
      fields: [
        defineField({
          name: "status",
          title: "Analysis Status",
          type: "string",
          options: { list: ["pending", "completed", "failed", "skipped"] },
        }),
        defineField({ name: "score", title: "Lead Score (0–100)", type: "number" }),
        defineField({
          name: "tier",
          title: "Tier",
          type: "string",
          options: { list: ["hot", "warm", "cold"] },
        }),
        defineField({ name: "summary", title: "Summary", type: "text", rows: 6 }),
        defineField({
          name: "riskFlags",
          title: "Risk Flags (AI)",
          type: "array",
          of: [{ type: "string" }],
        }),
        defineField({
          name: "nextSteps",
          title: "Recommended Next Steps",
          type: "array",
          of: [{ type: "string" }],
        }),
        defineField({ name: "model", title: "Model", type: "string" }),
      ],
    }),
  ],
  orderings: [
    {
      title: "Newest First",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
    {
      title: "Highest Score",
      name: "scoreDesc",
      by: [{ field: "aiAnalysis.score", direction: "desc" }],
    },
    {
      title: "Triage Status",
      name: "statusAsc",
      by: [{ field: "status", direction: "asc" }, { field: "submittedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      name: "name",
      email: "email",
      status: "status",
      tier: "aiAnalysis.tier",
      score: "aiAnalysis.score",
      result: "resultStatus",
    },
    prepare({ name, email, status, tier, score, result }) {
      const tierIcon = tier === "hot" ? "🔥" : tier === "warm" ? "🌤" : tier === "cold" ? "🧊" : "❔";
      const scoreLabel = typeof score === "number" ? ` ${score}` : "";
      return {
        title: `${tierIcon}${scoreLabel} ${name ?? "Unknown"}`,
        subtitle: `${status ?? "new"} · ${result ?? "?"} · ${email ?? ""}`,
      };
    },
  },
});
