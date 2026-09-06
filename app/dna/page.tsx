"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Dna,
  Search,
  Sparkles,
  Activity,
  Brain,
  Disc3,
  Layers,
  Loader2,
  Star,
  Film,
  HelpCircle,
  Zap,
  Gauge,
  Compass,
} from "lucide-react";

interface MovieOption {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  overview: string;
  vote_average?: number;
}

interface DNAResult {
  pacing: string;
  pacingScore: number;
  complexityScore: number;
  endingImpact: string;
  emotionalTone: string;
  plotDepth: string;
  targetAudience: string;
  whyWatch: string;
}

export default function MovieDNAPage() {
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [movieList, setMovieList] = useState<MovieOption[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<MovieOption | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [dnaData, setDnaData] = useState<DNAResult | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!search.trim()) {
      setMovieList([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=b6b9f5e3a64b6ef32e0b8fade33cfe5a&query=${encodeURIComponent(
            search
          )}`
        );
        const data = await res.json();
        if (data.results) {
          setMovieList(data.results.slice(0, 6));
          setIsOpen(true);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAnalyzeDNA = async (movie: MovieOption) => {
    setSelectedMovie(movie);
    setSearch(movie.title);
    setIsOpen(false);
    setAnalyzing(true);
    setDnaData(null);

    try {
      const res = await fetch("/api/movie-dna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: movie.title, overview: movie.overview }),
      });
      const data = await res.json();
      setDnaData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (movieList.length > 0) {
      handleAnalyzeDNA(movieList[0]);
    }
  };

  return (
    <main className="min-h-screen bg-[#05070b] text-slate-100 px-4 py-12 flex flex-col items-center selection:bg-indigo-600 selection:text-white relative overflow-hidden pb-24">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[450px] bg-gradient-to-b from-indigo-600/10 via-purple-900/5 to-transparent pointer-events-none -z-0" />

      <div className="max-w-4xl w-full z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full text-indigo-400 text-xs font-semibold mb-4">
            <Dna className="w-4 h-4" /> Cinematic Intelligence Engine
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3">
            Movie DNA Analyzer
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Select or search any film to dissect its psychological depth, pacing rhythm, and narrative structure using AI vectors.
          </p>
        </div>

        <div ref={containerRef} className="relative mb-10 max-w-2xl mx-auto">
          <form onSubmit={handleFormSubmit}>
            <div className="relative flex items-center bg-[#090d15] border border-white/[0.1] rounded-2xl p-2 shadow-2xl focus-within:border-indigo-500/80 focus-within:ring-2 focus-within:ring-indigo-500/20 transition duration-200">
              <Search className="w-5 h-5 text-indigo-400 ml-3 mr-2 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => movieList.length > 0 && setIsOpen(true)}
                placeholder="Type movie name (e.g. Oppenheimer, Interstellar, Toxic)..."
                className="w-full bg-transparent px-2 py-2 text-slate-100 placeholder-slate-500 focus:outline-none text-sm"
              />
              <div className="flex items-center gap-2 pr-2">
                {searching && <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />}
                <button
                  type="submit"
                  disabled={searching || !search.trim()}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-xl transition text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 cursor-pointer disabled:opacity-40"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Analyze</span>
                </button>
              </div>
            </div>
          </form>

          {isOpen && movieList.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#090d15] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-white/[0.05] animate-fadeIn">
              {movieList.map((m) => (
                <div
                  key={m.id}
                  onClick={() => handleAnalyzeDNA(m)}
                  className="flex items-center gap-3.5 p-3 hover:bg-white/[0.05] cursor-pointer transition duration-150 group text-left"
                >
                  <div className="w-10 h-14 relative bg-slate-900 rounded-lg overflow-hidden shrink-0 border border-white/5">
                    {m.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w185${m.poster_path}`}
                        alt={m.title}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[9px] text-slate-600">
                        <Film className="w-4 h-4 text-slate-700" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow truncate">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-indigo-400 transition truncate">
                        {m.title}
                      </h4>
                      <span className="text-[11px] font-mono text-slate-500">
                        ({m.release_date?.split("-")[0] || "TBA"})
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {m.overview || "No overview available."}
                    </p>
                  </div>
                  {m.vote_average ? (
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold shrink-0 pl-2">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{m.vote_average.toFixed(1)}</span>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>

        {analyzing && (
          <div className="bg-[#090d15] border border-white/[0.08] rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-3 shadow-2xl animate-fadeIn mb-12">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            <p className="text-sm font-bold text-slate-200">
              Dissecting Narrative DNA for "{selectedMovie?.title}"...
            </p>
            <p className="text-xs text-slate-500">
              Evaluating psychological depth, ending impact, and structural complexity through neural vectors.
            </p>
          </div>
        )}

        {dnaData && selectedMovie && !analyzing && (
          <div className="bg-[#090d15] border border-white/[0.08] rounded-3xl p-6 sm:p-8 animate-fadeIn shadow-2xl mb-12">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-8 pb-6 border-b border-white/[0.06]">
              <div className="w-28 sm:w-36 aspect-[2/3] relative rounded-2xl overflow-hidden shadow-2xl bg-slate-900 shrink-0 border border-white/10">
                {selectedMovie.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                    alt={selectedMovie.title}
                    fill
                    sizes="(max-width: 640px) 112px, 144px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-slate-600">No Image</div>
                )}
              </div>
              <div className="text-center sm:text-left flex-grow">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-mono uppercase mb-2">
                  Target Synced
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">
                  {selectedMovie.title}
                </h2>
                <p className="text-xs font-mono text-slate-500 mb-3">{selectedMovie.release_date}</p>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  {selectedMovie.overview}
                </p>
              </div>
            </div>

            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Core Structural Vectors
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-[#05070b] border border-white/[0.06] p-4 rounded-2xl">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <Activity className="w-4 h-4 text-rose-400" /> Pacing Cadence
                </div>
                <p className="text-sm sm:text-base font-bold text-white">{dnaData.pacing}</p>
                <p className="text-[10px] text-slate-500 mt-1 font-mono">Velocity: {dnaData.pacingScore} / 10</p>
              </div>

              <div className="bg-[#05070b] border border-white/[0.06] p-4 rounded-2xl">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <Brain className="w-4 h-4 text-indigo-400" /> Complexity
                </div>
                <p className="text-sm sm:text-base font-bold text-white">{dnaData.complexityScore} / 10</p>
                <p className="text-[10px] text-slate-500 mt-1 font-mono">{dnaData.plotDepth}</p>
              </div>

              <div className="bg-[#05070b] border border-white/[0.06] p-4 rounded-2xl">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <Disc3 className="w-4 h-4 text-amber-400" /> Ending Impact
                </div>
                <p className="text-sm sm:text-base font-bold text-white">{dnaData.endingImpact}</p>
                <p className="text-[10px] text-slate-500 mt-1 font-mono">Climax & lingering shock</p>
              </div>

              <div className="bg-[#05070b] border border-white/[0.06] p-4 rounded-2xl">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <Layers className="w-4 h-4 text-emerald-400" /> Emotional Tone
                </div>
                <p className="text-sm sm:text-base font-bold text-white truncate">{dnaData.emotionalTone}</p>
                <p className="text-[10px] text-slate-500 mt-1 font-mono">{dnaData.targetAudience}</p>
              </div>
            </div>

            {dnaData.whyWatch && (
              <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-2xl p-4 sm:p-5">
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest block mb-1">
                  Cinematic Verdict:
                </span>
                <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed font-serif">
                  "{dnaData.whyWatch}"
                </p>
              </div>
            )}
          </div>
        )}

        <section className="text-left mt-8 space-y-8">
          <div className="bg-[#090d15] border border-white/[0.08] rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase tracking-widest mb-3">
              <HelpCircle className="w-4 h-4" /> Comprehensive Anatomy
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
              What is Movie DNA & Narrative Intelligence?
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
              Traditional film categories rely on broad genres such as "Drama," "Sci-Fi," or "Action." However, two films sharing identical genre classifications often provide radically different viewing experiences. MOVIEINT’s <strong>Narrative DNA Architecture</strong> decomposes films into cognitive and structural vectors, quantifying pacing rhythm, cerebral complexity, and climax impact.
            </p>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              By mapping these storytelling telemetry metrics, MOVIEINT accurately predicts mental bandwidth requirements, narrative tension curves, and thematic alignment—ensuring you select the exact film suited for your current focus and emotional bandwidth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-[#090d15] border border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-center gap-2 text-rose-400 mb-2">
                <Gauge className="w-4 h-4" />
                <h3 className="text-sm font-bold text-white">Pacing Vector</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Evaluates narrative momentum, scene length variance, and plot velocity. Identifies whether a film is a rapid <em>High-Octane Dynamic</em> ride or an introspective, slow-burning character study.
              </p>
            </div>

            <div className="bg-[#090d15] border border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-center gap-2 text-indigo-400 mb-2">
                <Brain className="w-4 h-4" />
                <h3 className="text-sm font-bold text-white">Complexity Score</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Measures non-linear chronological timelines, multi-character subplots, philosophical subtext, and ambiguous themes that demand active audience cognitive engagement.
              </p>
            </div>

            <div className="bg-[#090d15] border border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-center gap-2 text-amber-400 mb-2">
                <Zap className="w-4 h-4" />
                <h3 className="text-sm font-bold text-white">Ending & Twist Potency</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Quantifies the residual psychological shock and resolution architecture of the final act—categorizing endings from clean resolution closures to high-twist paradigm shifts.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-950/20 via-[#090d15] to-rose-950/20 border border-white/[0.08] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-base font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                <Compass className="w-4 h-4 text-indigo-400" /> Explore Algorithmic Architecture
              </h3>
              <p className="text-xs text-slate-400">
                Learn how MOVIEINT calculates Bayesian weighted scores and streaming telemetry.
              </p>
            </div>
            <Link
              href="/methodology"
              className="bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition duration-200 shrink-0"
            >
              Read Methodology →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
