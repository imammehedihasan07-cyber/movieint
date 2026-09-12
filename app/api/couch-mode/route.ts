import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// In-Memory Cache
const couchCache = new Map<string, any>();

export async function POST(req: Request) {
  try {
    const { energy, mood, time } = await req.json();

    const cacheKey = `${energy}-${mood}-${time}`.toLowerCase().trim();
    if (couchCache.has(cacheKey)) {
      return NextResponse.json(couchCache.get(cacheKey), {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
        },
      });
    }

    const prompt = `You are an elite cinema concierge.
A viewer wants a personalized movie recommendation based on these exact criteria:
- Mental Energy / Focus: "${energy}" (e.g. Brain-dead / comfort vs Complex / High-IQ focus)
- Emotional Mood: "${mood}" (e.g. Adrenaline rush, Dark & Gritty, Melancholic, Laugh out loud)
- Available Time: "${time}" (e.g. Under 90 mins, standard 2 hrs, epic 3 hrs)

Select 3 distinct films that mathematically match this vibe profile.
Return pure JSON with this exact array structure:
[
  {
    "title": "Exact Movie Title",
    "year": "Release Year",
    "matchReason": "A sharp, persuasive 15-20 word explanation on why this fits their current exact mood.",
    "vibeTag": "e.g. Hypnotic Mystery, Adrenaline Blast, Pure Comfort"
  }
]`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    });

    const suggestions = JSON.parse(response.text || "[]");

    const enrichedResults = await Promise.all(
      suggestions.map(async (item: any) => {
        try {
          const tmdbRes = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(
              item.title
            )}&year=${item.year || ""}`,
            { next: { revalidate: 604800 } }
          );
          const tmdbData = await tmdbRes.json();
          const match = tmdbData.results?.[0];
          return {
            ...item,
            id: match?.id || null,
            poster_path: match?.poster_path || null,
            vote_average: match?.vote_average || 0,
          };
        } catch {
          return item;
        }
      })
    );

    couchCache.set(cacheKey, enrichedResults);

    return NextResponse.json(enrichedResults, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
      },
    });
  } catch (error) {
    console.error("Couch Mode error:", error);
    return NextResponse.json(
      [
        {
          title: "Knives Out",
          year: "2019",
          matchReason: "A razor-sharp, energetic whodunit packed with charismatic humor and effortless pacing.",
          vibeTag: "Clever & Engaging",
          vote_average: 7.9,
        },
      ],
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=86400",
        },
      }
    );
  }
}
