"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Sparkles, Heart } from "lucide-react";

interface CardRevealAnimationProps {
  isMatch: boolean;
  subjectNickname: string;
  guesserNickname: string;
  subjectAnswer: string;
  guesserPrediction: string;
  isSubject: boolean;
  isGuesser: boolean;
}

export function CardRevealAnimation({
  isMatch,
  subjectNickname,
  guesserNickname,
  subjectAnswer,
  guesserPrediction,
  isSubject,
  isGuesser
}: CardRevealAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="space-y-4 my-2"
    >
      {/* Match / Mismatch Header Banner with energetic spring */}
      <motion.div
        initial={{ y: -20, scale: 0.85 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 450, damping: 20 }}
        className={`p-4 rounded-3xl border text-center shadow-xl relative overflow-hidden ${
          isMatch
            ? "bg-gradient-to-r from-emerald-500/25 via-pink-500/20 to-purple-500/25 border-emerald-400/60 shadow-emerald-500/20 text-emerald-200"
            : "bg-gradient-to-r from-rose-500/25 via-purple-500/20 to-pink-500/25 border-rose-400/60 shadow-rose-500/20 text-rose-200"
        }`}
      >
        {/* Floating animated sparkles */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute -top-6 -right-6 w-20 h-20 bg-pink-500/20 rounded-full blur-xl pointer-events-none"
        />

        <div className="flex items-center justify-center gap-2 text-xl font-black mb-1">
          {isMatch ? (
            <>
              <motion.div
                initial={{ rotate: -30, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                <CheckCircle2 className="w-7 h-7 text-emerald-400 fill-emerald-400/20" />
              </motion.div>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-white">
                It&apos;s a Match! (+10 pts)
              </span>
            </>
          ) : (
            <>
              <motion.div
                initial={{ rotate: 30, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                <XCircle className="w-7 h-7 text-rose-400 fill-rose-400/20" />
              </motion.div>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-pink-200 to-white">
                Plot Twist! (0 pts)
              </span>
            </>
          )}
        </div>

        <p className="text-xs text-pink-200/90 font-medium">
          {isMatch
            ? "Pure telepathy! You both were in complete harmony."
            : "Surprise moments make the best relationship stories!"}
        </p>
      </motion.div>

      {/* Side-by-Side 3D Card Flip Cards */}
      <div className="grid grid-cols-2 gap-3 text-left">
        {/* Subject Card */}
        <motion.div
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
          className="glass-panel rounded-2xl p-3.5 border-2 border-pink-500/40 bg-pink-500/10 shadow-lg relative overflow-hidden"
        >
          <div className="flex items-center gap-1.5 mb-1 text-[11px] font-bold text-pink-300">
            <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
            <span>{isSubject ? "Your Honest Answer" : `${subjectNickname}'s Answer`}</span>
          </div>
          <div className="text-sm sm:text-base font-black text-white leading-snug">
            {subjectAnswer}
          </div>
        </motion.div>

        {/* Guesser Card */}
        <motion.div
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ delay: 0.35, type: "spring", stiffness: 300, damping: 20 }}
          className="glass-panel rounded-2xl p-3.5 border-2 border-purple-500/40 bg-purple-500/10 shadow-lg relative overflow-hidden"
        >
          <div className="flex items-center gap-1.5 mb-1 text-[11px] font-bold text-purple-300">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>{isGuesser ? "Your Prediction" : `${guesserNickname}'s Prediction`}</span>
          </div>
          <div className="text-sm sm:text-base font-black text-white leading-snug">
            {guesserPrediction}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
