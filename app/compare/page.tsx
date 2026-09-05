"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Swords, Sparkles, Loader2, Search, CheckCircle2, Star, Film } from "lucide-react";

interface SelectedMovie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  overview: string;
  vote_average: number;
}

export default function ComparePage() {
  const [query1, setQuery1] = useState("");
  const [query2, setQuery2] = useState("");
  const [searchList1, setSearchList1] = useState<SelectedMovie[]>([]);
  const [searchList2, setSearchList2] = useState<SelectedMovie[]>([]);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);

  const [movie1, setMovie1] = useState<SelectedMovie | null>(null);
  const [movie2, setMovie2] = useState<SelectedMovie | null>(null);

  const [comparing, setComparing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);

  // Debounced Search Contender 1
  useEffect(() => {
    if (!query1.trim()) {
      setSearchList1([]);
      setOpen1(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading1(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=b6b9f5e3a64b6ef32e0b8fade33cfe5a&query=${encodeURIComponent(
            query1
          )}`
        );
        const data = await res.json();
        setSearchList1(data.results?.slice(0, 6) || []);
        setOpen1(true);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading1(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query1]);

  // Debounced Search Contender 2
  useEffect(() => {
    if (!query2.trim()) {
      setSearchList2([]);
      setOpen2(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading2(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=b6b9f5e3a64b6ef32e0b8fade33cfe5a&query=${encodeURIComponent(
            query2
          )}`
        );
        const data = await res.json();
        setSearchList2(data.results?.slice(0, 6) || []);
        setOpen2(true);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading2(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query2]);

  // Click Outside Listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref1.current && !ref1.current.contains(e.target as Node)) {
        setOpen1(false);
      }
      if (ref2.current && !ref2.current.contains(e.target as Node)) {
        setOpen2(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Run AI Comparison
  const handleRunComparison = async () => {
    if (!movie1 || !movie2) return;
    setComparing(true);
    setAnalysis(null);

    try {
      const res = await fetch("/api/compare-dna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movie1: { title: movie1.title, year: movie1.release_date?.split("-")[0], overview: movie1.overview },
          movie2: { title: movie2.title, year: movie2.release_date?.split("-")[0], overview: movie2.overview },
        }),
      });
      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      console.error(err);
    } finally {
      setComparing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#05070b] text-slate-100 px-4 py-12 flex flex-col items-center selection:bg-indigo-600 selection:text-white relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[400px] bg-gradient-to-b from-indigo-600/10 via-rose-900/5 to-transparent pointer-events-none -z-0" />

      <div className="max-w-5xl w-full z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0a0d14] border border-white/[0.08] text-indigo-300 text-[10px] font-mono uppercase tracking-[0.2em] mb-4">
            <Swords className="w-3.5 h-3.5 text-indigo-400" />
            <span>Versus Intelligence Matrix</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
            Movie DNA Comparison
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Pit any two cinematic works against each other. Let neural metrics benchmark their structural tension and thematic depth.
          </p>
        </div>

        {/* Selection Arena */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative mb-8">
          {/* Contender Alpha */}
          <div ref={ref1} className="relative bg-[#090d15] border border-white/[0.08] rounded-3xl p-6 flex flex-col justify-between">
            <h3 className="text-xs font-mono uppercase tracking-widest text-indigo-400 mb-3">
              Contender Alpha
            </h3>

            {movie1 ? (
              <div className="flex gap-4 items-center bg-[#05070b] border border-indigo-500/30 p-3 rounded-2xl">
                <div className="w-16 aspect-[2/3] relative rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-white/10">
                  {movie1.poster_path ? (
                    <Image src={`https://image.tmdb.org/t/p/w200${movie1.poster_path}`} alt={movie1.title} fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-[10px] text-slate-600">No Image</div>
                  )}
                </div>
                <div className="flex-grow truncate">
                  <h4 className="font-bold text-sm text-white truncate">{movie1.title}</h4>
                  <p className="text-[11px] font-mono text-slate-500">{movie1.release_date?.split("-")[0] || "TBA"}</p>
                  <button onClick={() => { setMovie1(null); setQuery1(""); }} className="text-[11px] font-semibold text-rose-400 hover:underline mt-1 cursor-pointer">
                    Change Film
                  </button>
                </div>
                <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
              </div>
            ) : (
              <div className="relative">
                <div className="relative flex items-center bg-[#05070b] border border-white/[0.1] rounded-2xl p-1.5 focus-within:border-indigo-500 transition">
                  <Search className="w-4 h-4 text-slate-400 ml-2.5 mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search film (e.g. Interstellar, Toxic)..."
                    value={query1}
                    onChange={(e) => setQuery1(e.target.value)}
                    onFocus={() => searchList1.length > 0 && setOpen1(true)}
                    className="w-full bg-transparent px-2 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                  {loading1 && <Loader2 className="w-4 h-4 text-indigo-400 animate-spin mr-2" />}
                </div>

                {/* Smart Autocomplete Dropdown 1 */}
                {open1 && searchList1.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[#090d15] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-white/[0.05]">
                    {searchList1.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => {
                          setMovie1(m);
                          setOpen1(false);
                          setQuery1("");
                        }}
                        className="flex items-center gap-3 p-2.5 hover:bg-white/[0.05] cursor-pointer transition text-left"
                      >
                        <div className="w-8 h-12 relative bg-slate-900 rounded overflow-hidden shrink-0">
                          {m.poster_path ? (
                            <Image src={`https://image.tmdb.org/t/p/w92${m.poster_path}`} alt={m.title} fill className="object-cover" />
                          ) : (
                            <Film className="w-4 h-4 m-auto text-slate-600" />
                          )}
                        </div>
                        <div className="flex-grow truncate">
                          <h5 className="text-xs font-bold text-white truncate">{m.title}</h5>
                          <span className="text-[10px] font-mono text-slate-500">{m.release_date?.split("-")[0] || "TBA"}</span>
                        </div>
                        {m.vote_average ? (
                          <div className="flex items-center gap-1 text-amber-400 text-xs shrink-0 pr-1">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>{m.vote_average.toFixed(1)}</span>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Contender Beta */}
          <div ref={ref2} className="relative bg-[#090d15] border border-white/[0.08] rounded-3xl p-6 flex flex-col justify-between">
            <h3 className="text-xs font-mono uppercase tracking-widest text-rose-400 mb-3">
              Contender Beta
            </h3>

            {movie2 ? (
              <div className="flex gap-4 items-center bg-[#05070b] border border-rose-500/30 p-3 rounded-2xl">
                <div className="w-16 aspect-[2/3] relative rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-white/10">
                  {movie2.poster_path ? (
                    <Image src={`https://image.tmdb.org/t/p/w200${movie2.poster_path}`} alt={movie2.title} fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-[10px] text-slate-600">No Image</div>
                  )}
                </div>
                <div className="flex-grow truncate">
                  <h4 className="font-bold text-sm text-white truncate">{movie2.title}</h4>
                  <p className="text-[11px] font-mono text-slate-500">{movie2.release_date?.split("-")[0] || "TBA"}</p>
                  <button onClick={() => { setMovie2(null); setQuery2(""); }} className="text-[11px] font-semibold text-rose-400 hover:underline mt-1 cursor-pointer">
                    Change Film
                  </button>
                </div>
                <CheckCircle2 className="w-5 h-5 text-rose-400 shrink-0" />
              </div>
            ) : (
              <div className="relative">
                <div className="relative flex items-center bg-[#05070b] border border-white/[0.1] rounded-2xl p-1.5 focus-within:border-rose-500 transition">
                  <Search className="w-4 h-4 text-slate-400 ml-2.5 mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search film (e.g. Oppenheimer, Dune)..."
                    value={query2}
                    onChange={(e) => setQuery2(e.target.value)}
                    onFocus={() => searchList2.length > 0 && setOpen2(true)}
                    className="w-full bg-transparent px-2 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                  {loading2 && <Loader2 className="w-4 h-4 text-rose-400 animate-spin mr-2" />}
                </div>

                {/* Smart Autocomplete Dropdown 2 */}
                {open2 && searchList2.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[#090d15] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-white/[0.05]">
                    {searchList2.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => {
                          setMovie2(m);
                          setOpen2(false);
                          setQuery2("");
                        }}
                        className="flex items-center gap-3 p-2.5 hover:bg-white/[0.05] cursor-pointer transition text-left"
                      >
                        <div className="w-8 h-12 relative bg-slate-900 rounded overflow-hidden shrink-0">
                          {m.poster_path ? (
                            <Image src={`https://image.tmdb.org/t/p/w92${m.poster_path}`} alt={m.title} fill className="object-cover" />
                          ) : (
                            <Film className="w-4 h-4 m-auto text-slate-600" />
                          )}
                        </div>
                        <div className="flex-grow truncate">
                          <h5 className="text-xs font-bold text-white truncate">{m.title}</h5>
                          <span className="text-[10px] font-mono text-slate-500">{m.release_date?.split("-")[0] || "TBA"}</span>
                        </div>
                        {m.vote_average ? (
                          <div className="flex items-center gap-1 text-amber-400 text-xs shrink-0 pr-1">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>{m.vote_average.toFixed(1)}</span>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Confrontation Action Trigger */}
        <div className="flex justify-center mb-12">
          <button
            onClick={handleRunComparison}
            disabled={!movie1 || !movie2 || comparing}
            className="bg-gradient-to-r from-indigo-600 to-rose-600 hover:opacity-95 text-white font-bold px-8 py-3.5 rounded-2xl transition flex items-center gap-2.5 shadow-xl shadow-indigo-950/50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            {comparing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Synchronizing Neural Vectors...</span>
              </>
            ) : (
              <>
                <Swords className="w-4 h-4" />
                <span>Execute DNA Confrontation</span>
              </>
            )}
          </button>
        </div>

        {/* AI Comparison Results Matrix */}
        {analysis && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-[#090d15] border border-indigo-500/30 rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-mono uppercase tracking-widest mb-3">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Scholarly Divergence Verdict</span>
              </div>
              <p className="text-sm sm:text-base text-slate-200 font-serif italic max-w-2xl mx-auto leading-relaxed">
                "{analysis.comparisonVerdict}"
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contender 1 Card */}
              <div className="bg-[#090d15] border border-white/[0.08] rounded-3xl p-6 space-y-4">
                <h4 className="text-lg font-black text-white">{movie1?.title}</h4>
                <p className="text-xs text-indigo-400 font-mono">"{analysis.filmA.coreStrength}"</p>

                <div className="space-y-3 pt-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1 text-slate-300">
                      <span>Pacing Velocity</span>
                      <span className="font-mono font-bold text-indigo-400">{analysis.filmA.pacingScore} / 10</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: `${analysis.filmA.pacingScore * 10}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1 text-slate-300">
                      <span>Narrative Complexity</span>
                      <span className="font-mono font-bold text-indigo-400">{analysis.filmA.complexityScore} / 10</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: `${analysis.filmA.complexityScore * 10}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1 text-slate-300">
                      <span>Climax / Ending Twist Impact</span>
                      <span className="font-mono font-bold text-indigo-400">{analysis.filmA.climaxTwistScore} / 10</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: `${analysis.filmA.climaxTwistScore * 10}%` }} />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.06]">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">Target Audience:</span>
                  <p className="text-xs text-slate-300">{analysis.recommendedFor.filmA}</p>
                </div>
              </div>

              {/* Contender 2 Card */}
              <div className="bg-[#090d15] border border-white/[0.08] rounded-3xl p-6 space-y-4">
                <h4 className="text-lg font-black text-white">{movie2?.title}</h4>
                <p className="text-xs text-rose-400 font-mono">"{analysis.filmB.coreStrength}"</p>

                <div className="space-y-3 pt-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1 text-slate-300">
                      <span>Pacing Velocity</span>
                      <span className="font-mono font-bold text-rose-400">{analysis.filmB.pacingScore} / 10</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500" style={{ width: `${analysis.filmB.pacingScore * 10}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1 text-slate-300">
                      <span>Narrative Complexity</span>
                      <span className="font-mono font-bold text-rose-400">{analysis.filmB.complexityScore} / 10</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500" style={{ width: `${analysis.filmB.complexityScore * 10}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1 text-slate-300">
                      <span>Climax / Ending Twist Impact</span>
                      <span className="font-mono font-bold text-rose-400">{analysis.filmB.climaxTwistScore} / 10</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500" style={{ width: `${analysis.filmB.climaxTwistScore * 10}%` }} />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.06]">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">Target Audience:</span>
                  <p className="text-xs text-slate-300">{analysis.recommendedFor.filmB}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}