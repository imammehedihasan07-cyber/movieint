import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { title, overview } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Title required" }, { status: 400 });
    }

    const prompt = `You are a film psychology and narrative architecture expert.
A viewer loved the film "${title}" (Context: "${overview || "N/A"}").

Recommend 3 distinct movies that share its exact narrative frequency, emotional undertone, or twist mechanics.
For each film, explain SPECIFICALLY why a fan of "${title}" will appreciate it (e.g. "Because both explore...").

Return pure JSON array matching this format:
[
  {
    "title": "Exact Movie Title",
    "year": "Release Year",
    "coreLink": "Short tagline like 'Shared Existential Dread' or 'Non-Linear Twist Mechanic'",
    "reason": "Because both balance [specific thematic similarity] while delivering [narrative payoff]. (15-20 words)"
  }
]`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.25,
      },
    });

    const suggestions = JSON.parse(response.text || "[]");

    // Fetch poster and TMDB ID for each match
    const enriched = await Promise.all(
      suggestions.map(async (item: any) => {
        try {
          const res = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(
              item.title
            )}&year=${item.year || ""}`
          );
          const data = await res.json();
          const match = data.results?.[0];
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

    return NextResponse.json(enriched);
  } catch (error) {
    console.error("Vibe Match API error:", error);
    return NextResponse.json([]);
  }
}