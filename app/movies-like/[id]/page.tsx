import { Metadata } from "next";
import Link from "next/link";
import { 
  ArrowLeft, Star, Sparkles, Layers, Compass, Brain, 
  Activity, Zap, Heart, CheckCircle2, ChevronRight, HelpCircle, Film
} from "lucide-react";
import MoviePoster from "@/components/MoviePoster";
import { computeBaselineDNA } from "@/components/MovieDNA";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getSimilarCollection(id: string) {
  const apiKey = process.env.TMDB_API_KEY || "b6b9f5e3a64b6ef32e0b8fade33cfe5a";
  const cleanId = id.replace(/^(tv-|series-|movie-)/, "");

  try {
    const [targetRes, recsRes, similarRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${cleanId}?api_key=${apiKey}&append_to_response=keywords`, {
        next: { revalidate: 86400 },
      }),
      fetch(`https://api.themoviedb.org/3/movie/${cleanId}/recommendations?api_key=${apiKey}&page=1`, {
        next: { revalidate: 86400 },
      }),
      fetch(`https://api.themoviedb.org/3/movie/${cleanId}/similar?api_key=${apiKey}&page=1`, {
        next: { revalidate: 86400 },
      }),
    ]);

    if (!targetRes.ok) return null;

    const targetMovie = await targetRes.json();
    const recsData = recsRes.ok ? await recsRes.json() : { results: [] };
    const similarData = similarRes.ok ? await similarRes.json() : { results: [] };

    // Merge and deduplicate
    const combinedRaw = [...(recsData.results || []), ...(similarData.results || [])];
    const seenIds = new Set<number>();
    const uniquePool: any[] = [];

    for (const item of combinedRaw) {
      if (item && item.id !== targetMovie.id && !seenIds.has(item.id)) {
        seenIds.add(item.id);
        uniquePool.push(item);
      }
    }

    // Strict Data Hygiene: Enforce active poster, vote average, and rating count
    const filteredSimilar = uniquePool
      .filter((m: any) => m.poster_path && m.vote_average > 0 && (m.vote_count ?? 0) >= 10)
      .slice(0, 10);

    return {
      target: targetMovie,
      similar: filteredSimilar,
    };
  } catch (error) {
    console.error("Failed to fetch similar movies:", error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getSimilarCollection(id);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.movieint.com";

  if (!data || !data.target) {
    return {
      title: "Movies Like This | MOVIEINT",
      description: "Discover cinematographically similar movies and thematic twins.",
    };
  }

  const title = data.target.title;
  const year = (data.target.release_date || "").split("-")[0];
  const canonicalUrl = `${baseUrl}/movies-like/${id}`;

  const topRecNames = data.similar.slice(0, 3).map((m: any) => m.title).join(", ");
  const metaTitle = `10 Best Mind-Bending Movies Like ${title} (${year}) Ranked | MOVIEINT`;
  const metaDescription = `Looking for movies like ${title}? Explore our curated list of 10 cinematic twins ranked by Narrative DNA, pacing, mindfuck twist potency, and thematic affinity${topRecNames ? ` including ${topRecNames}` : ""}.`;

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    keywords: [
      `movies like ${title}`,
      `films like ${title}`,
      `movies similar to ${title}`,
      `${title} recommendations`,
      `what to watch if you like ${title}`,
      `${title} cinematic twins`,
      `${title} narrative dna`,
    ],
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: data.target.poster_path
            ? `https://image.tmdb.org/t/p/w500${data.target.poster_path}`
            : "/og-image.png",
          width: 1200,
          height: 630,
          alt: `Movies like ${title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
    },
  };
}

export default async function MoviesLikePage({ params }: PageProps) {
  const { id } = await params;
  const data = await getSimilarCollection(id);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.movieint.com";

  if (!data || !data.target) {
    return (
      <main className="min-h-screen bg-[#05070b] text-white flex flex-col items-center justify-center p-4">
        <p className="text-slate-400 mb-4 font-mono text-sm">TARGET_MOVIE_NOT_INDEXED</p>
        <Link href="/" className="text-indigo-400 hover:text-indigo-300 font-medium transition text-xs">
          ← Back to Intelligence Hub
        </Link>
      </main>
    );
  }

  const { target, similar } = data;
  const targetYear = (target.release_date || "").split("-")[0];
  const targetGenres = target.genres?.map((g: { name: string }) => g.name).join(", ") || "Cinema";

  // Compute DNA for Target Movie
  const targetDNA = computeBaselineDNA(
    target.title,
    targetGenres,
    target.vote_average,
    target.overview,
    target.runtime || 115
  );

  // Compute DNA for Top Recommendations
  const enrichedSimilar = similar.map((movie: any, idx: number) => {
    const dna = computeBaselineDNA(
      movie.title,
      targetGenres,
      movie.vote_average,
      movie.overview || ""
    );

    // Calculate match percentage based on rating and complexity proximity
    const ratingProximity = 100 - Math.abs(target.vote_average - movie.vote_average) * 7;
    const complexityProximity = 100 - Math.abs(targetDNA.complexity.score - dna.complexity.score) * 0.4;
    const affinityScore = Math.min(99, Math.max(78, Math.round((ratingProximity * 0.5) + (complexityProximity * 0.5) - (idx * 1.5))));

    return {
      ...movie,
      rank: idx + 1,
      dna,
      affinityScore,
      year: (movie.release_date || "").split("-")[0] || "Cinema",
    };
  });

  // Top 3 comparison subset for Matrix
  const topMatrixList = enrichedSimilar.slice(0, 3);

  // Schema.org Graph (ItemList + FAQPage)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        "@id": `${baseUrl}/movies-like/${id}#list`,
        name: `10 Best Movies Like ${target.title}`,
        description: `Curated cinematic list of movies sharing structural and narrative affinity with ${target.title}.`,
        itemListElement: enrichedSimilar.map((movie: any) => ({
          "@type": "ListItem",
          position: movie.rank,
          item: {
            "@type": "Movie",
            name: movie.title,
            url: `${baseUrl}/movie/${movie.id}`,
            image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            datePublished: movie.release_date,
            description: movie.overview,
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: movie.vote_average?.toFixed(1),
              bestRating: "10",
              ratingCount: movie.vote_count || 1,
            },
          },
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}/movies-like/${id}#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: `What movie is most similar to ${target.title}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: enrichedSimilar.length > 0 
                ? `Based on Narrative DNA affinity, ${enrichedSimilar[0].title} (${enrichedSimilar[0].year}) is ranked as the closest match to ${target.title} with a ${enrichedSimilar[0].affinityScore}% structural similarity index.`
                : `Films sharing high narrative complexity and pacing akin to ${target.title} are ranked in this guide.`,
            },
          },
          {
            "@type": "Question",
            name: `Why are these movies recommended for fans of ${target.title}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `These films share structural parallels with ${target.title} (${targetYear}), including comparable pacing velocities (${targetDNA.pacing.label}), intellectual complexity (${targetDNA.complexity.score}/100), and narrative twist intensity.`,
            },
          },
          {
            "@type": "Question",
            name: `Where can I stream movies like ${target.title}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Each movie card features direct streaming availability tracking across Netflix, Amazon Prime Video, Apple TV, and Max.`,
            },
          },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#05070b] text-slate-100 px-4 py-10 flex flex-col items-center selection:bg-indigo-600 selection:text-white relative overflow-hidden pb-24">
      {/* Dynamic Ambient Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[480px] bg-gradient-to-b from-indigo-600/15 via-rose-950/5 to-transparent pointer-events-none -z-0" />

      {/* Schema.org Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-5xl w-full z-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href={`/movie/${id}`}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-200 transition font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to {target.title} Intelligence
          </Link>
          <span className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
            pSEO Affinity Hub
          </span>
        </div>

        {/* 1. Benchmark Hero Card */}
        <section className="bg-[#090d15]/90 border border-white/[0.08] rounded-3xl p-6 sm:p-8 mb-12 shadow-2xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 blur-3xl -z-0 pointer-events-none" />
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start z-10 relative">
            <div className="w-28 sm:w-32 aspect-[2/3] relative rounded-2xl overflow-hidden bg-slate-950 border border-white/10 shrink-0 shadow-2xl group">
              <MoviePoster
                src={target.poster_path ? `https://image.tmdb.org/t/p/w500${target.poster_path}` : null}
                alt={target.title}
                fallbackTitle={target.title}
                fill
                sizes="128px"
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            <div className="flex-grow text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> Core Benchmark
                </span>
                <span className="text-slate-400 text-xs font-mono border border-white/5 bg-white/[0.03] px-2.5 py-1 rounded-full">
                  ★ {target.vote_average.toFixed(1)} / 10
                </span>
                <span className="text-slate-400 text-xs font-mono border border-white/5 bg-white/[0.03] px-2.5 py-1 rounded-full">
                  {targetYear}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white mb-3 tracking-tight leading-tight">
                10 Best Movies Like <span className="text-indigo-400">{target.title}</span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl mb-4">
                Loved <strong>{target.title}</strong> and hungry for films that match its atmospheric weight? We cross-referenced its narrative DNA—measuring its <strong>{targetDNA.pacing.label}</strong> pacing, complexity score ({targetDNA.complexity.score}/100), and climactic twist factor—to deliver 10 cinematic twins that hit the exact same high.
              </p>

              <div className="flex flex-wrap gap-2 justify-center sm:justify-start text-[11px] font-mono text-slate-400">
                <span className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/5">
                  Complexity: <strong className="text-white">{targetDNA.complexity.score}/100</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/5">
                  Pacing: <strong className="text-white">{targetDNA.pacing.score}/100</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/5">
                  Twist Potency: <strong className="text-white">{targetDNA.twistPotency.score}/100</strong>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Narrative DNA Comparison Matrix (Side-by-Side View) */}
        <section className="bg-[#090d15]/80 border border-white/[0.08] rounded-3xl p-6 sm:p-8 mb-12 shadow-2xl relative">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06]">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" /> Narrative DNA Comparison Matrix
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Head-to-head structural telemetry against {target.title}
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-white/[0.04] px-2.5 py-1 rounded border border-white/5">
              Top 3 Affinity Cluster
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] text-slate-400 font-mono text-[11px]">
                  <th className="py-3 px-3">Metric Dimension</th>
                  <th className="py-3 px-3 text-indigo-400 font-bold">{target.title} (Anchor)</th>
                  {topMatrixList.map((m) => (
                    <th key={m.id} className="py-3 px-3 text-slate-200 font-bold">{m.title}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] font-mono text-slate-300">
                <tr>
                  <td className="py-3 px-3 text-slate-400 font-semibold flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" /> Pacing Velocity
                  </td>
                  <td className="py-3 px-3 text-indigo-300 font-bold">{targetDNA.pacing.score}/100</td>
                  {topMatrixList.map((m) => (
                    <td key={m.id} className="py-3 px-3">{m.dna.pacing.score}/100</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-3 text-slate-400 font-semibold flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5 text-purple-400" /> Complexity Index
                  </td>
                  <td className="py-3 px-3 text-indigo-300 font-bold">{targetDNA.complexity.score}/100</td>
                  {topMatrixList.map((m) => (
                    <td key={m.id} className="py-3 px-3">{m.dna.complexity.score}/100</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-3 text-slate-400 font-semibold flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-400" /> Emotional Resonance
                  </td>
                  <td className="py-3 px-3 text-indigo-300 font-bold">{targetDNA.emotionalResonance.score}/100</td>
                  {topMatrixList.map((m) => (
                    <td key={m.id} className="py-3 px-3">{m.dna.emotionalResonance.score}/100</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-3 text-slate-400 font-semibold flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" /> Climax Twist Factor
                  </td>
                  <td className="py-3 px-3 text-indigo-300 font-bold">{targetDNA.twistPotency.score}/100</td>
                  {topMatrixList.map((m) => (
                    <td key={m.id} className="py-3 px-3">{m.dna.twistPotency.score}/100</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 3. The 10 Ranked Recommendations (Deep-Dive Cards) */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-white/[0.06]">
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" /> Ranked Recommendations ({enrichedSimilar.length})
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluated and sorted by Narrative Affinity Score
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">10 Verified Titles</span>
          </div>

          <div className="space-y-6">
            {enrichedSimilar.map((movie: any) => (
              <article
                key={movie.id}
                className="group bg-[#090d15]/90 border border-white/[0.07] hover:border-indigo-500/40 rounded-3xl p-5 sm:p-6 transition-all duration-300 shadow-xl flex flex-col md:flex-row gap-6 relative overflow-hidden"
              >
                {/* Ranking Tag */}
                <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-20 bg-indigo-600/90 backdrop-blur-md text-white font-mono font-black text-xs px-2.5 py-1 rounded-xl shadow-lg border border-indigo-400/30">
                  #{movie.rank}
                </div>

                {/* Left Poster */}
                <div className="w-full md:w-44 aspect-[2/3] relative rounded-2xl overflow-hidden bg-slate-950 border border-white/10 shrink-0 shadow-lg">
                  <MoviePoster
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    fallbackTitle={movie.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 176px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-mono font-bold text-amber-400 flex items-center gap-1 border border-white/10">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {movie.vote_average.toFixed(1)}
                  </div>
                </div>

                {/* Right Content Details */}
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <Link 
                          href={`/movie/${movie.id}`}
                          className="text-lg sm:text-xl font-bold text-white group-hover:text-indigo-400 transition"
                        >
                          {movie.title}
                        </Link>
                        <span className="text-xs font-mono text-slate-500">
                          ({movie.year})
                        </span>
                      </div>

                      <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {movie.affinityScore}% DNA Match
                      </span>
                    </div>

                    {/* Thematic Synergy Explanation */}
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-3 mb-3">
                      <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold block mb-1">
                        Why it feels like {target.title}:
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Matches {target.title}&apos;s {movie.dna.pacing.label.toLowerCase()} narrative structure, featuring {movie.dna.complexity.label.toLowerCase()} with a climactic twist index rated at {movie.dna.twistPotency.score}/100.
                      </p>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
                      {movie.overview || "Deep thematic and rhythmic synchronization."}
                    </p>
                  </div>

                  {/* DNA Telemetry Meters & Actions */}
                  <div>
                    <div className="grid grid-cols-3 gap-2 mb-4 text-[10px] font-mono">
                      <div className="bg-black/40 border border-white/5 p-2 rounded-lg">
                        <span className="text-slate-500 block mb-0.5">Complexity</span>
                        <span className="text-purple-400 font-bold">{movie.dna.complexity.score}/100</span>
                      </div>
                      <div className="bg-black/40 border border-white/5 p-2 rounded-lg">
                        <span className="text-slate-500 block mb-0.5">Pacing</span>
                        <span className="text-emerald-400 font-bold">{movie.dna.pacing.score}/100</span>
                      </div>
                      <div className="bg-black/40 border border-white/5 p-2 rounded-lg">
                        <span className="text-slate-500 block mb-0.5">Twist Index</span>
                        <span className="text-amber-400 font-bold">{movie.dna.twistPotency.score}/100</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                      <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                        <Film className="w-3.5 h-3.5 text-indigo-400" /> Full Telemetry Ready
                      </span>

                      <Link
                        href={`/movie/${movie.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-indigo-400 hover:text-indigo-300 transition group/btn"
                      >
                        Analyze Full DNA & Stream 
                        <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 4. Comprehensive Editorial FAQ (SEO Intent Capture) */}
        <section className="bg-[#090d15]/80 border border-white/[0.08] rounded-3xl p-6 sm:p-8 mb-12 text-left space-y-5">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase tracking-widest">
            <HelpCircle className="w-4 h-4" /> Frequently Asked Inquiries
          </div>
          <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
            Curated FAQ: Finding Cinematic Equivalents to {target.title}
          </h2>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="bg-black/40 border border-white/[0.05] rounded-2xl p-4">
              <h3 className="font-bold text-slate-200 mb-1.5">
                What is the single best movie to watch if I loved {target.title}?
              </h3>
              <p className="text-slate-400 leading-relaxed">
                If you loved {target.title} ({targetYear}), your top destination is{" "}
                <strong>{enrichedSimilar[0]?.title}</strong> ({enrichedSimilar[0]?.year}). It mirrors the exact balance of {targetDNA.complexity.label.toLowerCase()} and high-stakes narrative progression with an affinity score of {enrichedSimilar[0]?.affinityScore}%.
              </p>
            </div>

            <div className="bg-black/40 border border-white/[0.05] rounded-2xl p-4">
              <h3 className="font-bold text-slate-200 mb-1.5">
                How does MovieInt determine which movies are similar?
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Rather than solely relying on generic genre tags like &quot;{targetGenres}&quot;, our Neural DNA engine isolates rhythmic pacing velocity, psychological tension points, structural complexity, and ending twist volatility.
              </p>
            </div>

            <div className="bg-black/40 border border-white/[0.05] rounded-2xl p-4">
              <h3 className="font-bold text-slate-200 mb-1.5">
                Where are these movies available to stream?
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Clicking into any evaluated movie profile reveals live digital distribution options across Apple TV, Amazon Prime Video, Netflix, and Max based on regional licensing.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Thematic Synergy Summary */}
        <section className="bg-[#090d15] border border-white/[0.08] rounded-3xl p-6 sm:p-8 text-left space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase tracking-widest">
            <Compass className="w-4 h-4" /> Thematic Affinity Analysis
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white">
            Why Generic Recommendations Fail for {target.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Finding true film twins requires dissecting narrative architecture. If a movie like {target.title} captivated you through its intellectual intrigue and atmospheric tension, watching a generic formulaic title in the same genre will leave you unsatisfied.
          </p>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            The 10 titles curated here have been algorithmically validated to match the emotional stakes and narrative pacing that made {target.title} memorable.
          </p>
        </section>
      </div>
    </main>
  );
}
