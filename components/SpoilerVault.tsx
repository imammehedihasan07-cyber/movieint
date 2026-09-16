"use client";

import { useState } from "react";
import { Lock, Unlock, EyeOff, Sparkles, Loader2, KeyRound, ShieldAlert } from "lucide-react";

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
      console.error("Spoiler Vault decryption failure:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-[#080c14] border border-red-500/20 rounded-3xl p-6 sm:p-8 my-10 relative overflow-hidden shadow-2xl">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-950/20 blur-3xl pointer-events-none -z-0" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08] relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-red-950/60 border border-red-500/30 text-red-400 font-mono text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-3 h-3" />
              Restricted Intelligence
            </span>
            <span className="text-zinc-500 text-xs font-mono">Protected Decryption</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Spoiler Vault™ <span className="text-xs font-mono font-normal text-slate-500">v2.4</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Deep narrative breakdown, climax twist decoding & philosophical resolution for <span className="text-white font-medium">{title}</span>.
          </p>
        </div>

        {unlocked && (
          <button
            onClick={() => setUnlocked(false)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-xs font-mono text-zinc-400 border border-white/10 transition self-start sm:self-center"
          >
            <Lock className="w-3.5 h-3.5" /> Lock Vault
          </button>
        )}
      </div>

      {/* Content State: Locked */}
      {!unlocked ? (
        <div className="py-10 flex flex-col items-center justify-center text-center relative z-10 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shadow-inner">
            <EyeOff className="w-6 h-6" />
          </div>
          <div className="max-w-md">
            <h4 className="text-base font-bold text-white">Full Ending & Climax Shielded</h4>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Contains complete narrative resolution, structural twists, and final ambiguity verdicts. Proceed only if you have completed viewing this title.
            </p>
          </div>
          <button
            onClick={handleDecryptEnding}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-red-950/50 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Decrypting Screenplay Telemetry...</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Unlock Climax Telemetry</span>
              </>
            )}
          </button>
        </div>
      ) : (
        /* Content State: Unlocked */
        <div className="pt-6 relative z-10 space-y-6 text-left">
          {data ? (
            <>
              <div className="space-y-2">
                <h4 className="text-xs font-mono text-amber-400 uppercase tracking-widest font-semibold">
                  [01] Climax Sequence & Resolution
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed bg-white/[0.02] border border-white/[0.05] p-4 rounded-xl">
                  {data.endingSummary || "Narrative ending breakdown successfully decrypted."}
                </p>
              </div>

              {data.hiddenClues && data.hiddenClues.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-semibold">
                    [02] Structural Foreshadowing & Clues
                  </h4>
                  <ul className="grid grid-cols-1 gap-2">
                    {data.hiddenClues.map((clue, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-slate-300 bg-white/[0.02] border border-white/[0.05] p-3 rounded-lg flex items-start gap-2.5"
                      >
                        <span className="text-indigo-400 font-mono font-bold">0{idx + 1}.</span>
                        <span className="leading-relaxed">{clue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1.5">
                  <h4 className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
                    Thematic Meaning
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {data.philosophicalThematicMeaning || "Philosophical resonance aligned with core narrative motifs."}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1.5">
                  <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold">
                    Ambiguity Verdict
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {data.finalAmbiguityVerdict || "Definitive closure achieved with deliberate subtextual questions."}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <p className="text-xs text-red-400">Error rendering decrypted stream. Please re-lock and try again.</p>
          )}
        </div>
      )}

      {/* Disclaimers */}
      <div className="mt-8 pt-4 border-t border-white/[0.06] text-center">
        <p className="text-[10px] font-mono text-slate-500">
          MovieINT Spoiler Vault™ utilizes analytical screenplay indices to explain endings without unauthorized stream reproduction.
        </p>
      </div>
    </section>
  );
}
