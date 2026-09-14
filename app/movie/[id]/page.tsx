import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Star,
  Film,
  Dna,
  Clock,
  Calendar,
  Layers,
  ArrowUpRight,
  Activity,
  Brain,
  Zap,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  BookOpen,
  Bookmark,
  Share2,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import MoviePoster from '@/components/MoviePoster';
import StreamingAffiliateBox from '@/components/StreamingAffiliateBox';
import SpoilerShield from '@/components/SpoilerShield';
import { getRelatedEditorialsForMovie } from '@/lib/editorial-data';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 86400; // 24 hours ISR

function calculateBaselineDNA(title: string, genre: string, voteAvg: number, overview: string, runtime: number) {
  const g = (genre || '').toLowerCase();
  const text = (overview || '').toLowerCase();

  let pacingScore = 65;
  if (g.includes('action') || g.includes('animation') || g.includes('thriller')) pacingScore += 16;
  if (g.includes('drama') || runtime > 130) pacingScore -= 12;
  pacingScore = Math.min(96, Math.max(45, pacingScore));

  let complexityScore = 60;
  if (g.includes('mystery') || g.includes('sci-fi') || g.includes('psychological') || text.includes('identity')) {
    complexityScore += 22;
  }
  complexityScore = Math.min(98, Math.max(35, complexityScore));

  let twistScore = 55;
  if (text.includes('secret') || text.includes('reveals') || text.includes('twist') || g.includes('mystery')) {
    twistScore += 25;
  }
  twistScore = Math.min(95, Math.max(30, twistScore));

  let resonanceScore = Math.min(99, Math.round(voteAvg * 10 + 4));

  return {
    pacing: {
      score: pacingScore,
      label: pacingScore > 75 ? 'Rapid Accelerating' : pacingScore > 58 ? 'Balanced Dynamic' : 'Methodical Slow-Burn',
    },
    complexity: {
      score: complexityScore,
      label: complexityScore > 75 ? 'Multi-Layered Cerebral' : complexityScore > 50 ? 'Linear Cohesive' : 'Direct Narrative',
    },
    twistPotency: {
      score: twistScore,
      label: twistScore > 70 ? 'High Reality Subversion' : 'Organic Progression',
    },
    emotionalResonance: {
      score: resonanceScore,
      label: resonanceScore > 75 ? 'Profound Thematic Depth' : 'Engaging Storytelling',
    },
  };
}

