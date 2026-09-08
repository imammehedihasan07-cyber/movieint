// lib/editorial-data.ts

export interface EditorialMovieItem {
  tmdbId: number | string;
  slugId: string; // e.g. "27205" or "inception" -> maps to /movie/[id]
  title: string;
  year: number;
  director: string;
  runtime: string;
  genres: string[];
  dnaScore: number; // e.g., 9.4
  metrics: {
    complexity: number; // 0-100
    brainpower: number; // 0-100
    twistPotency: number; // 0-100
    pacing: string; // "Deliberate Slow-Burn" | "Relentless Kinetic" | "Precision Cadence"
    endingType: string; // "Ambiguous Multi-Thread" | "Cataclysmic Twist" | "Poetic Resolution"
  };
  whyRecommended: string;
  bestFor: string;
  avoidIf: string;
  streamingOn?: string[];
}

export interface EditorialArticle {
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  publishedDate: string;
  modifiedDate: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  category: 'Lists' | 'Recommendations' | 'Streaming' | 'Deep Dive';
  moodTag: 'Mind-Bending' | 'Psychological' | 'Emotional' | 'Dark' | 'Fast-Paced' | 'Intellectual';
  themeTag: 'Sci-Fi' | 'Crime & Mystery' | 'Time Travel' | 'Existential' | 'Slow-Burn';
  streamingPlatform?: 'Netflix' | 'Prime Video' | 'Disney+' | 'Max' | 'Apple TV';
  readTime: string;
  featured: boolean;
  coverImage: string;
  introText: string;
  keyTakeaways: string[];
  movies: EditorialMovieItem[];
  faqs: { question: string; answer: string }[];
  relatedGuideSlugs: string[];
}

