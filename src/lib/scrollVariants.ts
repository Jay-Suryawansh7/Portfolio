import { Variants } from "framer-motion";

/**
 * Blur-to-focus reveal animation with scale and rotation
 */
export const blurReveal: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(10px)",
    scale: 0.95,
    rotate: -2,
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smooth reveal
    },
  },
};

/**
 * Soft blur reveal without rotation (for text-heavy content)
 */
export const softBlurReveal: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(8px)",
    y: 30,
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

/**
 * Container variant for staggering children
 */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

/**
 * Fast stagger for dense lists
 */
export const fastStaggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

/**
 * Slow stagger for impactful reveals
 */
export const slowStaggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

/**
 * Child item for stagger animations - scale up with fade
 */
export const staggerChild: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

/**
 * Slide in from left with blur
 */
export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -50,
    filter: "blur(5px)",
  },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

/**
 * Slide in from right with blur
 */
export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 50,
    filter: "blur(5px)",
  },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

/**
 * Pop in - scale from small with bounce
 */
export const popIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

/**
 * Dramatic reveal with rotation and scale
 */
export const dramaticReveal: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    rotate: -3,
    filter: "blur(12px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1,
      ease: [0.16, 1, 0.3, 1], // Expo-like easing
    },
  },
};

/**
 * Card hover animations
 */
export const cardHover = {
  rest: {
    scale: 1,
    boxShadow: "0 0 0 rgba(0, 245, 255, 0)",
  },
  hover: {
    scale: 1.02,
    boxShadow: "0 10px 40px rgba(0, 245, 255, 0.15)",
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

/**
 * Flip animation for card back reveal
 */
export const flipCard: Variants = {
  front: {
    rotateY: 0,
    transition: {
      duration: 0.6,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
  back: {
    rotateY: 180,
    transition: {
      duration: 0.6,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
};

/**
 * Tech stack reveal - slides up from behind card
 */
export const techStackReveal: Variants = {
  hidden: {
    y: "100%",
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};
