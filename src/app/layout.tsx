import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import FloatingNav from "@/components/FloatingNav";
import ScrollProgress from "@/components/ScrollProgress";
import Cursor from "@/components/Cursor";
import CommandPalette from "@/components/CommandPalette";
import LenisScroll from "@/components/LenisScroll";
import PageLoader from "@/components/PageLoader";
import ScrollMilestones from "@/components/ScrollMilestones";
import EasterEggs from "@/components/EasterEggs";
import { AudioProvider } from "@/components/AudioContext";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Jay | Creative Technologist & Full Stack Developer",
  description: "Portfolio of Jay, a creative technologist building immersive digital experiences with Next.js, Three.js, and AI.",
  keywords: ["Full Stack Developer", "Creative Developer", "Next.js", "React", "Three.js", "AI", "Portfolio"],
  openGraph: {
    title: "Jay | Creative Technologist",
    description: "Building products that matter, one commit at a time.",
    url: "https://jay.dev",
    siteName: "Jay's Portfolio",
    images: [
      {
        url: "/og-image.png", // Placeholder
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jay | Creative Technologist",
    description: "Building products that matter, one commit at a time.",
  },
};

import SkipLink from "@/components/SkipLink";
import { ThemeProvider } from "@/components/ThemeContext";
import BackgroundEffectsWrapper from "@/components/BackgroundEffectsWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-dark-base text-foreground transition-colors duration-300 selection:bg-cyan-glow selection:text-dark-base overflow-x-hidden`}>
        <ThemeProvider>
          <AudioProvider>
            <SkipLink />
            <PageLoader />
            <BackgroundEffectsWrapper />
            <LenisScroll />
            <ScrollProgress />
            <ScrollMilestones />
            <FloatingNav />
            <Cursor />
            <CommandPalette />
            <EasterEggs />
            {children}
          </AudioProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
