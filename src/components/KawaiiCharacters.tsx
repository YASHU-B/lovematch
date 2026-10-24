"use client";

import React from "react";

/**
 * Authentic Kawaii Brown Bear (Bubu style) matching block.youtest.me
 */
export function KawaiiBear({
  size = "md",
  mood = "cute",
  withDrink = false,
  withLaptop = false,
  className = ""
}: {
  size?: "sm" | "md" | "lg" | "xl";
  mood?: "cute" | "smug" | "happy" | "sleepy";
  withDrink?: boolean;
  withLaptop?: boolean;
  className?: string;
}) {
  const sizeMap = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-36 h-36",
    xl: "w-48 h-48"
  };

  return (
    <div className={`relative inline-block ${sizeMap[size]} ${className}`}>
      <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
        {/* Left Ear */}
        <circle cx="32" cy="30" r="14" fill="#C68958" stroke="#372013" strokeWidth="3" />
        <circle cx="32" cy="30" r="8" fill="#F4B785" />

        {/* Right Ear */}
        <circle cx="88" cy="30" r="14" fill="#C68958" stroke="#372013" strokeWidth="3" />
        <circle cx="88" cy="30" r="8" fill="#F4B785" />

        {/* Bear Head */}
        <rect
          x="20"
          y="24"
          width="80"
          height="72"
          rx="36"
          fill="#D69766"
          stroke="#372013"
          strokeWidth="3.5"
        />

        {/* Cheeks blush */}
        <ellipse cx="32" cy="68" rx="7" ry="4.5" fill="#FF8BA7" opacity="0.65" />
        <ellipse cx="88" cy="68" rx="7" ry="4.5" fill="#FF8BA7" opacity="0.65" />

        {/* Eyes based on mood */}
        {mood === "smug" ? (
          <>
            {/* Left smug half-closed eye */}
            <path d="M35 56 Q42 50 49 56" stroke="#25140A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            {/* Right eye */}
            <path d="M71 56 Q78 50 85 56" stroke="#25140A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          </>
        ) : mood === "happy" ? (
          <>
            <path d="M36 58 Q42 50 48 58" stroke="#25140A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M72 58 Q78 50 84 58" stroke="#25140A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            <circle cx="42" cy="56" r="4.5" fill="#25140A" />
            <circle cx="43.5" cy="54" r="1.5" fill="#FFFFFF" />
            <circle cx="78" cy="56" r="4.5" fill="#25140A" />
            <circle cx="79.5" cy="54" r="1.5" fill="#FFFFFF" />
          </>
        )}

        {/* Snout area */}
        <ellipse cx="60" cy="65" rx="14" ry="10" fill="#FCEBD9" stroke="#372013" strokeWidth="2.5" />
        {/* Nose */}
        <ellipse cx="60" cy="61" rx="4" ry="3" fill="#25140A" />
        {/* Mouth */}
        <path d="M57 66 Q60 69 63 66" stroke="#25140A" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Small paws / arms */}
        <ellipse cx="44" cy="94" rx="8" ry="6" fill="#C68958" stroke="#372013" strokeWidth="2.5" />
        <ellipse cx="76" cy="94" rx="8" ry="6" fill="#C68958" stroke="#372013" strokeWidth="2.5" />

        {/* With Strawberry Milk / Boba Drink */}
        {withDrink && (
          <g transform="translate(48, 70)">
            <rect x="5" y="10" width="14" height="20" rx="3" fill="#FCE7F3" stroke="#372013" strokeWidth="2" />
            {/* Liquid */}
            <rect x="6.5" y="15" width="11" height="13.5" rx="2" fill="#F472B6" />
            {/* Straw */}
            <line x1="12" y1="2" x2="16" y2="10" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
            {/* Lid */}
            <rect x="4" y="8" width="16" height="3" rx="1.5" fill="#CBD5E1" stroke="#372013" strokeWidth="1.5" />
          </g>
        )}

        {/* With Laptop */}
        {withLaptop && (
          <g transform="translate(36, 76)">
            {/* Laptop Base */}
            <polygon points="0,22 48,22 44,28 4,28" fill="#E2E8F0" stroke="#372013" strokeWidth="2" />
            {/* Laptop Screen */}
            <polygon points="8,8 40,8 46,22 2,22" fill="#94A3B8" stroke="#372013" strokeWidth="2" />
            <rect x="12" y="11" width="24" height="9" fill="#38BDF8" rx="1" />
          </g>
        )}
      </svg>
    </div>
  );
}

/**
 * Authentic Kawaii White Panda (Dudu style) matching block.youtest.me
 */
