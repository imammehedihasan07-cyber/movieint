"use client";

import { useEffect, useState } from "react";
import { Bookmark, Check } from "lucide-react";

export interface WatchlistMovie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

export default function WatchlistButton({ movie }: { movie: WatchlistMovie }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const list: WatchlistMovie[] = JSON.parse(localStorage.getItem("movieint_watchlist") || "[]");
    setSaved(list.some((item) => item.id === movie.id));
  }, [movie.id]);

  const toggleSave = () => {
    let list: WatchlistMovie[] = JSON.parse(localStorage.getItem("movieint_watchlist") || "[]");
    if (saved) {
      list = list.filter((item) => item.id !== movie.id);
      setSaved(false);
    } else {
      list.push(movie);
      setSaved(true);
    }
    localStorage.setItem("movieint_watchlist", JSON.stringify(list));
  };

  return (
    <button
      onClick={toggleSave}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer border ${
        saved
          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30"
          : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
      }`}
    >
      {saved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Bookmark className="w-3.5 h-3.5" />}
      <span>{saved ? "In Watchlist" : "Add to Watchlist"}</span>
    </button>
  );
}