"use client";

import { useMemo } from "react";

interface SplitTextResult {
  words: string[];
  characters: { char: string; wordIndex: number; charIndex: number }[];
  wordElements: { word: string; startIndex: number; endIndex: number }[];
}

/**
 * Hook to split text into words and characters for animation
 */
export function useSplitText(text: string): SplitTextResult {
  return useMemo(() => {
    const words = text.split(/\s+/).filter(Boolean);
    const characters: { char: string; wordIndex: number; charIndex: number }[] = [];
    const wordElements: { word: string; startIndex: number; endIndex: number }[] = [];

    let globalIndex = 0;

    words.forEach((word, wordIndex) => {
      const startIndex = globalIndex;
      
      word.split("").forEach((char, charIndex) => {
        characters.push({ char, wordIndex, charIndex });
        globalIndex++;
      });

      wordElements.push({ word, startIndex, endIndex: globalIndex - 1 });
      
      // Add space after word (except last)
      if (wordIndex < words.length - 1) {
        characters.push({ char: " ", wordIndex, charIndex: word.length });
        globalIndex++;
      }
    });

    return { words, characters, wordElements };
  }, [text]);
}

/**
 * Generate random character for glitch effect
 */
export function getRandomChar(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  return chars[Math.floor(Math.random() * chars.length)];
}

/**
 * Scramble text with random characters
 */
export function scrambleText(text: string, progress: number): string {
  return text
    .split("")
    .map((char, i) => {
      if (char === " ") return " ";
      const threshold = i / text.length;
      return progress > threshold ? char : getRandomChar();
    })
    .join("");
}

export default useSplitText;
