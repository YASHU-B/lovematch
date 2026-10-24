import React from "react";
import Link from "next/link";
import { KawaiiBear } from "./KawaiiCharacters";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  withSubtitle?: boolean;
  href?: string;
}

export function BrandLogo({ size = "md", withSubtitle = false, href = "/" }: BrandLogoProps) {
  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14"
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl sm:text-2xl",
    lg: "text-2xl sm:text-3xl"
  };

  const content = (
    <div className="inline-flex items-center gap-2.5 group cursor-pointer select-none">
      <div className={`relative flex items-center justify-center ${iconSizes[size]} transition-transform group-hover:scale-105 active:scale-95`}>
        {/* Kawaii Bear Mascot Badge */}
        <div className="w-full h-full rounded-2xl bg-amber-100 border-2 border-slate-900 shadow-[0_3px_0_#1E293B] flex items-center justify-center overflow-hidden p-1">
          <KawaiiBear size="sm" mood="cute" className="w-full h-full" />
        </div>
      </div>

      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-tight text-slate-900 ${textSizes[size]}`}>
            Don&apos;t Block <span className="text-pink-500">Me</span>
          </span>
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-yellow-300 text-slate-900 border border-slate-900 shadow-[0_1.5px_0_#1E293B]">
            Quiz
          </span>
        </div>
        {withSubtitle && (
          <span className="text-xs font-bold text-slate-700">
            Find Your Fake Friends!
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} aria-label="Don't Block Me Home">
        {content}
      </Link>
    );
  }

  return content;
}
