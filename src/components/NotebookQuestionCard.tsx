"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { 
  KawaiiBear, 
  WavyUnderline, 
  WashiTape, 
  NotebookSpiralBinding 
} from "./KawaiiCharacters";

interface NotebookQuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  creatorName: string;
  questionText: string;
  emoji: string;
  options: string[];
  selectedOption?: string;
  onSelectOption: (option: string) => void;
  onShuffle?: () => void;
  isCreatorMode?: boolean;
}

// Maps question keywords to cute thumbnail icons / badges for the left thumbnail box
function getOptionThumbnail(text: string, emoji: string, index: number) {
  const lower = text.toLowerCase();
  
  if (lower.includes("shinchan")) return { type: "emoji", value: "🖍️", bg: "bg-red-50", border: "border-red-200" };
  if (lower.includes("doraemon")) return { type: "emoji", value: "🔔", bg: "bg-sky-50", border: "border-sky-200" };
  if (lower.includes("ninja") || lower.includes("hattori")) return { type: "emoji", value: "🥷", bg: "bg-indigo-50", border: "border-indigo-200" };
  if (lower.includes("snack") || lower.includes("food") || lower.includes("burger") || lower.includes("biryani") || lower.includes("pizza") || lower.includes("fries")) {
    return { type: "emoji", value: "🍔", bg: "bg-amber-50", border: "border-amber-200" };
  }
  if (lower.includes("clothes") || lower.includes("shoes") || lower.includes("hoodie") || lower.includes("outfit")) {
    return { type: "emoji", value: "👟", bg: "bg-purple-50", border: "border-purple-200" };
  }
  if (lower.includes("game") || lower.includes("gaming") || lower.includes("playstation")) {
    return { type: "emoji", value: "🎮", bg: "bg-emerald-50", border: "border-emerald-200" };
  }
  if (lower.includes("tech") || lower.includes("accessories") || lower.includes("phone") || lower.includes("gadget")) {
    return { type: "emoji", value: "⌚", bg: "bg-slate-100", border: "border-slate-300" };
  }
  if (lower.includes("reels") || lower.includes("tiktok") || lower.includes("doomscroll")) {
    return { type: "emoji", value: "📱", bg: "bg-pink-50", border: "border-pink-200" };
  }
  if (lower.includes("nap") || lower.includes("sleep") || lower.includes("bed")) {
    return { type: "emoji", value: "🛌", bg: "bg-blue-50", border: "border-blue-200" };
  }
  if (lower.includes("block")) {
    return { type: "emoji", value: "🚫", bg: "bg-rose-50", border: "border-rose-200" };
  }
  if (lower.includes("call") || lower.includes("panic")) {
    return { type: "emoji", value: "📞", bg: "bg-yellow-50", border: "border-yellow-200" };
  }
  if (lower.includes("car") || lower.includes("drive") || lower.includes("road")) {
    return { type: "emoji", value: "🚗", bg: "bg-cyan-50", border: "border-cyan-200" };
  }
  if (lower.includes("music") || lower.includes("song") || lower.includes("playlist")) {
    return { type: "emoji", value: "🎧", bg: "bg-violet-50", border: "border-violet-200" };
  }

  // Fallback themed icons based on option index
  const fallbacks = [
    { value: emoji || "✨", bg: "bg-yellow-50", border: "border-yellow-200" },
    { value: "💖", bg: "bg-pink-50", border: "border-pink-200" },
    { value: "⭐", bg: "bg-sky-50", border: "border-sky-200" },
    { value: "🍀", bg: "bg-emerald-50", border: "border-emerald-200" }
  ];
  return { type: "emoji", ...fallbacks[index % fallbacks.length] };
}

// Alternating squiggly colors matching the screenshot
const SQUIGGLY_COLORS: Array<"pink" | "yellow" | "blue" | "green" | "orange"> = [
  "pink",
  "blue",
  "orange",
  "green"
];

