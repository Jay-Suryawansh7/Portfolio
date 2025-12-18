"use client";

import React, { useState } from "react";
import ProjectCard from "./ProjectCard";
import ProjectCaseStudy from "./ProjectCaseStudy";
import { PROJECTS, type Project } from "@/lib/projects";

export default function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleNavigate = (direction: "prev" | "next") => {
    if (!selectedProject) return;
    const currentIndex = PROJECTS.findIndex((p) => p.slug === selectedProject.slug);
    
    let nextIndex;
    if (direction === "next") {
      nextIndex = (currentIndex + 1) % PROJECTS.length;
    } else {
      nextIndex = (currentIndex - 1 + PROJECTS.length) % PROJECTS.length;
    }
    
    setSelectedProject(PROJECTS[nextIndex]);
  };

  return (
    <section id="projects" className="min-h-screen w-full relative py-20 px-4 md:px-10 bg-dark-base">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-sm font-mono text-purple-400 mb-10 tracking-widest uppercase opacity-70">
          02. Selected Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full perspective-1000">
          {PROJECTS.map((project, index) => (
            <ProjectCard
              key={index}
              index={index}
              {...project}
              onOpenCaseStudy={() => setSelectedProject(project)}
            />
          ))}
        </div>
      </div>

      <ProjectCaseStudy
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        onNavigate={handleNavigate}
      />
    </section>
  );
}
