import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://movieint.vercel.app"; // অথবা আপনার লাইভ ডোমেইন

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/couch-mode`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/compare`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/dna`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/rankings`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];

  // Dynamically fetch top 40 worldwide trending titles (movies & series) for instant Google indexing
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.TMDB_API_KEY || "b6b9f5e3a64b6ef32e0b8fade33cfe5a"}&page=1`,
      { next: { revalidate: 86400 } }
    );
    const data = await res.json();
    const dynamicMediaRoutes: MetadataRoute.Sitemap = (data.results || [])
      .filter((m: any) => m.id)
      .map((item: any) => ({
        url: `${baseUrl}/movie/${item.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      }));

    return [...staticRoutes, ...dynamicMediaRoutes];
  } catch {
    return staticRoutes;
  }
}