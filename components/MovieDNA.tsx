"use client";

import { useEffect, useState } from "react";
import { 
  Sparkles, Activity, Brain, Heart, Zap, 
  AlertTriangle, RotateCcw, Loader2, Gauge, Flame 
} from "lucide-react";

interface DNAProps {
  title: string;
  overview: string;
  genres?: string;
  voteAverage?: number;
  runtime?: number;
}

export interface DeepDNAMetrics {
  pacing: { score: number; label: string };
  complexity: { score: number; label: string };
  emotionalResonance: { score: number; label: string };
  twistPotency: { score: number; label: string };
  boredomRisk: { score: number; label: string };
  rewatchValue: { score: number; label: string };
  archetype: string;
  whyWatch: string;
}

export function computeBaselineDNA(
  title: string,
  genres: string = "",
  voteAverage: number = 7.0,
  overview: string = "",
  runtime: number = 110
): DeepDNAMetrics {
  const g = genres.toLowerCase();
  const text = overview.toLowerCase();
  const rating = Number(voteAverage) || 7.0;

  // 1. Pacing Calculation
  let pacingScore = 65;
  let pacingLabel = "Steady & Measured";
  if (g.includes("action") || g.includes("thriller") || g.includes("adventure") || text.includes("chase")) {
    pacingScore = Math.min(96, Math.round(72 + rating * 2.2));
    pacingLabel = "Rapid & High-Tension";
  } else if (g.includes("drama") || g.includes("mystery") || g.includes("documentary")) {
    pacingScore = runtime > 135 ? 48 : 62;
    pacingLabel = runtime > 135 ? "Slow-Burn & Atmospheric" : "Deliberate Narrative Flow";
  } else if (g.includes("comedy") || g.includes("animation")) {
    pacingScore = 80;
    pacingLabel = "Brisk & Kinetic";
  }

  // 2. Complexity Calculation
  let complexityScore = 55;
  let complexityLabel = "Accessible Structure";
  if (g.includes("sci-fi") || g.includes("mystery") || text.includes("conspiracy") || text.includes("timeline")) {
    complexityScore = Math.min(98, Math.round(68 + rating * 2.8));
    complexityLabel = complexityScore > 84 ? "Multi-Layered / Mind-Bending" : "Intricate Subplots";
  } else if (g.includes("action") || g.includes("comedy")) {
    complexityScore = Math.max(30, Math.round(38 + rating * 1.5));
    complexityLabel = "Direct & Visceral";
  }

  // 3. Emotional Resonance
  let emotionalScore = Math.min(98, Math.max(20, Math.round(rating * 9.6 + 4)));
  let emotionalLabel = emotionalScore > 82 ? "Profound & Cathartic" : emotionalScore > 65 ? "Deep Character Empathy" : "Balanced Sentiment";

  // 4. Twist / Ending Potency
  let twistScore = 50;
  let twistLabel = "Organic Resolution";
  if (g.includes("mystery") || g.includes("thriller") || g.includes("horror") || text.includes("secret") || text.includes("truth")) {
    twistScore = Math.min(98, Math.round(70 + rating * 2.4));
    twistLabel = twistScore > 86 ? "Shattering Paradigm Shift" : "High Climax Volatility";
  } else if (g.includes("drama")) {
    twistScore = Math.min(78, Math.round(rating * 6.5));
    twistLabel = "Resonant Climax";
  }

  // 5. Boredom Risk (Inverse: Lower is safer)
  let boredomScore = Math.max(5, Math.min(88, Math.round((10 - rating) * 9 + (runtime > 140 ? 12 : 0))));
  let boredomLabel = boredomScore < 25 ? "Extremely Low (Edge-of-Seat)" : boredomScore < 50 ? "Moderate Attention Required" : "Demands High Patience";

  // 6. Rewatch Value
  let rewatchScore = Math.min(96, Math.max(25, Math.round(rating * 6.8 + complexityScore * 0.32)));
  let rewatchLabel = rewatchScore > 78 ? "Essential Rewatch (Layered Lore)" : rewatchScore > 55 ? "Rewatchable High Moments" : "Single-Experience Impact";

  // 7. Narrative Archetype
  let archetype = "Linear Hero's Journey";
  if (complexityScore > 82 && twistScore > 80) archetype = "Puzzle-Box / Labyrinthine";
  else if (pacingScore > 80 && twistScore > 70) archetype = "Accelerating Thrill Engine";
  else if (g.includes("drama") && emotionalScore > 80) archetype = "Tragic Catharsis / Character Study";
  else if (g.includes("sci-fi")) archetype = "Philosophical Speculative Exploration";

  const assessment = `MOVIEINT Telemetry evaluates "${title}" as a ${archetype.toLowerCase()} framework. With a narrative pacing index of ${pacingScore}/100 and structural complexity pegged at ${complexityScore}/100, the narrative targets ${emotionalLabel.toLowerCase()} with a climactic twist potency of ${twistScore}/100.`;

  return {
    pacing: { score: pacingScore, label: pacingLabel },
    complexity: { score: complexityScore, label: complexityLabel },
    emotionalResonance: { score: emotionalScore, label: emotionalLabel },
    twistPotency: { score: twistScore, label: twistLabel },
    boredomRisk: { score: boredomScore, label: boredomLabel },
    rewatchValue: { score: rewatchScore, label: rewatchLabel },
    archetype,
    whyWatch: assessment,
  };
}

