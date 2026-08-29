import type { MetadataRoute } from "next";

/**
 * Keeps the signed-in area out of search results.
 *
 * The middleware already prevents anonymous access, so this is defence in
 * depth: it stops a crawler that follows a leaked link from indexing the path,
 * and keeps restricted categories out of results that a platform reviewer
 * might search.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/wallet",
        "/profile",
        "/airtime",
        "/data",
        "/electricity",
        "/cable",
        "/flights",
        "/betting",
        "/crypto",
        "/giftcards",
      ],
    },
    sitemap: "https://goswaply.com/sitemap.xml",
  };
}
