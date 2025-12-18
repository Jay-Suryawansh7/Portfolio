"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const SKILLS = {
  expert: [
    { name: "JavaScript", logo: "javascript" },
    { name: "TypeScript", logo: "typescript" },
    { name: "Next.js", logo: "nextdotjs" },
    { name: "React", logo: "react" },
    { name: "Tailwind", logo: "tailwindcss" },
    { name: "Git", logo: "git" },
  ],
  proficient: [
    { name: "Node.js", logo: "nodedotjs" },
    { name: "Express", logo: "express" },
    { name: "LangChain", logo: "langchain" },
    { name: "n8n", logo: "n8n" },
    { name: "MongoDB", logo: "mongodb" },
  ],
  learning: [
    { name: "Three.js", logo: "threedotjs" },
    { name: "GSAP", logo: "greensock" },
    { name: "PostgreSQL", logo: "postgresql" },
    { name: "Arduino", logo: "arduino" },
    { name: "ROS", logo: "ros" },
  ],
};

// Hook for infinite scroll animation settings
const useInfiniteScroll = (direction: "left" | "right", speed: number) => {
  return {
    animate: {
      x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
    },
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop",
        duration: speed,
        ease: "linear",
      },
    } as const,
  };
};

export default function SkillsSection() {
  return (
    <section id="skills" className="min-h-[80vh] w-full relative py-20 overflow-hidden bg-black/90 flex flex-col justify-center">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-4 mb-16">
        <h2 className="text-sm font-mono text-cyan-400 mb-4 tracking-widest uppercase opacity-70 text-center">
          03. The Arsenal
        </h2>
        <h3 className="text-4xl md:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-500">
          Technologies
        </h3>
      </div>

      <div className="flex flex-col gap-16 relative z-10 w-full">
        {/* Row 1: Expert (Left) */}
        <SkillRow 
            skills={[...SKILLS.expert, ...SKILLS.expert, ...SKILLS.expert]} 
            direction="left" 
            speed={25} 
            label="Expert"
        />

        {/* Row 2: Proficient (Right) */}
        <SkillRow 
            skills={[...SKILLS.proficient, ...SKILLS.proficient, ...SKILLS.proficient]} 
            direction="right" 
            speed={30} 
            label="Proficient"
        />

        {/* Row 3: Learning (Left - Slow) */}
        <SkillRow 
            skills={[...SKILLS.learning, ...SKILLS.learning, ...SKILLS.learning]} 
            direction="left" 
            speed={40} 
            label="Learning"
        />
      </div>
      
      {/* Edge Fades */}
      <div className="absolute top-0 left-0 h-full w-20 md:w-40 bg-gradient-to-r from-black via-black/80 to-transparent z-20 pointer-events-none" />
      <div className="absolute top-0 right-0 h-full w-20 md:w-40 bg-gradient-to-l from-black via-black/80 to-transparent z-20 pointer-events-none" />
    </section>
  );
}

function SkillRow({ skills, direction, speed, label }: { skills: typeof SKILLS.expert; direction: "left" | "right"; speed: number; label: string }) {
  const scrollSettings = useInfiniteScroll(direction, speed);

  return (
    <div className="relative w-full">
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 md:left-10 md:translate-x-0 text-xs font-mono text-gray-500 uppercase tracking-widest z-20 bg-black/50 px-2 rounded backdrop-blur">
        {label}
      </div>

      <div className="overflow-hidden flex w-full">
        <motion.div
            className="flex gap-8 whitespace-nowrap will-change-transform"
            {...scrollSettings}
        >
            {skills.map((skill, index) => (
                <SkillItem key={`${skill.name}-${index}`} skill={skill} />
            ))}
        </motion.div>
      </div>
    </div>
  );
}

function SkillItem({ skill }: { skill: { name: string; logo: string } }) {
  return (
    <motion.div 
        className="group relative flex flex-col items-center justify-center gap-2"
        whileHover={{ scale: 1.1 }}
    >
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-white/50 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300 overflow-hidden p-3 md:p-4">
             {/* Simple Icons Logo */}
            <Image 
              src={`https://cdn.simpleicons.org/${skill.logo}/white`}
              alt={skill.name}
              width={80}
              height={80}
              className="w-full h-full object-contain opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
            />
        </div>
        <span className="text-xs md:text-sm text-gray-400 group-hover:text-white transition-colors">
            {skill.name}
        </span>
    </motion.div>
  );
}
