"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface Milestone {
  progress: number;
  triggered: boolean;
}

export default function ScrollMilestones() {
  const { scrollYProgress } = useScroll();
  const [milestones, setMilestones] = useState<Record<string, Milestone>>({
    "25": { progress: 0.25, triggered: false },
    "50": { progress: 0.50, triggered: false },
    "75": { progress: 0.75, triggered: false },
    "100": { progress: 0.98, triggered: false },
  });
  const [showIcon, setShowIcon] = useState(false);
  const [particleBurst, setParticleBurst] = useState(false);
  const particleContainerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress and trigger milestones
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // 25% - Particle burst
    if (latest >= 0.25 && !milestones["25"].triggered) {
      setMilestones((prev) => ({ ...prev, "25": { ...prev["25"], triggered: true } }));
      triggerParticleBurst();
    }

    // 50% - Color palette shift
    if (latest >= 0.50 && !milestones["50"].triggered) {
      setMilestones((prev) => ({ ...prev, "50": { ...prev["50"], triggered: true } }));
      triggerColorShift();
    }

    // 75% - Animated icon
    if (latest >= 0.75 && !milestones["75"].triggered) {
      setMilestones((prev) => ({ ...prev, "75": { ...prev["75"], triggered: true } }));
      setShowIcon(true);
      setTimeout(() => setShowIcon(false), 3000);
    }

    // 100% - Confetti celebration
    if (latest >= 0.98 && !milestones["100"].triggered) {
      setMilestones((prev) => ({ ...prev, "100": { ...prev["100"], triggered: true } }));
      triggerConfetti();
    }
  });

  // Reset milestones when scrolling back to top
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.1) {
      setMilestones({
        "25": { progress: 0.25, triggered: false },
        "50": { progress: 0.50, triggered: false },
        "75": { progress: 0.75, triggered: false },
        "100": { progress: 0.98, triggered: false },
      });
    }
  });

  const triggerParticleBurst = useCallback(() => {
    setParticleBurst(true);
    setTimeout(() => setParticleBurst(false), 1000);
  }, []);

  const triggerColorShift = useCallback(() => {
    // Temporarily shift CSS custom properties
    document.documentElement.style.setProperty("--cyan-glow", "#00ffcc");
    document.documentElement.style.setProperty("--purple-glow", "#ff00ff");
    
    setTimeout(() => {
      document.documentElement.style.setProperty("--cyan-glow", "#00f5ff");
      document.documentElement.style.setProperty("--purple-glow", "#a855f7");
    }, 2000);
  }, []);

  const triggerConfetti = useCallback(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ["#00f5ff", "#a855f7", "#ffffff"];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  return (
    <>
      {/* Particle Burst Effect */}
      <AnimatePresence>
        {particleBurst && (
          <motion.div
            ref={particleContainerRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50"
          >
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: "50%",
                  top: "50%",
                  backgroundColor: i % 2 === 0 ? "#00f5ff" : "#a855f7",
                }}
                initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                animate={{
                  x: (Math.random() - 0.5) * 500,
                  y: (Math.random() - 0.5) * 500,
                  scale: 0,
                  opacity: 0,
                }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 75% Animated Icon */}
      <AnimatePresence>
        {showIcon && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: -100 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="fixed bottom-20 right-10 z-50"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <motion.span
                className="text-2xl"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              >
                ⚡
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Milestone indicators (small dots on the side) */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-4">
        {Object.entries(milestones).map(([key, milestone]) => (
          <motion.div
            key={key}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              milestone.triggered ? "bg-cyan-400" : "bg-gray-700"
            }`}
            whileHover={{ scale: 1.5 }}
            title={`${key}%`}
          />
        ))}
      </div>
    </>
  );
}
