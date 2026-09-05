"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Armchair, Sparkles, Brain, Clock, Smile, Loader2, Star, ArrowRight } from "lucide-react";

interface MovieSuggestion {
  id?: number;
  title: string;
  year: string;
  matchReason: string;
  vibeTag: string;
  poster_path?: string;
  vote_average?: number;
}

export default function CouchModePage() {
  const [energy, setEnergy] = useState("Brain-Dead & Comforting");
  const [mood, setMood] = useState("Adrenaline & Thrills");
  const [time, setTime] = useState("Quick (< 100 mins)");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MovieSuggestion[]>([]);

  const handleMatch = async () => {
    setLoading(true);
    setResults([]);
    try {
      const res = await fetch("/api/couch-mode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ energy, mood, time }),
      });
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0d14] text-slate-100 px-4 py-12 flex flex-col items-center selection:bg-rose-500 selection:text-white">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 px-4 py-1.5 rounded-full text-rose-400 text-xs font-semibold mb-4">
            <Armchair className="w-4 h-4" /> The Indecisive Viewer's Lifesaver
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3">
            Couch Mode AI
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Stop scrolling endlessly. Lock in your energy, mood, and schedule—let our cinematic algorithm curate your night.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="bg-[#111625] border border-slate-800 rounded-3xl p-6 sm:p-8 mb-10 space-y-6">
          {/* Energy Slider/Selector */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3">
              <Brain className="w-4 h-4" /> Mental Bandwidth
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {["Brain-Dead & Comforting", "Engaged & Steady", "Mind-Bending / High Focus"].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setEnergy(val)}
                  className={`px-4 py-3 rounded-2xl text-xs font-semibold border text-center transition cursor-pointer ${
                    energy === val
                      ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20"
                      : "bg-[#0a0d14] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Mood Selector */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400 mb-3">
              <Smile className="w-4 h-4" /> Emotional Resonance
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {["Adrenaline & Thrills", "Dark & Gritty", "Heartwarming & Gentle", "Existential & Melancholic"].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setMood(val)}
                  className={`px-3 py-3 rounded-2xl text-xs font-semibold border text-center transition cursor-pointer ${
                    mood === val
                      ? "bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/20"
                      : "bg-[#0a0d14] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Time Limit */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
              <Clock className="w-4 h-4" /> Runtime Window
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["Quick (< 100 mins)", "Standard (~2 Hours)", "Epic (2.5+ Hours)"].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setTime(val)}
                  className={`px-4 py-3 rounded-2xl text-xs font-semibold border text-center transition cursor-pointer ${
                    time === val
                      ? "bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-600/20"
                      : "bg-[#0a0d14] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleMatch}
            disabled={loading}
            className="w-full bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold py-3.5 rounded-2xl transition flex items-center justify-center gap-2 shadow-xl cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Calibrating Cinema Vibe...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Decide For Me</span>
              </>
            )}
          </button>
        </div>

        {/* AI Recommendations Output */}
        {results.length > 0 && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> Curated For Tonight:
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {results.map((movie, idx) => (
                <div
                  key={idx}
                  className="bg-[#111625] border border-slate-800 rounded-3xl p-5 flex flex-col sm:flex-row items-center sm:items-start gap-5 hover:border-slate-700 transition"
                >
                  <div className="w-24 aspect-[2/3] relative rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-800">
                    {movie.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                        alt={movie.title}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-[10px] text-slate-600">No Image</div>
                    )}
                  </div>

                  <div className="flex-grow text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                      <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                        {movie.vibeTag}
                      </span>
                      {movie.vote_average ? (
                        <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {movie.vote_average.toFixed(1)}
                        </div>
                      ) : null}
                    </div>

                    <h4 className="text-xl font-bold text-white mb-1">
                      {movie.title} <span className="text-sm font-normal text-slate-500">({movie.year})</span>
                    </h4>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 italic">
                      "{movie.matchReason}"
                    </p>

                    {movie.id ? (
                      <Link
                        href={`/movie/${movie.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 transition"
                      >
                        <span>Full Movie Breakdown</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}