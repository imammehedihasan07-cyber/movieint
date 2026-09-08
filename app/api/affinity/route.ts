// app/api/affinity/route.ts
import { NextResponse } from 'next/server';

function getSafeMetrics(title: string, id: number | string, isAnime: boolean, isAnimation: boolean, isKdrama: boolean) {
  const str = `${title || 'Title'}-${id || '0'}`;
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  const pos = Math.abs(hash);

  const complexities = isAnime ? [85, 92, 88, 94] : isAnimation ? [64, 70, 75, 68] : [78, 86, 91, 84, 89];
  const emotions = (isAnime || isKdrama) ? [94, 98, 91, 95] : isAnimation ? [75, 82, 78, 85] : [82, 88, 91, 85, 94];

  const pacings = isAnime
    ? ['Dynamic Shonen Momentum', 'Tactical Psychological Duel', 'Expansive World-Building Pace', 'Contemplative Melancholic Cadence']
    : isKdrama
    ? ['High-Tension Cliffhanger Pacing', 'Emotional Slow-Burn Escalation', 'Intricate Revenge Tempo', 'Methodical Procedural Simmer']
    : isAnimation
    ? ['High-Spirited Comedic Velocity', 'Brisk Kinetic Adventure', 'Whimsical Rhythmic Cadence', 'Playful Vibrant Momentum']
    : ['Atmospheric Deliberate Build', 'Tightening Spiral Thriller', 'Relentless Synchronized Cadence', 'Methodical Procedural Simmer'];

  const endings = isAnime
    ? ['Philosophical Catharsis', 'Bittersweet Transcendent Farewell', 'Sublime Emotional Climax', 'Triumphant Destiny Resolution']
    : isKdrama
    ? ['Devastating Moral Retribution', 'Poetic Melancholic Closure', 'High-Stakes Resolution', 'Uncompromising Karmic Payoff']
    : isAnimation
    ? ['Triumphant Heartwarming Resolution', 'Celebratory Comedic Payoff', 'Uplifting Solidarity', 'Joyful Whimsical Climax']
    : ['Non-Linear Revelation', 'Ambiguous Equilibrium', 'Existential Resolution', 'Devastating Psychological Climax'];

  return {
    complexity: complexities[pos % complexities.length] ?? 82,
    emotionalDepth: emotions[Math.floor(pos / 7) % emotions.length] ?? 88,
    pacing: pacings[Math.floor(pos / 13) % pacings.length] ?? 'Atmospheric Deliberate Build',
    endingType: endings[Math.floor(pos / 19) % endings.length] ?? 'Philosophical Catharsis',
    affinityScore: 84 + (pos % 13),
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rawId = searchParams.get('id') || '';
    const currentTitle = searchParams.get('title') || 'Movie';
    const lang = (searchParams.get('lang') || '').toLowerCase();
    const genreIdsParam = searchParams.get('genres') || '';

    const isTv = rawId.startsWith('tv-') || rawId.startsWith('series-');
    const cleanId = rawId.replace(/^(tv-|series-|movie-)/, '');
    const endpointType = isTv ? 'tv' : 'movie';
    const apiKey = process.env.TMDB_API_KEY || 'b6b9f5e3a64b6ef32e0b8fade33cfe5a';

    const genreIds = genreIdsParam.split(',').filter(Boolean).map(Number);
    const isAnime = lang === 'ja';
    const isKdrama = lang === 'ko';
    const isAnimation = genreIds.includes(16);

    let rawList: any[] = [];

    // Quick TMDB Fetch with 3-second hard timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    try {
      const recRes = await fetch(
        `https://api.themoviedb.org/3/${endpointType}/${cleanId}/recommendations?api_key=${apiKey}&page=1`,
        { signal: controller.signal }
      );
      if (recRes.ok) {
        const data = await recRes.json();
        if (Array.isArray(data.results) && data.results.length > 0) {
          rawList = data.results;
        }
      }

      if (rawList.length < 4) {
        const simRes = await fetch(
          `https://api.themoviedb.org/3/${endpointType}/${cleanId}/similar?api_key=${apiKey}&page=1`,
          { signal: controller.signal }
        );
        if (simRes.ok) {
          const simData = await simRes.json();
          if (Array.isArray(simData.results)) {
            rawList = [...rawList, ...simData.results];
          }
        }
      }

      if (rawList.length < 4) {
        const genreQuery = genreIds.length > 0 ? `&with_genres=${genreIds.slice(0, 2).join(',')}` : '';
        const langQuery = isAnime ? '&with_original_language=ja' : isKdrama ? '&with_original_language=ko' : '';
        const discRes = await fetch(
          `https://api.themoviedb.org/3/discover/${endpointType}?api_key=${apiKey}&sort_by=popularity.desc&page=1${genreQuery}${langQuery}`,
          { signal: controller.signal }
        );
        if (discRes.ok) {
          const discData = await discRes.json();
          if (Array.isArray(discData.results)) {
            rawList = [...rawList, ...discData.results];
          }
        }
      }
    } catch {
      // Ignore network timeout gracefully
    } finally {
      clearTimeout(timeout);
    }

    const seenIds = new Set<string>([String(cleanId), String(rawId)]);
    const cleanList = (rawList || []).filter((item: any) => {
      if (!item || !item.id || !item.poster_path) return false;
      const sId = String(item.id);
      if (seenIds.has(sId)) return false;
      seenIds.add(sId);
      return true;
    });

    let finalList = cleanList;
    if (isAnime) {
      const animeMatches = cleanList.filter((m: any) => m.original_language === 'ja');
      if (animeMatches.length >= 2) finalList = animeMatches;
    } else if (isKdrama) {
      const kdramaMatches = cleanList.filter((m: any) => m.original_language === 'ko');
      if (kdramaMatches.length >= 2) finalList = kdramaMatches;
    } else if (isAnimation) {
      const animMatches = cleanList.filter((m: any) => (m.genre_ids && m.genre_ids.includes(16)) || m.original_language !== 'ja');
      if (animMatches.length >= 2) finalList = animMatches;
    }

    const selected = finalList.slice(0, 4).map((item: any) => {
      const itemTitle = item.title || item.name || 'Cinematic Title';
      const itemDate = item.release_date || item.first_air_date || '';
      const itemYear = itemDate.split('-')[0] || 'Recent';
      const targetId = isTv ? `tv-${item.id}` : String(item.id);
      const itemIsAnime = item.original_language === 'ja';
      const itemIsAnimation = (item.genre_ids && item.genre_ids.includes(16)) || isAnimation;
      const metrics = getSafeMetrics(itemTitle, item.id, itemIsAnime, itemIsAnimation, isKdrama);

      let mediaTypeBadge = isTv ? 'SERIES' : 'FEATURE FILM';
      if (itemIsAnime) mediaTypeBadge = 'ANIME';
      else if (item.original_language === 'ko' && isTv) mediaTypeBadge = 'K-DRAMA';
      else if (itemIsAnimation) mediaTypeBadge = 'ANIMATION';

      let whyMatches = `Shares ${currentTitle}'s narrative energy, balancing a ${metrics.pacing.toLowerCase()} with a ${metrics.endingType.toLowerCase()}.`;
      if (itemIsAnimation && !itemIsAnime) {
        whyMatches = `Parallels the spirited comedic timing, vibrant animation style, and narrative momentum of ${currentTitle}.`;
      } else if (itemIsAnime) {
        whyMatches = `Resonates with ${currentTitle}'s intricate thematic architecture and high emotional depth (${metrics.emotionalDepth}/100).`;
      }

      return {
        id: targetId,
        title: itemTitle,
        year: itemYear,
        posterPath: item.poster_path,
        affinityScore: metrics.affinityScore,
        complexity: metrics.complexity,
        emotionalDepth: metrics.emotionalDepth,
        pacing: metrics.pacing,
        endingType: metrics.endingType,
        primaryHook: item.overview ? item.overview.slice(0, 52).trim() + '...' : 'Intricate Narrative DNA Resonance',
        whyMatches,
        mediaTypeBadge
      };
    });

    return NextResponse.json({ results: selected });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
