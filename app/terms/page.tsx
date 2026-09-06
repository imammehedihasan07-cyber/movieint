import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText, ShieldAlert, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service & DMCA Compliance | MOVIEINT",
  description:
    "Review MOVIEINT's terms of service, acceptable usage guidelines, copyright attribution, and DMCA takedown procedures.",
  alternates: {
    canonical: "https://www.movieint.com/terms",
  },
};

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
          <span>Legal & Compliance</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
          Terms of Service & Copyright
        </h1>
        <p className="text-xs text-slate-400 mb-8">Effective Date: January 2026</p>

        <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <section className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl">
            <h2 className="text-white font-bold text-sm uppercase tracking-wide mb-2">
              1. Platform Purpose & Scope
            </h2>
            <p>
              MOVIEINT functions exclusively as an autonomous media discovery engine and narrative analytics aggregator. We do not host, stream, distribute, or upload any copyrighted video files, torrents, or digital streams. All streaming buttons and links redirect users to legitimate third-party platforms or regional partner services.
            </p>
          </section>

          <section className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl">
            <h2 className="text-white font-bold text-sm uppercase tracking-wide mb-2">
              2. Intellectual Property & Cinematic Assets
            </h2>
            <p>
              All promotional film posters, key artwork, backdrops, character names, and core metadata displayed across MOVIEINT belong to their respective copyright owners, production studios, and distribution networks. Data and image assets are sourced via the TMDB API under compliant developer licenses.
            </p>
          </section>

          <section className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl">
            <h2 className="text-white font-bold text-sm uppercase tracking-wide mb-2">
              3. AI-Generated Narrative DNA Disclaimers
            </h2>
            <p>
              Narrative telemetry metrics (pacing, complexity scores, ending impact, and vibe tones) are computed via automated machine learning models. These evaluations represent algorithmic film critique and interpretative analysis rather than objective narrative fact.
            </p>
          </section>

          <section className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl">
            <h2 className="text-white font-bold text-sm uppercase tracking-wide mb-2">
              4. DMCA & Copyright Takedown Notice
            </h2>
            <p className="mb-3">
              MOVIEINT respects intellectual property rights and adheres to the provisions of the Digital Millennium Copyright Act (DMCA). If you are a copyright holder or an authorized agent and believe that content indexed on this platform infringes upon your copyright, you may submit a formal takedown notice.
            </p>
            <div className="flex items-center gap-3 bg-indigo-950/30 border border-indigo-500/20 p-3.5 rounded-xl">
              <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="text-xs text-slate-300">
                Designated DMCA Agent: <a href="mailto:copyright@movieint.com" className="text-indigo-400 underline hover:text-indigo-300 font-mono">copyright@movieint.com</a>
              </span>
            </div>
          </section>

          <section className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl">
            <h2 className="text-white font-bold text-sm uppercase tracking-wide mb-2">
              5. Affiliate & Commercial Disclosure
            </h2>
            <p>
              Certain external outbound links pointing to certified regional streaming providers, hardware services, or privacy networks may contain referral parameters. Qualifying purchases or subscriptions made via these links may generate affiliate compensation for MOVIEINT without imposing additional costs on the user.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
