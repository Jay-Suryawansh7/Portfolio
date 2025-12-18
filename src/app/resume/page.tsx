"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// Mock Data (can be refactored to separate file)
const RESUME_DATA = {
  name: "Jay Suryawanshi",
  title: "Full Stack Developer & Creative Technologist",
  summary: "18-year-old developer building the future with code and AI. Passionate about creating immersive web experiences and solving complex problems.",
  experience: [
    {
      company: "Recruit-AI",
      role: "Lead Developer",
      period: "2024 - Present",
      description: "Building an AI-powered recruitment platform. Implemented resume parsing, candidate matching, and automated scheduling workflows."
    },
    {
      company: "Freelance",
      role: "Full Stack Developer",
      period: "2023 - 2024",
      description: "Delivered custom web solutions for diverse clients using Next.js, Node.js, and React Native. Focused on performance and SEO optimization."
    }
  ],
  education: [
    {
      institution: "Tech University",
      degree: "B.S. Computer Science",
      period: "2024 - 2028 (Expected)"
    }
  ],
  skills: [
    "JavaScript/TypeScript", "React", "Next.js", "Node.js", "Python", "Tailwind CSS", "Framer Motion", "PostgreSQL", "Git", "Docker"
  ],
  projects: [
    {
      name: "Orion",
      description: "AI-powered task management dashboard with real-time collaboration."
    },
    {
      name: "Agastya",
      description: "Healthcare appointment scheduling system for rural clinics."
    }
  ],
  social: {
    github: "github.com/jay",
    linkedin: "linkedin.com/in/jay",
    email: "jay@example.com",
    website: "jay.dev"
  }
};

export default function ResumePage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-4xl mx-auto print:p-0 print:max-w-none">
      
      {/* Floating Action Button for Print */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handlePrint}
        className="fixed bottom-8 right-8 bg-cyan-500 text-black p-4 rounded-full shadow-lg z-50 print:hidden hover:bg-cyan-400 transition-colors"
        title="Download PDF"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
      </motion.button>

      {/* Resume Content */}
      <div className="bg-black/40 backdrop-blur-sm border border-white/10 p-8 md:p-12 rounded-2xl print:bg-white print:text-black print:border-none print:p-0 print:rounded-none">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 print:mb-8 border-b border-white/10 print:border-gray-200 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold font-mono text-cyan-400 print:text-black mb-2">{RESUME_DATA.name}</h1>
            <h2 className="text-xl md:text-2xl text-gray-300 print:text-gray-700">{RESUME_DATA.title}</h2>
          </div>
          <div className="mt-6 md:mt-0 text-right print:text-left print:mt-4 text-sm text-gray-400 print:text-gray-600 flex flex-col gap-1">
            <a href={`mailto:${RESUME_DATA.social.email}`} className="hover:text-cyan-400 transition-colors">{RESUME_DATA.social.email}</a>
            <a href={`https://${RESUME_DATA.social.website}`} className="hover:text-cyan-400 transition-colors">{RESUME_DATA.social.website}</a>
            <a href={`https://${RESUME_DATA.social.github}`} className="hover:text-cyan-400 transition-colors">{RESUME_DATA.social.github}</a>
            <a href={`https://${RESUME_DATA.social.linkedin}`} className="hover:text-cyan-400 transition-colors">{RESUME_DATA.social.linkedin}</a>
          </div>
        </header>

        {/* Summary */}
        <section className="mb-12 print:mb-8">
            <h3 className="text-xl font-bold text-white print:text-black mb-4 uppercase tracking-wider border-l-4 border-cyan-500 pl-3">Profile</h3>
            <p className="text-gray-300 print:text-gray-800 leading-relaxed max-w-2xl">{RESUME_DATA.summary}</p>
        </section>

        {/* Experience */}
        <section className="mb-12 print:mb-8">
            <h3 className="text-xl font-bold text-white print:text-black mb-6 uppercase tracking-wider border-l-4 border-cyan-500 pl-3">Experience</h3>
            <div className="space-y-8 print:space-y-6">
                {RESUME_DATA.experience.map((job, index) => (
                    <div key={index} className="relative pl-0 md:pl-0">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
                             <h4 className="text-lg font-bold text-white print:text-black">{job.role}</h4>
                             <span className="text-cyan-400 print:text-gray-600 font-mono text-sm">{job.period}</span>
                        </div>
                        <div className="text-gray-400 print:text-gray-700 font-medium mb-2">{job.company}</div>
                        <p className="text-gray-300 print:text-gray-800 text-sm leading-relaxed">{job.description}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* Projects */}
        <section className="mb-12 print:mb-8 break-inside-avoid">
            <h3 className="text-xl font-bold text-white print:text-black mb-6 uppercase tracking-wider border-l-4 border-cyan-500 pl-3">Selected Projects</h3>
            <div className="grid md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4">
                {RESUME_DATA.projects.map((project, index) => (
                    <div key={index} className="p-4 bg-white/5 print:bg-gray-50 rounded-lg border border-white/5 print:border-gray-200">
                        <h4 className="text-lg font-bold text-cyan-300 print:text-black mb-1">{project.name}</h4>
                        <p className="text-gray-400 print:text-gray-800 text-sm">{project.description}</p>
                    </div>
                ))}
            </div>
        </section>

        <div className="grid md:grid-cols-2 gap-12 print:gap-8">
            {/* Skills */}
            <section className="break-inside-avoid">
                <h3 className="text-xl font-bold text-white print:text-black mb-6 uppercase tracking-wider border-l-4 border-cyan-500 pl-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                    {RESUME_DATA.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-white/10 print:bg-white print:border print:border-gray-300 text-cyan-300 print:text-black rounded-full text-sm">
                            {skill}
                        </span>
                    ))}
                </div>
            </section>

            {/* Education */}
            <section className="break-inside-avoid">
                <h3 className="text-xl font-bold text-white print:text-black mb-6 uppercase tracking-wider border-l-4 border-cyan-500 pl-3">Education</h3>
                <div className="space-y-4">
                    {RESUME_DATA.education.map((edu, index) => (
                        <div key={index}>
                             <div className="text-lg font-bold text-white print:text-black">{edu.institution}</div>
                             <div className="text-gray-300 print:text-gray-800">{edu.degree}</div>
                             <div className="text-gray-500 print:text-gray-600 font-mono text-sm">{edu.period}</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>

      </div>
      
      {/* Background Decorative Elements (Hidden in Print) */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-20 print:hidden">
          <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] bg-purple-500/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[120px]" />
      </div>

    </div>
  );
}
