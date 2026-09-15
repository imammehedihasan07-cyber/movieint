import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Star, ArrowLeft, Swords, CheckCircle2, Clock, Calendar, Film, ArrowUpRight } from 'lucide-react';
import MoviePoster from '@/components/MoviePoster';

interface PageProps {
  params: Promise<{ pair: string }>;
}

export const revalidate = 86400; // 24 hours ISR

export const POPULAR_PAIRS: Record<string, { titleA: string; titleB: string; queryA: string; queryB: string; summary: string }> = {
  'inception-vs-interstellar': {
    titleA: 'Inception',
    titleB: 'Interstellar',
    queryA: 'Inception',
    queryB: 'Interstellar',
    summary: 'A definitive clash of Christopher Nolan cerebral juggernauts: psychological dream infiltration versus existential cosmic relativity.',
  },
  'dark-vs-stranger-things': {
    titleA: 'Dark',
    titleB: 'Stranger Things',
    queryA: 'Dark',
    queryB: 'Stranger Things',
    summary: 'Small-town supernatural mysteries compared: German uncompromising deterministic time-travel vs 80s nostalgic sci-fi adventure.',
  },
  'oppenheimer-vs-interstellar': {
    titleA: 'Oppenheimer',
    titleB: 'Interstellar',
    queryA: 'Oppenheimer',
    queryB: 'Interstellar',
    summary: 'Historical existential dread meets cosmic survival — deconstructing scale, practical cinematography, and narrative weight.',
  },
  'fight-club-vs-shutter-island': {
    titleA: 'Fight Club',
    titleB: 'Shutter Island',
    queryA: 'Fight Club',
    queryB: 'Shutter Island',
    summary: 'The ultimate psychological twist showdown: unreliable narrators, identity deconstruction, and shocking climaxes.',
  },
  'breaking-bad-vs-better-call-saul': {
    titleA: 'Breaking Bad',
    titleB: 'Better Call Saul',
    queryA: 'Breaking Bad',
    queryB: 'Better Call Saul',
    summary: 'Vince Gilligan masterpiece face-off: explosive moral collapse versus deliberate, tragic character tragedy.',
  },
};

export async function generateStaticParams() {
  return Object.keys(POPULAR_PAIRS).map((pair) => ({ pair }));
}

