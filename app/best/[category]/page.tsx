// app/best/[category]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { INTENT_FILTERS } from '@/config/intentFilters';
import { getMoviesByIntent, MovieItem } from '@/lib/getFilteredMovies';
import StreamingAffiliateBox from '@/components/StreamingAffiliateBox';

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

// Edge Runtime compatible & ISR
export const runtime = 'edge';
export const revalidate = 86400; // 24 hours

export async function generateStaticParams() {
  return Object.keys(INTENT_FILTERS).map((key) => ({
    category: key,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const config = INTENT_FILTERS[category];

  if (!config) return {};

  const canonicalUrl = `https://www.movieint.com/best/${config.slug}/`;

  return {
    title: config.metaTitle,
    description: config.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: config.metaTitle,
      description: config.metaDescription,
      url: canonicalUrl,
      siteName: 'MovieInt',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.metaTitle,
      description: config.metaDescription,
    },
  };
}

export default async function IntentListingPage({ params }: PageProps) {
  const { category } = await params;
  const config = INTENT_FILTERS[category];

  if (!config) {
    notFound();
  }

  const movies = await getMoviesByIntent(config);

  // Schema.org: ItemList for SERP Carousel / Numbered list
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: config.h1,
    description: config.metaDescription,
    itemListElement: movies.map((movie, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Movie',
        name: movie.title,
        url: `https://www.movieint.com/movie/${movie.slug}/`,
        image: movie.posterUrl,
        dateCreated: `${movie.year}`,
        ...(movie.ratings.imdb && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: movie.ratings.imdb,
            bestRating: 10,
            ratingCount: 1000,
          },
        }),
      },
    })),
  };

  // Schema.org: FAQPage
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: config.faqs.map((faq) => ({
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
      {/* Structured Data Script Tags */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="min-h-screen bg-neutral-950 text-neutral-100 py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Header / Hero Section */}
        <header className="mb-10 space-y-4">
          <nav className="text-xs text-neutral-400 uppercase tracking-widest">
            <Link href="/" className="hover:text-amber-400">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-neutral-200">{config.type}</span>
          </nav>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-50">
            {config.h1}
          </h1>
          <p className="text-neutral-400 text-base sm:text-lg max-w-3xl leading-relaxed">
            {config.introText}
          </p>

          <div className="flex flex-wrap gap-3 pt-2 text-xs font-semibold">
            <span className="bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-full text-neutral-300">
              {movies.length} Analyzed Titles
            </span>
            <span className="bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-full text-amber-400">
              Ranked by Narrative DNA
            </span>
          </div>
        </header>

        {/* Ranked Movie List */}
        <section className="space-y-8">
          {movies.map((movie, index) => (
            <article
              key={movie.id}
              className="bg-neutral-900/60 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700 transition-all duration-200"
            >
              <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-6">
                {/* Ranking & Poster */}
                <div className="relative shrink-0 flex flex-row md:flex-col items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-500 text-neutral-950 font-black flex items-center justify-center text-lg shadow-lg">
                    #{index + 1}
                  </div>
                  <div className="relative w-28 h-40 sm:w-36 sm:h-52 rounded-xl overflow-hidden shadow-2xl border border-neutral-800">
                    <Image
                      src={movie.posterUrl}
                      alt={movie.title}
                      fill
                      sizes="(max-width: 768px) 112px, 144px"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Details & DNA Matrix */}
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        href={`/movie/${movie.slug}/`}
                        className="text-2xl font-bold text-neutral-100 hover:text-amber-400 transition"
                      >
                        {movie.title}
                      </Link>
                      <span className="text-neutral-500 font-mono text-sm">({movie.year})</span>
                      <span className="text-neutral-500 text-sm">• {movie.runtime}m</span>
                    </div>

                    <p className="mt-2 text-sm text-neutral-300 line-clamp-3 leading-relaxed">
                      {movie.synopsis}
                    </p>
                  </div>

                  {/* Narrative DNA Quick Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                    <div className="bg-neutral-950/80 p-2.5 rounded-lg border border-neutral-800">
                      <span className="text-neutral-500 block">Pacing</span>
                      <span className="font-semibold text-neutral-200">{movie.metrics.pacing}</span>
                    </div>
                    <div className="bg-neutral-950/80 p-2.5 rounded-lg border border-neutral-800">
                      <span className="text-neutral-500 block">Complexity</span>
                      <span className="font-semibold text-amber-400">{movie.metrics.complexityScore}/10</span>
                    </div>
                    <div className="bg-neutral-950/80 p-2.5 rounded-lg border border-neutral-800">
                      <span className="text-neutral-500 block">Twist Potency</span>
                      <span className="font-semibold text-purple-400">{movie.metrics.twistPotency}/10</span>
                    </div>
                    <div className="bg-neutral-950/80 p-2.5 rounded-lg border border-neutral-800">
                      <span className="text-neutral-500 block">Rewatch Value</span>
                      <span className="font-semibold text-emerald-400">{movie.metrics.rewatchValue}/10</span>
                    </div>
                  </div>

                  {/* Streaming Options via Existing Affiliate Box */}
                  <div className="pt-2">
                    <StreamingAffiliateBox
                      movieId={movie.id}
                      movieTitle={movie.title}
                    />
                  </div>

                  <div className="pt-2">
                    <Link
                      href={`/movie/${movie.slug}/`}
                      className="inline-flex items-center text-xs font-semibold text-amber-400 hover:text-amber-300 transition"
                    >
                      Deep Dive into Narrative DNA & Spoilers →
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Programmatic FAQ Section for SERP Answer Boxes */}
        {config.faqs.length > 0 && (
          <section className="mt-16 pt-12 border-t border-neutral-900 space-y-6">
            <h2 className="text-2xl font-bold text-neutral-100">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {config.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-5"
                >
                  <h3 className="font-semibold text-neutral-200 text-base">{faq.question}</h3>
                  <p className="mt-2 text-sm text-neutral-400 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
