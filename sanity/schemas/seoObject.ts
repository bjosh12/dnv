import { defineField, defineType } from "sanity";

export default defineType({
  name: "seoObject",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "SEO Title",
      type: "string",
      description: "Overrides the page title in Google. Ideal: 50–60 characters.",
      validation: (R) => R.max(60).warning("Keep under 60 characters for best results"),
    }),
    defineField({
      name: "description",
      title: "Meta Description",
      type: "text",
      rows: 2,
      description: "Shown in Google search results under the title. Ideal: 150–160 characters.",
      validation: (R) => R.max(160).warning("Keep under 160 characters for best results"),
    }),
    defineField({
      name: "image",
      title: "Social Share Image (OG Image)",
      type: "image",
      options: { hotspot: true },
      description: "Image shown when shared on Twitter, Facebook, WhatsApp etc. Recommended: 1200×630px",
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      description: "Turn on to prevent Google from indexing this page (e.g. draft pages)",
      initialValue: false,
    }),
  ],
});
