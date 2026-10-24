"use client";

import React, { useSyncExternalStore } from "react";

// Client-only mounting check using useSyncExternalStore
function subscribe() {
  return () => {};
}

export function HeartBackground() {
  const isMounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  if (!isMounted) return null;

  const floatingHearts = [
    { top: "12%", left: "8%", size: "w-5 h-5", delay: "0s", duration: "6s", opacity: 0.25 },
    { top: "25%", left: "88%", size: "w-6 h-6", delay: "1.5s", duration: "7s", opacity: 0.2 },
    { top: "60%", left: "6%", size: "w-4 h-4", delay: "3s", duration: "5s", opacity: 0.15 },
    { top: "75%", left: "92%", size: "w-7 h-7", delay: "2s", duration: "8s", opacity: 0.2 },
    { top: "85%", left: "20%", size: "w-5 h-5", delay: "4s", duration: "6.5s", opacity: 0.2 }
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Radial ambient glow orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-pink-600/15 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px]" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[130px]" />

      {/* Floating subtle hearts */}
      {floatingHearts.map((heart, idx) => (
        <div
          key={idx}
          className="absolute text-pink-400 select-none animate-float"
          style={{
            top: heart.top,
            left: heart.left,
            opacity: heart.opacity,
            animationDelay: heart.delay,
            animationDuration: heart.duration
          }}
        >
          <svg className={heart.size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}
    </div>
  );
}
