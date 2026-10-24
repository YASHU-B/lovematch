"use client";

import React, { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, Share2, Sparkles, Heart, Check } from "lucide-react";
import { FinalGameScoreResult } from "@/lib/scoring";

interface ResultCardPreviewProps {
  result: FinalGameScoreResult;
  player1Nickname: string;
  player2Nickname: string;
}

export function ResultCardPreview({
  result,
  player1Nickname,
  player2Nickname
}: ResultCardPreviewProps) {
  const portraitRef = useRef<HTMLDivElement>(null);
  const landscapeRef = useRef<HTMLDivElement>(null);

  const [activeFormat, setActiveFormat] = useState<"portrait" | "landscape">("portrait");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownload = async (format: "portrait" | "landscape") => {
    const targetRef = format === "portrait" ? portraitRef.current : landscapeRef.current;
    if (!targetRef) return;

    try {
      setIsGenerating(true);
      // Generate clean high-res PNG image
      const dataUrl = await toPng(targetRef, {
        cacheBust: true,
        quality: 0.98,
        pixelRatio: 2
      });

      const link = document.createElement("a");
      link.download = `LoveMatch_${player1Nickname}_and_${player2Nickname}_${format}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to render result image:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShareNative = async () => {
    const shareText = `We scored ${result.loveSyncScore}% on LoveMatch! "${result.resultTitle}" 💕 How well do you know your person?`;
    const shareUrl = typeof window !== "undefined" ? window.location.href : "https://lovematch.app";

    if (navigator.share) {
      try {
        await navigator.share({
          title: "LoveMatch — Who Knows Who Better?",
          text: shareText,
          url: shareUrl
        });
      } catch {
        // User cancelled or not supported
      }
    } else {
      // Fallback copy to clipboard
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      {/* Format Switcher */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl glass-card">
        <button
          onClick={() => setActiveFormat("portrait")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all min-touch-target ${
            activeFormat === "portrait"
              ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/30"
              : "text-pink-300 hover:text-white"
          }`}
        >
          📱 Story (1080×1920)
        </button>
        <button
          onClick={() => setActiveFormat("landscape")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all min-touch-target ${
            activeFormat === "landscape"
              ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/30"
              : "text-pink-300 hover:text-white"
          }`}
        >
          🖼️ Landscape (1200×630)
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-md">
        <button
          onClick={() => handleDownload(activeFormat)}
          disabled={isGenerating}
          className="flex-1 min-touch-target flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-sm shadow-lg shadow-pink-500/30 transition-transform active:scale-95 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{isGenerating ? "Generating Card..." : `Save ${activeFormat === "portrait" ? "Story Card" : "Card"}`}</span>
        </button>

        <button
          onClick={handleShareNative}
          className="min-touch-target flex items-center justify-center gap-2 px-5 py-3 rounded-2xl glass-card text-pink-200 hover:text-white hover:border-pink-500/50 font-semibold text-sm transition-all"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Copied Link!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-pink-400" />
              <span>Share Score</span>
            </>
          )}
        </button>
      </div>

      {/* Hidden high-res capture templates & responsive preview */}
      <div className="w-full flex justify-center overflow-x-auto p-2">
        {activeFormat === "portrait" ? (
          /* Portrait Preview Container (scaled nicely for mobile screen) */
          <div className="relative w-full max-w-[340px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl border-2 border-pink-500/40">
            <div
              ref={portraitRef}
              className="w-[540px] h-[960px] origin-top-left scale-[0.63] select-none p-10 flex flex-col justify-between"
              style={{
                background: "linear-gradient(160deg, #25112F 0%, #351B4F 40%, #190a20 100%)",
                color: "#FFF8FC"
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-pink-500/30 pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/50">
                    <Heart className="w-7 h-7 text-white fill-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-white">
                      Love<span className="text-pink-400">Match</span>
                    </h2>
                    <p className="text-xs text-pink-300 tracking-wider uppercase">Who Knows Who Better?</p>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-bold uppercase tracking-wider">
                  Sync Result
                </div>
              </div>

              {/* Central Score Area */}
              <div className="flex flex-col items-center text-center my-auto py-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-200 text-sm font-semibold mb-6">
                  <span>{player1Nickname}</span>
                  <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
                  <span>{player2Nickname}</span>
                </div>

                <div className="relative mb-6">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-pink-500/30 to-purple-500/30 border-4 border-pink-500 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(236,72,153,0.5)]">
                    <span className="text-6xl font-black tracking-tight text-white">
                      {result.loveSyncScore}%
                    </span>
                    <span className="text-xs font-bold text-pink-300 tracking-wider uppercase mt-1">
                      Love Sync Score
                    </span>
                  </div>
                </div>

                <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-300 to-lavender-200 mb-2">
                  {result.resultTitle}
                </h3>
                <p className="text-sm text-pink-200/80 max-w-sm px-4">
                  {result.resultDescription}
                </p>
              </div>

              {/* Stats Footer */}
              <div className="glass-card rounded-2xl p-5 border border-pink-500/30 flex items-center justify-around text-center mb-6">
                <div>
                  <div className="text-2xl font-bold text-white">{result.totalMatches} / {result.totalScoredRounds}</div>
                  <div className="text-[11px] text-pink-300 uppercase tracking-wider">Matches</div>
                </div>
                <div className="w-px h-8 bg-pink-500/20" />
                <div>
                  <div className="text-2xl font-bold text-pink-400">{result.totalPoints}</div>
                  <div className="text-[11px] text-pink-300 uppercase tracking-wider">Total Points</div>
                </div>
              </div>

              {/* Invitation URL footer */}
              <div className="border-t border-pink-500/20 pt-4 flex items-center justify-between text-xs text-pink-300/70">
                <span className="flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                  Play free at lovematch.app
                </span>
                <span>Tag #LoveMatchQuiz</span>
              </div>
            </div>
          </div>
        ) : (
          /* Landscape Preview Container */
          <div className="relative w-full max-w-[480px] aspect-[1200/630] rounded-3xl overflow-hidden shadow-2xl border-2 border-pink-500/40">
            <div
              ref={landscapeRef}
              className="w-[800px] h-[420px] origin-top-left scale-[0.6] select-none p-8 flex flex-col justify-between"
              style={{
                background: "linear-gradient(135deg, #25112F 0%, #351B4F 50%, #190a20 100%)",
                color: "#FFF8FC"
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-500 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white fill-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white">LoveMatch</h2>
                    <p className="text-[10px] text-pink-300 tracking-wider uppercase">Who Knows Who Better?</p>
                  </div>
                </div>
                <div className="text-sm font-bold text-pink-200">
                  {player1Nickname} & {player2Nickname}
                </div>
              </div>

              <div className="flex items-center justify-around py-4">
                <div className="text-center">
                  <div className="text-7xl font-black text-pink-400 leading-none">
                    {result.loveSyncScore}%
                  </div>
                  <div className="text-xs uppercase tracking-wider text-pink-200 font-bold mt-1">
                    Love Sync Score
                  </div>
                </div>

                <div className="max-w-xs text-left">
                  <h3 className="text-2xl font-black text-white mb-1">{result.resultTitle}</h3>
                  <p className="text-xs text-pink-200/80 mb-4">{result.resultDescription}</p>
                  <div className="flex gap-4 text-xs font-semibold text-pink-300">
                    <div>Matches: <span className="text-white font-bold">{result.totalMatches} / {result.totalScoredRounds}</span></div>
                    <div>Score: <span className="text-white font-bold">{result.totalPoints} pts</span></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-pink-500/20 pt-3 text-[11px] text-pink-300/70">
                <span>Play the real multiplayer couple quiz at lovematch.app</span>
                <span>#LoveMatch</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
