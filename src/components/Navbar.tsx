"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { Volume2, VolumeX, Sparkles } from "lucide-react";
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
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between bg-white/95 backdrop-blur-md border-2 border-slate-900 rounded-2xl px-4 py-2.5 shadow-[0_4px_0_#1E293B]">
        <BrandLogo size="md" withSubtitle={false} />

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio toggle */}
          <button
            onClick={toggleSound}
            aria-label={isMuted ? "Unmute audio effects" : "Mute audio effects"}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-900 text-slate-800 transition-colors flex items-center justify-center shadow-[0_2px_0_#1E293B] active:translate-y-0.5 active:shadow-none"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Create Quiz Button */}
          <Link
            href="/create"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 border-2 border-slate-900 text-slate-900 text-xs sm:text-sm font-black shadow-[0_3px_0_#1E293B] active:translate-y-0.5 active:shadow-none transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Create Quiz</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
