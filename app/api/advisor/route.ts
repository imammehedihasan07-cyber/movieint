import { NextResponse } from "next/server";

interface MovieKnowledge {
  title: string;
  tmdbId: string;
  year: number;
  director: string;
  genres: string[];
  complexity: number;
  emotionalIntensity: number;
  darkness: number;
  pacing: string;
  endingType: string;
  runtime: string;
  streamingOn: string[];
  dnaScore: number;
  signature: string;
}

const MOVIE_DATABASE: MovieKnowledge[] = [
  {
    title: "Interstellar",
    tmdbId: "157336",
    year: 2014,
    director: "Christopher Nolan",
    genres: ["Sci-Fi", "Drama", "Adventure"],
    complexity: 88,
    emotionalIntensity: 98,
    darkness: 55,
    pacing: "Epic Escalating Odyssey",
    endingType: "Transcendental Paradox Resolution",
    runtime: "169 min",
    streamingOn: ["Prime Video", "Paramount+"],
    dnaScore: 9.6,
    signature: "cosmic space exploration dealing with love time dilation black holes and human survival"
  },
  {
    title: "Arrival",
    tmdbId: "329865",
    year: 2016,
    director: "Denis Villeneuve",
    genres: ["Sci-Fi", "Mystery", "Drama"],
    complexity: 84,
    emotionalIntensity: 96,
    darkness: 65,
    pacing: "Atmospheric Deliberate Build",
    endingType: "Non-Linear Philosophical Revelation",
    runtime: "116 min",
    streamingOn: ["Netflix", "Paramount+"],
    dnaScore: 9.1,
    signature: "linguistic hard sci-fi exploring non-linear time alien communication and profound grief"
  },
  {
    title: "Inception",
    tmdbId: "27205",
    year: 2010,
    director: "Christopher Nolan",
    genres: ["Sci-Fi", "Action", "Heist"],
    complexity: 94,
    emotionalIntensity: 85,
    darkness: 60,
    pacing: "Relentless Synchronized Cadence",
    endingType: "Ambiguous Totem Equilibrium",
    runtime: "148 min",
    streamingOn: ["Prime Video", "Apple TV", "Max"],
    dnaScore: 9.3,
    signature: "subconscious dream heist layered reality intricate mechanics and ambiguous endings"
  },
  {
    title: "Parasite",
    tmdbId: "496243",
    year: 2019,
    director: "Bong Joon-ho",
    genres: ["Thriller", "Drama", "Black Comedy"],
    complexity: 75,
    emotionalIntensity: 92,
    darkness: 89,
    pacing: "Frictionless Escalation Curve",
    endingType: "Tragic Socioeconomic Trap",
    runtime: "132 min",
    streamingOn: ["Max", "Hulu"],
    dnaScore: 9.5,
    signature: "subterranean class struggle escalating from quiet grift into shocking violent twists"
  },
  {
    title: "Se7en",
    tmdbId: "807",
    year: 1995,
    director: "David Fincher",
    genres: ["Crime", "Mystery", "Thriller"],
    complexity: 78,
    emotionalIntensity: 94,
    darkness: 98,
    pacing: "Methodical Procedural Descent",
    endingType: "Devastating Box Climax",
    runtime: "127 min",
    streamingOn: ["Max", "Apple TV"],
    dnaScore: 9.3,
    signature: "bleak dark noir atmospheric psychological thriller high darkness gritty tension deadly sins"
  },
  {
    title: "Whiplash",
    tmdbId: "244786",
    year: 2014,
    director: "Damien Chazelle",
    genres: ["Drama", "Music", "Psychological"],
    complexity: 65,
    emotionalIntensity: 95,
    darkness: 75,
    pacing: "Furious Syncopated Metronome",
    endingType: "Electrifying Ambiguous Climax",
    runtime: "106 min",
    streamingOn: ["Netflix", "Apple TV"],
    dnaScore: 9.4,
    signature: "high-octane intensity fast paced relentless tempo psychological battle and perfection obsession"
  },
  {
    title: "Blade Runner 2049",
    tmdbId: "335984",
    year: 2017,
    director: "Denis Villeneuve",
    genres: ["Sci-Fi", "Mystery", "Drama"],
    complexity: 88,
    emotionalIntensity: 89,
    darkness: 85,
    pacing: "Atmospheric Monolithic Cadence",
    endingType: "Poetic Self-Sacrifice",
    runtime: "164 min",
    streamingOn: ["Max", "Apple TV"],
    dnaScore: 9.3,
    signature: "neon-drenched existential cyberpunk quest artificial consciousness philosophical memory"
  },
  {
    title: "Shutter Island",
    tmdbId: "11324",
    year: 2010,
    director: "Martin Scorsese",
    genres: ["Psychological Thriller", "Mystery"],
    complexity: 82,
    emotionalIntensity: 90,
    darkness: 92,
    pacing: "Claustrophobic Gothic Paranoia",
    endingType: "Existential Moral Self-Surrender",
    runtime: "138 min",
    streamingOn: ["Prime Video", "Paramount+"],
    dnaScore: 8.7,
    signature: "gothic island asylum fever dream shocking twist ending trauma and identity illusion"
  },
  {
    title: "The Prestige",
    tmdbId: "435",
    year: 2006,
    director: "Christopher Nolan",
    genres: ["Drama", "Mystery", "Sci-Fi"],
    complexity: 90,
    emotionalIntensity: 84,
    darkness: 86,
    pacing: "Tightening Spiral Thriller",
    endingType: "Dual-Shock Sacrificial Twist",
    runtime: "130 min",
    streamingOn: ["Apple TV"],
    dnaScore: 9.2,
    signature: "obsessive rivalry magicians sacrifice twist ending puzzle box non-linear structure"
  },
  {
    title: "Memento",
    tmdbId: "77",
    year: 2000,
    director: "Christopher Nolan",
    genres: ["Mystery", "Psychological Thriller"],
    complexity: 96,
    emotionalIntensity: 86,
    darkness: 88,
    pacing: "Reverse-Chronological Dissection",
    endingType: "Devastating Self-Deception Twist",
    runtime: "113 min",
    streamingOn: ["Prime Video", "Tubi"],
    dnaScore: 8.9,
    signature: "reverse-order amnesiac puzzle noir mind-bending psychological dread memory deception"
  },
  {
    title: "Coherence",
    tmdbId: "220289",
    year: 2013,
    director: "James Ward Byrkit",
    genres: ["Sci-Fi", "Mystery", "Thriller"],
    complexity: 82,
    emotionalIntensity: 82,
    darkness: 85,
    pacing: "Spiraling Paranoia Tempo",
    endingType: "Chilling Multi-Timeline Realization",
    runtime: "89 min",
    streamingOn: ["Prime Video", "Tubi"],
    dnaScore: 8.8,
    signature: "parallel dimensions quantum decoherence dinner party paranoia low budget mind-bending"
  },
  {
    title: "Annihilation",
    tmdbId: "300668",
    year: 2018,
    director: "Alex Garland",
    genres: ["Sci-Fi", "Horror", "Mystery"],
    complexity: 78,
    emotionalIntensity: 88,
    darkness: 90,
    pacing: "Hypnotic Unsettling Metronome",
    endingType: "Ambiguous Biological Mutation",
    runtime: "115 min",
    streamingOn: ["Paramount+", "Apple TV"],
    dnaScore: 8.9,
    signature: "cosmic environmental horror alien refraction self-destruction unsettling biological dread"
  }
];

