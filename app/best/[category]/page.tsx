import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, Film, Sparkles, Filter } from "lucide-react";

interface PageProps {
  params: Promise<{ category: string }>;
}

const CATEGORY_CONFIG: Record<
  string,
  { title: string; genreId?: number; query?: string; description: string }
> = {
  "mind-bending-movies": {
    title: "Best Mind-Bending & Psychological Movies",
    genreId: 878, // Sci-Fi & Mystery
    description:
      "A curated intelligence index of narrative paradoxes, non-linear timelines, and existential cinematic puzzles.",
  },
  "slow-burn-thrillers": {
    title: "Best Slow-Burn Atmospheric Thrillers",
    genreId: 53, // Thriller
    description:
      "Tightly structured, deliberate narratives where atmospheric tension and psychological stakes build to explosive climaxes.",
  },
  "high-octane-action": {
    title: "Top-Rated High-Octane Action Films",
    genreId: 28, // Action
    description:
      "Relentless narrative momentum, visceral choreography, and adrenaline-charged pacing.",
  },
  "deep-concept-sci-fi": {
    title: "Essential Philosophical & Deep Sci-Fi Movies",
    genreId: 878,
    description:
      "Speculative fiction exploring cosmic dread, temporal mechanics, and existential humanity.",
  },
};

async function getCategoryMovies(category: string) {
  const apiKey = process.env.TMDB_API_KEY;
  const config = CATEGORY_CONFIG[category];

  if (!config) return null;

  try {
    const url = config.genreId
      ? `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${config.genreId}&sort_by=vote_average.desc&vote_count.gte=1000&page=1`
      : `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&page=1`;

    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return null;

    const data = await res.json();
    return {
      config,
      movies: data.results || [],
    };
  } catch (err) {
    console.error("Failed to load category data:", err);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const config = CATEGORY_CONFIG[category];
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.movieint.com";

  if (!config) {
    return {
      title: "Cinematic Curations | MOVIEINT",
      description: "Algorithmic film discovery by mood and narrative tone.",
    };
  }

  const canonicalUrl = `${baseUrl}/best/${category}`;

  return {
    title: `${config.title} — Algorithmic Rankings | MOVIEINT`,
    description: config.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${config.title} | MOVIEINT`,
      description: config.description,
      url: canonicalUrl,
      type: "website",
    },
  };
}

export default async function BestCategoryPage({ params }: PageProps) {
  const { category } = await params;
  const result = await getCategoryMovies(category);

  if (!result) {
    return (
      <main className="min-h-screen bg-[#05070b] text-white flex flex-col items-center justify-center p-4">
        <p className="text-slate-400 mb-4 font-mono text-sm">INDEX_CATEGORY_NOT_FOUND</p>
        <Link href="/" className="text-indigo-400 hover:text-indigo-300 font-medium transition text-xs">
          ← Back to Intelligence Hub
        </Link>
      </main>
    );
  }

  const { config, movies } = result;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: config.title,
    description: config.description,
    itemListElement: movies.slice(0, 10).map((movie: any, idx: number) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "Movie",
        name: movie.title,
        url: `https://www.movieint.com/movie/${movie.id}`,
        image: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined,
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

      <div className="max-w-5xl w-full z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-200 mb-8 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Discover
        </Link>

        {/* Category Header */}
        <div className="mb-10 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Curated Narrative Vault
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-3">
            {config.title}
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            {config.description}
          </p>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-white/[0.06]">
          {Object.entries(CATEGORY_CONFIG).map(([slug, c]) => {
            const isActive = slug === category;
            return (
              <Link
                key={slug}
                href={`/best/${slug}`}
                className={`text-xs px-3.5 py-1.5 rounded-full border transition duration-200 ${
                  isActive
                    ? "bg-indigo-600 border-indigo-500 text-white font-semibold"
                    : "bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]"
                }`}
              >
                {slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </Link>
            );
          })}
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-16">
          {movies.map((movie: any, index: number) => (
            <Link
              key={movie.id}
              href={`/movie/${movie.id}`}
              className="group bg-[#090d15] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-indigo-500/50 transition duration-300 flex flex-col"
            >
              <div className="aspect-[2/3] relative w-full bg-slate-950">
                {movie.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-slate-600">No Image</div>
                )}
                <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-mono text-indigo-300 border border-white/10">
                  #{index + 1}
                </div>
                <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-bold text-amber-400 flex items-center gap-1 border border-white/10">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {movie.vote_average?.toFixed(1)}
                </div>
              </div>
              <div className="p-3 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-200 group-hover:text-indigo-400 transition truncate">
                    {movie.title}
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {movie.release_date?.split("-")[0] || "TBA"}
                  </p>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                  {movie.overview || "High thematic resonance."}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
