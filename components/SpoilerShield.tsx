'use client';

import { useState } from 'react';
import { Eye, EyeOff, AlertTriangle } from 'lucide-react';

interface SpoilerShieldProps {
  title: string;
  twistPotencyScore: number;
  overview: string;
}

export default function SpoilerShield({
  title,
  twistPotencyScore,
  overview,
}: SpoilerShieldProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="bg-[#090d15] border border-white/[0.08] rounded-3xl p-6 sm:p-8 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
            Climax & Narrative Twist Telemetry
          </h3>
        </div>
        <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300">
          Twist Index: {twistPotencyScore}/100
        </span>
      </div>

      <p className="text-xs text-slate-400 mb-6 leading-relaxed">
        Our Neural DNA isolates major third-act subversions and thematic resolutions.
        To maintain first-watch purity, climax breakdowns are shielded by default.
      </p>

      <div className="relative">
        <div
          className={`transition-all duration-500 text-xs sm:text-sm text-slate-300 leading-relaxed ${
            revealed ? 'blur-0 select-text' : 'blur-md select-none pointer-events-none opacity-40'
          }`}
        >
          <div className="bg-black/50 border border-white/5 rounded-2xl p-5 space-y-3">
            <p className="font-semibold text-indigo-300">
              Structural Climax Trajectory for {title}:
            </p>
            <p>
              {overview
                ? `The narrative momentum reorients expectations established during the first two acts. The resolution relies heavily on thematic foreshadowing embedded within key dialogue, driving the Twist Potency rating to ${twistPotencyScore}/100.`
                : 'Deep narrative trajectory and third-act resolution analyzed.'}
            </p>
            <p className="text-slate-400 text-xs">
              Resolution Impact: High recontextualization factor on rewatch.
            </p>
          </div>
        </div>

        {!revealed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <button
              onClick={() => setRevealed(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold font-mono shadow-xl shadow-indigo-950/50 transition cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              Reveal Narrative Breakdown
            </button>
          </div>
        )}

        {revealed && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setRevealed(false)}
              className="inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-400 hover:text-slate-200 transition cursor-pointer"
            >
              <EyeOff className="w-3.5 h-3.5" /> Conceal Spoilers
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
