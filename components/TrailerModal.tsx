"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";

interface TrailerModalProps {
  trailerKey?: string;
  movieTitle: string;
}

export default function TrailerModal({ trailerKey, movieTitle }: TrailerModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!trailerKey) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-rose-600/20 transition cursor-pointer"
      >
        <Play className="w-3.5 h-3.5 fill-white" />
        <span>Watch Trailer</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-[#0a0d14] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800/80 bg-[#111625]">
              <h3 className="text-sm font-bold text-slate-200 truncate pr-4">
                {movieTitle} — Official Trailer
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1`}
                title={`${movieTitle} Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}