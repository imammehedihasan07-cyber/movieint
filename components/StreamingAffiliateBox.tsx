import { ShieldCheck, ExternalLink, Globe, Lock } from "lucide-react";
import { AFFILIATE_CONFIG, getSmartStreamLink } from "@/lib/affiliates";

interface StreamingAffiliateBoxProps {
  movieTitle: string;
}

export default function StreamingAffiliateBox({ movieTitle }: StreamingAffiliateBoxProps) {
  const providers = [
    { name: "Netflix", type: "Subscription", status: "Active Telemetry" },
    { name: "Prime Video", type: "Stream / Rent", status: "4K UHD" },
    { name: "Apple TV", type: "Buy / Rent", status: "Dolby Atmos" },
  ];

  return (
    <div className="w-full bg-[#080c14] border border-white/[0.08] rounded-2xl p-5 sm:p-6 shadow-xl my-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
              Official Legal Streaming Telemetry
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-normal">
            Direct authenticated distribution for <span className="text-slate-200 font-semibold">{movieTitle}</span>.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 self-start sm:self-auto text-[10px] font-mono uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full">
          <ShieldCheck className="w-3 h-3" /> DRM Verified
        </span>
      </div>

      {/* Official Streaming Providers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {providers.map((item) => (
          <a
            key={item.name}
            href={getSmartStreamLink(item.name, movieTitle)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:border-indigo-500/40 hover:bg-white/[0.06] transition duration-200 group"
          >
            <div>
              <div className="text-xs font-bold text-slate-200 group-hover:text-indigo-300 transition">
                {item.name}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                {item.type} • {item.status}
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition" />
          </a>
        ))}
      </div>

      {/* VPN High-Margin Referral Fallback */}
      <div className="rounded-xl bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900/40 border border-indigo-500/20 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">
              Geo-restricted in your region?
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Switch regions securely with ultra-fast stream encryption.
            </p>
          </div>
        </div>

        <a
          href={AFFILIATE_CONFIG.NORD_VPN}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-lg shadow-indigo-600/30 shrink-0"
        >
          <span>Unlock with NordVPN</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* FTC Micro Disclaimer */}
      <p className="text-[9px] font-mono text-slate-600 text-center mt-3">
        Affiliate links may provide commission to MOVIEINT upon qualifying subscription at no additional cost.
      </p>
    </div>
  );
}