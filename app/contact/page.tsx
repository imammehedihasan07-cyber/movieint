import type { Metadata } from "next";
import { Mail, MessageSquare, ShieldAlert, Sparkles, Send } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | MOVIEINT",
  description:
    "Get in touch with MOVIEINT for film telemetry feedback, algorithmic corrections, advertising partnerships, or support.",
};

export default function ContactPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-16 sm:py-24">
      {/* Header */}
      <div className="text-center space-y-3 mb-14">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5" /> Direct Communications
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Connect with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-amber-300">MOVIEINT</span>
        </h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
          Reach our editorial, technical, and intelligence indexing teams for inquiries, sponsored showcases, or data discrepancies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Support Card */}
        <div className="rounded-2xl bg-[#0b0f19] border border-white/5 p-6 flex flex-col items-start gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-bold text-base mb-1">General Inquiries</h3>
            <p className="text-slate-400 text-xs leading-relaxed mb-3">
              Questions regarding our platform, narrative DNA vectors, or search capabilities.
            </p>
            <a
              href="mailto:contact@movieint.com"
              className="text-xs font-mono text-amber-400 hover:underline"
            >
              contact@movieint.com
            </a>
          </div>
        </div>

        {/* Sponsor Card */}
        <div className="rounded-2xl bg-[#0b0f19] border border-white/5 p-6 flex flex-col items-start gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-bold text-base mb-1">Affiliate & Sponsors</h3>
            <p className="text-slate-400 text-xs leading-relaxed mb-3">
              Featured placement inquiries, streaming distribution licensing, and partner banners.
            </p>
            <a
              href="mailto:partners@movieint.com"
              className="text-xs font-mono text-amber-400 hover:underline"
            >
              partners@movieint.com
            </a>
          </div>
        </div>

        {/* Data / DMCA Card */}
        <div className="rounded-2xl bg-[#0b0f19] border border-white/5 p-6 flex flex-col items-start gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-bold text-base mb-1">Data & Legal</h3>
            <p className="text-slate-400 text-xs leading-relaxed mb-3">
              Metadata corrections, TMDB sync discrepancies, copyright requests, or policy questions.
            </p>
            <a
              href="mailto:legal@movieint.com"
              className="text-xs font-mono text-emerald-400 hover:underline"
            >
              legal@movieint.com
            </a>
          </div>
        </div>
      </div>

      {/* Response SLA Box */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-950/20 via-slate-900/40 to-amber-950/20 border border-white/10 p-6 text-center">
        <p className="text-xs text-slate-400 leading-relaxed font-mono">
          Average response latency for platform telemetry and commercial inquiries: <span className="text-amber-400 font-bold">24–48 hours</span>.
        </p>
      </div>
    </div>
  );
}
