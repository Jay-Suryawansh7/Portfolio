"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

type CursorMode = "default" | "pointer" | "text" | "drag" | "hidden";

export default function Cursor() {
  const [mode, setMode] = useState<CursorMode>("default");
  const [isVisible, setIsVisible] = useState(true);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const ringX = useMotionValue(-100);
  const ringY = useMotionValue(-100);
  
  // Different spring configs for dot vs ring
  const dotSpringConfig = { damping: 25, stiffness: 700 };
  const ringSpringConfig = { damping: 30, stiffness: 200 };
  
  const cursorXSpring = useSpring(cursorX, dotSpringConfig);
  const cursorYSpring = useSpring(cursorY, dotSpringConfig);
  const ringXSpring = useSpring(ringX, ringSpringConfig);
  const ringYSpring = useSpring(ringY, ringSpringConfig);

  // Detect touch device
  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();
    window.addEventListener('touchstart', () => setIsTouchDevice(true), { once: true });
  }, []);

  const updateMode = useCallback((target: HTMLElement | null) => {
    if (!target) {
      setMode("default");
      return;
    }

    const style = window.getComputedStyle(target);
    const tagName = target.tagName.toLowerCase();
    const dataMode = target.dataset.cursorMode as CursorMode | undefined;

    // Check for explicit data attribute
    if (dataMode) {
      setMode(dataMode);
      return;
    }

    // Check for draggable elements
    if (target.draggable || target.closest('[draggable="true"]')) {
      setMode("drag");
      return;
    }

    // Check for text inputs
    if (tagName === 'input' || tagName === 'textarea' || target.isContentEditable) {
      setMode("text");
      return;
    }

    // Check for clickable elements
    if (
      style.cursor === 'pointer' || 
      tagName === 'a' || 
      tagName === 'button' ||
      target.closest('a') ||
      target.closest('button')
    ) {
      setMode("pointer");
      return;
    }

    setMode("default");
  }, []);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 8);
      cursorY.set(e.clientY - 8);
      ringX.set(e.clientX - 20);
      ringY.set(e.clientY - 20);
    };

    const handleMouseOver = (e: MouseEvent) => {
      updateMode(e.target as HTMLElement);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [cursorX, cursorY, ringX, ringY, updateMode]);

  // Hide on touch devices or when cursor leaves viewport
  if (isTouchDevice) return null;

  const modeStyles = {
    default: {
      dot: { scale: 1, backgroundColor: "#00f5ff" },
      ring: { scale: 1, borderColor: "rgba(0, 245, 255, 0.3)" },
    },
    pointer: {
      dot: { scale: 0.5, backgroundColor: "#00f5ff" },
      ring: { scale: 1.5, borderColor: "rgba(0, 245, 255, 0.5)" },
    },
    text: {
      dot: { scale: 0.3, backgroundColor: "#ffffff" },
      ring: { scale: 0.8, borderColor: "rgba(255, 255, 255, 0.3)" },
    },
    drag: {
      dot: { scale: 1.2, backgroundColor: "#a855f7" },
      ring: { scale: 1.3, borderColor: "rgba(168, 85, 247, 0.5)" },
    },
    hidden: {
      dot: { scale: 0, backgroundColor: "#00f5ff" },
      ring: { scale: 0, borderColor: "transparent" },
    },
  };

  const currentMode = modeStyles[mode];

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Main Dot */}
          <motion.div
            className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block will-change-transform"
            style={{
              x: cursorXSpring,
              y: cursorYSpring,
            }}
            animate={currentMode.dot}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
          />
          
          {/* Outer Ring */}
          <motion.div
            className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9998] border-2 hidden md:block will-change-transform"
            style={{
              x: ringXSpring,
              y: ringYSpring,
            }}
            animate={{
              ...currentMode.ring,
              opacity: mode === "hidden" ? 0 : 0.8,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />

          {/* Mode indicator text (for drag mode) */}
          {mode === "drag" && (
            <motion.div
              className="fixed pointer-events-none z-[9997] text-xs font-mono text-purple-400 hidden md:block"
              style={{
                x: ringXSpring,
                y: ringYSpring,
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 50 }}
              exit={{ opacity: 0 }}
            >
              drag
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
