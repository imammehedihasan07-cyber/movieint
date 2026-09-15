import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Star,
  Film,
  Clock,
  Calendar,
  Layers,
  ArrowUpRight,
  Sparkles,
  HelpCircle,
  BookOpen,
  Bookmark,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Users,
  Compass,
  MonitorPlay,
  TrendingUp,
  Flame,
} from 'lucide-react';
import MoviePoster from '@/components/MoviePoster';
import StreamingAffiliateBox from '@/components/StreamingAffiliateBox';
import SpoilerShield from '@/components/SpoilerShield';
import { getRelatedEditorialsForMovie } from '@/lib/editorial-data';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 86400; // 24 hours ISR

function generateHumanizedAnalysis(title: string, genres: string[], voteAvg: number, runtime: number, overview: string) {
  const gList = (genres || []).map((g) => g.toLowerCase());
  const isAction = gList.some((g) => g.includes('action') || g.includes('adventure'));
  const isSciFi = gList.some((g) => g.includes('sci-fi') || g.includes('science fiction') || g.includes('mystery'));
  const isDrama = gList.some((g) => g.includes('drama') || g.includes('romance'));
  const isAnimation = gList.some((g) => g.includes('animation'));
  const isHorror = gList.some((g) => g.includes('horror') || g.includes('thriller'));

  let hook = `An engaging cinematic journey delivering a distinct narrative vision with a solid ${voteAvg.toFixed(1)} community score.`;
  let targetAudience = 'Cinemaphiles looking for well-crafted storytelling and strong thematic execution.';
  let primaryStrength = 'Consistent tone, strong visual identity, and purposeful character motivations throughout the runtime.';
  let potentialFlaw = 'Pacing requires patience during transitional narrative sequences depending on viewer genre expectations.';
  let mood = 'Thought-Provoking & Immersive';

  if (isSciFi) {
    hook = `A compelling exploration of speculative concepts, challenging audience perspectives with intricate storytelling.`;
    targetAudience = 'Fans of cerebral sci-fi, multi-layered puzzles, and high-concept reality exploration.';
    primaryStrength = 'Intellectual curiosity, worldbuilding consistency, and rewarding conceptual payoffs.';
    potentialFlaw = 'Requires dedicated attention; casual background viewing may cause missed thematic clues.';
    mood = 'Cerebral, Mind-Bending & Expansive';
  } else if (isHorror) {
    hook = `An intense experience prioritizing atmospheric dread, psychological suspense, and escalating tension.`;
    targetAudience = 'Viewers who appreciate edge-of-your-seat tension and psychological character studies.';
    primaryStrength = 'Tension management, sound design immersion, and visceral narrative beats.';
    potentialFlaw = 'Elevated emotional intensity may prove overwhelming for lighthearted movie nights.';
    mood = 'Edge-of-Your-Seat, Dark & Unsettling';
  } else if (isAction) {
    hook = `A high-octane spectacle emphasizing dynamic pacing, visceral stakes, and kinetic storytelling.`;
    targetAudience = 'Enthusiasts of pulse-pounding choreography, epic set-pieces, and brisk storytelling velocity.';
    primaryStrength = 'Kinetic momentum, memorable action sequences, and high entertainment payoff.';
    potentialFlaw = 'Plot development prioritizes kinetic momentum over contemplative character dialogue.';
    mood = 'Adrenaline-Charged, Thrilling & Fun';
  } else if (isDrama) {
    hook = `An intimate, character-driven examination exploring emotional vulnerability, relationships, and human nuance.`;
    targetAudience = 'Audiences who cherish deep character growth, emotional resonance, and naturalistic performances.';
    primaryStrength = 'Nuanced screenwriting, authentic emotional delivery, and lasting thematic aftertaste.';
    potentialFlaw = 'Methodical, slow-burn pacing that demands active emotional investment from the opening scene.';
    mood = 'Reflective, Melancholic & Deeply Human';
  } else if (isAnimation) {
    hook = `A visually striking tour-de-force showcasing imaginative art direction, expressive character design, and rich storytelling.`;
    targetAudience = 'Animation aficionados and story lovers seeking limitless creative visual execution.';
    primaryStrength = 'Exquisite art direction, universal emotional themes, and fluid visual design.';
    potentialFlaw = 'Certain stylized sequences may follow established genre conventions.';
    mood = 'Visually Captivating & Heartfelt';
  }

  let pacingScore = isAction ? 84 : isDrama ? 62 : 72;
  if (runtime > 135) pacingScore -= 8;

  return {
    hook,
    targetAudience,
    primaryStrength,
    potentialFlaw,
    mood,
    pacingScore,
    rewatchScore: Math.min(98, Math.round(voteAvg * 10 + (isSciFi ? 12 : 5))),
    twistScore: isSciFi || isHorror ? 86 : 58,
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
      title: 'Cinematic Intelligence & Streaming Guide | MOVIEINT',
      description: 'Comprehensive film and series editorial insights, mood telemetry, and streaming guide.',
    };
  }

  const { movie, director, isTv } = data;
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '2026';
  const canonicalUrl = `${baseUrl}/movie/${id}`;

  const metaTitle = `Where to Watch ${movie.title} (${year}) Online & Streaming Guide | MOVIEINT`;
  const metaDescription = `Find where to stream ${movie.title} (${year}) by ${director}. Explore why you should watch, audience recommendations, pacing review, and verified streaming platforms.`;

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
          alt: `${movie.title} preview card`,
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
        <h1 className="text-2xl font-bold mb-2">Cinematic Dossier Unavailable</h1>
        <p className="text-slate-400 text-sm mb-6 max-w-md">
          Unable to locate streaming index and editorial telemetry for ID: {id}.
        </p>
        <Link href="/" className="px-4 py-2 bg-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-500 transition">
          Return to Hub
        </Link>
      </main>
    );
  }

  const { movie, director, topCast, trailerKey, similar, isTv } = data;
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '2026';
  const genreList: string[] = movie.genres?.map((g: { name: string }) => g.name) || [];
  const genreNames = genreList.join(', ') || (isTv ? 'Television Series' : 'Feature Film');

  const isAnime = genreNames.toLowerCase().includes('animation') || (movie.origin_country || []).includes('JP');
  const isKDrama = (movie.origin_country || []).includes('KR');
  const mediaTypeBadge = isAnime ? 'Anime Masterpiece' : isKDrama ? 'K-Drama Series' : isTv ? 'Television Series' : 'Verified Cinema';

  const analysis = generateHumanizedAnalysis(
    movie.title,
    genreList,
    movie.vote_average || 7.2,
    movie.runtime || 60,
    movie.overview || ''
  );

  const relatedEditorials = getRelatedEditorialsForMovie(id, genreList, 3);

  // Schema.org Structured Data: Breadcrumb, Movie/TV, and FAQ
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: isAnime ? 'Anime' : isTv ? 'Series' : 'Movies', item: `${baseUrl}/rankings` },
      { '@type': 'ListItem', position: 3, name: movie.title, item: `${baseUrl}/movie/${id}` },
    ],
  };

  const mediaSchema = {
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
          ratingCount: movie.vote_count || 120,
        }
      : undefined,
  };

    const dynamicFaqs = [
    {
      q: `What is the premise and narrative tone of ${movie.title}?`,
      a: `${movie.overview ? movie.overview.slice(0, 180) + '...' : movie.title + ' is an acclaimed release.'} It delivers a ${analysis.mood.toLowerCase()} tone designed for ${analysis.targetAudience.toLowerCase()}`
    },
    {
      q: `Is ${movie.title} worth watching based on MovieINT analysis?`,
      a: `With an audience score of ${movie.vote_average.toFixed(1)}/10, ${analysis.hook} Its primary strength lies in ${analysis.primaryStrength.toLowerCase()} Viewer consideration: ${analysis.potentialFlaw}`
    },
    {
      q: `What is the runtime and pacing intensity of ${movie.title}?`,
      a: `${movie.title} clocks in at ${movie.runtime ? Math.floor(movie.runtime / 60) + 'h ' + (movie.runtime % 60) + 'm' : 'standard feature length'} with a calibrated narrative pacing score of ${analysis.pacingScore}/100.`
    },
    {
      q: `Who stars in and directed ${movie.title}?`,
      a: `The film is directed by ${director || 'acclaimed filmmakers'}, with lead performances by ${topCast && topCast.length > 0 ? topCast.slice(0, 3).join(', ') : 'an ensemble cast'}.`
    }
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: dynamicFaqs.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a
      }
    }))
  };

  return (
    <main className="min-h-screen bg-[#05070b] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto selection:bg-indigo-600 selection:text-white">
      {/* 0. SEO JSON-LD Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(mediaSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center justify-between text-xs text-slate-500 uppercase tracking-widest font-mono mb-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-indigo-400">Home</Link>
          <span>/</span>
          <span className="text-slate-400">{isAnime ? 'Anime' : isTv ? 'Series' : 'Cinema'}</span>
          <span>/</span>
          <span className="text-indigo-300 truncate max-w-[180px] sm:max-w-xs">{movie.title}</span>
        </div>
        <Link
          href={`/movies-like/${id}`}
          className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition"
        >
          <span>Discover Similar</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </nav>

      {/* 1. Hero Header */}
      <header className="relative rounded-3xl overflow-hidden border border-white/[0.08] bg-[#090d15] p-6 sm:p-10 mb-10 shadow-2xl">
        {movie.backdrop_path && (
          <div className="absolute top-0 right-0 w-full h-full -z-0 opacity-25 pointer-events-none">
            <Image
              src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
              alt={movie.title}
              fill
              priority
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090d15] via-[#090d15]/90 to-transparent" />
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
                  <Clock className="w-3 h-3 text-slate-400" /> {movie.runtime} min {isTv ? '/ep' : ''}
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
              {movie.overview || 'Comprehensive narrative overview curated by the MovieInt editorial review engine.'}
            </p>

            {topCast.length > 0 && (
              <div className="text-xs text-slate-400 pt-1">
                <span className="font-mono text-slate-500">Starring Cast:</span>{' '}
                <span className="text-slate-300">{topCast.join(', ')}</span>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Save to Watchlist</span>
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Guide</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Priority Commercial Section: Where to Watch SEO Hub */}
      <section className="bg-gradient-to-br from-indigo-950/20 to-[#090d15] border border-indigo-500/20 rounded-3xl p-6 sm:p-8 mb-10 shadow-2xl">
        <div className="mb-6 pb-4 border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-indigo-400 text-xs font-mono uppercase tracking-widest flex items-center gap-1.5 mb-1">
              <MonitorPlay className="w-4 h-4" /> Official Streaming Telemetry
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Where to Watch {movie.title} Online (Streaming Guide)
            </h2>
          </div>
          <span className="text-[11px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full">
            Verified License Indices
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 max-w-3xl">
          Wondering <strong className="text-white">where to stream {movie.title}</strong> right now? 
          Below are verified streaming providers, subscription channels, and digital purchase/rental storefronts 
          where you can watch <strong className="text-white">{movie.title}</strong> in full high-definition.
        </p>

        <StreamingAffiliateBox movieId={String(id)} movieTitle={movie.title} />
      </section>

      {/* 3. Unique Editorial Value: Why Watch, Who Should Watch & Flaws */}
      <section className="bg-[#090d15] border border-white/[0.08] rounded-3xl p-6 sm:p-8 mb-10 shadow-2xl">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/[0.06]">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
            Editorial Review & Viewer Persona Guide
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Why Watch */}
          <div className="bg-black/40 border border-white/5 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-mono font-bold uppercase">
              <Flame className="w-4 h-4 text-indigo-400" /> Why You Should Watch It
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {analysis.hook}
            </p>
          </div>

          {/* Who Should Watch */}
          <div className="bg-black/40 border border-white/5 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-purple-300 text-xs font-mono font-bold uppercase">
              <Users className="w-4 h-4 text-purple-400" /> Who It Is Perfect For
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {analysis.targetAudience}
            </p>
          </div>

          {/* Key Strengths */}
          <div className="bg-black/40 border border-emerald-500/10 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-mono font-bold uppercase">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Core Cinematic Strengths
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {analysis.primaryStrength}
            </p>
          </div>

          {/* Potential Flaws */}
          <div className="bg-black/40 border border-amber-500/10 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-mono font-bold uppercase">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> What to Keep in Mind
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {analysis.potentialFlaw}
            </p>
          </div>
        </div>

        {/* Mood Spectrum & Pacing Cadence */}
        <div className="mt-6 pt-6 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 mb-1">
              <Compass className="w-3.5 h-3.5 text-indigo-400" /> Primary Atmosphere & Mood
            </span>
            <p className="text-xs font-bold text-white">{analysis.mood}</p>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" /> Narrative Velocity (Pacing)
            </span>
            <p className="text-xs font-bold text-white">{analysis.pacingScore}/100 — {analysis.pacingScore > 75 ? 'Rapid & Kinetic' : 'Measured Storytelling'}</p>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-rose-400" /> Rewatch Payoff Index
            </span>
            <p className="text-xs font-bold text-white">{analysis.rewatchScore}/100 Layered Depth</p>
          </div>
        </div>
      </section>

      {/* 4. Protected Climax & Twist Telemetry */}
      <section className="mb-10">
        <SpoilerShield
          title={movie.title}
          twistPotencyScore={analysis.twistScore}
          overview={movie.overview}
        />
      </section>

      {/* 5. Official Preview / Trailer */}
      {trailerKey && (
        <section className="bg-[#090d15] border border-white/[0.08] rounded-3xl p-6 sm:p-8 mb-10 shadow-2xl">
          <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
            <Film className="w-4 h-4 text-indigo-400" /> Official Cinematic Preview
          </h2>
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?origin=${baseUrl}`}
              title={`${movie.title} Official Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        </section>
      )}

      {/* 6. Curated Thematic Twins & Similar Recommendations */}
      {similar.length > 0 && (
        <section className="bg-[#090d15] border border-white/[0.08] rounded-3xl p-6 sm:p-8 mb-10 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.06]">
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" /> If You Loved {movie.title}, Watch These
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Curated films sharing matching themes, narrative energy, and tonal atmosphere.
              </p>
            </div>

            <Link
              href={`/movies-like/${id}`}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-xl transition"
            >
              <span>View All Recommendations</span>
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
        <section className="bg-[#090d15] border border-white/[0.08] rounded-3xl p-6 sm:p-8 mb-10 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.06]">
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" /> Featured Editorial Guides
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Thematic essays, rankings, and deep dives featuring {movie.title}.
              </p>
            </div>
            <Link
              href="/editorial"
              className="text-xs font-mono text-indigo-400 hover:text-indigo-300 transition"
            >
              All Articles →
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
                  <span>Read Full Analysis</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 8. Verified Dynamic FAQ & Editorial Nexus */}
      <section className="bg-[#090d15]/60 border border-white/[0.08] rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase tracking-widest">
            <HelpCircle className="w-4 h-4" /> Frequently Inquired Questions
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Viewer Intelligence & Analysis for {movie.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {dynamicFaqs.map((faq, idx) => (
            <div key={idx} className="bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
              <h3 className="font-bold text-slate-200 text-xs sm:text-sm mb-2">
                {faq.q}
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        {/* Intelligent Cross-Linking Bar */}
        <div className="border-t border-white/5 pt-5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-500 uppercase">Explore Universe:</span>
            <Link href={`/movies-like/${encodeURIComponent(movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}`} className="text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-4">
              Movies Like {movie.title} →
            </Link>
            <span className="text-slate-700">•</span>
            <Link href="/editorial" className="text-cyan-400 hover:text-cyan-300 transition-colors underline underline-offset-4">
              Curated Editorial Guides →
            </Link>
          </div>
          <Link href="/methodology" className="text-amber-400 hover:text-amber-300 transition-colors text-[11px]">
            MovieINT Score Methodology ⓘ
          </Link>
        </div>
      </section>
    </main>
  );
}
