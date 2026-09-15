import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EDITORIAL_ARTICLES, EditorialArticle } from '@/lib/editorial-data';
import Image from 'next/image';
import { BookOpen } from 'lucide-react';
import { Star, ArrowLeft, Trophy, Flame, Sparkles, Film, ArrowUpRight } from 'lucide-react';
import MoviePoster from '@/components/MoviePoster';

interface PageProps {
  params: Promise<{ category: string }>;
}

export const revalidate = 86400; // 24 hours ISR

interface RankingCategoryConfig {
  title: string;
  metaTitle: string;
  metaDescription: string;
  tagline: string;
  endpoint: string;
  isTv?: boolean;
}

const RANKINGS_CONFIG: Record<string, RankingCategoryConfig> = {
  'best-movies-2026': {
    title: 'Top Rated & Best Movies of 2026',
    metaTitle: 'Best Movies of 2026 Ranked — Definitive Cinema Intelligence | MOVIEINT',
    metaDescription: 'Discover the highest-rated cinema releases of 2026. Ranked by community sentiment, storytelling depth, and critical consensus.',
    tagline: 'Definitive algorithmic and critical ranking of notable 2026 theatrical and streaming releases.',
    endpoint: 'discover/movie?primary_release_year=2026&sort_by=vote_average.desc&vote_count.gte=100',
  },
  'best-anime': {
    title: 'Best Anime Series & Masterpieces Ranked',
    metaTitle: 'Best Anime of All Time Ranked | MOVIEINT',
    metaDescription: 'The ultimate ranking of iconic anime series and masterpieces based on narrative arcs, worldbuilding, and emotional impact.',
    tagline: 'Legendary shonen, psychological thrillers, and acclaimed fantasy anime ranked by audience resonance.',
    endpoint: 'discover/tv?with_genres=16&with_original_language=ja&sort_by=vote_average.desc&vote_count.gte=300',
    isTv: true,
  },
  'best-thrillers': {
    title: 'Best Psychological & Suspense Thrillers Ranked',
    metaTitle: 'Top Rated Thriller Movies of All Time Ranked | MOVIEINT',
    metaDescription: 'Explore the greatest edge-of-your-seat psychological thrillers and crime mysteries ranked by tension and twist potency.',
    tagline: 'High-tension cinema, intricate plot twists, and mind-bending psychological thrillers evaluated.',
    endpoint: 'discover/movie?with_genres=53&sort_by=vote_average.desc&vote_count.gte=800',
  },
  'best-k-dramas': {
    title: 'Top Rated K-Dramas & Korean Series Ranked',
    metaTitle: 'Best Korean Dramas (K-Dramas) Ranked | MOVIEINT',
    metaDescription: 'The definitive ranking of acclaimed Korean drama series, from intense thrillers to emotional masterpieces.',
    tagline: 'Critically acclaimed Korean television masterworks evaluated on pacing, acting nuance, and drama arcs.',
    endpoint: 'discover/tv?with_original_language=ko&sort_by=vote_average.desc&vote_count.gte=150',
    isTv: true,
  },
  'best-netflix-movies': {
    title: 'Best Movies on Netflix Right Now Ranked',
    metaTitle: 'Best Netflix Movies Ranked (2026 Edition) | MOVIEINT',
    metaDescription: 'Stop scrolling and find what to watch: the highest-rated movies and originals currently streaming on Netflix.',
    tagline: 'Curated and continuously updated index of the highest-rated cinematic releases streaming on Netflix.',
    endpoint: 'discover/movie?with_watch_providers=8&watch_region=US&sort_by=vote_average.desc&vote_count.gte=500',
  },
};

export async function generateStaticParams() {
  return Object.keys(RANKINGS_CONFIG).map((category) => ({ category }));
}

