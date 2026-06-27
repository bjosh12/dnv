import type { NextConfig } from "next";

const securityHeaders = [
  // Replaced X-Frame-Options with CSP frame-ancestors — supports multiple origins
  // Allows: same origin + deployed Sanity Studio (for Presentation tool iframe)
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'self' https://dnv.sanity.studio https://www.digitalnomadinspain.com",
  },
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
