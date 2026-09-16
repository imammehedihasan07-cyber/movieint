import Link from 'next/link';
import { Compass, Film, Home, Sparkles, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 py-16 bg-[#07090e] text-slate-100">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-400 font-mono text-xs uppercase tracking-widest mb-4">
        <span>404 Telemetry Error</span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
        Movie Dossier Not Found
      </h1>

      <p className="text-slate-400 max-w-md text-sm sm:text-base leading-relaxed mb-8">
        The requested cinema telemetry, narrative analysis, or ID parameter could not be located in our active index.
      </p>

      {/* Primary Action Links */}
      <div className="flex flex-wrap gap-3 justify-center mb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 text-zinc-950 text-sm font-semibold hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/10"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <Link
          href="/advisor"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-slate-200 text-sm font-medium hover:bg-white/[0.08] transition-colors"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>AI Film Advisor</span>
        </Link>
        <Link
          href="/rankings"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-slate-200 text-sm font-medium hover:bg-white/[0.08] transition-colors"
        >
          <Film className="w-4 h-4 text-rose-400" />
          <span>Cinema Rankings</span>
        </Link>
      </div>

      {/* Suggested Discovery Hubs */}
      <div className="w-full max-w-xl border-t border-white/[0.06] pt-8">
        <span className="text-xs uppercase tracking-wider text-slate-500 font-mono block mb-4">
          Or explore curated narrative clusters
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          <Link
            href="/mood/mind-bending"
            className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] transition-colors flex items-center justify-between group"
          >
            <span className="text-xs font-medium text-slate-300 group-hover:text-amber-400">
              Mind-Bending Films
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/couch-mode"
            className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] transition-colors flex items-center justify-between group"
          >
            <span className="text-xs font-medium text-slate-300 group-hover:text-amber-400">
              Couch Mode Discovery
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
