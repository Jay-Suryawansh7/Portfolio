"use client";

import React, { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface SectionTransitionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  parallaxStrength?: number;
  showCurtain?: boolean;
  showParticles?: boolean;
  backgroundVariant?: "default" | "elevated" | "dark";
}

export default function SectionTransition({
  children,
  id,
  className = "",
  parallaxStrength = 0.2,
  showCurtain = true,
  showParticles = true,
  backgroundVariant = "default",
}: SectionTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Parallax effect - background moves slower than foreground
  const backgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    [`${-parallaxStrength * 100}%`, `${parallaxStrength * 100}%`]
  );

  // Curtain wipe progress
  const curtainProgress = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const curtainSpring = useSpring(curtainProgress, { stiffness: 100, damping: 30 });

  const bgColors = {
    default: "bg-dark-base",
    elevated: "bg-[#0f0f0f]",
    dark: "bg-black",
  };

  return (
    <section
      ref={ref}
      id={id}
      className={`relative overflow-hidden ${bgColors[backgroundVariant]} ${className}`}
    >
      {/* Parallax Background Layer */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 pointer-events-none"
      >
        {/* Ambient gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-purple-500/5 rounded-full blur-[120px]" />
      </motion.div>

      {/* Curtain Wipe Effect */}
      {showCurtain && (
        <motion.div
          style={{
            scaleX: curtainSpring,
            transformOrigin: "left",
          }}
          className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none z-0"
        />
      )}

      {/* Ambient Floating Particles */}
      {showParticles && <AmbientParticles scrollProgress={scrollYProgress} />}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </section>
  );
}

// Ambient particles that float between sections
function AmbientParticles({ scrollProgress }: { scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 4,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
  }));

  const parallaxY = useTransform(scrollProgress, [0, 1], [0, -50]);

  return (
    <motion.div 
      style={{ y: parallaxY }}
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.id % 2 === 0 
              ? "rgba(0, 245, 255, 0.3)" 
              : "rgba(168, 85, 247, 0.3)",
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            repeat: Infinity,
            duration: p.duration,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.div>
  );
}

// Gradient divider between sections
export function SectionDivider() {
  return (
    <div className="relative h-32 w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />
      <motion.div
        className="absolute inset-x-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
      />
    </div>
  );
}
