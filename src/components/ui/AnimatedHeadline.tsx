"use client";

import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSplitText, scrambleText } from "@/hooks/useSplitText";

interface AnimatedHeadlineProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span";
  staggerDelay?: number;
  glitchOnHover?: boolean;
  gradient?: boolean;
  depth?: boolean;
}

export default function AnimatedHeadline({
  text,
  className = "",
  as: Component = "h1",
  staggerDelay = 0.05,
  glitchOnHover = true,
  gradient = true,
  depth = true,
}: AnimatedHeadlineProps) {
  const { characters } = useSplitText(text);
  const [isHovered, setIsHovered] = useState(false);
  const [glitchText, setGlitchText] = useState(text);

  // Glitch effect on hover
  const handleHoverStart = useCallback(() => {
    if (!glitchOnHover) return;
    setIsHovered(true);
    
    let iterations = 0;
    const maxIterations = 10;
    
    const interval = setInterval(() => {
      setGlitchText(scrambleText(text, iterations / maxIterations));
      iterations++;
      
      if (iterations >= maxIterations) {
        clearInterval(interval);
        setGlitchText(text);
      }
    }, 50);
  }, [text, glitchOnHover]);

  const handleHoverEnd = useCallback(() => {
    setIsHovered(false);
    setGlitchText(text);
  }, [text]);

  const displayChars = useMemo(() => {
    if (isHovered && glitchOnHover) {
      return glitchText.split("").map((char, i) => ({
        char,
        wordIndex: 0,
        charIndex: i,
      }));
    }
    return characters;
  }, [isHovered, glitchOnHover, glitchText, characters]);

  return (
    <Component
      className={`
        relative inline-block
        ${gradient ? "bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-purple-300 bg-[length:200%_auto] animate-gradient" : ""}
        ${depth ? "drop-shadow-[0_1px_0_rgba(0,245,255,0.3)] [text-shadow:0_2px_4px_rgba(0,0,0,0.5),0_4px_8px_rgba(0,0,0,0.3)]" : ""}
        ${className}
      `}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
      data-name-element
    >
      {displayChars.map((item, index) => (
        <motion.span
          key={`${index}-${item.char}`}
          initial={{ opacity: 0, y: 20, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.5,
            delay: index * staggerDelay,
            ease: [0.215, 0.61, 0.355, 1],
          }}
          className="inline-block will-change-transform"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {item.char === " " ? "\u00A0" : item.char}
        </motion.span>
      ))}
    </Component>
  );
}

// Animated gradient keyframes (add to globals.css or use inline)
// @keyframes gradient { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }
