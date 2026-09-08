// components/DnaAffinityEngine.tsx
"use client";

import React, { useState, useEffect } from 'react';
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
  genres?: any;
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

interface DnaAffinityEngineProps {
  currentMovie: MovieItem;
}

export default function DnaAffinityEngine({ currentMovie }: DnaAffinityEngineProps) {
  const [matchedList, setMatchedList] = useState<AffinityTarget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadAffinity() {
      try {
        const genreIds: number[] = [];
        if (Array.isArray(currentMovie.genres)) {
          currentMovie.genres.forEach((g: any) => {
            if (typeof g === 'object' && g?.id) genreIds.push(Number(g.id));
            else if (typeof g === 'number') genreIds.push(g);
          });
        }

        const queryParams = new URLSearchParams({
          id: String(currentMovie.id || ''),
          title: currentMovie.title || '',
          lang: currentMovie.original_language || '',
          genres: genreIds.join(','),
        });

        const res = await fetch(`/api/affinity?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data.results)) {
            setMatchedList(data.results);
          }
        }
      } catch (e) {
        console.warn("Affinity silent fetch error:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAffinity();
    return () => {
      isMounted = false;
    };
  }, [currentMovie]);

  // If loading, render elegant low-opacity skeleton without blocking the page
  if (loading) {
    return (
      <section className="my-14 rounded-2xl bg-slate-950/40 border border-slate-800/60 p-6 sm:p-8 animate-pulse text-left">
        <div className="h-4 w-44 bg-slate-800 rounded mb-4" />
        <div className="h-8 w-80 bg-slate-850 rounded mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="h-44 bg-slate-900/50 rounded-xl" />
          <div className="h-44 bg-slate-900/50 rounded-xl" />
        </div>
      </section>
    );
  }

  // If no results, gracefully hide component
  if (!matchedList || matchedList.length === 0) return null;

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
          href={`/vs?titleA=${encodeURIComponent(currentMovie.title || '')}`}
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
            key={String(target.id)}
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
                href={`/vs?titleA=${encodeURIComponent(currentMovie.title || '')}&titleB=${encodeURIComponent(target.title || '')}`}
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
