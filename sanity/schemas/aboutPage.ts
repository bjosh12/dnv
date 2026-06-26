import { defineField, defineType } from "sanity";

export default defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  groups: [{ name: "seo", title: "SEO" }],
  fields: [
    defineField({
      name: "stats",
      title: "Hero Stats",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "value", title: "Value", type: "string", description: 'e.g. "500+"' }),
            defineField({ name: "label", title: "Label", type: "string", description: 'e.g. "Visas approved"' }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        },
      ],
    }),
    defineField({ name: "story1", title: "Story Paragraph 1", type: "text", rows: 3 }),
    defineField({ name: "story2", title: "Story Paragraph 2", type: "text", rows: 3 }),
    defineField({ name: "story3", title: "Story Paragraph 3", type: "text", rows: 3 }),
    defineField({
      name: "values",
      title: "Our Values",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "icon", title: "Icon Name", type: "string", description: "Lucide icon: Award, Users, Globe, MapPin" }),
            defineField({ name: "title", title: "Value Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "title" } },
        },
      ],
    }),
    defineField({
      name: "consultationCovers",
      title: "Free Consultation — What We Cover",
      description: "The checklist shown on the Book page",
      type: "array",
      of: [{ type: "string" }],
    }),

    // SEO
    defineField({ name: "seo", title: "SEO", type: "seoObject", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "About Page" }) },
});
