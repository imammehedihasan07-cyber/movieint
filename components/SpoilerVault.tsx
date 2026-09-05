"use client";

import { useState } from "react";
import { Lock, Unlock, EyeOff, Sparkles, Loader2, KeyRound } from "lucide-react";

interface EndingData {
  endingSummary: string;
  hiddenClues: string[];
  philosophicalThematicMeaning: string;
  finalAmbiguityVerdict: string;
}

export default function SpoilerVault({
  title,
  year,
  overview,
}: {
  title: string;
  year?: string;
  overview: string;
}) {
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<EndingData | null>(null);

  const handleDecryptEnding = async () => {
    if (data) {
      setUnlocked(true);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/explain-ending", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, year, overview }),
      });
      const result = await res.json();
      setData(result);
      setUnlocked(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mb-14 text-left">
      <div className="bg-[#090d15] border border-rose-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-rose-600/5 blur-3xl pointer-events-none -z-0" />

        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <EyeOff className="w-4 h-4 text-rose-400" />
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-rose-300 font-bold">
              Spoiler Vault: Ending Decryption
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            RESTRICTED ACCESS
          </span>
        </div>

        {!unlocked ? (
          <div className="flex flex-col items-center justify-center text-center py-8 px-4 bg-[#05070b]/80 border border-white/[0.04] rounded-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-3">
              <Lock className="w-5 h-5 text-rose-400" />
            </div>
            <h4 className="text-base font-bold text-white mb-1">
              Classified Climax & Ambiguity Breakdown
            </h4>
            <p className="text-xs text-slate-400 max-w-md mb-5 leading-relaxed">
              Contains complete plot revelations, climax analysis, and hidden clues for <span className="text-slate-200 font-semibold">{title}</span>. Proceed only if you have watched the finale.
            </p>
            <button
              onClick={handleDecryptEnding}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-rose-950/50 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Decrypting Ending Vectors...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Decrypt Ending Explained</span>
                </>
              )}
            </button>
          </div>
        ) : (
          data && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono uppercase">
                  <Unlock className="w-3 h-3" /> Climax Decrypted
                </div>
                <button
                  onClick={() => setUnlocked(false)}
                  className="text-xs text-slate-500 hover:text-slate-300 transition"
                >
                  Hide Spoilers
                </button>
              </div>

              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  The Finale Decoded
                </h5>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-serif italic bg-white/[0.02] p-4 rounded-xl border border-white/5">
                  "{data.endingSummary}"
                </p>
              </div>

              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Hidden Clues Missed By Most Viewers
                </h5>
                <ul className="space-y-2">
                  {data.hiddenClues.map((clue, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-slate-300 flex items-start gap-2.5 bg-[#05070b] p-3 rounded-xl border border-white/[0.04]"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{clue}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#05070b] border border-white/[0.04] p-4 rounded-xl">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                    Philosophical / Thematic Intent
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {data.philosophicalThematicMeaning}
                  </p>
                </div>
                <div className="bg-[#05070b] border border-white/[0.04] p-4 rounded-xl">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                    Ambiguity Verdict
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {data.finalAmbiguityVerdict}
                  </p>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}