export default function MovieDNA({
  title,
  overview,
  genres = "",
  voteAverage = 7.0,
  runtime = 110,
}: DNAProps) {
  const [dna, setDna] = useState<DeepDNAMetrics>(() =>
    computeBaselineDNA(title, genres, voteAverage, overview, runtime)
  );
  const [isAiRefining, setIsAiRefining] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchDNA() {
      setIsAiRefining(true);
      try {
        const res = await fetch("/api/movie-dna", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, overview, genres, voteAverage, runtime }),
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data && data.pacing) {
            setDna((prev) => ({
              ...prev,
              ...data,
            }));
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
  }, [title, overview, genres, voteAverage, runtime]);

  const metricsGrid = [
    {
      title: "Pacing Velocity",
      score: dna.pacing.score,
      label: dna.pacing.label,
      icon: Activity,
      color: "text-emerald-400",
      barColor: "bg-emerald-500",
    },
    {
      title: "Narrative Complexity",
      score: dna.complexity.score,
      label: dna.complexity.label,
      icon: Brain,
      color: "text-purple-400",
      barColor: "bg-purple-500",
    },
    {
      title: "Emotional Resonance",
      score: dna.emotionalResonance.score,
      label: dna.emotionalResonance.label,
      icon: Heart,
      color: "text-rose-400",
      barColor: "bg-rose-500",
    },
    {
      title: "Climax / Twist Potency",
      score: dna.twistPotency.score,
      label: dna.twistPotency.label,
      icon: Zap,
      color: "text-amber-400",
      barColor: "bg-amber-500",
    },
    {
      title: "Boredom Risk Index",
      score: dna.boredomRisk.score,
      label: dna.boredomRisk.label,
      icon: AlertTriangle,
      color: "text-cyan-400",
      barColor: "bg-cyan-500",
    },
    {
      title: "Rewatch Longevity",
      score: dna.rewatchValue.score,
      label: dna.rewatchValue.label,
      icon: RotateCcw,
      color: "text-indigo-400",
      barColor: "bg-indigo-500",
    },
  ];

  return (
    <div className="bg-[#090d15]/95 border border-white/[0.08] rounded-2xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
            Narrative DNA Architecture
            <span className="text-[10px] font-mono font-normal text-slate-400 bg-white/[0.05] border border-white/10 px-2 py-0.5 rounded-full">
              {dna.archetype}
            </span>
          </h3>
        </div>
        {isAiRefining && (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-indigo-400 animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin" />
            Fine-tuning Telemetry...
          </span>
        )}
      </div>

      {/* The 6 Pillars Telemetry Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        {metricsGrid.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="bg-black/40 border border-white/[0.04] p-3 rounded-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-slate-300 text-[11px] font-semibold">
                    <Icon className={`w-3.5 h-3.5 ${m.color}`} />
                    <span>{m.title}</span>
                  </div>
                  <span className={`text-xs font-mono font-bold ${m.color}`}>
                    {m.score}/100
                  </span>
                </div>
                <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mb-1.5">
                  <div
                    className={`${m.barColor} h-full rounded-full transition-all duration-700`}
                    style={{ width: `${m.score}%` }}
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-400 font-mono truncate">{m.label}</p>
            </div>
          );
        })}
      </div>

      {dna.whyWatch && (
        <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-xl p-3.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-400 mb-1">
            <Flame className="w-3.5 h-3.5 text-indigo-400" />
            <span>Narrative Intelligence Synthesis</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">{dna.whyWatch}</p>
        </div>
      )}
    </div>
  );
}
