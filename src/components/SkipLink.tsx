"use client";

import React from "react";

export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="fixed top-4 left-4 z-[9999] -translate-y-[150%] focus:translate-y-0 bg-cyan-500 text-black font-bold px-6 py-3 rounded-lg shadow-xl transition-transform duration-200 outline-none focus:ring-4 focus:ring-white/30"
    >
      Skip to content
    </a>
  );
}
