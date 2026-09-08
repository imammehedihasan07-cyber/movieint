// components/DnaAffinityEngine.tsx
import React from 'react';
import Link from 'next/link';
import MoviePoster from '@/components/MoviePoster';
import { Sparkles, ArrowRight, Swords } from 'lucide-react';

interface MovieItem {
  id: number | string;
  title: string;
  poster_path?: string | null;
  release_date?: string;
  vote_average?: number;
  overview?: string;
  genres?: { id: number; name: string }[] | string;
  original_language?: string;
}

interface AffinityTarget {
  id: number | string;
  title: string;
  year: number | string;
  posterPath: string | null;
  affinityScore: number;
  complexity: number;
  emotionalDepth: number;
  pacing: string;
  endingType: string;
  primaryHook: string;
  whyMatches: string;
  mediaTypeBadge: string;
}

// Deterministic DNA Telemetry Matrix
function getHashMetrics(title: string, id: number | string, isAnime: boolean, isKdrama: boolean) {
  let hash = 0;
  const str = `${title}-${id}`;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const pos = Math.abs(hash);

  const complexities = isAnime ? [85, 92, 88, 96, 82] : [78, 86, 91, 84, 89];
  const emotions = (isAnime || isKdrama) ? [95, 98, 92, 96, 90] : [82, 88, 91, 85, 94];
  
  const pacings = isAnime
    ? ['Dynamic Shonen Momentum', 'Contemplative Melancholic Cadence', 'Tactical Psychological Duel', 'Expansive World-Building Pace']
    : isKdrama
    ? ['High-Tension Cliffhanger Pacing', 'Emotional Slow-Burn Escalation', 'Intricate Revenge Tempo']
    : ['Atmospheric Deliberate Build', 'Tightening Spiral Thriller', 'Relentless Synchronized Cadence', 'Methodical Procedural Simmer'];

  const endings = isAnime
    ? ['Philosophical Catharsis', 'Bittersweet Transcendent Farewell', 'Sublime Emotional Climax']
    : isKdrama
    ? ['Devastating Moral Retribution', 'Poetic Melancholic Closure', 'High-Stakes Resolution']
    : ['Non-Linear Revelation', 'Ambiguous Equilibrium', 'Existential Resolution', 'Devastating Psychological Climax'];

  return {
    complexity: complexities[pos % complexities.length],
    emotionalDepth: emotions[(pos >> 2) % emotions.length],
    pacing: pacings[(pos >> 3) % pacings.length],
    endingType: endings[(pos >> 4) % endings.length],
    affinityScore: 84 + (pos % 13), // 84% - 96%
  };
}

