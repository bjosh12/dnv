import { defineField, defineType } from "sanity";

export default defineType({
  name: "serviceContent",
  title: "Service Page",
  type: "document",
  groups: [{ name: "seo", title: "SEO" }],
  fields: [
    defineField({
      name: "slug",
      title: "Slug",
      type: "string",
      options: {
        list: [
          { title: "Digital Nomad Visa", value: "digital-nomad-visa" },
          { title: "Non-Lucrative Visa", value: "non-lucrative-visa" },
        ],
      },
      validation: (R) => R.required(),
    }),
    defineField({ name: "heroHeadline", title: "Hero Headline", type: "string" }),
    defineField({ name: "heroBody", title: "Hero Body Text", type: "text", rows: 3 }),
    defineField({
      name: "requirements",
      title: "Eligibility Requirements",
      type: "array",
      of: [{ type: "string" }],
      description: "Each item becomes a checklist row",
    }),
    defineField({
      name: "documents",
      title: "Required Documents",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "item", title: "Document Name", type: "string" }),
            defineField({ name: "note", title: "Note / Instructions", type: "string" }),
          ],
          preview: { select: { title: "item", subtitle: "note" } },
        },
      ],
    }),
    defineField({
      name: "faqs",
      title: "Page-specific FAQs",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "q", title: "Question", type: "string" }),
            defineField({ name: "a", title: "Answer", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "q" } },
        },
      ],
    }),
    defineField({ name: "pricingFrom", title: "Pricing (from)", type: "string", description: 'e.g. "€1,499"' }),
    defineField({ name: "pricingNote", title: "Pricing Note", type: "string" }),
    defineField({ name: "pricingIncludes", title: "Pricing Includes (bullet list)", type: "array", of: [{ type: "string" }] }),
    defineField({
      name: "quickFacts",
      title: "Quick Facts (sidebar)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "value", title: "Value", type: "string" }),
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        },
      ],
    }),

    // SEO
    defineField({ name: "seo", title: "SEO", type: "seoObject", group: "seo" }),
  ],
  preview: {
    select: { title: "heroHeadline", subtitle: "slug" },
  },
});
