import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, Film, Sparkles, Award, UserCheck } from "lucide-react";

interface PersonPageProps {
  params: Promise<{ id: string }>;
}

async function getPersonDetails(id: string) {
  const apiKey = process.env.TMDB_API_KEY;

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/person/${id}?api_key=${apiKey}&append_to_response=movie_credits`,
      { next: { revalidate: 86400 } }
    );

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch person details:", error);
    return null;
  }
}

export async function generateMetadata({ params }: PersonPageProps): Promise<Metadata> {
  const { id } = await params;
  const person = await getPersonDetails(id);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.movieint.com";

  if (!person) {
    return {
      title: "Cinema Contributor Archive | MOVIEINT",
      description: "Filmography and narrative profile for notable cinema creators.",
    };
  }

  const role = person.known_for_department === "Directing" ? "Director" : "Actor";
  const canonicalUrl = `${baseUrl}/person/${id}`;

  return {
    title: `${person.name} (${role}) — Filmography & Telemetry | MOVIEINT`,
    description: `Explore the cinematic profile, essential films, and narrative impact of ${person.name}.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${person.name} — Filmography & Cinematic Profile | MOVIEINT`,
      description: person.biography?.slice(0, 160) || `Cinematic works and telemetry for ${person.name}.`,
      url: canonicalUrl,
      type: "profile",
      images: [
        {
          url: person.profile_path
            ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
            : "/og-image.png",
          width: 1200,
          height: 630,
          alt: person.name,
        },
      ],
    },
  };
}

export default async function PersonPage({ params }: PersonPageProps) {
  const { id } = await params;
  const person = await getPersonDetails(id);

  if (!person) {
    return (
      <main className="min-h-screen bg-[#05070b] text-white flex flex-col items-center justify-center p-4">
        <p className="text-slate-400 mb-4 font-mono text-sm">PERSON_RECORD_NOT_FOUND</p>
        <Link href="/" className="text-indigo-400 hover:text-indigo-300 font-medium transition text-xs">
          ← Back to Intelligence Hub
        </Link>
      </main>
    );
  }

  const rawCredits =
    person.known_for_department === "Directing"
      ? person.movie_credits?.crew?.filter((c: any) => c.job === "Director")
      : person.movie_credits?.cast;

  const validCredits = (rawCredits || [])
    .filter((m: any) => m.poster_path && m.vote_average > 0)
    .sort((a: any, b: any) => (b.vote_average || 0) - (a.vote_average || 0));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    jobTitle: person.known_for_department,
    image: person.profile_path ? `https://image.tmdb.org/t/p/w500${person.profile_path}` : undefined,
    description: person.biography?.slice(0, 300),
  };

  return (
    <main className="min-h-screen bg-[#05070b] text-slate-100 px-4 py-12 flex flex-col items-center selection:bg-indigo-600 selection:text-white relative overflow-hidden pb-24">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[450px] bg-gradient-to-b from-indigo-600/10 via-rose-950/5 to-transparent pointer-events-none -z-0" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-5xl w-full z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-200 mb-8 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Discover
        </Link>

        {/* Profile Header */}
        <section className="bg-[#090d15] border border-white/[0.08] rounded-3xl p-6 sm:p-8 mb-12 shadow-2xl flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
          <div className="w-32 aspect-[2/3] relative rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shrink-0 shadow-lg">
            {person.profile_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                alt={person.name}
                fill
                sizes="128px"
                priority
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-slate-600">No Photo</div>
            )}
          </div>

          <div className="flex-grow">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono uppercase mb-3">
              <UserCheck className="w-3.5 h-3.5" /> {person.known_for_department}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
              {person.name}
            </h1>
            <p className="text-xs text-slate-500 font-mono mb-4">
              Born: {person.birthday || "Unknown"} {person.place_of_birth ? `in ${person.place_of_birth}` : ""}
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl line-clamp-4">
              {person.biography || `${person.name} is recognized globally for distinctive cinematic contributions and narrative impact.`}
            </p>
          </div>
        </section>

        {/* Filmography Grid */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-slate-400 font-bold flex items-center gap-2">
              <Film className="w-4 h-4 text-indigo-400" /> Rated Filmography ({validCredits.length})
            </h2>
            <span className="text-[11px] font-mono text-slate-500">Sorted by Quality Score</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {validCredits.map((movie: any) => (
              <Link
                key={movie.id}
                href={`/movie/${movie.id}`}
                className="group bg-[#090d15] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-indigo-500/50 transition duration-300 flex flex-col"
              >
                <div className="aspect-[2/3] relative w-full bg-slate-950">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={`${movie.title} poster`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-bold text-amber-400 flex items-center gap-1 border border-white/10">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {movie.vote_average?.toFixed(1)}
                  </div>
                </div>
                <div className="p-3 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-200 group-hover:text-indigo-400 transition truncate">
                      {movie.title}
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                      {movie.release_date?.split("-")[0] || "TBA"}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
