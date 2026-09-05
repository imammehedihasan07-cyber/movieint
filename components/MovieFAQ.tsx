"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function MovieFAQ({
  title,
  genres,
  runtime,
}: {
  title: string;
  genres: string;
  runtime?: number;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: `Is ${title} worth watching?`,
      answer: `${title} is a ${genres || "compelling"} production designed for audiences who appreciate meticulous narrative pacing, psychological depth, and visual craftsmanship. Vector telemetry indicates high thematic immersion.`,
    },
    {
      question: `Does ${title} contain a major plot twist or slow burn pacing?`,
      answer: `The pacing runs at approximately ${runtime || 110} minutes with layered narrative progression. Without revealing spoilers, the final act delivers structural payoff that rewards focused viewing.`,
    },
    {
      question: `Where can I stream ${title} online?`,
      answer: `Digital streaming rights for ${title} vary by region across platforms such as Netflix, Amazon Prime Video, Apple TV, and Disney+. Check our live streaming availability table above for current indices.`,
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