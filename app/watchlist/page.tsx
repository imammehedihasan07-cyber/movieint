"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Bookmark, Trash2, Star, ArrowLeft, Loader2 } from "lucide-react";
import { WatchlistMovie } from "@/components/WatchlistButton";
import MoviePoster from "@/components/MoviePoster";

export default function WatchlistPage() {
  const [movies, setMovies] = useState<WatchlistMovie[]>([]);
  const [mounted, setMounted] = useState(false);

  const syncWatchlist = useCallback(() => {
    try {
      const raw = localStorage.getItem("movieint_watchlist");
      if (!raw) {
        setMovies([]);
        return;
      }
      const saved = JSON.parse(raw);
      if (Array.isArray(saved)) {
        // Sanitize: Keep only valid movie objects with IDs
        setMovies(saved.filter((m) => m && typeof m.id === "number"));
      } else {
        setMovies([]);
      }
    } catch {
      setMovies([]);
    } finally {
      setMounted(true);
    }
  }, []);

  useEffect(() => {
    syncWatchlist();

    // Cross-tab and in-window storage sync
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "movieint_watchlist") {
        syncWatchlist();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [syncWatchlist]);

  const removeMovie = (id: number) => {
    const updated = movies.filter((m) => m.id !== id);
    setMovies(updated);
    try {
      localStorage.setItem("movieint_watchlist", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to update watchlist storage:", e);
    }
  };

  return (
    <main className="min-h-screen bg-[#05070b] text-slate-100 px-4 sm:px-8 py-12 flex flex-col items-center selection:bg-indigo-600 selection:text-white pb-24">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.08]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-2.5 text-white">
              <Bookmark className="w-6 h-6 text-indigo-400" /> Cinema Watchlist
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
              Locally cached narrative records staged for upcoming sessions.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition font-mono uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Discover
          </Link>
        </div>

        {/* Loading / Mounted Check */}
        {!mounted ? (
          <div className="bg-[#090d15] border border-white/[0.08] rounded-3xl p-16 text-center flex flex-col items-center justify-center">
            <Loader2 className="w-6 h-6 text-indigo-500 animate-spin mb-3" />
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
              Retrieving Local Vault...
            </span>
          </div>
        ) : movies.length === 0 ? (
          <div className="bg-[#090d15] border border-white/[0.08] rounded-3xl p-16 text-center">
            <Bookmark className="w-12 h-12 text-slate-600 mx-auto mb-3 opacity-50" />
            <p className="text-base font-bold text-slate-200">Your Watchlist is Empty</p>
            <p className="text-xs text-slate-400 mt-1 mb-6 max-w-sm mx-auto">
              Explore the discovery feeds or DNA analysis and tap &quot;Add to Watchlist&quot; to bookmark titles.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/30"
            >
              Explore Titles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {movies.map((m) => (
              <div
                key={m.id}
                className="group relative bg-[#090d15] border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col hover:border-indigo-500/40 transition duration-300 shadow-xl"
              >
                <Link
                  href={`/movie/${m.id}`}
                  className="aspect-[2/3] relative w-full bg-slate-950 block overflow-hidden"
                >
                  <MoviePoster
                    src={
                      m.poster_path
                        ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
                        : null
                    }
                    alt={m.title}
                    fallbackTitle={m.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/10 flex items-center gap-1 text-[11px] font-mono font-bold text-amber-400">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {m.vote_average && m.vote_average > 0
                      ? m.vote_average.toFixed(1)
                      : "—"}
                  </div>
                </Link>

                <div className="p-3 flex items-center justify-between gap-2">
                  <div className="truncate flex-1">
                    <Link
                      href={`/movie/${m.id}`}
                      className="font-bold text-xs text-slate-200 hover:text-indigo-400 transition truncate block"
                    >
                      {m.title}
                    </Link>
                    <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                      {m.release_date ? m.release_date.split("-")[0] : "Cinema"}
                    </p>
                  </div>
                  <button
                    onClick={() => removeMovie(m.id)}
                    className="text-slate-500 hover:text-rose-400 p-1.5 transition cursor-pointer shrink-0"
                    title="Remove from Watchlist"
                    aria-label={`Remove ${m.title} from watchlist`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
