"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Flame, Star, Trophy, Search, Loader2, ArrowUpRight } from "lucide-react";

export default function RankingsPage() {
  const [category, setCategory] = useState<"top_rated" | "popular" | "now_playing">("top_rated");
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterQuery, setFilterQuery] = useState("");

  useEffect(() => {
    async function fetchRankings() {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${category}?api_key=b6b9f5e3a64b6ef32e0b8fade33cfe5a&page=1`
        );
        const data = await res.json();
        setMovies(data.results || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchRankings();
  }, [category]);

  const filteredMovies = movies.filter((m) =>
    m.title.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#05070b] text-slate-100 px-4 sm:px-8 py-12 flex flex-col items-center selection:bg-indigo-600 selection:text-white relative overflow-hidden">
      {/* Ambient Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[450px] bg-gradient-to-b from-indigo-600/10 via-amber-900/5 to-transparent pointer-events-none -z-0" />

      <div className="max-w-6xl w-full z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0a0d14] border border-white/[0.08] text-amber-300 text-[10px] font-mono uppercase tracking-[0.2em] mb-4">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Curated Hall of Fame</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
            Cinematic Leaderboards
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            The highest echelon of cinema benchmarked across global telemetry, audience reception, and critic consensus.
          </p>
        </div>

        {/* Filter Bar & Live Quick Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-[#090d15] border border-white/[0.08] p-3 rounded-2xl">
          {/* Category Switcher Tabs */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            {[
              { id: "top_rated", label: "All-Time Greatest" },
              { id: "popular", label: "High Velocity (Popular)" },
              { id: "now_playing", label: "In Theaters Now" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCategory(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  category === tab.id
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick Real-Time Filter Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter leaderboard..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full bg-[#05070b] border border-white/[0.08] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Leaderboard Table / Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            <p className="text-xs font-mono text-slate-500">Calculating rank telemetry...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredMovies.map((movie, index) => (
              <Link
                key={movie.id}
                href={`/movie/${movie.id}`}
                className="group bg-[#090d15] border border-white/[0.06] hover:border-indigo-500/40 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-4 transition duration-200 hover:-translate-y-0.5 shadow-lg"
              >
                <div className="flex items-center gap-4 truncate">
                  {/* Rank Number */}
                  <span
                    className={`w-7 text-center font-mono font-black text-sm sm:text-base shrink-0 ${
                      index === 0
                        ? "text-amber-400"
                        : index === 1
                        ? "text-slate-300"
                        : index === 2
                        ? "text-amber-600"
                        : "text-slate-600"
                    }`}
                  >
                    #{index + 1}
                  </span>

                  {/* Thumbnail */}
                  <div className="w-12 aspect-[2/3] relative rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-white/5">
                    {movie.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                        alt={movie.title}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-[9px] text-slate-600">N/A</div>
                    )}
                  </div>

                  {/* Title & Overview */}
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-indigo-400 transition truncate">
                        {movie.title}
                      </h3>
                      <span className="text-[11px] font-mono text-slate-500">
                        ({movie.release_date?.split("-")[0] || "TBA"})
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate max-w-md sm:max-w-xl mt-0.5">
                      {movie.overview}
                    </p>
                  </div>
                </div>

                {/* Score & Link Arrow */}
                <div className="flex items-center gap-4 shrink-0 pl-2">
                  <div className="flex items-center gap-1.5 bg-black/60 border border-white/5 px-3 py-1 rounded-xl">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-mono font-bold text-xs text-amber-300">
                      {movie.vote_average?.toFixed(1)}
                    </span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition hidden sm:block" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}