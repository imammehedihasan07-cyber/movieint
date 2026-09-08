import Link from "next/link";
import Image from "next/image";
import { Sparkles, ExternalLink, ShieldCheck } from "lucide-react";

export default function SponsoredSpotlight() {
  const partner = {
    title: "Challengers",
    tagline: "High-voltage psychological tension on and off the court.",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=160&q=70&fm=webp",
    streamPlatform: "Prime Video",
    streamUrl: "https://www.amazon.com/gp/video/storefront",
    year: "2024",
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mb-14">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0d121f] via-[#090d15] to-[#120a16] border border-amber-500/20 p-5 sm:p-7 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 blur-3xl pointer-events-none -z-0" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 z-10 relative">
          {/* Left: Poster & Title Details */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="relative w-20 sm:w-24 aspect-[2/3] rounded-2xl overflow-hidden bg-[#0a0f1d] border border-white/10 shrink-0 shadow-lg flex items-center justify-center">
              <Image
                src={partner.image}
                alt={partner.title}
                fill
                priority
                sizes="(max-width: 640px) 80px, 96px"
                className="object-cover"
              />
            </div>

            <div>
              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono uppercase font-bold tracking-wider">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Sponsored Showcase
                </span>
                <span className="inline-flex items-center gap-1 text-slate-400 text-[11px] font-mono bg-white/[0.04] border border-white/5 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> Licensed Stream
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {partner.title}{" "}
                <span className="text-slate-500 text-sm font-normal">
                  ({partner.year})
                </span>
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1 leading-relaxed">
                {partner.tagline}
              </p>
            </div>
          </div>

          {/* Right: CTA & Sponsor Link */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-center sm:items-center lg:items-end gap-3 shrink-0 w-full sm:w-auto">
            <a
              href={partner.streamUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs px-6 py-3.5 rounded-xl transition duration-200 shadow-xl shadow-amber-950/40"
            >
              <span>Watch on {partner.streamPlatform}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <Link
              href="/about"
              className="text-[11px] text-slate-400 hover:text-amber-300 font-mono transition underline underline-offset-4"
            >
              Sponsor a Title?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
