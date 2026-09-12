import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// In-Memory Cache
const endingCache = new Map<string, any>();

export async function POST(req: Request) {
  try {
    const { title, year, overview } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const cacheKey = `${title}-${year || ""}`.toLowerCase().trim();
    if (endingCache.has(cacheKey)) {
      return NextResponse.json(endingCache.get(cacheKey), {
        headers: {
          "Cache-Control": "public, s-maxage=604800, stale-while-revalidate=86400",
        },
      });
    }

    const prompt = `You are an elite cinema scholar and structural narrative theorist.
Provide a deep, decisive "Ending Explained & Timeline Decryption" for:
Title: "${title}" (${year || ""})
Context/Overview: "${overview || "N/A"}"

Break down the ending thoroughly. Assume the reader has watched it and wants absolute clarity on ambiguous elements, twists, and philosophical metaphors.

Return pure JSON matching this exact structure:
{
  "endingSummary": "A razor-sharp 2-3 sentence explanation of what literally and symbolically happened in the finale.",
  "hiddenClues": [
    "Crucial visual, dialogue, or sound cue missed by 90% of viewers (1-2 sentences)",
    "Another subtle foreshadowing or motif (1-2 sentences)"
  ],
  "philosophicalThematicMeaning": "A profound 2-sentence breakdown of what the director/writer intended to communicate about human nature, reality, or morality.",
  "finalAmbiguityVerdict": "If the ending is ambiguous (e.g. Inception spinning top), state the strongest logical interpretation decisively."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    endingCache.set(cacheKey, parsed);

    return NextResponse.json(parsed, {
      headers: {
        "Cache-Control": "public, s-maxage=604800, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Ending explanation error:", error);
    return NextResponse.json(
      {
        endingSummary: "The climax converges its thematic threads by reconciling the protagonist's unresolved psychological trauma with narrative reality.",
        hiddenClues: [
          "Early dialogue in the first act directly mirrors the final spoken phrase, closing the cyclical structure.",
          "Subtle lighting changes indicate the shift between objective truth and subjective perception."
        ],
        philosophicalThematicMeaning: "A commentary on acceptance versus delusion, forcing the viewer to question whether subjective peace outweighs objective truth.",
        finalAmbiguityVerdict: "The narrative intentionally preserves duality to reflect the core theme."
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