export function NotebookQuestionCard({
  questionNumber,
  totalQuestions,
  creatorName,
  questionText,
  emoji,
  options,
  selectedOption,
  onSelectOption,
  onShuffle,
  isCreatorMode = false
}: NotebookQuestionCardProps) {
  const displayName = creatorName?.trim() || "your friend";

  // Format question text to highlight name dynamically with pink wavy underline
  const formattedQuestion = () => {
    // Check if the question text already has the creator's name or placeholder "I" / "my"
    if (questionText.toLowerCase().includes("my ") || questionText.toLowerCase().includes("i ")) {
      // E.g. "What is my absolute favorite food?" -> "What's [name]'s absolute favorite food?"
      const replaced = questionText
        .replace(/^What is my\b/i, `What's ${displayName}'s`)
        .replace(/^What do I\b/i, `What does ${displayName}`)
        .replace(/\bmy\b/gi, `${displayName}'s`)
        .replace(/\bI\b/g, displayName);

      // Split around displayName to style it
      const parts = replaced.split(new RegExp(`(${displayName}(?:'s)?)`, "i"));
      return (
        <span>
          {parts.map((part, i) => {
            if (part.toLowerCase().startsWith(displayName.toLowerCase())) {
              return (
                <span key={i} className="text-pink-500 font-black relative inline-block mx-1">
                  {part}
                  <WavyUnderline color="pink" className="absolute -bottom-1.5 left-0 w-full h-2" />
                </span>
              );
            }
            return <span key={i}>{part}</span>;
          })}
        </span>
      );
    }

    return (
      <span>
        {questionText}{" "}
        <span className="text-pink-500 font-black relative inline-block mx-1">
          {displayName}
          <WavyUnderline color="pink" className="absolute -bottom-1.5 left-0 w-full h-2" />
        </span>
      </span>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* The Iconic Torn Notebook Paper Card */}
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="relative bg-white rounded-3xl border-2 border-slate-200 shadow-[0_6px_20px_rgba(138,192,239,0.25)] pt-8 pb-7 px-6 sm:px-8 mb-6 overflow-hidden select-none"
      >
        {/* Left Spiral Binding Holes */}
        <NotebookSpiralBinding />

        {/* Washi Tape top-left */}
        <WashiTape color="pink" className="-top-2.5 left-7 -rotate-12" />

        {/* Top-Center Yellow Sticky Tape "Question X / Y" */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
          <div className="px-5 py-1.5 rounded-b-xl bg-yellow-300 border-x-2 border-b-2 border-yellow-400 font-black text-xs text-slate-800 shadow-sm tracking-wide">
            Question {questionNumber} of {totalQuestions}
          </div>
        </div>

        {/* Shuffle Button (Creator mode only) */}
        {isCreatorMode && onShuffle && (
          <button
            onClick={onShuffle}
            title="Change question"
            className="absolute top-3 right-3 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-white/90 px-2.5 py-1 rounded-full border border-slate-200 shadow-sm active:scale-95 transition-transform z-20"
          >
            <RotateCcw className="w-3 h-3 text-sky-500" />
            <span className="text-[11px]">Change</span>
          </button>
        )}

        {/* Floating Cute Kawaii Stickers around the paper */}
        <div className="absolute top-4 right-10 text-pink-400 text-lg pointer-events-none opacity-80 animate-pulse">
          💖
        </div>
        <div className="absolute top-12 left-9 text-sky-400 text-sm font-black pointer-events-none select-none">
          ❓
        </div>
        <div className="absolute bottom-6 left-8 text-yellow-400 text-base pointer-events-none select-none animate-spin-slow">
          ⭐
        </div>
        <div className="absolute top-20 right-5 text-purple-400 text-sm pointer-events-none select-none">
          ✨
        </div>

        {/* Question Heading Content */}
        <div className="relative z-10 pl-4 pr-1 text-center mt-2">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug tracking-tight">
            {formattedQuestion()}
          </h2>

          {/* Centered Topic Emoji with gentle float animation */}
          <motion.div
            animate={{ y: [-3, 3, -3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-3xl my-2 inline-block filter drop-shadow-sm"
          >
            {emoji}
          </motion.div>
        </div>

        {/* Kawaii Bear Mascot sitting in bottom-right corner of notebook! */}
        <div className="absolute -bottom-2 -right-1 pointer-events-none select-none z-10 opacity-95">
          <KawaiiBear
            size="sm"
            mood="cute"
            withDrink={questionNumber % 2 === 0}
            withLaptop={questionNumber % 2 !== 0}
            className="translate-x-1 translate-y-1"
          />
        </div>
      </motion.div>

      {/* The 4 Bubbly Option Cards matching block.youtest.me */}
      <div className="space-y-3.5">
        {options.map((opt, i) => {
          const isSelected = selectedOption === opt;
          const thumbnail = getOptionThumbnail(opt, emoji, i);
          const squigglyColor = SQUIGGLY_COLORS[i % SQUIGGLY_COLORS.length];

          return (
            <motion.button
              key={i}
              type="button"
              onClick={() => onSelectOption(opt)}
              whileHover={{ y: -2 }}
              whileTap={{ y: 2 }}
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
              className={`w-full p-3 sm:p-3.5 rounded-3xl border-2 text-left flex items-center justify-between gap-3.5 transition-all ${
                isSelected
                  ? "bg-amber-50 border-amber-400 shadow-[0_4px_0_#F59E0B]"
                  : "bg-white border-slate-100 hover:border-slate-200 shadow-[0_4px_0_#CBD5E1]"
              }`}
            >
              {/* Left: Rounded Square Thumbnail / Icon container */}
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border ${thumbnail.border} ${thumbnail.bg} flex items-center justify-center text-2xl sm:text-3xl shrink-0 shadow-inner`}
              >
                <span>{thumbnail.value}</span>
              </div>

              {/* Center: Title + Colorful Wavy Underline */}
              <div className="flex-1 flex flex-col justify-center min-w-0">
                <span className="text-slate-900 font-extrabold text-sm sm:text-base leading-tight break-words">
                  {opt}
                </span>
                <div className="mt-1">
                  <WavyUnderline color={squigglyColor} className="w-20 sm:w-24 h-2" />
                </div>
              </div>

              {/* Right: Checkmark on selection */}
              <div className="shrink-0 pr-1">
                {isSelected ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  >
                    <CheckCircle2 className="w-6 h-6 text-amber-500 fill-amber-100" />
                  </motion.div>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-200" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
