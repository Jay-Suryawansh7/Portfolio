"use client";

import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { motion, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";

// ============================================
// Main BackgroundEffects Component
// ============================================

export default function BackgroundEffects() {
  const [spotlightEnabled, setSpotlightEnabled] = useState(true);

  // Toggle spotlight with 'L' key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "l" || e.key === "L") {
        setSpotlightEnabled((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Layer 1: Animated Gradient Mesh */}
      <GradientMesh />

      {/* Layer 2: Particle Field */}
      <ParticleField />

      {/* Layer 3: Grid Overlay */}
      <GridOverlay />

      {/* Layer 4: Noise/Grain Texture */}
      <NoiseTexture />

      {/* Layer 5: Spotlight Effect */}
      {spotlightEnabled && <SpotlightEffect />}
    </div>
  );
}

// ============================================
// Layer 1: Animated Gradient Mesh
// ============================================

function GradientMesh() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const { scrollYProgress } = useScroll();

  // Smooth spring animation for mouse following
  const springConfig = { damping: 50, stiffness: 100 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  // Scroll-based transforms for orbs
  const orb1Y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const orb3Y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  useEffect(() => {
    const handleMouseMove = throttle((e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 50;
      const y = (e.clientY / window.innerHeight - 0.5) * 50;
      mouseX.set(x);
      mouseY.set(y);
    }, 16);

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="absolute inset-0">
      {/* Cyan Orb */}
      <motion.div
        style={{
          x: mouseXSpring,
          y: orb1Y,
        }}
        className="absolute top-[10%] left-[20%] w-[40rem] h-[40rem] bg-cyan-500/10 rounded-full blur-[120px] will-change-transform"
      />

      {/* Purple Orb */}
      <motion.div
        style={{
          x: useTransform(mouseXSpring, (v) => v * -0.5),
          y: orb2Y,
        }}
        className="absolute bottom-[20%] right-[10%] w-[35rem] h-[35rem] bg-purple-500/10 rounded-full blur-[100px] will-change-transform"
      />

      {/* Accent Orb */}
      <motion.div
        style={{
          x: useTransform(mouseXSpring, (v) => v * 0.3),
          y: orb3Y,
        }}
        className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-full blur-[150px] will-change-transform"
      />
    </div>
  );
}

// ============================================
// Layer 2: Particle Field with Constellation
// ============================================

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize particles
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 80 : 150;

    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      depth: Math.random(), // 0 = back, 1 = front
    }));

    // Mouse tracking
    const handleMouseMove = throttle((e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }, 16);
    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const connectionDistance = 100;

      particles.forEach((p, i) => {
        // Move particles (deeper = slower for parallax)
        const speed = 0.3 + p.depth * 0.7;
        p.x += p.vx * speed;
        p.y += p.vy * speed;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Brighten near cursor
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const brightness = dist < 150 ? 1 - dist / 150 : 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 245, 255, ${p.opacity + brightness * 0.5})`;
        ctx.fill();

        // Draw constellation lines to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const d = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);

          if (d < connectionDistance) {
            const lineOpacity = (1 - d / connectionDistance) * 0.15;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 245, 255, ${lineOpacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-60"
    />
  );
}

// ============================================
// Layer 3: Grid Overlay with Perspective
// ============================================

function GridOverlay() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 0.1, 0.1, 0.3]);

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0"
    >
      {/* Dot Grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          perspective: "1000px",
          transform: "rotateX(60deg) translateZ(-100px)",
          transformOrigin: "center top",
        }}
      />

      {/* Perspective Lines (horizon effect) */}
      <div
        className="absolute inset-x-0 bottom-0 h-[50vh]"
        style={{
          background: `
            linear-gradient(to top, 
              transparent 0%, 
              transparent 49%, 
              rgba(0,245,255,0.02) 50%, 
              transparent 51%, 
              transparent 100%
            )
          `,
          backgroundSize: "100% 30px",
          maskImage: "linear-gradient(to top, rgba(0,0,0,1), transparent)",
        }}
      />
    </motion.div>
  );
}

// ============================================
// Layer 4: Noise/Grain Texture
// ============================================

function NoiseTexture() {
  return (
    <div
      className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
      }}
    />
  );
}

// ============================================
// Layer 5: Spotlight Effect
// ============================================

function SpotlightEffect() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 200 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = throttle((e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    }, 16);

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(0,245,255,0.06), transparent 40%)`,
        // @ts-ignore - CSS custom properties
        "--mouse-x": x,
        "--mouse-y": y,
      }}
    >
      {/* Fallback gradient following mouse */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, rgba(0,245,255,0.08) 0%, transparent 70%)",
        }}
      />
    </motion.div>
  );
}

// ============================================
// Utility: Throttle function
// ============================================

function throttle<T extends (...args: Parameters<T>) => void>(
  func: T,
  limit: number
): T {
  let inThrottle = false;
  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  }) as T;
}

// ============================================
// Types
// ============================================

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  depth: number;
}
