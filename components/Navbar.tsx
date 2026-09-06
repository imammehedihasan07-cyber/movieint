"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  Dna,
  Flame,
  Bookmark,
  Armchair,
  Swords,
  Dices,
  Menu,
  X,
  Search,
  Loader2,
  Star,
  Film,
} from "lucide-react";
import MoviePoster from "@/components/MoviePoster";

interface SearchMovieItem {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchMovieItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Instant Debounced TMDB Live Search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      setIsDropdownOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=b6b9f5e3a64b6ef32e0b8fade33cfe5a&query=${encodeURIComponent(
            searchQuery
          )}`
        );
        const data = await res.json();
        if (data.results) {
          setSearchResults(data.results.slice(0, 5));
          setIsDropdownOpen(true);
        }
      } catch (err) {
        console.error("Search fetch error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click Outside to Dismiss Search Dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectMovie = (id: number) => {
    setIsDropdownOpen(false);
    setSearchQuery("");
    setMobileMenuOpen(false);
    router.push(`/movie/${id}`);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#05070b]/90 backdrop-blur-2xl border-b border-white/[0.06] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3.5 group shrink-0">
          <div className="relative flex items-center justify-center">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/30 to-rose-500/20 rounded-2xl blur-md opacity-40 group-hover:opacity-100 transition duration-500" />
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-b from-[#161c28] to-[#0a0d14] border border-white/10 shadow-2xl flex items-center justify-center overflow-hidden">
              <span className="font-black text-sm text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-400 font-mono tracking-tighter">
                M
              </span>
              <div className="absolute bottom-1 w-2.5 h-[1.5px] bg-indigo-500 rounded-full group-hover:w-4 transition-all duration-300" />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-[0.22em] text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300 font-sans uppercase">
                Movieint
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shadow-sm shadow-rose-500" />
            </div>
            <div className="flex items-center gap-1.5 -mt-0.5">
              <span className="text-[9px] font-mono tracking-[0.25em] text-slate-400 uppercase font-medium">
                Neural Film Archival
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Global Search Bar */}
        <div ref={searchContainerRef} className="relative hidden lg:block w-64 xl:w-72">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchResults.length > 0 && setIsDropdownOpen(true)}
              placeholder="Search cinematic index..."
              className="w-full bg-[#090d15] border border-white/[0.08] focus:border-indigo-500/60 rounded-xl pl-9 pr-8 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none transition duration-200"
            />
            {isSearching && (
              <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin absolute right-3" />
            )}
          </div>

          {/* Desktop Search Live Dropdown */}
          {isDropdownOpen && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#090d15] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-white/[0.05] animate-fadeIn">
              {searchResults.map((m) => (
                <div
                  key={m.id}
                  onClick={() => handleSelectMovie(m.id)}
                  className="flex items-center gap-3 p-2.5 hover:bg-white/[0.05] cursor-pointer transition text-left group"
                >
                  <div className="w-8 h-11 relative bg-slate-900 rounded-lg overflow-hidden shrink-0 border border-white/5">
                    {m.poster_path ? (
                      <MoviePoster
                        src={`https://image.tmdb.org/t/p/w92${m.poster_path}`}
                        alt={m.title}
                        fallbackTitle={m.title}
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-700">
                        <Film className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow truncate">
                    <h4 className="font-bold text-xs text-white group-hover:text-indigo-400 transition truncate">
                      {m.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-0.5">
                      <span>{m.release_date?.split("-")[0] || "TBA"}</span>
                      {m.vote_average ? (
                        <span className="flex items-center gap-0.5 text-amber-400">
                          <Star className="w-2.5 h-2.5 fill-amber-400" />
                          {m.vote_average.toFixed(1)}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Navigation Actions */}
        <div className="hidden xl:flex items-center gap-1.5 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.04] transition duration-200"
          >
            <Compass className="w-3.5 h-3.5 text-slate-400" />
            <span>Discover</span>
          </Link>

          <Link
            href="/couch-mode"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 transition duration-300"
          >
            <Armchair className="w-3.5 h-3.5 text-indigo-400" />
            <span>Couch</span>
          </Link>

          <Link
            href="/roulette"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition duration-200"
          >
            <Dices className="w-3.5 h-3.5 text-amber-400" />
            <span>Roulette</span>
          </Link>

          <Link
            href="/vs"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 transition duration-200"
          >
            <Swords className="w-3.5 h-3.5 text-rose-400" />
            <span>Vs</span>
          </Link>

          <Link
            href="/dna"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.04] transition duration-200"
          >
            <Dna className="w-3.5 h-3.5 text-slate-400" />
            <span>DNA</span>
          </Link>

          <Link
            href="/rankings"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.04] transition duration-200"
          >
            <Flame className="w-3.5 h-3.5 text-slate-400" />
            <span>Rankings</span>
          </Link>

          <Link
            href="/watchlist"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.04] transition duration-200"
          >
            <Bookmark className="w-3.5 h-3.5 text-slate-400" />
            <span>Watchlist</span>
          </Link>
        </div>

        {/* Mobile & Tablet Hamburger Toggle */}
        <div className="flex xl:hidden items-center gap-2">
          <Link
            href="/couch-mode"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/30"
          >
            <Armchair className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Couch</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-rose-400" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-white/[0.08] bg-[#070b13]/95 backdrop-blur-2xl px-4 py-4 space-y-3 shadow-2xl">
          {/* Mobile Instant Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies..."
              className="w-full bg-[#090d15] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none"
            />
            {searchResults.length > 0 && (
              <div className="mt-2 bg-[#0c101a] border border-white/10 rounded-xl divide-y divide-white/5 overflow-hidden">
                {searchResults.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => handleSelectMovie(m.id)}
                    className="flex items-center gap-2.5 p-2 text-xs text-white"
                  >
                    <span className="truncate flex-1 font-bold">{m.title}</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {m.release_date?.split("-")[0] || "TBA"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1 pt-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:bg-white/[0.05] transition"
            >
              <Compass className="w-4 h-4 text-slate-400" />
              <span>Discover</span>
            </Link>

            <Link
              href="/couch-mode"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 transition"
            >
              <Armchair className="w-4 h-4 text-indigo-400" />
              <span>Couch Mode</span>
            </Link>

            <Link
              href="/roulette"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 transition"
            >
              <Dices className="w-4 h-4 text-amber-400" />
              <span>Roulette</span>
            </Link>

            <Link
              href="/vs"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-300 bg-rose-500/10 border border-rose-500/20 transition"
            >
              <Swords className="w-4 h-4 text-rose-400" />
              <span>Vs Mode</span>
            </Link>

            <Link
              href="/dna"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:bg-white/[0.05] transition"
            >
              <Dna className="w-4 h-4 text-slate-400" />
              <span>Movie DNA</span>
            </Link>

            <Link
              href="/rankings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:bg-white/[0.05] transition"
            >
              <Flame className="w-4 h-4 text-slate-400" />
              <span>Rankings</span>
            </Link>

            <Link
              href="/watchlist"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:bg-white/[0.05] transition"
            >
              <Bookmark className="w-4 h-4 text-slate-400" />
              <span>Watchlist</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
