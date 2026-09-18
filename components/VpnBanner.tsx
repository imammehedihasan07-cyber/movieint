import React from 'react';
import { ShieldCheck, ExternalLink } from 'lucide-react';

export default function VpnBanner() {
  return (
    <div className="my-6 rounded-xl border border-sky-500/20 bg-gradient-to-r from-sky-950/40 via-slate-900/60 to-cyan-950/40 p-4 sm:p-5 shadow-lg backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/20">
              <ShieldCheck className="w-3.5 h-3.5" /> Streaming Unrestricted
            </span>
          </div>
          <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Title geo-blocked or unavailable in your region?
          </h4>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Stream global movie libraries securely at high speed with ultra-fast servers and zero throttling.
          </p>
        </div>

        <a
          href="https://www.kqzyfj.com/click-101884261-15438560"
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-4 py-2.5 text-sm transition-all duration-200 shadow-md hover:shadow-sky-500/20 active:scale-95"
        >
          <span>Unlock with Surfshark</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
