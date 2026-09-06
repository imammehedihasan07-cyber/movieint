"use client";

import { useEffect, useState, useRef } from "react";
import { Zap, AlertTriangle, RefreshCw, Download, Check, Loader2, ShieldAlert } from "lucide-react";
import { toPng } from "html-to-image";

interface ClimaxData {
  mindFuckScore: number;
  boredomRisk: "Low" | "Moderate" | "High";
  pacingStyle: string;
  climaxAdvisory: string;
  rewatchValue: string;
}

function computeBaselineClimax(title: string, overview: string = "", rating: number = 7.0): ClimaxData {
  const text = (title + " " + overview).toLowerCase();

  let mindFuck = Math.min(Math.max(rating - 0.5, 4.0), 8.5);
  if (text.includes("mystery") || text.includes("secret") || text.includes("twist") || text.includes("truth") || text.includes("conspiracy")) {
    mindFuck = Math.min(mindFuck + 1.8, 9.8);
  } else if (text.includes("sci-fi") || text.includes("dimension") || text.includes("mind") || text.includes("dream")) {
    mindFuck = Math.min(mindFuck + 1.5, 9.6);
  }

  let boredomRisk: "Low" | "Moderate" | "High" = "Low";
  if (rating < 6.0) {
    boredomRisk = "Moderate";
  }

  let pacingStyle = "Standard Rhythmic Build";
  if (text.includes("action") || text.includes("race") || text.includes("escape") || text.includes("chase")) {
    pacingStyle = "High-Velocity Acceleration";
    boredomRisk = "Low";
  } else if (text.includes("investigat") || text.includes("drama") || text.includes("crime")) {
    pacingStyle = "Methodical Slow-Burn";
  }

  let rewatchValue = "High (Layered Nuances)";
  if (mindFuck > 7.5) {
    rewatchValue = "Exceptional (Foreshadowing)";
  } else if (mindFuck < 5.5) {
    rewatchValue = "Moderate (Direct Narrative)";
  }

  const advisory = `Maintain active attention during the pivotal turning points. The narrative progression hinges on subtle thematic cues established in the first two acts before converging in the climax.`;

  return {
    mindFuckScore: Number(mindFuck.toFixed(1)),
    boredomRisk,
    pacingStyle,
    climaxAdvisory: advisory,
    rewatchValue,
  };
}

export default function ClimaxIndex({
  title,
  overview,
  year,
  rating = 7.0,
}: {
  title: string;
  overview: string;
  year?: string;
  rating?: number;
}) {
  const [data, setData] = useState<ClimaxData>(() => computeBaselineClimax(title, overview, rating));
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchIndex() {
      try {
        const res = await fetch("/api/climax-index", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, overview }),
        });
        if (res.ok) {
          const result = await res.json();
          if (isMounted && result && result.mindFuckScore) {
            setData(result);
          }
        }
      } catch (e) {
        console.error("AI Climax refinement error:", e);
      }
    }

    if (title && overview) {
      fetchIndex();
    }

    return () => {
      isMounted = false;
    };
  }, [title, overview]);

  const handleDownloadCard = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `${title.toLowerCase().replace(/\s+/g, "-")}-cinema-dna.png`;
      link.href = dataUrl;
      link.click();
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (err) {
      console.error("Card generation failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="mb-10">
      {/* Visual Exportable Wrapper */}
      <div
        ref={cardRef}
        className="bg-gradient-to-b from-[#0e1422] to-[#070a10] border border-white/[0.08] rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden"
      >
        {/* Subtle Ambient Background Light */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-rose-500/10 blur-3xl -z-0 pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10 border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-rose-300 font-bold">
              Spoiler-Free Readiness Index
            </span>
          </div>

          <div className="text-[10px] font-mono text-slate-400">
            MOVIEINT.COM ARCHIVAL
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 relative z-10">
          {/* Mind-Fuck Potency Meter */}
          <div className="bg-[#05070b]/90 border border-white/[0.06] p-4 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3 text-rose-400" /> Twist Potency
            </span>
            <div className="my-2">
              <span className="text-2xl sm:text-3xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-300">
                {data.mindFuckScore.toFixed(1)}
              </span>
              <span className="text-xs text-slate-500 font-mono"> / 10</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-rose-500 to-amber-400 h-full"
                style={{ width: `${Math.min(data.mindFuckScore * 10, 100)}%` }}
              />
            </div>
          </div>

          {/* Boredom Risk */}
          <div className="bg-[#05070b]/90 border border-white/[0.06] p-4 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-400" /> Boredom Risk
            </span>
            <p
              className={`text-lg sm:text-xl font-bold mt-2 ${
                data.boredomRisk === "Low"
                  ? "text-emerald-400"
                  : data.boredomRisk === "Moderate"
                  ? "text-amber-400"
                  : "text-rose-400"
              }`}
            >
              {data.boredomRisk}
            </p>
            <span className="text-[10px] text-slate-500 font-mono">Engagement barrier</span>
          </div>

          {/* Pacing Style */}
          <div className="bg-[#05070b]/90 border border-white/[0.06] p-4 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Pacing Cadence
            </span>
            <p className="text-sm sm:text-base font-bold text-white mt-2 truncate">
              {data.pacingStyle}
            </p>
            <span className="text-[10px] text-slate-500 font-mono">Story velocity</span>
          </div>

          {/* Rewatch Value */}
          <div className="bg-[#05070b]/90 border border-white/[0.06] p-4 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <RefreshCw className="w-3 h-3 text-indigo-400" /> Rewatch Value
            </span>
            <p className="text-sm sm:text-base font-bold text-indigo-300 mt-2 truncate">
              {data.rewatchValue}
            </p>
            <span className="text-[10px] text-slate-500 font-mono">Hidden layers</span>
          </div>
        </div>

        {/* Climax Advisory Banner */}
        <div className="bg-rose-950/20 border border-rose-500/20 rounded-2xl p-4 mb-4 relative z-10">
          <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest block mb-1">
            ⚡ Critical Viewing Advisory:
          </span>
          <p className="text-xs sm:text-sm text-slate-200 italic font-serif leading-relaxed">
            "{data.climaxAdvisory}"
          </p>
        </div>

        {/* Card Footer Info for Social Export */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 relative z-10">
          <span>{title} {year ? `(${year})` : ""}</span>
          <span>Verified by Neural Cinema Vectors</span>
        </div>
      </div>

      {/* Social Export Button */}
      <div className="flex justify-end mt-3">
        <button
          onClick={handleDownloadCard}
          disabled={downloading}
          className="inline-flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold backdrop-blur-md transition cursor-pointer shadow-lg disabled:opacity-40"
        >
          {downloading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Generating Social Card...</span>
            </>
          ) : downloaded ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Downloaded to Device!</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Export Shareable Card</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
