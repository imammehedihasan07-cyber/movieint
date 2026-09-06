"use client";

import { useEffect, useState, useCallback } from "react";
import { Bookmark, Check } from "lucide-react";

export interface WatchlistMovie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
}

export default function WatchlistButton({ movie }: { movie: WatchlistMovie }) {
  const [saved, setSaved] = useState(false);

  const checkStatus = useCallback(() => {
    try {
      const raw = localStorage.getItem("movieint_watchlist");
      if (!raw) {
        setSaved(false);
        return;
      }
      const list: WatchlistMovie[] = JSON.parse(raw);
      if (Array.isArray(list)) {
        setSaved(list.some((item) => item && item.id === movie.id));
      }
    } catch {
      setSaved(false);
    }
  }, [movie.id]);

  useEffect(() => {
    checkStatus();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "movieint_watchlist") {
        checkStatus();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [checkStatus]);

  const toggleSave = () => {
    try {
      const raw = localStorage.getItem("movieint_watchlist");
      let list: WatchlistMovie[] = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(list)) list = [];

      if (saved) {
        list = list.filter((item) => item && item.id !== movie.id);
        setSaved(false);
      } else {
        list.push({
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path || null,
          vote_average: movie.vote_average || 0,
          release_date: movie.release_date || "",
        });
        setSaved(true);
      }

      localStorage.setItem("movieint_watchlist", JSON.stringify(list));
      window.dispatchEvent(new Event("storage"));
    } catch (e) {
      console.error("Failed to update watchlist state:", e);
    }
  };

  return (
    <button
      onClick={toggleSave}
      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer border ${
        saved
          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30 shadow-lg shadow-emerald-950/40"
          : "bg-white/[0.05] border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.08]"
      }`}
    >
      {saved ? (
        <Check className="w-3.5 h-3.5 text-emerald-400" />
      ) : (
        <Bookmark className="w-3.5 h-3.5" />
      )}
      <span>{saved ? "In Watchlist" : "Add to Watchlist"}</span>
    </button>
  );
}
