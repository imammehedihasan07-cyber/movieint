// lib/getFilteredMovies.ts
import { INTENT_FILTERS, IntentFilterConfig } from '@/config/intentFilters';

export interface MovieItem {
  id: string;
  slug: string;
  title: string;
  year: number;
  posterUrl: string;
  backdropUrl?: string;
  runtime: number; // in minutes
  genres: string[];
  dnaTags?: string[];
  streamingPlatforms?: string[]; // e.g., ['netflix', 'prime', 'apple']
  synopsis: string;
  ratings: {
    imdb?: number;
    movieIntDnaScore?: number;
  };
  metrics: {
    pacing: 'Rapid' | 'Balanced' | 'Slow-burn' | string;
    complexityScore: number; // 1-10
    twistPotency: number; // 1-10
    boredomRisk: 'Very Low' | 'Low' | 'Moderate' | string;
    rewatchValue: number; // 1-10
  };
}

export async function getMoviesByIntent(config: IntentFilterConfig): Promise<MovieItem[]> {
  // Load source dataset (compatible with Edge Runtime / in-memory cache)
  const allMovies: MovieItem[] = []; 

  return allMovies
    .filter((movie) => {
      switch (config.type) {
        case 'genre':
          return movie.genres?.some(
            (g) => g.toLowerCase() === String(config.filterValue).toLowerCase()
          );
        case 'mood':
          return movie.dnaTags?.some(
            (tag) => tag.toLowerCase() === String(config.filterValue).toLowerCase()
          );
        case 'runtime':
          return movie.runtime <= Number(config.filterValue);
        case 'platform':
          return movie.streamingPlatforms?.some(
            (platform) => platform.toLowerCase() === String(config.filterValue).toLowerCase()
          );
        default:
          return true;
      }
    })
    .sort((a, b) => (b.ratings.movieIntDnaScore ?? 0) - (a.ratings.movieIntDnaScore ?? 0))
    .slice(0, 20);
}
