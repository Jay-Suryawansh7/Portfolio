"use client";

import React, { useState, useRef, useEffect } from "react";

export default function Terminal() {
  const [history, setHistory] = useState<string[]>(["Welcome to Jay's Terminal.", "Type 'help' for commands."]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    let response = "";

    switch (trimmed) {
      case "help":
        response = "Available commands: ls, whoami, cat projects.txt, clear";
        break;
      case "ls":
        response = "projects.txt  skills.json  contact.md";
        break;
      case "whoami":
        response = "User: Guest | Role: Explorer | Status: Curious";
        break;
      case "cat projects.txt":
        response = "1. Matrix Rain\n2. Particle System\n3. This Terminal";
        break;
      case "clear":
        setHistory([]);
        return;
      default:
        response = `Command not found: ${trimmed}`;
    }

    setHistory((prev) => [...prev, `> ${cmd}`, response]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (input.trim()) {
        handleCommand(input);
      } else {
        setHistory((prev) => [...prev, ">"]);
      }
      setInput("");
    }
  };

  return (
    <div className="w-full h-full bg-[#1e1e1e] p-4 text-green-400 font-mono text-sm overflow-y-auto flex flex-col font-bold">
      <div className="flex-1">
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap mb-1">
            {line}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex items-center mt-2 group">
        <span className="mr-2 text-blue-400">~</span>
        <span className="mr-2 text-pink-400">➜</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none text-gray-100 group-hover:text-white"
          autoFocus
        />
      </div>
    </div>
  );
}
