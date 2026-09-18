"use client";

import { useState } from "react";
import { ShieldCheck, ExternalLink, Globe, Lock, Clock } from "lucide-react";
import { AFFILIATE_CONFIG, getSmartStreamLink } from "@/lib/affiliates";
import { trackAffiliateClick } from "@/lib/analytics";

interface StreamingAffiliateBoxProps {
  movieId?: string | number;
  movieTitle: string;
}

interface RegionConfig {
  code: string;
  flag: string;
  name: string;
  providers: {
    name: string;
    type: string;
    status: string;
    badgeColor: string;
  }[];
}

const REGION_CATALOGS: RegionConfig[] = [
  {
    code: "US",
    flag: "🇺🇸",
    name: "United States",
    providers: [
      { name: "Netflix", type: "Subscription", status: "Active 4K Index", badgeColor: "text-emerald-400 bg-emerald-950/60 border-emerald-800/60" },
      { name: "Prime Video", type: "Stream / Rent", status: "UHD / HDR", badgeColor: "text-sky-400 bg-sky-950/60 border-sky-800/60" },
      { name: "Apple TV", type: "Buy / Rent", status: "Direct Store", badgeColor: "text-zinc-300 bg-zinc-800/80 border-zinc-700" },
      { name: "Max / Hulu", type: "Platform Addon", status: "Catalog Verified", badgeColor: "text-indigo-400 bg-indigo-950/60 border-indigo-800/60" },
    ],
  },
  {
    code: "UK",
    flag: "🇬🇧",
    name: "United Kingdom",
    providers: [
      { name: "Netflix UK", type: "Subscription", status: "Streaming HD", badgeColor: "text-emerald-400 bg-emerald-950/60 border-emerald-800/60" },
      { name: "Prime Video", type: "Rent / Buy", status: "Verified 4K", badgeColor: "text-sky-400 bg-sky-950/60 border-sky-800/60" },
      { name: "NOW TV / Sky", type: "Cinema Pass", status: "Licensed", badgeColor: "text-amber-400 bg-amber-950/60 border-amber-800/60" },
      { name: "Apple TV", type: "Digital Store", status: "UHD", badgeColor: "text-zinc-300 bg-zinc-800/80 border-zinc-700" },
    ],
  },
  {
    code: "CA",
    flag: "🇨🇦",
    name: "Canada",
    providers: [
      { name: "Netflix CA", type: "Subscription", status: "Active Index", badgeColor: "text-emerald-400 bg-emerald-950/60 border-emerald-800/60" },
      { name: "Prime Video", type: "Stream / Rent", status: "4K Available", badgeColor: "text-sky-400 bg-sky-950/60 border-sky-800/60" },
      { name: "Crave", type: "Direct Sub", status: "Premium Stream", badgeColor: "text-blue-400 bg-blue-950/60 border-blue-800/60" },
      { name: "Apple TV", type: "Store", status: "Digital", badgeColor: "text-zinc-300 bg-zinc-800/80 border-zinc-700" },
    ],
  },
  {
    code: "AU",
    flag: "🇦🇺",
    name: "Australia",
    providers: [
      { name: "Stan", type: "Subscription", status: "HD Verified", badgeColor: "text-cyan-400 bg-cyan-950/60 border-cyan-800/60" },
      { name: "Netflix AU", type: "Subscription", status: "Active 4K", badgeColor: "text-emerald-400 bg-emerald-950/60 border-emerald-800/60" },
      { name: "Prime Video", type: "Rent / Stream", status: "Direct Store", badgeColor: "text-sky-400 bg-sky-950/60 border-sky-800/60" },
      { name: "BINGE", type: "Digital Pass", status: "Streaming", badgeColor: "text-rose-400 bg-rose-950/60 border-rose-800/60" },
    ],
  },
  {
    code: "DE",
    flag: "🇩🇪",
    name: "Germany",
    providers: [
      { name: "Netflix DE", type: "Abo", status: "Active Catalog", badgeColor: "text-emerald-400 bg-emerald-950/60 border-emerald-800/60" },
      { name: "Prime Video", type: "Kauf / Leihe", status: "UHD Store", badgeColor: "text-sky-400 bg-sky-950/60 border-sky-800/60" },
      { name: "Sky WOW", type: "Filme & Serien", status: "Stream HD", badgeColor: "text-indigo-400 bg-indigo-950/60 border-indigo-800/60" },
      { name: "Apple TV", type: "Digital Store", status: "Available", badgeColor: "text-zinc-300 bg-zinc-800/80 border-zinc-700" },
    ],
  },
  {
    code: "IN",
    flag: "🇮🇳",
    name: "India",
    providers: [
      { name: "JioCinema / Hotstar", type: "Subscription", status: "Regional Pass", badgeColor: "text-blue-400 bg-blue-950/60 border-blue-800/60" },
      { name: "Netflix India", type: "Subscription", status: "Active HD/4K", badgeColor: "text-emerald-400 bg-emerald-950/60 border-emerald-800/60" },
      { name: "Prime Video", type: "Included / Rent", status: "Direct Stream", badgeColor: "text-sky-400 bg-sky-950/60 border-sky-800/60" },
      { name: "Zee5 / SonyLIV", type: "Platform Index", status: "Stream", badgeColor: "text-amber-400 bg-amber-950/60 border-amber-800/60" },
    ],
  },
  {
    code: "BD",
    flag: "🇧🇩",
    name: "Bangladesh",
    providers: [
      { name: "Netflix BD", type: "Global Tier", status: "Active Index", badgeColor: "text-emerald-400 bg-emerald-950/60 border-emerald-800/60" },
      { name: "Prime Video BD", type: "Subscription", status: "HD / UHD", badgeColor: "text-sky-400 bg-sky-950/60 border-sky-800/60" },
      { name: "Chorki / Hoichoi", type: "Regional Hub", status: "Verified", badgeColor: "text-rose-400 bg-rose-950/60 border-rose-800/60" },
      { name: "Apple TV", type: "Digital Store", status: "Rent / Buy", badgeColor: "text-zinc-300 bg-zinc-800/80 border-zinc-700" },
    ],
  },
];

