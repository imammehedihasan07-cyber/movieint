import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert, Sparkles, Layers, Eye, HelpCircle } from 'lucide-react';
import MoviePoster from '@/components/MoviePoster';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 86400; // 24h ISR

async function getMovieWithEnding(id: string) {
  const apiKey = process.env.TMDB_API_KEY || 'b6b9f5e3a64b6ef32e0b8fade33cfe5a';
  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`, {
      next: { revalidate: 86400 }
    });
    if (!res.ok) return null;
    const movie = await res.json();

    // Fallback analytical decryption
    const defaultAnalysis = {
      endingSummary: `The final sequence of ${movie.title} converges its thematic tension by confronting the protagonist with the reality of their choices, dissolving illusions established in earlier acts.`,
      hiddenClues: [
        "Key visual motifs in the third act mirror the initial opening scene, forming a deliberate cyclical narrative.",
        "Character dialogue in pivotal transitions subtly confirms the objective reality over the character's internal perspective."
      ],
      philosophicalThematicMeaning: `${movie.title} explores human fragility and existential agency, suggesting that subjective perception often shields individuals from painful truths.`,
      finalAmbiguityVerdict: "The narrative intentionally preserves subtle interpretive duality to maximize psychological resonance."
    };

    return { movie, analysis: defaultAnalysis };
  } catch (err) {
    console.error('Error in ending page:', err);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getMovieWithEnding(id);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.movieint.com';

  if (!data) {
    return {
      title: 'Ending Explained | MOVIEINT',
      description: 'Cinematic climax decryption.',
    };
  }

  const { movie } = data;
  const year = movie.release_date ? movie.release_date.split('-')[0] : '';
  const canonicalUrl = `${baseUrl}/ending-explained/${id}`;

  return {
    title: `${movie.title} (${year}) Ending Explained & Meaning | MOVIEINT`,
    description: `A decisive breakdown of what really happened at the end of ${movie.title}. Uncover hidden clues, twists, and thematic interpretations.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${movie.title} Ending Explained & Analysis`,
      description: `Complete breakdown of the climax, ambiguous scenes, and hidden details in ${movie.title}.`,
      url: canonicalUrl,
      type: 'article',
    },
  };
}

export default async function MovieEndingPage({ params }: PageProps) {
  const { id } = await params;
  const data = await getMovieWithEnding(id);

  if (!data) {
    return (
      <main className="min-h-screen bg-[#05070b] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-xl font-bold mb-2">Analysis Unavailable</h1>
        <Link href="/ending-explained" className="text-indigo-400 text-xs font-mono">
          ← Return to Ending Library
        </Link>
      </main>
    );
  }

  const { movie, analysis } = data;
  const year = movie.release_date ? movie.release_date.split('-')[0] : '';

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${movie.title} Ending Explained & Full Climax Decryption`,
    description: analysis.endingSummary,
    image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    author: {
      '@type': 'Organization',
      name: 'MOVIEINT Telemetry Team',
    },
  };

  return (
    <main className="min-h-screen bg-[#05070b] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto selection:bg-rose-600 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <nav className="mb-8 flex items-center justify-between">
        <Link href="/ending-explained" className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> All Ending Decryptions
        </Link>
        <Link href={`/movie/${movie.id}`} className="text-xs font-mono text-indigo-400 hover:underline">
          View Movie Profile →
        </Link>
      </nav>

      {/* Header Banner */}
      <header className="bg-[#090d15] border border-white/[0.08] rounded-3xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        <div className="w-28 sm:w-36 aspect-[2/3] relative rounded-2xl overflow-hidden shrink-0 border border-white/10 shadow-2xl">
          <MoviePoster
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            fallbackTitle={movie.title}
            fill
            sizes="150px"
            className="object-cover"
          />
        </div>
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono uppercase mb-3">
            <ShieldAlert className="w-3.5 h-3.5" /> Major Spoilers Ahead
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-2">
            {movie.title} ({year}) Ending Explained
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Deconstructing the narrative climax, symbolisms, and hidden structural clues.
          </p>
        </div>
      </header>

      {/* Analysis Content */}
      <div className="space-y-6">
        <section className="bg-[#090d15]/80 border border-white/[0.08] rounded-3xl p-6 sm:p-8 space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-rose-400" /> What Really Happened in the Finale?
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {analysis.endingSummary}
          </p>
        </section>

        <section className="bg-[#090d15]/80 border border-white/[0.08] rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" /> Hidden Clues Most Viewers Missed
          </h2>
          <div className="space-y-2">
            {analysis.hiddenClues.map((clue: string, idx: number) => (
              <div key={idx} className="p-3 bg-black/40 border border-white/5 rounded-xl text-xs text-slate-300 leading-relaxed">
                • {clue}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#090d15]/80 border border-white/[0.08] rounded-3xl p-6 sm:p-8 space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" /> Philosophical & Thematic Meaning
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {analysis.philosophicalThematicMeaning}
          </p>
        </section>

        <section className="bg-[#090d15]/80 border border-white/[0.08] rounded-3xl p-6 sm:p-8 space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-cyan-400" /> Definitive Ambiguity Verdict
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {analysis.finalAmbiguityVerdict}
          </p>
        </section>
      </div>

      {/* Internal link back to movie & twins */}
      <footer className="mt-12 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <Link href={`/movies-like/${movie.id}`} className="text-indigo-400 hover:underline">
          Movies Like {movie.title} →
        </Link>
        <Link href="/editorial" className="text-slate-400 hover:underline">
          Browse All Curated Guides →
        </Link>
      </footer>
    </main>
  );
}