async function getUniversalMediaDetails(id: string) {
  const apiKey = process.env.TMDB_API_KEY || 'b6b9f5e3a64b6ef32e0b8fade33cfe5a';
  const rawId = String(id || '').trim();
  const hasTvPrefix = rawId.startsWith('tv-') || rawId.startsWith('series-');
  const cleanId = rawId.replace(/^(tv-|series-|movie-)/, '');

  if (!cleanId) return null;

  let endpoint: 'movie' | 'tv' = hasTvPrefix ? 'tv' : 'movie';
  let mediaRes = await fetch(`https://api.themoviedb.org/3/${endpoint}/${cleanId}?api_key=${apiKey}&language=en-US`, {
    next: { revalidate: 86400 },
  }).catch(() => null);

  if ((!mediaRes || !mediaRes.ok) && !hasTvPrefix) {
    endpoint = 'tv';
    mediaRes = await fetch(`https://api.themoviedb.org/3/tv/${cleanId}?api_key=${apiKey}&language=en-US`, {
      next: { revalidate: 86400 },
    }).catch(() => null);
  }

  if ((!mediaRes || !mediaRes.ok) && hasTvPrefix) {
    endpoint = 'movie';
    mediaRes = await fetch(`https://api.themoviedb.org/3/movie/${cleanId}?api_key=${apiKey}&language=en-US`, {
      next: { revalidate: 86400 },
    }).catch(() => null);
  }

  if (!mediaRes || !mediaRes.ok) return null;

  const isTv = endpoint === 'tv';
  const media = await mediaRes.json();

  const [creditsRes, videosRes, similarRes] = await Promise.all([
    fetch(`https://api.themoviedb.org/3/${endpoint}/${cleanId}/${isTv ? 'aggregate_credits' : 'credits'}?api_key=${apiKey}&language=en-US`, { next: { revalidate: 86400 } }).catch(() => null),
    fetch(`https://api.themoviedb.org/3/${endpoint}/${cleanId}/videos?api_key=${apiKey}&language=en-US`, { next: { revalidate: 86400 } }).catch(() => null),
    fetch(`https://api.themoviedb.org/3/${endpoint}/${cleanId}/recommendations?api_key=${apiKey}&language=en-US&page=1`, { next: { revalidate: 86400 } }).catch(() => null),
  ]);

  const credits = creditsRes && creditsRes.ok ? await creditsRes.json() : { cast: [], crew: [] };
  const videos = videosRes && videosRes.ok ? await videosRes.json() : { results: [] };
  const similar = similarRes && similarRes.ok ? await similarRes.json() : { results: [] };

  const title = media.title || media.name || 'Untitled';
  const releaseDate = media.release_date || media.first_air_date || '';
  const runtime = media.runtime || (media.episode_run_time && media.episode_run_time[0]) || 45;

  const director =
    media.created_by?.[0]?.name ||
    credits.crew?.find((c: any) => c.job === 'Director' || c.job === 'Series Director')?.name ||
    'Original Studio / Creators';

  const topCast: string[] = (credits.cast || []).slice(0, 6).map((c: any) => c.name);

  const trailer = (videos.results || []).find(
    (v: any) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
  ) || (videos.results || [])[0];

  const verifiedSimilar = (similar.results || [])
    .filter((m: any) => m.poster_path)
    .slice(0, 6)
    .map((m: any) => ({
      ...m,
      id: isTv ? `tv-${m.id}` : m.id,
      title: m.title || m.name,
      release_date: m.release_date || m.first_air_date,
    }));

  return {
    movie: {
      ...media,
      title,
      release_date: releaseDate,
      runtime,
    },
    director,
    topCast,
    trailerKey: trailer?.key || null,
    similar: verifiedSimilar,
    isTv,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getUniversalMediaDetails(id);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.movieint.com';

  if (!data || !data.movie) {
    return {
      title: 'Cinematic Intelligence Telemetry | MOVIEINT',
      description: 'Comprehensive film, series, and anime narrative telemetry.',
    };
  }

  const { movie, director, isTv } = data;
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
  const canonicalUrl = `${baseUrl}/movie/${id}`;

  const metaTitle = `${movie.title} (${year}) — Narrative DNA, Review & Where to Stream | MOVIEINT`;
  const metaDescription = `Deconstruct ${movie.title} (${year}) by ${director}. Explore pacing velocity, complexity indices, reality subversion score, and streaming availability.`;

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonicalUrl,
      type: isTv ? 'video.tv_show' : 'video.movie',
      images: [
        {
          url: movie.backdrop_path
            ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
            : movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${movie.title} telemetry card`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
    },
  };
}

export default async function MovieDetailPage({ params }: PageProps) {
  const { id } = await params;
  const data = await getUniversalMediaDetails(id);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.movieint.com';

  if (!data || !data.movie) {
    return (
      <main className="min-h-screen bg-[#05070b] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Cinematic Intelligence Telemetry Not Available</h1>
        <p className="text-slate-400 text-sm mb-6 max-w-md">
          Unable to synchronize archival telemetry for index: {id}.
        </p>
        <Link href="/" className="px-4 py-2 bg-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-500 transition">
          Return to Hub
        </Link>
      </main>
    );
  }

  const { movie, director, topCast, trailerKey, similar, isTv } = data;
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const genreNames = movie.genres?.map((g: { name: string }) => g.name).join(', ') || (isTv ? 'Television Series' : 'Feature Film');

  const isAnime = genreNames.toLowerCase().includes('animation') || (movie.origin_country || []).includes('JP');
  const isKDrama = (movie.origin_country || []).includes('KR');
  const mediaTypeBadge = isAnime ? 'Anime Masterpiece' : isKDrama ? 'K-Drama Series' : isTv ? 'TV Series' : 'Verified Cinema';

  const dna = calculateBaselineDNA(
    movie.title,
    genreNames,
    movie.vote_average || 7.0,
    movie.overview || '',
    movie.runtime || 60
  );

  const boredomRisk = dna.pacing.score > 75 ? 'Very Low' : dna.pacing.score > 55 ? 'Low' : 'Moderate';
  const rewatchValue = Math.min(100, Math.round(movie.vote_average * 10 + dna.complexity.score * 0.12));

  const relatedEditorials = getRelatedEditorialsForMovie(
    id,
    movie.genres?.map((g: { name: string }) => g.name) || [],
    3
  );

  // SEO Schema.org JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': isTv ? 'TVSeries' : 'Movie',
    name: movie.title,
    description: movie.overview,
    image: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined,
    datePublished: movie.release_date,
    director: {
      '@type': 'Person',
      name: director,
    },
    aggregateRating: movie.vote_average
      ? {
          '@type': 'AggregateRating',
          ratingValue: movie.vote_average.toFixed(1),
          bestRating: '10',
          worstRating: '1',
          ratingCount: movie.vote_count || 100,
        }
      : undefined,
  };

  return (
    <main className="min-h-screen bg-[#05070b] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto selection:bg-indigo-600 selection:text-white">
      {/* 0. Structured Data Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Navigation Breadcrumb */}
      <nav className="flex items-center justify-between text-xs text-slate-500 uppercase tracking-widest font-mono mb-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-indigo-400">Home</Link>
          <span>/</span>
          <span className="text-slate-400">{isAnime ? 'Anime' : isTv ? 'Series' : 'Cinema'}</span>
          <span>/</span>
          <span className="text-indigo-300 truncate max-w-[180px] sm:max-w-xs">{movie.title}</span>
        </div>
        <Link
          href={`/movies-like/${id}`}
          className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300"
        >
          <span>Discover Similar</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </nav>

      {/* 1. Header Hero Section */}
      <header className="relative rounded-3xl overflow-hidden border border-white/[0.08] bg-[#090d15] p-6 sm:p-10 mb-12 shadow-2xl">
        {movie.backdrop_path && (
          <div className="absolute top-0 right-0 w-full h-full -z-0 opacity-25 pointer-events-none">
            <Image
              src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
              alt={movie.title}
              fill
              priority
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090d15] via-[#090d15]/85 to-transparent" />
          </div>
        )}

        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="w-40 sm:w-48 aspect-[2/3] relative rounded-2xl overflow-hidden bg-slate-950 border border-white/10 shrink-0 shadow-2xl">
            <MoviePoster
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null}
              alt={movie.title}
              fallbackTitle={movie.title}
              fill
              sizes="192px"
              priority
              className="object-cover"
            />
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs font-mono">
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-semibold uppercase">
                {mediaTypeBadge}
              </span>
              <span className="flex items-center gap-1 bg-white/[0.03] border border-white/5 px-2.5 py-1 rounded-full text-slate-300">
                <Calendar className="w-3 h-3 text-slate-400" /> {year}
              </span>
              {movie.runtime > 0 && (
                <span className="flex items-center gap-1 bg-white/[0.03] border border-white/5 px-2.5 py-1 rounded-full text-slate-300">
                  <Clock className="w-3 h-3 text-slate-400" /> {movie.runtime}m {isTv ? '/ep' : ''}
                </span>
              )}
              {movie.vote_average > 0 && (
                <span className="flex items-center gap-1 bg-black/60 border border-white/10 px-2.5 py-1 rounded-full text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {movie.vote_average.toFixed(1)} / 10
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {movie.title}
            </h1>

            <div className="text-xs sm:text-sm text-slate-400 flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1">
              <span>Creator/Studio: <strong className="text-slate-200">{director}</strong></span>
              <span>•</span>
              <span>Genres: <strong className="text-slate-200">{genreNames}</strong></span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl font-normal">
              {movie.overview || 'Telemetry and storyline overview curated by MovieInt neural engine.'}
            </p>

            {topCast.length > 0 && (
              <div className="text-xs text-slate-400 pt-1">
                <span className="font-mono text-slate-500">Key Cast / Voices:</span>{' '}
                <span className="text-slate-300">{topCast.join(', ')}</span>
              </div>
            )}

            {/* Interactive User Engagement Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Add to Watchlist</span>
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Telemetry</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Streaming Availability Box */}
      <section className="mb-12">
        <div className="mb-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Film className="w-4 h-4 text-indigo-400" /> Real-Time Streaming Availability
          </h2>
        </div>
        <StreamingAffiliateBox movieId={String(id)} movieTitle={movie.title} />
      </section>

      {/* 3. Deep Narrative DNA Telemetry Suite */}
      <section className="bg-[#090d15]/80 border border-white/[0.08] rounded-3xl p-6 sm:p-8 mb-12 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-white/[0.06]">
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              <Dna className="w-5 h-5 text-indigo-400" /> Deep Narrative DNA Telemetry
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Deconstructed pacing velocity, storyline complexity, and rewatch metrics.
            </p>
          </div>
          <div className="text-xs font-mono bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-xl">
            Model: MOVIEINT-v3.2
          </div>
        </div>

        {/* 6 Key Telemetry Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-black/40 border border-white/5 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" /> Pacing Velocity
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {dna.pacing.score}/100
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${dna.pacing.score}%` }} />
            </div>
            <p className="text-[11px] text-slate-400">{dna.pacing.label}</p>
          </div>

          <div className="bg-black/40 border border-white/5 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-purple-400" /> Complexity Index
              </span>
              <span className="text-xs font-mono font-bold text-purple-400">
                {dna.complexity.score}/100
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: `${dna.complexity.score}%` }} />
            </div>
            <p className="text-[11px] text-slate-400">{dna.complexity.label}</p>
          </div>

          <div className="bg-black/40 border border-white/5 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-rose-400" /> Climax Twist Potency
              </span>
              <span className="text-xs font-mono font-bold text-rose-400">
                {dna.twistPotency.score}/100
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full" style={{ width: `${dna.twistPotency.score}%` }} />
            </div>
            <p className="text-[11px] text-slate-400">{dna.twistPotency.label}</p>
          </div>

          <div className="bg-black/40 border border-white/5 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Star className="w-4 h-4 text-indigo-400" /> Emotional Resonance
              </span>
              <span className="text-xs font-mono font-bold text-indigo-400">
                {dna.emotionalResonance.score}/100
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${dna.emotionalResonance.score}%` }} />
            </div>
            <p className="text-[11px] text-slate-400">{dna.emotionalResonance.label}</p>
          </div>

          <div className="bg-black/40 border border-white/5 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-400" /> Boredom Risk
              </span>
              <span className="text-xs font-mono font-bold text-amber-400">
                {boredomRisk}
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: boredomRisk === 'Very Low' ? '20%' : boredomRisk === 'Low' ? '45%' : '75%' }}
              />
            </div>
            <p className="text-[11px] text-slate-400">Pacing drop-off & dead-time index</p>
          </div>

          <div className="bg-black/40 border border-white/5 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-cyan-400" /> Rewatch Value
              </span>
              <span className="text-xs font-mono font-bold text-cyan-400">
                {rewatchValue}/100
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${rewatchValue}%` }} />
            </div>
            <p className="text-[11px] text-slate-400">Layered details payoff index</p>
          </div>
        </div>

        {/* Narrative Tension & Pacing Arc */}
        <div className="bg-black/50 border border-white/5 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" /> Narrative Tension Arc Progression
            </span>
            <span className="text-[11px] font-mono text-slate-500">Act I → Climax → Resolution</span>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-2 text-center text-[11px]">
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 space-y-1">
              <div className="text-slate-400 font-mono">Act I: Setup</div>
              <div className="h-1 bg-indigo-500/40 rounded-full mt-2" />
              <p className="text-[10px] text-slate-500 pt-1">Worldbuilding</p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 space-y-1">
              <div className="text-slate-400 font-mono">Act II: Escalation</div>
              <div className="h-1 bg-indigo-500/70 rounded-full mt-2" />
              <p className="text-[10px] text-slate-500 pt-1">Rising Conflict</p>
            </div>
            <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-3 space-y-1">
              <div className="text-indigo-300 font-mono font-bold">Act III: Climax</div>
              <div className="h-1 bg-rose-500 rounded-full mt-2" />
              <p className="text-[10px] text-rose-300 pt-1">{dna.twistPotency.score}% Shock Factor</p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 space-y-1">
              <div className="text-slate-400 font-mono">Resolution</div>
              <div className="h-1 bg-cyan-500/50 rounded-full mt-2" />
              <p className="text-[10px] text-slate-500 pt-1">Thematic Closure</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Protected Climax & Twist Telemetry */}
      <section className="mb-12">
        <SpoilerShield
          title={movie.title}
          twistPotencyScore={dna.twistPotency.score}
          overview={movie.overview}
        />
      </section>

      {/* 5. Official Video / Trailer Section */}
      {trailerKey && (
        <section className="bg-[#090d15]/80 border border-white/[0.08] rounded-3xl p-6 sm:p-8 mb-12 shadow-2xl">
          <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
            <Film className="w-4 h-4 text-indigo-400" /> Official Cinematic Preview
          </h2>
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?origin=${baseUrl}`}
              title={`${movie.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        </section>
      )}

      {/* 6. Similar Recommendations */}
      {similar.length > 0 && (
        <section className="bg-[#090d15]/90 border border-white/[0.08] rounded-3xl p-6 sm:p-8 mb-12 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.06]">
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" /> Thematic Twins & Similar Titles
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Titles exhibiting matching narrative telemetry and pacing affinity.
              </p>
            </div>

            <Link
              href={`/movies-like/${id}`}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-xl transition"
            >
              <span>Explore Titles Like {movie.title}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {similar.map((sim: any) => (
              <Link
                key={sim.id}
                href={`/movie/${sim.id}`}
                className="group block bg-black/40 border border-white/5 hover:border-indigo-500/50 rounded-2xl p-2 transition duration-200"
              >
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-2 bg-slate-950">
                  <MoviePoster
                    src={sim.poster_path ? `https://image.tmdb.org/t/p/w342${sim.poster_path}` : null}
                    alt={sim.title}
                    fallbackTitle={sim.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 150px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-mono text-amber-400 flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-amber-400" />
                    <span>{sim.vote_average?.toFixed(1) || 'N/A'}</span>
                  </div>
                </div>
                <h3 className="text-xs font-medium text-white truncate group-hover:text-indigo-300 transition">
                  {sim.title}
                </h3>
                <span className="text-[10px] font-mono text-slate-500">
                  {(sim.release_date || '').split('-')[0]}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 7. Curated Editorial Intelligence Guides */}
      {relatedEditorials.length > 0 && (
        <section className="bg-[#090d15]/80 border border-white/[0.08] rounded-3xl p-6 sm:p-8 mb-12 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.06]">
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" /> Curated Editorial Dossiers
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Deep-dive thematic essays and comparative lists featuring {movie.title}.
              </p>
            </div>
            <Link
              href="/editorial"
              className="text-xs font-mono text-indigo-400 hover:text-indigo-300 transition"
            >
              View All Guides →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {relatedEditorials.map((guide) => (
              <Link
                key={guide.slug}
                href={`/editorial/${guide.slug}`}
                className="group flex flex-col justify-between bg-black/40 border border-white/5 hover:border-indigo-500/40 rounded-2xl p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-950/20"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                      {guide.moodTag}
                    </span>
                    <span className="text-slate-500">{guide.readTime}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition line-clamp-2 leading-snug">
                    {guide.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {guide.metaDescription}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-slate-400 group-hover:text-white transition">
                  <span>Read Intelligence Report</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 8. Telemetry FAQ */}
      <section className="bg-[#090d15]/60 border border-white/[0.08] rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase tracking-widest">
          <HelpCircle className="w-4 h-4" /> Editorial & Algorithm Intelligence FAQ
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
          Frequently Inquired Telemetry for {movie.title}
        </h2>

        <div className="space-y-3 pt-2 text-xs sm:text-sm">
          <div className="bg-black/40 border border-white/5 rounded-2xl p-4">
            <h3 className="font-bold text-slate-200 mb-1">
              What does {movie.title}&apos;s complexity score mean?
            </h3>
            <p className="text-slate-400 leading-relaxed">
              With a score of {dna.complexity.score}/100, the narrative utilizes non-linear thematic layering and deep character dynamics.
            </p>
          </div>

          <div className="bg-black/40 border border-white/5 rounded-2xl p-4">
            <h3 className="font-bold text-slate-200 mb-1">
              How does MovieInt evaluate boredom risk?
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Boredom risk ({boredomRisk}) is calculated by evaluating scene transition cadence and narrative momentum across {movie.runtime} minutes.
            </p>
          </div>

          <div className="bg-black/40 border border-white/5 rounded-2xl p-4">
            <h3 className="font-bold text-slate-200 mb-1">
              Are streaming platforms updated in real-time?
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Yes. Catalog indices verify streaming availability across Crunchyroll, Netflix, Prime Video, and Apple TV.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
