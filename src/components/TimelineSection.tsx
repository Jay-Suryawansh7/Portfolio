"use client";

import React, { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { blurReveal, staggerContainer, staggerChild } from "@/lib/scrollVariants";

const TIMELINE_EVENTS = [
  {
    date: "Feb 2025",
    title: "Founded RebelRoarr",
    description: "Started entrepreneurial journey with my brother.",
  },
  {
    date: "Apr 2025",
    title: "Masai School",
    description: "Product Management & Creator Internship.",
  },
  {
    date: "July 2025",
    title: "B.Tech Journey",
    description: "IoT, Cybersecurity, & Blockchain at IPS Academy.",
  },
  {
    date: "Mid 2025",
    title: "Founded SindleMedia",
    description: "Building a focused creative-tech team.",
  },
  {
    date: "Sep 2025",
    title: "Launched Orion",
    description: "A vibe-coding tool for Flutter developers.",
  },
  {
    date: "Oct 2025",
    title: "Hardware Hackathon",
    description: "Won my first-ever hardware hackathon.",
  },
  {
    date: "Oct 2025",
    title: "Hospital System",
    description: "Built HMS with RBAC, SSR, Docker at HackArena.",
  },
  {
    date: "Oct 2025",
    title: "Orion.ai",
    description: "Contributing to vibe-coding experimentation platform.",
  },
  {
    date: "Nov 2025",
    title: "Project Agastya",
    description: "Initiated AI PCB Designer project.",
  },
  {
    date: "Present",
    title: "Building Agastya",
    description: "Leading 7-person team, exploring new tech & hackathons.",
  },
];

export default function TimelineSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // For scrolling progress bar
  const { scrollXProgress } = useScroll({ container: containerRef });

  return (
    <section id="timeline" className="min-h-[80vh] w-full relative py-20 bg-dark-base flex flex-col justify-center overflow-hidden">
      <motion.div 
        className="container mx-auto px-4 mb-16 relative z-10"
        variants={blurReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="text-sm font-mono text-cyan-400 mb-4 tracking-widest uppercase opacity-70">
          04. The Journey
        </h2>
        <h3 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
          Milestones
        </h3>
        
        {/* Scroll Indicator (Desktop) */}
        <div className="hidden md:flex items-center gap-2 mt-4 text-gray-500 text-sm font-mono">
           <span>Scroll horizontally</span>
           <motion.span 
             animate={{ x: [0, 5, 0] }}
             transition={{ repeat: Infinity, duration: 1.5 }}
           >
             →
           </motion.span>
        </div>
      </motion.div>

      {/* Horizontal Scroll Container (Desktop) */}
      <div 
        ref={containerRef}
        className="hidden md:flex overflow-x-auto snap-x snap-mandatory w-full pb-20 px-4 md:px-20 scrollbar-hide relative z-10"
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* Connecting Line */}
        <div className="absolute top-[50%] left-0 w-[200%] h-[2px] bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-transparent -z-10 transform -translate-y-1/2" />
        
        <div className="flex gap-12 w-max px-[20vw]">
            {TIMELINE_EVENTS.map((event, index) => (
                <TimelineCard key={index} event={event} index={index} />
            ))}
        </div>
      </div>

      {/* Vertical Stack (Mobile) */}
      <motion.div 
        className="md:hidden flex flex-col gap-10 px-4 relative z-10"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
      >
         {/* Vertical Line */}
         <div className="absolute top-0 left-8 w-[2px] h-full bg-gradient-to-b from-cyan-500/20 via-purple-500/20 to-transparent -z-10" />

         {TIMELINE_EVENTS.map((event, index) => (
            <TimelineCardMobile key={index} event={event} index={index} />
         ))}
      </motion.div>
      
      {/* Background Gradients */}
       <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
    </section>
  );
}

function TimelineCard({ event, index }: { event: typeof TIMELINE_EVENTS[0]; index: number }) {
  return (
    <motion.div 
      className="snap-center shrink-0 w-[400px] h-[300px] rounded-2xl bg-white/5 border border-white/10 p-8 flex flex-col justify-center relative backdrop-blur-md hover:border-cyan-500/50 transition-colors group will-change-transform"
      initial={{ 
        opacity: 0, 
        scale: 0.9,
        filter: "blur(8px)",
        rotate: -2
      }}
      whileInView={{ 
        opacity: 1, 
        scale: 1,
        filter: "blur(0px)",
        rotate: 0
      }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 10px 40px rgba(0, 245, 255, 0.1)"
      }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      viewport={{ margin: "-20%" }}
    >
        {/* Dot on Line */}
        <div className="absolute top-1/2 -left-[30px] w-4 h-4 rounded-full bg-dark-base border-2 border-cyan-500 group-hover:scale-125 transition-transform z-20 hidden" /> 
        {/* Actually connect top/bottom or just let the line flow through */}
        
        <motion.div 
          className="text-cyan-400 font-mono text-sm mb-4 bg-cyan-500/10 w-fit px-3 py-1 rounded-full border border-cyan-500/20"
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.08 + 0.2 }}
        >
            {event.date}
        </motion.div>
        <h4 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-200 transition-colors">
            {event.title}
        </h4>
        <p className="text-gray-400 leading-relaxed">
            {event.description}
        </p>
    </motion.div>
  );
}

function TimelineCardMobile({ event, index }: { event: typeof TIMELINE_EVENTS[0]; index: number }) {
    return (
      <motion.div 
        className="pl-12 relative will-change-transform"
        variants={staggerChild}
      >
          {/* Dot */}
          <motion.div 
            className="absolute top-0 left-3 w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)] z-20"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, delay: index * 0.05 }}
          />
          
          <div className="rounded-xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm">
            <div className="text-cyan-400 font-mono text-xs mb-2">
                {event.date}
            </div>
            <h4 className="text-xl font-bold text-white mb-1">
                {event.title}
            </h4>
            <p className="text-gray-400 text-sm">
                {event.description}
            </p>
          </div>
      </motion.div>
    );
  }
