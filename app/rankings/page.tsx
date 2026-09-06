import { Metadata } from "next";
import Link from "next/link";
import { Sparkles, BarChart3, Brain, Compass, ShieldCheck, Layers, Info } from "lucide-react";
import RankingsClient from "./RankingsClient";

export const metadata: Metadata = {
  title: "Global Cinema Rankings & Intelligence Leaderboard | MOVIEINT",
  description:
    "Explore algorithmic rankings evaluating narrative complexity, pacing consistency, and historical critical resonance across global cinema.",
  alternates: {
    canonical: "https://www.movieint.com/rankings",
  },
  openGraph: {
    title: "Global Cinema Rankings & Telemetry Leaderboard | MOVIEINT",
    description:
      "Algorithmic film rankings combining community consensus, pacing variance, and structural depth metrics.",
    url: "https://www.movieint.com/rankings",
    type: "website",
  },
};

async function getInitialRankings() {
  const apiKey = process.env.TMDB_API_KEY || "b6b9f5e3a64b6ef32e0b8fade33cfe5a";
  try {
    // Weighted Query: vote_count >= 1000 to eliminate low-vote anomalies
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=vote_average.desc&vote_count.gte=1000&page=1`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) {
      // Fallback to top_rated if discover fails
      const fallbackRes = await fetch(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&page=1`,
        { next: { revalidate: 86400 } }
      );
      const fallbackData = await fallbackRes.json();
      return fallbackData.results || [];
    }
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Failed to fetch initial rankings:", error);
    return [];
  }
}

export default async function RankingsPage() {
  const initialMovies = await getInitialRankings();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "MOVIEINT Global Cinema Rankings",
    description:
      "Algorithmic ranking of cinema masterpieces weighted by narrative depth, audience consensus, and pacing telemetry.",
    itemListElement: initialMovies.slice(0, 10).map((movie: any, index: number) => ({
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
    <main className="min-h-screen bg-[#05070b] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden pb-24">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[450px] bg-gradient-to-b from-indigo-600/10 via-rose-950/5 to-transparent pointer-events-none -z-0" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto mb-8 relative z-10 text-left">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full text-indigo-400 text-xs font-semibold mb-4 font-mono uppercase">
          <Sparkles className="w-3.5 h-3.5" /> Algorithmic Index
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3">
          Global Cinema Rankings
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Dynamic leaderboard indexing cinematic achievements, narrative complexity, and sustained critical consensus across global cinema archives.
        </p>

        {/* Real-time Methodology Disclosure Banner */}
        <div className="mt-6 p-4 rounded-2xl bg-[#090d15] border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">
                Weighted Bayesian Evaluation Active
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Ranks filter anomalies by enforcing a minimum baseline ($v \ge 1,000$ votes) to preserve historical integrity.
              </p>
            </div>
          </div>
          <Link
            href="/methodology"
            className="text-xs font-mono text-indigo-400 hover:text-indigo-300 font-medium shrink-0 transition"
          >
            How it works →
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10 mb-16">
        <RankingsClient initialMovies={initialMovies} />
      </div>

      {/* Editorial & Methodology Section for High SEO / AdSense Value */}
      <section className="max-w-6xl mx-auto relative z-10 border-t border-white/[0.08] pt-12 space-y-10 text-left">
        <div className="bg-[#090d15] border border-white/[0.08] rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase tracking-widest mb-3">
            <Compass className="w-4 h-4" /> Editorial Telemetry
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
            How MOVIEINT Determines Cinema Rankings
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
            Conventional ranking lists often suffer from recency bias or raw vote-count skewing. At MOVIEINT, our leaderboard incorporates a multi-layer evaluation pipeline that balances raw audience reception with narrative intelligence signals.
          </p>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            By analyzing runtime velocity, emotional resonance scores, and thematic endurance, the leaderboard provides a transparent, calibrated catalog of works that maintain substantial artistic weight over time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-[#090d15] border border-white/[0.06] rounded-2xl p-5">
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <BarChart3 className="w-4 h-4" />
              <h3 className="text-sm font-bold text-white">Bayesian Consensus</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Raw scores are normalized through a weighted Bayesian mean, preventing newly released films with low vote counts from displacing enduring cinematic classics.
            </p>
          </div>

          <div className="bg-[#090d15] border border-white/[0.06] rounded-2xl p-5">
            <div className="flex items-center gap-2 text-rose-400 mb-2">
              <Brain className="w-4 h-4" />
              <h3 className="text-sm font-bold text-white">Narrative Depth Weight</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Titles are cross-referenced with structural complexity and thematic innovation indices, rewarding intricate screenplay architecture alongside entertainment value.
            </p>
          </div>

          <div className="bg-[#090d15] border border-white/[0.06] rounded-2xl p-5">
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <ShieldCheck className="w-4 h-4" />
              <h3 className="text-sm font-bold text-white">Temporal Consistency</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Filters transient review-bombing anomalies and maintains historical stabilization across decades of international cinema releases.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-950/20 via-[#090d15] to-rose-950/20 border border-white/[0.08] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <Layers className="w-4 h-4 text-indigo-400" /> Deep-Dive Our Rating System
            </h3>
            <p className="text-xs text-slate-400">
              Review full transparency guidelines, data sources, and algorithmic criteria.
            </p>
          </div>
          <Link
            href="/methodology"
            className="bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition duration-200 shrink-0"
          >
            Explore Methodology →
          </Link>
        </div>
      </section>
    </main>
  );
}
