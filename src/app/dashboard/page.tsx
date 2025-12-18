"use client";

import React from "react";
import { motion } from "framer-motion";

export default function DashboardPage() {
  // Mock Data
  const stats = [
    { label: "Total Visits", value: "12,453", change: "+12%" },
    { label: "Avg. Time", value: "3m 42s", change: "+5%" },
    { label: "Project Views", value: "8,921", change: "+18%" },
    { label: "Bounce Rate", value: "42%", change: "-2%" },
  ];

  const popularProjects = [
    { name: "Orion", views: 3420, percent: 80 },
    { name: "Agastya", views: 2840, percent: 65 },
    { name: "Recruit-AI", views: 1920, percent: 45 },
    { name: "Portfolio", views: 1250, percent: 30 },
  ];

  const visitorLocations = [
    { x: 30, y: 40, label: "USA" },
    { x: 50, y: 30, label: "Europe" },
    { x: 75, y: 45, label: "India" },
    { x: 85, y: 60, label: "Australia" },
    { x: 20, y: 65, label: "Brazil" },
  ];

  return (
    <div className="min-h-screen pt-24 px-4 md:px-12 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-mono text-cyan-400 mb-4">Analytics</h1>
        <p className="text-gray-400 text-lg">Real-time insights (simulated) into portfolio performance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors group"
          >
            <h3 className="text-gray-500 mb-2 font-mono text-sm uppercase tracking-wider">{stat.label}</h3>
            <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-white group-hover:text-cyan-400 transition-colors">{stat.value}</span>
                <span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{stat.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Popular Projects Bar Chart */}
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl"
        >
            <h2 className="text-xl font-bold text-white mb-8">Popular Projects</h2>
            <div className="space-y-6">
                {popularProjects.map((project, index) => (
                    <div key={index}>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-300">{project.name}</span>
                            <span className="text-gray-500">{project.views} views</span>
                        </div>
                        <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${project.percent}%` }}
                                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                className="h-full bg-cyan-500/80 rounded-full relative"
                            >
                                <div className="absolute top-0 right-0 h-full w-2 bg-white/50 blur-[2px]" />
                            </motion.div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>

        {/* Visitor Map (Abstract) */}
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl relative overflow-hidden"
        >
            <h2 className="text-xl font-bold text-white mb-8">Visitor Activity</h2>
            
            {/* Abstract World Map Dotted Pattern */}
            <div className="relative w-full aspect-[16/9] bg-white/5 rounded-xl border border-white/5 grid place-items-center">
                 <div className="absolute inset-0 opacity-20" 
                      style={{ 
                          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', 
                          backgroundSize: '20px 20px' 
                      }} 
                 />
                 
                 {/* Pulse Dots */}
                 {visitorLocations.map((loc, i) => (
                     <div 
                        key={i}
                        className="absolute w-3 h-3"
                        style={{ top: `${loc.y}%`, left: `${loc.x}%` }}
                     >
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 cursor-help" title={loc.label}></span>
                     </div>
                 ))}
                 
                 <p className="text-gray-500 text-sm">Real-time visitor locations</p>
            </div>
        </motion.div>

      </div>
    </div>
  );
}
