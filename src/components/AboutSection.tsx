"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { blurReveal, slowStaggerContainer } from "@/lib/scrollVariants";

const PHILOSOPHY_LINES = [
  "I'm not a perfectionist. I'm an optimist.",
  "I build products that solve real problems—HR-tech, legaltech, healthcare systems, PCB automation.",
  "I distance myself from cynics. I believe in shipping, learning, iterating.",
  "I lead a 9-person team at IMA SindleMedia. I think in PRDs, MVPs, and metrics.",
  "I integrate LLMs, automate workflows with n8n, design PCBs, and code full-stack.",
  "Let me show you what I've built.",
];

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Subtle background gradient shift based on scroll
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative w-full min-h-[150vh] py-20 px-4 md:px-10 flex flex-col items-center justify-start overflow-hidden bg-dark-base"
    >
      {/* Background Ambience */}
      <motion.div 
        style={{ y: backgroundY, opacity }}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-purple-500/10 rounded-full blur-[120px]" />
      </motion.div>

      <motion.div 
        className="relative z-10 max-w-4xl w-full mx-auto flex flex-col gap-32 md:gap-48 pt-20"
        variants={slowStaggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-10%" }}
      >
        <motion.h2 
          className="text-sm font-mono text-cyan-400 mb-10 tracking-widest uppercase opacity-70"
          variants={blurReveal}
        >
          01. Philosophy
        </motion.h2>

        {PHILOSOPHY_LINES.map((line, index) => (
          <PhilosophyLine key={index} text={line} index={index} />
        ))}
      </motion.div>
    </section>
  );
}

function PhilosophyLine({ text, index }: { text: string; index: number }) {
  const isLast = index === 5;
  
  return (
    <motion.p
      initial={{ 
        opacity: 0, 
        y: 60, 
        filter: "blur(12px)",
        scale: 0.95,
        rotate: -2
      }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        filter: "blur(0px)",
        scale: 1,
        rotate: 0,
        transition: { 
          duration: 0.9, 
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: 0.05 * index
        } 
      }}
      viewport={{ once: false, margin: "-15% 0px -15% 0px" }}
      className={`
        text-2xl md:text-4xl lg:text-5xl font-serif font-medium leading-tight
        will-change-transform
        ${isLast ? "text-cyan-400 font-bold" : "text-gray-100"}
      `}
    >
      {text}
    </motion.p>
  );
}
