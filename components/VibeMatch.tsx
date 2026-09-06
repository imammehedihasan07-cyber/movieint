"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Star, Link2 } from "lucide-react";
import MoviePoster from "@/components/MoviePoster";

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

  // 1. Horror / Zombie / Viral Infection / Survival
  if (
    text.includes("zombie") ||
    text.includes("resident evil") ||
    text.includes("virus") ||
    text.includes("infection") ||
    text.includes("horror") ||
    text.includes("undead") ||
    text.includes("monster") ||
    text.includes("creature") ||
    text.includes("apocalypse")
  ) {
    return [
      {
        id: 703771,
        title: "Extinction",
        year: "2018",
        coreLink: "Bio-Viral Survival Pacing",
        reason: "Shares visceral biological threat acceleration, relentless barricade tension, and post-outbreak survival mechanics.",
        poster_path: "/2uWWyKq532b26065520977227.jpg",
        vote_average: 6.8,
      },
      {
        id: 345940,
        title: "Train to Busan",
        year: "2016",
        coreLink: "Kinetic Zombie Thrills",
        reason: "Matches high-velocity infected hordes, claustrophobic containment stakes, and emotional survival desperation.",
        poster_path: "/vVpEOvdxVBP2aV166jafnvlv1GN.jpg",
        vote_average: 7.8,
      },
      {
        id: 1091,
        title: "The Thing",
        year: "1982",
        coreLink: "Paranoid Biological Dread",
        reason: "Parallels horrific mutagenic physical transformations and intense paranoia within an isolated containment facility.",
        poster_path: "/tzGY49kseSE9QAKk47uuDGwnSCu.jpg",
        vote_average: 8.1,
      },
    ];
  }

  // 2. High-Tech Sci-Fi & Speculative Futurity
  if (
    text.includes("sci-fi") ||
    text.includes("space") ||
    text.includes("dimension") ||
    text.includes("future") ||
    text.includes("robot") ||
    text.includes("alien") ||
    text.includes("ai ")
  ) {
    return [
      {
        id: 335984,
        title: "Blade Runner 2049",
        year: "2017",
        coreLink: "Atmospheric Speculative Immersion",
        reason: "Shares deliberate speculative pacing, deep visual world-building, and existential cybernetic themes.",
        poster_path: "/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
        vote_average: 8.0,
      },
      {
        id: 329865,
        title: "Arrival",
        year: "2016",
        coreLink: "Linguistic & Temporal Architecture",
        reason: "Parallels high-concept intellectual friction and emotionally anchored speculative climax structures.",
        poster_path: "/x2OloKv2CcVeFFmfnvcBmEzRkeD.jpg",
        vote_average: 7.9,
      },
      {
        id: 264660,
        title: "Ex Machina",
        year: "2014",
        coreLink: "Claustrophobic AI Friction",
        reason: "Explores calculated technological tension and psychological manipulation between synthetics and creators.",
        poster_path: "/tlqWn7sD3vj3H7S5w0e1gYy367B.jpg",
        vote_average: 7.7,
      },
    ];
  }

  // 3. Crime / Noir / High Stakes Deception
  if (
    text.includes("crime") ||
    text.includes("mafia") ||
    text.includes("corrupt") ||
    text.includes("police") ||
    text.includes("detective") ||
    text.includes("murder")
  ) {
    return [
      {
        id: 1422,
        title: "The Departed",
        year: "2006",
        coreLink: "High-Stakes Dual Deception",
        reason: "Parallels tension-fueled cat-and-mouse friction with relentless systemic corruption.",
        poster_path: "/nT97ifL23DTIR5Q1j46QeG7yV6n.jpg",
        vote_average: 8.2,
      },
      {
        id: 146233,
        title: "Prisoners",
        year: "2013",
        coreLink: "Grim Atmospheric Endurance",
        reason: "Mirrors uncompromising moral dilemmas, investigative obsession, and layered procedural ambiguity.",
        poster_path: "/uhviyknTT67v5k9m2e9uBq4g9rP.jpg",
        vote_average: 8.1,
      },
      {
        id: 1949,
        title: "Zodiac",
        year: "2007",
        coreLink: "Procedural Forensic Obsession",
        reason: "Shares methodical investigative pacing and psychological exhaustion under unending mystery.",
        poster_path: "/6Y0pSwhZ5P10w6gUo6eG1rN1g6E.jpg",
        vote_average: 7.7,
      },
    ];
  }

  // 4. Kinetic Action / High-Octane Revenge
  if (
    text.includes("action") ||
    text.includes("assassin") ||
    text.includes("revenge") ||
    text.includes("combat") ||
    text.includes("war") ||
    text.includes("mayday")
  ) {
    return [
      {
        id: 245891,
        title: "John Wick",
        year: "2014",
        coreLink: "Relentless Kinetic Velocity",
        reason: "Balances strict spatial choreography, escalating retaliation stakes, and stylized underworld world-building.",
        poster_path: "/ziEuG1essDuWuC5lpWUaw1u72cf.jpg",
        vote_average: 7.4,
      },
      {
        id: 76341,
        title: "Mad Max: Fury Road",
        year: "2015",
        coreLink: "High-Momentum Spectacle",
        reason: "Maintains uninterrupted kinetic momentum, visceral stunt precision, and survival-driven screenplay arcs.",
        poster_path: "/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg",
        vote_average: 7.6,
      },
      {
        id: 98,
        title: "Gladiator",
        year: "2000",
        coreLink: "Epic Visceral Retaliation",
        reason: "Presents monumental tactical momentum, emotional vengeance narrative, and grand arena choreography.",
        poster_path: "/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg",
        vote_average: 8.2,
      },
    ];
  }

  // 5. Default Narrative Complexity / Psychological
  return [
    {
      id: 27205,
      title: "Inception",
      year: "2010",
      coreLink: "Layered Reality Architecture",
      reason: "Shares structured multi-tier stakes, cerebral narrative progression, and iconic rhythmic acceleration.",
      poster_path: "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
      vote_average: 8.4,
    },
    {
      id: 242582,
      title: "Nightcrawler",
      year: "2014",
      coreLink: "Uncompromising Character Study",
      reason: "Mirrors sharp modern cinematography, intense tension, and an unrelenting moral perspective.",
      poster_path: "/j9HrX8f3wAQrmOehPRUmvzz30hi.jpg",
      vote_average: 7.9,
    },
    {
      id: 11324,
      title: "Shutter Island",
      year: "2010",
      coreLink: "Psychological Deconstruction",
      reason: "Parallels persistent paranoia, ambiguous narrative clues, and an earth-shattering climax.",
      poster_path: "/4GDy0PHYX3VRXUtwK5ysagvk2Te.jpg",
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
  const [matches, setMatches] = useState<VibeMovie[]>(() =>
    computeBaselineVibe(movieTitle, overview)
  );

  useEffect(() => {
    setMatches(computeBaselineVibe(movieTitle, overview));

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
            const valid = data.filter((d: any) => d && d.title);
            if (valid.length > 0) {
              setMatches(valid);
            }
          }
        }
      } catch (err) {
        console.error("AI Vibe Match refinement error:", err);
      }
    }

    if (movieTitle) {
      fetchMatches();
    }

    return () => {
      isMounted = false;
    };
  }, [movieTitle, overview]);

  if (matches.length === 0) return null;

  return (
    <section className="mb-14 text-left">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-rose-400" />
        <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 font-bold">
          If You Loved {movieTitle}, Watch These
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {matches.map((item, idx) => (
          <div
            key={idx}
            className="bg-[#090d15] border border-white/[0.06] rounded-2xl p-4 flex flex-col justify-between hover:border-indigo-500/40 transition duration-300 shadow-xl"
          >
            <div>
              <div className="flex gap-3 mb-3">
                <div className="w-16 aspect-[2/3] relative rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-white/5">
                  <MoviePoster
                    src={
                      item.poster_path
                        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                        : null
                    }
                    alt={item.title}
                    fallbackTitle={item.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>

                <div className="truncate flex-grow">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full mb-1">
                    <Link2 className="w-3 h-3" /> {item.coreLink}
                  </span>
                  <h4 className="font-bold text-sm text-white truncate">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 font-mono">{item.year}</p>
                  {item.vote_average ? (
                    <div className="flex items-center gap-1 text-amber-400 text-xs mt-1 font-mono">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{item.vote_average.toFixed(1)}</span>
                    </div>
                  ) : null}
                </div>
              </div>

              <p className="text-xs text-slate-300 italic leading-relaxed border-t border-white/[0.04] pt-3">
                &quot;{item.reason}&quot;
              </p>
            </div>

            {item.id ? (
              <Link
                href={`/movie/${item.id}`}
                className="mt-4 inline-flex items-center justify-between text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition pt-2 border-t border-white/[0.04]"
              >
                <span>Analyze Telemetry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
