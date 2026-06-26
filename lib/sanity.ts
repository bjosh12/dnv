import { createClient } from "@sanity/client";
import { createClient as createSteganClient } from "@sanity/client/stega";
import imageUrlBuilder from "@sanity/image-url";

const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "wllgq317",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
};

export const client = createClient({ ...config, useCdn: true });

// Preview client with stega encoding — invisible metadata in text strings
// enables click-to-edit overlays in the Sanity Presentation tool
export const previewClient = createSteganClient({
  ...config,
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
  perspective: "previewDrafts" as const,
  stega: {
    enabled: true,
    studioUrl: "/studio",
  },
}) as unknown as ReturnType<typeof createClient>;

// Use preview client when draft mode is active
export function getClient(preview = false) {
  return preview ? previewClient : client;
}

const builder = imageUrlBuilder(client);

export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source);
}

// ── Blog ─────────────────────────────────────────────────────────────────────

export async function getPosts(limit = 10, preview = false) {
  return getClient(preview).fetch(
    `*[_type == "post"] | order(publishedAt desc) [0...$limit] {
      _id, title, slug, publishedAt, excerpt, mainImage, "categories": categories[]->title
    }`,
    { limit }
  );
}

export async function getPost(slug: string, preview = false) {
  return getClient(preview).fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      _id, title, slug, publishedAt, excerpt, body, mainImage,
      "categories": categories[]->title,
      "author": author->{ name, image },
      seo { title, description, "imageUrl": image.asset->url, noIndex }
    }`,
    { slug }
  );
}

// ── Singletons ────────────────────────────────────────────────────────────────

export async function getSiteSettings(preview = false) {
  return getClient(preview).fetch(
    `*[_type == "siteSettings"][0] {
      siteName, tagline, contactEmail, whatsappNumber, stats, socialLinks
    }`
  );
}

export async function getHomePage(preview = false) {
  return getClient(preview).fetch(
    `*[_type == "homePage"][0] {
      heroHeadline, heroSubheadline, heroBody, heroHighlights, heroBadgeText,
      howItWorksSteps, whyUsPoints, servicesSection,
      ctaHeadline, ctaBody,
      newsletterTitle, newsletterSubtext,
      seo { title, description, "imageUrl": image.asset->url, noIndex }
    }`
  );
}

export async function getAboutPage(preview = false) {
  return getClient(preview).fetch(
    `*[_type == "aboutPage"][0] {
      stats, story1, story2, story3, values, consultationCovers,
      seo { title, description, "imageUrl": image.asset->url, noIndex }
    }`
  );
}

// ── Repeatable content ────────────────────────────────────────────────────────

export async function getTestimonials(preview = false) {
  return getClient(preview).fetch(
    `*[_type == "testimonial"] | order(order asc) {
      _id, name, country, visa, quote, rating,
      "avatarUrl": avatar.asset->url
    }`
  );
}

export async function getTeamMembers(preview = false) {
  return getClient(preview).fetch(
    `*[_type == "teamMember"] | order(order asc) {
      _id, name, role, bio, country,
      "photoUrl": photo.asset->url
    }`
  );
}

export async function getFaqItems(preview = false) {
  return getClient(preview).fetch(
    `*[_type == "faqItem"] | order(category asc, order asc) {
      _id, question, answer, category
    }`
  );
}

export async function getServiceContent(slug: string, preview = false) {
  return getClient(preview).fetch(
    `*[_type == "serviceContent" && slug == $slug][0] {
      slug, heroHeadline, heroBody,
      requirements, documents, faqs,
      pricingFrom, pricingNote, pricingIncludes,
      quickFacts,
      seo { title, description, "imageUrl": image.asset->url, noIndex }
    }`,
    { slug }
  );
}
