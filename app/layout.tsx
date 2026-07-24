import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SITE_NAME, SITE_TAGLINE, SITE_URL, CONTACT_EMAIL, WHATSAPP_NUMBER, SOCIAL_LINKS } from "@/lib/constants";
import { Analytics } from '@vercel/analytics/next';
import { GoogleAnalytics } from "@next/third-parties/google";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} | Spain Visa Consultants`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Get your Spain Digital Nomad Visa approved with expert help. 98% approval rate, 500+ clients, end-to-end support. Book your free consultation today.",
  keywords: [
    "digital nomad visa spain",
    "spain non-lucrative visa",
    "spain visa consultant",
    "spain residency visa",
    "DNV spain",
    "move to spain",
    "expat spain visa",
  ],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Spain Visa Consultants`,
    description: SITE_TAGLINE,
    images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Spain Visa Consultants`,
    description: SITE_TAGLINE,
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: SITE_NAME,
  url: SITE_URL,
  telephone: `+${WHATSAPP_NUMBER}`,
  email: CONTACT_EMAIL,
  description: SITE_TAGLINE,
  areaServed: "Worldwide",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Spain Visa Consulting Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Digital Nomad Visa Consulting",
          url: `${SITE_URL}/services/digital-nomad-visa`,
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Non-Lucrative Visa Consulting",
          url: `${SITE_URL}/services/non-lucrative-visa`,
        },
      },
    ],
  },
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/icon.svg`,
    width: 512,
    height: 512,
  },
  sameAs: Object.values(SOCIAL_LINKS),
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/blog?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} scroll-smooth`}>
      <head>
        {/* Preconnect to third-party image CDNs for faster LCP */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="preconnect" href="https://wllgq317.api.sanity.io" />
        {/* Organization + WebSite structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="antialiased">
        {children}
        <Analytics />
        {/* lazyOnload defers this off the critical rendering path — it was
            previously a raw <script async> competing with hydration for
            main-thread time and delaying mobile LCP (measured via PageSpeed
            Insights: ~2.3s of the ~5.8s mobile LCP was render delay). */}
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="VcseBjHNHrsuMfAGsu3W5w"
          strategy="lazyOnload"
        />
      </body>
      <GoogleAnalytics gaId="G-E7LWQS7L08" />
    </html>
  );
}
