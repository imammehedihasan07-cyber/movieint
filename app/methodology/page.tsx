import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Cpu, ShieldCheck, Layers, Database, Sparkles, Activity, Gauge } from "lucide-react";

export const metadata: Metadata = {
  title: "Algorithm & Scoring Methodology",
  description:
    "An architectural breakdown of the MOVIEINT narrative score, weighted telemetry calculations, and algorithmic movie intelligence.",
  alternates: {
    canonical: "https://www.movieint.com/methodology",
  },
};

export default function MethodologyPage() {
  return (
    <main className="min-h-screen bg-[#05070b] text-slate-100 px-4 py-12 flex flex-col items-center selection:bg-indigo-600 selection:text-white relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[400px] bg-gradient-to-b from-indigo-600/10 via-rose-950/5 to-transparent pointer-events-none -z-0" />

      <div className="max-w-4xl w-full z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-200 mb-8 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Discover
        </Link>

        <div className="mb-10 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono mb-4">
            <Cpu className="w-3.5 h-3.5" /> ARCHITECTURAL TELEMETRY
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
            Ranking & Scoring Methodology
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            How MOVIEINT computes multi-dimensional cinematic scores, narrative complexity vectors, and unbiased ranking weights across tens of thousands of media properties.
          </p>
        </div>

        {/* Section 1: Normalization */}
        <section className="bg-[#090d15] border border-white/[0.08] rounded-3xl p-6 sm:p-8 mb-8">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" /> Beyond Flat Averages
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            Most legacy rating aggregators depend on arithmetic averages vulnerable to review-bombing, regional demographic distortion, or low-sample outliers. MOVIEINT solves this by running every title through a multi-tier normalization model:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-2xl">
              <h3 className="text-xs font-mono uppercase text-indigo-300 font-bold mb-1">
                1. Bayesian Prior Adjustment
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Titles with low review counts are weighted toward the global cinematic mean (R(prior)), dampening artificial 10/10 or 1/10 spikes.
              </p>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-2xl">
              <h3 className="text-xs font-mono uppercase text-indigo-300 font-bold mb-1">
                2. Velocity & Recency Decay
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sudden spikes in ratings are tempered using a logarithmic decay function, differentiating enduring masterpieces from marketing-driven release hype.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Four Core Telemetry Pillars */}
        <section className="bg-[#090d15] border border-white/[0.08] rounded-3xl p-6 sm:p-8 mb-8">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Gauge className="w-5 h-5 text-amber-400" /> Core Telemetry Metrics Explained
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Every movie entry on MOVIEINT is indexed against four algorithmic telemetry indices to guide viewers based on intent and cognitive bandwidth:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-amber-300 font-mono font-bold uppercase">
                <span>Brainpower Index</span>
                <span>0 - 100</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Quantifies narrative density, philosophical undertones, timeline non-linearity, and required cognitive attention.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-cyan-300 font-mono font-bold uppercase">
                <span>Pacing Cadence</span>
                <span>Dynamic Scale</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Evaluates runtime velocity, dialogue frequency, and narrative momentum from slow-burn contemplation to rapid kinetic progression.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-rose-300 font-mono font-bold uppercase">
                <span>Twist & Climax Factor</span>
                <span>Verified %</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Measures the structural volatility of third-act narrative subversions and surprise revelation velocity without spoiling specifics.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-emerald-300 font-mono font-bold uppercase">
                <span>Rewatch Value</span>
                <span>0 - 100</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Determines how much hidden context, layered foreshadowing, and visual craft reward repeated viewings.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Narrative DNA */}
        <section className="bg-[#090d15] border border-white/[0.08] rounded-3xl p-6 sm:p-8 mb-8">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Layers className="w-5 h-5 text-rose-400" /> Narrative DNA & Vibe Clustering
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            Standard genre tags like "Action" or "Drama" are too broad. MOVIEINT tags each title with a multidimensional mood matrix:
          </p>
          <div className="space-y-3">
            <div className="border-l-2 border-rose-500/40 pl-4 py-1">
              <h4 className="text-sm font-semibold text-white">Atmosphere & Mood Classification</h4>
              <p className="text-xs text-slate-400 mt-1">
                Pinpoints emotional output—whether existential, edge-of-seat dread, melancholic introspection, or adrenaline-fueled escapism.
              </p>
            </div>
            <div className="border-l-2 border-indigo-500/40 pl-4 py-1">
              <h4 className="text-sm font-semibold text-white">Target Audience Mapping</h4>
              <p className="text-xs text-slate-400 mt-1">
                Matches the title to appropriate viewing occasions—such as solo cerebral exploration, social watch-parties, or low-energy couch relaxation.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Data Provenance */}
        <section className="bg-[#090d15] border border-white/[0.08] rounded-3xl p-6 sm:p-8 mb-8">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400" /> Data Provenance & Open Standards
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Foundational metadata is synchronized with global cinematic records (including TMDB). Streaming license indicators are evaluated per region. MOVIEINT operates strictly as an intelligence and discovery engine and does not host media streams.
          </p>
        </section>

        <footer className="text-center pt-6 border-t border-white/[0.06] flex flex-col items-center gap-3">
          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <Link href="/editorial" className="text-indigo-400 hover:underline">Editorial Guides</Link>
            <span>•</span>
            <Link href="/rankings" className="text-cyan-400 hover:underline">Rankings</Link>
            <span>•</span>
            <Link href="/roulette" className="text-amber-400 hover:underline">Cine-Roulette</Link>
          </div>
          <p className="text-xs text-slate-500">
            For methodology feedback or telemetry queries, reach us at{" "}
            <a href="mailto:contact@movieint.com" className="text-indigo-400 hover:underline">
              contact@movieint.com
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
