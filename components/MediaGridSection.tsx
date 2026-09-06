"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Loader2, Plus } from "lucide-react";

interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  origin_country?: string[];
}

interface MediaGridSectionProps {
  initialItems: MediaItem[];
  type: "movie" | "tv";
  badgeLabel: string;
  badgeBg: string;
  accentColor: string;
}

export default function MediaGridSection({
  initialItems,
  type,
  badgeLabel,
  badgeBg,
  accentColor,
}: MediaGridSectionProps) {
  const [items, setItems] = useState<MediaItem[]>(initialItems);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  async function handleLoadMore() {
    setLoading(true);
    const nextPage = page + 1;
    const apiKey = "b6b9f5e3a64b6ef32e0b8fade33cfe5a";

    try {
      const endpoint =
        type === "movie"
          ? `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&page=${nextPage}`
          : `https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}&page=${nextPage}`;

      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        const newResults = data.results || [];
        if (newResults.length === 0 || nextPage >= 5) {
          setHasMore(false);
        }
        setItems((prev) => [...prev, ...newResults]);
        setPage(nextPage);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Load more fetch failed:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
        {items.map((item, idx) => {
          const itemTitle = item.title || item.name;
          const itemYear = (item.release_date || item.first_air_date || "").split("-")[0] || "Cinema";

          return (
            <Link
              key={`${item.id}-${idx}`}
              href={`/movie/${item.id}`}
              className={`group relative bg-[#090d15] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-${accentColor}-500/40 hover:shadow-2xl transition-all duration-300 flex flex-col`}
            >
              <div className="aspect-[2/3] relative w-full bg-slate-950 overflow-hidden">
                {item.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={itemTitle || "Poster"}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-slate-400">
                    No Poster
                  </div>
                )}

                <div
                  className={`absolute top-2.5 left-2.5 ${badgeBg} backdrop-blur-md border border-white/10 px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider text-white`}
                >
                  {badgeLabel}
                </div>

                <div className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded-lg flex items-center gap-1 text-[10px] font-bold text-amber-400 shadow-lg">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{item.vote_average?.toFixed(1) || "NR"}</span>
                </div>
              </div>

              <div className="p-3.5 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-200 group-hover:text-indigo-400 transition-colors duration-200 line-clamp-1">
                    {itemTitle}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] font-mono text-slate-400">{itemYear}</span>
                    {item.origin_country?.[0] && (
                      <span className="text-[9px] font-mono text-slate-400 uppercase bg-white/[0.04] px-1.5 py-0.5 rounded">
                        {item.origin_country[0]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-200 hover:bg-slate-800 hover:border-indigo-500/40 text-xs font-semibold tracking-wide transition shadow-lg disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                <span>Fetching More Titles...</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 text-indigo-400" />
                <span>Load More {badgeLabel}s</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
