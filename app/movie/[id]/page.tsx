// app/movie/[id]/page.tsx
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, Star, Clock, Calendar, Film, Tv, Clapperboard, 
  BookOpen, ChevronRight, Activity, Brain, Heart, Zap, 
  AlertTriangle, RotateCcw, Compass, Sparkles, UserCheck, Layers
} from "lucide-react";
import MovieDNA, { computeBaselineDNA } from "@/components/MovieDNA";
import WatchlistButton from "@/components/WatchlistButton";
import TrailerModal from "@/components/TrailerModal";
import WatchProviders from "@/components/WatchProviders";
import VibeMatch from "@/components/VibeMatch";
import ClimaxIndex from "@/components/ClimaxIndex";
import StreamingAffiliateBox from "@/components/StreamingAffiliateBox";
import MovieFAQ from "@/components/MovieFAQ";
import SpoilerVault from "@/components/SpoilerVault";
import MoviePoster from "@/components/MoviePoster";
import DnaAffinityEngine from "@/components/DnaAffinityEngine";
import { EDITORIAL_ARTICLES } from "@/lib/editorial-data";

export const dynamic = "force-dynamic";

interface MovieDetailProps {
  params: Promise<{ id: string }> | { id: string };
}

function dataCastExtract(tvData: any) {
  return tvData?.aggregate_credits?.cast?.length
    ? tvData.aggregate_credits.cast
    : tvData?.credits?.cast || [];
}

