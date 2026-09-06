import Image from "next/image";
import Link from "next/link";
import { Star, Film, Compass, Dna, Play, Info, ArrowUpRight, Tv, Globe2, Sparkles } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import SponsoredSpotlight from "@/components/SponsoredSpotlight";
import MediaGridSection from "@/components/MediaGridSection";

async function getGlobalCatalog() {
  const apiKey = process.env.TMDB_API_KEY || "b6b9f5e3a64b6ef32e0b8fade33cfe5a";

  try {
    const [moviesRes, seriesRes, animeRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&page=1`, {
        next: { revalidate: 3600 },
      }),
      fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}&page=1`, {
        next: { revalidate: 3600 },
      }),
      fetch(
        `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_genres=16,18&sort_by=vote_average.desc&vote_count.gte=300&page=1`,
        { next: { revalidate: 3600 } }
      ),
    ]);

    const [moviesData, seriesData, animeData] = await Promise.all([
      moviesRes.ok ? moviesRes.json() : { results: [] },
      seriesRes.ok ? seriesRes.json() : { results: [] },
      animeRes.ok ? animeRes.json() : { results: [] },
    ]);

    const movies = moviesData.results || [];
    const series = seriesData.results || [];
    const cultGlobal = animeData.results || [];

    return {
      featured: movies[0] || series[0] || null,
      movies: movies.slice(0, 20),
      series: series.slice(0, 20),
      cultGlobal: cultGlobal.slice(0, 20),
    };
  } catch (error) {
    console.error("Error loading catalog:", error);
    return { featured: null, movies: [], series: [], cultGlobal: [] };
  }
}

