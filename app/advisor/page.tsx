// app/advisor/page.tsx
import React from 'react';
import Link from 'next/link';
import NeuralAdvisor from '@/components/NeuralAdvisor';
import { Metadata } from 'next';
import { HelpCircle, Terminal, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Movie Recommendation Tool: Natural Language Film Discovery | MOVIEINT',
  description: 'Use the MOVIEINT AI Advisor to find movies using natural language prompts. Discover films by mood, narrative pacing, complex plot twists, and thematic similarities.',
  alternates: {
    canonical: 'https://www.movieint.com/advisor',
  },
  openGraph: {
    title: 'AI Movie Recommendation Tool | MOVIEINT',
    description: 'Find films matching exact cinematic criteria, subtle vibes, and structural pacing using natural language AI search.',
    url: 'https://www.movieint.com/advisor',
    type: 'website',
  },
};

export default function AdvisorPage() {
  return (
    <main className="min-h-screen bg-[#07090e] text-slate-100 pt-8 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <NeuralAdvisor />

        <section className="mt-16 pt-12 border-t border-white/[0.08] max-w-4xl mx-auto text-left space-y-12">
          <div>
            <span className="text-amber-400 font-mono text-xs uppercase tracking-wider block mb-2">
              Autonomous Intelligence
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              What is the MOVIEINT AI Advisor?
            </h2>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
              The MOVIEINT AI Advisor is a natural-language semantic discovery engine designed to bridge the gap between abstract human cinematic cravings and catalog metadata. Unlike rigid filter dropdowns that limit search queries to generic genre boxes, our neural advisor evaluates screenplay pacing velocity, thematic complexity, philosophical tension, and structural twists to recommend exact narrative matches.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              Example Prompts & Discovery Patterns
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="font-mono text-amber-400 font-medium">By Specific Atmosphere:</span>
                <p className="text-slate-300 mt-1">&quot;A rainy neo-noir thriller set in an East Asian megalopolis with atmospheric synth score and zero jump scares.&quot;</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="font-mono text-indigo-400 font-medium">By Pacing & Complexity:</span>
                <p className="text-slate-300 mt-1">&quot;A high-concept sci-fi mystery with relentless pacing, complex timeline paradoxes, and runtime under 105 minutes.&quot;</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="font-mono text-rose-400 font-medium">By Thematic DNA:</span>
                <p className="text-slate-300 mt-1">&quot;Cerebral movies exploring identity and simulation theory similar to Inception and Dark City.&quot;</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="font-mono text-emerald-400 font-medium">By Mood & Bandwidth:</span>
                <p className="text-slate-300 mt-1">&quot;A warm, melancholic indie drama with high emotional resonance for late-night viewing.&quot;</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              Frequently Asked Questions
            </h3>
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <h4 className="font-semibold text-slate-100">How does the AI Advisor select movies?</h4>
                <p className="text-slate-400 mt-1.5 leading-relaxed">
                  Queries are converted into multi-dimensional embeddings that cross-reference our Narrative DNA database. Every film is mapped across pacing speed, dialogue density, psychological tension, and twist amplitude to rank relevance accurately.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <h4 className="font-semibold text-slate-100">Can I search by director styles or visual cinematography?</h4>
                <p className="text-slate-400 mt-1.5 leading-relaxed">
                  Yes. You can reference specific directorial signatures—such as Denis Villeneuve&apos;s scale, Christopher Nolan&apos;s cross-cutting, or David Fincher&apos;s procedural tension—to discover films sharing identical execution values.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-300">
              Prefer browsing by curated mood clusters rather than natural language?
            </div>
            <Link
              href="/couch-mode"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 shrink-0"
            >
              <span>Switch to Couch Mode</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
