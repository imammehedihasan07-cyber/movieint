// app/sitemap.ts
import { MetadataRoute } from "next";
import { getAllEditorialSlugs } from "@/lib/editorial-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.movieint.com";
  const now = new Date();

  // Exact 10 genres configured in GENRE_MAP
  const genreSlugs = [
    "thriller",
    "sci-fi",
    "action",
    "drama",
    "horror",
    "mystery",
    "crime",
    "animation",
    "romance",
    "comedy",
  ];

  // 1. Exact static & feature routes implemented in the app
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/advisor`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/search`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/editorial`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/couch-mode`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/vs`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/dna`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/roulette`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/rankings`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/watchlist`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/methodology`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy-policy`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/disclaimer`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    // Verified curated editorial hubs
    { url: `${baseUrl}/best/mind-bending-movies`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/best/slow-burn-thrillers`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/best/high-octane-action`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/best/deep-concept-sci-fi`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  // 2. Genre routes
  const genreRoutes: MetadataRoute.Sitemap = genreSlugs.map((slug) => ({
    url: `${baseUrl}/genre/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // 3. Dynamic Editorial Guides routes (/editorial/[slug])
  let editorialRoutes: MetadataRoute.Sitemap = [];
  try {
    const slugs = getAllEditorialSlugs();
    editorialRoutes = slugs.map((slug) => ({
      url: `${baseUrl}/editorial/${slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    }));
  } catch (err) {
    console.error("Editorial slugs extraction fallback:", err);
  }

  try {
    const apiKey = process.env.TMDB_API_KEY || "b6b9f5e3a64b6ef32e0b8fade33cfe5a";

    // Media & Person Endpoints
    const endpoints = [
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&page=1`,
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&page=2`,
      `https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}&page=1`,
      `https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}&page=2`,
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&page=1`,
      `https://api.themoviedb.org/3/person/popular?api_key=${apiKey}&page=1`,
    ];

    const responses = await Promise.allSettled(
      endpoints.map((url) =>
        fetch(url, { next: { revalidate: 86400 } }).then((res) => {
          if (!res.ok) throw new Error("TMDB fetch failed");
          return res.json();
        })
      )
    );

    const allMedia: any[] = [];
    const allPersons: any[] = [];

    responses.forEach((res, index) => {
      if (res.status === "fulfilled" && res.value?.results) {
        if (index === 5) {
          allPersons.push(...res.value.results);
        } else {
          allMedia.push(...res.value.results);
        }
      }
    });

    // Data Hygiene: Only index items with valid visual posters and ratings
    const cleanMedia = allMedia.filter(
      (m) => m && m.id && (m.poster_path || m.backdrop_path) && m.vote_average > 0
    );

    const uniqueMediaIds = Array.from(new Set(cleanMedia.map((m) => m.id)));

    // Dynamic Media Routes: /movie/[id]
    const dynamicMediaRoutes: MetadataRoute.Sitemap = uniqueMediaIds.map((id) => ({
      url: `${baseUrl}/movie/${id}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    // Affinity Routes: /movies-like/[id]
    const moviesLikeRoutes: MetadataRoute.Sitemap = uniqueMediaIds.slice(0, 40).map((id) => ({
      url: `${baseUrl}/movies-like/${id}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    // Cast / Personnel Routes: /person/[id]
    const cleanPersons = allPersons.filter((p) => p && p.id && p.profile_path);
    const uniquePersonIds = Array.from(new Set(cleanPersons.map((p) => p.id)));

    const personRoutes: MetadataRoute.Sitemap = uniquePersonIds.slice(0, 30).map((id) => ({
      url: `${baseUrl}/person/${id}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

    return [
      ...staticRoutes,
      ...genreRoutes,
      ...editorialRoutes,
      ...dynamicMediaRoutes,
      ...moviesLikeRoutes,
      ...personRoutes,
    ];
  } catch (e) {
    console.error("Sitemap generation fallback triggered:", e);
    return [...staticRoutes, ...genreRoutes, ...editorialRoutes];
  }
}
