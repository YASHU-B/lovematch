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

        {/* Mascot Characters: Pink Heart & Purple Heart Hugging */}
        <motion.div
          animate={{
            y: [-4, 4, -4],
            rotate: [-2, 2, -2]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative z-10 w-full h-full flex items-center justify-center"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
            {/* Left Heart: Romantic Pink */}
            <path
              d="M32 25 C20 25 10 35 10 48 C10 65 35 80 42 85 C40 75 35 60 40 45 C42 35 38 25 32 25 Z"
              fill="url(#mascot-pink)"
            />
            {/* Right Heart: Midnight Purple / Lavender */}
            <path
              d="M68 25 C80 25 90 35 90 48 C90 65 65 80 58 85 C60 75 65 60 60 45 C58 35 62 25 68 25 Z"
              fill="url(#mascot-purple)"
            />
            {/* Center overlap joint */}
            <path
              d="M50 36 C42 22 25 25 25 42 C25 60 50 82 50 82 C50 82 75 60 75 42 C75 25 58 22 50 36 Z"
              fill="url(#mascot-gradient)"
            />

            {/* Cute Cartoon Eyes (Left Heart) */}
            <ellipse cx="38" cy="46" rx="3.5" ry="5" fill="#1e0a24" />
            <circle cx="39.5" cy="44.5" r="1.5" fill="#FFF8FC" />

            {/* Cute Cartoon Eyes (Right Heart) */}
            <ellipse cx="62" cy="46" rx="3.5" ry="5" fill="#1e0a24" />
            <circle cx="63.5" cy="44.5" r="1.5" fill="#FFF8FC" />

            {/* Rosy Blushing Cheeks */}
            <circle cx="32" cy="53" r="3.5" fill="#f43f5e" opacity="0.6" />
            <circle cx="68" cy="53" r="3.5" fill="#f43f5e" opacity="0.6" />

            {/* Happy Smiling Mouth */}
            <path
              d="M45 53 Q50 58 55 53"
              stroke="#1e0a24"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />

            <defs>
              <linearGradient id="mascot-pink" x1="10" y1="25" x2="50" y2="85" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F472B6" />
                <stop offset="1" stopColor="#EC4899" />
              </linearGradient>
              <linearGradient id="mascot-purple" x1="90" y1="25" x2="50" y2="85" gradientUnits="userSpaceOnUse">
                <stop stopColor="#EC4899" />
                <stop offset="1" stopColor="#A855F7" />
              </linearGradient>
              <linearGradient id="mascot-gradient" x1="25" y1="25" x2="75" y2="85" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F472B6" />
                <stop offset="0.5" stopColor="#EC4899" />
                <stop offset="1" stopColor="#C4B5FD" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
