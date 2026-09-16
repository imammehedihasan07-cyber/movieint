import React from 'react';
import { Sliders, Database, RefreshCw, ShieldCheck, Cpu } from 'lucide-react';

export default function RankingsMethodology() {
  return (
    <div className="w-full my-8 p-6 rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] text-slate-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/10 pb-4 mb-5">
        <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm tracking-wide">
          <Sliders className="w-4 h-4" />
          <span>How MovieINT Cinema Rankings Are Calculated</span>
        </div>
        <span className="text-[11px] font-mono text-slate-400 bg-white/[0.04] px-2.5 py-1 rounded-md border border-white/5 w-fit">
          Autonomous Telemetry Standard
        </span>
      </div>

      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
        Unlike unweighted popular consensus engines or subjective reviewer aggregates, MovieINT computes ranking indices through multi-factor algorithmic normalization. Every cinema title is evaluated across narrative mechanics, structural cohesion, and global catalog movements.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
          <div className="flex items-center gap-2 text-white font-medium mb-1.5">
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span>Data Sources & Thresholds</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Ingests verified metadata, structural scripts, and community metrics with a strict minimum engagement threshold.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
          <div className="flex items-center gap-2 text-white font-medium mb-1.5">
            <Cpu className="w-3.5 h-3.5 text-rose-400" />
            <span>Algorithmic Telemetry</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Scores pacing speed, cognitive narrative complexity, third-act twist impact, and emotional trajectory.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
          <div className="flex items-center gap-2 text-white font-medium mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Rating Normalization</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Corrects for recency bias, review-bombing anomalies, and demographic skew using Bayesian weighting models.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
          <div className="flex items-center gap-2 text-white font-medium mb-1.5">
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Update Frequency</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Telemetry models recalculate dynamic shifts weekly to capture catalog additions and structural re-evaluations.
          </p>
        </div>
      </div>
    </div>
  );
}
