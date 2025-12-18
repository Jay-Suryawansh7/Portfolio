"use client";

import dynamic from "next/dynamic";

const BackgroundEffects = dynamic(() => import("./BackgroundEffects"), {
  ssr: false,
});

export default function BackgroundEffectsWrapper() {
  return <BackgroundEffects />;
}
