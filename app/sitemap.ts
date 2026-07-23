import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getAllSiteUrls } from "@/lib/site-urls";

// Regenerate the sitemap at most once per hour, so posts published in
// Sanity or BabyLoveGrowth appear without a redeploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await getAllSiteUrls();

  return entries.map((entry) => ({
    url: entry.url,
    lastModified: entry.lastModified,
    changeFrequency: "weekly",
    priority: entry.url === SITE_URL ? 1 : 0.7,
  }));
}
