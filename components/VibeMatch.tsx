"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Star, Link2, Loader2 } from "lucide-react";
import MoviePoster from "@/components/MoviePoster";

interface VibeMovie {
  id: number;
  title: string;
  year: string;
  coreLink: string;
  reason: string;
  poster_path: string | null;
  vote_average: number;
}

export default function VibeMatch({
  movieTitle,
  overview,
}: {
  movieTitle: string;
  overview: string;
}) {
  const router = useRouter();
  const [matches, setMatches] = useState<VibeMovie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDynamicVibes() {
      if (!movieTitle) return;
      setLoading(true);

      const apiKey = "b6b9f5e3a64b6ef32e0b8fade33cfe5a";

      try {
        const searchRes = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
            movieTitle
          )}`
        );
        const searchData = await searchRes.json();
        const currentMovie = searchData.results?.[0];

        if (currentMovie?.id) {
          const recRes = await fetch(
            `https://api.themoviedb.org/3/movie/${currentMovie.id}/recommendations?api_key=${apiKey}&page=1`
          );
          const recData = await recRes.json();
          let rawList = recData.results || [];

          if (rawList.length < 3) {
            const simRes = await fetch(
              `https://api.themoviedb.org/3/movie/${currentMovie.id}/similar?api_key=${apiKey}&page=1`
            );
            const simData = await simRes.json();
            rawList = [...rawList, ...(simData.results || [])];
          }

          const cleanMatches = rawList
            .filter(
              (m: any) =>
                m &&
                m.id !== currentMovie.id &&
                m.poster_path &&
                m.vote_average > 0
            )
            .slice(0, 3)
            .map((m: any) => ({
              id: m.id,
              title: m.title,
              year: m.release_date ? m.release_date.split("-")[0] : "Cinema",
              coreLink: "Narrative Tone Resonance",
              reason: m.overview
                ? m.overview.slice(0, 115) + "..."
                : "Shares coherent thematic arcs and synchronized cinematic pacing.",
              poster_path: m.poster_path,
              vote_average: m.vote_average,
            }));

          if (isMounted && cleanMatches.length > 0) {
            setMatches(cleanMatches);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("Vibe telemetry fetch error:", err);
      }

      if (isMounted) {
        setLoading(false);
      }
    }

    loadDynamicVibes();

    return () => {
      isMounted = false;
    };
  }, [movieTitle]);

  const handleNavigate = (id: number) => {
    router.push(`/movie/${id}`);
  };

  if (loading) {
    return (
      <div className="py-8 flex items-center gap-2 text-xs font-mono text-slate-500">
        <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
        <span>Synchronizing Narrative Vibe Vectors...</span>
      </div>
    );
  }

  if (matches.length === 0) return null;

  return (
    <section className="mb-14 text-left">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-rose-400" />
        <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 font-bold">
          If You Loved {movieTitle}, Watch These
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {matches.map((item) => (
          <div
            key={item.id}
            onClick={() => handleNavigate(item.id)}
            className="bg-[#090d15] border border-white/[0.06] rounded-2xl p-4 flex flex-col justify-between hover:border-indigo-500/50 hover:bg-white/[0.02] cursor-pointer transition-all duration-300 shadow-xl group select-none"
          >
            <div>
              <div className="flex gap-3 mb-3">
                <div className="w-16 aspect-[2/3] relative rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-white/5">
                  <MoviePoster
                    src={
                      item.poster_path
                        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                        : null
                    }
                    alt={item.title}
                    fallbackTitle={item.title}
                    fill
                    sizes="64px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="truncate flex-grow">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full mb-1">
                    <Link2 className="w-3 h-3" /> {item.coreLink}
                  </span>
                  <h4 className="font-bold text-sm text-white group-hover:text-indigo-400 transition-colors truncate">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-mono">{item.year}</p>
                  <div className="flex items-center gap-1 text-amber-400 text-xs mt-1 font-mono">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{item.vote_average.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 italic leading-relaxed border-t border-white/[0.04] pt-3 line-clamp-3">
                &quot;{item.reason}&quot;
              </p>
            </div>

            <div className="mt-4 inline-flex items-center justify-between text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 transition pt-2 border-t border-white/[0.04]">
              <span>Analyze Telemetry</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
