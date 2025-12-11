import type { MetadataRoute } from "next";

const siteUrl =
  (process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_BASE_URL || "http://localhost:3000").replace(
    /\/+$/,
    ""
  );

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
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
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl
  };
}
