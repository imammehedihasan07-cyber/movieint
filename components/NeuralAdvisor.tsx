"use client";

import React, { useState } from "react";
import Link from "next/link";
import MoviePoster from "@/components/MoviePoster";

interface AdvisorResult {
  title: string;
  tmdbId: string;
  year: number;
  director: string;
  genres: string[];
  complexity: number;
  emotionalIntensity: number;
  darkness: number;
  pacing: string;
  endingType: string;
  runtime: string;
  streamingOn: string[];
  dnaScore: number;
  matchPercent: number;
  whyItMatches: string;
  posterPath: string | null;
}

const MOOD_FILTERS = [
  { label: "Mind-Bending Sci-Fi", prompt: "I want complex mind-bending sci-fi with philosophical questions and non-linear time" },
  { label: "Bleak & Dark Noir", prompt: "Bleak, atmospheric psychological thriller with high darkness and gritty tension" },
  { label: "High-Octane Intensity", prompt: "Fast paced relentless tempo, intense pressure and psychological battle" },
  { label: "Subterranean Class Dread", prompt: "Smart social thriller escalating from quiet suspense into shocking twists" },
  { label: "Subconscious Dream Heist", prompt: "Layered reality heist with intricate mechanics and ambiguous endings" },
  { label: "Existential Space Wonder", prompt: "Cosmic scale exploration dealing with love, time dilation, and survival" }
];

