import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#05070b] text-slate-100 px-4 py-16 flex flex-col items-center">
      <div className="max-w-3xl w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-200 mb-8 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Discover
        </Link>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono uppercase mb-4">
          <FileText className="w-3.5 h-3.5 text-indigo-400" />
          <span>Terms of Use</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white mb-6">
          Terms of Service
        </h1>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            Welcome to MOVIEINT. By exploring, querying, or interacting with our narrative intelligence indices, you agree to comply with standard acceptable use standards.
          </p>
          <h2 className="text-white font-bold text-sm uppercase pt-4">Intellectual & Cinematic Assets</h2>
          <p>
            All media posters, backdrops, and promotional film metadata are property of their respective copyright holders, studios, and streaming distribution platforms. MOVIEINT acts as an algorithmic aggregator and narrative discovery index.
          </p>
          <h2 className="text-white font-bold text-sm uppercase pt-4">AI Disclaimers</h2>
          <p>
            Narrative DNA indices and spoiler vaults are synthesized algorithmically. While engineered for precision, analysis should be treated as interpretative cinema critique.
          </p>
        </div>
      </div>
    </main>
  );
}