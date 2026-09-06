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

export default function MovieFAQ({
  title,
  genres,
  runtime,
  voteAverage = 7.0,
  overview,
  tagline,
}: MovieFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const primaryGenre = genres ? genres.split(",")[0].trim() : "Cinema";
  const ratingStr = voteAverage ? voteAverage.toFixed(1) : "N/A";
  const runtimeDisplay = runtime ? `${runtime} minutes` : "standard feature length";

  const customWorthWatchingAnswer = tagline
    ? `Yes, especially if you appreciate ${primaryGenre.toLowerCase()} narratives. With the core premise exploring "${tagline}", ${title} holds an audience consensus rating of ${ratingStr}/10.`
    : `Yes, particularly for fans of ${genres.toLowerCase() || "engaging cinema"}. Holding an audience reception score of ${ratingStr}/10, it offers a focused ${runtimeDisplay} experience with layered storytelling.`;

  const customPacingAnswer = overview
    ? `Running at ${runtimeDisplay}, ${title} develops its premise around key thematic stakes. Rather than relying purely on sudden twists, its progression builds focused dramatic momentum leading into the final act.`
    : `${title} runs for ${runtimeDisplay}, balancing structured narrative buildup with calculated suspense designed for attentive viewers.`;

  const faqs: FAQItem[] = [
    {
      question: `Is ${title} worth watching?`,
      answer: customWorthWatchingAnswer,
    },
    {
      question: `What is the narrative structure and runtime of ${title}?`,
      answer: customPacingAnswer,
    },
    {
      question: `Where is ${title} currently streaming?`,
      answer: `Streaming availability for ${title} depends on regional licensing agreements across platforms including Netflix, Prime Video, Apple TV, and Disney+. Refer to the live catalog breakdown above for current regional providers.`,
    },
  ];

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
