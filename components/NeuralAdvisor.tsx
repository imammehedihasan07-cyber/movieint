// components/NeuralAdvisor.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import MoviePoster from '@/components/MoviePoster';
import { ArrowRight, Sparkles } from 'lucide-react';

interface AdvisorResult {
  title: string;
  tmdbId: string;
  year: number;
  director: string;
  runtime: string;
  posterPath?: string;
  dnaScore: number;
  complexity: number;
  emotionalIntensity: number;
  pacing: string;
  endingType: string;
  matchPercent: number;
  whyItMatches: string;
  streamingOn: string[];
}

const SAMPLE_QUERIES = [
  'I want something like Interstellar but darker and less complicated',
  'Like Inception but faster-paced and under 2 hours',
  'A dark psychological Korean thriller with high tension',
  'Mind-bending puzzle box with a shocking twist'
];

export default function NeuralAdvisor() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AdvisorResult[] | null>(null);

  const handleSearch = async (queryText?: string) => {
    const q = queryText || prompt;
    if (!q.trim()) return;

    setLoading(true);
    setResults(null);
    if (queryText) setPrompt(queryText);

    try {
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: q })
      });
      const data = await res.json();
      if (data.results) {
        setResults(data.results);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#0e1424] to-[#07090e] border border-cyan-500/30 shadow-2xl relative overflow-hidden text-left">
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Header */}
      <div className="relative z-10 text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 font-mono text-xs uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          MovieINT Neural Film Advisor v1.0
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Natural Language Telemetry Matcher
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
          Describe the exact vibe, reference movie, pacing, or emotional intensity you want. Our algorithmic vector model will find the exact match.
        </p>
      </div>

      {/* Input Box */}
      <div className="relative z-10 space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="e.g. I want something like Interstellar but darker and less complicated..."
            className="flex-1 bg-slate-950/90 border border-slate-700/80 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-mono"
          />
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-sm tracking-wide transition-all disabled:opacity-50 whitespace-nowrap shadow-lg shadow-cyan-500/20"
          >
            {loading ? 'CALIBRATING...' : 'EXECUTE DNA MATCH →'}
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-slate-500">Quick Probes:</span>
          {SAMPLE_QUERIES.map((sample, i) => (
            <button
              key={i}
              onClick={() => handleSearch(sample)}
              className="text-left px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-300 transition-colors"
            >
              &quot;{sample.slice(0, 32)}...&quot;
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="mt-8 p-6 text-center space-y-3 font-mono text-xs text-cyan-400 animate-pulse border border-cyan-500/20 rounded-xl bg-cyan-950/10">
          <p>Analyzing semantic request...</p>
          <p>Parsing Narrative DNA vectors across cinematic index...</p>
        </div>
      )}

      {/* Results Cards */}
      {results && results.length > 0 && (
        <div className="mt-10 space-y-6 relative z-10">
          <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold border-b border-slate-800 pb-2 flex justify-between items-center">
            <span>Algorithmic Matches Found: {results.length} Titles</span>
            <span className="text-slate-500">Sorted by Vector Alignment</span>
          </div>

          <div className="space-y-5">
            {results.map((item, idx) => (
              <div
                key={item.tmdbId}
                className="p-5 sm:p-6 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 transition-all shadow-lg flex flex-col sm:flex-row gap-5 group"
              >
                {/* Poster Thumbnail */}
                <Link
                  href={`/movie/${item.tmdbId}`}
                  className="w-24 sm:w-28 h-36 sm:h-40 rounded-xl overflow-hidden shrink-0 relative bg-slate-900 border border-slate-800 group-hover:border-cyan-500/40 transition shadow-md"
                >
                  <MoviePoster
                    src={item.posterPath ? `https://image.tmdb.org/t/p/w300${item.posterPath}` : null}
                    alt={item.title}
                    fallbackTitle={item.title}
                    fill
                    sizes="112px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                {/* Content Side */}
                <div className="flex-1 flex flex-col justify-between gap-3 min-w-0">
                  {/* Title & Match Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                        <span className="text-cyan-400 font-bold">#{idx + 1} RECOMMENDED</span>
                        <span>•</span>
                        <span>{item.year}</span>
                        <span>•</span>
                        <span>{item.runtime}</span>
                        <span>•</span>
                        <span>Dir. {item.director}</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mt-1 group-hover:text-cyan-300 transition-colors truncate">
                        <Link href={`/movie/${item.tmdbId}`}>
                          {item.title}
                        </Link>
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 font-mono shrink-0">
                      <div className="px-3 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs sm:text-sm font-bold">
                        {item.matchPercent}% Match
                      </div>
                      <div className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-amber-400 text-xs font-bold">
                        DNA {item.dnaScore}
                      </div>
                    </div>
                  </div>

                  {/* Telemetry Vector Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                    <div>
                      <span className="text-slate-500 block text-[10px]">COMPLEXITY</span>
                      <span className="text-white font-bold">{item.complexity} / 100</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">EMOTIONAL DEPTH</span>
                      <span className="text-indigo-300 font-bold">{item.emotionalIntensity} / 100</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">PACING</span>
                      <span className="text-slate-300 truncate block">{item.pacing}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">ENDING TYPE</span>
                      <span className="text-cyan-300 truncate block">{item.endingType}</span>
                    </div>
                  </div>

                  {/* Why It Matches */}
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    <strong className="text-cyan-400 font-mono text-[10px] uppercase tracking-wider block mb-0.5">
                      Why it matches:
                    </strong>
                    {item.whyItMatches}
                  </p>

                  {/* Footer Streaming & Links */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-mono border-t border-slate-800/60">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500">Stream on:</span>
                      {item.streamingOn.map((st) => (
                        <span key={st} className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[11px]">
                          {st}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/movie/${item.tmdbId}`}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    >
                      <span>View Full DNA Telemetry</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
