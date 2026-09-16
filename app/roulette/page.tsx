import RouletteSeoContent from "@/components/RouletteSeoContent";
import { Metadata } from "next";
import RouletteClient from "@/components/RouletteClient";
import Link from "next/link";
import { Dices, Sparkles, Shuffle, Compass, HelpCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Cine-Roulette: Algorithmic Random Movie Selector | MOVIEINT",
  description: "Bypass streaming paralysis with Cine-Roulette. Spin curated mood clusters, atmospheric tension indices, and verified cinematic masterpieces at random.",
  alternates: {
    canonical: "https://www.movieint.com/roulette",
  },
  openGraph: {
    title: "Cine-Roulette: Random Film Discovery | MOVIEINT",
    description: "Curated random cinema selector filtered by atmospheric tension, mood affinity, and Narrative DNA.",
    url: "https://www.movieint.com/roulette",
    type: "website",
  },
};

export default function RoulettePage() {
  return (
    <main className="min-h-screen bg-[#07090e] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Interactive Roulette Wheel Client */}
        <RouletteClient />
        <RouletteSeoContent />

        {/* Crawlable SEO Editorial & Explanatory Guide */}
        <section className="mt-16 pt-12 border-t border-white/[0.08] text-left space-y-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-amber-400 text-xs font-mono mb-3">
              <Dices className="w-3.5 h-3.5" /> Serendipitous Discovery
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              How Cine-Roulette Works: Curated Randomness Over Chaos
            </h2>
            <p className="mt-4 text-sm text-slate-300 leading-relaxed">
              Pure mathematical randomness often fails movie lovers by serving obscure, unvetted, or poorly rated filler. <strong>Cine-Roulette</strong> introduces <em>constrained entropy</em>: a discovery model that combines true serendipity with rigorous quality thresholds. Every potential title returned by the wheel has survived algorithmic scrutiny across minimum critical consensus and historical narrative impact.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#090d15] border border-white/[0.06] space-y-2">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                <Shuffle className="w-4 h-4" /> Random vs Personalized
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                While our AI Advisor matches explicit textual intent, Cine-Roulette breaks your filter bubble by introducing unexpected thematic neighbors you would otherwise overlook.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#090d15] border border-white/[0.06] space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <Sparkles className="w-4 h-4" /> Mood Cluster Filtering
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Rather than browsing thousands of mixed titles, lock down an emotional mood cluster—such as Mind-Bending Puzzles or Atmospheric Dread—before spinning.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              Frequently Asked Questions
            </h3>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <h4 className="font-semibold text-slate-100">Are newly released films included in the roulette wheel?</h4>
                <p className="text-slate-400 mt-1.5 leading-relaxed">
                  Yes, catalog indices include active theatrical and global streaming releases alongside celebrated cinematic history, updated on a rolling weekly schedule.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <h4 className="font-semibold text-slate-100">What if I want specific runtime or energy controls?</h4>
                <p className="text-slate-400 mt-1.5 leading-relaxed">
                  If you need precise duration limits (such as movies strictly under 100 minutes) or low-mental-effort comfort watching, switch to Couch Mode for deterministic filtering.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-300">
              Need strict runtime constraints rather than random spins?
            </div>
            <Link
              href="/couch-mode"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 shrink-0 font-mono"
            >
              <span>Launch Couch Mode</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
