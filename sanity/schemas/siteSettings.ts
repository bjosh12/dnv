import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "siteName", title: "Site Name", type: "string" }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({ name: "contactEmail", title: "Contact Email", type: "string" }),
    defineField({ name: "whatsappNumber", title: "WhatsApp Number", type: "string", description: "Include country code, no + or spaces. E.g. 34600000000" }),
    defineField({
      name: "stats",
      title: "Stats Strip",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "value", title: "Value", type: "string", description: "e.g. 500+" }),
            defineField({ name: "label", title: "Label", type: "string", description: "e.g. Visas Approved" }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        },
      ],
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "object",
      fields: [
        defineField({ name: "instagram", title: "Instagram URL", type: "url" }),
        defineField({ name: "facebook", title: "Facebook URL", type: "url" }),
        defineField({ name: "linkedin", title: "LinkedIn URL", type: "url" }),
        defineField({ name: "youtube", title: "YouTube URL", type: "url" }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
});
