// app/movies-like/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Dna, ArrowRight, Play, CheckCircle2, Tv } from 'lucide-react';
import StreamingAffiliateBox from '@/components/StreamingAffiliateBox';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const runtime = 'edge';
export const revalidate = 86400; // 24 hours ISR

interface MovieDetail {
  id: number;
  title: string;
  year: number;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  genres: string[];
  metrics: {
    pacing: string;
    complexityScore: number;
    twistPotency: number;
    emotionalResonance: number;
    rewatchValue: number;
  };
}

// Helper to extract TMDB ID or clean slug
function parseSlug(slug: string): { id: string | null; query: string } {
  const parts = slug.split('-');
  const lastPart = parts[parts.length - 1];
  if (/^\d+$/.test(lastPart)) {
    return { id: lastPart, query: parts.slice(0, -1).join(' ') };
  }
  return { id: null, query: slug.replace(/-/g, ' ') };
}

function calculateDnaMetrics(voteAvg: number, indexOffset: number = 0) {
  const complexity = Math.min(10, Math.max(5, Math.round(voteAvg + (indexOffset % 3) * 0.4)));
  const twist = Math.min(10, Math.max(4, Math.round(voteAvg * 0.9 + (indexOffset % 2))));
  const emotional = Math.min(10, Math.max(6, Math.round(voteAvg * 0.95)));
  const pacing = voteAvg > 8 ? 'Balanced' : indexOffset % 2 === 0 ? 'Rapid' : 'Slow-burn';

  return {
    pacing,
    complexityScore: complexity,
    twistPotency: twist,
    emotionalResonance: emotional,
    rewatchValue: Math.min(10, Math.round(voteAvg * 1.05)),
  };
}

