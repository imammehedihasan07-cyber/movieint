import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, EyeOff, Cookie, Mail, Megaphone } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | MOVIEINT",
  description:
    "Learn how MOVIEINT protects user privacy, utilizes local browser storage, and manages third-party advertising cookies and partner telemetry.",
  alternates: {
    canonical: "https://www.movieint.com/privacy-policy",
  },
};

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
          <span>User Privacy</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-400 mb-8">Effective Date: September 2026</p>

        <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <section className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <EyeOff className="w-4 h-4 text-rose-400" />
              <h2 className="text-white font-bold text-sm uppercase tracking-wide">
                1. Information We Do Not Collect
              </h2>
            </div>
            <p>
              MOVIEINT is committed to privacy by design. We do not require account registration to explore media indices, do not harvest personally identifiable information (PII), and do not record or monetize personal search histories.
            </p>
          </section>

          <section className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-indigo-400" />
              <h2 className="text-white font-bold text-sm uppercase tracking-wide">
                2. Client-Side Data & LocalStorage
              </h2>
            </div>
            <p>
              Features such as your personal Watchlist and interface display preferences are stored exclusively on your device via browser LocalStorage. This data never touches or persists on our backend origin servers and can be wiped entirely at any time by clearing your browser cache.
            </p>
          </section>

          <section className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Megaphone className="w-4 h-4 text-emerald-400" />
              <h2 className="text-white font-bold text-sm uppercase tracking-wide">
                3. Third-Party Advertising & DART Cookies
              </h2>
            </div>
            <p className="mb-3">
              We partner with third-party vendors, including Google, to serve advertisements on MOVIEINT. Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visit to this platform and/or other sites on the Internet.
            </p>
            <p className="text-slate-400">
              Users may opt out of personalized advertising by visiting Google Ads Settings (https://adssettings.google.com) or by accessing www.aboutads.info.
            </p>
          </section>

          <section className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Cookie className="w-4 h-4 text-amber-400" />
              <h2 className="text-white font-bold text-sm uppercase tracking-wide">
                4. Cookies & Affiliate Tracking
              </h2>
            </div>
            <p>
              MOVIEINT does not use first-party tracking cookies for user surveillance. However, outbound links to licensed streaming providers or partner services may pass anonymous referral tags or utilize third-party session cookies to validate qualifying conversions.
            </p>
          </section>

          <section className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl">
            <h2 className="text-white font-bold text-sm uppercase tracking-wide mb-2">
              5. Third-Party Integrations & APIs
            </h2>
            <p>
              Our application queries public media assets via The Movie Database (TMDB) API and Google Gemini language models to provide real-time cinema telemetry. When interacting with embedded trailers, third-party video players (such as YouTube) may process standard request metadata according to their respective privacy disclosures.
            </p>
          </section>

          <section className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-rose-400" />
              <h2 className="text-white font-bold text-sm uppercase tracking-wide">
                6. Privacy Inquiries
              </h2>
            </div>
            <p className="mb-3">
              If you have any questions or data clarification requests regarding our privacy infrastructure, contact us directly:
            </p>
            <a
              href="mailto:contact@movieint.com"
              className="text-indigo-400 hover:text-indigo-300 font-mono underline"
            >
              contact@movieint.com
            </a>
          </section>
        </div>
      </div>
    </main>
  );
}
