"use client";

import React, { useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useAudioContext } from "@/components/AudioContext";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "cyan" | "purple" | "neutral";
  magneticStrength?: number;
}

export default function MagneticButton({
  children,
  className = "",
  onClick,
  variant = "cyan",
  magneticStrength = 0.3,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const [particles, setParticles] = useState<{ x: number; y: number; id: number; angle: number }[]>([]);

  // Motion values for magnetic effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  // Gradient rotation based on mouse position
  const gradientRotate = useTransform(x, [-50, 50], [-15, 15]);
  
  const { playSound } = useAudioContext();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      // Magnetic pull - button moves toward cursor
      x.set(deltaX * magneticStrength);
      y.set(deltaY * magneticStrength);
    },
    [x, y, magneticStrength]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
    playSound("hover"); // Trigger sound

    // Spawn particles on hover
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      x: 0,
      y: 0,
      id: Date.now() + i,
      angle: (i * 45) + Math.random() * 20 - 10,
    }));
    setParticles(newParticles);
    
    // Clear particles after animation
    setTimeout(() => setParticles([]), 600);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playSound("click"); // Trigger sound
    if (!ref.current) return;


    const rect = ref.current.getBoundingClientRect();
    const rippleX = e.clientX - rect.left;
    const rippleY = e.clientY - rect.top;

    const newRipple = { x: rippleX, y: rippleY, id: Date.now() };
    setRipples((prev) => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    onClick?.();
  };

  const variantStyles = {
    cyan: {
      base: "bg-cyan-glow/10 text-cyan-glow border-cyan-glow/30",
      hover: "hover:bg-cyan-glow/20",
      shadow: "shadow-[0_0_20px_rgba(0,245,255,0.2)]",
      hoverShadow: "hover:shadow-[0_0_40px_rgba(0,245,255,0.5)]",
      rippleColor: "bg-cyan-glow/40",
      particleColor: "#00f5ff",
    },
    purple: {
      base: "bg-purple-glow/10 text-purple-glow border-purple-glow/30",
      hover: "hover:bg-purple-glow/20",
      shadow: "shadow-[0_0_20px_rgba(168,85,247,0.2)]",
      hoverShadow: "hover:shadow-[0_0_40px_rgba(168,85,247,0.5)]",
      rippleColor: "bg-purple-glow/40",
      particleColor: "#a855f7",
    },
    neutral: {
      base: "bg-white/5 text-white border-white/10",
      hover: "hover:bg-white/10",
      shadow: "",
      hoverShadow: "hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]",
      rippleColor: "bg-white/30",
      particleColor: "#ffffff",
    },
  };

  const styles = variantStyles[variant];

  return (
    <motion.button
      ref={ref}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        x: xSpring,
        y: ySpring,
      }}
      whileTap={{ scale: 0.97 }}
      className={`
        relative overflow-hidden
        px-8 py-4 rounded-full
        border backdrop-blur-md
        font-bold cursor-pointer
        transition-all duration-300
        will-change-transform
        ${styles.base}
        ${styles.hover}
        ${styles.shadow}
        ${styles.hoverShadow}
        ${className}
      `}
    >
      {/* Gradient overlay that rotates with mouse */}
      <motion.div
        className="absolute inset-0 opacity-0 pointer-events-none"
        style={{
          background: `linear-gradient(${gradientRotate}deg, transparent 0%, ${styles.particleColor}20 50%, transparent 100%)`,
          opacity: isHovered ? 0.5 : 0,
        }}
      />

      {/* Particle burst effect */}
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute w-1 h-1 rounded-full pointer-events-none"
          style={{
            left: "50%",
            top: "50%",
            backgroundColor: styles.particleColor,
          }}
          initial={{ 
            x: 0, 
            y: 0, 
            opacity: 1, 
            scale: 1 
          }}
          animate={{
            x: Math.cos((particle.angle * Math.PI) / 180) * 60,
            y: Math.sin((particle.angle * Math.PI) / 180) * 60,
            opacity: 0,
            scale: 0,
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      ))}

      {/* Ripple effect */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className={`absolute rounded-full pointer-events-none ${styles.rippleColor}`}
          style={{
            left: ripple.x,
            top: ripple.y,
            transformOrigin: "center",
          }}
          initial={{ width: 0, height: 0, x: 0, y: 0, opacity: 1 }}
          animate={{ 
            width: 300, 
            height: 300, 
            x: -150, 
            y: -150, 
            opacity: 0 
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}

      {/* Content */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
