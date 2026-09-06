"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, Star, Link2 } from "lucide-react";

interface VibeMovie {
  id?: number;
  title: string;
  year: string;
  coreLink: string;
  reason: string;
  poster_path?: string;
  vote_average?: number;
}

function computeBaselineVibe(title: string, overview: string = ""): VibeMovie[] {
  const text = (title + " " + overview).toLowerCase();

  if (text.includes("sci-fi") || text.includes("space") || text.includes("dimension") || text.includes("future")) {
    return [
      {
        title: "Blade Runner 2049",
        year: "2017",
        coreLink: "Atmospheric World-Building",
        reason: "Shares deliberate speculative pacing, deep visual immersion, and existential philosophical themes.",
        vote_average: 8.0,
      },
      {
        title: "Arrival",
        year: "2016",
        coreLink: "Linguistic & Temporal Structure",
        reason: "Parallels the high-concept intellectual dilemmas and emotionally anchored sci-fi climax.",
        vote_average: 7.9,
      },
      {
        title: "Ex Machina",
        year: "2014",
        coreLink: "Psychological Friction",
        reason: "Explores claustrophobic narrative tension and cerebral mind-games between calculated characters.",
        vote_average: 7.7,
      },
    ];
  }

  if (text.includes("crime") || text.includes("mafia") || text.includes("corrupt") || text.includes("police")) {
    return [
      {
        title: "The Departed",
        year: "2006",
        coreLink: "High-Stakes Deception",
        reason: "Parallels tension-fueled cat-and-mouse friction with calculated structural momentum.",
        vote_average: 8.2,
      },
      {
        title: "Prisoners",
        year: "2013",
        coreLink: "Grim Atmospheric Dread",
        reason: "Mirrors unrelenting moral dilemmas and layered investigative ambiguity.",
        vote_average: 8.1,
      },
      {
        title: "Zodiac",
        year: "2007",
        coreLink: "Methodical Obsession",
        reason: "Shares forensic narrative depth, procedural precision, and psychological endurance.",
        vote_average: 7.7,
      },
    ];
  }

  return [
    {
      title: "Inception",
      year: "2010",
      coreLink: "Layered Reality Architecture",
      reason: "Shares structured multi-tier stakes, cerebral narrative progression, and iconic rhythmic acceleration.",
      vote_average: 8.4,
    },
    {
      title: "Nightcrawler",
      year: "2014",
      coreLink: "Uncompromising Character Focus",
      reason: "Mirrors sharp modern cinematography, intense tension, and an unrelenting moral perspective.",
      vote_average: 7.9,
    },
    {
      title: "Shutter Island",
      year: "2010",
      coreLink: "Psychological Revelation",
      reason: "Parallels persistent paranoia, ambiguous narrative clues, and a piercing climax.",
      vote_average: 8.2,
    },
  ];
}

export default function VibeMatch({
  movieTitle,
  overview,
}: {
  movieTitle: string;
  overview: string;
}) {
  const [matches, setMatches] = useState<VibeMovie[]>(() => computeBaselineVibe(movieTitle, overview));

  useEffect(() => {
    let isMounted = true;
    async function fetchMatches() {
      try {
        const res = await fetch("/api/vibe-match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: movieTitle, overview }),
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data) && data.length > 0) {
            setMatches(data);
          }
        }
      } catch (err) {
        console.error("AI Vibe Match refinement error:", err);
      }
    }

    if (movieTitle && overview) {
      fetchMatches();
    }

    return () => {
      isMounted = false;
    };
  }, [movieTitle, overview]);

  if (matches.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-rose-400" />
        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
          If You Loved {movieTitle}, Watch These
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {matches.map((item, idx) => (
          <div
            key={idx}
            className="bg-[#090d15] border border-white/[0.06] rounded-2xl p-4 flex flex-col justify-between hover:border-indigo-500/40 transition duration-200"
          >
            <div>
              <div className="flex gap-3 mb-3">
                <div className="w-16 aspect-[2/3] relative rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-white/5">
                  {item.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                      alt={item.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-[9px] text-slate-600">Cinematic Twin</div>
                  )}
                </div>

                <div className="truncate flex-grow">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full mb-1">
                    <Link2 className="w-3 h-3" /> {item.coreLink}
                  </span>
                  <h4 className="font-bold text-sm text-white truncate">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 font-mono">{item.year}</p>
                  {item.vote_average ? (
                    <div className="flex items-center gap-1 text-amber-400 text-xs mt-1">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{item.vote_average.toFixed(1)}</span>
                    </div>
                  ) : null}
                </div>
              </div>

              <p className="text-xs text-slate-300 italic leading-relaxed border-t border-white/[0.04] pt-3">
                "{item.reason}"
              </p>
            </div>

            {item.id && (
              <Link
                href={`/movie/${item.id}`}
                className="mt-4 inline-flex items-center justify-between text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition pt-2 border-t border-white/[0.04]"
              >
                <span>Analyze Telemetry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
