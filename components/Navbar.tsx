"use client";

import Link from "next/link";
import {
  Compass,
  Dna,
  Flame,
  Bookmark,
  Armchair,
  Swords,
  Dices,
} from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-[#05070b]/90 backdrop-blur-2xl border-b border-white/[0.06] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3.5 group">
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

        {/* Navigation Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.04] transition duration-200"
          >
            <Compass className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Discover</span>
          </Link>

          <Link
            href="/couch-mode"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-indigo-300 bg-gradient-to-r from-indigo-500/10 via-indigo-600/15 to-purple-500/10 border border-indigo-500/30 hover:border-indigo-400/50 hover:bg-indigo-500/20 transition duration-300 shadow-lg shadow-indigo-950/30"
          >
            <Armchair className="w-3.5 h-3.5 text-indigo-400" />
            <span>Couch Mode</span>
          </Link>

          <Link
            href="/roulette"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition duration-200"
          >
            <Dices className="w-3.5 h-3.5 text-amber-400" />
            <span>Roulette</span>
          </Link>

          <Link
            href="/compare"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 transition duration-200"
          >
            <Swords className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Vs Mode</span>
          </Link>

          <Link
            href="/dna"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.04] transition duration-200"
          >
            <Dna className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Movie DNA</span>
          </Link>

          <Link
            href="/rankings"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.04] transition duration-200"
          >
            <Flame className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Rankings</span>
          </Link>

          <Link
            href="/watchlist"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.04] transition duration-200"
          >
            <Bookmark className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Watchlist</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}