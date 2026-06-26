import { defineField, defineType } from "sanity";

const categories = [
  { title: "Digital Nomad Visa", value: "Digital Nomad Visa" },
  { title: "Non-Lucrative Visa", value: "Non-Lucrative Visa" },
  { title: "Documents & Process", value: "Documents & Process" },
  { title: "After Approval", value: "After Approval" },
];

export default defineType({
  name: "faqItem",
  title: "FAQ Item",
  type: "document",
  fields: [
    defineField({ name: "question", title: "Question", type: "string", validation: (R) => R.required() }),
    defineField({ name: "answer", title: "Answer", type: "text", rows: 4, validation: (R) => R.required() }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: categories },
      validation: (R) => R.required(),
    }),
    defineField({ name: "order", title: "Display Order within Category", type: "number", description: "Lower = shown first" }),
  ],
  orderings: [
    { title: "Category + Order", name: "categoryOrder", by: [{ field: "category", direction: "asc" }, { field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "question", subtitle: "category" },
  },
});
