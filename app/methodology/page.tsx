import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Cpu, ShieldCheck, Scale, Sliders, Database, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "Algorithm & Ranking Methodology | MOVIEINT",
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
            Ranking & Narrative Methodology
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            How MOVIEINT computes multi-dimensional cinematic scores, narrative complexity vectors, and unbiased ranking weights across tens of thousands of media properties.
          </p>
        </div>

        {/* Section 1: Overview */}
        <section className="bg-[#090d15] border border-white/[0.08] rounded-3xl p-6 sm:p-8 mb-8">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" /> Beyond Flat Averages
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            Most legacy rating aggregators depend on arithmetic averages vulnerable to review-bombing, regional demographic distortion, or low-sample outliers. MOVIEINT solves this by running every title through a four-tier normalization model:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-2xl">
              <h3 className="text-xs font-mono uppercase text-indigo-300 font-bold mb-1">
                1. Bayesian Prior Adjustment
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Titles with limited vote samples are anchored toward a statistical mean to prevent false top-ranking inflation.
              </p>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-2xl">
              <h3 className="text-xs font-mono uppercase text-indigo-300 font-bold mb-1">
                2. Velocity & Recency Decay
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sudden spikes in ratings are tempered using a logarithmic decay function, differentiating genuine classics from transient hype.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Narrative DNA */}
        <section className="bg-[#090d15] border border-white/[0.08] rounded-3xl p-6 sm:p-8 mb-8">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Layers className="w-5 h-5 text-rose-400" /> Narrative DNA Indexing
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            The MOVIEINT Narrative DNA system evaluates titles based on dynamic storytelling parameters rather than simple genre classifications:
          </p>
          <div className="space-y-4">
            <div className="border-l-2 border-rose-500/40 pl-4">
              <h4 className="text-sm font-semibold text-white">Pacing Vector</h4>
              <p className="text-xs text-slate-400 mt-1">
                Measured by scene density, runtime, and dialogue cadence. Categorized from <em>High-Octane Dynamic</em> to <em>Slow-Burn Atmospheric</em>.
              </p>
            </div>
            <div className="border-l-2 border-rose-500/40 pl-4">
              <h4 className="text-sm font-semibold text-white">Complexity Score (1 - 10)</h4>
              <p className="text-xs text-slate-400 mt-1">
                Derived from non-linear timelines, layered subplots, thematic ambiguity, and cognitive demands placed on the audience.
              </p>
            </div>
            <div className="border-l-2 border-rose-500/40 pl-4">
              <h4 className="text-sm font-semibold text-white">Ending Impact Index</h4>
              <p className="text-xs text-slate-400 mt-1">
                Analyzes climax structure, revelation intensity, emotional finality, and psychological lingering resonance.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Data Integrity */}
        <section className="bg-[#090d15] border border-white/[0.08] rounded-3xl p-6 sm:p-8 mb-8">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400" /> Data Provenance & Ethics
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            All foundational cinematic metadata is indexed via trusted global open databases including The Movie Database (TMDB). MOVIEINT does not host video streams; regional availability is matched against verified distribution catalogs to provide accurate streaming discovery for global audiences.
          </p>
        </section>

        <footer className="text-center pt-6 border-t border-white/[0.06]">
          <p className="text-xs text-slate-500">
            Methodology is continuously refined. Inquiries regarding telemetry can be directed to{" "}
            <a href="mailto:contact@movieint.com" className="text-indigo-400 hover:underline">
              contact@movieint.com
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
