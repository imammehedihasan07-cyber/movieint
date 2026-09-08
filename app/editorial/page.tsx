import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

// 1. All Editorial Guides Embedded Directly (No path/import error risk)
const ARTICLES = [
  {
    slug: 'best-mind-bending-movies-that-make-you-think',
    title: '15 Best Mind-Bending Movies That Will Break Your Reality (Ranked by Narrative Complexity)',
    seoTitle: 'Best Mind-Bending Movies That Make You Think | MovieINT DNA Guide',
    metaDescription: 'Discover the ultimate ranked list of mind-bending movies that challenge logic, memory, and spacetime. Evaluated using MovieINT Narrative DNA & Brainpower metrics.',
    publishedDate: '2026-08-15T09:00:00Z',
    modifiedDate: '2026-09-08T12:00:00Z',
    author: { name: 'MovieINT Cinema Intelligence Lab' },
    moodTag: 'Mind-Bending',
    themeTag: 'Sci-Fi',
    readTime: '12 min read',
    introText: 'True mind-bending cinema is not merely defined by an abrupt last-minute plot twist. It demands intricate narrative architecture, mathematical story pacing, and a commitment to subverting human perception. Using MovieINT’s multidimensional DNA telemetry, we dissect the top psychological puzzles that reward hyper-focused viewing.',
    movies: [
      {
        slugId: '27205',
        title: 'Inception',
        year: 2010,
        director: 'Christopher Nolan',
        runtime: '148 min',
        genres: ['Sci-Fi', 'Action', 'Heist'],
        dnaScore: 9.3,
        metrics: { complexity: 94, brainpower: 92, twistPotency: 91, endingType: 'Ambiguous Totem Equilibrium' },
        whyRecommended: 'Nolan executes a simultaneous four-tier dream heist where each layer experiences exponential time dilation. The physics-defying cinematography is grounded by an emotionally devastating core concerning unresolved grief.',
        bestFor: 'Viewers looking for high-budget theoretical physics fused with psychological puzzle-box mechanics.',
        avoidIf: 'You want a casual background movie where you can look at your phone every five minutes.',
        streamingOn: ['Prime Video', 'Apple TV', 'Max']
      },
      {
        slugId: '329865',
        title: 'Arrival',
        year: 2016,
        director: 'Denis Villeneuve',
        runtime: '116 min',
        genres: ['Sci-Fi', 'Mystery', 'Drama'],
        dnaScore: 9.1,
        metrics: { complexity: 92, brainpower: 95, twistPotency: 96, endingType: 'Non-Linear Philosophical Revelation' },
        whyRecommended: 'Arrival subverts alien first-contact tropes through linguistic determinism (the Sapir-Whorf hypothesis). The third act reconfigures the timeline into a heartbreaking reflection on destiny and choice.',
        bestFor: 'Fans of cerebral, emotionally profound hard science fiction with philosophical stakes.',
        avoidIf: 'You expect alien laser battles or traditional blockbuster pacing.',
        streamingOn: ['Netflix', 'Paramount+']
      },
      {
        slugId: '77',
        title: 'Memento',
        year: 2000,
        director: 'Christopher Nolan',
        runtime: '113 min',
        genres: ['Mystery', 'Psychological Thriller'],
        dnaScore: 8.9,
        metrics: { complexity: 96, brainpower: 98, twistPotency: 94, endingType: 'Devastating Self-Deception Twist' },
        whyRecommended: 'Told in alternating reverse-chronological color scenes and chronological black-and-white sequences, Memento forces the viewer into the exact anterograde amnesia experienced by Leonard Shelby.',
        bestFor: 'Lovers of non-linear editing masterclasses and dark psychological character breakdowns.',
        avoidIf: 'You struggle tracking simultaneous chronology inversions.',
        streamingOn: ['Prime Video', 'Tubi']
      },
      {
        slugId: '1018',
        title: 'Mulholland Drive',
        year: 2001,
        director: 'David Lynch',
        runtime: '147 min',
        genres: ['Mystery', 'Drama', 'Psychological Surrealism'],
        dnaScore: 9.0,
        metrics: { complexity: 98, brainpower: 96, twistPotency: 88, endingType: 'Surrealist Subconscious Dissolution' },
        whyRecommended: 'David Lynch’s masterwork on Hollywood delirium operates under pure dream logic and Freudian projection. It is a psychological labyrinth that refuses simple exposition.',
        bestFor: 'Viewers intrigued by neo-noir dream psychology and existential dread.',
        avoidIf: 'You require clear, literal exposition answers wrapped up before the credits roll.',
        streamingOn: ['Criterion Channel', 'Apple TV']
      },
      {
        slugId: '435',
        title: 'The Prestige',
        year: 2006,
        director: 'Christopher Nolan',
        runtime: '130 min',
        genres: ['Drama', 'Mystery', 'Sci-Fi'],
        dnaScore: 9.2,
        metrics: { complexity: 90, brainpower: 91, twistPotency: 97, endingType: 'Dual-Shock Sacrificial Twist' },
        whyRecommended: 'Structured intentionally like a three-part magic trick, this film examines obsession, rivalry, and human sacrifice with multiple layers of sleight of hand hiding in plain sight.',
        bestFor: 'Fans of obsessive rivalry, historical fiction mixed with Nikola Tesla lore, and jaw-dropping double twists.',
        avoidIf: 'You dislike morally ambiguous characters where no one is truly the hero.',
        streamingOn: ['Apple TV']
      }
    ],
    faqs: [
      {
        question: 'What makes a movie "Mind-Bending" according to MovieINT DNA?',
        answer: 'MovieINT calculates mind-bending status when a film records a Narrative Complexity index above 85/100, combined with non-linear chronology, perceptive distortion, or subverted cognitive baseline expectations.'
      },
      {
        question: 'Which movie on this list has the highest Brainpower index?',
        answer: 'Memento and Mulholland Drive hold the highest cognitive demands on this guide (98/100 and 96/100 respectively) due to their fragmented chronology and symbolic subconscious structures.'
      }
    ]
  },
  {
    slug: 'best-psychological-thriller-movies-ranked',
    title: '15 Best Psychological Thrillers of All Time (Ranked by Tension & Twist Potency)',
    seoTitle: 'Best Psychological Thriller Movies of All Time | MovieINT DNA',
    metaDescription: 'Looking for heart-racing psychological thrillers? Explore our data-backed ranking based on MovieINT Tension Index, Pacing Cadence, and Twist Potency.',
    publishedDate: '2026-08-25T11:00:00Z',
    modifiedDate: '2026-09-08T12:00:00Z',
    author: { name: 'MovieINT Cinema Intelligence Lab' },
    moodTag: 'Psychological',
    themeTag: 'Crime & Mystery',
    readTime: '11 min read',
    introText: 'A masterclass psychological thriller attacks the audience’s safety from within. Instead of relying on visceral gore or creature features, these films weaponize paranoia, unreliable narrators, and claustrophobic pacing.',
    movies: [
      {
        slugId: '496243',
        title: 'Parasite',
        year: 2019,
        director: 'Bong Joon-ho',
        runtime: '132 min',
        genres: ['Thriller', 'Drama', 'Black Comedy'],
        dnaScore: 9.5,
        metrics: { complexity: 88, brainpower: 89, twistPotency: 96, endingType: 'Tragic Socioeconomic Trap' },
        whyRecommended: 'Bong Joon-ho’s Palme d’Or and Academy Award-winning masterpiece flawlessly pivots from a dry social grift comedy into a suffocating subterranean thriller with surgical structural shifts.',
        bestFor: 'Anyone who values immaculate scene geometry, dark humor, and piercing social commentary.',
        avoidIf: 'You cannot handle sharp genre pivot whiplash mid-film.',
        streamingOn: ['Max', 'Hulu']
      },
      {
        slugId: '11324',
        title: 'Shutter Island',
        year: 2010,
        director: 'Martin Scorsese',
        runtime: '138 min',
        genres: ['Psychological Thriller', 'Mystery'],
        dnaScore: 8.7,
        metrics: { complexity: 89, brainpower: 88, twistPotency: 95, endingType: 'Existential Moral Self-Surrender' },
        whyRecommended: 'Scorsese adapts Dennis Lehane’s novel into a tempestuous gothic fever dream where Ashecliffe Hospital acts as an extension of unprocessed wartime and domestic trauma.',
        bestFor: 'Fans of heavy atmosphere, atmospheric dread, and profound final-line questions.',
        avoidIf: 'You are allergic to heavy, dark, melancholic atmospheres.',
        streamingOn: ['Prime Video', 'Paramount+']
      }
    ],
    faqs: [
      {
        question: 'How is Tension Index calculated in MovieINT?',
        answer: 'The MovieINT Tension Index measures scene continuity, audio-visual dissonance, narrative threat escalation, and temporal compression to gauge visceral audience investment.'
      }
    ]
  },
  {
    slug: 'best-movies-like-inception-cerebral-thrillers',
    title: '10 Movies Like Inception for When You Crave Layered Realities & Heists',
    seoTitle: 'Movies Like Inception: 10 Mind-Bending Cerebral Thrillers | MovieINT',
    metaDescription: 'Obsessed with Inception? Discover 10 cerebral masterpieces featuring dream manipulation, alternate realities, and psychological puzzles matching MovieINT DNA.',
    publishedDate: '2026-08-20T10:30:00Z',
    modifiedDate: '2026-09-08T12:00:00Z',
    author: { name: 'MovieINT Cinema Intelligence Lab' },
    moodTag: 'Intellectual',
    themeTag: 'Sci-Fi',
    readTime: '9 min read',
    introText: 'Christopher Nolan’s Inception remains the gold standard for high-concept intellectual blockbusters. If you are searching for films that share its intricate conceptual layering, relentless tempo, and subconscious stakes, here is the curated telemetry shortlist.',
    movies: [
      {
        slugId: '2649',
        title: 'Paprika',
        year: 2006,
        director: 'Satoshi Kon',
        runtime: '90 min',
        genres: ['Anime', 'Sci-Fi', 'Mystery'],
        dnaScore: 8.8,
        metrics: { complexity: 91, brainpower: 89, twistPotency: 87, endingType: 'Psychoanalytic Catharsis' },
        whyRecommended: 'Widely recognized as a direct thematic precursor to Inception, Satoshi Kon’s anime opus delves into stolen DC Mini devices that let therapists enter dreams.',
        bestFor: 'Anime enthusiasts and cinephiles wanting to see visually unhinged dream-logic animation.',
        avoidIf: 'You prefer live-action cinema or conventional, grounded visual rules.',
        streamingOn: ['Prime Video', 'Apple TV']
      },
      {
        slugId: '62',
        title: '2001: A Space Odyssey',
        year: 1968,
        director: 'Stanley Kubrick',
        runtime: '149 min',
        genres: ['Sci-Fi', 'Mystery'],
        dnaScore: 9.2,
        metrics: { complexity: 95, brainpower: 96, twistPotency: 80, endingType: 'Transcendental Star-Child Genesis' },
        whyRecommended: 'Where Inception explores inner subconscious space, Kubrick explores humanity’s cosmic destiny.',
        bestFor: 'Patients of visual poetry, existential science fiction, and technological AI foreshadowing.',
        avoidIf: 'You get restless during long dialogue-free atmospheric shots.',
        streamingOn: ['Max', 'Apple TV']
      }
    ],
    faqs: []
  }
];

