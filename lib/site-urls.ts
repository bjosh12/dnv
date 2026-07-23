import { SITE_URL } from "@/lib/constants";
import { fetchAllArticles } from "@/lib/babylovegrowth";

const STATIC_PATHS = [
  "/",
  "/services",
  "/services/digital-nomad-visa",
  "/services/non-lucrative-visa",
  "/eligibility",
  "/book",
  "/blog",
  "/about",
  "/faq",
  "/contact",
];

type SanitySlug = { slug: string; publishedAt?: string };

// Direct HTTP query instead of the @sanity/client instance: an explicit
// `next.revalidate` on fetch keeps this cacheable, whereas the client's
// uncached transport would force callers dynamic on every request.
async function fetchSanitySlugs(): Promise<SanitySlug[]> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "wllgq317";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const query = encodeURIComponent(
    '*[_type == "post" && defined(slug.current) && seo.noIndex != true] { "slug": slug.current, publishedAt }'
  );
  try {
    const res = await fetch(
      `https://${projectId}.apicdn.sanity.io/v2024-01-01/data/query/${dataset}?query=${query}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.result ?? [];
  } catch {
    return [];
  }
}

export type SiteUrlEntry = { url: string; lastModified?: Date };

// Shared by the sitemap and the IndexNow submit route, so both always agree
// on the full set of indexable URLs.
export async function getAllSiteUrls(): Promise<SiteUrlEntry[]> {
  const [sanityPosts, blgArticles] = await Promise.all([
    fetchSanitySlugs(),
    fetchAllArticles().catch(() => []),
  ]);

  // A Sanity post with the same slug overrides the BabyLoveGrowth article
  // (mirrors getPostBySlug), so insert BLG first and let Sanity overwrite.
  const posts = new Map<string, string | undefined>();
  for (const article of blgArticles) {
    if (article.slug) posts.set(article.slug, article.created_at);
  }
  for (const post of sanityPosts) {
    if (post.slug) posts.set(post.slug, post.publishedAt);
  }

  const staticEntries: SiteUrlEntry[] = STATIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
  }));

  const blogEntries: SiteUrlEntry[] = [...posts.entries()].map(
    ([slug, publishedAt]) => ({
      url: `${SITE_URL}/blog/${slug}`,
      lastModified: publishedAt ? new Date(publishedAt) : undefined,
    })
  );

  return [...staticEntries, ...blogEntries];
}
