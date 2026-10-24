"use client";

import React, { useState, useEffect, use, Suspense } from "react";
import { 
  Trophy, 
  Share2, 
  Copy, 
  Check, 
  Loader2, 
  Users, 
  ShieldCheck, 
  Ban, 
  ChevronDown, 
  ChevronUp
} from "lucide-react";
import { soundEffects } from "@/components/AudioEffects";

interface Attempt {
  id: string;
  friendName: string;
  score: number;
  total: number;
  percentage: number;
  verdict: "safe" | "warning" | "blocked";
  createdAt: string;
  answers: {
    questionId: string;
    questionText: string;
    selectedAnswer: string;
    correctAnswer: string;
    isMatch: boolean;
  }[];
}

interface ScoreboardData {
  attempts: Attempt[];
  totalPlayers: number;
  safeCount: number;
  blockedCount: number;
}

function ScoreboardContent({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ScoreboardData | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function loadScores() {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem(`quiz_secret_${id}`) || "" : "";
        const res = await fetch(`/api/quiz/${id}/scores?token=${encodeURIComponent(token)}`);
        const result = await res.json();
        if (!res.ok || result.error) {
          throw new Error(result.error || "Failed to load scores");
        }
        setData(result);
      } catch (err: unknown) {
        console.error("Scoreboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadScores();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-slate-800 animate-spin" />
        <p className="text-sm font-black text-slate-800">Loading scoreboard...</p>
      </div>
    );
  }

  const attempts = data?.attempts || [];
  const publicUrl = typeof window !== "undefined" ? `${window.location.origin}/quiz/${id}` : `https://love2match.vercel.app/quiz/${id}`;

  const handleWhatsAppShare = () => {
    soundEffects.playPop();
    const text = encodeURIComponent(
      `Take my "Don't Block Me" quiz to see if you're a real friend or if you get BLOCKED 🚫💀:\n${publicUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleCopy = async () => {
    soundEffects.playPop();
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-8">
      {/* Header Card */}
      <div className="bg-white border-3 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-[0_8px_0_#1E293B] mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-yellow-300 border-2 border-slate-900 flex items-center justify-center text-xl shadow-[0_2px_0_#1E293B]">
              👑
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900">Your Scoreboard</h1>
              <p className="text-xs font-bold text-slate-500">Quiz #{id}</p>
            </div>
          </div>

          <button
            onClick={handleWhatsAppShare}
            className="p-2.5 rounded-xl bg-[#25D366] border-2 border-slate-900 text-white shadow-[0_2px_0_#15803d] active:translate-y-0.5 active:shadow-none"
            title="Share quiz to WhatsApp"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-sky-50 border-2 border-slate-900 text-center">
            <Users className="w-4 h-4 text-sky-600 mx-auto mb-1" />
            <div className="text-xl font-black text-slate-900">{data?.totalPlayers || 0}</div>
            <span className="text-[10px] font-black uppercase text-slate-500">Tested</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-slate-900 text-center">
            <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
            <div className="text-xl font-black text-emerald-700">{data?.safeCount || 0}</div>
            <span className="text-[10px] font-black uppercase text-emerald-600">Safe</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-slate-900 text-center">
            <Ban className="w-4 h-4 text-rose-500 mx-auto mb-1" />
            <div className="text-xl font-black text-rose-600">{data?.blockedCount || 0}</div>
            <span className="text-[10px] font-black uppercase text-rose-500">Blocked</span>
          </div>
        </div>

        {/* Link Copy Bar */}
        <div className="p-3 rounded-2xl bg-slate-50 border-2 border-slate-900 flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-600 truncate">
            {publicUrl}
          </span>
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-900 text-xs font-bold text-slate-800 shadow-[0_1.5px_0_#1E293B] shrink-0 flex items-center gap-1 active:translate-y-0.5 active:shadow-none"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? "Copied!" : "Copy"}</span>
          </button>
        </div>
      </div>

      {/* Friends Leaderboard List */}
      <div className="bg-white border-3 border-slate-900 rounded-3xl p-6 shadow-[0_8px_0_#1E293B]">
        <h2 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span>Friends Ranked by Score</span>
        </h2>

        {attempts.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm font-black text-slate-700 mb-2">No friends have taken your test yet!</p>
            <p className="text-xs font-bold text-slate-500 mb-5 max-w-xs mx-auto">
              Share your link on WhatsApp, Snapchat, or your Instagram story to get answers.
            </p>
            <button
              onClick={handleWhatsAppShare}
              className="px-6 py-3 rounded-2xl bg-[#25D366] border-2 border-slate-900 text-white font-black text-xs shadow-[0_3px_0_#15803d] active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2 mx-auto"
            >
              <Share2 className="w-4 h-4" />
              <span>Share to WhatsApp Now</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {attempts.map((att, index) => {
              const isExpanded = expandedId === att.id;
              const isSafe = att.verdict === "safe";
              const isWarning = att.verdict === "warning";

              return (
                <div
                  key={att.id}
                  className="rounded-2xl border-2 border-slate-900 bg-slate-50 overflow-hidden transition-all"
                >
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : att.id)}
                    className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-xs text-slate-400">
                        #{index + 1}
                      </span>
                      <div>
                        <div className="font-black text-sm text-slate-900">
                          {att.friendName}
                        </div>
                        <div className="text-[10px] font-bold text-slate-500">
                          {new Date(att.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-xs text-slate-700">
                        {att.score}/{att.total}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black border border-slate-900 ${
                          isSafe
                            ? "bg-emerald-300 text-slate-900"
                            : isWarning
                            ? "bg-yellow-300 text-slate-900"
                            : "bg-rose-400 text-white"
                        }`}
                      >
                        {isSafe ? "SAFE 💖" : isWarning ? "THIN ICE ⚠️" : "BLOCKED 🚫"}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Breakdown */}
                  {isExpanded && (
                    <div className="p-3 bg-white border-t-2 border-slate-900 space-y-2">
                      {att.answers.map((ans, i) => (
                        <div key={i} className="text-[11px] font-bold p-2 rounded-xl bg-slate-50 border border-slate-200">
                          <p className="text-slate-800 mb-0.5">{i + 1}. {ans.questionText}</p>
                          <p className="text-slate-500">
                            Guessed: <span className={ans.isMatch ? "text-emerald-700 font-black" : "text-rose-600 font-black"}>
                              {ans.selectedAnswer} {ans.isMatch ? "✅" : "❌"}
                            </span>
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ScoreboardPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-slate-800 animate-spin" />
        </div>
      }
    >
      <ScoreboardContent params={params} />
    </Suspense>
  );
}
