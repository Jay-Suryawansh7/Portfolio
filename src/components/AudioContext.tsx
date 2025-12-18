"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { useAudio, preloadAllSounds } from "@/hooks/useAudio";
import haptics, { supportsHaptics } from "@/lib/haptics";
import { Howl } from "howler";

interface AudioSettings {
  // Master controls
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  volume: number;
  
  // Individual sound toggles
  uiSounds: boolean;
  typingSounds: boolean;
  ambientMusic: boolean;
}

interface AudioContextType {
  settings: AudioSettings;
  updateSettings: (updates: Partial<AudioSettings>) => void;
  toggleSound: () => void;
  toggleHaptics: () => void;
  
  // Sound playback
  playSound: (name: "hover" | "click" | "swoosh" | "type" | "error" | "success") => void;
  
  // Haptic feedback
  triggerHaptic: (type: "light" | "medium" | "strong" | "success" | "error") => void;
  
  // Feature detection
  supportsHaptics: boolean;
}

const defaultSettings: AudioSettings = {
  soundEnabled: false, // OFF by default, requires opt-in
  hapticsEnabled: false, // OFF by default, requires opt-in
  volume: 0.3,
  uiSounds: true,
  typingSounds: true,
  ambientMusic: false,
};

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AudioSettings>(defaultSettings);
  const { play } = useAudio({ 
    enabled: settings.soundEnabled, 
    volume: settings.volume 
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const saved = localStorage.getItem("audioSettings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings((prev) => ({ ...prev, ...parsed }));
      } catch {
        // Ignore invalid JSON
      }
    }
    
    // Preload sounds if enabled
    if (settings.soundEnabled) {
      preloadAllSounds(settings.volume);
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("audioSettings", JSON.stringify(settings));
  }, [settings]);

  // Pause ambient music when tab loses focus
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && settings.ambientMusic) {
        // Pause ambient music (would be handled by actual audio player)
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [settings.ambientMusic]);

  const updateSettings = useCallback((updates: Partial<AudioSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const toggleSound = useCallback(() => {
    setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, []);

  const toggleHaptics = useCallback(() => {
    setSettings((prev) => ({ ...prev, hapticsEnabled: !prev.hapticsEnabled }));
  }, []);

  const playSound = useCallback(
    (name: "hover" | "click" | "swoosh" | "type" | "error" | "success") => {
      if (!settings.soundEnabled) return;
      
      // Check individual toggles
      if (name === "type" && !settings.typingSounds) return;
      if (["hover", "click", "swoosh"].includes(name) && !settings.uiSounds) return;
      
      play(name);
    },
    [settings, play]
  );

  // Ref to track pause timeout
  const pauseTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Handle Background Music
  useEffect(() => {
     // Only play if sound enabled AND ambient music enabled
     // tied exclusively to soundEnabled for now
     
     if (settings.soundEnabled) {
         // Clear any pending pause to avoid race condition
         if (pauseTimeoutRef.current) {
             clearTimeout(pauseTimeoutRef.current);
             pauseTimeoutRef.current = null;
         }

         const bgSound = (window as any).__bg_sound;
         
         if (!bgSound) {
             const sound = new Howl({
                 src: ["/sounds/bgsound.mp3"],
                 html5: true, // Use HTML5 Audio for large files
                 loop: true,
                 volume: 0.1, // Lower volume for BG
                 onloaderror: (id, err) => console.error("BG Audio Load Error", err),
                 onplayerror: (id, err) => {
                    console.info("BG Audio: Autoplay blocked, waiting for interaction...", err);
                    // No inline unlock listener here to avoid stale closures.
                    // The global listener below handles it robustly checking FRESH settings.
                 }
             });
             (window as any).__bg_sound = sound;
             sound.play();
         } else {
             if (!bgSound.playing()) {
                 bgSound.play();
             }
             bgSound.fade(0, 0.1, 1000); // Fade in
         }
     } else {
         const bgSound = (window as any).__bg_sound;
         if (bgSound && bgSound.playing()) {
             bgSound.fade(0.1, 0, 1000); // Fade out
             
             // Clear existing timeout just in case
             if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
             
             pauseTimeoutRef.current = setTimeout(() => {
                 bgSound.pause();
                 pauseTimeoutRef.current = null;
             }, 1000);
         }
     }
  }, [settings.soundEnabled]);

  // Global Unlock Listener for Autoplay Policy
  useEffect(() => {
    const handleUnlock = () => {
        const bgSound = (window as any).__bg_sound;
        if (settings.soundEnabled && bgSound && !bgSound.playing()) {
            bgSound.play();
        }
    };

    if (settings.soundEnabled) {
        document.addEventListener("click", handleUnlock, { once: true });
        document.addEventListener("touchstart", handleUnlock, { once: true });
        document.addEventListener("keydown", handleUnlock, { once: true });
    }

    return () => {
        document.removeEventListener("click", handleUnlock);
        document.removeEventListener("touchstart", handleUnlock);
        document.removeEventListener("keydown", handleUnlock);
    };
  }, [settings.soundEnabled]);

  const triggerHaptic = useCallback(
    (type: "light" | "medium" | "strong" | "success" | "error") => {
      if (!settings.hapticsEnabled) return;
      haptics[type]();
    },
    [settings.hapticsEnabled]
  );

  return (
    <AudioContext.Provider
      value={{
        settings,
        updateSettings,
        toggleSound,
        toggleHaptics,
        playSound,
        triggerHaptic,
        supportsHaptics: supportsHaptics(),
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudioContext() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudioContext must be used within AudioProvider");
  }
  return context;
}

export default AudioContext;
