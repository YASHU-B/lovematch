"use client";

import React, { useEffect, useState, use, Suspense } from "react";
import Link from "next/link";
import { FinalGameScoreResult } from "@/lib/scoring";
import { ResultCardPreview } from "@/components/ResultCardPreview";
import confetti from "canvas-confetti";
import { 
  Heart, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Loader2, 
  AlertCircle
} from "lucide-react";

function ResultsContent({
  params
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = use(params);
  const [result, setResult] = useState<FinalGameScoreResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadResults() {
      try {
        const res = await fetch(`/api/results/${roomId}`);
        const data = await res.json();
        if (!res.ok || data.error) {
          throw new Error(data.error || "Results not found or room expired");
        }
        setResult(data.results);

        // Celebratory confetti on load
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.5 },
          colors: ["#EC4899", "#F472B6", "#C4B5FD", "#FFF8FC"]
        });
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load results");
      } finally {
        setLoading(false);
      }
    }

    loadResults();
  }, [roomId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
        <span className="text-sm text-pink-200">Calculating your Love Sync Score...</span>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="glass-panel rounded-3xl p-8 border border-pink-500/30">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white mb-2">Results Not Available</h2>
          <p className="text-xs text-pink-200/80 mb-6">{error || "The requested room results could not be found."}</p>
          <Link
            href="/create"
            className="w-full inline-flex items-center justify-center py-3.5 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-sm"
          >
            Start a New Challenge
          </Link>
        </div>
      </div>
    );
  }

  const playerEntries = Object.values(result.playerScores);
  const p1 = playerEntries[0] || { nickname: "Player 1", correctPredictions: 0, totalPredictions: 0 };
  const p2 = playerEntries[1] || { nickname: "Player 2", correctPredictions: 0, totalPredictions: 0 };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Hero Score Showcase */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border-2 border-pink-500/40 shadow-2xl text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-300 text-xs font-bold mb-6">
          <span>{p1.nickname}</span>
          <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
          <span>{p2.nickname}</span>
        </div>

        {/* Circular Sync Score */}
        <div className="relative mb-6">
          <div className="w-44 h-44 sm:w-52 sm:h-52 mx-auto rounded-full bg-pink-500/15 border-4 border-pink-500 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(236,72,153,0.45)]">
            <span className="text-5xl sm:text-6xl font-black tracking-tight text-white">
              {result.loveSyncScore}%
            </span>
            <span className="text-[11px] sm:text-xs font-bold text-pink-300 tracking-wider uppercase mt-1">
              Love Sync Score
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-300 to-lavender-200 mb-2">
          {result.resultTitle}
        </h1>
        <p className="text-xs sm:text-sm text-pink-200/80 max-w-md mx-auto mb-6 leading-relaxed">
          {result.resultDescription}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 glass-card rounded-2xl p-4 border border-pink-500/30 text-center">
          <div>
            <div className="text-lg sm:text-2xl font-black text-white">{result.totalPoints}</div>
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-pink-300">Total Points</div>
          </div>
          <div className="border-x border-pink-500/20">
            <div className="text-lg sm:text-2xl font-black text-pink-400">{result.totalMatches} / {result.totalScoredRounds}</div>
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-pink-300">Matches</div>
          </div>
          <div>
            <div className="text-lg sm:text-2xl font-black text-white">{result.loveSyncScore}%</div>
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-pink-300">Accuracy</div>
          </div>
        </div>
      </div>

      {/* Downloadable Story & Card Generator */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-pink-500/30 shadow-2xl mb-8">
        <div className="text-center mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-pink-400 block mb-1">
            Social Share Cards
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Download & Share Your Scorecard
          </h2>
          <p className="text-xs text-pink-200/80 mt-1">
            Save portrait images for Instagram Stories & WhatsApp Status, or landscape for messages!
          </p>
        </div>

        <ResultCardPreview
          result={result}
          player1Nickname={p1.nickname}
          player2Nickname={p2.nickname}
        />
      </div>

      {/* Round-by-Round Breakdown */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-pink-500/30 shadow-2xl mb-8">
        <h2 className="text-lg sm:text-xl font-extrabold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-pink-400" />
          <span>Round-by-Round Breakdown</span>
        </h2>

        <div className="space-y-4">
          {result.rounds.map((r) => (
            <div
              key={r.roundNumber}
              className={`rounded-2xl p-4 border text-left ${
                r.isMatch
                  ? "glass-card border-emerald-500/40 bg-emerald-500/5"
                  : "glass-card border-rose-500/30 bg-rose-500/5"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-pink-300">Round {r.roundNumber}</span>
                <span className={`flex items-center gap-1 ${r.isMatch ? "text-emerald-400" : "text-rose-400"}`}>
                  {r.isMatch ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {r.isMatch ? "Match (+10)" : "Plot Twist (0)"}
                </span>
              </div>

              <p className="text-sm font-bold text-white mb-3">
                {r.questionPrompt}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/20">
                  <span className="text-[10px] text-pink-300 block mb-0.5 font-semibold">
                    {r.subjectNickname} (Honest Answer)
                  </span>
                  <span className="font-extrabold text-white">{r.subjectAnswer}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <span className="text-[10px] text-purple-300 block mb-0.5 font-semibold">
                    {r.guesserNickname} (Prediction)
                  </span>
                  <span className="font-extrabold text-white">{r.guesserPrediction}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Play Again & Challenge Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link
          href="/create"
          className="w-full sm:flex-1 min-touch-target flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-pink-500/35 transition-transform active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Play Another Round</span>
        </Link>

        <Link
          href="/play"
          className="w-full sm:flex-1 min-touch-target flex items-center justify-center gap-2 py-4 rounded-2xl glass-card text-pink-200 hover:text-white hover:border-pink-500/60 font-bold text-sm sm:text-base transition-all"
        >
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span>Explore Other Categories</span>
        </Link>
      </div>
    </div>
  );
}

export default function ResultsPage(props: {
  params: Promise<{ roomId: string }>;
}) {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
        <span className="text-sm text-pink-200">Calculating your Love Sync Score...</span>
      </div>
    }>
      <ResultsContent {...props} />
    </Suspense>
  );
}