export const EDITORIAL_ARTICLES: EditorialArticle[] = [
  {
    slug: 'best-mind-bending-movies-that-make-you-think',
    title: '15 Best Mind-Bending Movies That Will Break Your Reality (Ranked by Narrative Complexity)',
    seoTitle: 'Best Mind-Bending Movies That Make You Think | MovieINT DNA Guide',
    metaDescription: 'Discover the ultimate ranked list of mind-bending movies that challenge logic, memory, and spacetime. Evaluated using MovieINT Narrative DNA & Brainpower metrics.',
    publishedDate: '2026-08-15T09:00:00Z',
    modifiedDate: '2026-09-08T12:00:00Z',
    author: {
      name: 'MovieINT Cinema Intelligence Lab',
      role: 'Algorithmic Film Archival Team'
    },
    category: 'Lists',
    moodTag: 'Mind-Bending',
    themeTag: 'Sci-Fi',
    readTime: '12 min read',
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop',
    introText: 'True mind-bending cinema is not merely defined by an abrupt last-minute plot twist. It demands intricate narrative architecture, mathematical story pacing, and a commitment to subverting human perception. Using MovieINT’s multidimensional DNA telemetry, we dissect the top psychological puzzles that reward hyper-focused viewing.',
    keyTakeaways: [
      'Narrative architecture that relies on spatial-temporal non-linearity rather than cheap shock value.',
      'Calibrated Brainpower Scores above 85/100 requiring active viewer deduction.',
      'Direct links to MovieINT DNA breakdowns and streaming telemetry.'
    ],
    movies: [
      {
        tmdbId: 27205,
        slugId: '27205',
        title: 'Inception',
        year: 2010,
        director: 'Christopher Nolan',
        runtime: '148 min',
        genres: ['Sci-Fi', 'Action', 'Heist'],
        dnaScore: 9.3,
        metrics: {
          complexity: 94,
          brainpower: 92,
          twistPotency: 91,
          pacing: 'Relentless Synchronized Cadence',
          endingType: 'Ambiguous Totem Equilibrium'
        },
        whyRecommended: 'Nolan executes a simultaneous four-tier dream heist where each layer experiences exponential time dilation. The physics-defying cinematography is grounded by an emotionally devastating core concerning unresolved grief and subconscious traps.',
        bestFor: 'Viewers looking for high-budget theoretical physics fused with psychological puzzle-box mechanics.',
        avoidIf: 'You want a casual background movie where you can look at your phone every five minutes.',
        streamingOn: ['Prime Video', 'Apple TV', 'Max']
      },
      {
        tmdbId: 329865,
        slugId: '329865',
        title: 'Arrival',
        year: 2016,
        director: 'Denis Villeneuve',
        runtime: '116 min',
        genres: ['Sci-Fi', 'Mystery', 'Drama'],
        dnaScore: 9.1,
        metrics: {
          complexity: 92,
          brainpower: 95,
          twistPotency: 96,
          pacing: 'Atmospheric Deliberate Build',
          endingType: 'Non-Linear Philosophical Revelation'
        },
        whyRecommended: 'Arrival subverts alien first-contact tropes through linguistic determinism (the Sapir-Whorf hypothesis). The third act reconfigures the timeline, turning a geopolitical tension thriller into a heartbreaking reflection on destiny and choice.',
        bestFor: 'Fans of cerebral, emotionally profound hard science fiction with philosophical stakes.',
        avoidIf: 'You expect alien laser battles or traditional blockbuster pacing.',
        streamingOn: ['Netflix', 'Paramount+']
      },
      {
        tmdbId: 77,
        slugId: '77',
        title: 'Memento',
        year: 2000,
        director: 'Christopher Nolan',
        runtime: '113 min',
        genres: ['Mystery', 'Psychological Thriller'],
        dnaScore: 8.9,
        metrics: {
          complexity: 96,
          brainpower: 98,
          twistPotency: 94,
          pacing: 'Reverse-Chronological Dissection',
          endingType: 'Devastating Self-Deception Twist'
        },
        whyRecommended: 'Told in alternating reverse-chronological color scenes and chronological black-and-white sequences, Memento forces the viewer into the exact anterograde amnesia experienced by Leonard Shelby.',
        bestFor: 'Lovers of non-linear editing masterclasses and dark psychological character breakdowns.',
        avoidIf: 'You struggle tracking simultaneous chronology inversions.',
        streamingOn: ['Prime Video', 'Tubi']
      },
      {
        tmdbId: 1018,
        slugId: '1018',
        title: 'Mulholland Drive',
        year: 2001,
        director: 'David Lynch',
        runtime: '147 min',
        genres: ['Mystery', 'Drama', 'Psychological Surrealism'],
        dnaScore: 9.0,
        metrics: {
          complexity: 98,
          brainpower: 96,
          twistPotency: 88,
          pacing: 'Hypnotic Dream-State Metronome',
          endingType: 'Surrealist Subconscious Dissolution'
        },
        whyRecommended: 'David Lynch’s masterwork on Hollywood delirium operates under pure dream logic and Freudian projection. It is a psychological labyrinth that refuses simple exposition, demanding instinctual and analytical interpretation.',
        bestFor: 'Viewers intrigued by neo-noir dream psychology and existential dread.',
        avoidIf: 'You require clear, literal exposition answers wrapped up before the credits roll.',
        streamingOn: ['Criterion Channel', 'Apple TV']
      },
      {
        tmdbId: 435,
        slugId: '435',
        title: 'The Prestige',
        year: 2006,
        director: 'Christopher Nolan',
        runtime: '130 min',
        genres: ['Drama', 'Mystery', 'Sci-Fi'],
        dnaScore: 9.2,
        metrics: {
          complexity: 90,
          brainpower: 91,
          twistPotency: 97,
          pacing: 'Tightening Spiral Thriller',
          endingType: 'Dual-Shock Sacrificial Twist'
        },
        whyRecommended: 'Structured intentionally like a three-part magic trick (The Pledge, The Turn, The Prestige), this film examines obsession, rivalry, and human sacrifice with multiple layers of sleight of hand hiding in plain sight.',
        bestFor: 'Fans of obsessive rivalry, historical fiction mixed with Nikola Tesla lore, and jaw-dropping double twists.',
        avoidIf: 'You dislike morally ambiguous characters where no one is truly the hero.',
        streamingOn: ['Apple TV', 'Fandango At Home']
      }
    ],
    faqs: [
      {
        question: 'What makes a movie "Mind-Bending" according to MovieINT DNA?',
        answer: 'MovieINT calculates mind-bending status when a film records a Narrative Complexity index above 85/100, combined with non-linear chronology, perceptive distortion, or subverted cognitive baseline expectations rather than simple jump scares.'
      },
      {
        question: 'Which movie on this list has the highest Brainpower index?',
        answer: 'Memento and Mulholland Drive hold the highest cognitive demands on this guide (98/100 and 96/100 respectively) due to their fragmented chronology and symbolic subconscious structures.'
      },
      {
        question: 'Are the endings spoiled in this guide?',
        answer: 'No. All MovieINT editorial guides strictly follow our Spoiler-Free Index, providing structural descriptions of ending types without revealing plot-critical revelations.'
      }
    ],
    relatedGuideSlugs: [
      'best-movies-like-inception-cerebral-thrillers',
      'best-movies-with-ambiguous-endings-explained',
      'best-psychological-thriller-movies-ranked'
    ]
  },
  {
    slug: 'best-movies-like-inception-cerebral-thrillers',
    title: '10 Movies Like Inception for When You Crave Layered Realities & Heists',
    seoTitle: 'Movies Like Inception: 10 Mind-Bending Cerebral Thrillers | MovieINT',
    metaDescription: 'Obsessed with Inception? Discover 10 cerebral masterpieces featuring dream manipulation, alternate realities, and psychological puzzles matching MovieINT DNA.',
    publishedDate: '2026-08-20T10:30:00Z',
    modifiedDate: '2026-09-08T12:00:00Z',
    author: {
      name: 'MovieINT Cinema Intelligence Lab',
      role: 'Algorithmic Film Archival Team'
    },
    category: 'Recommendations',
    moodTag: 'Intellectual',
    themeTag: 'Sci-Fi',
    readTime: '9 min read',
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
    introText: 'Christopher Nolan’s Inception remains the gold standard for high-concept intellectual blockbusters. If you are searching for films that share its intricate conceptual layering, relentless tempo, and subconscious stakes, here is the curated telemetry shortlist.',
    keyTakeaways: [
      'Focuses on alternate realities, memory manipulation, and psychological heists.',
      'Every entry is indexed with corresponding MovieINT Twist Potency and Brainpower vectors.',
      'Detailed streaming availability and direct comparisons to Inception’s dream mechanics.'
    ],
    movies: [
      {
        tmdbId: 2649,
        slugId: '2649',
        title: 'Paprika',
        year: 2006,
        director: 'Satoshi Kon',
        runtime: '90 min',
        genres: ['Anime', 'Sci-Fi', 'Mystery'],
        dnaScore: 8.8,
        metrics: {
          complexity: 91,
          brainpower: 89,
          twistPotency: 87,
          pacing: 'Kaleidoscopic Surreal Surge',
          endingType: 'Psychoanalytic Catharsis'
        },
        whyRecommended: 'Widely recognized as a direct thematic precursor to Inception, Satoshi Kon’s anime opus delves into stolen DC Mini devices that let therapists enter dreams, resulting in a surreal breakdown between collective dreams and waking reality.',
        bestFor: 'Anime enthusiasts and cinephiles wanting to see the most visually unhinged dream-logic animations ever made.',
        avoidIf: 'You prefer live-action cinema or conventional, grounded visual rules.',
        streamingOn: ['Prime Video', 'Apple TV']
      },
      {
        tmdbId: 62,
        slugId: '62',
        title: '2001: A Space Odyssey',
        year: 1968,
        director: 'Stanley Kubrick',
        runtime: '149 min',
        genres: ['Sci-Fi', 'Mystery'],
        dnaScore: 9.2,
        metrics: {
          complexity: 95,
          brainpower: 96,
          twistPotency: 80,
          pacing: 'Monumental Glacial Velocity',
          endingType: 'Transcendental Star-Child Genesis'
        },
        whyRecommended: 'Where Inception explores inner subconscious space, Kubrick explores humanity’s cosmic destiny. The precision architecture and philosophical ambition mirror Nolan’s obsession with human fragility against monumental structures.',
        bestFor: 'Patients of visual poetry, existential science fiction, and technological AI foreshadowing.',
        avoidIf: 'You get restless during long dialogue-free atmospheric shots.',
        streamingOn: ['Max', 'Apple TV']
      },
      {
        tmdbId: 1124,
        slugId: '1124',
        title: 'The Prestige',
        year: 2006,
        director: 'Christopher Nolan',
        runtime: '130 min',
        genres: ['Drama', 'Mystery'],
        dnaScore: 9.2,
        metrics: {
          complexity: 90,
          brainpower: 91,
          twistPotency: 97,
          pacing: 'Tightening Spiral Thriller',
          endingType: 'Dual-Shock Sacrificial Twist'
        },
        whyRecommended: 'Shares Inception’s obsession with obsessive craftsmen sacrificing their humanity for the illusion of mastery.',
        bestFor: 'Nolan fans who want sharp editing and multi-perspective sleight of hand.',
        avoidIf: 'You prefer lighthearted stories without cynical underpinnings.',
        streamingOn: ['Apple TV']
      }
    ],
    faqs: [
      {
        question: 'Did Satoshi Kon’s Paprika inspire Inception?',
        answer: 'While Christopher Nolan has not cited it explicitly as direct source material, film theorists and critics frequently observe undeniable visual and thematic parallels between Paprika’s hallway gravity shifts and dream invasion concepts.'
      }
    ],
    relatedGuideSlugs: [
      'best-mind-bending-movies-that-make-you-think',
      'best-movies-like-interstellar-cosmic-sci-fi'
    ]
  },
  {
    slug: 'best-psychological-thriller-movies-ranked',
    title: '15 Best Psychological Thrillers of All Time (Ranked by Tension & Twist Potency)',
    seoTitle: 'Best Psychological Thriller Movies of All Time | MovieINT DNA',
    metaDescription: 'Looking for heart-racing psychological thrillers? Explore our data-backed ranking based on MovieINT Tension Index, Pacing Cadence, and Twist Potency.',
    publishedDate: '2026-08-25T11:00:00Z',
    modifiedDate: '2026-09-08T12:00:00Z',
    author: {
      name: 'MovieINT Cinema Intelligence Lab',
      role: 'Algorithmic Film Archival Team'
    },
    category: 'Lists',
    moodTag: 'Psychological',
    themeTag: 'Crime & Mystery',
    readTime: '11 min read',
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop',
    introText: 'A masterclass psychological thriller attacks the audience’s safety from within. Instead of relying on visceral gore or creature features, these films weaponize paranoia, unreliable narrators, and claustrophobic pacing.',
    keyTakeaways: [
      'Tension curves analyzed across acts I, II, and III.',
      'Unreliable narration categorized with MovieINT Twist vectors.',
      'Clear warnings on high psychological distress triggers.'
    ],
    movies: [
      {
        tmdbId: 496243,
        slugId: '496243',
        title: 'Parasite',
        year: 2019,
        director: 'Bong Joon-ho',
        runtime: '132 min',
        genres: ['Thriller', 'Drama', 'Black Comedy'],
        dnaScore: 9.5,
        metrics: {
          complexity: 88,
          brainpower: 89,
          twistPotency: 96,
          pacing: 'Frictionless Escalation Curve',
          endingType: 'Tragic Socioeconomic Trap'
        },
        whyRecommended: 'Bong Joon-ho’s Palme d’Or and Academy Award-winning masterpiece flawlessly pivots from a dry social grift comedy into a suffocating subterranean thriller with surgical structural shifts.',
        bestFor: 'Anyone who values immaculate scene geometry, dark humor, and piercing social commentary.',
        avoidIf: 'You cannot handle sharp genre pivot whiplash mid-film.',
        streamingOn: ['Max', 'Hulu']
      },
      {
        tmdbId: 11324,
        slugId: '11324',
        title: 'Shutter Island',
        year: 2010,
        director: 'Martin Scorsese',
        runtime: '138 min',
        genres: ['Psychological Thriller', 'Mystery'],
        dnaScore: 8.7,
        metrics: {
          complexity: 89,
          brainpower: 88,
          twistPotency: 95,
          pacing: 'Claustrophobic Gothic Paranoia',
          endingType: 'Existential Moral Self-Surrender'
        },
        whyRecommended: 'Scorsese adapts Dennis Lehane’s novel into a tempestuous gothic fever dream where Ashecliffe Hospital acts as an extension of unprocessed wartime and domestic trauma.',
        bestFor: 'Fans of heavy atmosphere, atmospheric dread, and profound final-line questions.',
        avoidIf: 'You are allergic to heavy, dark, melancholic atmospheres.',
        streamingOn: ['Prime Video', 'Paramount+']
      }
    ],
    faqs: [
      {
        question: 'How is Tension Index calculated in MovieINT?',
        answer: 'The MovieINT Tension Index measures scene continuity, audio-visual dissonance, narrative threat escalation, and temporal compression to gauge visceral audience investment.'
      }
    ],
    relatedGuideSlugs: [
      'best-mind-bending-movies-that-make-you-think',
      'best-korean-psychological-thriller-movies'
    ]
  },
  {
    slug: 'best-movies-like-interstellar-cosmic-sci-fi',
    title: '8 Movies Like Interstellar for Cosmic Awe and Emotional Sci-Fi',
    seoTitle: 'Best Movies Like Interstellar: Cosmic Awe & Sci-Fi Ranked | MovieINT',
    metaDescription: 'Craving the emotional resonance and grand scale of Interstellar? Here are the best cosmic and theoretical sci-fi films matched by MovieINT Emotional Impact.',
    publishedDate: '2026-08-28T14:00:00Z',
    modifiedDate: '2026-09-08T12:00:00Z',
    author: {
      name: 'MovieINT Cinema Intelligence Lab',
      role: 'Algorithmic Film Archival Team'
    },
    category: 'Recommendations',
    moodTag: 'Emotional',
    themeTag: 'Sci-Fi',
    readTime: '8 min read',
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
    introText: 'Interstellar succeeded because its physics simulations and time-dilation horrors were anchored by a father’s promise to his daughter. Finding movies that marry massive astrophysical scope with authentic emotional tears is rare.',
    keyTakeaways: [
      'Films featuring relativistic time mechanics and human emotional bonds.',
      'High cinematic scale with sweeping acoustic or synthesized scoring.',
      'MovieINT Emotional Resonance Index above 85/100.'
    ],
    movies: [
      {
        tmdbId: 157336,
        slugId: '157336',
        title: 'Interstellar',
        year: 2014,
        director: 'Christopher Nolan',
        runtime: '169 min',
        genres: ['Sci-Fi', 'Drama', 'Adventure'],
        dnaScore: 9.4,
        metrics: {
          complexity: 88,
          brainpower: 90,
          twistPotency: 89,
          pacing: 'Majestic Accelerating Odyssey',
          endingType: 'Trans-Dimensional Reconnection'
        },
        whyRecommended: 'Grounded in theoretical physics by Nobel laureate Kip Thorne and backed by Hans Zimmer’s organ-driven score, it remains an unparalleled achievement in modern humanistic sci-fi.',
        bestFor: 'Those who want grand astrophysical wonder without sacrificing emotional catharsis.',
        avoidIf: 'You are cynical about love being framed as a quantifiable physical dimension.',
        streamingOn: ['Prime Video', 'Paramount+']
      },
      {
        tmdbId: 286217,
        slugId: '286217',
        title: 'The Martian',
        year: 2015,
        director: 'Ridley Scott',
        runtime: '144 min',
        genres: ['Sci-Fi', 'Adventure', 'Drama'],
        dnaScore: 8.6,
        metrics: {
          complexity: 78,
          brainpower: 84,
          twistPotency: 72,
          pacing: 'Resourceful Survival Rhythm',
          endingType: 'Triumphant Global Solidarity'
        },
        whyRecommended: 'While more comedic and procedurally optimistic than Interstellar, it captures the raw ingenuity of humanity against an indifferent cosmos.',
        bestFor: 'Anyone seeking uplifting hard science, problem-solving ingenuity, and optimistic human spirit.',
        avoidIf: 'You want deep psychological dread or surreal time mechanics.',
        streamingOn: ['Max', 'Apple TV']
      }
    ],
    faqs: [
      {
        question: 'Which movie is most similar in emotional impact to Interstellar?',
        answer: 'Denis Villeneuve’s Arrival and Robert Zemeckis’s Contact share the closest balance of scientific curiosity and profound personal grief.'
      }
    ],
    relatedGuideSlugs: [
      'best-mind-bending-movies-that-make-you-think',
      'best-sci-fi-movies-of-the-decade'
    ]
  },
  {
    slug: 'best-movies-with-ambiguous-endings-explained',
    title: 'Top 10 Movies With Ambiguous Endings That Still Spark Arguments',
    seoTitle: 'Best Movies With Ambiguous Endings Explained | MovieINT DNA',
    metaDescription: 'Dissecting cinema’s most famous unresolved conclusions. How MovieINT Narrative DNA decodes deliberate open-ended finales without ruining the mystery.',
    publishedDate: '2026-09-01T15:00:00Z',
    modifiedDate: '2026-09-08T12:00:00Z',
    author: {
      name: 'MovieINT Cinema Intelligence Lab',
      role: 'Algorithmic Film Archival Team'
    },
    category: 'Deep Dive',
    moodTag: 'Intellectual',
    themeTag: 'Existential',
    readTime: '10 min read',
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop',
    introText: 'A great ambiguous ending is not a cop-out or an unfinished screenplay; it is a mirror held up to the viewer. Depending on your psychological temperament, the final frame shifts meaning entirely.',
    keyTakeaways: [
      'Analysis of Inception, Total Recall, Birdman, and Blade Runner.',
      'The difference between thematic ambiguity and plot confusion.',
      'MovieINT Ending Resolution scoring system applied.'
    ],
    movies: [
      {
        tmdbId: 27205,
        slugId: '27205',
        title: 'Inception',
        year: 2010,
        director: 'Christopher Nolan',
        runtime: '148 min',
        genres: ['Sci-Fi', 'Action'],
        dnaScore: 9.3,
        metrics: {
          complexity: 94,
          brainpower: 92,
          twistPotency: 91,
          pacing: 'Relentless Synchronized Cadence',
          endingType: 'Ambiguous Totem Equilibrium'
        },
        whyRecommended: 'The spinning top remains cinema’s quintessential ambiguity question—yet Nolan’s true point is that Cobb walks away before seeing whether it wobbles or falls.',
        bestFor: 'Analytical debates on catharsis versus reality.',
        avoidIf: 'You require binary closure.',
        streamingOn: ['Prime Video']
      }
    ],
    faqs: [
      {
        question: 'Does Cobb’s totem fall at the end of Inception?',
        answer: 'Sound mix cues in the final milliseconds reveal a faint wobble and audio pitch drop, but Nolan intentionally cuts to black to show that Cobb no longer cares whether he is in a dream or reality—he has chosen his emotional truth.'
      }
    ],
    relatedGuideSlugs: [
      'best-mind-bending-movies-that-make-you-think',
      'best-psychological-thriller-movies-ranked'
    ]
  },
  {
    slug: 'best-korean-psychological-thriller-movies',
    title: '12 Best Korean Psychological Thrillers That Surpass Hollywood Intensity',
    seoTitle: 'Best Korean Psychological Thrillers | MovieINT Cinema Intelligence',
    metaDescription: 'From Memories of Murder to The Wailing and Oldboy. Explore the finest South Korean psychological thrillers indexed with MovieINT narrative telemetry.',
    publishedDate: '2026-09-03T16:00:00Z',
    modifiedDate: '2026-09-08T12:00:00Z',
    author: {
      name: 'MovieINT Cinema Intelligence Lab',
      role: 'Algorithmic Film Archival Team'
    },
    category: 'Lists',
    moodTag: 'Dark',
    themeTag: 'Crime & Mystery',
    readTime: '13 min read',
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=1200&auto=format&fit=crop',
    introText: 'South Korean cinema has continually pushed the boundary of emotional devastation and psychological tension. Where Western thrillers often compromise for clean moral endings, Korean filmmakers dig fearlessly into moral decay, class warfare, and spiritual dread.',
    keyTakeaways: [
      'Immersion into South Korea’s unique socio-political tension.',
      'Uncompromising twist executions that break conventional narrative formulas.',
      'Telemetry on pacing and emotional trauma curves.'
    ],
    movies: [
      {
        tmdbId: 496243,
        slugId: '496243',
        title: 'Parasite',
        year: 2019,
        director: 'Bong Joon-ho',
        runtime: '132 min',
        genres: ['Thriller', 'Drama'],
        dnaScore: 9.5,
        metrics: {
          complexity: 88,
          brainpower: 89,
          twistPotency: 96,
          pacing: 'Frictionless Escalation Curve',
          endingType: 'Tragic Socioeconomic Trap'
        },
        whyRecommended: 'Flawlessly balances social satire with heart-stopping basement horror.',
        bestFor: 'Those who appreciate sharp metaphors and immaculate spatial framing.',
        avoidIf: 'You want a standard predictable thriller with moral absolutes.',
        streamingOn: ['Max', 'Hulu']
      }
    ],
    faqs: [
      {
        question: 'Why are Korean psychological thrillers considered more intense?',
        answer: 'Korean cinema frequently avoids traditional Hollywood moral redemption arcs, prioritizing raw human consequences, visceral revenge ethics, and unpredictable tonal shifts.'
      }
    ],
    relatedGuideSlugs: [
      'best-psychological-thriller-movies-ranked',
      'best-movies-with-insane-plot-twists'
    ]
  },
  {
    slug: 'best-movies-with-insane-plot-twists',
    title: 'Top 10 Movies With Insane Plot Twists That Change Everything on Rewatch',
    seoTitle: 'Best Movies With Insane Plot Twists (Ranked by Twist Potency) | MovieINT',
    metaDescription: 'Plot twists that hold up under forensic scrutiny. Ranked using the MovieINT Twist Potency Index and Narrative Consistency Engine.',
    publishedDate: '2026-09-04T12:00:00Z',
    modifiedDate: '2026-09-08T12:00:00Z',
    author: {
      name: 'MovieINT Cinema Intelligence Lab',
      role: 'Algorithmic Film Archival Team'
    },
    category: 'Lists',
    moodTag: 'Mind-Bending',
    themeTag: 'Crime & Mystery',
    readTime: '10 min read',
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200&auto=format&fit=crop',
    introText: 'A cheap twist relies on withholding basic facts; a brilliant twist hides the truth in broad daylight. Here are the most satisfying cinematic twists that rewrite the entire film once revealed.',
    keyTakeaways: [
      'Twist Potency scores evaluated from 1 to 100.',
      'High Rewatch Value index for forensically placed visual clues.',
      'Completely spoiler-free overview of thematic hooks.'
    ],
    movies: [
      {
        tmdbId: 435,
        slugId: '435',
        title: 'The Prestige',
        year: 2006,
        director: 'Christopher Nolan',
        runtime: '130 min',
        genres: ['Drama', 'Mystery', 'Sci-Fi'],
        dnaScore: 9.2,
        metrics: {
          complexity: 90,
          brainpower: 91,
          twistPotency: 97,
          pacing: 'Tightening Spiral Thriller',
          endingType: 'Dual-Shock Sacrificial Twist'
        },
        whyRecommended: 'Every single line of dialogue foreshadows the ending; on second watch, it feels like a completely different motion picture.',
        bestFor: 'Lovers of obsessive puzzles.',
        avoidIf: 'You do not like dark rivalries.',
        streamingOn: ['Apple TV']
      }
    ],
    faqs: [
      {
        question: 'What is MovieINT Twist Potency?',
        answer: 'Twist Potency is our composite score measuring structural surprise against internal story logic, evaluating whether the reveal enriches the preceding film or breaks believability.'
      }
    ],
    relatedGuideSlugs: [
      'best-mind-bending-movies-that-make-you-think',
      'best-psychological-thriller-movies-ranked'
    ]
  },
  {
    slug: 'best-slow-burn-thriller-movies',
    title: 'The 10 Best Slow-Burn Thrillers That Build Unbearable Dread',
    seoTitle: 'Best Slow-Burn Thriller Movies Ranked | MovieINT Atmospheric Telemetry',
    metaDescription: 'Tired of frenetic fast-cut action? Explore masterclass slow-burn thrillers that simmer with methodical tension, analyzed by MovieINT pacing telemetry.',
    publishedDate: '2026-09-05T10:00:00Z',
    modifiedDate: '2026-09-08T12:00:00Z',
    author: {
      name: 'MovieINT Cinema Intelligence Lab',
      role: 'Algorithmic Film Archival Team'
    },
    category: 'Lists',
    moodTag: 'Dark',
    themeTag: 'Slow-Burn',
    readTime: '9 min read',
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=1200&auto=format&fit=crop',
    introText: 'Slow-burn cinema demands patience and pays off in psychological paralysis. These films build like a pressure cooker until the valve detonates.',
    keyTakeaways: [
      'Calibrated Pacing Cadence indexing deliberate dread accumulation.',
      'Atmospheric audio design and unhurried cinematography.',
      'Zero jump-scare reliance.'
    ],
    movies: [
      {
        tmdbId: 807,
        slugId: '807',
        title: 'Se7en',
        year: 1995,
        director: 'David Fincher',
        runtime: '127 min',
        genres: ['Crime', 'Mystery', 'Thriller'],
        dnaScore: 9.3,
        metrics: {
          complexity: 86,
          brainpower: 88,
          twistPotency: 98,
          pacing: 'Methodical Procedural Descent',
          endingType: 'Devastating Box Climax'
        },
        whyRecommended: 'Fincher’s rain-soaked neo-noir creates an inescapable pall of urban decay culminating in cinema’s ultimate climax checkmate.',
        bestFor: 'Crime buffs who appreciate forensic detail and bleak moral realism.',
        avoidIf: 'You cannot tolerate graphic crime scene investigation themes.',
        streamingOn: ['Max', 'Apple TV']
      }
    ],
    faqs: [
      {
        question: 'What defines a slow-burn film on MovieINT?',
        answer: 'Films categorized under Slow-Burn exhibit extended shot lengths, dialogue-sparse exposition, and deliberate atmospheric dread rather than rapid cuts and kinetic set pieces.'
      }
    ],
    relatedGuideSlugs: [
      'best-psychological-thriller-movies-ranked',
      'best-korean-psychological-thriller-movies'
    ]
  }
];

export function getEditorialBySlug(slug: string): EditorialArticle | undefined {
  return EDITORIAL_ARTICLES.find((art) => art.slug === slug);
}

export function getAllEditorialSlugs(): string[] {
  return EDITORIAL_ARTICLES.map((art) => art.slug);
}

export function getRelatedArticles(currentSlug: string, count: number = 3): EditorialArticle[] {
  const current = getEditorialBySlug(currentSlug);
  if (!current) return EDITORIAL_ARTICLES.slice(0, count);

  return EDITORIAL_ARTICLES.filter((art) => art.slug !== currentSlug)
    .sort((a, b) => {
      const matchA = (a.category === current.category ? 2 : 0) + (a.moodTag === current.moodTag ? 2 : 0);
      const matchB = (b.category === current.category ? 2 : 0) + (b.moodTag === current.moodTag ? 2 : 0);
      return matchB - matchA;
    })
    .slice(0, count);
}
