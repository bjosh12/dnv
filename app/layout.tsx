import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { SITE_NAME, SITE_TAGLINE, SITE_URL, CONTACT_EMAIL, WHATSAPP_NUMBER, SOCIAL_LINKS } from "@/lib/constants";
import { Analytics } from '@vercel/analytics/next';

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} | Spain Visa Consultants`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Expert guidance for Spain's Digital Nomad Visa and Non-Lucrative Visa. 98% approval rate, end-to-end support, 500+ approved clients.",
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
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-E7LWQS7L08"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-E7LWQS7L08');`,
          }}
        />
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
        <script src="https://analytics.ahrefs.com/analytics.js" data-key="VcseBjHNHrsuMfAGsu3W5w" async></script>
      </head>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
