// app/advisor/page.tsx
import React from 'react';
import NeuralAdvisor from '@/components/NeuralAdvisor';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Movie Advisor | Natural Language Film Discovery | MovieINT',
  description: 'Describe any cinematic mood, complex plot requirement, or reference movie in natural language to discover algorithmically matched titles with MovieINT DNA telemetry.',
  alternates: {
    canonical: 'https://www.movieint.com/advisor',
  }
};

export default function AdvisorPage() {
  return (
    <main className="min-h-screen bg-[#07090e] text-slate-100 pt-8 pb-20 px-4">
      <NeuralAdvisor />
    </main>
  );
}
