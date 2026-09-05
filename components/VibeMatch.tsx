"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, Star, Loader2, Link2 } from "lucide-react";

interface VibeMovie {
  id?: number;
  title: string;
  year: string;
  coreLink: string;
  reason: string;
  poster_path?: string;
  vote_average?: number;
}

export default function VibeMatch({
  movieTitle,
  overview,
}: {
  movieTitle: string;
  overview: string;
}) {
  const [matches, setMatches] = useState<VibeMovie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchMatches() {
      try {
        const res = await fetch("/api/vibe-match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: movieTitle, overview }),
        });
        const data = await res.json();
        if (isMounted) setMatches(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchMatches();
    return () => {
      isMounted = false;
    };
  }, [movieTitle, overview]);

  if (loading) {
    return (
      <div className="bg-[#111625] border border-slate-800 rounded-3xl p-6 mb-12 flex items-center justify-center gap-3">
        <Loader2 className="w-5 h-5 text-rose-500 animate-spin" />
        <span className="text-xs font-semibold text-slate-300">
          Calculating Cinematic Vibe Affinity for "{movieTitle}"...
        </span>
      </div>
    );
  }

  if (matches.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-rose-400" />
        <h3 className="text-xl font-bold text-white tracking-tight">
          If You Loved {movieTitle}, Watch These
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {matches.map((item, idx) => (
          <div
            key={idx}
            className="bg-[#111625] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition"
          >
            <div>
              <div className="flex gap-3 mb-3">
                <div className="w-16 aspect-[2/3] relative rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-800">
                  {item.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                      alt={item.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-[9px] text-slate-600">No Img</div>
                  )}
                </div>

                <div className="truncate">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full mb-1">
                    <Link2 className="w-3 h-3" /> {item.coreLink}
                  </span>
                  <h4 className="font-bold text-sm text-white truncate">{item.title}</h4>
                  <p className="text-[11px] text-slate-500">{item.year}</p>
                  {item.vote_average ? (
                    <div className="flex items-center gap-1 text-amber-400 text-xs mt-1">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{item.vote_average.toFixed(1)}</span>
                    </div>
                  ) : null}
                </div>
              </div>

              <p className="text-xs text-slate-300 italic leading-relaxed border-t border-slate-800/80 pt-3">
                "{item.reason}"
              </p>
            </div>

            {item.id && (
              <Link
                href={`/movie/${item.id}`}
                className="mt-4 inline-flex items-center justify-between text-xs font-semibold text-rose-400 hover:text-rose-300 transition pt-2 border-t border-slate-800/60"
              >
                <span>Analyze Movie</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}