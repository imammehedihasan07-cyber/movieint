import React from 'react';
import { Sofa, BatteryCharging, Clock, Sparkles, HelpCircle } from 'lucide-react';

const ENERGY_TIERS = [
  {
    title: "Low Bandwidth & Decompression",
    desc: "Linear narrative structures, warm acoustic tonality, and high comfort thresholds designed for physical and mental exhaustion.",
    recommendations: "Light comedies, comfort animation, atmospheric nature documentaries."
  },
  {
    title: "Moderate Engagement",
    desc: "Engaging plots with steady momentum that entertain without demanding rigorous analytical puzzle-solving.",
    recommendations: "Action procedurals, mid-tier thrillers, narrative biographies."
  },
  {
    title: "High Cognitive Demands",
    desc: "Non-linear time mechanics, complex thematic subtexts, and psychological paradoxes requiring focused attention.",
    recommendations: "Cerebral sci-fi, psychological neo-noirs, existential dramas."
  }
];

const COUCH_FAQS = [
  {
    q: "How does Couch Mode filter movies by mental bandwidth?",
    a: "Couch Mode normalizes film telemetry across three core parameters: narrative cognitive load, emotional volatility, and strict runtime limits to align exactly with your current energy level."
  },
  {
    q: "Why is runtime enforcement important in Couch Mode?",
    a: "Viewer fatigue peaks after extended screen time. Our engine enforces rigid runtime constraints so you never start a multi-hour epic when you only have energy for a tight 90-minute narrative."
  }
];

export default function CouchModeSeoContent() {
  return (
    <section className="w-full max-w-5xl mx-auto my-16 pt-12 border-t border-zinc-800/80 text-zinc-300">
      <div className="mb-12">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase tracking-wider mb-2">
          <Sofa className="w-4 h-4" />
          <span>Fatigue-Calibrated Film Selection</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">
          Couch Mode: Find a Movie Based on Your Mood, Energy & Available Time
        </h2>
        <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">
          Standard recommendations push high-intensity cinema regardless of whether you have the stamina to engage with it. 
          MovieINT Couch Mode balances mental bandwidth, emotional fatigue, and precise runtime thresholds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {ENERGY_TIERS.map((tier, idx) => (
          <div key={idx} className="p-5 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3 text-amber-400">
                <BatteryCharging className="w-4 h-4" />
                <h3 className="text-sm font-semibold text-white">{tier.title}</h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">{tier.desc}</p>
            </div>
            <div className="pt-3 border-t border-zinc-800 text-[11px] text-zinc-500 font-mono">
              Typical fit: {tier.recommendations}
            </div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          Frequently Asked Questions
        </h3>
        <div className="space-y-4">
          {COUCH_FAQS.map((faq, idx) => (
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
