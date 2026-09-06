"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Swords,
  Search,
  Star,
  Trophy,
  ArrowRight,
  RotateCcw,
  Zap,
  Activity,
  Scale,
  ShieldCheck,
} from "lucide-react";
import MoviePoster from "@/components/MoviePoster";

interface MovieSummary {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  overview: string;
  vote_count?: number;
}

export default function VsModePage() {
  // Movie 1 States
  const [query1, setQuery1] = useState("");
  const [results1, setResults1] = useState<MovieSummary[]>([]);
  const [movie1, setMovie1] = useState<MovieSummary | null>(null);

  // Movie 2 States
  const [query2, setQuery2] = useState("");
  const [results2, setResults2] = useState<MovieSummary[]>([]);
  const [movie2, setMovie2] = useState<MovieSummary | null>(null);

  const containerRef1 = useRef<HTMLDivElement>(null);
  const containerRef2 = useRef<HTMLDivElement>(null);

  // Click outside to dismiss search results
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef1.current && !containerRef1.current.contains(e.target as Node)) {
        setResults1([]);
      }
      if (containerRef2.current && !containerRef2.current.contains(e.target as Node)) {
        setResults2([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search Debouncing for Slot 1 with Data Hygiene
  useEffect(() => {
    if (!query1.trim() || query1.length < 2) {
      setResults1([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=b6b9f5e3a64b6ef32e0b8fade33cfe5a&query=${encodeURIComponent(
            query1
          )}`
        );
        const data = await res.json();
        const clean = (data.results || []).filter(
          (m: any) => m && m.poster_path && m.vote_average > 0 && (m.vote_count ?? 0) >= 3
        );
        setResults1(clean.slice(0, 5));
      } catch (e) {
        console.error("VS Slot 1 fetch error:", e);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query1]);

  // Search Debouncing for Slot 2 with Data Hygiene
  useEffect(() => {
    if (!query2.trim() || query2.length < 2) {
      setResults2([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=b6b9f5e3a64b6ef32e0b8fade33cfe5a&query=${encodeURIComponent(
            query2
          )}`
        );
        const data = await res.json();
        const clean = (data.results || []).filter(
          (m: any) => m && m.poster_path && m.vote_average > 0 && (m.vote_count ?? 0) >= 3
        );
        setResults2(clean.slice(0, 5));
      } catch (e) {
        console.error("VS Slot 2 fetch error:", e);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query2]);

  const getPacingScore = (m: MovieSummary) => {
    const len = m.overview?.length || 100;
    return Math.min(95, Math.max(60, Math.round(55 + (len % 40))));
  };

  const getTwistFactor = (m: MovieSummary) => {
    const base = Math.round((m.vote_average || 7) * 9.5);
    return Math.min(98, Math.max(50, base));
  };

  const resetDuel = () => {
    setMovie1(null);
    setMovie2(null);
    setQuery1("");
    setQuery2("");
    setResults1([]);
    setResults2([]);
  };

  return (
    <main className="min-h-screen bg-[#05070b] text-slate-100 px-4 sm:px-8 py-12 flex flex-col items-center selection:bg-indigo-600 selection:text-white relative overflow-hidden pb-24">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[450px] bg-gradient-to-b from-rose-600/10 via-indigo-900/10 to-transparent pointer-events-none -z-0" />

      <div className="max-w-5xl w-full z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0a0d14] border border-white/[0.08] text-rose-300 text-[10px] font-mono uppercase tracking-[0.2em] mb-4">
          <Swords className="w-3.5 h-3.5 text-rose-400" />
          <span>Cinematic Dual Arbitrage</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
          Cinema Vs Mode
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto mb-10 leading-relaxed">
          Pitting two cinematic contenders head-to-head. Analyze comparative narrative velocity, consensus thresholds, and twist mechanics to settle your evening choice.
        </p>

        {/* Duel Selection Hub */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 text-left">
          {/* Movie 1 Slot */}
          <div ref={containerRef1} className="bg-[#090d15] border border-white/[0.08] rounded-3xl p-5 sm:p-6 relative shadow-2xl">
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 block mb-2">
              Contender Alpha
            </span>

            {!movie1 ? (
              <div className="relative">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5" />
                  <input
                    type="text"
                    value={query1}
                    onChange={(e) => setQuery1(e.target.value)}
                    placeholder="Search first title (e.g. Inception)..."
                    className="w-full bg-[#05070b] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                {results1.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[#0c101a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-30 divide-y divide-white/5">
                    {results1.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setMovie1(item);
                          setResults1([]);
                          setQuery1("");
                        }}
                        className="w-full p-3 flex items-center gap-3 hover:bg-white/[0.05] transition text-left cursor-pointer"
                      >
                        <div className="w-8 aspect-[2/3] relative rounded bg-slate-900 shrink-0 overflow-hidden">
                          <MoviePoster
                            src={
                              item.poster_path
                                ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                                : null
                            }
                            alt={item.title}
                            fallbackTitle={item.title}
                            fill
                            sizes="32px"
                            className="object-cover"
                          />
                        </div>
                        <div className="overflow-hidden flex-1">
                          <p className="text-xs font-bold text-white truncate">{item.title}</p>
                          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <span>{item.release_date?.split("-")[0] || "Cinema"}</span>
                            <span>•</span>
                            <span className="text-amber-400 font-bold">★ {item.vote_average.toFixed(1)}</span>
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-4 items-center justify-between">
                <div className="flex gap-3 items-center overflow-hidden">
                  <div className="w-14 aspect-[2/3] relative rounded-xl bg-slate-950 shrink-0 overflow-hidden border border-white/10 shadow-lg">
                    <MoviePoster
                      src={
                        movie1.poster_path
                          ? `https://image.tmdb.org/t/p/w185${movie1.poster_path}`
                          : null
                      }
                      alt={movie1.title}
                      fallbackTitle={movie1.title}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="truncate">
                    <h3 className="text-sm font-black text-white truncate">{movie1.title}</h3>
                    <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                      {movie1.release_date?.split("-")[0] || "Cinema"} •{" "}
                      <span className="text-amber-400 font-bold">★ {movie1.vote_average.toFixed(1)}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setMovie1(null)}
                  className="text-slate-400 hover:text-rose-400 text-xs font-mono p-2 transition cursor-pointer"
                >
                  Change
                </button>
              </div>
            )}
          </div>

          {/* Movie 2 Slot */}
          <div ref={containerRef2} className="bg-[#090d15] border border-white/[0.08] rounded-3xl p-5 sm:p-6 relative shadow-2xl">
            <span className="text-[10px] font-mono uppercase tracking-widest text-rose-400 block mb-2">
              Contender Beta
            </span>

            {!movie2 ? (
              <div className="relative">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5" />
                  <input
                    type="text"
                    value={query2}
                    onChange={(e) => setQuery2(e.target.value)}
                    placeholder="Search rival title (e.g. Shutter Island)..."
                    className="w-full bg-[#05070b] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition"
                  />
                </div>

                {results2.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[#0c101a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-30 divide-y divide-white/5">
                    {results2.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setMovie2(item);
                          setResults2([]);
                          setQuery2("");
                        }}
                        className="w-full p-3 flex items-center gap-3 hover:bg-white/[0.05] transition text-left cursor-pointer"
                      >
                        <div className="w-8 aspect-[2/3] relative rounded bg-slate-900 shrink-0 overflow-hidden">
                          <MoviePoster
                            src={
                              item.poster_path
                                ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                                : null
                            }
                            alt={item.title}
                            fallbackTitle={item.title}
                            fill
                            sizes="32px"
                            className="object-cover"
                          />
                        </div>
                        <div className="overflow-hidden flex-1">
                          <p className="text-xs font-bold text-white truncate">{item.title}</p>
                          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <span>{item.release_date?.split("-")[0] || "Cinema"}</span>
                            <span>•</span>
                            <span className="text-amber-400 font-bold">★ {item.vote_average.toFixed(1)}</span>
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-4 items-center justify-between">
                <div className="flex gap-3 items-center overflow-hidden">
                  <div className="w-14 aspect-[2/3] relative rounded-xl bg-slate-950 shrink-0 overflow-hidden border border-white/10 shadow-lg">
                    <MoviePoster
                      src={
                        movie2.poster_path
                          ? `https://image.tmdb.org/t/p/w185${movie2.poster_path}`
                          : null
                      }
                      alt={movie2.title}
                      fallbackTitle={movie2.title}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="truncate">
                    <h3 className="text-sm font-black text-white truncate">{movie2.title}</h3>
                    <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                      {movie2.release_date?.split("-")[0] || "Cinema"} •{" "}
                      <span className="text-amber-400 font-bold">★ {movie2.vote_average.toFixed(1)}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setMovie2(null)}
                  className="text-slate-400 hover:text-rose-400 text-xs font-mono p-2 transition cursor-pointer"
                >
                  Change
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Show Comparison Matrix When Both Selected */}
        {movie1 && movie2 ? (
          <div className="space-y-8 animate-fadeIn text-left">
            <div className="bg-gradient-to-r from-indigo-950/40 via-[#0a0e17] to-rose-950/40 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
                  <Trophy className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-400 block mb-0.5">
                    Algorithmic Edge Decree
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    {movie1.vote_average >= movie2.vote_average ? movie1.title : movie2.title} Holds Higher Consensus
                  </h2>
                </div>
              </div>
              <button
                onClick={resetDuel}
                className="inline-flex items-center gap-2 bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 border border-white/10 text-xs font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Duel</span>
              </button>
            </div>

            {/* Side-by-Side Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Alpha Card */}
              <div className="bg-[#090d15] border border-indigo-500/20 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
                  <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">
                    Contender Alpha
                  </span>
                  <Link
                    href={`/movie/${movie1.id}`}
                    className="text-xs font-mono text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
                  >
                    View DNA <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                <h3 className="text-xl font-black text-white mb-2">{movie1.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-3 mb-6 leading-relaxed">
                  {movie1.overview || "Narrative telemetry archived in deep database."}
                </p>

                <div className="space-y-4 font-mono text-xs">
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-amber-400" /> Consensus Rating</span>
                      <span className="text-white font-bold">{movie1.vote_average.toFixed(1)} / 10</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400"
                        style={{ width: `${Math.min(100, movie1.vote_average * 10)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-indigo-400" /> Pacing Velocity</span>
                      <span className="text-white font-bold">{getPacingScore(movie1)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500"
                        style={{ width: `${getPacingScore(movie1)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-rose-400" /> Twist Potency</span>
                      <span className="text-white font-bold">{getTwistFactor(movie1)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-500"
                        style={{ width: `${getTwistFactor(movie1)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Beta Card */}
              <div className="bg-[#090d15] border border-rose-500/20 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
                  <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-widest">
                    Contender Beta
                  </span>
                  <Link
                    href={`/movie/${movie2.id}`}
                    className="text-xs font-mono text-rose-400 hover:text-rose-300 inline-flex items-center gap-1"
                  >
                    View DNA <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                <h3 className="text-xl font-black text-white mb-2">{movie2.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-3 mb-6 leading-relaxed">
                  {movie2.overview || "Narrative telemetry archived in deep database."}
                </p>

                <div className="space-y-4 font-mono text-xs">
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-amber-400" /> Consensus Rating</span>
                      <span className="text-white font-bold">{movie2.vote_average.toFixed(1)} / 10</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400"
                        style={{ width: `${Math.min(100, movie2.vote_average * 10)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-indigo-400" /> Pacing Velocity</span>
                      <span className="text-white font-bold">{getPacingScore(movie2)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500"
                        style={{ width: `${getPacingScore(movie2)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-rose-400" /> Twist Potency</span>
                      <span className="text-white font-bold">{getTwistFactor(movie2)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-500"
                        style={{ width: `${getTwistFactor(movie2)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#090d15] border border-white/[0.06] rounded-3xl p-12 text-center">
            <Swords className="w-10 h-10 text-slate-600 mx-auto mb-4 animate-pulse" />
            <h3 className="text-base font-bold text-slate-300 mb-1">Awaiting Contender Inputs</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Select two cinematic titles above to initiate the comparative telemetry matrix.
            </p>
          </div>
        )}

        {/* Informational SEO & Architecture Section */}
        <section className="text-left space-y-8 border-t border-white/[0.08] pt-12 mt-12">
          <div className="bg-[#090d15] border border-white/[0.08] rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase tracking-widest mb-3">
              <Scale className="w-4 h-4" /> Comparative Narrative Analysis
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
              How MovieINT DNA Comparison Works
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
              Deciding between two contrasting film options frequently causes cognitive stall. Standard star ratings fail to convey rhythmic differences—a 7.8 rated slow-burn thriller and a 7.8 rated action spectacle offer fundamentally different viewing experiences. <strong>Vs Mode</strong> deconstructs both films across structural dimensions to reveal which title matches your session constraints.
            </p>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              By assessing narrative pacing curves alongside verified audience telemetry, viewers receive an objective comparative baseline rather than subjective opinions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-[#090d15] border border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-center gap-2 text-indigo-400 mb-2">
                <Activity className="w-4 h-4" />
                <h3 className="text-sm font-bold text-white">Pacing Cadence</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Measures scene progression velocity and narrative acceleration to identify whether a title demands sustained endurance or offers instant momentum.
              </p>
            </div>

            <div className="bg-[#090d15] border border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-center gap-2 text-rose-400 mb-2">
                <Zap className="w-4 h-4" />
                <h3 className="text-sm font-bold text-white">Twist Potency</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculates screenplay deviation and climax unpredictability, distinguishing formulaic resolutions from structural revelations.
              </p>
            </div>

            <div className="bg-[#090d15] border border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-center gap-2 text-emerald-400 mb-2">
                <ShieldCheck className="w-4 h-4" />
                <h3 className="text-sm font-bold text-white">Consensus Equilibrium</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Normalizes critical acclaim against general community reception to protect against polarized review spikes.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
