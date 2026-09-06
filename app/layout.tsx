import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.movieint.com"
  ),
  alternates: {
    canonical: "https://www.movieint.com",
  },
  title: {
    default: "MOVIEINT — Cinematic Intelligence & Narrative DNA Engine",
    template: "%s | MOVIEINT",
  },
  description:
    "AI-driven global movie & web series intelligence platform. Decrypt narrative DNA, spoiler-free climax potency, ending explanations, and streaming availability across Netflix, Prime, and Apple TV.",
  keywords: [
    "Movie DNA",
    "Ending Explained",
    "Spoiler Free Twist Rating",
    "Where to stream movies",
    "Cinema AI recommendation",
    "Global Web Series",
    "Anime and K-Drama Discovery",
  ],
  authors: [{ name: "MOVIEINT Intelligence" }],
  creator: "MOVIEINT",
  publisher: "MOVIEINT",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "MOVIEINT — AI-Powered Cinema Intelligence & DNA Archival",
    description:
      "Algorithmic narrative breakdown and streaming availability for worldwide cinema & series.",
    url: "https://www.movieint.com",
    siteName: "MOVIEINT",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MOVIEINT — Cinematic Intelligence",
    description:
      "Decode narrative pacing, plot complexity, and spoiler-free twist potency.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#05070b] text-slate-100 flex flex-col min-h-screen justify-between selection:bg-indigo-600 selection:text-white`}
      >
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
