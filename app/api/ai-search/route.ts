import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const TMDB_API_KEY = process.env.TMDB_API_KEY || "b6b9f5e3a64b6ef32e0b8fade33cfe5a";

// মেমোরিতে রেজাল্ট ক্যাশ রাখা
const searchCache = new Map<string, any>();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const searchQuery = (body.query || body.prompt || "").trim();

    if (!searchQuery) {
      return NextResponse.json({ error: "Query or prompt is required" }, { status: 400 });
    }

    const cacheKey = searchQuery.toLowerCase();
    if (searchCache.has(cacheKey)) {
      return NextResponse.json(
        { movies: searchCache.get(cacheKey) },
        {
          headers: {
            "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
          },
        }
      );
    }

    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an expert movie intelligence assistant. Recommend 6 movies strictly matching the theme or prompt: "${searchQuery}".
Respond ONLY with a valid JSON array of movie titles as plain strings, with NO markdown formatting, no backticks, and no explanation.
Example format: ["Inception", "Interstellar", "Arrival"]`,
    });

    const responseText = aiResponse.text?.replace(/```json|```/g, "").trim() || "[]";
    let movieTitles: string[] = [];

    try {
      movieTitles = JSON.parse(responseText);
    } catch {
      movieTitles = responseText
        .split("\n")
        .map((t) => t.replace(/^[0-9-.*]+\s*/, "").replace(/["']/g, "").trim())
        .filter(Boolean)
        .slice(0, 6);
    }

    const movieDataPromises = movieTitles.map(async (title) => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
            title
          )}`,
          { next: { revalidate: 86400 } }
        );
        const data = await res.json();
        return data.results && data.results.length > 0 ? data.results[0] : null;
      } catch {
        return null;
      }
    });

    const movies = (await Promise.all(movieDataPromises)).filter(Boolean);

    // ক্যাশে সংরক্ষণ
    searchCache.set(cacheKey, movies);

    return NextResponse.json(
      { movies },
      {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
        },
      }
    );
  } catch (error) {
    console.error("AI Search Error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
