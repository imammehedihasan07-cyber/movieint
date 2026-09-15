import { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, ShieldAlert, ArrowLeft, Star, Film } from 'lucide-react';
import MoviePoster from '@/components/MoviePoster';

export const metadata: Metadata = {
  title: 'Ending Explained & Climax Decryption Library | MOVIEINT',
  description: 'Unravel ambiguous movie climaxes, hidden clues, and thematic meanings for cinema’s most mind-bending films.',
  alternates: {
    canonical: 'https://www.movieint.com/ending-explained',
  },
};

const CURATED_TITLES = [
  { id: 27205, title: 'Inception', year: '2010', tag: 'Totem Ambiguity' },
  { id: 157336, title: 'Interstellar', year: '2014', tag: 'Tesseract & Gravity' },
  { id: 77, title: 'Memento', year: '2000', tag: 'Chronological Inversion' },
  { id: 550, title: 'Fight Club', year: '1999', tag: 'Psychological Duality' },
  { id: 1124, title: 'The Prestige', year: '2006', tag: 'The Real Sacrifice' },
  { id: 745, title: 'The Sixth Sense', year: '1999', tag: 'Perspective Shift' },
  { id: 11324, title: 'Shutter Island', year: '2010', tag: 'Delusion vs Acceptance' },
  { id: 264660, title: 'Ex Machina', year: '2014', tag: 'AI Autonomy' },
];

async function getFeaturedMovieData() {
  const apiKey = process.env.TMDB_API_KEY || 'b6b9f5e3a64b6ef32e0b8fade33cfe5a';
  try {
    const promises = CURATED_TITLES.map(async (item) => {
      const res = await fetch(`https://api.themoviedb.org/3/movie/${item.id}?api_key=${apiKey}&language=en-US`, {
        next: { revalidate: 86400 }
      });
      if (!res.ok) return null;
      const data = await res.json();
      return {
        ...item,
        poster_path: data.poster_path,
        vote_average: data.vote_average,
        overview: data.overview,
      };
    });
    const results = await Promise.all(promises);
    return results.filter(Boolean);
  } catch (err) {
    console.error('Failed to load featured endings:', err);
    return [];
  }
}

export default async function EndingExplainedHub() {
  const movies = await getFeaturedMovieData();

  return (
    <main className="min-h-screen bg-[#05070b] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto selection:bg-rose-600 selection:text-white">
      <nav className="mb-8 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono text-indigo-400 hover:text-indigo-300">
          <ArrowLeft className="w-4 h-4" /> Return to Discover
        </Link>
        <span className="text-xs font-mono text-rose-400 flex items-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5" /> Spoiler Shield Protocols Active
        </span>
      </nav>

      <header className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Decryption Archive
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          Ending Explained & Narrative Decryption
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-3xl leading-relaxed">
          Unpack cinema’s most complex final acts. We decode ambiguous endings, hidden director clues, timeline loops, and philosophical themes with algorithmic precision.
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie: any) => (
          <Link
            key={movie.id}
            href={`/ending-explained/${movie.id}`}
            className="group bg-[#090d15] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-rose-500/50 transition duration-300 flex flex-col"
          >
            <div className="aspect-[2/3] relative w-full bg-slate-950">
              <MoviePoster
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={`${movie.title} poster`}
                fallbackTitle={movie.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-bold text-amber-400 flex items-center gap-1 border border-white/10">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {movie.vote_average?.toFixed(1)}
              </div>
              <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-mono text-rose-300 border border-rose-500/20 truncate">
                {movie.tag}
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="font-bold text-sm text-white group-hover:text-rose-400 transition-colors line-clamp-1 mb-1">
                  {movie.title} ({movie.year})
                </h2>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {movie.overview}
                </p>
              </div>
              <span className="text-[11px] font-mono text-rose-400 mt-4 inline-block font-semibold">
                Read Ending Decryption →
              </span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
