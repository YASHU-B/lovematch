"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { soundEffects } from "./AudioEffects";

interface PlayfulMascotProps {
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
}

export function PlayfulMascot({ size = "md", interactive = true }: PlayfulMascotProps) {
  const [clickCount, setClickCount] = useState(0);
  const [speech, setSpeech] = useState<string>("Tap us!");

  const speechLines = [
    "Don't block me! 🙈",
    "Find your fake friends! 👀",
    "10/10 or getting blocked! 🚫",
    "I know all your secrets! 🤫",
    "Who can you really trust? 🔮",
    "Safe or Blocked? ⚡"
  ];

  const handleClick = () => {
    if (!interactive) return;
    soundEffects.playPop();
    const nextCount = clickCount + 1;
    setClickCount(nextCount);
    setSpeech(speechLines[nextCount % speechLines.length]);
  };

  const scaleSize = {
    sm: "w-24 h-24",
    md: "w-36 h-36 sm:w-44 sm:h-44",
    lg: "w-48 h-48 sm:w-56 sm:h-56"
  }[size];

  return (
    <div className="relative inline-flex flex-col items-center select-none">
      {/* Speech Bubble */}
      <AnimatePresence mode="wait">
        <motion.div
          key={speech}
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8, y: -5 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="mb-2 px-3.5 py-1.5 rounded-2xl bg-white text-slate-900 shadow-[0_3px_0_#1E293B] border-2 border-slate-900 text-xs sm:text-sm font-black tracking-tight flex items-center gap-1.5 cursor-pointer"
          onClick={handleClick}
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400" />
          <span>{speech}</span>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-8 border-t-slate-900" />
        </motion.div>
      </AnimatePresence>

      {/* Interactive Mascot Scene */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        onClick={handleClick}
        className={`relative ${scaleSize} flex items-center justify-center cursor-pointer`}
      >
        {/* Glowing aura ring */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.35, 0.6, 0.35]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-500 blur-2xl"
        />

        {/* Orbiting Mini Heart Sticker 1 */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{
            rotate: { duration: 10, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-pink-400/90 shadow-md shadow-pink-500/50 flex items-center justify-center text-white text-xs font-bold">
            💖
          </div>
        </motion.div>

        {/* Orbiting Mini Sparkle Sticker 2 */}
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.15, 1]
          }}
          transition={{
            rotate: { duration: 14, repeat: Infinity, ease: "linear" },
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-purple-400/90 shadow-md shadow-purple-500/50 flex items-center justify-center text-white text-xs font-bold">
            ✨
          </div>
        </motion.div>

        {/* Mascot Characters: Brown Bear & White Panda Duo */}
        <motion.div
          animate={{
            y: [-3, 3, -3],
            rotate: [-1.5, 1.5, -1.5]
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative z-10 w-full h-full flex items-center justify-center gap-1 sm:gap-2"
        >
          {/* Left: Cute Brown Bear */}
          <div className="w-1/2 h-full flex items-center justify-center">
            <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-lg">
              {/* Ears */}
              <circle cx="32" cy="30" r="14" fill="#C68958" stroke="#372013" strokeWidth="3" />
              <circle cx="32" cy="30" r="8" fill="#F4B785" />
              <circle cx="88" cy="30" r="14" fill="#C68958" stroke="#372013" strokeWidth="3" />
              <circle cx="88" cy="30" r="8" fill="#F4B785" />

              {/* Head */}
              <rect x="20" y="24" width="80" height="72" rx="36" fill="#D69766" stroke="#372013" strokeWidth="3.5" />
              <ellipse cx="32" cy="68" rx="7" ry="4.5" fill="#FF8BA7" opacity="0.65" />
              <ellipse cx="88" cy="68" rx="7" ry="4.5" fill="#FF8BA7" opacity="0.65" />

              {/* Eyes */}
              <circle cx="42" cy="56" r="4.5" fill="#25140A" />
              <circle cx="43.5" cy="54" r="1.5" fill="#FFFFFF" />
              <circle cx="78" cy="56" r="4.5" fill="#25140A" />
              <circle cx="79.5" cy="54" r="1.5" fill="#FFFFFF" />

              {/* Snout */}
              <ellipse cx="60" cy="65" rx="14" ry="10" fill="#FCEBD9" stroke="#372013" strokeWidth="2.5" />
              <ellipse cx="60" cy="61" rx="4" ry="3" fill="#25140A" />
              <path d="M57 66 Q60 69 63 66" stroke="#25140A" strokeWidth="2" strokeLinecap="round" fill="none" />
            </svg>
          </div>

          {/* Right: Cute White Panda */}
          <div className="w-1/2 h-full flex items-center justify-center">
            <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-lg">
              {/* Ears */}
              <circle cx="32" cy="30" r="14" fill="#2D282A" stroke="#1F1A1C" strokeWidth="3" />
              <circle cx="32" cy="30" r="7" fill="#4B4447" />
              <circle cx="88" cy="30" r="14" fill="#2D282A" stroke="#1F1A1C" strokeWidth="3" />
              <circle cx="88" cy="30" r="7" fill="#4B4447" />

              {/* Head */}
              <rect x="20" y="24" width="80" height="72" rx="36" fill="#FFFFFF" stroke="#1F1A1C" strokeWidth="3.5" />
              <circle cx="32" cy="70" r="7.5" fill="#FF8FA3" opacity="0.8" />
              <circle cx="88" cy="70" r="7.5" fill="#FF8FA3" opacity="0.8" />

              {/* Eye Patches */}
              <ellipse cx="42" cy="56" rx="9" ry="11" fill="#2D282A" transform="rotate(-15 42 56)" />
              <ellipse cx="78" cy="56" rx="9" ry="11" fill="#2D282A" transform="rotate(15 78 56)" />
              <circle cx="43" cy="55" r="4.5" fill="#FFFFFF" />
              <circle cx="44" cy="55" r="2.5" fill="#1F1A1C" />
              <circle cx="77" cy="55" r="4.5" fill="#FFFFFF" />
              <circle cx="76" cy="55" r="2.5" fill="#1F1A1C" />

              {/* Snout */}
              <ellipse cx="60" cy="66" rx="3.5" ry="2.5" fill="#2D282A" />
              <path d="M57 70 Q60 73 63 70" stroke="#2D282A" strokeWidth="2" strokeLinecap="round" fill="none" />

              {/* Paws on cheeks */}
              <ellipse cx="30" cy="78" rx="8" ry="7" fill="#FFFFFF" stroke="#1F1A1C" strokeWidth="2.5" />
              <ellipse cx="90" cy="78" rx="8" ry="7" fill="#FFFFFF" stroke="#1F1A1C" strokeWidth="2.5" />
            </svg>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
