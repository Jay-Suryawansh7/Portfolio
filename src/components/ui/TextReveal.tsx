"use client";

import React, { useRef, useMemo } from "react";
import { motion, useInView, Variants } from "framer-motion";
import { useSplitText } from "@/hooks/useSplitText";

interface TextRevealProps {
  children: string;
  className?: string;
  as?: "p" | "span" | "div";
  mode?: "word" | "character" | "line";
  staggerDelay?: number;
  highlightWords?: string[];
  blurEffect?: boolean;
}

export default function TextReveal({
  children,
  className = "",
  as: Component = "p",
  mode = "word",
  staggerDelay = 0.05,
  highlightWords = [],
  blurEffect = true,
}: TextRevealProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });
  const { words, characters } = useSplitText(children);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 10,
      filter: blurEffect ? "blur(4px)" : "blur(0px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const isHighlighted = (word: string) => {
    return highlightWords.some(
      (hw) => word.toLowerCase().includes(hw.toLowerCase())
    );
  };

  if (mode === "word") {
    return (
      <motion.p
        ref={ref as React.RefObject<HTMLParagraphElement>}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className={className}
      >
        {words.map((word, index) => (
          <motion.span
            key={`${word}-${index}`}
            variants={itemVariants}
            className={`inline-block mr-[0.25em] ${
              isHighlighted(word)
                ? "text-cyan-400 animate-pulse-glow"
                : ""
            }`}
          >
            {word}
          </motion.span>
        ))}
      </motion.p>
    );
  }

  if (mode === "character") {
    return (
      <motion.span
        ref={ref as React.RefObject<HTMLSpanElement>}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className={className}
      >
        {characters.map((item, index) => (
          <motion.span
            key={`${item.char}-${index}`}
            variants={itemVariants}
            className="inline-block"
          >
            {item.char === " " ? "\u00A0" : item.char}
          </motion.span>
        ))}
      </motion.span>
    );
  }

  // Line mode - simple fade in
  return (
    <motion.p
      ref={ref as React.RefObject<HTMLParagraphElement>}
      initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
      animate={
        isInView
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: 20, filter: "blur(8px)" }
      }
      transition={{ duration: 0.6 }}
      className={className}
    >
      {children}
    </motion.p>
  );
}

// Quote component with decorative marks
export function AnimatedQuote({
  children,
  author,
  className = "",
}: {
  children: string;
  author?: string;
  className?: string;
}) {
  const ref = useRef<HTMLQuoteElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.blockquote
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.6 }}
      className={`relative pl-8 ${className}`}
    >
      {/* Large quotation mark */}
      <motion.span
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 0.2, scale: 1 } : { opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="absolute -left-2 -top-4 text-8xl font-serif text-cyan-500 leading-none select-none"
      >
        &ldquo;
      </motion.span>
      
      <TextReveal className="text-xl italic text-gray-300" highlightWords={[]}>
        {children}
      </TextReveal>
      
      {author && (
        <motion.footer
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-sm text-gray-500"
        >
          — {author}
        </motion.footer>
      )}
    </motion.blockquote>
  );
}
