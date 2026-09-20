import { MetadataRoute } from "next";
import { getAllEditorialSlugs } from "@/lib/editorial-data";
import { INTENT_FILTERS } from "@/config/intentFilters";

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rawBase = process.env.NEXT_PUBLIC_SITE_URL || "https://www.movieint.com";
  // 1. Normalize baseUrl to strip trailing slash
  const baseUrl = rawBase.replace(/\/+$/, "");
  
  const staticBuildDate = new Date("2026-03-01T00:00:00.000Z");
  const weeklyUpdateDate = new Date("2026-09-15T00:00:00.000Z");
  const recentEditorialDate = new Date("2026-09-18T00:00:00.000Z");

  // Core Static Hubs
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: recentEditorialDate, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/advisor`, lastModified: weeklyUpdateDate, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/search`, lastModified: weeklyUpdateDate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/editorial`, lastModified: recentEditorialDate, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/rankings`, lastModified: recentEditorialDate, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/ending-explained`, lastModified: weeklyUpdateDate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/compare`, lastModified: weeklyUpdateDate, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/couch-mode`, lastModified: weeklyUpdateDate, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/vs`, lastModified: weeklyUpdateDate, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/dna`, lastModified: weeklyUpdateDate, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/roulette`, lastModified: weeklyUpdateDate, changeFrequency: "weekly", priority: 0.75 },
    { url: `${baseUrl}/lists`, lastModified: weeklyUpdateDate, changeFrequency: "weekly", priority: 0.75 },
    { url: `${baseUrl}/watchlist`, lastModified: staticBuildDate, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/methodology`, lastModified: weeklyUpdateDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: staticBuildDate, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: staticBuildDate, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy-policy`, lastModified: staticBuildDate, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: staticBuildDate, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/disclaimer`, lastModified: staticBuildDate, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Curated Ranking Categories
  const rankingCategories = [
    "best-movies-2026",
    "best-anime",
    "best-thrillers",
    "best-k-dramas",
    "best-netflix-movies",
  ];
  const rankingRoutes: MetadataRoute.Sitemap = rankingCategories.map((cat) => ({
    url: `${baseUrl}/rankings/${cat}`,
    lastModified: weeklyUpdateDate,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Decoupled Popular Comparison Pairs (Zero circular dependency)
  const popularComparePairs = [
    "oppenheimer-vs-interstellar",
    "inception-vs-shutter-island",
    "the-dark-knight-vs-fight-club",
    "parasite-vs-whiplash",
    "blade-runner-2049-vs-matrix",
    "arrival-vs-interstellar",
    "se7en-vs-zodiac"
  ];
  const compareRoutes: MetadataRoute.Sitemap = popularComparePairs.map((pair) => ({
    url: `${baseUrl}/compare/${pair}`,
    lastModified: weeklyUpdateDate,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // Intent Silos
  const intentRoutes: MetadataRoute.Sitemap = Object.keys(INTENT_FILTERS || {}).map((key) => ({
    url: `${baseUrl}/best/${key}`,
    lastModified: weeklyUpdateDate,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // Genre Hubs
  const genreSlugs = [
    "thriller", "sci-fi", "action", "drama", "horror",
    "mystery", "crime", "animation", "romance", "comedy",
    "adventure", "fantasy", "documentary", "family"
  ];
  const genreRoutes: MetadataRoute.Sitemap = genreSlugs.map((slug) => ({
    url: `${baseUrl}/genre/${slug}`,
    lastModified: weeklyUpdateDate,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Editorial Longform Articles
  let editorialRoutes: MetadataRoute.Sitemap = [];
  try {
    const slugs = getAllEditorialSlugs();
    editorialRoutes = slugs.map((slug) => ({
      url: `${baseUrl}/editorial/${slug}`,
      lastModified: recentEditorialDate,
      changeFrequency: "weekly",
      priority: 0.85,
    }));
  } catch (err) {
    console.error("Editorial slugs extraction fallback:", err);
  }

  // Verified High-Value Numeric Movie IDs (Pure Movies, No TV prefixes)
  const verifiedMovieIds = [
    "27205",   // Inception
    "157336",  // Interstellar
    "496243",  // Parasite
    "77",      // Memento
    "11324",   // Shutter Island
    "807",     // Se7en
    "329865",  // Arrival
    "550",     // Fight Club
    "155",     // The Dark Knight
    "244786",  // Whiplash
    "603",     // The Matrix
    "335984",  // Blade Runner 2049
    "680",     // Pulp Fiction
    "13",      // Forrest Gump
    "122",     // The Lord of the Rings: The Return of the King
    "1891",    // The Empire Strikes Back
    "278",     // The Shawshank Redemption
    "238",     // The Godfather
    "424",     // Schindler's List
    "120",     // LOTR: Fellowship of the Ring
    "121",     // LOTR: The Two Towers
    "299536",  // Avengers: Infinity War
    "299534",  // Avengers: Endgame
    "19995",   // Avatar
    "76600",   // Avatar: The Way of Water
    "597",     // Titanic
    "105",     // Back to the Future
    "671",     // Harry Potter 1
    "672",     // Harry Potter 2
    "673",     // Harry Potter 3
    "1949",    // Zodiac
    "1124",    // The Prestige
    "114",     // Pretty Woman
    "935",     // Dr. Strangelove
    "593",     // The Silence of the Lambs
    "475557",  // Joker
    "37799",   // The Social Network
    "146233",  // Prisoners
    "745",     // The Sixth Sense
    "1422",    // The Departed
    "399055",  // The Shape of Water
    "429",     // The Good, the Bad and the Ugly
    "510",     // One Flew Over the Cuckoo's Nest
    "497",     // The Green Mile
    "423",     // The Pianist
    "280",     // Terminator 2
    "98",      // Gladiator
    "629",     // The Usual Suspects
    "8587",    // The Lion King
    "4935",    // Howl's Moving Castle
    "2501",    // Princess Mononoke
    "101",     // Léon: The Professional
    "111",     // Scarface
    "637",     // Life Is Beautiful
    "872585",  // Oppenheimer
    "693134",  // Dune: Part Two
    "569094",  // Spider-Man: Across the Spider-Verse
    "414906",  // The Batman
    "385687",  // Fast X
    "438631"   // Dune (2021)
  ];

  // Specific high-intent films that genuinely have ending breakdowns
  const verifiedEndingExplainedIds = [
    "27205",   // Inception (Spinning top)
    "77",      // Memento (Timeline reverse)
    "11324",   // Shutter Island (Lighthouse mystery)
    "157336",  // Interstellar (Tesseract / 5D)
    "496243",  // Parasite (Basement fate)
    "550",     // Fight Club (Tyler Durden revelation)
    "329865",  // Arrival (Non-linear time weapon)
    "745",     // The Sixth Sense (Malcolm twist)
    "629",     // The Usual Suspects (Keyser Söze)
    "1124",    // The Prestige (Clones vs double)
    "807",     // Se7en (Box contents / climax)
    "1949",    // Zodiac (Cipher conclusion)
    "335984",  // Blade Runner 2049 (K's identity)
    "603"      // The Matrix (Neo's choice)
  ];

  const dynamicMovieRoutes: MetadataRoute.Sitemap = verifiedMovieIds.map((id) => ({
    url: `${baseUrl}/movie/${id}`,
    lastModified: weeklyUpdateDate,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const moviesLikeRoutes: MetadataRoute.Sitemap = verifiedMovieIds.map((id) => ({
    url: `${baseUrl}/movies-like/${id}`,
    lastModified: weeklyUpdateDate,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  const endingExplainedRoutes: MetadataRoute.Sitemap = verifiedEndingExplainedIds.map((id) => ({
    url: `${baseUrl}/ending-explained/${id}`,
    lastModified: weeklyUpdateDate,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [
    ...staticRoutes,
    ...rankingRoutes,
    ...compareRoutes,
    ...intentRoutes,
    ...genreRoutes,
    ...editorialRoutes,
    ...dynamicMovieRoutes,
    ...moviesLikeRoutes,
    ...endingExplainedRoutes,
  ];
}
