"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Star, Film, Sparkles, ArrowLeft, Loader2 } from "lucide-react";
import MoviePoster from "@/components/MoviePoster";

interface MovieItem {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
}

function SearchContainer() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [results, setResults] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchedQuery, setSearchedQuery] = useState(queryParam);

  const performSearch = async (query: string) => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    setSearchedQuery(query);

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=b6b9f5e3a64b6ef32e0b8fade33cfe5a&query=${encodeURIComponent(
          query
        )}`
      );
      if (res.ok) {
        const data = await res.json();
        const filtered = (data.results || []).filter(
          (m: any) => m && m.poster_path && m.vote_average > 0
        );
        setResults(filtered);
      }
    } catch (err) {
      console.error("Search fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryParam) {
      setSearchTerm(queryParam);
      performSearch(queryParam);
    }
  }, [queryParam]);

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchTerm);
  };

  return (
    <div className="max-w-6xl w-full z-10 text-left">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-white mb-8 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Discover
      </Link>

      {/* Header & Search Bar */}
      <div className="mb-10 pb-8 border-b border-white/[0.08]">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1 rounded-full text-indigo-400 text-[10px] font-mono uppercase tracking-widest mb-4">
          <Sparkles className="w-3.5 h-3.5" /> Quantum Archive Query
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          Global Cinema Search
        </h1>

        <form onSubmit={handleManualSearch} className="relative max-w-xl">
          <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search movie by title or narrative keyword..."
            className="w-full bg-[#090d15] border border-white/[0.1] focus:border-indigo-500 rounded-2xl pl-11 pr-28 py-3.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 outline-none transition shadow-2xl"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Query"}
          </button>
        </form>
      </div>

      {/* Query Status */}
      {searchedQuery && (
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/[0.06]">
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-slate-400 font-bold flex items-center gap-2">
            <Film className="w-4 h-4 text-indigo-400" /> Results for &ldquo;{searchedQuery}&rdquo; ({results.length})
          </h2>
          <span className="text-[11px] font-mono text-slate-500">Verified Catalog Only</span>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="font-mono text-xs">Scanning cinematic intelligence records...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 mb-16">
          {results.map((movie) => (
            <Link
              key={movie.id}
              href={`/movie/${movie.id}`}
              className="group relative bg-[#090d15] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-950/40 transition duration-300 flex flex-col"
            >
              <div className="aspect-[2/3] relative w-full bg-slate-950 overflow-hidden">
                <MoviePoster
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : null
                  }
                  alt={movie.title}
                  fallbackTitle={movie.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded-lg flex items-center gap-1 text-[11px] font-mono font-bold text-amber-400">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{movie.vote_average?.toFixed(1)}</span>
                </div>
              </div>

              <div className="p-3.5 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-200 group-hover:text-indigo-400 transition line-clamp-1">
                    {movie.title}
                  </h3>
                  <p className="text-[11px] font-mono text-slate-500 mt-1">
                    {movie.release_date?.split("-")[0] || "TBA"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : searchedQuery && !loading ? (
        <div className="bg-[#090d15] border border-white/[0.06] rounded-3xl p-12 text-center my-8">
          <Film className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No Verified Cinematic Matches</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No records matched &ldquo;{searchedQuery}&rdquo; within high-consensus criteria. Try searching by full original title.
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-[#05070b] text-slate-100 px-4 sm:px-8 py-12 flex flex-col items-center selection:bg-indigo-600 selection:text-white relative overflow-hidden pb-24">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[450px] bg-gradient-to-b from-indigo-600/10 via-rose-950/5 to-transparent pointer-events-none -z-0" />

      <Suspense
        fallback={
          <div className="w-full max-w-6xl py-24 flex flex-col items-center justify-center gap-3 text-slate-500 font-mono text-xs">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
            <span>Mounting Quantum Query Buffer...</span>
          </div>
        }
      >
        <SearchContainer />
      </Suspense>
    </main>
  );
}
