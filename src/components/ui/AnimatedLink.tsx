"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface AnimatedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  variant?: "cyan" | "purple" | "white";
}

export default function AnimatedLink({
  href,
  children,
  className = "",
  external = false,
  variant = "cyan",
}: AnimatedLinkProps) {
  const variantColors = {
    cyan: {
      text: "text-cyan-glow",
      underline: "bg-cyan-glow",
      hoverGradient: "from-cyan-glow/20 to-purple-glow/20",
    },
    purple: {
      text: "text-purple-glow",
      underline: "bg-purple-glow",
      hoverGradient: "from-purple-glow/20 to-cyan-glow/20",
    },
    white: {
      text: "text-white",
      underline: "bg-white",
      hoverGradient: "from-white/10 to-white/5",
    },
  };

  const colors = variantColors[variant];

  const linkContent = (
    <motion.span
      className={`
        relative inline-flex items-center gap-1
        ${colors.text}
        transition-colors duration-300
        group
        ${className}
      `}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Background gradient wipe on hover */}
      <span 
        className={`
          absolute inset-0 -mx-2 -my-1 px-2 py-1 rounded-md
          bg-gradient-to-r ${colors.hoverGradient}
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
          -z-10
        `}
      />

      {/* Text content */}
      <span className="relative">{children}</span>

      {/* Center-out underline */}
      <span className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
        <motion.span
          className={`absolute inset-0 ${colors.underline}`}
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{ originX: 0.5 }} // Center origin for center-out effect
        />
        {/* Always visible thinner line underneath */}
        <span className={`absolute inset-0 ${colors.underline} opacity-20`} />
      </span>
    </motion.span>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block"
      >
        {linkContent}
      </a>
    );
  }

  return (
    <Link href={href} className="inline-block">
      {linkContent}
    </Link>
  );
}
