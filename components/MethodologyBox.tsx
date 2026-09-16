import React from 'react';
import { Cpu, ShieldCheck, RefreshCw, BarChart2 } from 'lucide-react';

export default function MethodologyBox() {
  return (
    <div className="w-full rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-zinc-900/60 to-zinc-950 p-6 sm:p-7 my-8 backdrop-blur-sm shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/10 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Algorithmic Telemetry & Ranking Methodology
            </h3>
            <span className="text-xs text-amber-400/80 font-mono">
              Independent Analytical Assessment Index
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-full w-fit">
          <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Refreshed Weekly</span>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6">
        MovieINT cinema rankings are not derived from raw popularity contests or unweighted audience voting. 
        Our autonomous index standardizes critical benchmarks across international databases, applying multi-tiered 
        data normalization, narrative structure telemetry, and Bayesian confidence scoring to eliminate ballot stuffing 
        and recency bias.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-950/60">
          <div className="flex items-center gap-2 text-zinc-200 font-semibold mb-1">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Data Normalization</span>
          </div>
          <p className="text-zinc-400 leading-normal">
            Multi-source variance control weighting verified critic consensus against verified viewer volume thresholds.
          </p>
        </div>

        <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-950/60">
          <div className="flex items-center gap-2 text-zinc-200 font-semibold mb-1">
            <BarChart2 className="w-4 h-4 text-amber-400" />
            <span>Narrative DNA Telemetry</span>
          </div>
          <p className="text-zinc-400 leading-normal">
            Algorithmic scoring factoring pacing velocity, structural complexity, and thematic resolution impact.
          </p>
        </div>

        <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-950/60">
          <div className="flex items-center gap-2 text-zinc-200 font-semibold mb-1">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span>Minimum Data Threshold</span>
          </div>
          <p className="text-zinc-400 leading-normal">
            Titles require verified catalog distribution telemetry before entering global narrative leaderboards.
          </p>
        </div>
      </div>
    </div>
  );
}
