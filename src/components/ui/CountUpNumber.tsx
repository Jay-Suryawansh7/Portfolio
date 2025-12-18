"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useCountUp, formatNumber } from "@/hooks/useCountUp";

interface CountUpNumberProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label?: string;
  duration?: number;
  decimals?: number;
  autoFormat?: boolean;
  className?: string;
  labelClassName?: string;
}

export default function CountUpNumber({
  value,
  suffix = "",
  prefix = "",
  label,
  duration = 2000,
  decimals = 0,
  autoFormat = false,
  className = "",
  labelClassName = "",
}: CountUpNumberProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  // Auto-format large numbers with K, M suffixes
  const { value: displayValue, suffix: autoSuffix } = autoFormat
    ? formatNumber(value)
    : { value, suffix: "" };

  const { formattedValue } = useCountUp({
    start: 0,
    end: displayValue,
    duration,
    decimals: autoFormat ? 1 : decimals,
    suffix: autoFormat ? autoSuffix + suffix : suffix,
    prefix,
  });

  return (
    <div ref={ref} className={`text-center ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500"
      >
        {formattedValue}
      </motion.div>
      
      {label && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ delay: 0.5 }}
          className={`text-gray-400 text-sm mt-2 ${labelClassName}`}
        >
          {label}
        </motion.p>
      )}
    </div>
  );
}

// Stats row component for displaying multiple counters
export function StatsRow({
  stats,
  className = "",
}: {
  stats: Array<{ value: number; label: string; suffix?: string }>;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 ${className}`}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <CountUpNumber
            value={stat.value}
            suffix={stat.suffix || ""}
            label={stat.label}
            duration={1500 + index * 200}
          />
        </motion.div>
      ))}
    </div>
  );
}
