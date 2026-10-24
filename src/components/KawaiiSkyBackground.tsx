"use client";

import React, { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

export function KawaiiSkyBackground() {
  const isMounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none" aria-hidden="true">
      {/* Sky Blue Backdrop with soft cloud gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#8AC0EF] via-[#9FD4F7] to-[#D5EEFD]" />

      {/* Sunny Halo in top center */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-white/30 blur-3xl" />
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-amber-200/40 blur-2xl animate-pulse" />

      {/* Floating Puffy Clouds (Left side) */}
      <div className="absolute top-16 -left-12 opacity-85 animate-cloud-left">
        <svg width="240" height="110" viewBox="0 0 240 110" fill="none">
          <path
            d="M50 80C30 80 15 65 15 45C15 28 28 15 45 15C52 15 58 17 63 21C73 8 92 0 112 0C138 0 160 14 168 35C175 32 182 30 190 30C212 30 230 48 230 70C230 92 212 110 190 110L50 110C30 110 15 95 15 80"
            fill="white"
            fillOpacity="0.95"
          />
        </svg>
      </div>

      {/* Floating Puffy Clouds (Right side) */}
      <div className="absolute top-36 -right-16 opacity-80 animate-cloud-right" style={{ animationDelay: "2s" }}>
        <svg width="280" height="130" viewBox="0 0 280 130" fill="none">
          <path
            d="M60 90C35 90 20 72 20 50C20 30 35 15 55 15C63 15 70 18 76 22C88 8 110 0 135 0C165 0 190 16 200 40C208 36 218 34 228 34C254 34 275 55 275 80C275 105 254 126 228 126L60 126"
            fill="white"
            fillOpacity="0.9"
          />
        </svg>
      </div>

      {/* Lower Background Cloud (Mid screen) */}
      <div className="absolute top-[65%] -left-20 opacity-70 animate-cloud-left" style={{ animationDelay: "4s" }}>
        <svg width="220" height="100" viewBox="0 0 220 100" fill="none">
          <path
            d="M40 70C25 70 10 58 10 42C10 26 22 14 38 14C44 14 50 16 55 20C65 8 82 0 102 0C128 0 148 14 156 34C162 31 169 30 176 30C195 30 210 45 210 65C210 85 195 100 176 100L40 100"
            fill="white"
            fillOpacity="0.85"
          />
        </svg>
      </div>

      {/* Sparkle Stars (4-point yellow & white stars) */}
      <div className="absolute top-28 left-[22%] animate-sparkle-spin">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#FEF08A">
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
        </svg>
      </div>

      <div className="absolute top-48 right-[24%] animate-sparkle-spin" style={{ animationDelay: "1.8s" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF">
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
        </svg>
      </div>

      <div className="absolute top-[55%] right-[12%] animate-sparkle-spin" style={{ animationDelay: "3s" }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#FDE047">
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
        </svg>
      </div>
    </div>
  );
}
