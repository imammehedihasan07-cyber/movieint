"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Armchair,
  Sparkles,
  Brain,
  Clock,
  Smile,
  Loader2,
  Star,
  ArrowRight,
  HelpCircle,
  Zap,
  Compass,
  CheckCircle2,
} from "lucide-react";

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
    <main className="min-h-screen bg-[#05070b] text-slate-100 px-4 py-12 flex flex-col items-center selection:bg-rose-500 selection:text-white relative overflow-hidden pb-24">
      {/* Ambient Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[450px] bg-gradient-to-b from-rose-600/10 via-purple-900/5 to-transparent pointer-events-none -z-0" />

      <div className="max-w-4xl w-full z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 px-4 py-1.5 rounded-full text-rose-400 text-xs font-semibold mb-4">
            <Armchair className="w-4 h-4" /> The Indecisive Viewer's Lifesaver
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3">
            Couch Mode AI
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Stop scrolling endlessly through streaming catalogs. Calibrate your mental bandwidth, emotional resonance, and runtime window to discover exact cinematic matches.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="bg-[#090d15] border border-white/[0.08] rounded-3xl p-6 sm:p-8 mb-10 space-y-6 shadow-2xl">
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
                      : "bg-[#05070b] border-white/[0.06] text-slate-400 hover:border-white/10 hover:text-white"
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
                      : "bg-[#05070b] border-white/[0.06] text-slate-400 hover:border-white/10 hover:text-white"
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
                      : "bg-[#05070b] border-white/[0.06] text-slate-400 hover:border-white/10 hover:text-white"
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
            className="w-full bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold py-3.5 rounded-2xl transition flex items-center justify-center gap-2 shadow-xl cursor-pointer disabled:opacity-50 text-sm"
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
          <div className="space-y-4 mb-16 animate-fadeIn">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> Curated For Tonight:
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {results.map((movie, idx) => (
                <div
                  key={idx}
                  className="bg-[#090d15] border border-white/[0.08] rounded-3xl p-5 flex flex-col sm:flex-row items-center sm:items-start gap-5 hover:border-indigo-500/40 transition duration-300 shadow-xl"
                >
                  <div className="w-24 aspect-[2/3] relative rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-white/10">
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

        {/* Editorial Guide / SEO Explanatory Content */}
        <section className="text-left space-y-8 mt-12 border-t border-white/[0.08] pt-12">
          <div className="bg-[#090d15] border border-white/[0.08] rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-mono uppercase tracking-widest mb-3">
              <HelpCircle className="w-4 h-4" /> Recommendation Telemetry
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
              What is Couch Mode & How Does It Curate Films?
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
              Decision paralysis is the leading friction in modern home cinema streaming. With thousands of titles accessible across Netflix, Amazon Prime, and Apple TV, users spend an average of 18 minutes searching before settling on repeat viewings. <strong>Couch Mode AI</strong> solves this by calibrating selection vectors around your current biological focus and time constraints.
            </p>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Instead of generic genre filters, our heuristic maps cognitive demand against rhythmic pacing velocity and climax impact—ensuring your choice synchronizes seamlessly with your evening.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-[#090d15] border border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-center gap-2 text-indigo-400 mb-2">
                <Brain className="w-4 h-4" />
                <h3 className="text-sm font-bold text-white">Cognitive Load Index</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Matches whether you need effortless comfort viewing after intense mental work or an intricate puzzle requiring total focus.
              </p>
            </div>

            <div className="bg-[#090d15] border border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-center gap-2 text-rose-400 mb-2">
                <Smile className="w-4 h-4" />
                <h3 className="text-sm font-bold text-white">Emotional Tuning</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Accounts for emotional resonance profiles—delivering high-octane thrills, comforting levity, or somber existential narratives on demand.
              </p>
            </div>

            <div className="bg-[#090d15] border border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-center gap-2 text-amber-400 mb-2">
                <Clock className="w-4 h-4" />
                <h3 className="text-sm font-bold text-white">Runtime Precision</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Eliminates the fatigue of accidentally starting a 3-hour epic on a weeknight when your schedule strictly demands a tight 95-minute feature.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-rose-950/20 via-[#090d15] to-indigo-950/20 border border-white/[0.08] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-base font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                <Compass className="w-4 h-4 text-rose-400" /> Transparent Algorithmic Standards
              </h3>
              <p className="text-xs text-slate-400">
                Discover how MOVIEINT weights TMDB telemetry with neural cinema heuristics.
              </p>
            </div>
            <Link
              href="/methodology"
              className="bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition duration-200 shrink-0"
            >
              Read Full Methodology →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
