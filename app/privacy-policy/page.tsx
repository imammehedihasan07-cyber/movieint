import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#05070b] text-slate-100 px-4 py-16 flex flex-col items-center">
      <div className="max-w-3xl w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-200 mb-8 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Discover
        </Link>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono uppercase mb-4">
          <Shield className="w-3.5 h-3.5 text-rose-400" />
          <span>Legal Archival</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white mb-6">
          Privacy Policy
        </h1>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            Last Updated: 2026. MOVIEINT respects user privacy. We do not collect private personal data without consent, sell identity telemetry, or run intrusive client-side background scrapers.
          </p>
          <h2 className="text-white font-bold text-sm uppercase pt-4">Data Telemetry & Storage</h2>
          <p>
            Your watchlists and custom preferences are preserved inside your local client browser storage (LocalStorage). We do not record passwords or store sensitive financial tokens on our origin servers.
          </p>
          <h2 className="text-white font-bold text-sm uppercase pt-4">Third-Party Data</h2>
          <p>
            Cinema data is ingested via TMDB API. We participate in verified streaming and utility affiliate networks that may deploy standard session cookies to verify qualifying subscriptions.
          </p>
        </div>
      </div>
    </main>
  );
}