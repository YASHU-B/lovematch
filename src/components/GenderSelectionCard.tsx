"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { KawaiiBear, KawaiiPanda, WavyUnderline } from "./KawaiiCharacters";
import { soundEffects } from "./AudioEffects";

interface GenderSelectionCardProps {
  name: string;
  onChangeName?: (name: string) => void;
  selectedGender: "male" | "female" | null;
  onSelectGender: (gender: "male" | "female") => void;
  onBack?: () => void;
}

export function GenderSelectionCard({
  name,
  onChangeName,
  selectedGender,
  onSelectGender,
  onBack
}: GenderSelectionCardProps) {
  const handlePick = (gender: "male" | "female") => {
    soundEffects.playPop();
    onSelectGender(gender);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 text-center select-none">
      {/* Top Bar with Back Arrow and Flag */}
      <div className="flex items-center justify-between mb-4">
        {onBack ? (
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-slate-700 shadow-sm hover:bg-slate-50 active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-10 h-10" />
        )}

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-slate-200 text-xs font-black shadow-sm">
          <span>🇮🇳</span>
          <span className="text-slate-600 text-[11px]">EN</span>
        </div>
      </div>

      {/* Cute Subtitle: "hi, {name} 👋" */}
      <div className="mb-2">
        {onChangeName ? (
          <div className="inline-flex items-center gap-1.5 text-sm sm:text-base font-extrabold text-slate-700">
            <span>hi,</span>
            <input
              type="text"
              value={name}
              onChange={(e) => onChangeName(e.target.value)}
              placeholder="your nickname"
              className="px-2 py-0.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-700 font-black focus:outline-none focus:bg-white text-center max-w-[140px]"
            />
            <span>👋</span>
          </div>
        ) : (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm sm:text-base font-extrabold text-slate-700"
          >
            hi, <span className="text-amber-600 underline font-black">{name || "friend"}</span> 👋
          </motion.p>
        )}
      </div>

      {/* Main Banner: "choose your gender" */}
      <div className="inline-block bg-white rounded-3xl border-2 border-slate-200 shadow-[0_4px_12px_rgba(138,192,239,0.3)] px-8 py-3 mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          choose your{" "}
          <span className="text-sky-500 relative inline-block">
            gender
            <WavyUnderline color="orange" className="absolute -bottom-1.5 left-0 w-full h-2" />
          </span>
        </h2>
      </div>

      {/* Gender Polaroid Cards (Male Bear & Female Panda) */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-8 max-w-sm mx-auto">
        {/* Male Polaroid Card (Brown Bear) */}
        <motion.div
          whileHover={{ y: -6, scale: 1.02 }}
          whileTap={{ y: 2, scale: 0.98 }}
          onClick={() => handlePick("male")}
          className={`cursor-pointer bg-white rounded-3xl p-4 sm:p-5 border-2 transition-all shadow-[0_8px_0_#CBD5E1] ${
            selectedGender === "male"
              ? "border-sky-400 ring-4 ring-sky-200/70 shadow-[0_8px_0_#38BDF8]"
              : "border-slate-100 hover:border-slate-200"
          }`}
        >
          <div className="aspect-square w-full rounded-2xl bg-sky-50/60 flex items-center justify-center p-2 mb-3">
            <KawaiiBear size="lg" mood="smug" />
          </div>
          <span className="block font-black text-slate-800 text-base sm:text-lg">
            Male
          </span>
        </motion.div>

        {/* Female Polaroid Card (White Panda) */}
        <motion.div
          whileHover={{ y: -6, scale: 1.02 }}
          whileTap={{ y: 2, scale: 0.98 }}
          onClick={() => handlePick("female")}
          className={`cursor-pointer bg-white rounded-3xl p-4 sm:p-5 border-2 transition-all shadow-[0_8px_0_#CBD5E1] ${
            selectedGender === "female"
              ? "border-pink-400 ring-4 ring-pink-200/70 shadow-[0_8px_0_#F472B6]"
              : "border-slate-100 hover:border-slate-200"
          }`}
        >
          <div className="aspect-square w-full rounded-2xl bg-pink-50/60 flex items-center justify-center p-2 mb-3">
            <KawaiiPanda size="lg" mood="shy" />
          </div>
          <span className="block font-black text-slate-800 text-base sm:text-lg">
            Female
          </span>
        </motion.div>
      </div>
    </div>
  );
}
