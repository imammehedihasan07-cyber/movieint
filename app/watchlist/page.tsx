"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bookmark, Trash2, Star, ArrowLeft } from "lucide-react";
import { WatchlistMovie } from "@/components/WatchlistButton";

export default function WatchlistPage() {
  const [movies, setMovies] = useState<WatchlistMovie[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("movieint_watchlist") || "[]");
    setMovies(saved);
  }, []);

  const removeMovie = (id: number) => {
    const updated = movies.filter((m) => m.id !== id);
    setMovies(updated);
    localStorage.setItem("movieint_watchlist", JSON.stringify(updated));
  };

  return (
    <main className="min-h-screen bg-[#0a0d14] text-slate-100 px-4 py-12 flex flex-col items-center">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2 text-white">
              <Bookmark className="w-6 h-6 text-emerald-400" /> Your Watchlist
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Saved films stored locally for your next cinema night.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Discover
          </Link>
        </div>

        {/* Empty State */}
        {movies.length === 0 ? (
          <div className="bg-[#111625] border border-slate-800/80 rounded-3xl p-12 text-center">
            <Bookmark className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-300">Your watchlist is empty.</p>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Explore films and click "Add to Watchlist" to save them here.
            </p>
            <Link
              href="/"
              className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
            >
              Explore Movies
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.map((m) => (
              <div
                key={m.id}
                className="group relative bg-[#111625] border border-slate-800/80 rounded-xl overflow-hidden flex flex-col hover:border-slate-700 transition"
              >
                <Link href={`/movie/${m.id}`} className="aspect-[2/3] relative w-full bg-slate-900 block">
                  {m.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
                      alt={m.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-slate-600">No Image</div>
                  )}
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded flex items-center gap-1 text-xs font-semibold text-amber-400">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {m.vote_average?.toFixed(1) || "N/A"}
                  </div>
                </Link>

                <div className="p-3 flex items-center justify-between">
                  <div className="truncate mr-2">
                    <Link
                      href={`/movie/${m.id}`}
                      className="font-semibold text-xs text-slate-200 hover:text-rose-400 transition truncate block"
                    >
                      {m.title}
                    </Link>
                    <p className="text-[10px] text-slate-500">{m.release_date?.split("-")[0] || "N/A"}</p>
                  </div>
                  <button
                    onClick={() => removeMovie(m.id)}
                    className="text-slate-500 hover:text-rose-400 transition p-1 cursor-pointer"
                    title="Remove"
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