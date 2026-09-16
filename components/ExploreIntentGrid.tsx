import Link from 'next/link';

interface IntentLink {
  label: string;
  href: string;
  description: string;
}

const INTENT_HUBS: IntentLink[] = [
  { 
    label: 'Mind-Bending Movies', 
    href: '/editorial/best-mind-bending-movies-that-make-you-think', 
    description: 'Reality-distorting narratives, perception paradoxes & existential cinema.' 
  },
  { 
    label: 'Psychological Thrillers', 
    href: '/editorial/best-psychological-thriller-movies-ranked', 
    description: 'Intense cerebral tension, moral ambiguity & high-stakes character mind games.' 
  },
  { 
    label: 'Movies Like Interstellar', 
    href: '/editorial/best-movies-like-interstellar-cosmic-sci-fi', 
    description: 'Cosmic scale, theoretical relativity & monumental emotional resonance.' 
  },
  { 
    label: 'Movies Like Inception', 
    href: '/editorial/best-movies-like-inception-cerebral-thrillers', 
    description: 'Layered subconscious logic, heist architecture & structural twists.' 
  },
  { 
    label: 'Best Slow-Burn Thrillers', 
    href: '/editorial/best-slow-burn-thriller-movies', 
    description: 'Deliberate dread, atmospheric suspense & devastating third-act payoffs.' 
  },
  { 
    label: 'Korean Thrillers', 
    href: '/editorial/best-korean-psychological-thriller-movies', 
    description: 'Masterclasses in relentless pacing, visceral stakes & uncompromising grit.' 
  },
  { 
    label: 'Anime Masterpieces', 
    href: '/editorial/anime-for-beginners-gateway-masterpieces', 
    description: 'Philosophical complexity, existential journeys & visionary artistic craft.' 
  },
  { 
    label: 'Movies Under 90 Minutes', 
    href: '/editorial/best-movies-under-90-minutes-tight-pacing', 
    description: 'Relentless kinetic energy, high-velocity pacing & zero narrative fluff.' 
  },
  { 
    label: 'Major Plot Twists', 
    href: '/editorial/best-movies-with-insane-plot-twists', 
    description: 'Paradigm-shifting narrative resolutions engineered for immediate rewatch value.' 
  },
  { 
    label: 'Feel-Good Comfort Movies', 
    href: '/editorial/best-feel-good-movies-to-watch-tonight', 
    description: 'Uplifting storytelling, genuine emotional heart & zero cynicism.' 
  },
  { 
    label: 'Dark & Gritty Neo-Noir', 
    href: '/editorial/best-neo-noir-crime-movies-ranked', 
    description: 'Atmospheric cynicism, investigative intrigue & shadow-drenched urban crime.' 
  },
  { 
    label: 'Best Sci-Fi of the Decade', 
    href: '/editorial/best-sci-fi-movies-of-the-decade', 
    description: 'Speculative brilliance, high-concept world-building & cinematic audacity.' 
  },
];

export default function ExploreIntentGrid() {
  return (
    <section className="w-full py-16 border-t border-white/[0.08] bg-[#07090e] text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-left">
          <span className="text-amber-400 font-mono text-xs uppercase tracking-widest block mb-2">
            Narrative Intent Discovery
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Explore Movies by What You Want to Watch
          </h2>
          <p className="text-slate-400 mt-2 text-sm sm:text-base max-w-2xl leading-relaxed">
            Targeted cinema curation categorized by cognitive bandwidth, pacing velocity, thematic tension, and narrative DNA telemetry.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {INTENT_HUBS.map((hub) => (
            <Link
              key={hub.href}
              href={hub.href}
              className="group p-4 rounded-2xl border border-white/[0.06] bg-[#090d15] hover:bg-[#0f1422] hover:border-amber-400/30 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-sm font-bold text-slate-200 group-hover:text-amber-400 transition-colors">
                  {hub.label}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {hub.description}
                </p>
              </div>
              <div className="text-[11px] font-mono text-slate-500 mt-4 flex items-center gap-1.5 group-hover:text-amber-400 transition-colors">
                <span>Read Analysis & Stream</span>
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
