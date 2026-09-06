"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Dices,
  Sparkles,
  Star,
  Info,
  RotateCcw,
  Compass,
  HelpCircle,
  Shuffle,
  ShieldCheck,
  Flame,
} from "lucide-react";

const MOODS = [
  { id: "mind-bending", label: "Mind-Bending Puzzle", genre: "9648,878" },
  { id: "adrenaline", label: "Pure Adrenaline & Kinetic", genre: "28,53" },
  { id: "dark-grim", label: "Atmospheric Dread", genre: "27,53" },
  { id: "emotional", label: "Melancholic Tearjerker", genre: "18" },
  { id: "lighthearted", label: "High Energy & Chill", genre: "35,12" },
];

export default function RoulettePage() {
  const [selectedMood, setSelectedMood] = useState(MOODS[0]);
  const [spinning, setSpinning] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);

  const spinTheWheel = async () => {
    setSpinning(true);
    setSelectedMovie(null);

    try {
      const randomPage = Math.floor(Math.random() * 3) + 1;
      const res = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=b6b9f5e3a64b6ef32e0b8fade33cfe5a&with_genres=${selectedMood.genre}&sort_by=vote_average.desc&vote_count.gte=500&page=${randomPage}`
      );
      const data = await res.json();
      const pool = data.results || [];

      setTimeout(() => {
        const pick = pool[Math.floor(Math.random() * pool.length)];
        setSelectedMovie(pick);
        setSpinning(false);
      }, 1500);
    } catch (e) {
      console.error("Cine-Roulette roll error:", e);
      setSpinning(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#05070b] text-slate-100 px-4 sm:px-8 py-14 flex flex-col items-center selection:bg-indigo-600 selection:text-white relative overflow-hidden pb-24">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[450px] bg-gradient-to-b from-indigo-600/15 via-rose-900/10 to-transparent pointer-events-none -z-0" />

      <div className="max-w-3xl w-full text-center z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0a0d14] border border-white/[0.08] text-rose-300 text-[10px] font-mono uppercase tracking-[0.2em] mb-4">
          <Dices className="w-3.5 h-3.5 text-rose-400" />
          <span>Decision Paralysis Breaker</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
          Cine-Roulette
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-10 leading-relaxed">
          Stop scrolling endlessly. Lock your mood wavelength, pull the neural trigger, and commit to what the cinema algorithm decrees.
        </p>

        {/* Mood Selector Hub */}
        <div className="bg-[#090d15] border border-white/[0.08] p-4 rounded-3xl mb-8 shadow-2xl">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-3 text-left">
            1. Calibrate Neural Frequency
          </span>
          <div className="flex flex-wrap gap-2 justify-center">
            {MOODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMood(m)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  selectedMood.id === m.id
                    ? "bg-gradient-to-r from-rose-600 to-indigo-600 text-white shadow-lg shadow-rose-950/40"
                    : "bg-[#05070b] border border-white/[0.06] text-slate-400 hover:text-white hover:border-slate-700"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Spin Trigger Button */}
        <div className="mb-12">
          <button
            onClick={spinTheWheel}
            disabled={spinning}
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 hover:opacity-95 text-white font-black text-sm uppercase tracking-widest px-10 py-5 rounded-2xl transition duration-300 shadow-2xl shadow-rose-950/60 disabled:opacity-50 cursor-pointer"
          >
            <Dices className={`w-5 h-5 ${spinning ? "animate-spin" : "group-hover:rotate-180 transition duration-500"}`} />
            <span>{spinning ? "Cycling Quantum Archive..." : "Spin Cine-Roulette"}</span>
          </button>
        </div>

        {/* Winner Showcase Card */}
        {selectedMovie && !spinning && (
          <div className="bg-gradient-to-b from-[#0e1422] to-[#070a10] border border-indigo-500/30 rounded-3xl p-6 sm:p-8 text-left shadow-2xl mb-16 animate-fadeIn">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase">
                <Sparkles className="w-4 h-4" /> Neural Match Decree
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                You must watch this tonight
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <div className="w-32 aspect-[2/3] relative rounded-2xl overflow-hidden bg-slate-950 shrink-0 border border-white/10 shadow-2xl">
                {selectedMovie.poster_path && (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                    alt={`${selectedMovie.title} poster`}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                )}
              </div>

              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl sm:text-2xl font-black text-white">
                    {selectedMovie.title}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold ml-2">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{selectedMovie.vote_average?.toFixed(1)}</span>
                  </div>
                </div>

                <p className="text-[11px] font-mono text-slate-500 mb-3">
                  Released {selectedMovie.release_date?.split("-")[0]}
                </p>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3 mb-6">
                  {selectedMovie.overview}
                </p>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/movie/${selectedMovie.id}`}
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/30"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Explore Intelligence</span>
                  </Link>
                  <button
                    onClick={spinTheWheel}
                    className="inline-flex items-center gap-1.5 bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 border border-white/10 text-xs font-semibold px-4 py-2.5 rounded-xl transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Re-Roll</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Editorial Architecture & Informational Section */}
        <section className="text-left space-y-8 border-t border-white/[0.08] pt-12 mt-8">
          <div className="bg-[#090d15] border border-white/[0.08] rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase tracking-widest mb-3">
              <Compass className="w-4 h-4" /> Algorithmic Arbitrage
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
              Overcoming the Fatigue of Infinite Choice
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
              Modern video-on-demand services operate on catalog volume rather than curated intent. This creates choice fatigue, leading viewers to spend more time debating titles than experiencing cinema. <strong>Cine-Roulette</strong> replaces circular evaluation with randomized selection grounded in verified critical consensus.
            </p>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Every roulette pool queries exclusively from films holding at least 500 verified community votes and a high-tier critical baseline, removing low-fidelity filler from the draw.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-[#090d15] border border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-center gap-2 text-rose-400 mb-2">
                <Shuffle className="w-4 h-4" />
                <h3 className="text-sm font-bold text-white">Controlled Randomness</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Stochastic pagination queries ensure you never cycle the same predictable suggestions on repeated spins.
              </p>
            </div>

            <div className="bg-[#090d15] border border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-center gap-2 text-emerald-400 mb-2">
                <ShieldCheck className="w-4 h-4" />
                <h3 className="text-sm font-bold text-white">Quality Thresholds</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                A hard minimum vote threshold protects against unverified or low-reception media records.
              </p>
            </div>

            <div className="bg-[#090d15] border border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-center gap-2 text-amber-400 mb-2">
                <Flame className="w-4 h-4" />
                <h3 className="text-sm font-bold text-white">Genre Fusion</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pulls cross-genre pairings (such as Sci-Fi plus Mystery) to surface hybrid storytelling rather than flat categories.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-950/20 via-[#090d15] to-rose-950/20 border border-white/[0.08] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-base font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-400" /> Prefer Structured Discovery?
              </h3>
              <p className="text-xs text-slate-400">
                Switch to Couch Mode to tune films by exact runtime and mental bandwidth.
              </p>
            </div>
            <Link
              href="/couch-mode"
              className="bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition duration-200 shrink-0"
            >
              Open Couch Mode →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
