import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Star, Clock, Calendar, Film, Tv, Clapperboard } from "lucide-react";
import MovieDNA from "@/components/MovieDNA";
import WatchlistButton from "@/components/WatchlistButton";
import TrailerModal from "@/components/TrailerModal";
import WatchProviders from "@/components/WatchProviders";
import VibeMatch from "@/components/VibeMatch";
import ClimaxIndex from "@/components/ClimaxIndex";
import StreamingAffiliateBox from "@/components/StreamingAffiliateBox";
import MovieFAQ from "@/components/MovieFAQ";
import SpoilerVault from "@/components/SpoilerVault";
import MoviePoster from "@/components/MoviePoster";

interface MovieDetailProps {
  params: Promise<{ id: string }>;
}

async function getMediaDetails(rawId: string) {
  const apiKey = process.env.TMDB_API_KEY || "b6b9f5e3a64b6ef32e0b8fade33cfe5a";

  const isExplicitTv = rawId.startsWith("tv-") || rawId.startsWith("series-");
  const isExplicitMovie = rawId.startsWith("movie-");
  const cleanId = rawId.replace(/^(tv-|series-|movie-)/, "");

  // 1. Handle explicit TV routes
  if (isExplicitTv) {
    try {
      const tvRes = await fetch(
        `https://api.themoviedb.org/3/tv/${cleanId}?api_key=${apiKey}&append_to_response=credits,aggregate_credits,similar,videos,watch/providers`,
        { next: { revalidate: 3600 } }
      );
      if (tvRes.ok) {
        const data = await tvRes.json();
        return {
          ...data,
          title: data.name,
          release_date: data.first_air_date,
          runtime: data.episode_run_time?.[0] || 45,
          credits: {
            cast: data.aggregate_credits?.cast?.length ? data.aggregate_credits.cast : data.credits?.cast || [],
          },
          media_type: "tv",
        };
      }
    } catch (e) {
      console.error("Explicit TV fetch failed", e);
    }
  }

  // 2. Handle explicit Movie routes
  if (isExplicitMovie) {
    try {
      const movieRes = await fetch(
        `https://api.themoviedb.org/3/movie/${cleanId}?api_key=${apiKey}&append_to_response=credits,similar,videos,watch/providers`,
        { next: { revalidate: 3600 } }
      );
      if (movieRes.ok) {
        const data = await movieRes.json();
        return { ...data, media_type: "movie" };
      }
    } catch (e) {
      console.error("Explicit Movie fetch failed", e);
    }
  }

  // 3. Ambiguous IDs: Query both endpoints concurrently to prevent collisions
  try {
    const [movieRes, tvRes] = await Promise.allSettled([
      fetch(
        `https://api.themoviedb.org/3/movie/${cleanId}?api_key=${apiKey}&append_to_response=credits,similar,videos,watch/providers`,
        { next: { revalidate: 3600 } }
      ),
      fetch(
        `https://api.themoviedb.org/3/tv/${cleanId}?api_key=${apiKey}&append_to_response=credits,aggregate_credits,similar,videos,watch/providers`,
        { next: { revalidate: 3600 } }
      ),
    ]);

    const movieData =
      movieRes.status === "fulfilled" && movieRes.value.ok
        ? await movieRes.value.json()
        : null;
    const tvData =
      tvRes.status === "fulfilled" && tvRes.value.ok
        ? await tvRes.value.json()
        : null;

    // Resolve collision using weighted popularity score
    if (movieData && tvData) {
      const tvScore = (tvData.vote_count || 0) * (tvData.popularity || 1);
      const movieScore = (movieData.vote_count || 0) * (movieData.popularity || 1);

      if (tvScore > movieScore) {
        return {
          ...tvData,
          title: tvData.name,
          release_date: tvData.first_air_date,
          runtime: tvData.episode_run_time?.[0] || 45,
          credits: {
            cast: tvData.aggregate_credits?.cast?.length ? tvData.aggregate_credits.cast : tvData.credits?.cast || [],
          },
          media_type: "tv",
        };
      }
      return { ...movieData, media_type: "movie" };
    }

    if (movieData) return { ...movieData, media_type: "movie" };

    if (tvData) {
      return {
        ...tvData,
        title: tvData.name,
        release_date: tvData.first_air_date,
        runtime: tvData.episode_run_time?.[0] || 45,
        credits: {
          cast: tvData.aggregate_credits?.cast?.length ? tvData.aggregate_credits.cast : tvData.credits?.cast || [],
        },
        media_type: "tv",
      };
    }
  } catch (e) {
    console.error("Parallel fetch error", e);
  }

  return null;
}

