import { MetadataRoute } from "next";
import { getAllEditorialSlugs } from "@/lib/editorial-data";
import { INTENT_FILTERS } from "@/config/intentFilters";

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rawBase = process.env.NEXT_PUBLIC_SITE_URL || "https://www.movieint.com";
  const baseUrl = rawBase.replace(/\/+$/, "");

  const staticBuildDate = new Date("2026-03-01T00:00:00.000Z");
  const weeklyUpdateDate = new Date("2026-09-15T00:00:00.000Z");
  const recentEditorialDate = new Date("2026-09-18T00:00:00.000Z");

  // 1. Core Static Hubs (19 URLs)
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

  // 2. Curated Ranking Categories
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

  // 3. Compare Hub Pairs
  const popularComparePairs = [
    "oppenheimer-vs-interstellar",
    "inception-vs-shutter-island",
    "the-dark-knight-vs-fight-club",
    "parasite-vs-whiplash",
    "blade-runner-2049-vs-matrix",
    "arrival-vs-interstellar",
    "se7en-vs-zodiac",
    "heat-vs-the-dark-knight",
    "alien-vs-the-thing",
    "goodfellas-vs-godfather"
  ];
  const compareRoutes: MetadataRoute.Sitemap = popularComparePairs.map((pair) => ({
    url: `${baseUrl}/compare/${pair}`,
    lastModified: weeklyUpdateDate,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // 4. Intent Silos
  const intentRoutes: MetadataRoute.Sitemap = Object.keys(INTENT_FILTERS || {}).map((key) => ({
    url: `${baseUrl}/best/${key}`,
    lastModified: weeklyUpdateDate,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // 5. Genre Hubs
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

  // 6. Editorial Guides
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

  // 7. Verified High-Value Numeric Movie IDs (130 Films -> 260 URLs across /movie & /movies-like)
  const verifiedMovieIds = [
    // Modern Sci-Fi & Mind-Benders
    "27205", "157336", "496243", "77", "11324", "807", "329865", "550", "155", "244786",
    "603", "335984", "680", "13", "122", "1891", "278", "238", "424", "120",
    "121", "299536", "299534", "19995", "76600", "597", "105", "671", "672", "673",
    // Masterclass Thrillers & Dramas
    "1949", "1124", "114", "935", "593", "475557", "37799", "146233", "745", "1422",
    "399055", "429", "510", "497", "423", "280", "98", "629", "8587", "4935",
    "2501", "101", "111", "637", "872585", "693134", "569094", "414906", "385687", "438631",
    // Expanded Elite Cinema & Cult Favorites
    "348", // Alien
    "1091", // The Thing
    "948", // Halloween
    "694", // The Shining
    "812", // Aladdin
    "12444", // Harry Potter 7.1
    "12445", // Harry Potter 7.2
    "490132", // Green Book
    "372058", // Your Name
    "493922", // Hereditary
    "530915", // 1917
    "635302", // Demon Slayer: Mugen Train
    "508442", // Soul
    "508947", // Turning Red
    "508943", // Luca
    "337404", // Cruella
    "181808", // Star Wars: The Last Jedi
    "284054", // Black Panther
    "284053", // Thor: Ragnarok
    "361743", // Top Gun: Maverick
    "447365", // Guardians of the Galaxy Vol. 3
    "616037", // Thor: Love and Thunder
    "76341", // Mad Max: Fury Road
    "24", // Kill Bill: Vol. 1
    "393", // Kill Bill: Vol. 2
    "18", // The Fifth Element
    "68718", // Django Unchained
    "46648", // True Grit
    "82690", // Wreck-It Ralph
    "10193", // Toy Story 3
    "862", // Toy Story
    "12", // Finding Nemo
    "585", // Monsters, Inc.
    "920", // Cars
    "150540", // Inside Out
    "10681", // WALL·E
    "14160", // Up
    "2062", // Ratatouille
    "9552", // The Exorcist
    "764", // The Texas Chain Saw Massacre
    "578", // Jaws
    "562", // Die Hard
    "137113", // Edge of Tomorrow
    "264660", // Ex Machina
    "135397", // Jurassic World
    "329", // Jurassic Park
    "601", // E.T. the Extra-Terrestrial
    "89", // Indiana Jones: Raiders of the Lost Ark
    "330", // The Lost World: Jurassic Park
    "285", // Pirates of the Caribbean: At World's End
    "22", // Pirates of the Caribbean: The Curse of the Black Pearl
    "58", // Pirates of the Caribbean: Dead Man's Chest
    "168259", // Furious 7
    "245891", // John Wick
    "341013", // John Wick: Chapter 2
    "458156", // John Wick: Chapter 3 - Parabellum
    "603692", // John Wick: Chapter 4
    "315162", // Puss in Boots: The Last Wish
    "502356", // The Super Mario Bros. Movie
    "346698", // Barbie
    "507089", // Five Nights at Freddy's
    "792307", // Poor Things
    "915935", // Anatomy of a Fall
    "467244", // The Zone of Interest
    "695721", // The Hunger Games: The Ballad of Songbirds & Snakes
    "365177", // The Martian
    "274", // The Silence of the Lambs (archive duplicate fallback key)
    "185", // A Clockwork Orange
    "78", // Blade Runner
    "11216" // Cinema Paradiso
  ];

  const uniqueMovieIds = Array.from(new Set(verifiedMovieIds));

  // 8. Verified Notable Directors & Actors (50 Legendary Person Profiles)
  const verifiedPersonIds = [
    // Iconic Directors
    "525", // Christopher Nolan
    "1032", // Martin Scorsese
    "138", // Quentin Tarantino
    "488", // Steven Spielberg
    "7467", // David Fincher
    "21684", // Denis Villeneuve
    "240", // Stanley Kubrick
    "1", // George Lucas
    "2710", // James Cameron
    "1776", // Alfred Hitchcock
    "608", // Ridley Scott
    "5655", // Wes Anderson
    "6008", // Guillermo del Toro
    "11401", // Hayao Miyazaki
    "2034", // David Lynch
    "2163", // Bong Joon-ho
    "578", // Peter Jackson
    "500", // Tom Cruise
    // Renowned Actors
    "6193", // Leonardo DiCaprio
    "287", // Brad Pitt
    "31", // Tom Hanks
    "3895", // Robert De Niro
    "1158", // Al Pacino
    "192", // Morgan Freeman
    "3223", // Robert Downey Jr.
    "1283", // Christian Bale
    "2232", // Michael Caine
    "139", // Uma Thurman
    "1245", // Scarlett Johansson
    "1892", // Matt Damon
    "1204", // Julia Roberts
    "5064", // Meryl Streep
    "204", // Kate Winslet
    "18277", // Sandra Bullock
    "73421", // Joaquin Phoenix
    "85", // Johnny Depp
    "41312", // Mark Ruffalo
    "74568", // Chris Hemsworth
    "16828", // Chris Evans
    "73964", // Cillian Murphy
    "974169", // Florence Pugh
    "1373737", // Timothée Chalamet
    "505710", // Zendaya
    "10990", // Emma Stone
    "224513", // Ana de Armas
    "18918", // Dwayne Johnson
    "6384", // Keanu Reeves
    "1327", // Ian McKellen
    "48", // Sean Connery
    "3896" // Liam Neeson
  ];

  // Specific Films with Narrative Climax / Twist Breakdowns (15 URLs)
  const verifiedEndingExplainedIds = [
    "27205", // Inception
    "77", // Memento
    "11324", // Shutter Island
    "157336", // Interstellar
    "496243", // Parasite
    "550", // Fight Club
    "329865", // Arrival
    "745", // The Sixth Sense
    "629", // The Usual Suspects
    "1124", // The Prestige
    "807", // Se7en
    "1949", // Zodiac
    "335984", // Blade Runner 2049
    "603", // The Matrix
    "264660" // Ex Machina
  ];

  const dynamicMovieRoutes: MetadataRoute.Sitemap = uniqueMovieIds.map((id) => ({
    url: `${baseUrl}/movie/${id}`,
    lastModified: weeklyUpdateDate,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const moviesLikeRoutes: MetadataRoute.Sitemap = uniqueMovieIds.map((id) => ({
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

  const personRoutes: MetadataRoute.Sitemap = verifiedPersonIds.map((id) => ({
    url: `${baseUrl}/person/${id}`,
    lastModified: staticBuildDate,
    changeFrequency: "monthly",
    priority: 0.7,
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
    ...personRoutes,
  ];
}