export function KawaiiPanda({
  size = "md",
  mood = "shy",
  className = ""
}: {
  size?: "sm" | "md" | "lg" | "xl";
  mood?: "shy" | "happy" | "cute";
  className?: string;
}) {
  const sizeMap = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-36 h-36",
    xl: "w-48 h-48"
  };

  return (
    <div className={`relative inline-block ${sizeMap[size]} ${className}`}>
      <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
        {/* Left Panda Ear (Black) */}
        <circle cx="32" cy="30" r="14" fill="#2D282A" stroke="#1F1A1C" strokeWidth="3" />
        <circle cx="32" cy="30" r="7" fill="#4B4447" />

        {/* Right Panda Ear (Black) */}
        <circle cx="88" cy="30" r="14" fill="#2D282A" stroke="#1F1A1C" strokeWidth="3" />
        <circle cx="88" cy="30" r="7" fill="#4B4447" />

        {/* Panda White Head */}
        <rect
          x="20"
          y="24"
          width="80"
          height="72"
          rx="36"
          fill="#FFFFFF"
          stroke="#1F1A1C"
          strokeWidth="3.5"
        />

        {/* Cheeks big blushing rosy circles */}
        <circle cx="32" cy="70" r="7.5" fill="#FF8FA3" opacity="0.8" />
        <circle cx="88" cy="70" r="7.5" fill="#FF8FA3" opacity="0.8" />

        {/* Eye Patches (Panda signature dark oval) */}
        <ellipse cx="42" cy="56" rx="9" ry="11" fill="#2D282A" transform="rotate(-15 42 56)" />
        <ellipse cx="78" cy="56" rx="9" ry="11" fill="#2D282A" transform="rotate(15 78 56)" />

        {/* Eyes inside patches */}
        {mood === "shy" ? (
          <>
            <circle cx="43" cy="55" r="4.5" fill="#FFFFFF" />
            <circle cx="44" cy="55" r="2.5" fill="#1F1A1C" />
            <circle cx="44.8" cy="54" r="1" fill="#FFFFFF" />

            <circle cx="77" cy="55" r="4.5" fill="#FFFFFF" />
            <circle cx="76" cy="55" r="2.5" fill="#1F1A1C" />
            <circle cx="75.2" cy="54" r="1" fill="#FFFFFF" />
          </>
        ) : (
          <>
            <path d="M38 56 Q42 51 46 56" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M74 56 Q78 51 82 56" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        )}

        {/* Tiny Panda Nose & Cute Mouth */}
        <ellipse cx="60" cy="66" rx="3.5" ry="2.5" fill="#2D282A" />
        <path d="M57 70 Q60 73 63 70" stroke="#2D282A" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Paws on cheeks / hugging face (Shy pose) */}
        <ellipse cx="30" cy="78" rx="8" ry="7" fill="#FFFFFF" stroke="#1F1A1C" strokeWidth="2.5" />
        <ellipse cx="90" cy="78" rx="8" ry="7" fill="#FFFFFF" stroke="#1F1A1C" strokeWidth="2.5" />
      </svg>
    </div>
  );
}

/**
 * Hand-drawn colorful squiggly/wavy underline SVG (matches block.youtest.me)
 */
export function WavyUnderline({
  color = "yellow",
  className = "w-20 h-2"
}: {
  color?: "yellow" | "pink" | "blue" | "green" | "orange";
  className?: string;
}) {
  const colorMap = {
    yellow: "#FBBF24",
    pink: "#F472B6",
    blue: "#38BDF8",
    green: "#34D399",
    orange: "#FB923C"
  };

  return (
    <svg
      viewBox="0 0 100 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="none"
    >
      <path
        d="M2 5 Q 8 1, 14 5 T 26 5 T 38 5 T 50 5 T 62 5 T 74 5 T 86 5 T 98 5"
        stroke={colorMap[color]}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Decorative Washi Tape Sticker (seen on the top left of notebook card in screenshot)
 */
export function WashiTape({
  color = "pink",
  className = ""
}: {
  color?: "pink" | "yellow" | "blue";
  className?: string;
}) {
  return (
    <div
      className={`absolute w-14 h-6 rounded-xs opacity-90 shadow-sm pointer-events-none select-none z-20 ${
        color === "pink"
          ? "bg-pink-300/80 border-t border-b border-pink-400/60"
          : color === "yellow"
          ? "bg-yellow-300/80 border-t border-b border-yellow-400/60"
          : "bg-sky-300/80 border-t border-b border-sky-400/60"
      } ${className}`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.4) 4px, rgba(255,255,255,0.4) 8px)"
      }}
    />
  );
}

/**
 * Notebook Paper Spiral Holes (seen on left edge of notebook card)
 */
export function NotebookSpiralBinding() {
  return (
    <div className="absolute left-2 top-4 bottom-4 flex flex-col justify-around pointer-events-none select-none z-10">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-200 border border-slate-300 shadow-inner" />
          <div className="w-1.5 h-0.5 bg-slate-300" />
        </div>
      ))}
    </div>
  );
}
