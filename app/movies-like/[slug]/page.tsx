import { Metadata } from 'next';
import Link from 'next/link';
import { Star, ArrowLeft } from 'lucide-react';
import MoviePoster from '@/components/MoviePoster';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 86400; // 24 hours ISR

async function getSimilarMovies(idOrSlug: string) {
  const apiKey = process.env.TMDB_API_KEY || 'b6b9f5e3a64b6ef32e0b8fade33cfe5a';
  const cleanId = String(idOrSlug || '').replace(/^(tv-|series-|movie-)/, '');

  if (!cleanId) return null;

  try {
    let [mediaRes, recsRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${cleanId}?api_key=${apiKey}&language=en-US`, { next: { revalidate: 86400 } }).catch(() => null),
      fetch(`https://api.themoviedb.org/3/movie/${cleanId}/recommendations?api_key=${apiKey}&language=en-US&page=1`, { next: { revalidate: 86400 } }).catch(() => null),
    ]);

    let isTv = false;
    if (!mediaRes || !mediaRes.ok) {
      isTv = true;
      [mediaRes, recsRes] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/tv/${cleanId}?api_key=${apiKey}&language=en-US`, { next: { revalidate: 86400 } }).catch(() => null),
        fetch(`https://api.themoviedb.org/3/tv/${cleanId}/recommendations?api_key=${apiKey}&language=en-US&page=1`, { next: { revalidate: 86400 } }).catch(() => null),
      ]);
    }

    if (!mediaRes || !mediaRes.ok) return null;

    const media = await mediaRes.json();
    const recs = recsRes && recsRes.ok ? await recsRes.json() : { results: [] };

    const title = media.title || media.name || 'Untitled';
    const similar = (recs.results || [])
      .filter((m: any) => m.poster_path)
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
    };
  } catch (err) {
    console.error('Error fetching similar movies:', err);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getSimilarMovies(slug);

  if (!data) {
    return {
      title: 'Similar Cinema & Series Recommendations | MOVIEINT',
      description: 'Discover curated algorithmic recommendations.',
    };
  }

  return {
    title: `Top Movies & Series Like ${data.title} | MOVIEINT`,
    description: `Curated twin recommendations and cinematic alternatives similar to ${data.title}.`,
  };
}

export default async function MoviesLikePage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getSimilarMovies(slug);

  if (!data) {
    return (
      <main className="min-h-screen bg-[#05070b] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Recommendations Unavailable</h1>
        <p className="text-slate-400 text-sm mb-6">Unable to generate narrative twins for: {slug}</p>
        <Link href="/" className="px-4 py-2 bg-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-500 transition">
          Return to Hub
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#05070b] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <nav className="mb-8">
        <Link href={`/movie/${data.id}`} className="inline-flex items-center gap-2 text-xs font-mono text-indigo-400 hover:text-indigo-300">
          <ArrowLeft className="w-4 h-4" /> Back to {data.title}
        </Link>
      </nav>

      <header className="mb-12">
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          Movies & Series Like {data.title}
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
          Algorithmic selections sharing the same pacing, narrative tension, and structural DNA as {data.title}.
        </p>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {data.similar.map((sim: any) => (
          <Link
            key={sim.id}
            href={`/movie/${sim.id}`}
            className="group block bg-[#090d15] border border-white/5 hover:border-indigo-500/40 rounded-2xl p-2.5 transition duration-200"
          >
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-2 bg-slate-950">
              <MoviePoster
                src={sim.poster_path ? `https://image.tmdb.org/t/p/w342${sim.poster_path}` : null}
                alt={sim.title}
                fallbackTitle={sim.title}
                fill
                sizes="(max-width: 768px) 50vw, 180px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-mono text-amber-400 flex items-center gap-0.5">
                <Star className="w-2.5 h-2.5 fill-amber-400" />
                <span>{sim.vote_average?.toFixed(1) || 'N/A'}</span>
              </div>
            </div>
            <h2 className="text-xs font-semibold text-white truncate group-hover:text-indigo-300 transition">
              {sim.title}
            </h2>
            <p className="text-[10px] font-mono text-slate-500">
              {(sim.release_date || '').split('-')[0]}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
