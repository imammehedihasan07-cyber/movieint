import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.movieint.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/couch-mode`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/compare`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/dna`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/rankings`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/methodology`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  try {
    const apiKey = process.env.TMDB_API_KEY;

    const endpoints = [
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&page=1`,
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&page=2`,
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&page=3`,
      `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=1`,
      `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=2`,
      `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=3`,
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&page=1`,
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&page=2`,
    ];

    const responses = await Promise.allSettled(
      endpoints.map((url) =>
        fetch(url, { next: { revalidate: 86400 } }).then((res) => res.json())
      )
    );

    const allMovies: any[] = [];
    responses.forEach((res) => {
      if (res.status === "fulfilled" && res.value?.results) {
        allMovies.push(...res.value.results);
      }
    });

    const uniqueMovieIds = Array.from(
      new Set(allMovies.filter((m) => m && m.id).map((m) => m.id))
    );

    const dynamicMediaRoutes: MetadataRoute.Sitemap = uniqueMovieIds.map((id) => ({
      url: `${baseUrl}/movie/${id}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticRoutes, ...dynamicMediaRoutes];
  } catch {
    return staticRoutes;
  }
}
