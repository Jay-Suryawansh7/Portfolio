"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface TypewriterTextProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
  cursorChar?: string;
  onComplete?: () => void;
  startOnView?: boolean;
}

export default function TypewriterText({
  text,
  className = "",
  speed = 50,
  delay = 0,
  cursor = true,
  cursorChar = "▌",
  onComplete,
  startOnView = true,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const hasStarted = useRef(false);

  useEffect(() => {
    if (startOnView && !isInView) return;
    if (hasStarted.current) return;
    hasStarted.current = true;

    const startTimeout = setTimeout(() => {
      setIsTyping(true);
      let currentIndex = 0;

      const typeInterval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
          setIsComplete(true);
          onComplete?.();
        }
      }, speed);

      return () => clearInterval(typeInterval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [text, speed, delay, onComplete, isInView, startOnView]);

  return (
    <span ref={ref} className={`font-mono ${className}`}>
      {displayedText}
      {cursor && !isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="text-cyan-400"
        >
          {cursorChar}
        </motion.span>
      )}
    </span>
  );
}

// Code block with typewriter and syntax highlighting
export function TypewriterCodeBlock({
  code,
  language = "typescript",
  className = "",
  lineNumbers = true,
}: {
  code: string;
  language?: string;
  className?: string;
  lineNumbers?: boolean;
}) {
  const lines = code.split("\n");
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const ref = useRef<HTMLPreElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < lines.length) {
        setVisibleLines(currentLine + 1);
        currentLine++;
      } else {
        clearInterval(interval);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [isInView, lines.length]);

  return (
    <pre
      ref={ref}
      className={`bg-[#0d0d0d] rounded-lg border border-white/10 overflow-hidden ${className}`}
    >
      <div className="flex">
        {/* Line numbers */}
        {lineNumbers && (
          <div className="flex flex-col py-4 px-3 text-right text-gray-600 border-r border-white/10 select-none">
            {lines.slice(0, visibleLines).map((_, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="text-xs leading-6"
              >
                {i + 1}
              </motion.span>
            ))}
          </div>
        )}

        {/* Code content */}
        <code className="flex-1 py-4 px-4 overflow-x-auto">
          {lines.slice(0, visibleLines).map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="leading-6 text-sm"
            >
              <SyntaxHighlight line={line} />
            </motion.div>
          ))}
          {visibleLines < lines.length && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
              className="text-cyan-400"
            >
              ▌
            </motion.span>
          )}
        </code>
      </div>
    </pre>
  );
}

// Simple syntax highlighting
function SyntaxHighlight({ line }: { line: string }) {
  // Keywords
  const keywords = ["const", "let", "var", "function", "return", "import", "export", "from", "if", "else", "async", "await"];
  // Built-ins
  const builtins = ["console", "document", "window", "Math", "Array", "Object", "String"];
  
  let result = line;
  
  // Highlight strings
  result = result.replace(/(["'`])(.*?)\1/g, '<span class="text-green-400">$&</span>');
  // Highlight keywords
  keywords.forEach((kw) => {
    const regex = new RegExp(`\\b${kw}\\b`, "g");
    result = result.replace(regex, `<span class="text-purple-400">${kw}</span>`);
  });
  // Highlight builtins
  builtins.forEach((bi) => {
    const regex = new RegExp(`\\b${bi}\\b`, "g");
    result = result.replace(regex, `<span class="text-cyan-400">${bi}</span>`);
  });
  // Highlight numbers
  result = result.replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>');
  // Highlight comments
  result = result.replace(/(\/\/.*)$/g, '<span class="text-gray-500">$1</span>');

  return <span dangerouslySetInnerHTML={{ __html: result || "&nbsp;" }} />;
}
