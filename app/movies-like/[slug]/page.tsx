import { Metadata } from 'next';
import Link from 'next/link';
import { Star, ArrowLeft, Sparkles, Layers } from 'lucide-react';
import MoviePoster from '@/components/MoviePoster';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 86400; // 24 hours ISR

async function resolveMediaId(idOrSlug: string, apiKey: string): Promise<{ cleanId: string; isTv: boolean } | null> {
  const raw = decodeURIComponent(idOrSlug || '').trim();
  const hasTvPrefix = raw.startsWith('tv-') || raw.startsWith('series-');
  const cleanId = raw.replace(/^(tv-|series-|movie-)/, '');

  // If it's already an integer ID
  if (/^\d+$/.test(cleanId)) {
    return { cleanId, isTv: hasTvPrefix };
  }

  // Otherwise, treat slug as a search title (e.g. "inception" or "fight-club")
  const searchQuery = cleanId.replace(/-/g, ' ');
  try {
    const searchRes = await fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(searchQuery)}&page=1`,
      { next: { revalidate: 86400 } }
    );
    if (!searchRes.ok) return null;
    const searchData = await searchRes.json();
    const match = (searchData.results || []).find(
      (item: any) => (item.media_type === 'movie' || item.media_type === 'tv') && item.poster_path
    );

    if (match) {
      return { cleanId: String(match.id), isTv: match.media_type === 'tv' };
    }
  } catch (err) {
    console.error('Error resolving slug to ID:', err);
  }

  return null;
}

async function getSimilarMovies(idOrSlug: string) {
  const apiKey = process.env.TMDB_API_KEY || 'b6b9f5e3a64b6ef32e0b8fade33cfe5a';
  const resolved = await resolveMediaId(idOrSlug, apiKey);

  if (!resolved) return null;

  const { cleanId, isTv: initialIsTv } = resolved;

  try {
    let isTv = initialIsTv;
    let endpoint = isTv ? 'tv' : 'movie';

    let [mediaRes, recsRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/${endpoint}/${cleanId}?api_key=${apiKey}&language=en-US`, { next: { revalidate: 86400 } }).catch(() => null),
      fetch(`https://api.themoviedb.org/3/${endpoint}/${cleanId}/recommendations?api_key=${apiKey}&language=en-US&page=1`, { next: { revalidate: 86400 } }).catch(() => null),
    ]);

    // Fallback if movie/tv distinction differed
    if (!mediaRes || !mediaRes.ok) {
      isTv = !isTv;
      endpoint = isTv ? 'tv' : 'movie';
      [mediaRes, recsRes] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/${endpoint}/${cleanId}?api_key=${apiKey}&language=en-US`, { next: { revalidate: 86400 } }).catch(() => null),
        fetch(`https://api.themoviedb.org/3/${endpoint}/${cleanId}/recommendations?api_key=${apiKey}&language=en-US&page=1`, { next: { revalidate: 86400 } }).catch(() => null),
      ]);
    }

    if (!mediaRes || !mediaRes.ok) return null;

    const media = await mediaRes.json();
    let recs = recsRes && recsRes.ok ? await recsRes.json() : { results: [] };

    // If recommendations are sparse, fallback to TMDB similar endpoint
    if (!recs.results || recs.results.length === 0) {
      const simRes = await fetch(
        `https://api.themoviedb.org/3/${endpoint}/${cleanId}/similar?api_key=${apiKey}&language=en-US&page=1`,
        { next: { revalidate: 86400 } }
      ).catch(() => null);
      if (simRes && simRes.ok) {
        recs = await simRes.json();
      }
    }

    const title = media.title || media.name || 'Untitled';
    const similar = (recs.results || [])
      .filter((m: any) => m.poster_path && m.vote_average > 0)
      .slice(0, 18)
      .map((m: any) => ({
        id: isTv ? `tv-${m.id}` : m.id,
        title: m.title || m.name,
        poster_path: m.poster_path,
        vote_average: m.vote_average,
        release_date: m.release_date || m.first_air_date,
        overview: m.overview,
      }));

    return {
      title,
      id: isTv ? `tv-${cleanId}` : cleanId,
      similar,
      isTv,
      overview: media.overview,
    };
  } catch (err) {
    console.error('Error fetching similar movies:', err);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getSimilarMovies(slug);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.movieint.com';

  if (!data) {
    return {
      title: 'Similar Cinema & Series Recommendations | MOVIEINT',
      description: 'Discover curated algorithmic recommendations.',
    };
  }

  const canonicalUrl = `${baseUrl}/movies-like/${encodeURIComponent(slug)}`;

  return {
    title: `Top 18 Movies & Series Like ${data.title} | Narrative Recommendations`,
    description: `Curated twin recommendations and cinematic alternatives similar to ${data.title} based on pacing, tone, and Narrative DNA.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `Movies Like ${data.title} | MOVIEINT`,
      description: `Best recommendations with matching tone and narrative complexity to ${data.title}.`,
      url: canonicalUrl,
      type: 'website',
    },
  };
}

export default async function MoviesLikePage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getSimilarMovies(slug);

  if (!data) {
    return (
      <main className="min-h-screen bg-[#05070b] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Recommendations Unavailable</h1>
        <p className="text-slate-400 text-sm mb-6">Unable to locate narrative twins for: {decodeURIComponent(slug)}</p>
        <Link href="/" className="px-4 py-2 bg-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-500 transition">
          Return to Hub
        </Link>
      </main>
    );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Movies Like ${data.title}`,
    description: `Algorithmic twin recommendations similar to ${data.title}`,
    itemListElement: data.similar.slice(0, 10).map((movie: any, idx: number) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Movie',
        name: movie.title,
        url: `https://www.movieint.com/movie/${movie.id}`,
        image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: movie.vote_average?.toFixed(1),
          bestRating: '10',
        },
      },
    })),
  };

  return (
    <main className="min-h-screen bg-[#05070b] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto selection:bg-indigo-600 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-8 flex items-center justify-between">
        <Link href={`/movie/${data.id}`} className="inline-flex items-center gap-2 text-xs font-mono text-indigo-400 hover:text-indigo-300">
          <ArrowLeft className="w-4 h-4" /> Back to {data.title} Profile
        </Link>
        <Link href="/editorial" className="text-xs font-mono text-slate-400 hover:text-white underline underline-offset-4">
          All Editorial Guides →
        </Link>
      </nav>

      <header className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Curated Narrative Twins
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
          Top Movies & Series Like {data.title}
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-3xl leading-relaxed">
          Algorithmic selections sharing the same pacing velocity, narrative tension, and thematic atmosphere as {data.title}.
        </p>
      </header>

      {/* Grid */}
      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {data.similar.map((movie: any) => (
          <Link
            key={movie.id}
            href={`/movie/${movie.id}`}
            className="group bg-[#090d15] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-indigo-500/50 transition duration-300 flex flex-col"
          >
            <div className="aspect-[2/3] relative w-full bg-slate-950">
              <MoviePoster
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={`${movie.title} poster`}
                fallbackTitle={movie.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-bold text-amber-400 flex items-center gap-1 border border-white/10">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {movie.vote_average?.toFixed(1)}
              </div>
            </div>
            <div className="p-3 flex-1 flex flex-col justify-between">
              <h3 className="font-bold text-xs text-slate-200 group-hover:text-indigo-400 transition-colors line-clamp-1 mb-1">
                {movie.title}
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">
                {movie.release_date ? movie.release_date.split('-')[0] : 'Feature'}
              </span>
            </div>
          </Link>
        ))}
      </section>

      {/* Bottom Internal Linking Matrix */}
      <footer className="mt-16 pt-8 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-500">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>Cross-Linked via MovieINT Recommendation Matrix</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/rankings" className="text-slate-400 hover:text-indigo-300 underline underline-offset-4">Top Rankings</Link>
          <Link href="/methodology" className="text-slate-400 hover:text-indigo-300 underline underline-offset-4">Scoring Engine</Link>
        </div>
      </footer>
    </main>
  );
}
