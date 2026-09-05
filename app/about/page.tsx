import Link from "next/link";
import { ArrowLeft, Sparkles, Film, Dna, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#05070b] text-slate-100 px-4 py-16 flex flex-col items-center">
      <div className="max-w-3xl w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-200 mb-8 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Discover
        </Link>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono uppercase mb-4">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>About MOVIEINT</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white mb-6">
          Cinematic Intelligence & Narrative Telemetry
        </h1>

        <div className="space-y-6 text-sm text-slate-300 leading-relaxed font-normal">
          <p>
            MOVIEINT is an autonomous cinema and television series intelligence platform engineered to eliminate choice paralysis, evaluate structural climax twists, and decode narrative DNA without spoiling crucial plot trajectories.
          </p>

          <p>
            Powered by high-throughput neural language models and dynamic telemetry from TMDB, MOVIEINT categorizes storytelling arcs, psychological pacing, and verified legal streaming availability worldwide.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
            <div className="p-4 rounded-2xl bg-[#090d15] border border-white/[0.06]">
              <Dna className="w-5 h-5 text-indigo-400 mb-2" />
              <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-1">
                Narrative DNA
              </h3>
              <p className="text-xs text-slate-400">
                Multi-dimensional breakdown of pacing, atmospheric dread, and intellectual complexity.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#090d15] border border-white/[0.06]">
              <ShieldCheck className="w-5 h-5 text-emerald-400 mb-2" />
              <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-1">
                Spoiler-Free Metrics
              </h3>
              <p className="text-xs text-slate-400">
                Calibrated climax ratings allowing viewers to gauge ending intensity safely.
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-500 font-mono">
            Direct questions, partnership queries, or sponsorship inquiries: contact@movieint.com
          </p>
        </div>
      </div>
    </main>
  );
}