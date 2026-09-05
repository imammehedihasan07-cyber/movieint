"use client";

import { useEffect, useState } from "react";
import { Sparkles, Activity, Brain, Disc3, Loader2 } from "lucide-react";

interface DNAProps {
  title: string;
  overview: string;
}

interface DNAData {
  pacing: string;
  complexityScore: number;
  endingImpact: string;
  emotionalTone: string;
  whyWatch: string;
}

export default function MovieDNA({ title, overview }: DNAProps) {
  const [dna, setDna] = useState<DNAData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDNA() {
      try {
        const res = await fetch("/api/movie-dna", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, overview }),
        });
        const data = await res.json();
        setDna(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (title && overview) fetchDNA();
  }, [title, overview]);

  if (loading) {
    return (
      <div className="bg-[#0a0d14]/70 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-slate-400">
        <Loader2 className="w-5 h-5 text-rose-500 animate-spin" />
        <span className="text-xs">Decoding Movie DNA with Gemini...</span>
      </div>
    );
  }

  if (!dna) return null;

  return (
    <div className="bg-[#0a0d14]/80 border border-slate-800/90 rounded-2xl p-5 shadow-inner">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-rose-400" />
        <h3 className="text-xs font-bold text-rose-400 uppercase tracking-widest">
          AI Movie DNA Intelligence
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
            <Activity className="w-3.5 h-3.5 text-indigo-400" /> Pacing
          </div>
          <p className="text-xs font-semibold text-white">{dna.pacing}</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
            <Brain className="w-3.5 h-3.5 text-rose-400" /> Complexity
          </div>
          <p className="text-xs font-semibold text-white">{dna.complexityScore} / 10</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
            <Disc3 className="w-3.5 h-3.5 text-amber-400" /> Ending Impact
          </div>
          <p className="text-xs font-semibold text-white">{dna.endingImpact}</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Vibe Tone
          </div>
          <p className="text-xs font-semibold text-white truncate">{dna.emotionalTone}</p>
        </div>
      </div>

      {dna.whyWatch && (
        <div className="bg-rose-950/20 border border-rose-500/20 rounded-xl p-3">
          <span className="text-[11px] font-bold text-rose-400 block mb-0.5">Why Watch This:</span>
          <p className="text-xs text-slate-300 leading-relaxed italic">{dna.whyWatch}</p>
        </div>
      )}
    </div>
  );
}