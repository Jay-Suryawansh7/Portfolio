"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useCountUp } from "@/hooks/useCountUp";

interface SectionHeadingProps {
  number: number;
  title: string;
  className?: string;
}

export default function SectionHeading({
  number,
  title,
  className = "",
}: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const { formattedValue } = useCountUp({
    start: 0,
    end: number,
    duration: 800,
    decimals: 0,
    prefix: "0",
  });

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Decorative line that draws in */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute -left-8 top-1/2 w-6 h-[2px] bg-gradient-to-r from-cyan-500 to-transparent origin-left hidden md:block"
      />

      <div className="flex items-baseline gap-2">
        {/* Counting number prefix */}
        <motion.span
          ref={useCountUp({ start: 0, end: number, duration: 800 }).ref as React.RefObject<HTMLSpanElement>}
          initial={{ opacity: 0, x: -10 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
          transition={{ duration: 0.4 }}
          className="text-sm font-mono text-cyan-400 tracking-widest uppercase opacity-70"
        >
          {formattedValue}.
        </motion.span>

        {/* Title with mask reveal effect */}
        <div className="relative overflow-hidden">
          <motion.h2
            initial={{ x: "-100%" }}
            animate={isInView ? { x: 0 } : { x: "-100%" }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
            className="text-sm font-mono text-cyan-400 tracking-widest uppercase"
          >
            {title}
          </motion.h2>
          
          {/* Mask overlay for wipe effect */}
          <motion.div
            initial={{ x: 0 }}
            animate={isInView ? { x: "100%" } : { x: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
            className="absolute inset-0 bg-dark-base"
          />
        </div>
      </div>
    </div>
  );
}

// Alternative: Large section title with stroke effect
export function SectionTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.h3
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={`
        text-4xl md:text-5xl font-bold 
        bg-clip-text text-transparent 
        bg-gradient-to-r from-white to-gray-500
        ${className}
      `}
    >
      {children}
    </motion.h3>
  );
}
