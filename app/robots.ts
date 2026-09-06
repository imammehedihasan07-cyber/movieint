import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.movieint.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/search$", // Allows the clean /search discovery landing page
        ],
        disallow: [
          "/api/",
          "/search?*", // Blocks infinite query URLs from consuming crawl budget
          "/watchlist",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: [
          "/",
          "/search$",
        ],
        disallow: [
          "/api/",
          "/search?*",
          "/watchlist",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
