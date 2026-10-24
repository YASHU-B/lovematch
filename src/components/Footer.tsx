import React from "react";
import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { Heart, ShieldCheck, Lock } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-pink-500/20 bg-[#1e0d26]/80 backdrop-blur-md py-8 px-4 sm:px-6 mt-auto">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <BrandLogo size="md" withSubtitle={true} />
          <p className="text-xs text-pink-300/70 mt-2 max-w-sm">
            Answer. Reveal. Discover how in sync you really are with the one who matters most.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-pink-200/80">
          <Link href="/play" className="hover:text-pink-400 transition-colors">
            Categories
          </Link>
          <Link href="/create" className="hover:text-pink-400 transition-colors">
            Create Quiz
          </Link>
          <Link href="/join" className="hover:text-pink-400 transition-colors">
            Join with Code
          </Link>
          <Link href="/privacy" className="hover:text-pink-400 transition-colors flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-pink-400" />
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-pink-400 transition-colors">
            Terms
          </Link>
          <Link href="/admin" className="hover:text-pink-400 transition-colors flex items-center gap-1 text-pink-400/60">
            <Lock className="w-3 h-3" />
            Admin
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto border-t border-pink-500/10 mt-6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-pink-300/60 text-center">
        <div className="flex items-center gap-1.5">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 animate-pulse" />
          <span>for couples and best friends worldwide.</span>
        </div>
        <p>© 2026 LoveMatch. Love Sync Scores are for entertainment and bonding.</p>
      </div>
    </footer>
  );
}
