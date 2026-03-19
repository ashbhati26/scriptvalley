import type { MetadataRoute } from "next";

const SITE_URL = "https://scriptvalley.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow:     "/",
        disallow: [
          "/sign-in",
          "/sign-up",
          "/api/",
          "/_next/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}