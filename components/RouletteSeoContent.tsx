import React from 'react';
import Link from 'next/link';
import { Dices, HelpCircle, Shuffle, ShieldCheck } from 'lucide-react';

const ROULETTE_FAQS = [
  {
    q: "How does MovieINT Cine-Roulette work?",
    a: "Cine-Roulette is an algorithmic serendipity engine. Rather than pure unconstrained randomness, it applies stochastic sampling filtered through your selected narrative mood, streaming availability, and minimum quality thresholds."
  },
  {
    q: "Is Cine-Roulette completely random?",
    a: "No. Pure randomness often delivers unwatchable titles. Cine-Roulette balances discovery serendipity with Narrative DNA validation to ensure recommended films meet strict narrative coherence baselines."
  },
  {
    q: "Can I filter Cine-Roulette by specific moods?",
    a: "Yes. You can lock in specific parameters like mind-bending sci-fi, slow-burn psychological tension, or adrenaline-fueled thrillers before spinning the engine."
  }
];

export default function RouletteSeoContent() {
  return (
    <section className="w-full max-w-5xl mx-auto my-16 pt-12 border-t border-zinc-800/80 text-zinc-300">
      <div className="mb-12">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase tracking-wider mb-2">
          <Dices className="w-4 h-4" />
          <span>Algorithmic Cinema Serendipity</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">
          Cine-Roulette: Overcoming Decision Paralysis Through Narrative Filtering
        </h2>
        <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">
          Endless scrolling through streaming carousels often results in viewer fatigue. Cine-Roulette bridges the gap 
          between serendipitous cinema discovery and algorithmic precision by eliminating choice overload.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        <div className="p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/40">
          <div className="flex items-center gap-2 text-zinc-200 font-semibold mb-2">
            <Shuffle className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm">Serendipity With Quality Control</h3>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Eliminates catalog noise by establishing strict baseline telemetry across narrative structure and cinematography benchmarks before picking titles.
          </p>
        </div>

        <div className="p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/40">
          <div className="flex items-center gap-2 text-zinc-200 font-semibold mb-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm">Calibrated Mood Alignment</h3>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Lock into psychological intrigue, cerebral pacing, or visceral twists while letting stochastic algorithms handle title discovery.
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          Frequently Asked Questions
        </h3>
        <div className="space-y-4">
          {ROULETTE_FAQS.map((faq, idx) => (
            <div key={idx} className="p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/30">
              <h4 className="text-sm font-semibold text-zinc-100 mb-2">{faq.q}</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
