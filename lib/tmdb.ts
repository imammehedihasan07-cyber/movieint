export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
}

export async function getTrendingMovies(): Promise<Movie[]> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return [];

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch {
    return [];
  }
}