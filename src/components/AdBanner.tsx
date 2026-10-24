"use client";

import React, { useEffect, useRef } from "react";

interface AdBannerProps {
  slotId?: string;
  format?: "auto" | "rectangle" | "horizontal" | "fluid";
  responsive?: boolean;
  className?: string;
  label?: string;
}

export function AdBanner({
  slotId,
  format = "auto",
  responsive = true,
  className = "",
  label = "Sponsored"
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement | null>(null);
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const isConfigured = Boolean(
    adsenseClientId && 
    adsenseClientId.startsWith("ca-pub-") && 
    !adsenseClientId.includes("0000000000000000")
  );

  useEffect(() => {
    if (!isConfigured || !adRef.current) return;
    try {
      // @ts-expect-error window.adsbygoogle is injected by Google AdSense script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ignore adsbygoogle push errors in dev or adblock environments
    }
  }, [isConfigured]);

  // If live AdSense is active, render the official AdSense unit
  if (isConfigured) {
    return (
      <aside aria-label="Advertisement" className={`w-full my-4 flex flex-col items-center justify-center ${className}`}>
        <span className="text-[10px] tracking-wider uppercase text-slate-400 font-bold mb-1">
          {label}
        </span>
        <div className="w-full max-w-2xl min-h-[90px] overflow-hidden flex justify-center items-center bg-white/40 rounded-2xl border border-sky-200/60 p-1">
          <ins
            ref={adRef}
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client={adsenseClientId}
            data-ad-slot={slotId || process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME || "1234567890"}
            data-ad-format={format}
            data-full-width-responsive={responsive ? "true" : "false"}
          />
        </div>
      </aside>
    );
  }

  // Developer / Preview Placeholder (keeps layout stable, matches Kawaii theme)
  return (
    <aside
      aria-label="Advertisement Preview"
      className={`w-full max-w-2xl mx-auto my-4 px-4 py-3 rounded-2xl bg-white/70 backdrop-blur-sm border-2 border-dashed border-sky-300 flex flex-col items-center justify-center text-center shadow-sm ${className}`}
    >
      <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-sky-700">
        <span>📢</span>
        <span>{label}</span>
      </div>
      <p className="text-xs text-slate-500 mt-0.5 font-medium">
        Ad Slot {slotId ? `(#${slotId})` : "Ready"} • Set <code className="bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded text-[11px] font-mono">NEXT_PUBLIC_ADSENSE_CLIENT_ID</code> to show live ads
      </p>
    </aside>
  );
}
