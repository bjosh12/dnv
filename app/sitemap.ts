import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getAllSiteUrls } from "@/lib/site-urls";

// This route's own `revalidate` window was observed staying stale for
// days in production (far past 3600s) while ordinary ISR pages revalidated
// fine, so render it on every request instead and rely on the underlying
// fetch-level caching (lib/site-urls.ts, lib/babylovegrowth.ts) for freshness.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await getAllSiteUrls();

  return entries.map((entry) => ({
    url: entry.url,
    lastModified: entry.lastModified,
    changeFrequency: "weekly",
    priority: entry.url === SITE_URL ? 1 : 0.7,
  }));
}
