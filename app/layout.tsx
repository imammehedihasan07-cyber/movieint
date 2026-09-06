import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.movieint.com";

export const viewport: Viewport = {
  themeColor: "#05070b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
  alternates: {
    canonical: siteUrl,
  },
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
    url: siteUrl,
    siteName: "MOVIEINT",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MOVIEINT Cinema Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MOVIEINT — Cinematic Intelligence",
    description:
      "Decode narrative pacing, plot complexity, and spoiler-free twist potency.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "MOVIEINT",
        description: "Cinematic Intelligence & Narrative DNA Archival Engine",
        publisher: {
          "@id": `${siteUrl}/#organization`,
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "MOVIEINT",
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/favicon.ico`,
        },
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <Script
          type="application/ld+json"
          id="global-schema"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Google Analytics (GA4) */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-84GR311JNK"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-84GR311JNK', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-[#05070b] text-slate-100 flex flex-col min-h-screen justify-between selection:bg-indigo-600 selection:text-white`}
      >
        <Navbar />
        <div className="flex-grow flex flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
