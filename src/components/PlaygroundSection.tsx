"use client";

import React from "react";
import MatrixRain from "./playground/MatrixRain";
import ParticleCursor from "./playground/ParticleCursor";
import Terminal from "./playground/Terminal";

export default function PlaygroundSection() {
  return (
    <section id="playground" className="min-h-[80vh] w-full relative py-20 px-4 md:px-10 bg-dark-base border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-sm font-mono text-cyan-400 mb-10 tracking-widest uppercase opacity-70">
          05. Digital Playground
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[800px] md:h-[400px]">
             {/* Demo 1: Matrix */}
            <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 relative group">
                <MatrixRain />
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur px-2 py-1 rounded text-xs font-mono text-green-400 border border-green-500/30">
                    Matrix Stream
                </div>
            </div>

             {/* Demo 2: Particles */}
            <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 relative group md:col-span-1">
                <ParticleCursor />
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur px-2 py-1 rounded text-xs font-mono text-purple-400 border border-purple-500/30">
                    Particle Physics
                </div>
            </div>

             {/* Demo 3: Terminal */}
            <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 relative group bg-[#1e1e1e]">
                <Terminal />
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur px-2 py-1 rounded text-xs font-mono text-blue-400 border border-blue-500/30">
                    BASH
                </div>
            </div>
        </div>
        
        <p className="text-center text-gray-500 mt-8 font-mono text-sm">
            Experimenting with Canvas, WebGL, and State Management.
        </p>
      </div>
    </section>
  );
}