export default function NeuralAdvisor() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AdvisorResult[] | null>(null);
  const [activeMood, setActiveMood] = useState<string | null>(null);

  const handleSearch = async (queryText?: string, moodLabel?: string) => {
    const q = queryText !== undefined ? queryText : prompt;
    if (!q.trim()) return;

    if (moodLabel) {
      setActiveMood(moodLabel);
    }
    setPrompt(q);
    setLoading(true);
    setResults(null);

    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: q })
      });
      const data = await res.json();
      if (data.results) {
        setResults(data.results);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#0e1424] via-[#080c16] to-[#05070c] border border-cyan-500/30 shadow-2xl relative overflow-hidden text-left">
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Header */}
      <div className="relative z-10 text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 font-mono text-xs uppercase tracking-wider shadow-inner">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>MovieINT Neural Film Advisor v2.0</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Natural Language Cinematic Telemetry
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Describe the exact atmosphere, reference movie, pacing, or narrative twist you crave. Our vector telemetry model matches cinematic DNA instantly.
        </p>
      </div>

      {/* Mood Filters */}
      <div className="relative z-10 mb-5">
        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
          <span className="text-cyan-400">⚡</span>
          <span>Instant Calibration Moods:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {MOOD_FILTERS.map((mood) => {
            const isSelected = activeMood === mood.label;
            return (
              <button
                key={mood.label}
                onClick={() => handleSearch(mood.prompt, mood.label)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                  isSelected
                    ? "bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-md shadow-cyan-500/20"
                    : "bg-slate-900/80 text-slate-300 border-slate-800 hover:border-cyan-500/50 hover:text-cyan-300"
                }`}
              >
                {mood.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Box */}
      <div className="relative z-10 space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              setActiveMood(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="e.g. Something like Interstellar but darker with high psychological dread..."
            className="flex-1 bg-slate-950/90 border border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-mono transition-colors"
          />
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 font-extrabold font-mono text-xs sm:text-sm tracking-wider transition-all disabled:opacity-50 whitespace-nowrap shadow-lg shadow-cyan-500/25 cursor-pointer"
          >
            {loading ? "CALIBRATING DNA..." : "EXECUTE VECTOR MATCH →"}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="mt-8 p-6 text-center space-y-2 font-mono text-xs text-cyan-400 border border-cyan-500/30 rounded-xl bg-cyan-950/20 backdrop-blur-sm">
          <div className="flex justify-center items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-.15s]" />
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-.3s]" />
          </div>
          <p className="tracking-wide">Parsing Narrative DNA vectors across cinematic index...</p>
          <p className="text-slate-500 text-[11px]">Calibrating darkness, complexity, and thematic pacing alignment</p>
        </div>
      )}

      {/* Results Cards */}
      {results && results.length > 0 && (
        <div className="mt-10 space-y-6 relative z-10">
          <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold border-b border-slate-800/90 pb-3 flex justify-between items-center">
            <span className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400" />
              Algorithmic Matches Found: {results.length} Masterpieces
            </span>
            <span className="text-slate-500 hidden sm:inline">Ranked by Vector Alignment</span>
          </div>

          <div className="space-y-5">
            {results.map((item, idx) => (
              <div
                key={item.tmdbId}
                className="p-5 sm:p-6 rounded-xl bg-slate-950/85 border border-slate-800 hover:border-cyan-500/40 transition-all shadow-xl flex flex-col sm:flex-row gap-5 group"
              >
                {/* Poster */}
                <Link
                  href={`/movie/${item.tmdbId}`}
                  className="w-24 sm:w-28 h-36 sm:h-40 rounded-xl overflow-hidden shrink-0 relative bg-slate-900 border border-slate-800 group-hover:border-cyan-500/40 transition shadow-md self-center sm:self-start"
                >
                  <MoviePoster
                    src={item.posterPath ? `https://image.tmdb.org/t/p/w300${item.posterPath}` : null}
                    alt={item.title}
                    fallbackTitle={item.title}
                    fill
                    sizes="112px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between gap-3 min-w-0">
                  {/* Title & Match Ratio */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
                        <span className="text-cyan-400 font-bold">#{idx + 1} MATCH</span>
                        <span>•</span>
                        <span>{item.year}</span>
                        <span>•</span>
                        <span>{item.runtime}</span>
                        <span>•</span>
                        <span className="truncate">Dir. {item.director}</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-white mt-1 group-hover:text-cyan-300 transition-colors">
                        <Link href={`/movie/${item.tmdbId}`}>
                          {item.title}
                        </Link>
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 font-mono shrink-0">
                      <div className="px-3 py-1 rounded-lg bg-cyan-950/90 border border-cyan-500/50 text-cyan-300 text-xs sm:text-sm font-black shadow-inner">
                        {item.matchPercent}% Match
                      </div>
                      <div className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-amber-400 text-xs font-bold">
                        DNA {item.dnaScore}
                      </div>
                    </div>
                  </div>

                  {/* Telemetry Vector Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono bg-slate-900/70 p-3 rounded-lg border border-slate-800/80">
                    <div>
                      <span className="text-slate-500 block text-[10px]">COMPLEXITY</span>
                      <span className="text-white font-bold">{item.complexity} / 100</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">EMOTIONAL DEPTH</span>
                      <span className="text-indigo-300 font-bold">{item.emotionalIntensity} / 100</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">DARKNESS INDEX</span>
                      <span className="text-rose-400 font-bold">{item.darkness} / 100</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">ENDING TYPE</span>
                      <span className="text-cyan-300 truncate block">{item.endingType}</span>
                    </div>
                  </div>

                  {/* Why It Matches */}
                  <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800/50">
                    <span className="text-cyan-400 font-mono text-[10px] uppercase tracking-wider block mb-1 font-bold">
                      Neural Alignment Rationale:
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {item.whyItMatches}
                    </p>
                  </div>

                  {/* Footer Streaming & Links */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-mono border-t border-slate-800/60">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-slate-500">Stream on:</span>
                      {item.streamingOn && item.streamingOn.length > 0 ? (
                        item.streamingOn.map((st) => (
                          <span key={st} className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[11px]">
                            {st}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-600 text-[11px]">Check local providers</span>
                      )}
                    </div>

                    <Link
                      href={`/movie/${item.tmdbId}`}
                      className="text-cyan-400 hover:text-cyan-300 font-bold transition flex items-center gap-1 group-hover:translate-x-0.5"
                    >
                      <span>Explore Film DNA</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
