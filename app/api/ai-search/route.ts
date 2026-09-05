import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const aiResponse = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `You are an expert movie intelligence assistant. Recommend 6 movies strictly matching the user prompt: "${prompt}".
Respond ONLY with a valid JSON array of movie titles as plain strings, with NO markdown formatting, no backticks, and no explanation.
Example format: ["Inception", "Interstellar", "Arrival"]`,
    });

    const responseText = aiResponse.text?.replace(/```json|```/g, "").trim() || "[]";
    const movieTitles: string[] = JSON.parse(responseText);

    const movieDataPromises = movieTitles.map(async (title) => {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(
          title
        )}`
      );
      const data = await res.json();
      return data.results && data.results.length > 0 ? data.results[0] : null;
    });

    const movies = (await Promise.all(movieDataPromises)).filter(Boolean);

    return NextResponse.json({ movies });
  } catch (error) {
    console.error("AI Search Error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}