import { defineField, defineType } from "sanity";

export default defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  groups: [{ name: "seo", title: "SEO" }],
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (R) => R.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (R) => R.required(),
    }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 3 }),
    defineField({ name: "author", title: "Author", type: "reference", to: [{ type: "author" }] }),
    defineField({ name: "mainImage", title: "Main Image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    }),
    defineField({ name: "publishedAt", title: "Published At", type: "datetime" }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seoObject', group: 'seo' }),
  ],
  preview: {
    select: { title: "title", author: "author.name", media: "mainImage" },
    prepare({ title, author, media }) {
      return { title, subtitle: author ? `by ${author}` : "", media };
    },
  },
});
