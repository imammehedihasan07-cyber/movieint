"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface MovieFAQProps {
  title: string;
  genres: string;
  runtime?: number;
  voteAverage?: number;
  overview?: string;
  tagline?: string;
}

function generateDynamicFAQs(
  title: string,
  genres: string = "",
  runtime: number = 105,
  voteAverage: number = 7.0,
  overview: string = "",
  tagline?: string
): FAQItem[] {
  const g = genres.toLowerCase();
  const primaryGenre = genres.split(",")[0]?.trim() || "Cinema";
  const ratingStr = voteAverage ? voteAverage.toFixed(1) : "N/A";
  const runtimeDisplay = runtime ? `${runtime} minutes` : "standard feature length";

  let specificAssessment = "";
  if (g.includes("sci-fi")) {
    specificAssessment = `${title} is tailored for audiences drawn to high-concept speculative world-building, conceptual physics, and cerebral philosophical questions.`;
  } else if (g.includes("thriller") || g.includes("mystery")) {
    specificAssessment = `If you enjoy tense narrative puzzles, layered investigative friction, and unexpected structural reveals, ${title} provides concentrated suspense.`;
  } else if (g.includes("action") || g.includes("adventure")) {
    specificAssessment = `Built for high-tempo cinematic momentum, ${title} prioritizes visceral set pieces, dynamic physical choreography, and unrelenting pacing.`;
  } else if (g.includes("drama")) {
    specificAssessment = `${title} emphasizes emotional grounding, nuanced character development, and atmospheric tension over quick sensationalism.`;
  } else if (g.includes("horror")) {
    specificAssessment = `${title} leans into psychological claustrophobia, visceral dread, and lingering atmospheric unease designed for tension enthusiasts.`;
  } else {
    specificAssessment = `${title} delivers structured thematic storytelling within the ${primaryGenre} landscape.`;
  }

  const worthWatchingAnswer = `${specificAssessment} Holding an audience consensus score of ${ratingStr}/10 over a ${runtimeDisplay} runtime${
    tagline ? ` and centered on the premise "${tagline}"` : ""
  }, it stands out as a compelling watch for enthusiasts of the genre.`;

  let pacingStyle = "a balanced episodic tempo";
  if (runtime > 135) {
    pacingStyle = `an expansive, deliberate slow-burn progression across ${runtimeDisplay}, allowing deep world building and character arcs to mature naturally`;
  } else if (runtime < 95) {
    pacingStyle = `a compact, high-velocity narrative format packed into a razor-sharp ${runtimeDisplay}, cutting away excess subplot filler`;
  } else {
    pacingStyle = `a standard three-act dramatic structure clocking at ${runtimeDisplay}, striking an equilibrium between narrative setup and thematic climax`;
  }

  const structureAnswer = `${title} follows ${pacingStyle}. Rather than relying on abrupt tonal shifts, the plot deliberately layers tension into the central conflict before resolving in the definitive final act.`;

  let audienceTarget = "discerning cinephiles looking for engaging narratives";
  if (g.includes("sci-fi") || g.includes("mystery")) {
    audienceTarget = "viewers who appreciate mind-bending puzzles, cerebral subtext, and ambiguous narrative threads";
  } else if (g.includes("action") || g.includes("crime")) {
    audienceTarget = "audiences seeking high-octane thrills, kinetic conflict, and edge-of-your-seat excitement";
  } else if (g.includes("drama") || g.includes("romance")) {
    audienceTarget = "those seeking rich emotional depth, realistic relational dynamics, and grounded character studies";
  }

  const targetAudienceAnswer = `${title} is best suited for ${audienceTarget}. If you gravitate toward titles that prioritize ${primaryGenre.toLowerCase()} execution with an established ${ratingStr}/10 reception, this title belongs in your watch queue.`;

  const streamingAnswer = `Regional licensing agreements determine streaming availability for ${title} across platforms like Netflix, Prime Video, Apple TV+, Disney+, and HBO Max. Consult the dynamic streaming telemetry box above for verified real-time platform availability in your territory.`;

  return [
    {
      question: `Is ${title} worth watching?`,
      answer: worthWatchingAnswer,
    },
    {
      question: `What is the runtime and narrative pacing of ${title}?`,
      answer: structureAnswer,
    },
    {
      question: `Who will enjoy ${title} the most?`,
      answer: targetAudienceAnswer,
    },
    {
      question: `Where can you stream ${title} online?`,
      answer: streamingAnswer,
    },
  ];
}

export default function MovieFAQ({
  title,
  genres = "",
  runtime = 105,
  voteAverage = 7.0,
  overview = "",
  tagline,
}: MovieFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = generateDynamicFAQs(title, genres, runtime, voteAverage, overview, tagline);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <section className="mt-12 mb-14 text-left">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="w-4 h-4 text-indigo-400" />
        <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 font-bold">
          Frequently Asked Questions (FAQ)
        </h3>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="bg-[#090d15] border border-white/[0.06] rounded-2xl overflow-hidden transition"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left cursor-pointer hover:bg-white/[0.02] transition"
              >
                <span className="text-xs sm:text-sm font-semibold text-slate-200">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-indigo-400" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs text-slate-400 leading-relaxed border-t border-white/[0.04]">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