export async function generateMetadata({ params }: MovieDetailProps): Promise<Metadata> {
  const { id } = await params;
  const media = await getMediaDetails(id);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.movieint.com";

  if (!media) {
    return {
      title: "Archive Record Not Found | MOVIEINT",
      description: "Cinema and series intelligence discovery system.",
    };
  }

  const title = media.title || media.name;
  const releaseYear = (media.release_date || media.first_air_date || "").split("-")[0];
  const cleanDescription =
    media.overview?.slice(0, 160) || "AI-powered narrative DNA, twist metrics, and streaming availability.";
  const canonicalUrl = `${baseUrl}/movie/${id}`;

  const ogImageUrl = `/api/og?title=${encodeURIComponent(title)}&rating=${media.vote_average?.toFixed(
    1
  )}&year=${releaseYear}&poster=${encodeURIComponent(
    media.poster_path ? `https://image.tmdb.org/t/p/w500${media.poster_path}` : ""
  )}`;

  return {
    title: `${title} (${releaseYear}) — Narrative DNA & Analysis | MOVIEINT`,
    description: cleanDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    keywords: [
      title,
      "Movie DNA",
      "Climax Twist Rating",
      "Streaming Availability",
      ...(media.genres?.map((g: { name: string }) => g.name) || []),
    ],
    openGraph: {
      title: `${title} (${releaseYear}) | MOVIEINT`,
      description: cleanDescription,
      url: canonicalUrl,
      siteName: "MOVIEINT",
      type: media.media_type === "tv" ? "video.tv_show" : "video.movie",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — Cinematic Intelligence`,
      description: cleanDescription,
      images: [ogImageUrl],
    },
  };
}

