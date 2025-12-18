"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAudioContext } from "@/components/AudioContext";

const COMMANDS = [
  { id: "home", name: "Home", section: "Navigation", href: "/" },
  { id: "about", name: "About Me", section: "Navigation", href: "#about" },
  { id: "projects", name: "Projects", section: "Navigation", href: "#projects" },
  { id: "skills", name: "Skills", section: "Navigation", href: "#skills" },
  { id: "journey", name: "Journey", section: "Navigation", href: "#timeline" },
  { id: "playground", name: "Playground", section: "Navigation", href: "#playground" },
  { id: "contact", name: "Contact", section: "Navigation", href: "#contact" },
  
  // Projects
  { id: "recruit-ai", name: "Recruit-AI", section: "Projects", href: "#projects" },
  { id: "hms", name: "Hospital Management System", section: "Projects", href: "#projects" },
  { id: "orion", name: "Orion", section: "Projects", href: "#projects" },
  { id: "legaltech", name: "LegalTech Dashboards", section: "Projects", href: "#projects" },
  { id: "agastya", name: "Agastya", section: "Projects", href: "#projects" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const { playSound } = useAudioContext();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      
      // Close on escape
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open]);

  const filtered = COMMANDS.filter((cmd) =>
    cmd.name.toLowerCase().includes(query.toLowerCase())
  );

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleNav = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filtered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        handleSelect(filtered[selectedIndex].href);
      }
    };

    window.addEventListener("keydown", handleNav);
    return () => window.removeEventListener("keydown", handleNav);
  }, [open, filtered, selectedIndex]);

  const handleSelect = (href: string) => {
    playSound("click");
    router.push(href);
    setOpen(false);
    setQuery("");
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center pt-[20vh] px-4">
          {/* Backdrop with enhanced blur */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70"
            onClick={() => setOpen(false)}
          />
          
          {/* Command Palette with enhanced animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -30, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, y: -20, filter: "blur(5px)" }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 30 
            }}
            className="relative w-full max-w-lg bg-[#1a1a1a]/95 rounded-xl border border-white/10 shadow-2xl shadow-cyan-500/10 overflow-hidden backdrop-blur-xl"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />
            
            {/* Search input */}
            <div className="relative flex items-center border-b border-white/10 px-4 py-3">
               <motion.span 
                 className="text-gray-400 mr-3"
                 animate={{ rotate: [0, 360] }}
                 transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                 style={{ display: "inline-block" }}
               >
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                 </svg>
               </motion.span>
               <input 
                  className="bg-transparent border-none outline-none text-white w-full placeholder-gray-500 font-mono text-sm"
                  placeholder="Type a command or search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
               />
               <span className="text-xs text-gray-500 whitespace-nowrap ml-2">⌘K</span>
            </div>

            {/* Results with stagger animation */}
            <motion.div 
              className="max-h-[300px] overflow-y-auto py-2"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.03 } }
              }}
            >
                {filtered.length === 0 ? (
                    <div className="px-4 py-12 text-center">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                            </svg>
                        </div>
                        <p className="text-gray-400 font-medium">No commands found.</p>
                        <p className="text-gray-600 text-xs mt-1">Try searching for &quot;home&quot;, &quot;projects&quot;, or &quot;contact&quot;</p>
                    </div>
                ) : (
                    <>
                        {filtered.map((cmd, index) => (
                            <motion.button
                                key={cmd.id}
                                variants={{
                                  hidden: { opacity: 0, x: -10 },
                                  visible: { opacity: 1, x: 0 }
                                }}
                                onClick={() => handleSelect(cmd.href)}
                                className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors ${
                                  index === selectedIndex 
                                    ? "bg-cyan-500/10 border-l-2 border-cyan-500" 
                                    : "hover:bg-white/5 border-l-2 border-transparent"
                                }`}
                            >
                                <span className={`font-medium transition-colors ${
                                  index === selectedIndex ? "text-cyan-400" : "text-gray-300"
                                }`}>
                                  {cmd.name}
                                </span>
                                <span className="text-xs text-gray-600 uppercase tracking-wider">{cmd.section}</span>
                            </motion.button>
                        ))}
                    </>
                )}
            </motion.div>
            
            {/* Footer */}
            <div className="bg-[#111] px-4 py-2 border-t border-white/10 text-[10px] text-gray-500 flex justify-between">
                <span className="flex items-center gap-2">
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[9px]">↑↓</kbd>
                  Navigate
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[9px]">↵</kbd>
                  Select
                </span>
                <span>Jay&apos;s Portfolio v1.0</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
