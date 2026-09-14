// config/intentFilters.ts

export interface IntentFilterConfig {
  slug: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  type: 'genre' | 'mood' | 'runtime' | 'platform';
  filterKey: string;
  filterValue: string | number;
  introText: string;
  faqs: { question: string; answer: string }[];
}

export const INTENT_FILTERS: Record<string, IntentFilterConfig> = {
  // --- Genre Intent ---
  'best-sci-fi-movies': {
    slug: 'best-sci-fi-movies',
    h1: 'Best Sci-Fi Movies of All Time',
    metaTitle: 'Top Rated Sci-Fi Movies Ranked by Narrative DNA | MovieInt',
    metaDescription: 'Discover the greatest science fiction movies analyzed by pacing, mind-bending complexity, and rewatch value.',
    type: 'genre',
    filterKey: 'genres',
    filterValue: 'Sci-Fi',
    introText: 'From speculative futures to cosmic paradoxes, explore science fiction masterworks analyzed for true cinema geeks.',
    faqs: [
      {
        question: 'What is considered the highest-rated sci-fi movie?',
        answer: 'Films like Interstellar, 2001: A Space Odyssey, and The Matrix rank at the top based on Narrative DNA and concept execution.'
      }
    ]
  },
  'best-psychological-movies': {
    slug: 'best-psychological-movies',
    h1: 'Best Psychological Thriller Movies',
    metaTitle: 'Deepest Psychological Thrillers with Twist Potency | MovieInt',
    metaDescription: 'Mind-bending psychological thrillers with high twist potency and intense narrative depth.',
    type: 'genre',
    filterKey: 'genres',
    filterValue: 'Psychological',
    introText: 'Unravel unreliable narrators, paranoia, and fragmented realities.',
    faqs: [
      {
        question: 'What defines a psychological thriller on MovieInt?',
        answer: 'High complexity ratings, emotional paranoia, and unpredictable narrative arcs.'
      }
    ]
  },

  // --- Mood / DNA Intent ---
  'mind-bending-movies': {
    slug: 'mind-bending-movies',
    h1: 'Mind-Bending Movies That Will Break Your Brain',
    metaTitle: 'Top Mind-Bending Movies Ranked by Narrative Complexity | MovieInt',
    metaDescription: 'Explore movies with unmatched narrative complexity, paradoxes, and reality-altering twists.',
    type: 'mood',
    filterKey: 'dnaTags',
    filterValue: 'mind-bending',
    introText: 'Looking for a puzzle? These movies demand your full attention and deliver unforgettable narrative loops.',
    faqs: [
      {
        question: 'What movie has the highest complexity rating?',
        answer: 'Primer, Inception, and Coherence hold top positions in our Narrative Complexity index.'
      }
    ]
  },
  'movies-with-shocking-endings': {
    slug: 'movies-with-shocking-endings',
    h1: 'Movies With Shocking Twist Endings',
    metaTitle: 'Movies with the Highest Twist Potency Scores | MovieInt',
    metaDescription: 'Ranked list of movies that completely subvert expectations in the third act.',
    type: 'mood',
    filterKey: 'dnaTags',
    filterValue: 'shocking-ending',
    introText: 'Cinematic masterclasses in foreshadowing where the ending recontextualizes the whole runtime.',
    faqs: [
      {
        question: 'Are there spoilers in these recommendations?',
        answer: 'No. All twist breakdowns and plot spoilers are shielded behind spoiler protection toggles.'
      }
    ]
  },

  // --- Runtime Intent ---
  'best-movies-under-90-minutes': {
    slug: 'best-movies-under-90-minutes',
    h1: 'Best Movies Under 90 Minutes (Fast Paced & Tight)',
    metaTitle: 'Top Rated Short Movies Under 90 Mins | MovieInt',
    metaDescription: 'High-impact movies with zero filler and tight pacing that finish in under an hour and a half.',
    type: 'runtime',
    filterKey: 'runtimeMax',
    filterValue: 90,
    introText: 'When you want maximum cinematic impact without committing to a 3-hour marathon.',
    faqs: [
      {
        question: 'Why choose a sub-90 minute film?',
        answer: 'These films boast zero boredom risk and rapid narrative acceleration.'
      }
    ]
  },

  // --- Platform Intent ---
  'best-netflix-movies': {
    slug: 'best-netflix-movies',
    h1: 'Best Movies to Stream on Netflix Right Now',
    metaTitle: 'Best Netflix Movies Ranked by MovieInt DNA | MovieInt',
    metaDescription: 'Stop scrolling aimlessly. Discover the best films currently streaming on Netflix.',
    type: 'platform',
    filterKey: 'platforms',
    filterValue: 'netflix',
    introText: 'Curated gems on Netflix vetted by narrative strength, avoiding low-effort algorithmic filler.',
    faqs: [
      {
        question: 'How often is the Netflix library updated?',
        answer: 'Streaming availability is verified regularly using our streaming availability engine.'
      }
    ]
  }
};