async function searchMedia(query: string) {
  const apiKey = process.env.TMDB_API_KEY || 'b6b9f5e3a64b6ef32e0b8fade33cfe5a';
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=1`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const match = (data.results || []).find((r: any) => (r.media_type === 'movie' || r.media_type === 'tv') && r.poster_path);
    if (!match) return null;

    const isTv = match.media_type === 'tv';
    return {
      id: isTv ? `tv-${match.id}` : String(match.id),
      title: match.title || match.name,
      overview: match.overview,
      poster_path: match.poster_path,
      vote_average: match.vote_average || 7.5,
      vote_count: match.vote_count || 100,
      release_date: match.release_date || match.first_air_date || 'N/A',
      isTv,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pair } = await params;
  const config = POPULAR_PAIRS[pair];
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.movieint.com';
  const canonicalUrl = `${baseUrl}/compare/${pair}`;

  if (config) {
    return {
      title: `${config.titleA} vs ${config.titleB}: Which is Better? Comparison & Telemetry`,
      description: `Comprehensive comparison between ${config.titleA} and ${config.titleB}. Analyze ratings, storytelling complexity, pacing, and audience verdict.`,
      alternates: { canonical: canonicalUrl },
    };
  }

  const parts = pair.split('-vs-');
  const titleA = parts[0]?.replace(/-/g, ' ') || 'Movie A';
  const titleB = parts[1]?.replace(/-/g, ' ') || 'Movie B';

  return {
    title: `${titleA} vs ${titleB} Comparison`,
    description: `Side-by-side comparison of ${titleA} and ${titleB}.`,
    alternates: { canonical: canonicalUrl },
  };
}

export default async function ComparePairPage({ params }: PageProps) {
  const { pair } = await params;
  const config = POPULAR_PAIRS[pair];

  let queryA = '';
  let queryB = '';

  if (config) {
    queryA = config.queryA;
    queryB = config.queryB;
  } else if (pair.includes('-vs-')) {
    const parts = pair.split('-vs-');
    queryA = parts[0].replace(/-/g, ' ');
    queryB = parts[1].replace(/-/g, ' ');
  } else {
    notFound();
  }

  const [mediaA, mediaB] = await Promise.all([
    searchMedia(queryA),
    searchMedia(queryB),
  ]);

  if (!mediaA || !mediaB) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.movieint.com';

  return (
    <main className="min-h-screen bg-[#05070b] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <nav className="flex items-center justify-between text-xs text-slate-500 uppercase tracking-widest font-mono mb-8">
        <Link href="/compare" className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Compare Tool
        </Link>
        <span className="text-slate-400 font-bold">Head-to-Head Telemetry</span>
      </nav>

      {/* Header Banner */}
      <header className="rounded-3xl border border-white/[0.08] bg-[#090d15] p-6 sm:p-10 mb-10 shadow-2xl text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono font-semibold uppercase mb-4">
          <Swords className="w-3.5 h-3.5 text-rose-400" /> Head-to-Head Cinema Clash
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
          {mediaA.title} <span className="text-indigo-400 font-light">vs</span> {mediaB.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {config?.summary || `Direct side-by-side breakdown comparing ratings, storytelling depth, and pacing.`}
        </p>

        {/* Quick links to other pairs */}
        <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-wrap justify-center gap-2">
          {Object.entries(POPULAR_PAIRS).map(([slug, p]) => (
            <Link
              key={slug}
              href={`/compare/${slug}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                slug === pair
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-white/[0.03] text-slate-400 hover:bg-white/[0.07] hover:text-white'
              }`}
            >
              {p.titleA} vs {p.titleB}
            </Link>
          ))}
        </div>
      </header>

      {/* Side-by-Side Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Media A */}
        <section className="bg-[#090d15] border border-white/[0.08] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex gap-5 items-start mb-6">
              <div className="relative w-24 sm:w-28 aspect-[2/3] rounded-2xl overflow-hidden bg-slate-950 shrink-0 border border-white/10 shadow-lg">
                <MoviePoster
                  src={mediaA.poster_path ? `https://image.tmdb.org/t/p/w500${mediaA.poster_path}` : null}
                  alt={mediaA.title}
                  fallbackTitle={mediaA.title}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Calendar className="w-3 h-3" /> {(mediaA.release_date || '').split('-')[0]}
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {mediaA.vote_average.toFixed(1)}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-white leading-tight">
                  <Link href={`/movie/${mediaA.id}`} className="hover:text-indigo-300 transition">
                    {mediaA.title}
                  </Link>
                </h2>
                <span className="inline-block text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                  {mediaA.isTv ? 'Television Series' : 'Feature Film'}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              {mediaA.overview}
            </p>
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
            <Link
              href={`/movie/${mediaA.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300"
            >
              <span>Full Telemetry & Where to Watch</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* Media B */}
        <section className="bg-[#090d15] border border-white/[0.08] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex gap-5 items-start mb-6">
              <div className="relative w-24 sm:w-28 aspect-[2/3] rounded-2xl overflow-hidden bg-slate-950 shrink-0 border border-white/10 shadow-lg">
                <MoviePoster
                  src={mediaB.poster_path ? `https://image.tmdb.org/t/p/w500${mediaB.poster_path}` : null}
                  alt={mediaB.title}
                  fallbackTitle={mediaB.title}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Calendar className="w-3 h-3" /> {(mediaB.release_date || '').split('-')[0]}
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {mediaB.vote_average.toFixed(1)}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-white leading-tight">
                  <Link href={`/movie/${mediaB.id}`} className="hover:text-indigo-300 transition">
                    {mediaB.title}
                  </Link>
                </h2>
                <span className="inline-block text-[11px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md">
                  {mediaB.isTv ? 'Television Series' : 'Feature Film'}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              {mediaB.overview}
            </p>
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
            <Link
              href={`/movie/${mediaB.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-purple-300"
            >
              <span>Full Telemetry & Where to Watch</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </div>

      {/* The Verdict Box */}
      <section className="bg-gradient-to-br from-indigo-950/20 to-[#090d15] border border-indigo-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" /> The Viewer Verdict: Which Should You Watch First?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-300">
          <div className="bg-black/30 border border-white/5 rounded-2xl p-5 space-y-2">
            <h4 className="font-bold text-white text-sm">Pick {mediaA.title} If:</h4>
            <p className="leading-relaxed text-slate-400">
              You want a tightly wound, high-concept narrative focusing on rapid puzzle-solving, intricate pacing, and visceral climactic payoffs.
            </p>
          </div>
          <div className="bg-black/30 border border-white/5 rounded-2xl p-5 space-y-2">
            <h4 className="font-bold text-white text-sm">Pick {mediaB.title} If:</h4>
            <p className="leading-relaxed text-slate-400">
              You prefer grander emotional resonance, extensive thematic scope, and character-driven stakes that linger long after the credits roll.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
