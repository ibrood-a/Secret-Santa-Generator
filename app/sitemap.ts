import type { MetadataRoute } from "next";

const siteUrl =
  (process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_BASE_URL || "http://localhost:3000").replace(
    /\/+$/,
    ""
  );

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${siteUrl}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${siteUrl}/guides/remote-secret-santa`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: `${siteUrl}/guides/secret-santa-email-templates`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7
    }
  ];
}
