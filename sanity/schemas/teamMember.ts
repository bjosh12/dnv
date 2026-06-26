import { defineField, defineType } from "sanity";

export default defineType({
  name: "teamMember",
  title: "Team Member",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Full Name", type: "string", validation: (R) => R.required() }),
    defineField({ name: "role", title: "Job Title / Role", type: "string" }),
    defineField({ name: "bio", title: "Short Bio", type: "text", rows: 3 }),
    defineField({ name: "photo", title: "Photo", type: "image", options: { hotspot: true } }),
    defineField({ name: "country", title: "Country (with flag emoji)", type: "string", description: 'e.g. "🇪🇸 Spain" or "🇬🇧 → 🇪🇸"' }),
    defineField({ name: "order", title: "Display Order", type: "number", description: "Lower number = shown first" }),
  ],
  orderings: [{ title: "Display Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo" },
  },
});
