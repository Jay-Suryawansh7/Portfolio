"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useInView } from "framer-motion";

interface UseCountUpOptions {
  start?: number;
  end: number;
  duration?: number;
  delay?: number;
  decimals?: number;
  easing?: (t: number) => number;
  suffix?: string;
  prefix?: string;
  onComplete?: () => void;
}

// Easing functions
const easings = {
  easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
  easeInOut: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  easeOutExpo: (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
};

export function useCountUp({
  start = 0,
  end,
  duration = 2000,
  delay = 0,
  decimals = 0,
  easing = easings.easeOutExpo,
  suffix = "",
  prefix = "",
  onComplete,
}: UseCountUpOptions) {
  const [count, setCount] = useState(start);
  const [isComplete, setIsComplete] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!isInView || hasStarted.current) return;
    hasStarted.current = true;

    const startTime = performance.now() + delay;
    const range = end - start;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      
      if (elapsed < 0) {
        requestAnimationFrame(animate);
        return;
      }

      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing(progress);
      const currentValue = start + range * easedProgress;

      setCount(Number(currentValue.toFixed(decimals)));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsComplete(true);
        onComplete?.();
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, start, end, duration, delay, decimals, easing, onComplete]);

  const formattedValue = `${prefix}${count.toLocaleString()}${suffix}`;

  return { ref, count, formattedValue, isComplete, isInView };
}

// Helper to format large numbers with K, M suffixes
export function formatNumber(num: number): { value: number; suffix: string } {
  if (num >= 1000000) {
    return { value: num / 1000000, suffix: "M" };
  }
  if (num >= 1000) {
    return { value: num / 1000, suffix: "K" };
  }
  return { value: num, suffix: "" };
}

export default useCountUp;
