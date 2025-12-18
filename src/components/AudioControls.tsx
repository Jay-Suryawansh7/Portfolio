"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudioContext } from "./AudioContext";

export default function AudioControls() {
  const { settings, updateSettings, toggleSound, toggleHaptics, supportsHaptics, playSound } = useAudioContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Sound Toggle Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          playSound("click");
        }}
        className="p-2 rounded-lg hover:bg-white/5 transition-colors group"
        aria-label="Audio settings"
      >
        {settings.soundEnabled ? (
          <SoundOnIcon className="w-5 h-5 text-cyan-400" />
        ) : (
          <SoundOffIcon className="w-5 h-5 text-gray-500 group-hover:text-gray-300" />
        )}
      </button>

      {/* Settings Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 top-full mt-2 w-64 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-white/10">
                <h3 className="text-sm font-medium text-white">Sound & Haptics</h3>
                <p className="text-xs text-gray-500 mt-1">Enhance your experience</p>
              </div>

              <div className="p-4 space-y-4">
                {/* Master Sound Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Sound Effects</span>
                  <Toggle
                    enabled={settings.soundEnabled}
                    onChange={(v) => {
                      toggleSound();
                      playSound("click");
                    }}
                  />
                </div>

                {/* Volume Slider */}
                {settings.soundEnabled && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Volume</span>
                      <span className="text-xs text-cyan-400">
                        {Math.round(settings.volume * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.volume * 100}
                      onChange={(e) =>
                        updateSettings({ volume: Number(e.target.value) / 100 })
                      }
                      className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                  </div>
                )}

                {/* Haptics Toggle (only show if supported) */}
                {supportsHaptics && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Haptic Feedback</span>
                    <Toggle
                      enabled={settings.hapticsEnabled}
                      onChange={(v) => {
                         toggleHaptics();
                         playSound("click");
                      }}
                    />
                  </div>
                )}

                {/* UI Sounds */}
                {settings.soundEnabled && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">UI Sounds</span>
                    <Toggle
                      enabled={settings.uiSounds}
                      onChange={(v) => {
                        updateSettings({ uiSounds: v });
                        playSound("click");
                      }}
                    />
                  </div>
                )}

                {/* Typing Sounds */}
                {settings.soundEnabled && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Typing Sounds</span>
                    <Toggle
                      enabled={settings.typingSounds}
                      onChange={(v) => {
                        updateSettings({ typingSounds: v });
                        playSound("click");
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="px-4 py-2 bg-black/30 border-t border-white/5">
                <p className="text-[10px] text-gray-600">
                  All sounds are off by default
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Toggle Switch Component
function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`
        relative w-10 h-5 rounded-full transition-colors
        ${enabled ? "bg-cyan-500" : "bg-gray-700"}
      `}
    >
      <motion.div
        animate={{ x: enabled ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow"
      />
    </button>
  );
}

// Icons
function SoundOnIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 5L6 9H2v6h4l5 4V5z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" strokeLinecap="round" />
    </svg>
  );
}

function SoundOffIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 5L6 9H2v6h4l5 4V5z" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="23" y1="9" x2="17" y2="15" strokeLinecap="round" />
      <line x1="17" y1="9" x2="23" y2="15" strokeLinecap="round" />
    </svg>
  );
}