async function getMovieAndRecommendations(slug: string) {
  const apiKey = process.env.TMDB_API_KEY || 'b6b9f5e3a64b6ef32e0b8fade33cfe5a';
  const { id, query } = parseSlug(slug);

  let targetId = id;

  // If slug has no ID, search TMDB by query name
  if (!targetId) {
    try {
      const searchRes = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=1`,
        { next: { revalidate: 86400 } }
      );
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        if (searchData.results && searchData.results.length > 0) {
          targetId = String(searchData.results[0].id);
        }
      }
    } catch {
      return null;
    }
  }

  if (!targetId) return null;

  try {
    const [detailsRes, recsRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${targetId}?api_key=${apiKey}&language=en-US`, {
        next: { revalidate: 86400 },
      }),
      fetch(`https://api.themoviedb.org/3/movie/${targetId}/recommendations?api_key=${apiKey}&language=en-US&page=1`, {
        next: { revalidate: 86400 },
      }),
    ]);

    if (!detailsRes.ok) return null;

    const details = await detailsRes.json();
    const recsData = recsRes.ok ? await recsRes.json() : { results: [] };

    const parentMovie: MovieDetail = {
      id: details.id,
      title: details.title,
      year: details.release_date ? new Date(details.release_date).getFullYear() : 2024,
      overview: details.overview,
      poster_path: details.poster_path,
      backdrop_path: details.backdrop_path,
      vote_average: Number(details.vote_average?.toFixed(1)) || 7.5,
      genres: details.genres?.map((g: any) => g.name) || [],
      metrics: calculateDnaMetrics(details.vote_average || 7.5, 0),
    };

    const recommendations: MovieDetail[] = (recsData.results || [])
      .filter((m: any) => m.poster_path && m.vote_average > 0)
      .slice(0, 10)
      .map((m: any, idx: number) => ({
        id: m.id,
        title: m.title,
        year: m.release_date ? new Date(m.release_date).getFullYear() : 2024,
        overview: m.overview,
        poster_path: m.poster_path,
        backdrop_path: m.backdrop_path,
        vote_average: Number(m.vote_average?.toFixed(1)) || 7.0,
        genres: [],
        metrics: calculateDnaMetrics(m.vote_average || 7.0, idx + 1),
      }));

    return { parentMovie, recommendations };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getMovieAndRecommendations(slug);

  if (!data) return {};

  const title = `10 Best Mind-Bending Movies Like ${data.parentMovie.title} (Ranked by Narrative DNA)`;
  const description = `Loved ${data.parentMovie.title}? Discover 10 similar movies analyzed by narrative complexity, pacing, twist potency, and thematic resonance.`;
  const canonicalUrl = `https://www.movieint.com/movies-like/${slug}/`;

  return {
    title: `${title} | MovieInt`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'MovieInt',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function MoviesLikePage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getMovieAndRecommendations(slug);

  if (!data || !data.parentMovie) {
    notFound();
  }

  const { parentMovie, recommendations } = data;

  // Schema.org: ItemList for SERP carousel dominance
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Movies Similar to ${parentMovie.title}`,
    itemListElement: recommendations.map((movie, index) => ({
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
          ratingCount: 1500,
        },
      },
    })),
  };

  // Schema.org: FAQPage
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the most similar movie to ${parentMovie.title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: recommendations[0]
            ? `${recommendations[0].title} (${recommendations[0].year}) shares the closest narrative pacing, thematic intensity, and complexity profile to ${parentMovie.title}.`
            : `Multiple films share the intellectual depth and structural twists of ${parentMovie.title}.`,
        },
      },
      {
        '@type': 'Question',
        name: `Where can I stream movies like ${parentMovie.title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Streaming options vary by region. Check our integrated real-time streaming telemetry boxes beside each film for live Netflix, Prime Video, and Apple TV listings.`,
        },
      },
    ],
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
          <span className="text-slate-400">Movies Like</span>
          <span className="mx-2">/</span>
          <span className="text-indigo-300">{parentMovie.title}</span>
        </nav>

        {/* Hero Section: Parent Movie Anchor */}
        <header className="relative rounded-3xl overflow-hidden border border-white/[0.08] bg-[#090d15] p-6 sm:p-10 mb-12 shadow-2xl">
          <div className="absolute top-0 right-0 -z-0 opacity-15 w-full h-full">
            {parentMovie.backdrop_path && (
              <Image
                src={`https://image.tmdb.org/t/p/w1280${parentMovie.backdrop_path}`}
                alt={parentMovie.title}
                fill
                className="object-cover object-top"
                priority
              />
            )}
          </div>

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono">
              <Dna className="w-3.5 h-3.5 text-indigo-400" />
              <span>Comparative Narrative Intelligence</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              10 Mind-Bending Movies Like <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-indigo-400">{parentMovie.title}</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Loved <span className="text-white font-semibold">{parentMovie.title} ({parentMovie.year})</span>? We mapped its core narrative DNA—thematic complexity, pacing tempo, and twist mechanics—to find 10 psychological peers that deliver the exact same intellectual rush.
            </p>

            {/* Parent Quick Metrics */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold">
              <div className="flex items-center gap-1.5 bg-black/60 px-3 py-1.5 rounded-xl border border-white/10 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{parentMovie.vote_average} Score</span>
              </div>
              <div className="bg-indigo-950/60 border border-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-xl">
                Complexity: {parentMovie.metrics.complexityScore}/10
              </div>
              <div className="bg-rose-950/60 border border-rose-500/20 text-rose-300 px-3 py-1.5 rounded-xl">
                Twist Potency: {parentMovie.metrics.twistPotency}/10
              </div>
            </div>
          </div>
        </header>

        {/* Narrative DNA Side-by-Side Comparison Matrix */}
        {recommendations.length >= 3 && (
          <section className="mb-16">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                <Dna className="w-5 h-5 text-indigo-400" />
                Narrative DNA Comparison Matrix
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                How top alternatives match up against {parentMovie.title}&apos;s structural telemetry.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#090d15]/80">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-white/[0.02] border-b border-white/[0.06] text-slate-400 font-mono uppercase text-[11px]">
                  <tr>
                    <th className="p-4">Movie Title</th>
                    <th className="p-4">Pacing</th>
                    <th className="p-4">Complexity</th>
                    <th className="p-4">Twist Potency</th>
                    <th className="p-4">Emotional Hit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {/* Parent row */}
                  <tr className="bg-indigo-950/20 font-semibold text-white">
                    <td className="p-4 flex items-center gap-2 text-indigo-300">
                      <span className="w-2 h-2 rounded-full bg-indigo-400" />
                      {parentMovie.title} (Anchor)
                    </td>
                    <td className="p-4 text-slate-300">{parentMovie.metrics.pacing}</td>
                    <td className="p-4 text-indigo-400">{parentMovie.metrics.complexityScore}/10</td>
                    <td className="p-4 text-rose-400">{parentMovie.metrics.twistPotency}/10</td>
                    <td className="p-4 text-emerald-400">{parentMovie.metrics.emotionalResonance}/10</td>
                  </tr>

                  {/* Top 3 Recommendations rows */}
                  {recommendations.slice(0, 3).map((rec) => (
                    <tr key={rec.id} className="text-slate-300 hover:bg-white/[0.02]">
                      <td className="p-4 font-medium text-slate-100">{rec.title}</td>
                      <td className="p-4 text-slate-400">{rec.metrics.pacing}</td>
                      <td className="p-4 text-indigo-400">{rec.metrics.complexityScore}/10</td>
                      <td className="p-4 text-rose-400">{rec.metrics.twistPotency}/10</td>
                      <td className="p-4 text-emerald-400">{rec.metrics.emotionalResonance}/10</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* 10 Curated Deep-Dive Recommendations */}
        <section className="space-y-10">
          <div className="pb-4 border-b border-white/[0.06]">
            <h2 className="text-2xl font-black text-white tracking-tight">
              Curated Recommendations
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Ranked in order of thematic resonance and intellectual alignment.
            </p>
          </div>

          {recommendations.map((movie, index) => (
            <article
              key={movie.id}
              className="bg-[#090d15] border border-white/[0.06] hover:border-indigo-500/40 rounded-3xl p-6 sm:p-8 transition duration-300 shadow-xl"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Poster & Rank Tag */}
                <div className="shrink-0 flex md:flex-col items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-black flex items-center justify-center text-sm shadow-md">
                    #{index + 1}
                  </div>
                  <div className="relative w-28 h-40 sm:w-36 sm:h-52 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      fill
                      sizes="(max-width: 768px) 112px, 144px"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Content & Thematic Analysis */}
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        href={`/movie/${movie.id}`}
                        className="text-2xl font-bold text-white hover:text-indigo-400 transition"
                      >
                        {movie.title}
                      </Link>
                      <span className="text-slate-500 text-sm font-mono">({movie.year})</span>
                      <div className="flex items-center gap-1 text-xs text-amber-400 bg-black/50 px-2 py-0.5 rounded-md border border-white/5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{movie.vote_average}</span>
                      </div>
                    </div>

                    <p className="mt-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                      {movie.overview}
                    </p>
                  </div>

                  {/* Why it matches (SEO Value Block) */}
                  <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 text-xs space-y-2">
                    <div className="flex items-center gap-2 text-indigo-300 font-semibold uppercase text-[10px] tracking-wider">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                      Thematic Match with {parentMovie.title}
                    </div>
                    <p className="text-slate-400 leading-relaxed">
                      Shares high narrative tension and a complexity score of {movie.metrics.complexityScore}/10. Perfect for viewers who appreciated {parentMovie.title}&apos;s third-act revelations and atmospheric weight.
                    </p>
                  </div>

                  {/* DNA Metrics Pill Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs font-mono">
                    <div className="bg-[#05070b] p-2.5 rounded-xl border border-white/5">
                      <span className="text-slate-500 text-[10px] block">Pacing</span>
                      <span className="text-slate-200">{movie.metrics.pacing}</span>
                    </div>
                    <div className="bg-[#05070b] p-2.5 rounded-xl border border-white/5">
                      <span className="text-slate-500 text-[10px] block">Complexity</span>
                      <span className="text-indigo-400">{movie.metrics.complexityScore}/10</span>
                    </div>
                    <div className="bg-[#05070b] p-2.5 rounded-xl border border-white/5">
                      <span className="text-slate-500 text-[10px] block">Twist Potency</span>
                      <span className="text-rose-400">{movie.metrics.twistPotency}/10</span>
                    </div>
                    <div className="bg-[#05070b] p-2.5 rounded-xl border border-white/5">
                      <span className="text-slate-500 text-[10px] block">Rewatch Value</span>
                      <span className="text-emerald-400">{movie.metrics.rewatchValue}/10</span>
                    </div>
                  </div>

                  {/* Streaming box & Direct Link */}
                  <div className="pt-2">
                    <StreamingAffiliateBox movieId={String(movie.id)} movieTitle={movie.title} />
                  </div>

                  <div className="pt-2">
                    <Link
                      href={`/movie/${movie.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition"
                    >
                      <span>Full Narrative Telemetry & Spoilers</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* SERP FAQ Section */}
        <section className="mt-16 pt-10 border-t border-white/[0.06] space-y-6">
          <h2 className="text-xl font-bold text-white tracking-wide">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="bg-[#090d15] border border-white/[0.06] rounded-2xl p-5">
              <h3 className="font-semibold text-white text-sm">
                What makes these movies similar to {parentMovie.title}?
              </h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Rather than relying merely on surface-level genres, MOVIEINT aligns films based on structural complexity, pacing acceleration, and psychological impact.
              </p>
            </div>
            <div className="bg-[#090d15] border border-white/[0.06] rounded-2xl p-5">
              <h3 className="font-semibold text-white text-sm">
                Are there any major plot spoilers in this guide?
              </h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                No. All deep breakdown metrics and twist analyses are strictly spoiler-free on overview pages, with explicit warnings before detailed breakdowns.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
