"use client";

import { useCallback, useEffect, useRef } from "react";
import { Howl } from "howler";

// Sound file paths (using data URIs for small sounds to avoid network requests)
// In production, replace with actual audio file paths
const SOUNDS = {
  hover: "/sounds/hover.mp3",
  click: "/sounds/click.mp3",
  swoosh: "/sounds/swoosh.mp3",
  type: "/sounds/type.mp3",
  error: "/sounds/error.mp3",
  success: "/sounds/success.mp3",
  bg: "/bgsound.mp3",
} as const;

type SoundName = keyof typeof SOUNDS;

interface UseAudioOptions {
  enabled?: boolean;
  volume?: number;
}

// Preloaded sounds cache
const soundCache: Partial<Record<SoundName, Howl>> = {};

// Preload a sound
function preloadSound(name: SoundName, volume: number): Howl {
  if (!soundCache[name]) {
    soundCache[name] = new Howl({
      src: [SOUNDS[name]],
      volume,
      preload: true,
      onloaderror: (id, err) => console.error(`Failed to load sound ${name}:`, err),
      onplayerror: (id, err) => {
        console.error(`Failed to play sound ${name}:`, err);
        soundCache[name]?.once('unlock', () => {
          soundCache[name]?.play();
        });
      }
    });
  }
  return soundCache[name]!;
}

/**
 * Custom hook for audio playback
 */
export function useAudio({ enabled = false, volume = 0.3 }: UseAudioOptions = {}) {
  const volumeRef = useRef(volume);

  // Update volume when it changes
  useEffect(() => {
    volumeRef.current = volume;
    Object.values(soundCache).forEach((sound) => {
      sound?.volume(volume);
    });
  }, [volume]);

  // Play a sound
  const play = useCallback(
    (name: SoundName) => {
      if (!enabled) {
        // console.log("Audio disabled, skipping:", name);
        return;
      }
      
      try {
        const sound = preloadSound(name, volumeRef.current);
        sound.play();
      } catch (err) {
        console.error("Audio playback failed:", err);
      }
    },
    [enabled]
  );

  // Convenience methods for common sounds
  const sounds = {
    hover: () => play("hover"),
    click: () => play("click"),
    swoosh: () => play("swoosh"),
    type: () => play("type"),
    error: () => play("error"),
    success: () => play("success"),
  };

  return { play, sounds };
}

/**
 * Preload all sounds for faster playback
 */
export function preloadAllSounds(volume = 0.3): void {
  Object.keys(SOUNDS).forEach((name) => {
    preloadSound(name as SoundName, volume);
  });
}

export default useAudio;
