import { defineField, defineType } from "sanity";

export default defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  groups: [{ name: "seo", title: "SEO" }],
  fields: [
    // Hero
    defineField({ name: "heroHeadline", title: "Hero Headline", type: "string", description: 'e.g. "Live & Work Legally"' }),
    defineField({ name: "heroSubheadline", title: "Hero Sub-headline (coral)", type: "string", description: 'e.g. "in Spain"' }),
    defineField({ name: "heroBody", title: "Hero Body Text", type: "text", rows: 3 }),
    defineField({
      name: "heroHighlights",
      title: "Hero Checkmark Highlights",
      type: "array",
      of: [{ type: "string" }],
      description: "Short phrases shown with checkmark icons under the headline",
    }),
    defineField({ name: "heroBadgeText", title: "Hero Badge Text", type: "string", description: 'e.g. "Trusted Spain Visa Consultants"' }),

    // How it works
    defineField({
      name: "howItWorksSteps",
      title: "How It Works Steps",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "number", title: "Step Number", type: "string", description: "e.g. 01" }),
            defineField({ name: "title", title: "Step Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "title", subtitle: "number" } },
        },
      ],
    }),

    // Why us
    defineField({
      name: "whyUsPoints",
      title: "Why Choose Us Points",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Point Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
            defineField({
              name: "icon",
              title: "Icon Name",
              type: "string",
              description: "Lucide icon name e.g. Shield, Clock, Users, Globe, FileCheck, HeartHandshake",
            }),
          ],
          preview: { select: { title: "title" } },
        },
      ],
    }),

    // Services Overview (home page cards)
    defineField({
      name: "servicesSection",
      title: "Services Overview Section",
      type: "object",
      fields: [
        defineField({
          name: "dnv",
          title: "Digital Nomad Visa Card",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Card Title", type: "string" }),
            defineField({ name: "subtitle", title: "Card Subtitle", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
            defineField({ name: "features", title: "Feature List", type: "array", of: [{ type: "string" }] }),
          ],
        }),
        defineField({
          name: "nlv",
          title: "Non-Lucrative Visa Card",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Card Title", type: "string" }),
            defineField({ name: "subtitle", title: "Card Subtitle", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
            defineField({ name: "features", title: "Feature List", type: "array", of: [{ type: "string" }] }),
          ],
        }),
      ],
    }),

    // CTA Banner
    defineField({ name: "ctaHeadline", title: "CTA Banner Headline", type: "string" }),
    defineField({ name: "ctaBody", title: "CTA Banner Body Text", type: "text", rows: 2 }),

    // Newsletter
    defineField({ name: "newsletterTitle", title: "Newsletter Section Title", type: "string" }),
    defineField({ name: "newsletterSubtext", title: "Newsletter Subtext", type: "text", rows: 2 }),

    // SEO
    defineField({ name: "seo", title: "SEO", type: "seoObject", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Home Page" }) },
});
