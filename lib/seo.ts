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
  type?: "website" | "article";
};

const DEFAULT_OG_IMAGE = `${SITE_URL}/opengraph-image`;

export function buildMetadata(seo: SeoData, defaults: PageDefaults): Metadata {
  const title = seo?.title || defaults.title;
  const description = seo?.description || defaults.description;
  const image = seo?.imageUrl || DEFAULT_OG_IMAGE;
  const url = `${SITE_URL}${defaults.path}`;
  const type = defaults.type ?? "website";

  return {
    // Use absolute to bypass the root layout's title template
    title: { absolute: title },
    description,
    robots: seo?.noIndex ? "noindex,nofollow" : "index,follow",
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    alternates: { canonical: url },
  };
}
