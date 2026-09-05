import Link from "next/link";
import { Film, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/[0.06] bg-[#05070b] py-10 px-4 sm:px-8 mt-auto text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-rose-500" />
              <span className="font-bold text-white tracking-widest text-sm uppercase font-mono">
                MOVIEINT
              </span>
            </div>
            <p className="max-w-xs text-center md:text-left text-slate-500 text-[11px] font-mono">
              Cinematic intelligence and movie discovery powered by Gemini AI and TMDB.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-slate-400 font-medium">
            <Link href="/about" className="hover:text-white transition duration-200">
              About Us
            </Link>
            <Link href="/privacy-policy" className="hover:text-white transition duration-200">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition duration-200">
              Terms of Service
            </Link>
          </div>

          <p className="text-slate-600 text-center text-[11px] font-mono">
            © {new Date().getFullYear()} MOVIEINT. All rights reserved.
          </p>
        </div>

        {/* FTC Legal Affiliate Disclosure */}
        <div className="border-t border-white/[0.04] pt-4 flex items-center justify-center gap-2 text-[10px] text-slate-500 font-mono text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>
            Affiliate Disclosure: MOVIEINT partners with authorized streaming services and security providers. When you subscribe or rent through external links, we may earn an affiliate commission at no extra cost to you.
          </span>
        </div>
      </div>
    </footer>
  );
}