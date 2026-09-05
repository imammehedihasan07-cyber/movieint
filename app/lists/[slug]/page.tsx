import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Star, Sparkles, ArrowLeft, Film } from "lucide-react";

interface ListConfig {
  title: string;
  tagline: string;
  description: string;
  genreIds?: string;
  sortBy?: string;
}

const LIST_REGISTRY: Record<string, ListConfig> = {
  "mind-bending": {
    title: "Best Mind-Bending & Psychological Masterpieces",
    tagline: "Unreliable narrators, non-linear realities, and labyrinthine plot twists.",
    description: "Curated catalog of films and series engineered to challenge perception, featuring dense existential puzzles and shocking climax reveals.",
    genreIds: "9648,878,53", // Mystery, Sci-Fi, Thriller
    sortBy: "vote_average.desc",
  },
  "slow-burn-thrillers": {
    title: "Top-Tier Slow-Burn Atmospheric Thrillers",
    tagline: "Methodical tension, suffocating dread, and explosive final payoffs.",
    description: "Discover films that take their time tightening the cinematic screws. Designed for viewers seeking meditative suspense over cheap jump scares.",
    genreIds: "53,80,18", // Thriller, Crime, Drama
    sortBy: "popularity.desc",
  },
  "under-90-mins": {
    title: "Relentless Cinema Under 90 Minutes",
    tagline: "Zero narrative fat. High velocity pacing from minute one.",
    description: "The ultimate survival and kinetic catalog for viewers with limited time. Razor-sharp edits and instant narrative immersion.",
    sortBy: "vote_average.desc",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const config = LIST_REGISTRY[slug] || {
    title: "Curated Cinema Lists",
    description: "Algorithmic cinema collections on MOVIEINT.",
  };

  return {
    title: `${config.title} | MOVIEINT Neural Cinema`,
    description: config.description,
  };
}

export default async function ListDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = LIST_REGISTRY[slug] || LIST_REGISTRY["mind-bending"];

  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY || "b6b9f5e3a64b6ef32e0b8fade33cfe5a"}&with_genres=${config.genreIds || ""}&sort_by=${config.sortBy || "popularity.desc"}&vote_count.gte=300&page=1`,
    { next: { revalidate: 86400 } }
  );
  const data = await res.json();
  const movies = data.results || [];

  return (
    <main className="min-h-screen bg-[#05070b] text-slate-100 px-4 sm:px-8 py-12 flex flex-col items-center selection:bg-indigo-600 selection:text-white">
      <div className="max-w-6xl w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white mb-8 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Discover
        </Link>

        {/* Hero Header */}
        <div className="bg-[#090d15] border border-white/[0.08] rounded-3xl p-6 sm:p-10 mb-12 shadow-2xl relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-mono uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Programmatic SEO Matrix
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-3 tracking-tight">
            {config.title}
          </h1>
          <p className="text-indigo-300 text-sm font-medium mb-4">{config.tagline}</p>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            {config.description}
          </p>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
          {movies.map((movie: any) => (
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
                    sizes="(max-width: 640px) 50vw, 20vw"
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-slate-600">No Image</div>
                )}
                <div className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-bold text-amber-400 border border-white/10">
                  <Star className="w-3 h-3 fill-amber-400 inline mr-1" />
                  {movie.vote_average?.toFixed(1)}
                </div>
              </div>
              <div className="p-3">
                <h4 className="text-xs font-bold text-slate-200 truncate group-hover:text-indigo-400 transition">
                  {movie.title}
                </h4>
                <p className="text-[10px] font-mono text-slate-500 mt-1">
                  {movie.release_date?.split("-")[0] || "Cinema"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}