export default async function HomePage() {
  const { featured, movies, series, cultGlobal } = await getGlobalCatalog();

  const featuredTitle = featured?.title || featured?.name || "Global Spotlight";
  const featuredType = featured?.title ? "Feature Film" : "Web Series";

  return (
    <main className="min-h-screen bg-[#05070b] text-slate-100 flex flex-col items-center selection:bg-indigo-600 selection:text-white relative overflow-hidden pb-28">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-gradient-to-b from-indigo-600/10 via-purple-900/5 to-transparent pointer-events-none -z-0" />

      <div className="max-w-7xl w-full px-4 sm:px-8 pt-8 pb-6 flex flex-col items-center z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0a0d14]/90 border border-white/[0.08] text-indigo-300 text-[10px] font-mono uppercase tracking-[0.2em] mb-4 shadow-xl">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span>Global Cinema & Series Intelligence v3.2</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-3 leading-tight">
          Decode Worldwide <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300">
            Cinema & Series Masterpieces
          </span>
        </h1>

        <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed mb-6">
          Explore synchronized telemetry across Hollywood, K-Dramas, Anime, and global streaming networks.
        </p>

        <div id="search-section" className="w-full max-w-2xl mb-8">
          <SearchBar />
        </div>

        <SponsoredSpotlight />

        {featured && (
          <div className="w-full relative rounded-3xl overflow-hidden border border-white/[0.08] bg-[#090d15] shadow-2xl mb-16 text-left group">
            <div className="relative aspect-[16/8] md:aspect-[21/8] w-full min-h-[340px] max-h-[460px]">
              {featured.backdrop_path && (
                <Image
                  src={`https://image.tmdb.org/t/p/original${featured.backdrop_path}`}
                  alt={featuredTitle}
                  fill
                  priority
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  className="object-cover object-center opacity-45 group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#090d15] via-[#090d15]/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#090d15] via-[#090d15]/70 to-transparent" />

              <div className="absolute bottom-0 left-0 p-6 sm:p-8 max-w-2xl z-10 flex flex-col justify-end">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-mono uppercase tracking-widest font-semibold flex items-center gap-1">
                    <Film className="w-3 h-3" /> {featuredType} Spotlight
                  </span>
                  <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full text-amber-400 text-xs font-bold border border-white/5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{featured.vote_average?.toFixed(1)}</span>
                  </div>
                </div>

                <h2 className="text-2xl sm:text-4xl font-black text-white mb-2 tracking-tight">
                  {featuredTitle}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 mb-5 leading-relaxed font-normal">
                  {featured.overview}
                </p>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/movie/${featured.id}`}
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition duration-200"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Deep DNA Breakdown</span>
                  </Link>
                  <Link
                    href={`/movie/${featured.id}`}
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 px-4 py-2 rounded-xl text-xs font-semibold backdrop-blur-md transition duration-200"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Watch Trailer</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 1: BLOCKBUSTER MOVIES (Dynamic Load More) */}
        <section className="w-full text-left mb-16">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <Film className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white tracking-wide">
                Trending Feature Films
              </h2>
            </div>
            <Link
              href="/rankings"
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
            >
              <span>Explore Leaderboard</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <MediaGridSection
            initialItems={movies}
            type="movie"
            badgeLabel="Cinema"
            badgeBg="bg-black/80"
            accentColor="indigo"
          />
        </section>

        {/* SECTION 2: TOP-TIER WEB & TV SERIES (Dynamic Load More) */}
        <section className="w-full text-left mb-16">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <Tv className="w-5 h-5 text-rose-400" />
              <h2 className="text-lg font-bold text-white tracking-wide">
                Trending Web & TV Series
              </h2>
            </div>
            <Link
              href="/rankings"
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-400 hover:text-rose-300 transition"
            >
              <span>Top Series</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <MediaGridSection
            initialItems={series}
            type="tv"
            badgeLabel="Series"
            badgeBg="bg-rose-950/80"
            accentColor="rose"
          />
        </section>

        {/* SECTION 3: GLOBAL ANIME & MASTERPIECES */}
        <section className="w-full text-left mb-16">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <Globe2 className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white tracking-wide">
                Global Masterpieces, Anime & K-Drama
              </h2>
              <span className="text-[10px] font-mono text-slate-400 bg-white/[0.04] border border-white/5 px-2 py-0.5 rounded-full">
                Curated
              </span>
            </div>
            <Link
              href="/rankings"
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition"
            >
              <span>Hall of Fame</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
            {cultGlobal.map((item: any) => (
              <Link
                key={`cult-${item.id}`}
                href={`/movie/${item.id}`}
                className="group relative bg-[#090d15] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-950/40 transition-all duration-300 flex flex-col"
              >
                <div className="aspect-[2/3] relative w-full bg-slate-950 overflow-hidden">
                  {item.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                      alt={item.name || item.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-slate-400">No Poster</div>
                  )}

                  <div className="absolute top-2.5 left-2.5 bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-300">
                    MASTERPIECE
                  </div>

                  <div className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded-lg flex items-center gap-1 text-[10px] font-bold text-amber-400 shadow-lg">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{item.vote_average?.toFixed(1) || "NR"}</span>
                  </div>
                </div>

                <div className="p-3.5 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-200 group-hover:text-emerald-400 transition-colors duration-200 line-clamp-1">
                      {item.name || item.title}
                    </h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] font-mono text-slate-400">
                        {(item.first_air_date || item.release_date || "").split("-")[0] || "Global"}
                      </span>
                      {item.origin_country?.[0] && (
                        <span className="text-[9px] font-mono text-slate-400 uppercase bg-white/[0.04] px-1.5 py-0.5 rounded">
                          {item.origin_country[0]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Feature Hubs */}
        <section className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-left">
          <Link
            href="#search-section"
            className="group bg-[#090d15] border border-white/[0.06] hover:border-indigo-500/50 rounded-2xl p-5 transition duration-300 block hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-950/30"
          >
            <div className="flex items-center justify-between mb-2.5">
              <Compass className="w-5 h-5 text-indigo-400 group-hover:rotate-45 transition duration-300" />
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition" />
            </div>
            <h4 className="text-xs font-bold text-white mb-1 uppercase tracking-wider group-hover:text-indigo-300 transition">
              Vector Multi-Search
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Find global TV series and cinema across Korea, Japan, Europe, and Hollywood with semantic vectors.
            </p>
          </Link>

          <Link
            href="/dna"
            className="group bg-[#090d15] border border-white/[0.06] hover:border-indigo-500/50 rounded-2xl p-5 transition duration-300 block hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-950/30"
          >
            <div className="flex items-center justify-between mb-2.5">
              <Dna className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition duration-300" />
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition" />
            </div>
            <h4 className="text-xs font-bold text-white mb-1 uppercase tracking-wider group-hover:text-indigo-300 transition">
              Narrative DNA
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dissect episode pacing, seasonal complexity, and climax twist potency powered by Gemini AI.
            </p>
          </Link>

          <Link
            href="/couch-mode"
            className="group bg-[#090d15] border border-white/[0.06] hover:border-indigo-500/50 rounded-2xl p-5 transition duration-300 block hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-950/30"
          >
            <div className="flex items-center justify-between mb-2.5">
              <Tv className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition duration-300" />
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition" />
            </div>
            <h4 className="text-xs font-bold text-white mb-1 uppercase tracking-wider group-hover:text-indigo-300 transition">
              Streaming Telemetry
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time regional availability for Netflix, Prime Video, Disney+, Apple TV, and Crunchyroll.
            </p>
          </Link>
        </section>

        {/* Editorial SEO Content Block */}
        <section className="w-full text-left mt-16 pt-10 border-t border-white/[0.06]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#090d15]/50 border border-white/[0.05] rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  What is MOVIEINT?
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                MOVIEINT is an autonomous cinema intelligence and media discovery engine engineered to look beyond standard ratings. By analyzing thematic structures, narrative telemetry, and global catalog movements, MOVIEINT bridges the gap between static databases and cognitive film discovery across Hollywood productions, K-dramas, European masterpieces, and Japanese anime.
              </p>
              <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
                <span className="bg-white/[0.03] border border-white/5 px-2.5 py-1 rounded-md">Real-Time Leaderboards</span>
                <span className="bg-white/[0.03] border border-white/5 px-2.5 py-1 rounded-md">Catalog Availability</span>
                <span className="bg-white/[0.03] border border-white/5 px-2.5 py-1 rounded-md">Semantic Vector Search</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Dna className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  How Narrative DNA Works
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Powered by neural contextual models, Narrative DNA decomposes every title into five critical narrative dimensions: storytelling pacing, conceptual complexity, emotional resonance, climax impact, and ending twist potency. This allows viewers to filter cinematic works based on mental bandwidth and mood affinity rather than generic genre buckets.
              </p>
              <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
                <span className="bg-white/[0.03] border border-white/5 px-2.5 py-1 rounded-md">Pacing Telemetry</span>
                <span className="bg-white/[0.03] border border-white/5 px-2.5 py-1 rounded-md">Ending Resolution Scoring</span>
                <span className="bg-white/[0.03] border border-white/5 px-2.5 py-1 rounded-md">Couch Mode Filtering</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
