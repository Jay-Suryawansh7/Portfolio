"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-base text-white px-6">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      
      <h2 className="text-3xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-gray-400 mb-8 text-center max-w-md">
        An unexpected error occurred. Keep calm and check the console (or try again).
      </p>

      <div className="flex gap-4">
        <button
          onClick={reset}
          className="px-6 py-3 bg-white hover:bg-gray-200 text-black font-medium rounded-lg transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors"
        >
          Go Home
        </Link>
      </div>

      <div className="mt-8 text-xs text-gray-700 font-mono">
        Error ID: {error.digest || 'UNKNOWN'}
      </div>
    </div>
  );
}
