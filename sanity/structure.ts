import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Digital Nomad In Spain')
    .items([
      // ── Singletons ──────────────────────────────────────────
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),

      S.listItem()
        .title('Home Page')
        .id('homePage')
        .child(S.document().schemaType('homePage').documentId('homePage')),

      S.listItem()
        .title('About Page')
        .id('aboutPage')
        .child(S.document().schemaType('aboutPage').documentId('aboutPage')),

      S.divider(),

      // ── Services ────────────────────────────────────────────
      S.listItem()
        .title('Service Pages')
        .child(S.documentTypeList('serviceContent').title('Service Pages')),

      S.divider(),

      // ── Repeatable content ──────────────────────────────────
      S.listItem()
        .title('Testimonials')
        .child(S.documentTypeList('testimonial').title('Testimonials')),

      S.listItem()
        .title('Team Members')
        .child(S.documentTypeList('teamMember').title('Team Members')),

      S.listItem()
        .title('FAQ Items')
        .child(S.documentTypeList('faqItem').title('FAQ Items')),

      S.divider(),

      // ── Blog ────────────────────────────────────────────────
      S.listItem()
        .title('Blog Posts')
        .child(S.documentTypeList('post').title('Blog Posts')),

      S.listItem()
        .title('Authors')
        .child(S.documentTypeList('author').title('Authors')),

      S.listItem()
        .title('Categories')
        .child(S.documentTypeList('category').title('Categories')),
    ])
