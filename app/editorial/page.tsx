// app/editorial/page.tsx
import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { EDITORIAL_ARTICLES } from '@/lib/editorial-data';

export const metadata: Metadata = {
  title: 'Cinematic Editorial & Discovery Guides | MOVIEINT Intelligence',
  description:
    'Explore curated movie discovery guides, ranked lists, and thematic breakdowns powered by MovieINT Narrative DNA telemetry, Brainpower ratings, and streaming availability.',
  alternates: {
    canonical: 'https://www.movieint.com/editorial',
  },
  openGraph: {
    title: 'Cinematic Editorial & Discovery Guides | MOVIEINT',
    description:
      'Curated lists, narrative DNA telemetry, and streaming intelligence across world cinema, anime, and psychological thrillers.',
    url: 'https://www.movieint.com/editorial',
    siteName: 'MOVIEINT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cinematic Editorial & Discovery Guides | MOVIEINT',
    description: 'Discover what to watch next with MovieINT Narrative DNA.',
  },
};

export default function EditorialLandingPage() {
  const featuredArticle = EDITORIAL_ARTICLES.find((a) => a.featured) || EDITORIAL_ARTICLES[0];
  const otherArticles = EDITORIAL_ARTICLES.filter((a) => a.slug !== featuredArticle?.slug);

  const moods = ['Mind-Bending', 'Psychological', 'Emotional', 'Dark', 'Fast-Paced', 'Intellectual'];
  const platforms = ['Netflix', 'Prime Video', 'Disney+', 'Max', 'Apple TV'];

  return (
    <main className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-cyan-500/20 selection:text-cyan-300">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-cyan-950/20 via-transparent to-transparent pointer-events-none blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24">
        {/* Header Telemetry Badge */}
        <div className="flex flex-col items-center text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 font-mono text-xs uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Editorial & Discovery Telemetry
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-sans">
            Discover What To Watch Next
          </h1>
          <p className="text-slate-400 max-w-2xl text-base sm:text-lg">
            Curated cinematic breakdowns, deep narrative DNA decoders, and intent-focused watch guides engineered to conquer decision paralysis.
          </p>
        </div>

        {/* Discovery Filter Bar */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md mb-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-300">
            <span className="text-slate-500 uppercase tracking-wider mr-2">Quick Browse:</span>
            {moods.map((mood) => (
              <span
                key={mood}
                className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-cyan-950/50 hover:text-cyan-300 border border-slate-700/60 transition-colors"
              >
                {mood}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span className="text-slate-500 uppercase">Stream:</span>
            {platforms.slice(0, 4).map((p) => (
              <span key={p} className="px-2 py-0.5 rounded bg-slate-800/50 border border-slate-700/40">
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Featured Master Guide */}
        {featuredArticle && (
          <section className="mb-16">
            <div className="relative rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-900/90 via-[#0a0f1d] to-slate-900/90 p-6 sm:p-8 lg:p-10 overflow-hidden shadow-2xl hover:border-cyan-500/50 transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

              <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-center">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-wider">
                      ★ Featured Master Guide
                    </span>
                    <span className="text-slate-400 text-xs font-mono">{featuredArticle.readTime}</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    <Link href={`/editorial/${featuredArticle.slug}`}>
                      {featuredArticle.title}
                    </Link>
                  </h2>

                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    {featuredArticle.metaDescription}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <Link
                      href={`/editorial/${featuredArticle.slug}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-lg shadow-cyan-500/20"
                    >
                      Read Full Guide
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>

                    <span className="text-xs font-mono text-slate-400">
                      Telemetry: {featuredArticle.movies.length} Analyzed Titles
                    </span>
                  </div>
                </div>

                <div className="w-full lg:w-96 flex flex-col gap-2 p-4 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs text-slate-400">
                  <div className="text-cyan-400 font-semibold border-b border-slate-800 pb-2 uppercase tracking-wider">
                    DNA Matrix Preview
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Average Brainpower:</span>
                    <span className="text-white font-bold">94/100</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Pacing Cadence:</span>
                    <span className="text-cyan-300">Non-Linear / Dynamic</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Twist Reliability:</span>
                    <span className="text-amber-300">93% Verified</span>
                  </div>
                  <div className="flex justify-between py-1 border-t border-slate-800/80 pt-2">
                    <span>Spoilers:</span>
                    <span className="text-emerald-400">0% Safe</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Latest Discovery Guides Grid */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Latest Discovery Guides</h2>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Updated in real-time with MovieINT algorithmic archival indices
              </p>
            </div>
            <Link
              href="/rankings"
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-wider"
            >
              View Leaderboards →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherArticles.map((article) => (
              <article
                key={article.slug}
                className="flex flex-col justify-between rounded-xl bg-slate-900/60 border border-slate-800/80 p-6 hover:border-cyan-500/40 hover:bg-slate-900/90 transition-all duration-200 group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700/60">
                      {article.moodTag}
                    </span>
                    <span>{article.readTime}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug mb-3">
                    <Link href={`/editorial/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h3>

                  <p className="text-slate-400 text-xs sm:text-sm line-clamp-3 mb-4 leading-relaxed">
                    {article.metaDescription}
                  </p>
                </div>

                <div className="border-t border-slate-800/80 pt-4 mt-2 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">
                    {article.movies.length} Recommended Films
                  </span>
                  <Link
                    href={`/editorial/${article.slug}`}
                    className="text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1"
                  >
                    Examine →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Global MovieINT Discovery Tools Cross-Funnel */}
        <section className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0d1424] to-slate-900 border border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="space-y-2">
              <div className="text-cyan-400 font-mono text-xs uppercase tracking-wider font-semibold">
                Decision Paralysis?
              </div>
              <h4 className="text-lg font-bold text-white">Spin Cine-Roulette</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Filter by mood frequency and let the stochastic algorithm select your next movie instantly.
              </p>
              <Link
                href="/roulette"
                className="inline-block mt-2 text-xs font-mono text-cyan-400 hover:underline"
              >
                Launch Cine-Roulette →
              </Link>
            </div>

            <div className="space-y-2">
              <div className="text-indigo-400 font-mono text-xs uppercase tracking-wider font-semibold">
                Time Constraints?
              </div>
              <h4 className="text-lg font-bold text-white">Calibrate Couch Mode</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Tune precise maximum runtimes and mental bandwidth to find the ideal weekday evening match.
              </p>
              <Link
                href="/couch-mode"
                className="inline-block mt-2 text-xs font-mono text-indigo-400 hover:underline"
              >
                Open Couch Mode →
              </Link>
            </div>

            <div className="space-y-2">
              <div className="text-amber-400 font-mono text-xs uppercase tracking-wider font-semibold">
                Direct Telemetry
              </div>
              <h4 className="text-lg font-bold text-white">Head-to-Head Vs Mode</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Compare Narrative DNA, twist velocity, and consensus stability side-by-side.
              </p>
              <Link
                href="/vs"
                className="inline-block mt-2 text-xs font-mono text-amber-400 hover:underline"
              >
                Launch Vs Telemetry →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
