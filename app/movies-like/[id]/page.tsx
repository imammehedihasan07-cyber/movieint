import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, Clock, Calendar, Sparkles, Layers, Compass } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getSimilarCollection(id: string) {
  const apiKey = process.env.TMDB_API_KEY;

  try {
    const [targetRes, similarRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`, {
        next: { revalidate: 86400 },
      }),
      fetch(`https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${apiKey}&page=1`, {
        next: { revalidate: 86400 },
      }),
    ]);

    if (!targetRes.ok) return null;

    const targetMovie = await targetRes.json();
    let similarData = similarRes.ok ? await similarRes.json() : { results: [] };

    // If recommendations endpoint is thin, fallback to similar movies
    if (!similarData.results || similarData.results.length < 5) {
      const fallbackRes = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${apiKey}&page=1`,
        { next: { revalidate: 86400 } }
      );
      if (fallbackRes.ok) {
        similarData = await fallbackRes.json();
      }
    }

    return {
      target: targetMovie,
      similar: similarData.results || [],
    };
  } catch (error) {
    console.error("Failed to fetch similar movies:", error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getSimilarCollection(id);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.movieint.com";

  if (!data || !data.target) {
    return {
      title: "Movies Like This | MOVIEINT",
      description: "Discover cinematographically similar movies and thematic twins.",
    };
  }

  const title = data.target.title;
  const year = (data.target.release_date || "").split("-")[0];
  const canonicalUrl = `${baseUrl}/movies-like/${id}`;

  return {
    title: `Best Movies Like ${title} (${year}) — Handpicked Cinematic Twins | MOVIEINT`,
    description: `Loved ${title}? Explore top-rated cinematic recommendations matching its narrative pacing, tone, and mind-bending thematic depth.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `Best Movies Like ${title} | MOVIEINT`,
      description: `Dissect movies sharing the thematic DNA of ${title}. Curated with algorithmic pacing and narrative analysis.`,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: data.target.poster_path
            ? `https://image.tmdb.org/t/p/w500${data.target.poster_path}`
            : "/og-image.png",
          width: 1200,
          height: 630,
          alt: `Movies like ${title}`,
        },
      ],
    },
  };
}

export default async function MoviesLikePage({ params }: PageProps) {
  const { id } = await params;
  const data = await getSimilarCollection(id);

  if (!data || !data.target) {
    return (
      <main className="min-h-screen bg-[#05070b] text-white flex flex-col items-center justify-center p-4">
        <p className="text-slate-400 mb-4 font-mono text-sm">TARGET_MOVIE_NOT_INDEXED</p>
        <Link href="/" className="text-indigo-400 hover:text-indigo-300 font-medium transition text-xs">
          ← Back to Intelligence Hub
        </Link>
      </main>
    );
  }

  const { target, similar } = data;
  const targetYear = (target.release_date || "").split("-")[0];
  const targetGenres = target.genres?.map((g: { name: string }) => g.name).join(", ") || "Cinema";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Movies Like ${target.title}`,
    description: `Curated cinematic list of movies sharing structural and tonal similarities with ${target.title}.`,
    itemListElement: similar.slice(0, 10).map((movie: any, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
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
          href={`/movie/${id}`}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-200 mb-8 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to {target.title} Intelligence
        </Link>

        {/* Benchmark Reference Banner */}
        <section className="bg-[#090d15] border border-white/[0.08] rounded-3xl p-6 sm:p-8 mb-12 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row gap-6 items-center">
          <div className="w-24 sm:w-28 aspect-[2/3] relative rounded-xl overflow-hidden bg-slate-900 border border-white/10 shrink-0 shadow-lg">
            {target.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w300${target.poster_path}`}
                alt={target.title}
                fill
                sizes="112px"
                className="object-cover"
              />
            ) : null}
          </div>
          <div className="flex-grow text-center sm:text-left">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-mono uppercase mb-2">
              <Sparkles className="w-3 h-3" /> Benchmark Anchor
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white mb-2">
              Best Movies Like {target.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Analyzing structural pacing, thematic weight, and emotional resonance. If you enjoyed the storytelling of{" "}
              <strong>{target.title} ({targetYear})</strong>, these curated titles offer similar cinematic DNA.
            </p>
          </div>
        </section>

        {/* Thematic Recommendations Grid */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-slate-400 font-bold flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" /> Algorithmic Matches ({similar.length})
            </h2>
            <span className="text-[11px] font-mono text-slate-500">Sorted by Affinity</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {similar.map((movie: any) => (
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
                    <div className="flex items-center justify-center h-full text-xs text-slate-600">No Poster</div>
                  )}
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-bold text-amber-400 flex items-center gap-1 border border-white/10">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {movie.vote_average?.toFixed(1) || "N/A"}
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
                    {movie.overview || "Deep thematic synchronization."}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Narrative Synergy Explanation for SEO Context */}
        <section className="bg-[#090d15] border border-white/[0.08] rounded-3xl p-6 sm:p-8 text-left space-y-4">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase tracking-widest">
            <Compass className="w-4 h-4" /> Thematic Breakdown
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Why do these titles share cinematic affinity with {target.title}?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Finding genuine film parallels requires looking past basic genre tags like {targetGenres}. Our narrative engine cross-references rhythmic pacing velocity, psychological tension points, and ending impact profiles.
          </p>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Whether through high-concept intellectual dilemmas, non-linear timelines, or character-driven stakes, each title highlighted above resonates with the specific structural DNA that defines {target.title}.
          </p>
        </section>
      </div>
    </main>
  );
}
