const BASE_URL = process.env.BABYLOVEGROWTH_API_URL || "https://api.babylovegrowth.ai/api/integrations";
const API_KEY = process.env.BABYLOVEGROWTH_API_KEY;

export type BlogArticleSummary = {
  id: number;
  title: string;
  slug: string;
  hero_image_url?: string;
  languageCode?: string;
  meta_description?: string;
  excerpt?: string;
  orgWebsite?: string;
  created_at: string;
  seedKeyword?: string;
  keywords?: string[];
};

export type BlogArticle = BlogArticleSummary & {
  content_html: string;
  content_markdown: string;
  jsonLd?: Record<string, unknown>;
  faqJsonLd?: Record<string, unknown>;
};

function authHeaders() {
  return { "X-API-Key": API_KEY ?? "", "Content-Type": "application/json" };
}

export async function fetchArticles(limit = 50, offset = 0, fresh = false): Promise<BlogArticleSummary[]> {
  if (!API_KEY) return [];
  const res = await fetch(`${BASE_URL}/v1/articles?limit=${limit}&offset=${offset}`, {
    headers: authHeaders(),
    ...(fresh ? { cache: "no-store" as const } : { next: { revalidate: 300 } }),
  });
  if (!res.ok) return [];
  return res.json();
}

// The list endpoint is the only way to resolve a slug — there's no by-slug lookup.
export async function fetchAllArticles(fresh = false): Promise<BlogArticleSummary[]> {
  const all: BlogArticleSummary[] = [];
  const limit = 50;
  let offset = 0;
  while (true) {
    const page = await fetchArticles(limit, offset, fresh);
    if (page.length === 0) break;
    all.push(...page);
    if (page.length < limit) break;
    offset += limit;
  }
  return all;
}

export async function fetchArticleById(id: number): Promise<BlogArticle | null> {
  if (!API_KEY) return null;
  const res = await fetch(`${BASE_URL}/v1/articles/${id}`, {
    headers: authHeaders(),
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchArticleBySlug(slug: string): Promise<BlogArticle | null> {
  let all = await fetchAllArticles();
  let match = all.find((a) => a.slug === slug);
  if (!match) {
    // Cached list may not include just-published articles yet — retry
    // uncached before concluding the slug doesn't exist.
    all = await fetchAllArticles(true);
    match = all.find((a) => a.slug === slug);
  }
  if (!match) return null;
  return fetchArticleById(match.id);
}
