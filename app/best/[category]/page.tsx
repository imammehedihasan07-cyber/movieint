// app/best/[category]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShieldAlert, Zap, ArrowRight } from 'lucide-react';
import { INTENT_FILTERS } from '@/config/intentFilters';
import { getFilteredMovies } from '@/lib/getFilteredMovies';
import StreamingAffiliateBox from '@/components/StreamingAffiliateBox';

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export const revalidate = 86400; // 24 hours ISR

export async function generateStaticParams() {
  return Object.keys(INTENT_FILTERS).map((key) => ({
    category: key,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const filter = INTENT_FILTERS[category];

  if (!filter) {
    return {};
  }

  const canonicalUrl = `https://www.movieint.com/best/${category}/`;

  return {
    title: `${filter.title} | MovieInt`,
    description: filter.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${filter.title} | MovieInt`,
      description: filter.metaDescription,
      url: canonicalUrl,
      siteName: 'MovieInt',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${filter.title} | MovieInt`,
      description: filter.metaDescription,
    },
  };
}

export default async function BestCategoryPage({ params }: PageProps) {
  const { category } = await params;
  const filter = INTENT_FILTERS[category];

  if (!filter) {
    notFound();
  }

  const movies = await getFilteredMovies(filter);

  // Schema.org: ItemList
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: filter.h1,
    description: filter.metaDescription,
    itemListElement: movies.map((movie, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Movie',
        name: movie.title,
        url: `https://www.movieint.com/movie/${movie.id}/`,
        image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        dateCreated: `${movie.year}`,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: movie.vote_average,
          bestRating: 10,
          ratingCount: 1000,
        },
      },
    })),
  };

  // Schema.org: FAQPage
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: filter.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="min-h-screen bg-[#05070b] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="text-xs text-slate-500 uppercase tracking-widest mb-6">
          <Link href="/" className="hover:text-indigo-400">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-400">Best</span>
          <span className="mx-2">/</span>
          <span className="text-indigo-300">{category}</span>
        </nav>

        {/* Hero Section */}
        <header className="mb-12">
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            {filter.h1}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            {filter.description}
          </p>
        </header>

        {/* Movie Grid */}
        <section className="space-y-12">
          {movies.map((movie, index) => (
            <article
              key={movie.id}
              className="bg-[#090d15] border border-white/[0.06] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start"
            >
              {/* Poster */}
              <div className="relative w-32 h-48 sm:w-40 sm:h-60 rounded-2xl overflow-hidden shrink-0 border border-white/10 shadow-2xl">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  fill
                  sizes="(max-width: 768px) 128px, 160px"
                  className="object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xl sm:text-2xl font-black text-indigo-400">
                      #{index + 1}
                    </span>
                    <Link
                      href={`/movie/${movie.id}`}
                      className="text-xl sm:text-2xl font-bold text-white hover:text-indigo-400 transition"
                    >
                      {movie.title}
                    </Link>
                    <span className="text-slate-500 text-sm font-mono">({movie.year})</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-black/60 px-3 py-1 rounded-full border border-white/5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{movie.vote_average} Score</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {movie.overview}
                </p>

                {/* Telemetry Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs font-mono">
                  <div className="bg-[#05070b] p-3 rounded-xl border border-white/5">
                    <span className="text-slate-500 text-[10px] block">Pacing</span>
                    <span className="text-slate-200">{movie.metrics.pacing}</span>
                  </div>
                  <div className="bg-[#05070b] p-3 rounded-xl border border-white/5">
                    <span className="text-slate-500 text-[10px] block">Complexity</span>
                    <span className="text-indigo-400">{movie.metrics.complexityScore}/10</span>
                  </div>
                  <div className="bg-[#05070b] p-3 rounded-xl border border-white/5">
                    <span className="text-slate-500 text-[10px] block">Twist Potency</span>
                    <span className="text-rose-400">{movie.metrics.twistPotency}/10</span>
                  </div>
                  <div className="bg-[#05070b] p-3 rounded-xl border border-white/5">
                    <span className="text-slate-500 text-[10px] block">Boredom Risk</span>
                    <span className="text-amber-400">{movie.metrics.boredomRisk}</span>
                  </div>
                </div>

                {/* Streaming Availability Box */}
                <div className="pt-2">
                  <StreamingAffiliateBox movieId={String(movie.id)} movieTitle={movie.title} />
                </div>

                {/* Link to Detail Page */}
                <div className="pt-2">
                  <Link
                    href={`/movie/${movie.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition"
                  >
                    <span>Full Narrative DNA Breakdown</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* FAQs */}
        <section className="mt-16 pt-10 border-t border-white/[0.06] space-y-6">
          <h2 className="text-xl font-bold text-white tracking-wide">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {filter.faqs.map((faq, idx) => (
              <div key={idx} className="bg-[#090d15] border border-white/[0.06] rounded-2xl p-5">
                <h3 className="font-semibold text-white text-sm">{faq.question}</h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
