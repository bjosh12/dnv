import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/constants";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

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
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Spain Visa Consultants`,
    description: SITE_TAGLINE,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} scroll-smooth`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
