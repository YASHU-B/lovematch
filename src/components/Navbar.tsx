"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { Volume2, VolumeX, Sparkles, LogIn } from "lucide-react";
import { soundEffects } from "./AudioEffects";

export function Navbar() {
  const [isMuted, setIsMuted] = useState(false);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEffects.setMuted(next);
    if (!next) soundEffects.playPop();
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-pink-500/20 px-4 sm:px-6 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <BrandLogo size="md" withSubtitle={false} />

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio toggle */}
          <button
            onClick={toggleSound}
            aria-label={isMuted ? "Unmute audio effects" : "Mute audio effects"}
            className="p-2 rounded-xl glass-card text-pink-300 hover:text-white hover:bg-pink-500/20 transition-colors min-touch-target flex items-center justify-center"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-pink-400/60" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Join with Room Code */}
          <Link
            href="/join"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-card text-xs sm:text-sm font-medium text-pink-200 hover:text-white hover:border-pink-500/50 transition-all min-touch-target"
          >
            <LogIn className="w-4 h-4 text-pink-400" />
            <span className="hidden xs:inline">Join</span> Code
          </Link>

          {/* Create Challenge Button */}
          <Link
            href="/create"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xs sm:text-sm font-semibold shadow-md shadow-pink-500/30 transition-all active:scale-95 min-touch-target"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
