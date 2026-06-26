import { defineField, defineType } from "sanity";

export default defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Client Name", type: "string", validation: (R) => R.required() }),
    defineField({ name: "country", title: "Country (with flag emoji)", type: "string", description: 'e.g. "🇺🇸 United States"' }),
    defineField({
      name: "visa",
      title: "Visa Type",
      type: "string",
      options: {
        list: [
          { title: "Digital Nomad Visa", value: "Digital Nomad Visa" },
          { title: "Non-Lucrative Visa", value: "Non-Lucrative Visa" },
        ],
      },
    }),
    defineField({ name: "quote", title: "Testimonial Quote", type: "text", rows: 4, validation: (R) => R.required() }),
    defineField({
      name: "rating",
      title: "Rating (1–5)",
      type: "number",
      validation: (R) => R.min(1).max(5),
      initialValue: 5,
    }),
    defineField({ name: "avatar", title: "Avatar Photo", type: "image", options: { hotspot: true } }),
    defineField({ name: "order", title: "Display Order", type: "number", description: "Lower number = shown first" }),
  ],
  orderings: [{ title: "Display Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "name", subtitle: "visa", media: "avatar" },
  },
});
