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

    const prompt = `You are a film narrative psychologist.
Analyze this film/series: "${title}" (Context: "${overview || "N/A"}").

Provide a spoiler-free evaluation of its twist/climax mechanics and pacing risk.
DO NOT REVEAL ANY PLOT SECRETS OR ENDING DETAILS.

Return pure JSON matching this exact structure:
{
  "mindFuckScore": number (1 to 10, e.g. 9.4 for Shutter Island/Fight Club, 4.0 for standard action),
  "boredomRisk": "Low" | "Moderate" | "High",
  "pacingStyle": "Slow Burn" | "Rollercoaster" | "Methodical Pulse" | "Relentless Kinetic",
  "climaxAdvisory": "A 10-15 word strict instruction on how to watch the ending (e.g. 'Ensure zero phone distractions during the final 20 minutes for maximum payoff.')",
  "rewatchValue": "Essential" | "High" | "Moderate" | "One-Time Ride"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.15,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Climax Index Error:", error);
    return NextResponse.json({
      mindFuckScore: 8.2,
      boredomRisk: "Low",
      pacingStyle: "Methodical Pulse",
      climaxAdvisory: "Maintain complete focus in the final act to catch subtle narrative breadcrumbs.",
      rewatchValue: "High",
    });
  }
}