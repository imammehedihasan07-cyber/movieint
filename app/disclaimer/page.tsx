import { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Info, Film, ExternalLink, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "Legal & Regulatory Disclaimer | MOVIEINT",
  description:
    "Official disclosure regarding TMDB metadata attribution, algorithmic scores, affiliate partnerships, and intellectual property.",
  alternates: {
    canonical: "https://www.movieint.com/disclaimer",
  },
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-[#05070b] text-slate-100 px-4 sm:px-8 py-12 flex flex-col items-center selection:bg-indigo-600 selection:text-white relative overflow-hidden pb-24">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[400px] bg-gradient-to-b from-rose-600/10 via-indigo-950/5 to-transparent pointer-events-none -z-0" />

      <div className="max-w-4xl w-full z-10 text-left">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-white mb-8 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Discover
        </Link>

        {/* Header */}
        <div className="mb-10 pb-6 border-b border-white/[0.08]">
          <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 px-3.5 py-1 rounded-full text-rose-400 text-[10px] font-mono uppercase tracking-widest mb-4">
            <ShieldAlert className="w-3.5 h-3.5" /> Regulatory Disclosure
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
            Legal & Catalog Disclaimer
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-mono">
            Last Updated: January 2026 • Compliance Architecture v2.4
          </p>
        </div>

        {/* Content Blocks */}
        <div className="space-y-8 text-xs sm:text-sm leading-relaxed text-slate-300">
          {/* Section 1: TMDB Attribution */}
          <section className="bg-[#090d15] border border-white/[0.06] rounded-2xl p-6">
            <div className="flex items-center gap-2 text-indigo-400 font-bold mb-3 uppercase tracking-wider text-xs">
              <Film className="w-4 h-4" /> 1. Metadata Attribution & TMDB Compliance
            </div>
            <p className="mb-3 text-slate-300">
              MOVIEINT utilizes the TMDB API to provide cinematic metadata, posters, cast details, and regional catalog data. However, this product is <strong>not endorsed, certified, or sponsored by TMDB</strong>.
            </p>
            <p className="text-slate-400 text-xs">
              All film titles, promotional posters, character names, and associated media assets remain the intellectual property of their respective copyright holders, studios, and production entities.
            </p>
          </section>

          {/* Section 2: Non-Hosting of Media */}
          <section className="bg-[#090d15] border border-white/[0.06] rounded-2xl p-6">
            <div className="flex items-center gap-2 text-rose-400 font-bold mb-3 uppercase tracking-wider text-xs">
              <Scale className="w-4 h-4" /> 2. Content Indexing & Non-Hosting Notice
            </div>
            <p className="mb-3 text-slate-300">
              MOVIEINT is strictly a <strong>cinematic intelligence and discoverability platform</strong>. We do not host, store, stream, upload, or transmit any full-length video media files, pirated streams, or unauthorized broadcasts on our servers.
            </p>
            <p className="text-slate-400 text-xs">
              All video trailers displayed via interactive modals are embedded using YouTube’s official public iframe APIs conforming to YouTube Developer Terms of Service.
            </p>
          </section>

          {/* Section 3: Affiliate & Commercial Relationships */}
          <section className="bg-[#090d15] border border-white/[0.06] rounded-2xl p-6">
            <div className="flex items-center gap-2 text-amber-400 font-bold mb-3 uppercase tracking-wider text-xs">
              <ExternalLink className="w-4 h-4" /> 3. Commercial & Affiliate Disclosure
            </div>
            <p className="mb-3 text-slate-300">
              In accordance with FTC guidelines, please assume that outgoing hyperlinks leading to third-party digital subscription hubs (such as VPN utilities, streaming networks, or hardware marketplaces) may generate an affiliate commission for MOVIEINT at no additional cost to you.
            </p>
            <p className="text-slate-400 text-xs">
              These partnerships do not dictate, manipulate, or artificially skew our composite Bayesian rankings or Narrative DNA metrics.
            </p>
          </section>

          {/* Section 4: Algorithmic Metrics & AI Estimates */}
          <section className="bg-[#090d15] border border-white/[0.06] rounded-2xl p-6">
            <div className="flex items-center gap-2 text-emerald-400 font-bold mb-3 uppercase tracking-wider text-xs">
              <Info className="w-4 h-4" /> 4. Narrative DNA & Climax Potency Estimates
            </div>
            <p className="text-slate-300">
              Narrative DNA telemetry, Climax Twist potency ratings, and VibeMatch affinity correlations are synthesized through computational heuristics and neural semantic models. They are engineered as subjective discovery aids and narrative guideposts, not objective empirical truth.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
