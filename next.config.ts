import type { NextConfig } from "next";

const securityHeaders = [
  // Note: X-Frame-Options / frame-ancestors intentionally omitted
  // Sanity Presentation tool requires the site to be embeddable in iframes
  // from sanity.io/sanity.studio domains — frame-ancestors breaks this.
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