const advisorCache = new Map<string, any>();

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing or invalid prompt parameter" }, { status: 400 });
    }

    const query = prompt.toLowerCase().trim();
    if (advisorCache.has(query)) {
      return NextResponse.json(advisorCache.get(query));
    }

    const tokens = query.split(/[^a-z0-9]+/).filter((t: string) => t.length > 2);

    const scoredMovies = MOVIE_DATABASE.map((movie) => {
      let score = 50;
      const matchReasons: string[] = [];
      const fullSignature = `${movie.title} ${movie.director} ${movie.signature} ${movie.genres.join(" ")} ${movie.pacing} ${movie.endingType}`.toLowerCase();

      tokens.forEach((token: string) => {
        if (fullSignature.includes(token)) {
          score += 12;
        }
      });

      if (query.includes("space") || query.includes("cosmic") || query.includes("star") || query.includes("dilation")) {
        if (movie.signature.includes("space") || movie.title === "Interstellar") score += 30;
      }
      if (query.includes("dark") || query.includes("bleak") || query.includes("gritty")) {
        if (movie.darkness >= 85) {
          score += 22;
          matchReasons.push("High Darkness Index aligns with requested bleak tone");
        }
      }
      if (query.includes("mind-bending") || query.includes("complex") || query.includes("puzzle")) {
        if (movie.complexity >= 80) {
          score += 20;
          matchReasons.push("High Narrative Complexity fits intellectual requirements");
        }
      }
      if (query.includes("fast") || query.includes("octane") || query.includes("intense") || query.includes("tempo")) {
        if (movie.emotionalIntensity >= 90) {
          score += 22;
          matchReasons.push("Extreme emotional & rhythmic intensity");
        }
      }
      if (query.includes("twist") || query.includes("ending")) {
        if (movie.endingType.toLowerCase().includes("twist") || movie.endingType.toLowerCase().includes("revelation")) {
          score += 20;
          matchReasons.push("Matches requested paradigm-shifting plot twist ending");
        }
      }
      if (query.includes("class") || query.includes("social") || query.includes("dread")) {
        if (movie.title === "Parasite") score += 35;
      }

      const matchPercent = Math.min(98, Math.max(72, Math.round(score)));

      const why = matchReasons.length > 0
        ? matchReasons.join(". ") + "."
        : `Matches thematic parameters with a ${movie.pacing.toLowerCase()} and ${movie.endingType.toLowerCase()}.`;

      return {
        ...movie,
        matchPercent,
        whyItMatches: why
      };
    });

    const ranked = scoredMovies
      .sort((a, b) => b.matchPercent - a.matchPercent || b.dnaScore - a.dnaScore)
      .slice(0, 6);

    const apiKey = process.env.TMDB_API_KEY || "b6b9f5e3a64b6ef32e0b8fade33cfe5a";
    const enrichedResults = await Promise.all(
      ranked.map(async (movie) => {
        try {
          const res = await fetch(`https://api.themoviedb.org/3/movie/${movie.tmdbId}?api_key=${apiKey}`, {
            next: { revalidate: 86400 }
          });
          if (res.ok) {
            const data = await res.json();
            return {
              ...movie,
              posterPath: data.poster_path || null
            };
          }
        } catch {
          // Graceful fallback
        }
        return {
          ...movie,
          posterPath: null
        };
      })
    );

    const payload = {
      query: prompt,
      results: enrichedResults
    };

    advisorCache.set(query, payload);

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200"
      }
    });
  } catch {
    return NextResponse.json({ error: "Failed to process telemetry query" }, { status: 500 });
  }
}
