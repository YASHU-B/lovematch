"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/questions/data";
import { Heart, Sparkles, ArrowRight, Check, Zap } from "lucide-react";

export default function PlayPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [questionCount, setQuestionCount] = useState<5 | 10>(5);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-card border border-pink-500/30 text-pink-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>Pick Your Vibe</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Choose a Quiz Category
        </h1>
        <p className="text-xs sm:text-sm text-pink-200/80 mt-2 max-w-lg mx-auto">
          Select what you want to explore with your partner or friend, or play an All-Rounder mix!
        </p>
      </div>

      {/* Question Count Selector */}
      <div className="max-w-md mx-auto mb-8 p-1.5 rounded-2xl glass-card flex items-center justify-between">
        <button
          onClick={() => setQuestionCount(5)}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all min-touch-target flex items-center justify-center gap-1.5 ${
            questionCount === 5
              ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/30"
              : "text-pink-300 hover:text-white"
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>5 Questions (Quick)</span>
        </button>
        <button
          onClick={() => setQuestionCount(10)}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all min-touch-target flex items-center justify-center gap-1.5 ${
            questionCount === 10
              ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/30"
              : "text-pink-300 hover:text-white"
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
          onClick={() => setSelectedCategory("all")}
          className={`cursor-pointer rounded-2xl p-5 border transition-all ${
            selectedCategory === "all"
              ? "glass-card-selected"
              : "glass-card glass-card-interactive"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400">
              <Sparkles className="w-5 h-5" />
            </div>
            {selectedCategory === "all" && (
              <span className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center text-white">
                <Check className="w-4 h-4" />
              </span>
            )}
          </div>
          <h3 className="text-base font-bold text-white mb-1">All-Rounder Mix</h3>
          <p className="text-xs text-pink-200/75">
            A randomized blend across all categories: food, memories, daily quirks, and deep love questions.
          </p>
        </div>

        {/* 10 Curated Category Cards */}
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`cursor-pointer rounded-2xl p-5 border transition-all ${
                isSelected ? "glass-card-selected" : "glass-card glass-card-interactive"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400">
                  <Heart className="w-5 h-5 fill-pink-400/20" />
                </div>
                <div className="flex items-center gap-2">
                  {cat.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-bold uppercase tracking-wider">
                      {cat.badge}
                    </span>
                  )}
                  {isSelected && (
                    <span className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center text-white">
                      <Check className="w-4 h-4" />
                    </span>
                  )}
                </div>
              </div>
              <h3 className="text-base font-bold text-white mb-1">{cat.name}</h3>
              <p className="text-xs text-pink-200/75">{cat.description}</p>
            </div>
          );
        })}
      </div>

      {/* Bottom Sticky Action Area */}
      <div className="sticky bottom-4 z-40 max-w-md mx-auto w-full">
        <Link
          href={`/create?category=${selectedCategory}&count=${questionCount}`}
          className="w-full min-touch-target flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-700 text-white font-extrabold text-base shadow-xl shadow-pink-500/40 transition-transform active:scale-95"
        >
          <span>Continue with Selected Quiz</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