async function getRankedMedia(config: RankingCategoryConfig) {
  const apiKey = process.env.TMDB_API_KEY || 'b6b9f5e3a64b6ef32e0b8fade33cfe5a';
  try {
    const res = await fetch(`https://api.themoviedb.org/3/${config.endpoint}&api_key=${apiKey}&language=en-US&page=1`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || [])
      .filter((item: any) => item.poster_path && (item.vote_average ?? 0) > 0)
      .slice(0, 24)
      .map((item: any) => ({
        id: config.isTv ? `tv-${item.id}` : String(item.id),
        title: item.title || item.name || 'Untitled',
        poster_path: item.poster_path,
        backdrop_path: item.backdrop_path,
        vote_average: item.vote_average,
        vote_count: item.vote_count,
        release_date: item.release_date || item.first_air_date,
        overview: item.overview,
      }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const config = RANKINGS_CONFIG[category];
  if (!config) return {};

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.movieint.com';
  const canonicalUrl = `${baseUrl}/rankings/${category}`;

  return {
    title: config.metaTitle,
    description: config.metaDescription,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: config.metaTitle,
      description: config.metaDescription,
      url: canonicalUrl,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.metaTitle,
      description: config.metaDescription,
    },
  };
}

export default async function RankingCategoryPage({ params }: PageProps) {
  const { category } = await params;
  const config = RANKINGS_CONFIG[category];
  if (!config) notFound();

  const items = await getRankedMedia(config);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.movieint.com';

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: config.title,
    description: config.metaDescription,
    itemListElement: items.map((item: any, idx: number) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': config.isTv ? 'TVSeries' : 'Movie',
        name: item.title,
        url: `${baseUrl}/movie/${item.id}`,
        image: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : undefined,
      },
    })),
  };

  
  // Filter relevant editorial guides for this category silo
  const allEditorials = EDITORIAL_ARTICLES;
  const relatedGuides = allEditorials.filter((art: EditorialArticle) => {
    const catLower = category.toLowerCase();
    if (catLower.includes('anime')) return art.slug.includes('anime') || art.themeTag.toLowerCase().includes('sci-fi');
    if (catLower.includes('k-drama')) return art.slug.includes('k-drama') || art.moodTag.toLowerCase().includes('dark');
    if (catLower.includes('thriller')) return art.moodTag.toLowerCase().includes('mind-bending') || art.themeTag.toLowerCase().includes('crime');
    return art.featured;
  }).slice(0, 3);

  return (
    <main className="min-h-screen bg-[#05070b] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <nav className="flex items-center justify-between text-xs text-slate-500 uppercase tracking-widest font-mono mb-8">
        <Link href="/rankings" className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Rankings Hub
        </Link>
        <span className="text-slate-400 font-bold">{items.length} Titles Ranked</span>
      </nav>

      <header className="rounded-3xl border border-white/[0.08] bg-[#090d15] p-6 sm:p-10 mb-10 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono font-semibold uppercase mb-4">
          <Trophy className="w-3.5 h-3.5 text-amber-400" /> Curated Intelligence Ranking
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
          {config.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          {config.tagline}
        </p>

        {/* Quick Category Navigation Pill Bar */}
        <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-wrap gap-2">
          {Object.entries(RANKINGS_CONFIG).map(([slug, c]) => (
            <Link
              key={slug}
              href={`/rankings/${slug}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                slug === category
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-white/[0.03] text-slate-400 hover:bg-white/[0.07] hover:text-white'
              }`}
            >
              {c.title.replace(' Ranked', '')}
            </Link>
          ))}
        </div>
      </header>

      {/* Rankings List */}
      <div className="space-y-4">
        {items.map((item: any, index: number) => {
          const rank = index + 1;
          const year = (item.release_date || '').split('-')[0] || '2026';

          return (
            <article
              key={item.id}
              className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-5 bg-[#090d15] border border-white/[0.06] hover:border-indigo-500/40 rounded-2xl p-4 sm:p-5 transition duration-200 shadow-lg"
            >
              {/* Rank Position */}
              <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 font-mono font-black text-base text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition">
                #{rank}
              </div>

              {/* Poster */}
              <div className="relative w-20 sm:w-24 aspect-[2/3] rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-white/10">
                <MoviePoster
                  src={item.poster_path ? `https://image.tmdb.org/t/p/w342${item.poster_path}` : null}
                  alt={item.title}
                  fallbackTitle={item.title}
                  fill
                  sizes="96px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Title and Overview */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="text-slate-400">{year}</span>
                  <span className="text-slate-600">•</span>
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {item.vote_average.toFixed(1)}
                  </span>
                  <span className="text-slate-500 text-[11px]">({item.vote_count} reviews)</span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-white group-hover:text-indigo-300 transition line-clamp-1">
                  <Link href={`/movie/${item.id}`}>{item.title}</Link>
                </h2>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed max-w-3xl">
                  {item.overview || 'Comprehensive narrative telemetry and streaming availability indexed on MovieInt.'}
                </p>
              </div>

              {/* Direct Telemetry & Where to Watch Link */}
              <div className="shrink-0 w-full sm:w-auto pt-2 sm:pt-0">
                <Link
                  href={`/movie/${item.id}`}
                  className="inline-flex items-center justify-center gap-1.5 w-full sm:w-auto px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600 border border-indigo-500/30 hover:border-transparent text-indigo-300 hover:text-white rounded-xl text-xs font-bold transition duration-200"
                >
                  <span>Where to Watch</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
