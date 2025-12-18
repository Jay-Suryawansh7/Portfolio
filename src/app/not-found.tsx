"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const ASCII_ART = `
    ██╗  ██╗ ██████╗ ██╗  ██╗
    ██║  ██║██╔═══██╗██║  ██║
    ███████║██║   ██║███████║
    ╚════██║██║   ██║╚════██║
         ██║╚██████╔╝     ██║
         ╚═╝ ╚═════╝      ╚═╝
`;

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-dark-base text-white px-6 relative overflow-hidden">
      {/* ASCII Art */}
      <pre className="text-cyan-400 text-xs md:text-sm font-mono mb-8 hidden md:block select-none opacity-80">
        {ASCII_ART}
      </pre>
      
      {/* Mobile-friendly version */}
      <h1 className="text-8xl font-bold text-cyan-400 mb-4 md:hidden">404</h1>

      {/* Message */}
      <div className="text-center max-w-md z-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Page not found
        </h2>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Looks like you&apos;ve ventured into uncharted territory. 
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Suggested Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-medium rounded-lg transition-colors shadow-lg shadow-cyan-500/20"
          >
            Go Home
          </Link>
          <Link
            href="/#projects"
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg transition-colors border border-white/10"
          >
            View Projects
          </Link>
        </div>
      </div>

      {/* Fun animation */}
      <div className="mt-16 text-gray-600 text-sm font-mono animate-pulse">
        &gt; Error code: 404_NOT_FOUND
      </div>

      {/* Floating particles decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-tr from-cyan-500 to-purple-500 rounded-full animate-float opacity-30"
            style={{
              left: `${10 + (i * 12)}%`,
              top: `${20 + (i % 4) * 20}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${3 + i}s`
            }}
          />
        ))}
      </div>
    </main>
  );
}
