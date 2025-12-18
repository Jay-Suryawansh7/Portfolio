"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EasterEggs() {
  const [matrixActive, setMatrixActive] = useState(false);
  const [inverseMode, setInverseMode] = useState(false);
  const [nameExploding, setNameExploding] = useState(false);
  const konamiRef = useRef<string[]>([]);
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Konami Code: ↑↑↓↓←→←→BA
  const KONAMI_CODE = [
    "ArrowUp", "ArrowUp",
    "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight",
    "ArrowLeft", "ArrowRight",
    "KeyB", "KeyA",
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      konamiRef.current.push(e.code);
      konamiRef.current = konamiRef.current.slice(-10);

      if (konamiRef.current.join(",") === KONAMI_CODE.join(",")) {
        triggerMatrixEffect();
        konamiRef.current = [];
      }
    };

    // Shift + Scroll for inverse colors
    const handleWheel = (e: WheelEvent) => {
      if (e.shiftKey) {
        setInverseMode((prev) => !prev);
      }
    };

    // Triple-click detection on name
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-name-element]") || target.textContent?.includes("JAY")) {
        clickCountRef.current++;
        
        if (clickTimerRef.current) {
          clearTimeout(clickTimerRef.current);
        }

        clickTimerRef.current = setTimeout(() => {
          if (clickCountRef.current >= 3) {
            triggerNameExplosion();
          }
          clickCountRef.current = 0;
        }, 400);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("click", handleClick);
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    };
  }, []);

  // Apply inverse mode to body
  useEffect(() => {
    if (inverseMode) {
      document.body.classList.add("invert-colors");
    } else {
      document.body.classList.remove("invert-colors");
    }
  }, [inverseMode]);

  const triggerMatrixEffect = useCallback(() => {
    setMatrixActive(true);
    setTimeout(() => setMatrixActive(false), 5000);
  }, []);

  const triggerNameExplosion = useCallback(() => {
    setNameExploding(true);
    setTimeout(() => setNameExploding(false), 2000);
  }, []);

  return (
    <>
      {/* Matrix Rain Effect */}
      <AnimatePresence>
        {matrixActive && <MatrixRain />}
      </AnimatePresence>

      {/* Name Explosion Particles */}
      <AnimatePresence>
        {nameExploding && <NameExplosion />}
      </AnimatePresence>

      {/* Inverse Mode Indicator */}
      <AnimatePresence>
        {inverseMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-4 z-50 px-3 py-1.5 bg-white text-black rounded-full text-xs font-mono"
          >
            Inverse Mode (Shift+Scroll to toggle)
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Matrix Rain Effect
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00f5ff";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9998] pointer-events-none"
    >
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.p
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-green-400 text-4xl font-mono"
        >
          SYSTEM OVERRIDE
        </motion.p>
      </div>
    </motion.div>
  );
}

// Name Explosion Effect
function NameExplosion() {
  const letters = "JAY".split("");
  const particles: { letter: string; x: number; y: number; angle: number }[] = [];

  letters.forEach((letter, i) => {
    for (let j = 0; j < 8; j++) {
      particles.push({
        letter,
        x: 0,
        y: 0,
        angle: (i * 120 + j * 45) * (Math.PI / 180),
      });
    }
  });

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9997] pointer-events-none flex items-center justify-center"
    >
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute text-4xl font-black text-cyan-400"
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos(p.angle) * 300,
            y: Math.sin(p.angle) * 300,
            opacity: 0,
            scale: 0,
            rotate: Math.random() * 360,
          }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {p.letter}
        </motion.span>
      ))}
      
      {/* Reformation */}
      <motion.span
        className="absolute text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500"
        initial={{ opacity: 0, scale: 2 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        JAY
      </motion.span>
    </motion.div>
  );
}
