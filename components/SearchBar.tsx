"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Sparkles, Loader2, Star, X } from "lucide-react";
import MoviePoster from "@/components/MoviePoster";

interface AutocompleteMovie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
}

const QUICK_TAGS = [
  "Mind-Bending",
  "Slow-Burn Thrillers",
  "Under 90 Mins",
  "Emotional & Melancholic",
  "Fast-Paced Sci-Fi",
];

const MOOD_PRESETS: Record<string, string> = {
  "Mind-Bending": "with_genres=9648,878&sort_by=vote_average.desc&vote_count.gte=1000",
  "Slow-Burn Thrillers": "with_genres=53,18&sort_by=vote_average.desc&vote_count.gte=800",
  "Under 90 Mins": "with_runtime.lte=90&with_runtime.gte=60&sort_by=popularity.desc&vote_count.gte=300",
  "Emotional & Melancholic": "with_genres=18,10749&sort_by=vote_average.desc&vote_count.gte=600",
  "Fast-Paced Sci-Fi": "with_genres=878,28&sort_by=popularity.desc&vote_count.gte=500",
};

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  // Search States
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResults, setAiResults] = useState<any[]>([]);
  const [aiSearched, setAiSearched] = useState(false);
  const [activeMood, setActiveMood] = useState<string | null>(null);

  // Live Instant Autocomplete State
  const [suggestions, setSuggestions] = useState<AutocompleteMovie[]>([]);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced Live TMDB Search with strict data hygiene and character threshold
  useEffect(() => {
    const cleanQuery = query.trim();

    // ৩ অক্ষরের কম হলে এপিআই কল সম্পূর্ণ বন্ধ থাকবে
    if (!cleanQuery || cleanQuery.length < 3 || aiSearched) {
      setSuggestions([]);
      setIsDropdownOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSuggestLoading(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=b6b9f5e3a64b6ef32e0b8fade33cfe5a&query=${encodeURIComponent(
            cleanQuery
          )}`
        );
        const data = await res.json();
        if (data.results) {
          const cleanMatches = (data.results || [])
            .filter(
              (m: any) =>
                m &&
                m.poster_path &&
                m.vote_average > 0 &&
                (m.vote_count ?? 0) >= 3
            )
            .slice(0, 6);

          setSuggestions(cleanMatches);
          setIsDropdownOpen(cleanMatches.length > 0);
        }
      } catch (err) {
        console.error("Autocomplete fetch error:", err);
      } finally {
        setSuggestLoading(false);
      }
    }, 450); // ৪০০-৪৫০ms ডিবউন্স অতিরিক্ত ফেচিং সম্পূর্ণ কমিয়ে আনবে

    return () => clearTimeout(timer);
  }, [query, aiSearched]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Preset Mood Fetcher
  const handleMoodSelect = async (mood: string) => {
    setQuery(mood);
    setActiveMood(mood);
    setIsDropdownOpen(false);
    setAiLoading(true);
    setAiSearched(true);
    setAiResults([]);

    const params = MOOD_PRESETS[mood];
    if (params) {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=b6b9f5e3a64b6ef32e0b8fade33cfe5a&include_adult=false&page=1&${params}`
        );
        if (res.ok) {
          const data = await res.json();
          const cleanPreset = (data.results || []).filter(
            (m: any) => m && m.poster_path && m.vote_average > 0
          );
          setAiResults(cleanPreset.slice(0, 10));
          setAiLoading(false);
          return;
        }
      } catch (err) {
        console.error("Mood preset fetch error:", err);
      }
    }

    handleAiSearch(mood);
  };

  // Trigger Vector / Keyword Search
  const handleAiSearch = async (searchPrompt: string) => {
    if (!searchPrompt.trim()) return;
    setIsDropdownOpen(false);
    setAiLoading(true);
    setAiSearched(true);
    setAiResults([]);

    try {
      const res = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchPrompt }),
      });
      const data = await res.json();

      if (data.movies && data.movies.length > 0) {
        setAiResults(data.movies);
      } else {
        const fallbackRes = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=b6b9f5e3a64b6ef32e0b8fade33cfe5a&query=${encodeURIComponent(
            searchPrompt
          )}`
        );
        const fallbackData = await fallbackRes.json();
        const cleanFallback = (fallbackData.results || []).filter(
          (m: any) => m && m.poster_path && m.vote_average > 0
        );
        setAiResults(cleanFallback.slice(0, 10));
      }
    } catch (err) {
      console.error("Search pipeline error:", err);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center relative">
      {/* Search Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setActiveMood(null);
          handleAiSearch(query);
        }}
        className="w-full relative flex items-center shadow-2xl"
      >
        <div className="absolute left-4 text-slate-500 pointer-events-none">
          <Sparkles className="w-5 h-5 text-indigo-400" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (aiSearched) setAiSearched(false);
          }}
          onFocus={() => suggestions.length > 0 && setIsDropdownOpen(true)}
          placeholder="Search movie name, or describe mood/plot twists..."
          className="w-full bg-[#090d15] border border-white/[0.1] focus:border-indigo-500 rounded-2xl pl-12 pr-36 py-4 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
        />

        <div className="absolute right-2.5 flex items-center gap-2">
          {suggestLoading && <Loader2 className="w-4 h-4 text-indigo-400 animate-spin mr-1" />}
          <button
            type="submit"
            disabled={aiLoading || !query.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 sm:px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-indigo-600/30 disabled:opacity-40"
          >
            {aiLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span className="hidden sm:inline">Analyzing...</span>
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" />
                <span>Discover</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Smart Live Autocomplete Dropdown */}
      {isDropdownOpen && suggestions.length > 0 && (
        <div className="absolute top-[62px] left-0 right-0 bg-[#090d15] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-white/[0.05] animate-fadeIn text-left">
          <div className="px-4 py-2 bg-[#05070b]/80 border-b border-white/[0.05] flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400">
            <span>Instant Film Matches</span>
            <span className="text-indigo-400">Press Enter for Deep AI Vector Search</span>
          </div>
          {suggestions.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setIsDropdownOpen(false);
                router.push(`/movie/${item.id}`);
              }}
              className="flex items-center gap-3.5 p-3 hover:bg-white/[0.04] cursor-pointer transition duration-150 group"
            >
              <div className="w-10 aspect-[2/3] relative rounded-md overflow-hidden bg-slate-900 shrink-0 border border-white/5">
                <MoviePoster
                  src={
                    item.poster_path
                      ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                      : null
                  }
                  alt={item.title}
                  fallbackTitle={item.title}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>

              <div className="flex-grow truncate">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-indigo-400 transition truncate">
                    {item.title}
                  </h4>
                  <span className="text-[11px] font-mono text-slate-500">
                    ({item.release_date ? item.release_date.split("-")[0] : "Cinema"})
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {item.overview || "Narrative profile indexed in intelligence archive."}
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 pl-2">
                <span className="text-[9px] font-mono uppercase tracking-wider text-indigo-300 font-bold bg-indigo-500/20 px-1.5 py-0.5 rounded">
                  DNA
                </span>
                <div className="flex items-center gap-0.5 text-amber-400 text-xs font-semibold font-mono">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{item.vote_average.toFixed(1)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Discovery Tags */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
        {QUICK_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleMoodSelect(tag)}
            className={`text-[11px] font-medium px-3.5 py-1.5 rounded-xl transition cursor-pointer border ${
              activeMood === tag
                ? "bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30"
                : "bg-[#090d15] border-white/[0.08] hover:border-indigo-500/50 text-slate-400 hover:text-white"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* AI Vector Search / Mood Matches */}
      {aiSearched && (
        <div className="w-full mt-10 text-left animate-fadeIn">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/[0.08]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2 font-mono">
              <Sparkles className="w-4 h-4" />
              {activeMood ? `Curated Narrative Matches: ${activeMood}` : "Neural Vector Matches"}
            </h3>
            <button
              onClick={() => {
                setAiSearched(false);
                setAiResults([]);
                setQuery("");
                setActiveMood(null);
              }}
              className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 transition"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>

          {aiLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
              <p className="text-xs font-mono text-slate-400">Scanning cinematic vector space...</p>
            </div>
          ) : aiResults.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {aiResults.map((movie: any) => (
                <Link
                  key={movie.id}
                  href={`/movie/${movie.id}`}
                  prefetch={false} // প্রিফেচ বন্ধ করা হলো যেন অযথা সার্ভারলেস ফাংশন না চলে
                  className="group bg-[#090d15] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-indigo-500 transition flex flex-col"
                >
                  <div className="aspect-[2/3] relative w-full bg-slate-900">
                    <MoviePoster
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : null
                      }
                      alt={movie.title}
                      fallbackTitle={movie.title}
                      fill
                      sizes="(max-width: 640px) 50vw, 20vw"
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                    {movie.vote_average ? (
                      <div className="absolute top-2 right-2 bg-black/80 px-2 py-0.5 rounded-lg text-[10px] font-bold text-amber-400 border border-white/10 flex items-center gap-1">
                        <span className="text-[8px] uppercase tracking-wider text-indigo-300 font-bold bg-indigo-500/20 px-1 rounded">
                          DNA
                        </span>
                        <span>★ {movie.vote_average.toFixed(1)}</span>
                      </div>
                    ) : null}
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-bold text-slate-200 truncate group-hover:text-indigo-400 transition">
                      {movie.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-1 font-mono">
                      {movie.release_date?.split("-")[0] || "Cinema"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">
              No matching narrative vectors found. Try a different mood or premise.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
