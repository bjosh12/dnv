/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://www.digitalnomadinspain.com",
  generateRobotsTxt: true,
  changefreq: "weekly",
  priority: 0.7,
  exclude: [
    "/studio",
    "/studio/*",
    "/api/*",
    "/privacy",
    "/terms",
    "/icon.svg",        // SVG asset — not a page
    "/opengraph-image", // OG image route — not a page
  ],
  // Fetch live blog post slugs from Sanity to include in sitemap
  additionalPaths: async (config) => {
    const staticPaths = await Promise.all([
      config.transform(config, "/"),
      config.transform(config, "/services/digital-nomad-visa"),
      config.transform(config, "/services/non-lucrative-visa"),
      config.transform(config, "/eligibility"),
      config.transform(config, "/book"),
      config.transform(config, "/blog"),
      config.transform(config, "/about"),
      config.transform(config, "/faq"),
      config.transform(config, "/contact"),
    ]);

    // Fetch published blog post slugs from Sanity CDN
    let blogPaths = [];
    try {
      const query = encodeURIComponent('*[_type == "post" && defined(slug.current)] { "slug": slug.current, publishedAt }');
      const res = await fetch(
        `https://wllgq317.api.sanity.io/v2024-01-01/data/query/production?query=${query}`,
        { next: { revalidate: 0 } }
      );
      const data = await res.json();
      blogPaths = await Promise.all(
        (data.result ?? []).map((post) =>
          config.transform(config, `/blog/${post.slug}`)
        )
      );
    } catch (e) {
      console.warn("[next-sitemap] Could not fetch blog posts from Sanity:", e.message);
    }

    return [...staticPaths, ...blogPaths];
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio", "/api"],
      },
    ],
  },
};
