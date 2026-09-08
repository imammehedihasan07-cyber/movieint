import Link from "next/link";
import { Film, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/[0.06] bg-[#05070b] py-10 px-4 sm:px-8 mt-auto text-slate-400 text-xs min-h-[220px] [contain:layout_style]">
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
            <Link href="/contact" className="hover:text-white transition duration-200">
              Contact Us
            </Link>
            <Link href="/privacy-policy" className="hover:text-white transition duration-200">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition duration-200">
              Terms of Service
            </Link>
            <Link href="/disclaimer" className="hover:text-white transition duration-200">
              Disclaimer
            </Link>
          </div>

          <p className="text-slate-600 text-center text-[11px] font-mono">
            © {new Date().getFullYear()} MOVIEINT. All rights reserved.
          </p>
        </div>

        {/* Amazon & General Affiliate Legal Disclosure */}
        <div className="border-t border-white/[0.04] pt-5 flex flex-col items-center gap-2.5 text-[10.5px] leading-relaxed text-slate-500 font-mono text-center">
          <div className="flex items-center justify-center gap-1.5 text-slate-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Affiliate & Compliance Notice</span>
          </div>
          <p className="max-w-4xl">
            MOVIEINT is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. We also partner with authorized streaming and VPN providers. When you click, rent, or subscribe through outbound links, we may earn an affiliate commission at zero additional cost to you.
          </p>
        </div>
      </div>
    </footer>
  );
}
