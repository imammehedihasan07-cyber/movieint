import Image from "next/image";
import { Tv, ExternalLink } from "lucide-react";

interface Provider {
  provider_id: number;
  provider_name: string;
  logo_path?: string | null;
}

interface WatchProvidersProps {
  providers?: {
    flatrate?: Provider[];
    rent?: Provider[];
    buy?: Provider[];
  };
}

export default function WatchProviders({ providers }: WatchProvidersProps) {
  // Aggregate all unique active providers without duplicates
  const rawList = [
    ...(providers?.flatrate || []),
    ...(providers?.rent || []),
    ...(providers?.buy || []),
  ];

  const seenIds = new Set<number>();
  const streamList = rawList
    .filter((item) => {
      if (!item || !item.provider_id || seenIds.has(item.provider_id)) {
        return false;
      }
      seenIds.add(item.provider_id);
      return true;
    })
    .slice(0, 6);

  if (streamList.length === 0) {
    return (
      <div className="bg-[#0a0d14] border border-white/[0.06] rounded-2xl p-4 flex items-center gap-3">
        <Tv className="w-5 h-5 text-slate-500 shrink-0" />
        <span className="text-xs text-slate-400 font-mono">
          Streaming status currently updating for this region.
        </span>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0d14] border border-white/[0.08] rounded-2xl p-4 text-left">
      <div className="flex items-center gap-2 mb-3">
        <Tv className="w-4 h-4 text-emerald-400" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
          Where to Stream
        </h4>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {streamList.map((item) => (
          <div
            key={item.provider_id}
            className="flex items-center gap-2 bg-[#131826] border border-white/[0.08] px-3 py-1.5 rounded-xl hover:border-emerald-500/40 transition duration-200"
            title={item.provider_name}
          >
            <div className="w-5 h-5 relative rounded overflow-hidden shrink-0 bg-slate-900 border border-white/5">
              {item.logo_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w92${item.logo_path}`}
                  alt={item.provider_name}
                  fill
                  sizes="20px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[8px] text-slate-500 font-bold">
                  {item.provider_name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <span className="text-xs font-medium text-slate-200 truncate max-w-[120px]">
              {item.provider_name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