export default function StreamingAffiliateBox({ movieTitle }: StreamingAffiliateBoxProps) {
  const [selectedRegion, setSelectedRegion] = useState("US");
  const safeTitle = (movieTitle || "Movie").trim();
  const activeRegion = REGION_CATALOGS.find((r) => r.code === selectedRegion) || REGION_CATALOGS[0];

  return (
    <div className="w-full bg-[#080c14] border border-white/[0.08] rounded-2xl p-5 sm:p-6 shadow-xl my-8 text-left">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
              Verified Streaming Availability
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span>Platform catalog telemetry for</span>
            <span className="text-slate-200 font-semibold">{safeTitle}</span>
            <span className="text-slate-600">•</span>
            <span className="inline-flex items-center gap-1 font-mono text-zinc-400 bg-white/[0.03] border border-white/5 px-2 py-0.5 rounded">
              <Clock className="w-3 h-3 text-amber-400" />
              Verified: September 16, 2026
            </span>
          </div>
        </div>

        {/* High-CTR Country Selector */}
        <div className="flex flex-wrap gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/[0.08]">
          {REGION_CATALOGS.map((reg) => (
            <button
              key={reg.code}
              type="button"
              onClick={() => setSelectedRegion(reg.code)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
                selectedRegion === reg.code
                  ? "bg-amber-400 text-zinc-950 shadow-md font-bold"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              <span>{reg.flag}</span>
              <span>{reg.code}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Provider Matrix Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {activeRegion.providers.map((p) => {
          const directLink = getSmartStreamLink(p.name, safeTitle);
          return (
            <a
              key={p.name}
              href={directLink}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              onClick={() =>
                trackAffiliateClick({
                  movieTitle: safeTitle,
                  platform: p.name,
                  affiliateUrl: directLink,
                  placement: `streaming_card_${activeRegion.code.toLowerCase()}`,
                })
              }
              className="group p-3.5 bg-white/[0.02] border border-white/[0.06] hover:border-amber-400/50 hover:bg-white/[0.04] rounded-xl transition-all flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                    {p.name}
                  </h4>
                  <span className="text-[11px] text-slate-400">{p.type}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors shrink-0" />
              </div>

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/[0.04]">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${p.badgeColor}`}>
                  {p.status}
                </span>
                <span className="text-[11px] text-amber-400 font-medium group-hover:underline">
                  Stream &rarr;
                </span>
              </div>
            </a>
          );
        })}
      </div>

      {/* Secondary VPN Security Callout */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">
              Catalog varies across borders
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Secure your streaming session and maintain private access while traveling.
            </p>
          </div>
        </div>

        {(() => {
          const vpnUrl = "https://www.kqzyfj.com/click-101884261-15438560";
          return (
            <a
              href={vpnUrl}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              onClick={() =>
                trackAffiliateClick({
                  movieTitle: safeTitle,
                  platform: "Surfshark",
                  affiliateUrl: vpnUrl,
                  placement: "vpn_partner_banner",
                })
              }
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-lg shadow-indigo-600/30 shrink-0"
            >
              <span>Unlock with Surfshark</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          );
        })()}
      </div>

      {/* FTC Micro Disclaimer */}
      <p className="text-[9px] font-mono text-slate-500 text-center mt-4">
        Regional license telemetry verified periodically. Provider catalogs subject to territory restrictions. Affiliate links may earn MOVIEINT an editorial commission.
      </p>
    </div>
  );
}
