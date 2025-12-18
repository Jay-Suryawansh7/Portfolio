"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PageLoader() {
  const [phase, setPhase] = useState<"logo" | "particles" | "explode" | "done">("logo");
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);

  // Lock body scroll during loading
  useEffect(() => {
    if (phase !== "done") {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0); 
    } else {
      document.body.style.overflow = "";
      // Ensure we start at top when loader finishes
      window.scrollTo(0, 0);
    }
  }, [phase]);

  // Check if this is the first visit in this session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasVisited = sessionStorage.getItem("hasVisitedPortfolio");
      if (hasVisited) {
        setIsFirstVisit(false);
        setPhase("done");
      } else {
        sessionStorage.setItem("hasVisitedPortfolio", "true");
      }
    }
  }, []);

  // Transition timeline
  useEffect(() => {
    if (!isFirstVisit) return;

    const timeline = [
      { phase: "particles" as const, delay: 800 },
      { phase: "explode" as const, delay: 1300 },
      { phase: "done" as const, delay: 2000 },
    ];

    timeline.forEach(({ phase, delay }) => {
      setTimeout(() => setPhase(phase), delay);
    });
  }, [isFirstVisit]);

  // Canvas particle animation
  useEffect(() => {
    if (phase !== "particles" && phase !== "explode") return;
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Initialize particles if needed
    if (particlesRef.current.length === 0) {
      // Create particles in "JAY" text shape
      const text = "JAY";
      ctx.font = "bold 120px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#00f5ff";
      ctx.fillText(text, centerX, centerY);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      const particles: Particle[] = [];

      for (let y = 0; y < canvas.height; y += 4) {
        for (let x = 0; x < canvas.width; x += 4) {
          const index = (y * canvas.width + x) * 4;
          if (pixels[index + 3] > 128) {
            particles.push({
              x,
              y,
              originX: x,
              originY: y,
              vx: 0,
              vy: 0,
              color: `rgba(${pixels[index]}, ${pixels[index + 1]}, ${pixels[index + 2]}, 1)`,
              size: 2 + Math.random() * 2,
            });
          }
        }
      }
      particlesRef.current = particles;
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        if (phase === "explode") {
          // Explode outward
          const dx = p.x - centerX;
          const dy = p.y - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          p.vx += (dx / dist) * 2;
          p.vy += (dy / dist) * 2;
          p.vx *= 0.98;
          p.vy *= 0.98;
        } else {
          // Float animation
          p.vx = Math.sin(Date.now() * 0.001 + p.originX * 0.01) * 0.5;
          p.vy = Math.cos(Date.now() * 0.001 + p.originY * 0.01) * 0.5;
        }

        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [phase]);

  // Don't render if already done on first check
  if (!isFirstVisit && phase === "done") return null;

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] bg-dark-base flex items-center justify-center"
        >
          {/* Logo Phase */}
          <AnimatePresence>
            {phase === "logo" && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.2, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative"
              >
                <motion.h1
                  className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500"
                  animate={{
                    textShadow: [
                      "0 0 20px rgba(0,245,255,0.5)",
                      "0 0 40px rgba(0,245,255,0.8)",
                      "0 0 20px rgba(0,245,255,0.5)",
                    ],
                  }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  JAY
                </motion.h1>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-3xl -z-10"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Particle Canvas */}
          {(phase === "particles" || phase === "explode") && (
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
            />
          )}

          {/* Loading indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-cyan-400"
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.6,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
}
