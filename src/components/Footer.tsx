import React from "react";
import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { Heart, ShieldCheck, Lock } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t-2 border-slate-900 bg-white/90 backdrop-blur-md py-8 px-4 sm:px-6 mt-auto">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <BrandLogo size="md" withSubtitle={true} />
          <p className="text-xs font-bold text-slate-600 mt-2 max-w-sm">
            Create your custom quiz, send it to friends, and uncover who your real friends are!
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm font-bold text-slate-700">
          <Link href="/create" className="hover:text-pink-600 transition-colors">
            Create Quiz
          </Link>
          <Link href="/join" className="hover:text-pink-600 transition-colors">
            Join Room
          </Link>
          <Link href="/privacy" className="hover:text-pink-600 transition-colors flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-pink-500" />
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-pink-600 transition-colors">
            Terms
          </Link>
          <Link href="/admin" className="hover:text-slate-900 transition-colors flex items-center gap-1 text-slate-400">
            <Lock className="w-3 h-3" />
            Admin
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto border-t border-slate-200 mt-6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-slate-500 text-center">
        <div className="flex items-center gap-1.5">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 animate-pulse" />
          <span>for friends and couples everywhere.</span>
        </div>
        <p>© 2026 Don&apos;t Block Me / YouTest. Purely for fun and laughs!</p>
      </div>
    </footer>
  );
}
