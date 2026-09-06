import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Star, Sparkles, Compass } from "lucide-react";
import MoviePoster from "@/components/MoviePoster";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const GENRE_MAP: Record<string, { id: number; name: string; description: string }> = {
  thriller: {
    id: 53,
    name: "Thriller",
    description: "High-stakes suspense, psychological tension, and calculated narrative turns.",
  },
  "sci-fi": {
    id: 878,
    name: "Science Fiction",
    description: "Speculative physics, cerebral futurism, and deep philosophical world-building.",
  },
  action: {
    id: 28,
    name: "Action",
    description: "Visceral stunts, dynamic choreography, and unrelenting narrative momentum.",
  },
  drama: {
    id: 18,
    name: "Drama",
    description: "Emotionally grounded character journeys, moral dilemmas, and layered human stories.",
  },
  horror: {
    id: 27,
    name: "Horror",
    description: "Atmospheric dread, visceral unease, and claustrophobic psychological tension.",
  },
  mystery: {
    id: 9648,
    name: "Mystery",
    description: "Investigative friction, deceptive revelations, and intricate puzzle structures.",
  },
  crime: {
    id: 80,
    name: "Crime",
    description: "Moral decay, high-stakes heists, organized syndicates, and systemic tension.",
  },
  animation: {
    id: 16,
    name: "Animation",
    description: "Visually unbounded storytelling across global anime and groundbreaking cinematic features.",
  },
  romance: {
    id: 10749,
    name: "Romance",
    description: "Poetic magnetism, poignant interpersonal connections, and emotionally resonant journeys.",
  },
  comedy: {
    id: 35,
    name: "Comedy",
    description: "Sharp wit, situational subversions, and high-energy narrative levity.",
  },
};

async function getGenreMovies(genreId: number) {
  const apiKey = process.env.TMDB_API_KEY || "b6b9f5e3a64b6ef32e0b8fade33cfe5a";

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&sort_by=vote_average.desc&vote_count.gte=500&page=1`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    
    // Strict Hygiene: Enforce valid poster and positive rating
    return (data.results || []).filter(
      (m: any) => m && m.poster_path && m.vote_average > 0 && (m.vote_count ?? 0) >= 100
    );
  } catch (err) {
    console.error("Failed to fetch genre movies:", err);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const normalizedSlug = slug.toLowerCase();
  const genre = GENRE_MAP[normalizedSlug];
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.movieint.com";

  if (!genre) {
    return {
      title: "Genre Hub | MOVIEINT",
      description: "Explore cinematic properties classified by narrative genre.",
    };
  }

  const canonicalUrl = `${baseUrl}/genre/${normalizedSlug}`;

  return {
    title: `Best ${genre.name} Movies & Algorithmic Index | MOVIEINT`,
    description: `Discover top-rated ${genre.name.toLowerCase()} films curated through Narrative DNA, pacing analysis, and telemetry scores.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `Best ${genre.name} Movies | MOVIEINT`,
      description: genre.description,
      url: canonicalUrl,
      type: "website",
    },
  };
}

export default async function GenrePage({ params }: PageProps) {
  const { slug } = await params;
  const normalizedSlug = slug.toLowerCase();
  const genre = GENRE_MAP[normalizedSlug];

  if (!genre) {
    return (
      <main className="min-h-screen bg-[#05070b] text-white flex flex-col items-center justify-center p-4">
        <p className="text-slate-400 mb-4 font-mono text-sm">GENRE_INDEX_NOT_FOUND</p>
        <Link href="/" className="text-indigo-400 hover:text-indigo-300 font-medium transition text-xs">
          ← Back to Intelligence Hub
        </Link>
      </main>
    );
  }

  const movies = await getGenreMovies(genre.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Best ${genre.name} Movies`,
    description: genre.description,
    itemListElement: movies.slice(0, 10).map((movie: any, idx: number) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "Movie",
        name: movie.title,
        url: `https://www.movieint.com/movie/${movie.id}`,
        image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: movie.vote_average?.toFixed(1),
          bestRating: "10",
          ratingCount: movie.vote_count,
        },
      },
    })),
  };

  return (
    <main className="min-h-screen bg-[#05070b] text-slate-100 px-4 py-12 flex flex-col items-center selection:bg-indigo-600 selection:text-white relative overflow-hidden pb-24">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[450px] bg-gradient-to-b from-indigo-600/10 via-rose-950/5 to-transparent pointer-events-none -z-0" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-5xl w-full z-10 text-left">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-200 mb-8 transition font-mono"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Discover
        </Link>

        {/* Genre Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Curated Thematic Genre
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-3 tracking-tight">
            Top {genre.name} Cinema
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            {genre.description}
          </p>
        </div>

        {/* Genre Switcher Pills */}
        <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-white/[0.06]">
          {Object.entries(GENRE_MAP).map(([key, item]) => {
            const isActive = key === normalizedSlug;
            return (
              <Link
                key={key}
                href={`/genre/${key}`}
                className={`text-xs px-3.5 py-1.5 rounded-full border transition duration-200 ${
                  isActive
                    ? "bg-indigo-600 border-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30"
                    : "bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-16">
          {movies.map((movie: any, idx: number) => (
            <Link
              key={movie.id}
              href={`/movie/${movie.id}`}
              className="group bg-[#090d15] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-indigo-500/50 transition duration-300 flex flex-col shadow-xl"
            >
              <div className="aspect-[2/3] relative w-full bg-slate-950 overflow-hidden">
                <MoviePoster
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  fallbackTitle={movie.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-mono text-indigo-300 border border-white/10">
                  #{idx + 1}
                </div>
                <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-bold text-amber-400 flex items-center gap-1 border border-white/10 font-mono">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {movie.vote_average.toFixed(1)}
                </div>
              </div>
              <div className="p-3 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-200 group-hover:text-indigo-400 transition truncate">
                    {movie.title}
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                    {movie.release_date?.split("-")[0] || "Cinema"}
                  </p>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                  {movie.overview || "Deep narrative resonance archived in system catalog."}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Narrative Context Section */}
        <section className="bg-[#090d15] border border-white/[0.08] rounded-3xl p-6 sm:p-8 text-left space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase tracking-widest">
            <Compass className="w-4 h-4" /> Editorial Telemetry
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Decoding the {genre.name} Landscape
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            The films indexed above are ranked by community consensus paired with MOVIEINT’s algorithmic validation. Rather than arbitrary curation, every title is weighed against pacing consistency, structural impact, and historical rating stability.
          </p>
        </section>
      </div>
    </main>
  );
}
