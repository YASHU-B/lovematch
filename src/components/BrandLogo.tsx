import React from "react";
import Link from "next/link";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  withSubtitle?: boolean;
  href?: string;
}

export function BrandLogo({ size = "md", withSubtitle = false, href = "/" }: BrandLogoProps) {
  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-11 h-11"
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl sm:text-4xl"
  };

  const content = (
    <div className="inline-flex items-center gap-2.5 group cursor-pointer select-none">
      <div className={`relative flex items-center justify-center ${iconSizes[size]}`}>
        {/* Glowing backdrop */}
        <div className="absolute inset-0 bg-pink-500 rounded-full blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
        
        {/* Custom Interlocking Heart SVG */}
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10 drop-shadow-md"
        >
          {/* Left heart in romantic pink */}
          <path
            d="M14 6C10.6863 6 8 8.68629 8 12C8 17.5 15 24 18 26C18.5 24.5 19 23.5 19.8 22C16 19 12 14.5 12 12C12 9.79086 13.7909 8 16 8C17.5 8 18.5 9 19 10C19.5 9 20.5 8 22 8C20.5 6.7 17 6 14 6Z"
            fill="url(#heart-grad-left)"
          />
          {/* Right heart in vibrant magenta/lavender */}
          <path
            d="M22 10C25.3137 10 28 12.6863 28 16C28 21.5 21 28 18 30C15 28 8 21.5 8 16C8 12.6863 10.6863 10 14 10C15.8 10 17.2 11 18 12.2C18.8 11 20.2 10 22 10Z"
            fill="url(#heart-grad-right)"
            fillOpacity="0.9"
          />
          {/* Sparkle star */}
          <circle cx="27" cy="8" r="2" fill="#FFF8FC" className="animate-pulse" />
          <defs>
            <linearGradient id="heart-grad-left" x1="8" y1="6" x2="22" y2="26" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F472B6" />
              <stop offset="1" stopColor="#EC4899" />
            </linearGradient>
            <linearGradient id="heart-grad-right" x1="8" y1="10" x2="28" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#EC4899" />
              <stop offset="1" stopColor="#C4B5FD" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span className={`font-black tracking-tight text-white ${textSizes[size]}`}>
            Love<span className="text-pink-400">Match</span>
          </span>
          <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
            Sync
          </span>
        </div>
        {withSubtitle && (
          <span className="text-[11px] sm:text-xs font-medium text-pink-200/80 -mt-0.5">
            Who Knows Who Better?
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} aria-label="LoveMatch Home">
        {content}
      </Link>
    );
  }

  return content;
}
