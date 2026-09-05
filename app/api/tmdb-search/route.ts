import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ results: [] });
  }

  try {
    // search/multi returns Movies, TV Series, and Worldwide Shows
    const res = await fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=${process.env.TMDB_API_KEY || "b6b9f5e3a64b6ef32e0b8fade33cfe5a"}&query=${encodeURIComponent(
        query
      )}&include_adult=false&page=1`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return NextResponse.json({ results: [] });
    const data = await res.json();
    
    // Filter out people, only keep movie & tv series
    const mediaResults = (data.results || [])
      .filter((item: any) => item.media_type === "movie" || item.media_type === "tv")
      .slice(0, 7)
      .map((item: any) => ({
        id: item.id,
        title: item.title || item.name,
        media_type: item.media_type,
        poster_path: item.poster_path,
        release_date: item.release_date || item.first_air_date || "",
        vote_average: item.vote_average || 0,
        overview: item.overview || "",
        origin_country: item.origin_country?.[0] || "",
      }));

    return NextResponse.json({ results: mediaResults });
  } catch {
    return NextResponse.json({ results: [] });
  }
}