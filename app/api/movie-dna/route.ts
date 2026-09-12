import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// In-Memory Cache Map
const dnaCache = new Map<string, any>();

export async function POST(req: Request) {
  try {
    const { title, overview } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const cacheKey = title.toLowerCase().trim();
    if (dnaCache.has(cacheKey)) {
      return NextResponse.json(dnaCache.get(cacheKey), {
        headers: {
          "Cache-Control": "public, s-maxage=604800, stale-while-revalidate=86400",
        },
      });
    }

    const prompt = `You are a film scholar. Analyze this film strictly based on narrative architecture.
Title: "${title}"
Overview: "${overview || "N/A"}"

Return pure JSON matching this exact structure:
{
  "pacing": "Slow Burn" | "Moderate / Measured" | "High-Velocity / Relentless",
  "pacingScore": number (1 to 10),
  "complexityScore": number (1 to 10),
  "endingImpact": "Mind-Bending Twist" | "Emotional / Resonant" | "Ambiguous / Open" | "Standard Climax",
  "emotionalTone": "e.g. Bleak & Atmospheric, Gripping & Paralyzing, Melancholic Wonder",
  "plotDepth": "Single-Track Narrative" | "Multi-Layered Subplots" | "Non-Linear Matrix",
  "targetAudience": "e.g. A24 Fans, Psychological Thriller Enthusiasts",
  "whyWatch": "A punchy, razor-sharp 15-20 word cinematic verdict."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    let rawText = response.text || "{}";
    rawText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();

    const parsedData = JSON.parse(rawText);

    // Cache the result
    dnaCache.set(cacheKey, parsedData);

    return NextResponse.json(parsedData, {
      headers: {
        "Cache-Control": "public, s-maxage=604800, stale-while-revalidate=86400",
      },
    });
  } catch (error: any) {
    console.error("Movie DNA generation error:", error);
    return NextResponse.json(
      {
        pacing: "Moderate / Measured",
        pacingScore: 6,
        complexityScore: 7,
        endingImpact: "Resonant",
        emotionalTone: "Intriguing & Deep",
        plotDepth: "Multi-Layered Subplots",
        targetAudience: "Cinema Lovers",
        whyWatch: "A compelling narrative driven by atmosphere and thematic depth.",
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=86400",
        },
      }
    );
  }
}
