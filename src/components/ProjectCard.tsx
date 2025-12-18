"use client";

import React, { useRef, useState, useCallback } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ProgressiveImage from "@/components/ui/ProgressiveImage";
import { useAudioContext } from "@/components/AudioContext";

interface ProjectCardProps {
  title: string;
  description: string;
  tech: string[];
  link: string;
  image?: string;
  slug?: string;
  index: number;
  role?: string;
  duration?: string;
  highlights?: string[];
  onOpenCaseStudy?: () => void;
}

const ROTATION_RANGE = 20;
const HALF_ROTATION_RANGE = ROTATION_RANGE / 2;

export default function ProjectCard({ 
  title, 
  description, 
  tech, 
  link, 
  image,
  slug, 
  index,
  role = "Lead Developer",
  duration = "3 months",
  highlights = ["Designed architecture", "Led team of 3", "Shipped to production"],
  onOpenCaseStudy,
}: ProjectCardProps) {
  const { playSound } = useAudioContext();

  const ref = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // 3D tilt motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const ySpring = useSpring(y, { stiffness: 300, damping: 20 });
  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

  // Shimmer effect
  const shimmerX = useMotionValue(50);
  const shimmerY = useMotionValue(50);
  const shimmerXSpring = useSpring(shimmerX, { damping: 30, stiffness: 200 });
  const shimmerYSpring = useSpring(shimmerY, { damping: 30, stiffness: 200 });

  // Border glow intensity
  const glowIntensity = useTransform(
    [shimmerXSpring, shimmerYSpring],
    ([latestX, latestY]: number[]) => {
      const distFromCenter = Math.sqrt(
        Math.pow((latestX as number) - 50, 2) + Math.pow((latestY as number) - 50, 2)
      );
      return Math.max(0, 1 - distFromCenter / 70);
    }
  );

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || isFlipped) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // 3D tilt calculation
    const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
    const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;
    const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1;
    const rY = mouseX / width - HALF_ROTATION_RANGE;
    x.set(rX);
    y.set(rY);

    // Shimmer position (0-100%)
    const shimmerPosX = ((e.clientX - rect.left) / width) * 100;
    const shimmerPosY = ((e.clientY - rect.top) / height) * 100;
    shimmerX.set(shimmerPosX);
    shimmerY.set(shimmerPosY);
  }, [x, y, shimmerX, shimmerY, isFlipped]);

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    shimmerX.set(50);
    shimmerY.set(50);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't flip if clicking the CTA button
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) {
      return;
    }
    playSound("click");
    setIsFlipped(!isFlipped);
  };

  const handleCaseStudyClick = (e: React.MouseEvent) => {
    playSound("click");
    e.preventDefault();
    e.stopPropagation();
    if (onOpenCaseStudy) {
      onOpenCaseStudy();
    }
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      style={{
        transformStyle: "preserve-3d",
        transform: isFlipped ? undefined : transform,
        perspective: 1000,
      }}
      className="relative h-[28rem] w-full cursor-pointer group"
    >
      {/* Front Face */}
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
        style={{ backfaceVisibility: "hidden", transformStyle: "preserve-3d" }}
        className="absolute inset-0 rounded-xl bg-gray-900 border border-white/10 p-8 flex flex-col justify-between overflow-hidden shadow-2xl group"
      >
        {/* Background Image (if available) */}
        {image && (
          <div className="absolute inset-0 z-0">
             <ProgressiveImage 
                src={image} 
                alt={title}
                className="object-cover opacity-20 group-hover:opacity-10 group-hover:scale-105 transition-all duration-700"
                containerClassName="w-full h-full"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/40" />
          </div>
        )}

        {/* Shimmer overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          style={{
            background: useMotionTemplate`radial-gradient(circle at ${shimmerXSpring}% ${shimmerYSpring}%, rgba(0,245,255,0.1) 0%, transparent 50%)`,
          }}
        />

        {/* Gradient hover effect */}
        <div 
          style={{ transform: "translateZ(50px)" }}
          className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none z-10" 
        />
        
        {/* Content */}
        <div style={{ transform: "translateZ(30px)" }} className="relative z-10">
          <div className="flex gap-2 mb-4 flex-wrap">
            {tech.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-xs font-mono px-2 py-1 rounded bg-white/5 border border-white/5 text-gray-300"
              >
                {t}
              </span>
            ))}
            {tech.length > 3 && (
              <span className="text-xs font-mono px-2 py-1 text-gray-500">
                +{tech.length - 3} more
              </span>
            )}
          </div>
          <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 group-hover:from-cyan-400 group-hover:to-purple-500 transition-colors duration-300">
            {title}
          </h3>
          <p className="mt-4 text-gray-400 text-lg group-hover:text-gray-200 transition-colors line-clamp-3">
            {description}
          </p>
        </div>

        {/* Tech Stack Reveal */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{ transform: "translateZ(40px)" }}
              className="absolute bottom-20 left-0 right-0 px-8 py-4 bg-gradient-to-t from-black/90 to-transparent"
            >
              <div className="flex flex-wrap gap-2">
                {tech.map((t) => (
                  <span
                    key={t}
                    className="text-xs font-mono px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA Button */}
        <div style={{ transform: "translateZ(20px)" }} className="relative z-10 w-full mt-auto">
          <button 
            onClick={handleCaseStudyClick}
            className="w-full py-3 rounded-lg border border-white/10 bg-white/5 text-white font-medium hover:bg-white/10 hover:border-cyan-500/50 transition-all flex items-center justify-center gap-2 group-hover:gap-3 group-hover:bg-white/10"
          >
            <span>View Case Study</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
        
        {/* Border Glow Effect */}
        <motion.div 
          className="absolute inset-0 rounded-xl border-2 border-cyan-500/0 pointer-events-none"
          style={{
            borderColor: useMotionTemplate`rgba(0, 245, 255, ${glowIntensity})`,
            boxShadow: useMotionTemplate`0 0 ${useTransform(glowIntensity, [0, 1], [0, 30])}px rgba(0, 245, 255, ${glowIntensity})`,
          }}
        />

        {/* Flip hint */}
        <div className="absolute top-4 right-4 text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
          Click to flip
        </div>
      </motion.div>

      {/* Back Face */}
      <motion.div
        animate={{ rotateY: isFlipped ? 0 : -180 }}
        transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
        style={{ backfaceVisibility: "hidden", transformStyle: "preserve-3d" }}
        className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-950/50 to-purple-950/50 border border-cyan-500/20 p-8 flex flex-col justify-between overflow-hidden backdrop-blur-md"
      >
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">{title}</h3>
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                playSound("click");
                setIsFlipped(false); 
              }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowUpRight className="w-6 h-6 rotate-180" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Role</p>
              <p className="text-cyan-400 font-medium">{role}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Duration</p>
              <p className="text-white">{duration}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Highlights</p>
              <ul className="space-y-1">
                {highlights.map((h, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-cyan-500 mt-1">▹</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Link 
          href={slug ? `/projects/${slug}` : link}
          onClick={(e) => {
            e.stopPropagation();
            playSound("click");
          }}
          className="w-full py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-medium transition-colors text-center mt-auto"
        >
          Visit Live Site
        </Link>
      </motion.div>
    </motion.div>
  );
}
