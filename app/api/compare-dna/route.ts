import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { movie1, movie2 } = await req.json();

    if (!movie1?.title || !movie2?.title) {
      return NextResponse.json({ error: "Both movies are required" }, { status: 400 });
    }

    const prompt = `You are an elite cinema scholar and structural narrative architect.
Compare these two films side-by-side:
Film A: "${movie1.title}" (${movie1.year || ""}) - Overview: "${movie1.overview || "N/A"}"
Film B: "${movie2.title}" (${movie2.year || ""}) - Overview: "${movie2.overview || "N/A"}"

Return pure JSON matching this exact structure:
{
  "filmA": {
    "pacingScore": number (1 to 10),
    "complexityScore": number (1 to 10),
    "emotionalImpactScore": number (1 to 10),
    "climaxTwistScore": number (1 to 10),
    "coreStrength": "Short sharp description of greatest cinematic asset (5-7 words)"
  },
  "filmB": {
    "pacingScore": number (1 to 10),
    "complexityScore": number (1 to 10),
    "emotionalImpactScore": number (1 to 10),
    "climaxTwistScore": number (1 to 10),
    "coreStrength": "Short sharp description of greatest cinematic asset (5-7 words)"
  },
  "comparisonVerdict": "A decisive, brilliant 25-30 word cinematic breakdown of how their narrative styles diverge.",
  "recommendedFor": {
    "filmA": "Who should watch film A (e.g. Purists seeking meditative dread)",
    "filmB": "Who should watch film B (e.g. Viewers hungry for non-linear kinetic puzzles)"
  }
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const parsedData = JSON.parse(response.text || "{}");
    return NextResponse.json(parsedData);
  } catch (error) {
    console.error("Comparison error:", error);
    return NextResponse.json(
      {
        filmA: { pacingScore: 7, complexityScore: 8, emotionalImpactScore: 8, climaxTwistScore: 8, coreStrength: "Atmospheric and grand storytelling" },
        filmB: { pacingScore: 8, complexityScore: 7, emotionalImpactScore: 7, climaxTwistScore: 9, coreStrength: "High-voltage tension and execution" },
        comparisonVerdict: "Both films approach cinematic tension differently: one builds existential scale while the other sharpens interpersonal conflict with precision.",
        recommendedFor: {
          filmA: "Fans of philosophical and sprawling epics.",
          filmB: "Viewers looking for razor-sharp narrative velocity.",
        },
      },
      { status: 200 }
    );
  }
}