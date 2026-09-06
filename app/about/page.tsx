import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles, Dna, ShieldCheck, Database, Sliders, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "About MOVIEINT — Cinema Intelligence & Narrative Telemetry",
  description:
    "Learn about MOVIEINT's editorial methodology, AI-driven narrative DNA scoring, TMDB integration, and cinema intelligence architecture.",
  alternates: {
    canonical: "https://www.movieint.com/about",
  },
};

export default function AboutPage() {
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
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Platform Mission</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">
          Cinematic Intelligence & Narrative Telemetry
        </h1>

        <div className="space-y-6 text-sm text-slate-300 leading-relaxed font-normal">
          <p>
            MOVIEINT is an autonomous media discovery engine and cinema intelligence platform engineered to eliminate choice paralysis, evaluate structural climax twists, and decode narrative DNA without spoiling crucial plot trajectories.
          </p>

          <p>
            Traditional streaming aggregators rely solely on high-level genres and star ratings. MOVIEINT decomposes storytelling into narrative dimensions—evaluating psychological pacing, intellectual complexity, and genuine emotional resonance across Hollywood productions, K-dramas, anime, and world cinema.
          </p>

          {/* Key Intelligence Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
            <div className="p-4 rounded-2xl bg-[#090d15] border border-white/[0.06]">
              <Dna className="w-5 h-5 text-indigo-400 mb-2" />
              <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-1">
                Narrative DNA
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Multi-dimensional breakdown of pacing, atmospheric depth, twist potency, and thematic complexity.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#090d15] border border-white/[0.06]">
              <ShieldCheck className="w-5 h-5 text-emerald-400 mb-2" />
              <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-1">
                Spoiler-Free Metrics
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Safe climax indices and mood matching allowing viewers to gauge emotional payoff without spoilers.
              </p>
            </div>
          </div>

          {/* Editorial & Data Methodology Section */}
          <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 my-8 space-y-4">
            <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-400" />
              Data Integrity & Scoring Methodology
            </h2>
            
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                <strong className="text-white">Catalog & Cast Data:</strong> Filmography, metadata, and high-resolution posters are queried and updated dynamically through The Movie Database (TMDB) developer API.
              </p>
              <p>
                <strong className="text-white">Streaming Catalog Availability:</strong> Platform availability indices are verified cross-regionally via digital distributor registries to inform users where titles can be legally streamed, rented, or purchased.
              </p>
              <p>
                <strong className="text-white">AI Neural Scoring:</strong> Narrative assessments, climax twist potencies, and vibe matches are derived using Google Gemini LLMs fine-tuned on structural screenwriting theory and thematic cinematic patterns.
              </p>
            </div>
          </section>

          {/* Contact & Inquiries */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#090d15] border border-white/[0.06]">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Inquiries & Data Discrepancies
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Have a metadata correction, partnership request, or feature suggestion?
              </p>
            </div>
            <a
              href="mailto:contact@movieint.com"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shrink-0"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>contact@movieint.com</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