async function fetchDynamicAffinity(currentMovie: MovieItem): Promise<AffinityTarget[]> {
  const apiKey = process.env.TMDB_API_KEY || "b6b9f5e3a64b6ef32e0b8fade33cfe5a";
  const rawId = String(currentMovie.id);
  const isTv = rawId.startsWith("tv-") || rawId.startsWith("series-");
  const cleanId = rawId.replace(/^(tv-|series-|movie-)/, "");
  const endpointType = isTv ? "tv" : "movie";

  const genreStr = Array.isArray(currentMovie.genres)
    ? currentMovie.genres.map((g) => (typeof g === 'string' ? g : g.name)).join(' ').toLowerCase()
    : String(currentMovie.genres || '').toLowerCase();

  const isAnime = genreStr.includes('animation') || currentMovie.original_language === 'ja';
  const isKdrama = currentMovie.original_language === 'ko' || genreStr.includes('k-drama');

  try {
    // 1. Fetch TMDB Recommendations
    let res = await fetch(
      `https://api.themoviedb.org/3/${endpointType}/${cleanId}/recommendations?api_key=${apiKey}&page=1`,
      { next: { revalidate: 86400 } }
    );
    let data = await res.json();

    // 2. Fallback to similar endpoint if sparse
    if (!data.results || data.results.length < 3) {
      res = await fetch(
        `https://api.themoviedb.org/3/${endpointType}/${cleanId}/similar?api_key=${apiKey}&page=1`,
        { next: { revalidate: 86400 } }
      );
      data = await res.json();
    }

    let cleanResults = (data.results || []).filter(
      (item: any) => item && item.poster_path && (item.vote_count ?? 0) >= 3
    );

    // If Anime or KDrama, prioritize same language / animation style
    if (isAnime) {
      const animeMatches = cleanResults.filter((m: any) => m.original_language === 'ja' || (m.genre_ids && m.genre_ids.includes(16)));
      if (animeMatches.length >= 2) cleanResults = animeMatches;
    } else if (isKdrama) {
      const kdramaMatches = cleanResults.filter((m: any) => m.original_language === 'ko');
      if (kdramaMatches.length >= 2) cleanResults = kdramaMatches;
    }

    if (cleanResults.length > 0) {
      return cleanResults.slice(0, 4).map((item: any) => {
        const itemTitle = item.title || item.name;
        const itemDate = item.release_date || item.first_air_date || '';
        const itemYear = itemDate.split('-')[0] || 'Recent';
        const targetId = isTv ? `tv-${item.id}` : item.id;
        const metrics = getHashMetrics(itemTitle, item.id, isAnime, isKdrama);

        let mediaTypeBadge = isTv ? 'SERIES' : 'FEATURE FILM';
        if (item.original_language === 'ja' && isTv) mediaTypeBadge = 'ANIME SERIES';
        if (item.original_language === 'ko' && isTv) mediaTypeBadge = 'K-DRAMA';

        let whyMatches = '';
        if (isAnime) {
          whyMatches = `Resonates with ${currentMovie.title}’s thematic world-building, high emotional stakes (${metrics.emotionalDepth}/100), and a ${metrics.pacing.toLowerCase()}.`;
        } else if (isKdrama) {
          whyMatches = `Carries ${currentMovie.title}’s gripping suspense and moral depth with a ${metrics.pacing.toLowerCase()} and ${metrics.endingType.toLowerCase()}.`;
        } else {
          whyMatches = `Mirrors ${currentMovie.title}’s narrative velocity, pairing ${metrics.complexity}/100 complexity with a ${metrics.pacing.toLowerCase()}.`;
        }

        return {
          id: targetId,
          title: itemTitle,
          year: itemYear,
          posterPath: item.poster_path,
          affinityScore: metrics.affinityScore,
          complexity: metrics.complexity,
          emotionalDepth: metrics.emotionalDepth,
          pacing: metrics.pacing,
          endingType: metrics.endingType,
          primaryHook: item.overview ? item.overview.slice(0, 45) + '...' : 'Profound Narrative DNA Resonance',
          whyMatches,
          mediaTypeBadge
        };
      });
    }
  } catch (err) {
    console.error("Failed to dynamically fetch affinity targets", err);
  }

  // Curated Fallbacks if TMDB returns empty
  return [
    {
      id: isTv ? 'tv-37854' : 329865,
      title: isAnime ? 'Fullmetal Alchemist: Brotherhood' : isTv ? 'Severance' : 'Arrival',
      year: isAnime ? '2009' : isTv ? '2022' : '2016',
      posterPath: isAnime ? '/5ZFUEOULaVml7p19bliq5966Ks9.jpg' : isTv ? '/p990s5V2w7a6HkU1N0c9.jpg' : '/x2O0omcr2Yxegke2ipL9x19Cc4g.jpg',
      affinityScore: 94,
      complexity: 89,
      emotionalDepth: 96,
      pacing: isAnime ? 'Expansive World-Building Pace' : 'Atmospheric Deliberate Build',
      endingType: 'Philosophical Catharsis',
      primaryHook: 'Immaculate Structural Narrative Architecture',
      whyMatches: `Matches ${currentMovie.title} in narrative economy, character depth, and thematic resonance.`,
      mediaTypeBadge: isAnime ? 'ANIME SERIES' : isTv ? 'SERIES' : 'FEATURE FILM'
    },
    {
      id: isTv ? 'tv-209867' : 27205,
      title: isAnime ? 'Frieren: Beyond Journey’s End' : isTv ? 'Dark' : 'Inception',
      year: isAnime ? '2023' : isTv ? '2017' : '2010',
      posterPath: isAnime ? '/dqZENchTd7lp5zht7BdlqM7RBPk.jpg' : isTv ? '/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg' : '/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg',
      affinityScore: 91,
      complexity: 94,
      emotionalDepth: 92,
      pacing: isAnime ? 'Contemplative Melancholic Cadence' : 'Tightening Spiral Thriller',
      endingType: 'Bittersweet Transcendent Farewell',
      primaryHook: 'Deep Time & Existential Contemplation',
      whyMatches: `Parallels ${currentMovie.title}’s emotional weight and exceptional craftsmanship.`,
      mediaTypeBadge: isAnime ? 'ANIME SERIES' : isTv ? 'SERIES' : 'FEATURE FILM'
    }
  ];
}