export default async function MediaDetailPage({ params }: MovieDetailProps) {
  const { id } = await params;
  const media = await getMediaDetails(id);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.movieint.com";

  if (!media) {
    return (
      <main className="min-h-screen bg-[#05070b] text-white flex flex-col items-center justify-center">
        <p className="text-slate-400 mb-4 font-mono text-sm">ARCHIVE_RECORD_NOT_FOUND</p>
        <Link href="/" className="text-indigo-400 hover:text-indigo-300 font-medium transition">
          ← Return to Command Center
        </Link>
      </main>
    );
  }

  const title = media.title || media.name;
  const releaseDate = media.release_date || media.first_air_date || "TBA";
  const year = releaseDate.split("-")[0];
  const isTv = media.media_type === "tv";
  const genreList = media.genres?.map((g: { name: string }) => g.name).join(", ") || "Cinema";

  const cast = (media.credits?.cast || [])
    .filter((actor: any) => actor && (actor.id || actor.name))
    .slice(0, 6);

  const similarMedia = (media.similar?.results || [])
    .filter((sim: any) => sim && sim.poster_path && sim.vote_average > 0)
    .slice(0, 5);

  const trailer = media.videos?.results?.find(
    (v: any) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
  );

  const providers =
    media["watch/providers"]?.results?.US ||
    (Object.values(media["watch/providers"]?.results || {})[0] as any);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": isTv ? "TVSeries" : "Movie",
    name: title,
    url: `${baseUrl}/movie/${id}`,
    image: media.poster_path ? `https://image.tmdb.org/t/p/w500${media.poster_path}` : undefined,
    datePublished: releaseDate,
    description: media.overview,
    genre: media.genres?.map((g: { name: string }) => g.name),
    duration: media.runtime ? `PT${media.runtime}M` : undefined,
    aggregateRating:
      media.vote_count && media.vote_average
        ? {
            "@type": "AggregateRating",
            ratingValue: Number(media.vote_average.toFixed(1)),
            bestRating: "10",
            worstRating: "1",
            ratingCount: media.vote_count,
          }
        : undefined,
  };

  return (
    <main className="min-h-screen bg-[#05070b] text-slate-100 px-4 py-10 flex flex-col items-center selection:bg-indigo-600 selection:text-white relative overflow-hidden pb-24">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-[#090d15] border border-white/[0.08] rounded-3xl p-6 sm:p-8 mb-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 blur-3xl -z-0 pointer-events-none" />

          <div className="aspect-[2/3] relative rounded-2xl overflow-hidden shadow-2xl bg-slate-950 border border-white/10 z-10">
            {media.poster_path ? (
              <MoviePoster
                src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
                alt={`${title} (${year}) official poster`}
                fallbackTitle={title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-600 text-xs gap-2">
                <Clapperboard className="w-8 h-8 text-slate-700" />
                <span>No Visual Record</span>
              </div>
            )}
          </div>

          <div className="md:col-span-2 flex flex-col justify-between gap-6 z-10">
            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                <span className="bg-white/[0.05] border border-white/10 text-slate-300 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider">
                  {isTv ? "TV Series" : "Feature Film"}
                </span>

                <div className="flex items-center gap-1.5 bg-black/60 border border-white/10 px-3 py-1 rounded-full text-amber-400 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {media.vote_average?.toFixed(1)} <span className="text-slate-500 font-normal">/ 10</span>
                </div>

                <TrailerModal key={`trailer-${id}`} trailerKey={trailer?.key} movieTitle={title} />

                <WatchlistButton
                  key={`watchlist-${id}`}
                  movie={{
                    id: media.id,
                    title: title,
                    poster_path: media.poster_path,
                    vote_average: media.vote_average,
                    release_date: releaseDate,
                  }}
                />
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-2">
                {title}
              </h1>

              {media.tagline && (
                <p className="italic text-slate-400 text-sm mb-4 font-serif">"{media.tagline}"</p>
              )}

              <div className="flex flex-wrap gap-5 text-xs font-medium text-slate-400 mb-6 border-y border-white/[0.06] py-3">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{releaseDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{media.runtime} mins</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {isTv ? <Tv className="w-3.5 h-3.5 text-indigo-400" /> : <Film className="w-3.5 h-3.5 text-indigo-400" />}
                  <span>{genreList}</span>
                </div>
              </div>

              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Narrative Synopsis</h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                {media.overview}
              </p>

              <div className="mb-2">
                <WatchProviders key={`providers-${id}`} providers={providers} />
              </div>

              <StreamingAffiliateBox key={`affiliate-${id}`} movieTitle={title} />
            </div>

            <MovieDNA
              key={`dna-${id}`}
              title={title}
              overview={media.overview}
              genres={genreList}
              voteAverage={media.vote_average}
            />
          </div>
        </div>

        <ClimaxIndex
          key={`climax-${id}`}
          title={title}
          overview={media.overview}
          year={year}
          rating={media.vote_average}
        />

        <SpoilerVault
          key={`spoiler-${id}`}
          title={title}
          year={year}
          overview={media.overview}
        />

        <VibeMatch
          key={`vibe-${id}`}
          movieTitle={title}
          overview={media.overview}
        />

        {cast.length > 0 && (
          <section className="mb-14 text-left">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 mb-4 font-bold">
              Key Personnel & Cast
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {cast.map((actor: any) => (
                <Link
                  key={actor.id}
                  href={`/person/${actor.id}`}
                  className="group bg-[#090d15] border border-white/[0.06] rounded-2xl p-3 text-center hover:border-indigo-500/50 transition block"
                >
                  <div className="w-16 h-16 relative mx-auto mb-2 rounded-full overflow-hidden bg-slate-900 border border-white/5">
                    {actor.profile_path ? (
                      <MoviePoster
                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                        alt={`${actor.name} as ${actor.character || "Cast"} in ${title}`}
                        fallbackTitle={actor.name}
                        fill
                        sizes="64px"
                        className="object-cover group-hover:scale-105 transition"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-[10px] text-slate-600">No Visual</div>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-200 truncate group-hover:text-indigo-400 transition">
                    {actor.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 truncate">{actor.character || "Cast"}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {similarMedia.length > 0 && (
          <section className="mb-14 text-left">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 font-bold">
                Thematic Neighbours
              </h3>
              <Link
                href={`/movies-like/${id}`}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition font-mono"
              >
                View Full Affinity Index →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {similarMedia.map((sim: any) => {
                const simTitle = sim.title || sim.name;
                const linkId = isTv ? `tv-${sim.id}` : sim.id;
                return (
                  <Link
                    key={sim.id}
                    href={`/movie/${linkId}`}
                    className="group bg-[#090d15] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-indigo-500/50 transition duration-300 flex flex-col"
                  >
                    <div className="aspect-[2/3] relative w-full bg-slate-950">
                      {sim.poster_path ? (
                        <MoviePoster
                          src={`https://image.tmdb.org/t/p/w500${sim.poster_path}`}
                          alt={`${simTitle} poster`}
                          fallbackTitle={simTitle}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          className="object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-xs text-slate-600">No Image</div>
                      )}
                    </div>
                    <div className="p-3">
                      <h4 className="text-xs font-bold text-slate-200 truncate group-hover:text-indigo-400 transition">
                        {simTitle}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1">
                        ★ {sim.vote_average?.toFixed(1) || "N/A"}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <MovieFAQ
          key={`faq-${id}`}
          title={title}
          genres={genreList}
          runtime={media.runtime}
          voteAverage={media.vote_average}
          overview={media.overview}
          tagline={media.tagline}
        />
      </div>
    </main>
  );
}
