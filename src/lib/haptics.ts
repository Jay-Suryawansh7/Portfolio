/**
 * Haptic feedback utilities using Navigator.vibrate()
 * Only works on supported mobile devices
 */

// Check if haptics are supported
export function supportsHaptics(): boolean {
  return typeof navigator !== "undefined" && "vibrate" in navigator;
}

// Check if user prefers reduced motion
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Trigger haptic feedback
 * @param pattern - Duration in ms or array of [vibrate, pause, vibrate, ...]
 */
export function haptic(pattern: number | number[]): void {
  if (!supportsHaptics() || prefersReducedMotion()) return;
  
  try {
    navigator.vibrate(pattern);
  } catch {
    // Silently fail if haptics not available
  }
}

// Preset haptic patterns
export const haptics = {
  // Light tap - for button hover/focus
  light: () => haptic(5),
  
  // Medium tap - for button clicks, navigation
  medium: () => haptic(15),
  
  // Strong tap - for errors
  strong: () => haptic(30),
  
  // Double tap - for success
  success: () => haptic([10, 50, 10]),
  
  // Error pattern - stronger with pause
  error: () => haptic([30, 100, 30]),
  
  // Selection changed
  selection: () => haptic(8),
  
  // Toggle on
  toggleOn: () => haptic([5, 30, 15]),
  
  // Toggle off
  toggleOff: () => haptic(10),
};

export default haptics;
