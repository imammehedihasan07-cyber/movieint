import { MetadataRoute } from "next";
import { getAllEditorialSlugs } from "@/lib/editorial-data";
import { INTENT_FILTERS } from "@/config/intentFilters";
import { POPULAR_PAIRS } from "@/app/compare/[pair]/page";

export const revalidate = 86400; // 24 hours ISR

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.movieint.com";
  const now = new Date();

  // 1. Core Feature Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/advisor`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/search`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/editorial`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/rankings`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/compare`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/couch-mode`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/vs`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/dna`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/roulette`, lastModified: now, changeFrequency: "weekly", priority: 0.75 },
    { url: `${baseUrl}/lists`, lastModified: now, changeFrequency: "weekly", priority: 0.75 },
    { url: `${baseUrl}/watchlist`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/methodology`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy-policy`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/disclaimer`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  // 2. High-Intent Rankings Hub Routes (/rankings/[category])
  const rankingCategories = [
    "best-movies-2026",
    "best-anime",
    "best-thrillers",
    "best-k-dramas",
    "best-netflix-movies",
  ];

  const rankingRoutes: MetadataRoute.Sitemap = rankingCategories.map((cat) => ({
    url: `${baseUrl}/rankings/${cat}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // 3. Programmatic Compare Head-to-Head Routes (/compare/[pair])
  const compareRoutes: MetadataRoute.Sitemap = Object.keys(POPULAR_PAIRS || {}).map((pair) => ({
    url: `${baseUrl}/compare/${pair}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // 4. Search Intent Routes (/best/[category])
  const intentRoutes: MetadataRoute.Sitemap = Object.keys(INTENT_FILTERS || {}).map((key) => ({
    url: `${baseUrl}/best/${key}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // 5. Supported Core Genres
  const genreSlugs = [
    "thriller", "sci-fi", "action", "drama", "horror",
    "mystery", "crime", "animation", "romance", "comedy",
  ];

  const genreRoutes: MetadataRoute.Sitemap = genreSlugs.map((slug) => ({
    url: `${baseUrl}/genre/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // 6. Curated Editorial Guides
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

  // 7. Dynamic Media & Cast Extraction
  try {
    const apiKey = process.env.TMDB_API_KEY || "b6b9f5e3a64b6ef32e0b8fade33cfe5a";

    const endpoints = [
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&page=1`,
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&page=2`,
      `https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}&page=1`,
      `https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}&page=2`,
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&page=1`,
      `https://api.themoviedb.org/3/tv/top_rated?api_key=${apiKey}&page=1`,
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

    const cleanMediaList: { routeId: string }[] = [];
    const allPersons: any[] = [];

    responses.forEach((res, index) => {
      if (res.status === "fulfilled" && res.value?.results) {
        if (index === 6) {
          allPersons.push(...res.value.results);
        } else {
          const isTvSource = index === 2 || index === 3 || index === 5;
          res.value.results.forEach((item: any) => {
            if (item && item.id && (item.poster_path || item.backdrop_path)) {
              const routeId = isTvSource ? `tv-${item.id}` : String(item.id);
              cleanMediaList.push({ routeId });
            }
          });
        }
      }
    });

    const uniqueRouteIds = Array.from(new Set(cleanMediaList.map((m) => m.routeId)));

    const dynamicMediaRoutes: MetadataRoute.Sitemap = uniqueRouteIds.map((routeId) => ({
      url: `${baseUrl}/movie/${routeId}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const moviesLikeRoutes: MetadataRoute.Sitemap = uniqueRouteIds.slice(0, 60).map((routeId) => ({
      url: `${baseUrl}/movies-like/${routeId}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    }));

    const cleanPersons = allPersons.filter((p) => p && p.id && p.profile_path);
    const uniquePersonIds = Array.from(new Set(cleanPersons.map((p) => p.id)));

    const personRoutes: MetadataRoute.Sitemap = uniquePersonIds.slice(0, 40).map((id) => ({
      url: `${baseUrl}/person/${id}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

    return [
      ...staticRoutes,
      ...rankingRoutes,
      ...compareRoutes,
      ...intentRoutes,
      ...genreRoutes,
      ...editorialRoutes,
      ...dynamicMediaRoutes,
      ...moviesLikeRoutes,
      ...personRoutes,
    ];
  } catch (e) {
    console.error("Sitemap generation fallback triggered:", e);
    return [...staticRoutes, ...rankingRoutes, ...compareRoutes, ...intentRoutes, ...genreRoutes, ...editorialRoutes];
  }
}
