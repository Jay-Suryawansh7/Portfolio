"use client";

import React, { useState } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useTheme } from "@/components/ThemeContext";
import { useAudioContext } from "@/components/AudioContext";

// ...

const NAV_LINKS = [
  { name: "About", href: "/#about" },
  { name: "Projects", href: "/#projects" },
  { name: "Skills", href: "/#skills" },
  { name: "Timeline", href: "/#timeline" },
  { name: "Contact", href: "/#contact" },
  { name: "Blog", href: "/blog" },
];

export default function FloatingNav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { toggleSound, settings, playSound } = useAudioContext();

  useMotionValueEvent(scrollY, "change", (latest) => {
      const previous = scrollY.getPrevious() || 0;
      if (latest > previous && latest > 150) {
          setHidden(true);
      } else {
          setHidden(false);
      }
  });

  return (
    <>
      <motion.nav
        variants={{
          visible: { y: 0 },
          hidden: { y: -100 },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-6 inset-x-0 w-full z-50 px-4 pointer-events-none"
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between p-4 rounded-full bg-black/50 backdrop-blur-md border border-white/10 shadow-lg pointer-events-auto">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-xl font-bold font-mono text-cyan-400 pl-2"
            onClick={() => playSound("click")}
          >
             Jay<span className="dark:text-white text-gray-800">.dev</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors"
                onClick={() => playSound("click")}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Sound Toggle */}
            <button
               onClick={() => {
                 toggleSound();
                 playSound("click");
               }}
               className={`p-2 rounded-full transition-colors ${settings.soundEnabled ? 'text-cyan-400 bg-white/10' : 'text-gray-400 hover:text-white'}`}
               aria-label="Toggle Sound"
            >
              {settings.soundEnabled ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg> 
                // Using a different icon or strikethrough speaker for off state 
                // Let's stick to standard mute icon for clarity
              )}
            </button> 
          </div>

          {/* Mobile Hamburger */}
          <button 
             className="md:hidden text-white p-2"
             onClick={() => {
               setMobileMenuOpen(true);
               playSound("click");
             }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
            <>
                 {/* Backdrop */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="fixed inset-0 bg-black/80 z-[60] backdrop-blur-sm md:hidden"
                />
                
                {/* Drawer */}
                <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed top-0 right-0 h-full w-3/4 max-w-sm bg-[#0a0a0a] z-[70] border-l border-white/10 p-8 flex flex-col gap-8 md:hidden shadow-2xl"
                >
                    <div className="flex justify-between items-center mb-8">
                        <span className="text-xl font-bold font-mono text-cyan-400">Navigation</span>
                        <button onClick={() => {
                          setMobileMenuOpen(false);
                          playSound("click");
                        }} className="text-gray-400 hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex flex-col gap-6">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => {
                                  setMobileMenuOpen(false);
                                  playSound("click");
                                }}
                                className="text-2xl font-medium text-gray-300 hover:text-cyan-400 transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                        
                    </div>
                </motion.div>
            </>
        )}
      </AnimatePresence>
    </>
  );
}
