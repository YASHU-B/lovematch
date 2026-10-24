"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { soundEffects } from "./AudioEffects";

interface InteractiveOptionCardProps {
  option: string;
  isSelected: boolean;
  disabled: boolean;
  onSelect: (option: string) => void;
  index: number;
}

export function InteractiveOptionCard({
  option,
  isSelected,
  disabled,
  onSelect,
  index
}: InteractiveOptionCardProps) {
  const handleClick = () => {
    if (disabled) return;
    soundEffects.playPop();
    onSelect(option);
  };

  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 350, damping: 25 }}
      whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.96 } : {}}
      className={`w-full min-touch-target text-left px-4 py-3.5 rounded-2xl border text-sm font-semibold transition-all relative overflow-hidden flex items-center justify-between ${
        isSelected
          ? "glass-card-selected text-white ring-2 ring-pink-400/80 shadow-lg shadow-pink-500/30"
          : "glass-card text-pink-100 hover:text-white hover:border-pink-500/50"
      } ${disabled ? "cursor-default opacity-85" : "cursor-pointer"}`}
    >
      {/* Background ripple highlight when selected */}
      {isSelected && (
        <motion.div
          layoutId="selected-indicator"
          className="absolute inset-0 bg-gradient-to-r from-pink-500/25 via-rose-500/20 to-purple-500/20 -z-0 pointer-events-none"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}

      <span className="relative z-10 pr-2">{option}</span>

      {/* Check Icon with bouncy pop */}
      {isSelected ? (
        <motion.span
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          className="w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-pink-500/50 relative z-10"
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </motion.span>
      ) : (
        <span className="w-5 h-5 rounded-full border border-pink-400/30 shrink-0" />
      )}
    </motion.button>
  );
}
