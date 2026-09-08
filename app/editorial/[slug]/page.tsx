// app/editorial/[slug]/page.tsx
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  getEditorialBySlug,
  getAllEditorialSlugs,
  getRelatedArticles,
  EDITORIAL_ARTICLES,
  EditorialArticle,
} from '@/lib/editorial-data';

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

// 1. Static Generation for speed & SEO indexing
export async function generateStaticParams() {
  const slugs = getAllEditorialSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Helper: Safely resolve slug across Next.js 14 and 15
async function resolveSlug(params: any): Promise<string> {
  if (!params) return '';
  const resolved = await Promise.resolve(params);
  const raw = resolved?.slug;
  if (Array.isArray(raw)) return raw[0] || '';
  return typeof raw === 'string' ? raw : '';
}

// Helper: Resilient article matching
function findArticle(rawSlug: string): EditorialArticle | undefined {
  if (!rawSlug) return undefined;
  const clean = decodeURIComponent(rawSlug).trim().toLowerCase();
  return (
    getEditorialBySlug(clean) ||
    EDITORIAL_ARTICLES.find((a) => a.slug.toLowerCase() === clean) ||
    EDITORIAL_ARTICLES.find((a) => a.slug.toLowerCase().includes(clean) || clean.includes(a.slug.toLowerCase()))
  );
}

// Helper: Dynamic Streaming URL & Branding Engine
function getPlatformConfig(platform: string, movieTitle: string) {
  const encTitle = encodeURIComponent(movieTitle);
  const pLower = platform.toLowerCase();

  if (pLower.includes('netflix')) {
    return {
      url: `https://www.netflix.com/search?q=${encTitle}`,
      badgeClass: 'bg-rose-950/50 text-rose-300 border-rose-600/40 hover:bg-rose-900/60 hover:border-rose-500',
      dotClass: 'bg-rose-500',
      label: 'Netflix'
    };
  }
  if (pLower.includes('prime')) {
    return {
      url: `https://www.amazon.com/s?k=${encTitle}+movie&i=instant-video`,
      badgeClass: 'bg-sky-950/50 text-sky-300 border-sky-600/40 hover:bg-sky-900/60 hover:border-sky-500',
      dotClass: 'bg-sky-400',
      label: 'Prime Video'
    };
  }
  if (pLower.includes('apple')) {
    return {
      url: `https://tv.apple.com/search?term=${encTitle}`,
      badgeClass: 'bg-slate-800/80 text-slate-200 border-slate-600/40 hover:bg-slate-700/80 hover:border-slate-400',
      dotClass: 'bg-slate-300',
      label: 'Apple TV'
    };
  }
  if (pLower.includes('max') || pLower.includes('hbo')) {
    return {
      url: `https://www.max.com/search?q=${encTitle}`,
      badgeClass: 'bg-purple-950/50 text-purple-300 border-purple-600/40 hover:bg-purple-900/60 hover:border-purple-500',
      dotClass: 'bg-purple-400',
      label: 'Max'
    };
  }
  if (pLower.includes('disney')) {
    return {
      url: `https://www.disneyplus.com/search?q=${encTitle}`,
      badgeClass: 'bg-blue-950/50 text-blue-300 border-blue-600/40 hover:bg-blue-900/60 hover:border-blue-500',
      dotClass: 'bg-blue-400',
      label: 'Disney+'
    };
  }
  if (pLower.includes('paramount')) {
    return {
      url: `https://www.paramountplus.com/search/?q=${encTitle}`,
      badgeClass: 'bg-blue-900/50 text-blue-200 border-blue-500/40 hover:bg-blue-800/60 hover:border-blue-400',
      dotClass: 'bg-blue-300',
      label: 'Paramount+'
    };
  }
  if (pLower.includes('hulu')) {
    return {
      url: `https://www.hulu.com/search?q=${encTitle}`,
      badgeClass: 'bg-emerald-950/50 text-emerald-300 border-emerald-600/40 hover:bg-emerald-900/60 hover:border-emerald-500',
      dotClass: 'bg-emerald-400',
      label: 'Hulu'
    };
  }
  if (pLower.includes('criterion')) {
    return {
      url: `https://www.criterionchannel.com/search?q=${encTitle}`,
      badgeClass: 'bg-amber-950/50 text-amber-300 border-amber-600/40 hover:bg-amber-900/60 hover:border-amber-500',
      dotClass: 'bg-amber-400',
      label: 'Criterion'
    };
  }
  return {
    url: `https://www.google.com/search?q=watch+${encTitle}+streaming+online`,
    badgeClass: 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700',
    dotClass: 'bg-cyan-400',
    label: platform
  };
}

// 2. Strict SEO Metadata generation
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const slug = await resolveSlug(params);
  const article = findArticle(slug);

  if (!article) return { title: 'Guide Not Found | MOVIEINT' };

  const url = `https://www.movieint.com/editorial/${article.slug}`;

  return {
    title: article.seoTitle,
    description: article.metaDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: article.seoTitle,
      description: article.metaDescription,
      url: url,
      siteName: 'MOVIEINT',
      type: 'article',
      publishedTime: article.publishedDate,
      modifiedTime: article.modifiedDate,
      authors: [article.author.name],
      images: [
        {
          url: article.coverImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.seoTitle,
      description: article.metaDescription,
      images: [article.coverImage],
    },
  };
}

export default async function EditorialArticlePage({ params }: PageProps) {
  const slug = await resolveSlug(params);
  const article = findArticle(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(article.slug, 3);
  const canonicalUrl = `https://www.movieint.com/editorial/${article.slug}`;

  // Structured Data JSON-LD
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.movieint.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Editorial Guides',
        item: 'https://www.movieint.com/editorial',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: canonicalUrl,
      },
    ],
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.metaDescription,
    image: [article.coverImage],
    datePublished: article.publishedDate,
    dateModified: article.modifiedDate,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    author: {
      '@type': 'Organization',
      name: article.author.name,
      url: 'https://www.movieint.com/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'MOVIEINT',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.movieint.com/favicon.ico',
      },
    },
  };

  const faqSchema =
    article.faqs && article.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: article.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <>
      {/* Search Engine Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <article className="min-h-screen bg-[#07090e] text-slate-200 selection:bg-cyan-500/20 selection:text-cyan-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center space-x-2 text-xs font-mono text-slate-400">
            <Link href="/" className="hover:text-cyan-400 transition-colors">
              HOME
            </Link>
            <span>/</span>
            <Link href="/editorial" className="hover:text-cyan-400 transition-colors">
              EDITORIAL
            </Link>
            <span>/</span>
            <span className="text-slate-200 truncate max-w-[200px] sm:max-w-none">
              {article.title}
            </span>
          </nav>

          {/* Article Header */}
          <header className="space-y-4 border-b border-slate-800 pb-8 mb-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider">
                {article.moodTag}
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700/60 text-slate-300 text-xs font-mono">
                {article.themeTag}
              </span>
              <span className="text-xs font-mono text-slate-400 ml-auto">
                {article.readTime}
              </span>
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

          {/* Table of Contents & Key Telemetry */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 mb-12">
            <h2 className="text-sm font-mono uppercase tracking-wider text-cyan-400 font-bold mb-3">
              Telemetry Summary & Evaluated Titles
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              {article.movies.map((m, idx) => (
                <li key={m.slugId}>
                  <a
                    href={`#movie-${m.slugId}`}
                    className="text-slate-300 hover:text-cyan-300 flex items-center gap-2 py-0.5"
                  >
                    <span className="text-cyan-500">#{idx + 1}</span>
                    <span>{m.title} ({m.year})</span>
                    <span className="text-amber-400 ml-auto font-semibold">DNA {m.dnaScore}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Main Article Content: The Movie Cards */}
          <section className="space-y-12">
            {article.movies.map((m, index) => (
              <div
                key={m.slugId}
                id={`movie-${m.slugId}`}
                className="scroll-mt-20 rounded-2xl bg-[#0b0e17] border border-slate-800 p-6 sm:p-8 hover:border-slate-700 transition-all shadow-xl"
              >
                {/* Header with Ranking and Direct Movie Link */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800/80 pb-5 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-cyan-400 font-mono font-bold text-sm">
                        ENTRY #{index + 1}
                      </span>
                      <span className="text-slate-500 text-xs font-mono">•</span>
                      <span className="text-slate-400 text-xs font-mono">{m.year}</span>
                      <span className="text-slate-500 text-xs font-mono">•</span>
                      <span className="text-slate-400 text-xs font-mono">{m.runtime}</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold text-white">
                      <Link
                        href={`/movie/${m.slugId}`}
                        className="hover:text-cyan-300 transition-colors inline-flex items-center gap-2"
                      >
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

                  {/* MovieINT DNA Score Box */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center p-3 rounded-lg bg-slate-900 border border-slate-700/60 font-mono">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400">
                      MOVIEINT DNA
                    </span>
                    <span className="text-2xl font-black text-cyan-400">{m.dnaScore}</span>
                    <span className="text-[10px] text-slate-500">Telemetry v3.2</span>
                  </div>
                </div>

                {/* MovieINT Narrative DNA Telemetry Bars */}
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

                {/* Why It's Recommended */}
                <div className="space-y-3 text-sm leading-relaxed mb-6">
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-1">
                      Algorithmic Narrative Assessment:
                    </h4>
                    <p className="text-slate-200">{m.whyRecommended}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
                    <div className="p-3 rounded bg-emerald-950/20 border border-emerald-500/20 text-emerald-200">
                      <strong>Best For:</strong> {m.bestFor}
                    </div>
                    <div className="p-3 rounded bg-rose-950/20 border border-rose-500/20 text-rose-200">
                      <strong>Skip If:</strong> {m.avoidIf}
                    </div>
                  </div>
                </div>

                {/* High-Converting Streaming Buttons (Monetization & Watch Links) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 border-t border-slate-800/80 text-xs font-mono">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-slate-400 font-semibold mr-1">Where to Watch:</span>
                    {m.streamingOn && m.streamingOn.length > 0 ? (
                      m.streamingOn.map((plat) => {
                        const cfg = getPlatformConfig(plat, m.title);
                        return (
                          <a
                            key={plat}
                            href={cfg.url}
                            target="_blank"
                            rel="noopener noreferrer sponsored"
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md border text-xs font-medium transition-all shadow-sm ${cfg.badgeClass}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotClass}`} />
                            <span>{cfg.label}</span>
                            <svg className="w-3 h-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        );
                      })
                    ) : (
                      <span className="text-slate-500">Check Local Streaming</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/movie/${m.slugId}`}
                      className="px-3.5 py-1.5 rounded-md bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-semibold transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>Full DNA</span>
                      <span>→</span>
                    </Link>
                    <Link
                      href={`/vs?titleA=${encodeURIComponent(m.title)}`}
                      className="px-3 py-1.5 rounded-md bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                    >
                      Compare in Vs
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Genuine Visible FAQ Section */}
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

          {/* Related Discovery Guides */}
          <section className="mt-16 pt-12 border-t border-slate-800">
            <h2 className="text-2xl font-bold text-white mb-6">Related Editorial Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/editorial/${rel.slug}`}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                      {rel.moodTag}
                    </span>
                    <h3 className="text-sm font-bold text-slate-200 group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {rel.title}
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-slate-500 mt-3 block">
                    {rel.readTime} →
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Return & Tool Links */}
          <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/80 pt-6 font-mono text-xs text-slate-400">
            <Link href="/editorial" className="text-cyan-400 hover:underline">
              ← Back to Editorial Archive
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/roulette" className="hover:text-slate-200">Cine-Roulette</Link>
              <Link href="/couch-mode" className="hover:text-slate-200">Couch Mode</Link>
              <Link href="/rankings" className="hover:text-slate-200">Global Rankings</Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
