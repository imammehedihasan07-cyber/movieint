"use client";

import { useEffect, useState } from "react";
import { Sparkles, Activity, Brain, Disc3, Loader2 } from "lucide-react";

interface DNAProps {
  title: string;
  overview: string;
  genres?: string;
  voteAverage?: number;
}

interface DNAData {
  pacing: string;
  complexityScore: number;
  endingImpact: string;
  emotionalTone: string;
  whyWatch: string;
}

function computeBaselineDNA(genres: string = "", voteAverage: number = 7.0): DNAData {
  const g = genres.toLowerCase();
  
  let pacing = "Moderate & Measured";
  if (g.includes("action") || g.includes("thriller") || g.includes("adventure")) {
    pacing = "High-Octane Dynamic";
  } else if (g.includes("drama") || g.includes("mystery") || g.includes("documentary")) {
    pacing = "Slow-Burn Atmospheric";
  }

  let complexity = Math.min(Math.max(Math.round(voteAverage), 5), 9);
  if (g.includes("sci-fi") || g.includes("mystery")) complexity = Math.min(complexity + 1, 10);

  let endingImpact = "Resonant Resolution";
  if (g.includes("mystery") || g.includes("thriller")) endingImpact = "High Twist Index";
  if (g.includes("horror")) endingImpact = "Dread Lingering";
  if (g.includes("comedy")) endingImpact = "Tonal Closure";

  let emotionalTone = "Cinematic Narrative";
  if (g.includes("drama")) emotionalTone = "Emotionally Grounded";
  if (g.includes("sci-fi")) emotionalTone = "Philosophical & Cerebral";
  if (g.includes("action")) emotionalTone = "Adrenaline-Charged";

  return {
    pacing,
    complexityScore: complexity,
    endingImpact,
    emotionalTone,
    whyWatch: `Calculated narrative telemetry highlights significant thematic depth with an audience consensus rating of ${voteAverage.toFixed(1)}/10.`,
  };
}

export default function MovieDNA({ title, overview, genres = "", voteAverage = 7.0 }: DNAProps) {
  const [dna, setDna] = useState<DNAData>(() => computeBaselineDNA(genres, voteAverage));
  const [isAiRefining, setIsAiRefining] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchDNA() {
      try {
        const res = await fetch("/api/movie-dna", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, overview }),
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data) {
            setDna(data);
          }
        }
      } catch (err) {
        console.error("AI DNA fetch error:", err);
      } finally {
        if (isMounted) setIsAiRefining(false);
      }
    }

    if (title && overview) {
      fetchDNA();
    } else {
      setIsAiRefining(false);
    }

    return () => {
      isMounted = false;
    };
  }, [title, overview]);

  return (
    <div className="bg-[#0a0d14]/80 border border-slate-800/90 rounded-2xl p-5 shadow-inner">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-rose-400" />
          <h3 className="text-xs font-bold text-rose-400 uppercase tracking-widest">
            Narrative DNA Intelligence
          </h3>
        </div>
        {isAiRefining && (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
            <Loader2 className="w-3 h-3 text-rose-500 animate-spin" />
            Fine-tuning with Gemini...
          </span>
        )}
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
          <span className="text-[11px] font-bold text-rose-400 block mb-0.5">Narrative Assessment:</span>
          <p className="text-xs text-slate-300 leading-relaxed italic">{dna.whyWatch}</p>
        </div>
      )}
    </div>
  );
}
