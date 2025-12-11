/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_BASE_URL || "http://localhost:3000",
  generateRobotsTxt: true,
  changefreq: "weekly",
  priority: 0.7,
  exclude: [
    "/api/*",
    "/dashboard",
    "/game/*",
    "/play/*",
    "/login",
    "/signup",
    "/reset-password",
    "/forgot-password",
    "/forgot-username",
    "/verify"
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/api",
          "/api/*",
          "/dashboard",
          "/game",
          "/game/*",
          "/play",
          "/play/*",
          "/login",
          "/reset-password",
          "/forgot-password",
          "/forgot-username",
          "/verify"
        ]
      }
    ]
  }
};
