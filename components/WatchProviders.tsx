import Image from "next/image";
import { Tv } from "lucide-react";

interface Provider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

interface WatchProvidersProps {
  providers?: {
    flatrate?: Provider[];
    rent?: Provider[];
    buy?: Provider[];
  };
}

export default function WatchProviders({ providers }: WatchProvidersProps) {
  const streamList = providers?.flatrate || providers?.rent?.slice(0, 4) || [];

  if (streamList.length === 0) {
    return (
      <div className="bg-[#0a0d14] border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3">
        <Tv className="w-5 h-5 text-slate-500" />
        <span className="text-xs text-slate-400">
          Streaming status currently updating for this region.
        </span>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0d14] border border-slate-800/80 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Tv className="w-4 h-4 text-emerald-400" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Where to Stream
        </h4>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {streamList.map((item) => (
          <div
            key={item.provider_id}
            className="flex items-center gap-2 bg-[#131826] border border-slate-800 px-3 py-1.5 rounded-xl hover:border-slate-700 transition"
            title={item.provider_name}
          >
            <div className="w-5 h-5 relative rounded overflow-hidden shrink-0">
              <Image
                src={`https://image.tmdb.org/t/p/w92${item.logo_path}`}
                alt={item.provider_name}
                fill
                sizes="20px"
                className="object-cover"
              />
            </div>
            <span className="text-xs font-medium text-slate-200">
              {item.provider_name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}