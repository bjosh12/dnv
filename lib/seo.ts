import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "./constants";

type SeoData = {
  title?: string;
  description?: string;
  imageUrl?: string;
  noIndex?: boolean;
} | null | undefined;

type PageDefaults = {
  title: string;
  description: string;
  path: string;
};

export function buildMetadata(
  seo: SeoData,
  defaults: PageDefaults
): Metadata {
  const title = seo?.title || defaults.title;
  const description = seo?.description || defaults.description;
  const image = seo?.imageUrl;
  const url = `${SITE_URL}${defaults.path}`;

  return {
    title,
    description,
    robots: seo?.noIndex ? "noindex,nofollow" : "index,follow",
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      ...(image && { images: [{ url: image, width: 1200, height: 630 }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image && { images: [image] }),
    },
    alternates: { canonical: url },
  };
}
