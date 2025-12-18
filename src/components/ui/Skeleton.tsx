"use client";

import React from "react";
import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "card";
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export default function Skeleton({
  className = "",
  variant = "rectangular",
  width,
  height,
  lines = 1,
}: SkeletonProps) {
  const baseClasses = "animate-shimmer bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-[length:200%_100%]";

  if (variant === "text" && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${baseClasses} h-4 rounded`}
            style={{
              width: i === lines - 1 ? "75%" : "100%",
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
    );
  }

  const variantClasses = {
    text: "h-4 rounded",
    circular: "rounded-full aspect-square",
    rectangular: "rounded-lg",
    card: "rounded-xl",
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    />
  );
}

// Project Card Skeleton
export function ProjectCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 overflow-hidden bg-gray-900/50">
      <Skeleton variant="rectangular" className="aspect-video w-full" />
      <div className="p-6 space-y-4">
        <Skeleton variant="text" className="w-3/4 h-6" />
        <Skeleton variant="text" lines={2} className="w-full" />
        <div className="flex gap-2">
          <Skeleton variant="rectangular" className="w-16 h-6 rounded-full" />
          <Skeleton variant="rectangular" className="w-20 h-6 rounded-full" />
          <Skeleton variant="rectangular" className="w-14 h-6 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// Timeline Skeleton
export function TimelineSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4">
          <Skeleton variant="circular" className="w-12 h-12 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="w-1/3 h-5" />
            <Skeleton variant="text" lines={2} />
          </div>
        </div>
      ))}
    </div>
  );
}

// Blog Card Skeleton
export function BlogCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      <Skeleton variant="rectangular" className="aspect-[16/9] w-full" />
      <div className="p-5 space-y-3">
        <Skeleton variant="text" className="w-1/4 h-3" />
        <Skeleton variant="text" className="w-full h-6" />
        <Skeleton variant="text" lines={2} />
      </div>
    </div>
  );
}
