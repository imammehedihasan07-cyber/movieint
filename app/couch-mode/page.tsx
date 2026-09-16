import CouchModeSeoContent from "@/components/CouchModeSeoContent";
import { Metadata } from "next";
import CouchModeClient from "@/components/CouchModeClient";
import Link from "next/link";
import { Armchair, BatteryCharging, Clock, Brain, Compass, Sparkles, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Couch Mode: Find a Movie Based on Your Mood, Energy & Available Time | MOVIEINT",
  description: "Eliminate decision paralysis with Couch Mode. Filter films by cognitive bandwidth, energy levels, emotional appetite, and exact runtime constraints.",
  alternates: {
    canonical: "https://www.movieint.com/couch-mode",
  },
  openGraph: {
    title: "Couch Mode: Cognitive Cinema Discovery | MOVIEINT",
    description: "Match cinema choices with your exact mental battery, evening mood, and free runtime.",
    url: "https://www.movieint.com/couch-mode",
    type: "website",
  },
};

export default function CouchModePage() {
  return (
    <div className="min-h-screen bg-[#06080d] text-slate-100 pb-24">
      {/* Interactive Tool Component */}
      <CouchModeClient />
      <CouchModeSeoContent />

      {/* Crawlable High-Value Editorial Section (800+ Words SEO Hub) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-12 border-t border-white/[0.08] text-left space-y-12">
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-amber-400 text-xs font-mono mb-3">
            <Armchair className="w-3.5 h-3.5" /> Cognitive Film Architecture
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            How Couch Mode Solves Streaming Decision Fatigue
          </h2>
          <p className="mt-4 text-sm text-slate-300 leading-relaxed">
            The average modern streaming subscriber spends between 18 and 24 minutes browsing endless thumbnail carousels before settling on a title—or abandoning the session entirely. Traditional recommendation algorithms rely predominantly on collaborative filtering (&quot;people who watched X also liked Y&quot;) or superficial genre categorization. These legacy paradigms fail because they overlook the most vital viewer variable: <strong>available cognitive bandwidth</strong>.
          </p>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            MOVIEINT Couch Mode reverses the discovery vector. Instead of asking what genre you want to watch, it evaluates your real-time physiological and psychological readiness. By synthesizing three deterministic constraints—mental energy, emotional resonance, and runtime availability—Couch Mode delivers precision recommendations engineered to fit the current moment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-[#090d15] border border-white/[0.06] space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <Brain className="w-4 h-4" /> Cognitive Energy
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Differentiates between passive relaxation (requiring low cognitive loads and high narrative clarity) and active engagement (prepared for non-linear timelines, philosophical ambiguities, and layered dialogue).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#090d15] border border-white/[0.06] space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <BatteryCharging className="w-4 h-4" /> Emotional Trajectory
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Aligns screenplay tone with your psychological state. Whether seeking visceral tension release through high-velocity thrillers or restorative emotional warmth via character-driven cinema.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#090d15] border border-white/[0.06] space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Clock className="w-4 h-4" /> Hard Runtime Limits
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enforces absolute duration thresholds to eliminate late-night calculation mistakes. Filters tightly edited 90-minute cinema gems versus expansive multi-hour epics.
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white mb-4">
            Curated Intent Frameworks
          </h3>
          <div className="space-y-3 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200">Zero-Friction Late Night:</strong> Low mental resistance, runtime under 95 minutes, linear storytelling with satisfying thematic closure.
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200">High-Bandwidth Cerebral Exploration:</strong> Intricate puzzle architecture, metaphysical paradoxes, and unhurried pacing designed for dedicated analytical focus.
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200">Visceral Adrenaline Shock:</strong> Accelerated narrative pacing, escalating stakes, high twist index, and minimum expository lag.
              </div>
            </div>
          </div>
        </div>

        {/* Cross-Linking Navigation */}
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-300 text-center sm:text-left">
            Seeking randomized unexpected recommendations instead of structured filtering?
          </div>
          <Link
            href="/roulette"
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 font-mono flex items-center gap-1.5 shrink-0"
          >
            <span>Spin Cine-Roulette</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
