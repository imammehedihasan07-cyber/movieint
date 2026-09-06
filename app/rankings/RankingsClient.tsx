"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Flame, Star, Trophy, Search, Loader2, ArrowUpRight } from "lucide-react";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
}

export default function RankingsClient({ initialMovies }: { initialMovies: Movie[] }) {
  const [category, setCategory] = useState<"top_rated" | "popular" | "now_playing">("top_rated");
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [loading, setLoading] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");

  async function handleCategoryChange(newCategory: "top_rated" | "popular" | "now_playing") {
    if (newCategory === category) return;
    setCategory(newCategory);
    setLoading(true);

    try {
      const apiKey = "b6b9f5e3a64b6ef32e0b8fade33cfe5a";
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${newCategory}?api_key=${apiKey}&page=1`
      );
      const data = await res.json();
      setMovies(data.results || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const filteredMovies = movies.filter((m) =>
    m.title.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Controls: Search and Category Switches */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-slate-900/60 p-4 rounded-xl border border-slate-800 backdrop-blur-sm">
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <button
            onClick={() => handleCategoryChange("top_rated")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              category === "top_rated"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <Trophy className="w-4 h-4 text-yellow-400" />
            Top Rated
          </button>
          <button
            onClick={() => handleCategoryChange("popular")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              category === "popular"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <Flame className="w-4 h-4 text-orange-400" />
            Popular
          </button>
          <button
            onClick={() => handleCategoryChange("now_playing")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              category === "now_playing"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <Star className="w-4 h-4 text-amber-400" />
            Now Playing
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Filter title..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
      </div>

      {/* Movie List / Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-3" />
          <p className="text-slate-400 text-sm">Refreshing leaderboard rankings...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredMovies.map((movie, index) => (
            <div
              key={movie.id}
              className="flex items-center justify-between p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl hover:border-slate-700 transition"
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="text-lg font-bold text-slate-500 w-8 text-center shrink-0">
                  #{index + 1}
                </span>

                <div className="relative w-12 h-16 bg-slate-800 rounded overflow-hidden shrink-0">
                  {movie.poster_path && (
                    <Image
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      alt={movie.title}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  )}
                </div>

                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-white truncate">{movie.title}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {movie.release_date ? movie.release_date.split("-")[0] : "N/A"} • Rating:{" "}
                    {movie.vote_average.toFixed(1)}/10
                  </p>
                </div>
              </div>

              <Link
                href={`/movie/${movie.id}`}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-indigo-600 rounded-lg transition shrink-0 ml-4"
              >
                Analyze DNA
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
