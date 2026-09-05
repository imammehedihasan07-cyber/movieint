import Link from "next/link";
import { Film, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] bg-[#05070b] text-white flex flex-col items-center justify-center text-center px-4">
      <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
        <Film className="w-6 h-6 text-rose-400" />
      </div>
      <span className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-2">
        404 // CLASSIFIED_REEL_NOT_FOUND
      </span>
      <h1 className="text-3xl sm:text-4xl font-black mb-3">
        Lost in the Cinema Void
      </h1>
      <p className="text-xs sm:text-sm text-slate-400 max-w-sm mb-6">
        The archive record or title you requested does not exist or has been retracted from current telemetry.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/30"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Return to Command Center
      </Link>
    </main>
  );
}