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

function computeBaselineDNA(title: string, genres: string = "", voteAverage: number = 7.0, overview: string = ""): DNAData {
  const g = genres.toLowerCase();
  const text = overview.toLowerCase();
  
  let pacing = "Dynamic Narrative Flow";
  if (g.includes("action") || g.includes("thriller") || g.includes("adventure") || text.includes("chase") || text.includes("race")) {
    pacing = "High-Octane Dynamic";
  } else if (g.includes("drama") || g.includes("mystery") || g.includes("documentary") || text.includes("investigate")) {
    pacing = "Slow-Burn Atmospheric";
  } else if (g.includes("animation") || g.includes("comedy")) {
    pacing = "Brisk & Engaging";
  }

  let complexity = Math.min(Math.max(Math.round(voteAverage), 5), 9);
  if (g.includes("sci-fi") || g.includes("mystery") || text.includes("conspiracy") || text.includes("future")) {
    complexity = Math.min(complexity + 1, 10);
  }

  let endingImpact = "Resonant Resolution";
  if (g.includes("mystery") || g.includes("thriller") || text.includes("secret") || text.includes("truth")) {
    endingImpact = "High Twist Index";
  } else if (g.includes("horror")) {
    endingImpact = "Lingering Psychological Dread";
  } else if (g.includes("comedy") || g.includes("family")) {
    endingImpact = "Uplifting Closure";
  } else if (g.includes("drama")) {
    endingImpact = "Emotionally Piercing";
  }

  let emotionalTone = "Cinematic Narrative";
  if (g.includes("drama")) emotionalTone = "Emotionally Grounded";
  if (g.includes("sci-fi")) emotionalTone = "Philosophical & Cerebral";
  if (g.includes("action") || g.includes("crime")) emotionalTone = "Adrenaline-Charged";
  if (g.includes("romance")) emotionalTone = "Intimate & Heartfelt";
  if (g.includes("horror")) emotionalTone = "Claustrophobic & Ominous";

  const primaryGenre = genres.split(",")[0]?.trim() || "cinematic storytelling";
  const assessment = `Calculated narrative telemetry highlights notable thematic precision within ${primaryGenre}. With an established critical baseline of ${voteAverage.toFixed(1)}/10, the plot emphasizes ${pacing.toLowerCase()} pacing paired with an ending characterized by ${endingImpact.toLowerCase()}.`;

  return {
    pacing,
    complexityScore: complexity,
    endingImpact,
    emotionalTone,
    whyWatch: assessment,
  };
}

export default function MovieDNA({ title, overview, genres = "", voteAverage = 7.0 }: DNAProps) {
  const [dna, setDna] = useState<DNAData>(() => computeBaselineDNA(title, genres, voteAverage, overview));
  const [isAiRefining, setIsAiRefining] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchDNA() {
      setIsAiRefining(true);
      try {
        const res = await fetch("/api/movie-dna", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, overview }),
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data && data.pacing) {
            setDna(data);
          }
        }
      } catch (err) {
        console.error("AI DNA refinement error:", err);
      } finally {
        if (isMounted) setIsAiRefining(false);
      }
    }

    if (title && overview) {
      fetchDNA();
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
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-slate-500 animate-pulse">
            <Loader2 className="w-3 h-3 text-rose-500 animate-spin" />
            Fine-tuning telemetry...
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
