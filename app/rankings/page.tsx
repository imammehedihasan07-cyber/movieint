import { Metadata } from "next";
import RankingsClient from "./RankingsClient";

export const metadata: Metadata = {
  title: "Global Cinema Rankings & Intelligence Leaderboard | MOVIEINT",
  description:
    "Explore real-time worldwide rankings for top-rated, popular, and trending movies powered by narrative intelligence.",
  alternates: {
    canonical: "https://www.movieint.com/rankings",
  },
};

async function getInitialRankings() {
  const apiKey = process.env.TMDB_API_KEY || "b6b9f5e3a64b6ef32e0b8fade33cfe5a";
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&page=1`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Failed to fetch initial rankings:", error);
    return [];
  }
}

export default async function RankingsPage() {
  const initialMovies = await getInitialRankings();

  return (
    <main className="min-h-screen bg-[#05070b] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
          Global Cinema Rankings
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Real-time algorithmic ranking of cinematic achievements, narrative complexity, and critical reception.
        </p>
      </div>

      <RankingsClient initialMovies={initialMovies} />
    </main>
  );
}