function getTargetArticle(slugInput: any) {
  const raw = String(slugInput || '').toLowerCase().trim();
  if (!raw) return ARTICLES[0];

  const matched = ARTICLES.find(
    (a) => a.slug === raw || raw.includes(a.slug) || a.slug.includes(raw)
  );
  // Default to first article instead of ever showing 404 Void!
  return matched || ARTICLES[0];
}

export async function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const resolved = await Promise.resolve(params);
  const article = getTargetArticle(resolved?.slug);

  return {
    title: article.seoTitle,
    description: article.metaDescription,
    alternates: {
      canonical: `https://www.movieint.com/editorial/${article.slug}`,
    }
  };
}

export default async function EditorialArticlePage({ params }: { params: any }) {
  const resolved = await Promise.resolve(params);
  const article = getTargetArticle(resolved?.slug);
  const canonicalUrl = `https://www.movieint.com/editorial/${article.slug}`;

  // Structured Data (JSON-LD)
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.movieint.com' },
      { '@type': 'ListItem', position: 2, name: 'Editorial', item: 'https://www.movieint.com/editorial' },
      { '@type': 'ListItem', position: 3, name: article.title, item: canonicalUrl }
    ]
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.metaDescription,
    datePublished: article.publishedDate,
    dateModified: article.modifiedDate,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
    author: { '@type': 'Organization', name: article.author.name, url: 'https://www.movieint.com' },
    publisher: { '@type': 'Organization', name: 'MOVIEINT' }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <article className="min-h-screen bg-[#07090e] text-slate-200 selection:bg-cyan-500/20 selection:text-cyan-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">
          
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center space-x-2 text-xs font-mono text-slate-400">
            <Link href="/" className="hover:text-cyan-400 transition-colors">HOME</Link>
            <span>/</span>
            <Link href="/editorial" className="hover:text-cyan-400 transition-colors">EDITORIAL</Link>
            <span>/</span>
            <span className="text-slate-200 truncate max-w-[220px] sm:max-w-none">{article.title}</span>
          </nav>

          {/* Header */}
          <header className="space-y-4 border-b border-slate-800 pb-8 mb-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider">
                {article.moodTag}
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700/60 text-slate-300 text-xs font-mono">
                {article.themeTag}
              </span>
              <span className="text-xs font-mono text-slate-400 ml-auto">{article.readTime}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-2">
              <span>By <strong className="text-slate-300">{article.author.name}</strong></span>
              <span>•</span>
              <span>Updated: {new Date(article.modifiedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span>•</span>
              <span className="text-emerald-400">● 100% Spoiler-Free Calibrated</span>
            </div>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed pt-3">
              {article.introText}
            </p>
          </header>

          {/* Table of Contents */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 mb-12">
            <h2 className="text-sm font-mono uppercase tracking-wider text-cyan-400 font-bold mb-3">
              Telemetry Summary & Evaluated Titles
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              {article.movies.map((m, idx) => (
                <li key={m.slugId}>
                  <a href={`#movie-${m.slugId}`} className="text-slate-300 hover:text-cyan-300 flex items-center gap-2 py-0.5">
                    <span className="text-cyan-500">#{idx + 1}</span>
                    <span>{m.title} ({m.year})</span>
                    <span className="text-amber-400 ml-auto font-semibold">DNA {m.dnaScore}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Movie Cards */}
          <section className="space-y-12">
            {article.movies.map((m, index) => (
              <div
                key={m.slugId}
                id={`movie-${m.slugId}`}
                className="scroll-mt-20 rounded-2xl bg-[#0b0e17] border border-slate-800 p-6 sm:p-8 hover:border-slate-700 transition-all shadow-xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800/80 pb-5 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-cyan-400 font-mono font-bold text-sm">ENTRY #{index + 1}</span>
                      <span className="text-slate-500 text-xs font-mono">•</span>
                      <span className="text-slate-400 text-xs font-mono">{m.year}</span>
                      <span className="text-slate-500 text-xs font-mono">•</span>
                      <span className="text-slate-400 text-xs font-mono">{m.runtime}</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold text-white">
                      <Link href={`/movie/${m.slugId}`} className="hover:text-cyan-300 transition-colors inline-flex items-center gap-2">
                        {m.title}
                        <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Link>
                    </h3>

                    <p className="text-xs font-mono text-slate-400 mt-1">
                      Directed by <span className="text-slate-300">{m.director}</span> | Genres: {m.genres.join(', ')}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center p-3 rounded-lg bg-slate-900 border border-slate-700/60 font-mono">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400">MOVIEINT DNA</span>
                    <span className="text-2xl font-black text-cyan-400">{m.dnaScore}</span>
                    <span className="text-[10px] text-slate-500">Telemetry v3.2</span>
                  </div>
                </div>

                {/* Telemetry Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-6 font-mono text-xs">
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase">Complexity</div>
                    <div className="text-base font-bold text-white mt-0.5">{m.metrics.complexity} / 100</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase">Brainpower</div>
                    <div className="text-base font-bold text-indigo-300 mt-0.5">{m.metrics.brainpower} / 100</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase">Twist Potency</div>
                    <div className="text-base font-bold text-amber-300 mt-0.5">{m.metrics.twistPotency} / 100</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase">Ending Type</div>
                    <div className="text-xs font-semibold text-cyan-300 truncate mt-1">{m.metrics.endingType}</div>
                  </div>
                </div>

                {/* Narrative Assessment */}
                <div className="space-y-3 text-sm leading-relaxed mb-6">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-1">
                    Algorithmic Narrative Assessment:
                  </h4>
                  <p className="text-slate-200">{m.whyRecommended}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
                    <div className="p-3 rounded bg-emerald-950/20 border border-emerald-500/20 text-emerald-200">
                      <strong>Best For:</strong> {m.bestFor}
                    </div>
                    <div className="p-3 rounded bg-rose-950/20 border border-rose-500/20 text-rose-200">
                      <strong>Skip If:</strong> {m.avoidIf}
                    </div>
                  </div>
                </div>

                {/* Stream & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Stream:</span>
                    {m.streamingOn.map((plat) => (
                      <span key={plat} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">{plat}</span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/movie/${m.slugId}`}
                      className="px-3 py-1.5 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-semibold transition-colors"
                    >
                      Inspect Full DNA →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* FAQs */}
          {article.faqs && article.faqs.length > 0 && (
            <section className="mt-16 pt-12 border-t border-slate-800">
              <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {article.faqs.map((faq, idx) => (
                  <div key={idx} className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <h3 className="text-base font-semibold text-cyan-300 mb-2">{faq.question}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Footer Back Link */}
          <div className="mt-16 flex items-center justify-between border-t border-slate-800/80 pt-6 font-mono text-xs text-slate-400">
            <Link href="/editorial" className="text-cyan-400 hover:underline">← Back to Editorial Archive</Link>
            <Link href="/couch-mode" className="hover:text-slate-200">Couch Mode →</Link>
          </div>

        </div>
      </article>
    </>
  );
}
