"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ExternalLink, Github, Play } from "lucide-react";
import type { Project } from "@/lib/projects";
import { PROJECTS } from "@/lib/projects";
import { useAudioContext } from "./AudioContext";

interface ProjectCaseStudyProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (direction: "prev" | "next") => void;
}

export default function ProjectCaseStudy({
  project,
  isOpen,
  onClose,
  onNavigate,
}: ProjectCaseStudyProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const { playSound } = useAudioContext();

  // Track scroll progress
  useEffect(() => {
    if (!scrollRef.current || !isOpen) return;

    const handleScroll = () => {
      const el = scrollRef.current;
      if (!el) return;
      const progress = el.scrollTop / (el.scrollHeight - el.clientHeight);
      setScrollProgress(Math.min(progress, 1));
    };

    const el = scrollRef.current;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNavigate?.("prev");
      if (e.key === "ArrowRight") onNavigate?.("next");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onNavigate]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-lg"
          />

          {/* Modal */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[101] overflow-hidden"
          >
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800 z-50">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                style={{ width: `${scrollProgress * 100}%` }}
              />
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                onClose();
                playSound("click");
              }}
              className="absolute top-4 right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors group"
            >
              <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform" />
            </button>

            {/* Navigation Buttons */}
            {onNavigate && (
              <>
                <button
                  onClick={() => {
                    onNavigate("prev");
                    playSound("click");
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors hidden md:flex"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={() => {
                    onNavigate("next");
                    playSound("click");
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors hidden md:flex"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}

            {/* Main Content Layout */}
            <div className="h-full flex">
              {/* Fixed Sidebar */}
              <aside className="hidden lg:flex w-80 flex-shrink-0 flex-col bg-[#0a0a0a] border-r border-white/10 p-8 overflow-y-auto">
                <div className="sticky top-0">
                  <h2 className="text-2xl font-bold text-white mb-2">{project.title}</h2>
                  <p className="text-gray-400 text-sm mb-8">{project.subtitle}</p>

                  <div className="space-y-6">
                    {/* Role */}
                    <div>
                      <span className="text-xs text-cyan-400 uppercase tracking-wider">Role</span>
                      <p className="text-white mt-1">Full-Stack Developer</p>
                    </div>

                    {/* Timeline */}
                    <div>
                      <span className="text-xs text-cyan-400 uppercase tracking-wider">Timeline</span>
                      <p className="text-white mt-1">2024</p>
                    </div>

                    {/* Tech Stack */}
                    <div>
                      <span className="text-xs text-cyan-400 uppercase tracking-wider">Tech Stack</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.tech.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-1 text-xs bg-white/5 border border-white/10 rounded text-gray-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Metrics */}
                    <div>
                      <span className="text-xs text-cyan-400 uppercase tracking-wider">Key Metrics</span>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        {project.metrics.map((m) => (
                          <div key={m.label} className="text-center p-3 bg-white/5 rounded-lg">
                            <div className="text-xl font-bold text-white">{m.value}</div>
                            <div className="text-xs text-gray-500">{m.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Links */}
                    <div className="flex gap-3 pt-4">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-cyan-500 hover:bg-cyan-400 text-black font-medium rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Live Demo
                      </a>
                      <a
                        href="#"
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <Github className="w-5 h-5 text-white" />
                      </a>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Scrollable Content */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto bg-[#0f0f0f]"
              >
                {/* Hero Section */}
                <HeroSection project={project} />

                {/* Content Sections */}
                <div className="max-w-4xl mx-auto px-8 py-16 space-y-24">
                  {/* Mobile Sidebar Info */}
                  <div className="lg:hidden space-y-6">
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="px-3 py-1 text-sm bg-white/5 border border-white/10 rounded-full text-gray-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {project.metrics.map((m) => (
                        <div key={m.label} className="text-center p-4 bg-white/5 rounded-xl">
                          <div className="text-2xl font-bold text-cyan-400">{m.value}</div>
                          <div className="text-xs text-gray-500 mt-1">{m.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* The Problem */}
                  <ContentSection number="01" title="The Problem">
                    <p className="text-gray-300 text-lg leading-relaxed">
                      {project.challenge}
                    </p>
                  </ContentSection>

                  {/* The Solution */}
                  <ContentSection number="02" title="The Solution">
                    <p className="text-gray-300 text-lg leading-relaxed mb-8">
                      {project.solution}
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      {project.features.map((f, i) => (
                        <motion.div
                          key={f}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          viewport={{ once: true }}
                          className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10"
                        >
                          <div className="w-2 h-2 rounded-full bg-cyan-400" />
                          <span className="text-white">{f}</span>
                        </motion.div>
                      ))}
                    </div>
                  </ContentSection>

                  {/* Development */}
                  <ContentSection number="03" title="Development">
                    <div className="space-y-6">
                      <p className="text-gray-300 text-lg leading-relaxed">
                        The development process involved careful planning, iterative prototyping, and continuous user feedback integration.
                      </p>
                      
                      {/* Architecture Diagram Placeholder */}
                      <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-white/10 flex items-center justify-center">
                        <span className="text-gray-500">Architecture Diagram</span>
                      </div>
                    </div>
                  </ContentSection>

                  {/* Challenges */}
                  <ContentSection number="04" title="Challenges & Solutions">
                    <div className="space-y-6">
                      <ChallengeCard
                        challenge="Performance optimization for large datasets"
                        solution="Implemented virtual scrolling and pagination with React Query"
                      />
                      <ChallengeCard
                        challenge="Complex state management across features"
                        solution="Adopted Zustand for lightweight, predictable state handling"
                      />
                    </div>
                  </ContentSection>

                  {/* Gallery */}
                  <ContentSection number="05" title="Gallery">
                    <div className="grid grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => setLightboxImage(`/projects/${project.slug}-${i}.png`)}
                          className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl cursor-pointer border border-white/10 hover:border-cyan-500/50 transition-colors flex items-center justify-center"
                        >
                          <Play className="w-8 h-8 text-gray-600" />
                        </motion.div>
                      ))}
                    </div>
                  </ContentSection>

                  {/* Outcome */}
                  <ContentSection number="06" title="Outcome & Impact">
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                      {project.metrics.map((m, i) => (
                        <motion.div
                          key={m.label}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          viewport={{ once: true }}
                          className="text-center p-6 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-xl border border-white/10"
                        >
                          <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                            {m.value}
                          </div>
                          <div className="text-gray-400 mt-2">{m.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  </ContentSection>

                  {/* Next Steps */}
                  <ContentSection number="07" title="Next Steps">
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        Implement advanced ML models for better predictions
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        Mobile app development for on-the-go access
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        Enterprise integrations with existing workflows
                      </li>
                    </ul>
                  </ContentSection>

                  {/* Scroll Hint */}
                  <div className="text-center text-gray-600 text-sm py-8">
                    End of Case Study
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Lightbox */}
          <AnimatePresence>
            {lightboxImage && (
              <Lightbox
                src={lightboxImage}
                onClose={() => setLightboxImage(null)}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}

// =============================================
// Sub-Components
// =============================================

import ProgressiveImage from "@/components/ui/ProgressiveImage";

// ...

function HeroSection({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={ref} className="relative h-[70vh] overflow-hidden">
      {/* Background Image or Gradient */}
      <motion.div style={{ y }} className="absolute inset-0">
        {project.image ? (
          <div className="relative w-full h-full">
            <ProgressiveImage
              src={project.image}
              alt={project.title}
              className="object-cover"
              containerClassName="w-full h-full"
            />
            <div className="absolute inset-0 bg-black/60" /> {/* Overlay for text readability */}
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 via-purple-500/10 to-transparent" />
        )}
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 z-10"
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold text-white mb-4"
        >
          {project.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-gray-400 max-w-2xl"
        >
          {project.subtitle}
        </motion.p>

        {/* Scroll Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 1, duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 text-gray-500 text-sm flex flex-col items-center gap-2"
        >
          <span>Scroll to explore</span>
          <span>↓</span>
        </motion.div>
      </motion.div>
    </div>
  );
}

function ContentSection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: "-10%" }}
    >
      <div className="flex items-baseline gap-4 mb-8">
        <span className="text-cyan-400 font-mono text-sm">{number}</span>
        <h3 className="text-3xl font-bold text-white">{title}</h3>
      </div>
      {children}
    </motion.section>
  );
}

function ChallengeCard({
  challenge,
  solution,
}: {
  challenge: string;
  solution: string;
}) {
  return (
    <div className="p-6 bg-white/5 rounded-xl border border-white/10">
      <div className="text-red-400 text-sm uppercase tracking-wider mb-2">Challenge</div>
      <p className="text-white mb-4">{challenge}</p>
      <div className="text-green-400 text-sm uppercase tracking-wider mb-2">Solution</div>
      <p className="text-gray-300">{solution}</p>
    </div>
  );
}

function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-8"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20"
      >
        <X className="w-6 h-6 text-white" />
      </button>
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="max-w-5xl w-full aspect-video bg-gray-800 rounded-xl flex items-center justify-center"
      >
        <span className="text-gray-500">Image: {src}</span>
      </motion.div>
    </motion.div>
  );
}

// =============================================
// Before/After Slider Component
// =============================================

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  className = "",
}: {
  beforeSrc: string;
  afterSrc: string;
  className?: string;
}) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-xl cursor-ew-resize ${className}`}
      onMouseMove={(e) => handleMove(e.clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
    >
      {/* After Image (background) */}
      <div className="aspect-video bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
        <span className="text-gray-400">After</span>
      </div>

      {/* Before Image (foreground, clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <div className="w-full h-full bg-gradient-to-r from-gray-700 to-gray-800 flex items-center justify-center">
          <span className="text-gray-300">Before</span>
        </div>
      </div>

      {/* Slider Line */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
        style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg">
          <span className="text-gray-800 text-xs">⟷</span>
        </div>
      </div>
    </div>
  );
}
