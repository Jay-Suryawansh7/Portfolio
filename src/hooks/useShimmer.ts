"use client";

import { useMotionValue, useSpring, MotionValue } from "framer-motion";
import { useCallback, RefObject } from "react";

interface ShimmerValues {
  shimmerX: MotionValue<number>;
  shimmerY: MotionValue<number>;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseLeave: () => void;
  getShimmerStyle: () => string;
}

/**
 * Custom hook for creating a shimmer effect that follows mouse movement
 * Returns motion values and handlers for the shimmer effect
 */
export function useShimmer(ref: RefObject<HTMLElement | null>): ShimmerValues {
  const shimmerX = useMotionValue(50);
  const shimmerY = useMotionValue(50);

  const springConfig = { damping: 30, stiffness: 200 };
  const shimmerXSpring = useSpring(shimmerX, springConfig);
  const shimmerYSpring = useSpring(shimmerY, springConfig);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      shimmerX.set(x);
      shimmerY.set(y);
    },
    [ref, shimmerX, shimmerY]
  );

  const handleMouseLeave = useCallback(() => {
    shimmerX.set(50);
    shimmerY.set(50);
  }, [shimmerX, shimmerY]);

  // Returns a CSS radial gradient string that follows the mouse
  const getShimmerStyle = useCallback(() => {
    const x = shimmerXSpring.get();
    const y = shimmerYSpring.get();
    return `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.15) 0%, transparent 50%)`;
  }, [shimmerXSpring, shimmerYSpring]);

  return {
    shimmerX: shimmerXSpring,
    shimmerY: shimmerYSpring,
    handleMouseMove,
    handleMouseLeave,
    getShimmerStyle,
  };
}

/**
 * Motion values for shimmer background - use with useTransform
 */
export function createShimmerGradient(
  shimmerX: MotionValue<number>,
  shimmerY: MotionValue<number>,
  color: string = "rgba(255,255,255,0.15)"
): string {
  return `radial-gradient(circle at ${shimmerX.get()}% ${shimmerY.get()}%, ${color} 0%, transparent 50%)`;
}
