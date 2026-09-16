import React from 'react';
import Link from 'next/link';
import { GitCompare, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';

interface ComparePair {
  movie1: string;
  movie2: string;
  slug: string;
  theme: string;
}

const FEATURED_PAIRS: ComparePair[] = [
  {
    movie1: "Interstellar",
    movie2: "Inception",
    slug: "interstellar-vs-inception",
    theme: "Cosmic Existentialism vs Layered Subconscious Reality"
  },
  {
    movie1: "Dune",
    movie2: "Oppenheimer",
    slug: "dune-vs-oppenheimer",
    theme: "Epic Sci-Fi Worldbuilding vs Historical Narrative Tension"
  },
  {
    movie1: "The Dark Knight",
    movie2: "Joker",
    slug: "the-dark-knight-vs-joker",
    theme: "Systemic Heroic Ideology vs Nihilistic Psychological Breakdown"
  },
  {
    movie1: "Shutter Island",
    movie2: "Fight Club",
    slug: "shutter-island-vs-fight-club",
    theme: "Psychological Gaslighting vs Anti-Consumerist Dissociation"
  }
];

const COMPARE_FAQS = [
  {
    q: "How does MovieINT compare two cinema titles?",
    a: "Our engine evaluates narrative DNA matrices side-by-side: examining pacing velocity, cognitive complexity scores, climax trajectory, and ending twist indices to determine stylistic alignment."
  },
  {
    q: "Can I compare films from entirely different genres?",
    a: "Yes. Narrative DNA looks past surface-level genre tags to cross-compare underlying structural tension, mood profiles, and viewer bandwidth requirements."
  }
];

export default function CompareSeoContent() {
  return (
    <section className="w-full max-w-5xl mx-auto my-16 pt-12 border-t border-zinc-850 text-zinc-300">
      <div className="mb-10 text-left">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase tracking-wider mb-2">
          <GitCompare className="w-4 h-4" />
          <span>Head-to-Head Narrative Telemetry</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">
          Compare Movie DNA: Narrative Dissection & Telemetry Matchups
        </h2>
        <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">
          Evaluate how cinema contenders measure up in pacing, narrative twists, thematic depth, 
          and emotional resolution before deciding your next watch.
        </p>
      </div>

      <div className="mb-12">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-4 font-mono">
          Featured Head-to-Head Matchups
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURED_PAIRS.map((pair) => (
            <Link
              key={pair.slug}
              href={`/compare/${pair.slug}`}
              className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 hover:border-zinc-700 transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-zinc-200 group-hover:text-amber-400 transition-colors">
                  <span>{pair.movie1}</span>
                  <span className="text-xs text-zinc-500 font-normal">vs</span>
                  <span>{pair.movie2}</span>
                </div>
                <p className="text-xs text-zinc-500 mt-1.5 line-clamp-2">
                  {pair.theme}
                </p>
              </div>
              <div className="text-xs text-zinc-400 mt-4 flex items-center gap-1 group-hover:text-amber-300 transition-colors">
                <span>View DNA Battle</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          Frequently Asked Questions
        </h3>
        <div className="space-y-4">
          {COMPARE_FAQS.map((faq, idx) => (
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
