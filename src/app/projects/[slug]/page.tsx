"use client";

import React from "react";
import { useParams, notFound } from "next/navigation";
import { PROJECTS } from "@/lib/projects";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function ProjectPage() {
    const params = useParams();
    const slug = params.slug as string;
    const project = PROJECTS.find((p) => p.slug === slug);

    if (!project) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-20">
            {/* Hero Section */}
            <div className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/20 to-black z-0" />
                
                {/* Background Grid/Pattern */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 z-0" />
                
                <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-7xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 mb-6"
                    >
                        {project.title}
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
                    >
                        {project.subtitle}
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-wrap justify-center gap-3 mt-8"
                    >
                        {project.tech.map((t) => (
                            <span key={t} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-cyan-300">
                                {t}
                            </span>
                        ))}
                    </motion.div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-20">
                {/* Metrics Grid */}
                {project.metrics && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        {project.metrics.map((metric, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-black/50 backdrop-blur-xl border border-white/10 p-6 rounded-2xl text-center"
                            >
                                <div className="text-4xl font-bold text-white mb-2">{metric.value}</div>
                                <div className="text-sm text-gray-400 uppercase tracking-wider">{metric.label}</div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Content Sections */}
                <div className="space-y-20">
                    <motion.section 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="prose prose-invert prose-lg max-w-none"
                    >
                        <h2 className="text-3xl font-bold text-cyan-400 mb-6 border-l-4 border-cyan-500 pl-4">The Challenge</h2>
                        <p className="text-gray-300 leading-relaxed text-lg">{project.challenge}</p>
                    </motion.section>

                    <motion.section 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="prose prose-invert prose-lg max-w-none"
                    >
                        <h2 className="text-3xl font-bold text-purple-400 mb-6 border-l-4 border-purple-500 pl-4">The Solution</h2>
                        <p className="text-gray-300 leading-relaxed text-lg">{project.solution}</p>
                    </motion.section>
                    
                     <motion.section 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold text-white mb-8 border-l-4 border-white pl-4">Key Features</h2>
                         <div className="grid md:grid-cols-2 gap-6">
                            {project.features.map((feature, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                                    <div className="mt-1 text-cyan-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-300 font-medium">{feature}</span>
                                </div>
                            ))}
                         </div>
                    </motion.section>
                </div>

                {/* Navigation Footer */}
                <div className="mt-20 pt-10 border-t border-white/10 flex justify-between items-center">
                    <Link href="/#projects" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                        ← Back to Projects
                    </Link>
                </div>
            </div>
        </div>
    );
}
