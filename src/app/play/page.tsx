"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/questions/data";
import { Sparkles, ArrowRight, Zap, Check } from "lucide-react";
import { soundEffects } from "@/components/AudioEffects";

export default function PlayPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [questionCount, setQuestionCount] = useState<5 | 10>(5);

  const handleSelect = (id: string) => {
    soundEffects.playPop();
    setSelectedCategory(id);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border-2 border-slate-900 text-slate-800 text-xs font-black mb-3 shadow-[0_2px_0_#1E293B]">
          <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400" />
          <span>Live 2-Player Match</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Choose a Duel Category
        </h1>
        <p className="text-xs sm:text-sm font-bold text-slate-600 mt-2 max-w-lg mx-auto">
          Play simultaneously with your partner or friend in real time!
        </p>
      </div>

      {/* Question Count Selector */}
      <div className="max-w-md mx-auto mb-8 p-1.5 rounded-2xl bg-white border-2 border-slate-900 shadow-[0_4px_0_#1E293B] flex items-center justify-between">
        <button
          onClick={() => { soundEffects.playPop(); setQuestionCount(5); }}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 ${
            questionCount === 5
              ? "bg-yellow-400 text-slate-900 border border-slate-900 shadow-[0_2px_0_#CA8A04]"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>5 Questions (Quick)</span>
        </button>
        <button
          onClick={() => { soundEffects.playPop(); setQuestionCount(10); }}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 ${
            questionCount === 10
              ? "bg-yellow-400 text-slate-900 border border-slate-900 shadow-[0_2px_0_#CA8A04]"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>10 Questions (Deep)</span>
        </button>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {/* All Rounder Card */}
        <div
          onClick={() => handleSelect("all")}
          className={`cursor-pointer rounded-2xl p-5 border-2 transition-all ${
            selectedCategory === "all"
              ? "bg-yellow-300 border-slate-900 shadow-[0_5px_0_#1E293B] translate-x-1"
              : "bg-white border-slate-900 hover:bg-slate-50 shadow-[0_3px_0_#1E293B]"
          }`}
        >
          <div className="flex items-start justify-between">
            <span className="text-3xl mb-2 block">🌟</span>
            {selectedCategory === "all" && (
              <span className="p-1 rounded-full bg-slate-900 text-white">
                <Check className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
          <h2 className="text-base sm:text-lg font-black text-slate-900">
            All-Rounder Mix (Popular)
          </h2>
          <p className="text-xs font-bold text-slate-600 mt-1">
            A balanced mix of food, dreams, secrets, quirks, and romance questions!
          </p>
        </div>

        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <div
              key={cat.id}
              onClick={() => handleSelect(cat.id)}
              className={`cursor-pointer rounded-2xl p-5 border-2 transition-all ${
                isSelected
                  ? "bg-yellow-300 border-slate-900 shadow-[0_5px_0_#1E293B] translate-x-1"
                  : "bg-white border-slate-900 hover:bg-slate-50 shadow-[0_3px_0_#1E293B]"
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl mb-2 block">{cat.icon}</span>
                {isSelected && (
                  <span className="p-1 rounded-full bg-slate-900 text-white">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                {cat.name}
              </h2>
              <p className="text-xs font-bold text-slate-600 mt-1">
                {cat.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Start Live Match Button */}
      <div className="max-w-md mx-auto">
        <Link
          href={`/create?category=${selectedCategory}&count=${questionCount}`}
          className="w-full py-4 rounded-2xl bg-yellow-400 hover:bg-yellow-300 border-2.5 border-slate-900 text-slate-900 font-black text-base shadow-[0_5px_0_#CA8A04] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
        >
          <span>Continue to Create Room</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
