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
  ],
  additionalPaths: async (config) => [
    await config.transform(config, "/"),
    await config.transform(config, "/services/digital-nomad-visa"),
    await config.transform(config, "/services/non-lucrative-visa"),
    await config.transform(config, "/eligibility"),
    await config.transform(config, "/book"),
    await config.transform(config, "/blog"),
    await config.transform(config, "/about"),
    await config.transform(config, "/faq"),
    await config.transform(config, "/contact"),
  ],
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
