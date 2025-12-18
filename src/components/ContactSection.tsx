"use client";

import React, { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

type LogEntry = {
  type: "command" | "response" | "error" | "success";
  text: React.ReactNode;
};

export default function ContactSection() {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [history, setHistory] = useState<LogEntry[]>([
    { type: "response", text: "Welcome to the interactive contact terminal." },
    { type: "response", text: "Type 'help' to see available commands." },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) {
      setHistory((prev) => [...prev, { type: "command", text: trimmed }]);
      return;
    }

    setHistory((prev) => [...prev, { type: "command", text: trimmed }]);
    
    // Parse command
    const args = trimmed.split(" ");
    const command = args[0].toLowerCase();

    switch (command) {
      case "help":
        setHistory((prev) => [
          ...prev,
          {
            type: "response",
            text: (
              <div className="flex flex-col gap-1">
                <span>Available commands:</span>
                <span className="pl-4">- contact --name &quot;Name&quot; --message &quot;Msg&quot;</span>
                <span className="pl-4">- social</span>
                <span className="pl-4">- clear</span>
                <span className="pl-4">- help</span>
              </div>
            ),
          },
        ]);
        break;

      case "social":
        setHistory((prev) => [
          ...prev,
          {
            type: "response",
            text: (
              <div className="flex flex-col gap-2">
                <span>Connect with me:</span>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline pl-4">
                  github.com/jay
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline pl-4">
                  linkedin.com/in/jay
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline pl-4">
                  twitter.com/jay
                </a>
              </div>
            ),
          },
        ]);
        break;

      case "clear":
        setHistory([]);
        break;

      case "contact":
        if (args.length === 1) {
            setHistory((prev) => [
                ...prev, 
                { type: "error", text: "Usage: contact --name <name> --message <message>" }
            ]);
        } else {
             setHistory((prev) => [
                ...prev,
                { type: "success", text: "Message transmitted successfully! Jay will respond shortly." }
            ]);
        }
        break;

      default:
        setHistory((prev) => [
          ...prev,
          { type: "error", text: `Command not found: ${command}. Type 'help' for options.` },
        ]);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(input);
      setInput("");
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <section id="contact" className="min-h-[60vh] w-full relative py-20 px-4 md:px-10 bg-black flex items-center justify-center">
      
      <motion.div 
        ref={terminalRef}
        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`
          w-full max-w-3xl bg-[#0c0c0c] rounded-lg border shadow-2xl overflow-hidden flex flex-col h-[500px]
          transition-all duration-500
          ${isFocused 
            ? "border-cyan-500/50 shadow-[0_0_40px_rgba(0,245,255,0.15)] scale-[1.01]" 
            : "border-gray-800"
          }
        `}
      >
        {/* Terminal Header */}
        <div className="bg-[#1a1a1a] px-4 py-2 flex items-center gap-2 border-b border-gray-800 text-gray-400 text-xs font-mono">
            <div className="flex gap-2 mr-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            visitor@jay-portfolio:~
            
            {/* Focus indicator */}
            <AnimatePresence>
              {isFocused && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="ml-auto text-cyan-400"
                >
                  ● connected
                </motion.span>
              )}
            </AnimatePresence>
        </div>

        {/* Terminal Body */}
        <div 
            className="flex-1 p-4 font-mono text-sm overflow-y-auto cursor-text scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
            onClick={() => inputRef.current?.focus()}
        >
            {history.map((entry, i) => (
                <motion.div 
                  key={i} 
                  className="mb-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.02 }}
                >
                    {entry.type === "command" ? (
                        <div className="text-gray-300">
                             <span className="text-green-500 mr-2">visitor@jay-portfolio:~$</span>
                             {entry.text}
                        </div>
                    ) : entry.type === "error" ? (
                        <div className="text-red-400">{entry.text}</div>
                    ) : entry.type === "success" ? (
                        <div className="text-green-400">{entry.text}</div>
                    ) : (
                        <div className="text-gray-300">{entry.text}</div>
                    )}
                </motion.div>
            ))}
            
            {/* Input Line */}
            <div className="flex items-center text-gray-300">
                 <span className="text-green-500 mr-2">visitor@jay-portfolio:~$</span>
                 
                 {/* Input wrapper with focus glow */}
                 <div className={`
                   flex-1 relative
                   ${isFocused ? "after:absolute after:inset-0 after:-m-1 after:rounded after:border after:border-cyan-500/30 after:pointer-events-none" : ""}
                 `}>
                   <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={onChange}
                      onKeyDown={onKeyDown}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      className="w-full bg-transparent border-none outline-none text-gray-100"
                      autoFocus
                      spellCheck={false}
                      autoComplete="off"
                      data-cursor-mode="text"
                   />
                 </div>
                 
                 {/* Blinking cursor */}
                 <motion.span 
                   className={`w-2 h-4 ml-1 ${isFocused ? "bg-cyan-400" : "bg-gray-400"}`}
                   animate={{ opacity: [1, 0, 1] }}
                   transition={{ repeat: Infinity, duration: 1, times: [0, 0.5, 1] }}
                 />
            </div>
            
            {/* Character counter */}
            <AnimatePresence>
              {isFocused && input.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-right text-xs text-gray-600 mt-1"
                >
                  {input.length} chars
                </motion.div>
              )}
            </AnimatePresence>
            
            <div ref={bottomRef} />
        </div>
        
        {/* Bottom glow when focused */}
        <AnimatePresence>
          {isFocused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
            />
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