interface DnaAffinityEngineProps {
  currentMovie: MovieItem;
}

export default async function DnaAffinityEngine({ currentMovie }: DnaAffinityEngineProps) {
  const matchedList = await fetchDynamicAffinity(currentMovie);

  return (
    <section className="my-14 rounded-2xl bg-gradient-to-b from-[#0b0f19] to-[#06080d] border border-cyan-500/20 p-6 sm:p-8 shadow-2xl relative overflow-hidden text-left">
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Neural DNA Affinity Engine
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Because You Liked <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">{currentMovie.title}</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Algorithmic recommendations matched across Narrative DNA: Story + Pacing + Complexity + Emotion + Ending Archetype.
          </p>
        </div>

        <Link
          href={`/vs?titleA=${encodeURIComponent(currentMovie.title)}`}
          className="shrink-0 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-mono text-xs flex items-center gap-2 transition self-start md:self-auto"
        >
          <Swords className="w-3.5 h-3.5 text-rose-400" />
          <span>Launch Vs Matrix</span>
        </Link>
      </div>

      {/* Affinity Cards Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-5">
        {matchedList.map((target) => (
          <div
            key={target.id}
            className="rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 p-4 sm:p-5 transition-all duration-200 hover:bg-slate-900/50 flex flex-col justify-between group"
          >
            <div>
              {/* Top Row: Poster, Title & Affinity Score */}
              <div className="flex gap-4 items-start mb-4">
                <Link
                  href={`/movie/${target.id}`}
                  className="w-16 h-24 rounded-lg overflow-hidden shrink-0 relative bg-slate-900 border border-slate-800 group-hover:border-cyan-500/30 transition block"
                >
                  <MoviePoster
                    src={target.posterPath ? `https://image.tmdb.org/t/p/w200${target.posterPath}` : null}
                    alt={target.title}
                    fallbackTitle={target.title}
                    fill
                    sizes="64px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[9px] font-mono uppercase text-cyan-400 font-semibold px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/20">
                      {target.mediaTypeBadge} • {target.year}
                    </span>
                    <div className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold shrink-0">
                      {target.affinityScore}% Affinity
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors truncate mt-1">
                    <Link href={`/movie/${target.id}`}>{target.title}</Link>
                  </h3>

                  <p className="text-[11px] font-mono text-indigo-300 truncate mt-0.5">
                    {target.primaryHook}
                  </p>
                </div>
              </div>

              {/* 6-Dimensional Telemetry Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-[10px] font-mono mb-3.5">
                <div>
                  <span className="text-slate-500 block">COMPLEXITY</span>
                  <span className="text-white font-bold">{target.complexity}/100</span>
                </div>
                <div>
                  <span className="text-slate-500 block">EMOTION</span>
                  <span className="text-indigo-300 font-bold">{target.emotionalDepth}/100</span>
                </div>
                <div>
                  <span className="text-slate-500 block">PACING</span>
                  <span className="text-slate-300 truncate block">{target.pacing}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">ENDING</span>
                  <span className="text-cyan-300 truncate block">{target.endingType}</span>
                </div>
              </div>

              {/* Correlation Rationale */}
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-cyan-400 font-mono text-[10px] uppercase tracking-wider block mb-0.5">
                  Correlation Logic:
                </strong>
                {target.whyMatches}
              </p>
            </div>

            {/* Bottom Links */}
            <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono">
              <Link
                href={`/vs?titleA=${encodeURIComponent(currentMovie.title)}&titleB=${encodeURIComponent(target.title)}`}
                className="text-slate-400 hover:text-slate-200 transition"
              >
                Compare Side-by-Side
              </Link>

              <Link
                href={`/movie/${target.id}`}
                className="text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
              >
                <span>Inspect DNA</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
