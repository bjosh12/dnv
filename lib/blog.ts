import { getPosts, getPost, urlFor } from "@/lib/sanity";
import { fetchArticles, fetchArticleBySlug, type BlogArticleSummary } from "@/lib/babylovegrowth";

export const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=700&q=80";

export type NormalizedPostSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  imageUrl: string;
  publishedAt?: string;
  tags: string[];
  source: "sanity" | "blg";
};

type SanityPostSummary = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
  mainImage?: unknown;
  categories?: string[];
};

function normalizeSanity(post: SanityPostSummary): NormalizedPostSummary {
  let imageUrl = FALLBACK_IMAGE;
  if (post.mainImage) {
    try {
      imageUrl = urlFor(post.mainImage).width(700).height(400).url();
    } catch {
      imageUrl = FALLBACK_IMAGE;
    }
  }
  return {
    id: `sanity-${post._id}`,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    imageUrl,
    publishedAt: post.publishedAt,
    tags: post.categories ?? [],
    source: "sanity",
  };
}

function normalizeBlg(article: BlogArticleSummary): NormalizedPostSummary {
  return {
    id: `blg-${article.id}`,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    imageUrl: article.hero_image_url || FALLBACK_IMAGE,
    publishedAt: article.created_at,
    // article.keywords is BLG's internal SEO keyword-targeting list,
    // not editorial tags — never surface it in the UI.
    tags: [],
    source: "blg",
  };
}

// Merges manually-authored Sanity posts with auto-generated BabyLoveGrowth
// articles into one feed, newest first.
export async function getMergedPosts(preview = false): Promise<NormalizedPostSummary[]> {
  const [sanityPosts, blgArticles] = await Promise.all([
    getPosts(50, preview).catch(() => []) as Promise<SanityPostSummary[]>,
    fetchArticles(50, 0).catch(() => []),
  ]);

  const merged = [
    ...(sanityPosts ?? []).map(normalizeSanity),
    ...(blgArticles ?? []).map(normalizeBlg),
  ];

  return merged.sort((a, b) => {
    const da = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const db = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return db - da;
  });
}

export type ResolvedPost =
  | { source: "sanity"; data: Awaited<ReturnType<typeof getPost>> }
  | { source: "blg"; data: NonNullable<Awaited<ReturnType<typeof fetchArticleBySlug>>> };

// A manually-authored Sanity post with the same slug takes priority over
// a BabyLoveGrowth article, so editors can override auto-generated content.
export async function getPostBySlug(slug: string, preview = false): Promise<ResolvedPost | null> {
  const [sanityPost, blgArticle] = await Promise.all([
    getPost(slug, preview).catch(() => null),
    fetchArticleBySlug(slug).catch(() => null),
  ]);

  if (sanityPost) return { source: "sanity", data: sanityPost };
  if (blgArticle) return { source: "blg", data: blgArticle };
  return null;
}