async function getMediaDetails(rawId: string) {
  if (!rawId) return null;
  const apiKey = process.env.TMDB_API_KEY || "b6b9f5e3a64b6ef32e0b8fade33cfe5a";

  const isExplicitTv = rawId.startsWith("tv-") || rawId.startsWith("series-");
  const isExplicitMovie = rawId.startsWith("movie-");
  const cleanId = rawId.replace(/^(tv-|series-|movie-)/, "");

  const fetchOptions = {
    headers: { accept: "application/json" },
    cache: "no-store" as RequestCache,
  };

  // 1. Handle explicit TV routes
  if (isExplicitTv) {
    try {
      const tvRes = await fetch(
        `https://api.themoviedb.org/3/tv/${cleanId}?api_key=${apiKey}&append_to_response=credits,aggregate_credits,similar,videos,watch/providers`,
        fetchOptions
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
            crew: data.credits?.crew || [],
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
        fetchOptions
      );
      if (movieRes.ok) {
        const data = await movieRes.json();
        return { ...data, media_type: "movie" };
      }
    } catch (e) {
      console.error("Explicit Movie fetch failed", e);
    }
  }

  // 3. Ambiguous IDs: Parallel lookup with auto-resolution
  try {
    const [movieRes, tvRes] = await Promise.allSettled([
      fetch(
        `https://api.themoviedb.org/3/movie/${cleanId}?api_key=${apiKey}&append_to_response=credits,similar,videos,watch/providers`,
        fetchOptions
      ),
      fetch(
        `https://api.themoviedb.org/3/tv/${cleanId}?api_key=${apiKey}&append_to_response=credits,aggregate_credits,similar,videos,watch/providers`,
        fetchOptions
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
            cast: dataCastExtract(tvData),
            crew: tvData.credits?.crew || [],
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
          cast: dataCastExtract(tvData),
          crew: tvData.credits?.crew || [],
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
  const resolved = await (params instanceof Promise ? params : Promise.resolve(params));
  const id = resolved?.id;
  if (!id) return { title: "Archive Record | MOVIEINT" };

  const media = await getMediaDetails(id);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.movieint.com";

  if (!media) {
    return {
      title: "Archive Record Not Found | MOVIEINT",
      description: "Autonomous cinema intelligence and discoverability engine.",
    };
  }

  const title = media.title || media.name || "Unknown Title";
  const releaseYear = (media.release_date || media.first_air_date || "").split("-")[0] || "";
  const isTv = media.media_type === "tv";
  const mediaTypeLabel = isTv ? "Series" : "Movie";

  const topActors = (media.credits?.cast || [])
    .slice(0, 3)
    .map((a: any) => a.name)
    .filter(Boolean);

  const actorSnippet = topActors.length > 0 ? ` starring ${topActors.join(", ")}` : "";

  // Target high CTR programmatic search queries
  const metaTitle = `${title} (${releaseYear}) — Stream, Ending Twist & Narrative DNA | MOVIEINT`;

  const cleanDescription = media.overview
    ? `${media.overview.slice(0, 130)}... Analyze narrative complexity, pacing telemetry, twist potency, and streaming availability on MOVIEINT.`
    : `Explore ${title} (${releaseYear})${actorSnippet}. Get deep narrative DNA telemetry, twist index, and official streaming guide on MOVIEINT.`;

  const canonicalUrl = `${baseUrl}/movie/${id}`;

  const ogImageUrl = `/api/og?title=${encodeURIComponent(title)}&rating=${media.vote_average?.toFixed(
    1
  )}&year=${releaseYear}&poster=${encodeURIComponent(
    media.poster_path ? `https://image.tmdb.org/t/p/w500${media.poster_path}` : ""
  )}`;

  return {
    title: metaTitle,
    description: cleanDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    keywords: [
      title,
      `${title} ${releaseYear}`,
      `movies like ${title}`,
      `where to watch ${title}`,
      `${title} streaming online`,
      `${title} ending explained`,
      `${title} twist rating`,
      `${title} narrative dna`,
      `${title} boredom risk`,
      `${mediaTypeLabel} telemetry`,
      ...topActors,
      ...(media.genres?.map((g: { name: string }) => g.name) || []),
    ],
    openGraph: {
      title: `${title} (${releaseYear}) — Narrative DNA & Intelligence | MOVIEINT`,
      description: cleanDescription,
      url: canonicalUrl,
      siteName: "MOVIEINT",
      type: isTv ? "video.tv_show" : "video.movie",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${title} Poster and Narrative Card`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} (${releaseYear}) — Cinematic DNA Intelligence`,
      description: cleanDescription,
      images: [ogImageUrl],
    },
  };
}

export default async function MediaDetailPage({ params }: MovieDetailProps) {
  const resolved = await (params instanceof Promise ? params : Promise.resolve(params));
  const id = resolved?.id;
  const media = id ? await getMediaDetails(id) : null;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.movieint.com";

  if (!media) {
    return (
      <main className="min-h-screen bg-[#05070b] text-white flex flex-col items-center justify-center p-4">
        <p className="text-slate-400 mb-4 font-mono text-sm">ARCHIVE_RECORD_NOT_FOUND</p>
        <Link 
          href="/" 
          prefetch={false} 
          className="text-indigo-400 hover:text-indigo-300 font-medium transition text-sm flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Command Center
        </Link>
      </main>
    );
  }

  const title = media.title || media.name || "Untitled";
  const releaseDate = media.release_date || media.first_air_date || "TBA";
  const year = releaseDate.split("-")[0] || "";
  const isTv = media.media_type === "tv" || (id ? id.startsWith("tv-") || id.startsWith("series-") : false);
  const genreList = media.genres?.map((g: { name: string }) => g.name).join(", ") || "Cinema";

  const cast = (media.credits?.cast || [])
    .filter((actor: any) => actor && (actor.id || actor.name))
    .slice(0, 6);

  const directors = (media.credits?.crew || [])
    .filter((member: any) => ["Director", "Creator", "Series Director"].includes(member.job) || member.department === "Directing")
    .slice(0, 2);

  const writers = (media.credits?.crew || [])
    .filter((member: any) => ["Screenplay", "Writer", "Story"].includes(member.job))
    .slice(0, 2);

  const similarMedia = (media.similar?.results || [])
    .filter((sim: any) => sim && sim.poster_path && sim.vote_average > 0)
    .slice(0, 6);

  const trailer = media.videos?.results?.find(
    (v: any) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
  );

  const providers =
    media["watch/providers"]?.results?.US ||
    (Object.values(media["watch/providers"]?.results || {})[0] as any);

  const cleanId = id ? id.replace(/^(tv-|series-|movie-)/, "") : "";
  const directGuides = EDITORIAL_ARTICLES.filter((article) =>
    article.movies.some(
      (m) =>
        String(m.slugId) === String(cleanId) ||
        String(m.tmdbId) === String(cleanId) ||
        m.title.toLowerCase() === title.toLowerCase()
    )
  );

  const relatedEditorialGuides =
    directGuides.length > 0 ? directGuides : EDITORIAL_ARTICLES.slice(0, 3);

  // Unified DNA telemetry calculation
  const telemetry = computeBaselineDNA(
    title,
    genreList,
    media.vote_average,
    media.overview,
    media.runtime || 110
  );

  // Full Rich Schema.org Entity Graph
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": isTv ? "TVSeries" : "Movie",
        "@id": `${baseUrl}/movie/${id}#media`,
        name: title,
        url: `${baseUrl}/movie/${id}`,
        image: media.poster_path ? `https://image.tmdb.org/t/p/w500${media.poster_path}` : undefined,
        datePublished: releaseDate,
        description: media.overview,
        genre: media.genres?.map((g: { name: string }) => g.name),
        duration: media.runtime ? `PT${media.runtime}M` : undefined,
        inLanguage: media.original_language || "en",
        director: directors.map((d: any) => ({
          "@type": "Person",
          name: d.name,
        })),
        actor: cast.map((actor: any) => ({
          "@type": "Person",
          name: actor.name,
        })),
        trailer: trailer
          ? {
              "@type": "VideoObject",
              name: `${title} Official Trailer`,
              thumbnailUrl: media.backdrop_path
                ? `https://image.tmdb.org/t/p/w780${media.backdrop_path}`
                : undefined,
              embedUrl: `https://www.youtube.com/embed/${trailer.key}`,
              uploadDate: releaseDate,
            }
          : undefined,
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
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}/movie/${id}#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: `Where can I stream ${title} (${year}) online?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `${title} is tracked on major digital platforms including Netflix, Prime Video, and Apple TV depending on licensing. Check the real-time availability section above.`,
            },
          },
          {
            "@type": "Question",
            name: `What is the Narrative DNA and pacing of ${title}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `${title} features a pacing score of ${telemetry.pacing.score}/100 (${telemetry.pacing.label}) and a narrative complexity rating of ${telemetry.complexity.score}/100.`,
            },
          },
          {
            "@type": "Question",
            name: `What movies are similar to ${title}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Movies with matching thematic DNA and narrative affinity include: ${similarMedia.map((m: any) => m.title || m.name).join(", ")}. Explore the dedicated "Movies Like ${title}" affinity hub on MOVIEINT.`,
            },
          },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#05070b] text-slate-100 px-4 py-10 flex flex-col items-center selection:bg-indigo-600 selection:text-white relative overflow-hidden pb-24">
      {/* Ambient Backdrop */}
      {media.backdrop_path ? (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[520px] pointer-events-none -z-0 overflow-hidden">
          <Image
            src={`https://image.tmdb.org/t/p/w1280${media.backdrop_path}`}
            alt={`${title} backdrop`}
            fill
            priority
            unoptimized
            className="object-cover object-top opacity-15 blur-2xl mask-gradient"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#05070b]/40 via-[#05070b]/80 to-[#05070b]" />
        </div>
      ) : (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[450px] bg-gradient-to-b from-indigo-600/10 via-rose-950/5 to-transparent pointer-events-none -z-0" />
      )}

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-5xl w-full z-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            prefetch={false}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-200 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Discover
          </Link>
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            <span>Catalog ID</span>
            <span className="text-slate-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/5">
              {id}
            </span>
          </div>
        </div>

        {/* Primary Hero Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-[#090d15]/90 border border-white/[0.08] rounded-3xl p-6 sm:p-8 mb-10 shadow-2xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 blur-3xl -z-0 pointer-events-none" />

          {/* Poster Column */}
          <div className="aspect-[2/3] relative rounded-2xl overflow-hidden shadow-2xl bg-slate-950 border border-white/10 z-10 group">
            {media.poster_path ? (
              <MoviePoster
                src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
                alt={`${title} (${year}) official poster`}
                fallbackTitle={title}
                fill
                priority
                unoptimized
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-600 text-xs gap-2">
                <Clapperboard className="w-8 h-8 text-slate-700" />
                <span>No Visual Record</span>
              </div>
            )}
          </div>

          {/* Right Core Details Column */}
          <div className="md:col-span-2 flex flex-col justify-between gap-6 z-10">
            <div>
              {/* Badges Bar */}
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

              {/* Title & Tagline */}
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-2 leading-tight">
                {title}
              </h1>

              {media.tagline && (
                <p className="italic text-slate-400 text-sm mb-4 font-serif">&quot;{media.tagline}&quot;</p>
              )}

              {/* Meta Stats */}
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

              {/* Crew Highlights */}
              {(directors.length > 0 || writers.length > 0) && (
                <div className="flex flex-wrap gap-4 mb-5 text-xs">
                  {directors.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 font-mono uppercase text-[10px]">
                        {isTv ? "Created by:" : "Directed by:"}
                      </span>
                      <span className="text-slate-300 font-semibold">
                        {directors.map((d: any) => d.name).join(", ")}
                      </span>
                    </div>
                  )}
                  {writers.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 font-mono uppercase text-[10px]">Written by:</span>
                      <span className="text-slate-300 font-semibold">
                        {writers.map((w: any) => w.name).join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Narrative Synopsis */}
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Narrative Synopsis</h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                {media.overview}
              </p>

              {/* Streaming Section */}
              <div className="mb-2">
                <WatchProviders key={`providers-${id}`} providers={providers} />
              </div>

              <StreamingAffiliateBox key={`affiliate-${id}`} movieTitle={title} />
            </div>

            {/* Deep Movie DNA Component */}
            <MovieDNA
              key={`dna-${id}`}
              title={title}
              overview={media.overview}
              genres={genreList}
              voteAverage={media.vote_average}
              runtime={media.runtime}
            />
          </div>
        </div>

        {/* Intelligence Engines */}
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

        <DnaAffinityEngine
          currentMovie={{
            id: id,
            title: title,
            poster_path: media.poster_path,
            release_date: releaseDate,
            vote_average: media.vote_average,
            overview: media.overview,
            genres: media.genres,
            original_language: media.original_language,
          }}
        />

        {/* Cast Units */}
        {cast.length > 0 && (
          <section className="mb-14 text-left">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 font-bold">
                  Key Cast & Performance Units
                </h3>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {cast.map((actor: any) => (
                <Link
                  key={actor.id}
                  href={`/person/${actor.id}`}
                  prefetch={false}
                  className="group bg-[#090d15] border border-white/[0.06] rounded-2xl p-3 text-center hover:border-indigo-500/50 transition duration-300 block"
                >
                  <div className="w-16 h-16 relative mx-auto mb-2 rounded-full overflow-hidden bg-slate-900 border border-white/5">
                    {actor.profile_path ? (
                      <MoviePoster
                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                        alt={`${actor.name} as ${actor.character || "Cast"} in ${title}`}
                        fallbackTitle={actor.name}
                        fill
                        unoptimized
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

        {/* Thematic Neighbours & "Movies Like This" Hub Link */}
        {similarMedia.length > 0 && (
          <section className="mb-14 text-left">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 font-bold">
                  Thematic Neighbours & Movies Like {title}
                </h3>
              </div>
              <Link
                href={`/movies-like/${id}`}
                prefetch={false}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition font-mono flex items-center gap-1 group"
              >
                <span>Full &quot;Movies Like {title}&quot; Affinity Matrix</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5">
              {similarMedia.map((sim: any) => {
                const simTitle = sim.title || sim.name;
                const linkId = isTv ? `tv-${sim.id}` : sim.id;
                return (
                  <Link
                    key={sim.id}
                    href={`/movie/${linkId}`}
                    prefetch={false}
                    className="group bg-[#090d15] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-indigo-500/50 transition duration-300 flex flex-col"
                  >
                    <div className="aspect-[2/3] relative w-full bg-slate-950">
                      {sim.poster_path ? (
                        <MoviePoster
                          src={`https://image.tmdb.org/t/p/w500${sim.poster_path}`}
                          alt={`${simTitle} poster`}
                          fallbackTitle={simTitle}
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 50vw, 16vw"
                          className="object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-xs text-slate-600">No Image</div>
                      )}
                      <div className="absolute bottom-1.5 right-1.5 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-mono text-amber-400 border border-white/10">
                        ★ {sim.vote_average?.toFixed(1) || "N/A"}
                      </div>
                    </div>
                    <div className="p-2.5">
                      <h4 className="text-xs font-bold text-slate-200 truncate group-hover:text-indigo-400 transition">
                        {simTitle}
                      </h4>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5 font-mono">
                        DNA Affinity Match
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Editorial Guides */}
        <section className="mb-14 text-left">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 font-bold">
                Curated Context & Editorial Guides
              </h3>
            </div>
            <Link
              href="/editorial"
              prefetch={false}
              className="text-xs text-cyan-400 hover:text-cyan-300 transition font-mono flex items-center gap-1"
            >
              Explore All Guides <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {relatedEditorialGuides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/editorial/${guide.slug}`}
                prefetch={false}
                className="group bg-[#090d15] border border-white/[0.06] hover:border-cyan-500/40 rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 uppercase tracking-wider">
                      {guide.moodTag}
                    </span>
                    <span>{guide.readTime}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition line-clamp-2 leading-relaxed">
                    {guide.title}
                  </h4>
                </div>
                <div className="pt-3 mt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>{guide.movies.length} Evaluated Titles</span>
                  <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">Read →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Enhanced Movie FAQ */}
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
