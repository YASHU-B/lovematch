"use client";

import React, { useState, useEffect, use, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
  ChevronUp,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { soundEffects } from "@/components/AudioEffects";
import { KawaiiBear, KawaiiPanda } from "@/components/KawaiiCharacters";
import { AdBanner } from "@/components/AdBanner";

interface Attempt {
  id: string;
  friendName: string;
  score: number;
  total: number;
  percentage: number;
  verdict: "safe" | "warning" | "blocked";
  createdAt: string;
  answers?: {
    questionId: string;
    questionText: string;
    selectedAnswer: string;
    correctAnswer: string;
    isMatch: boolean;
  }[];
}

interface ScoreboardData {
  quizId: string;
  creatorName: string;
  isCreator: boolean;
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const highlightAttemptId = searchParams.get("attemptId") || "";

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
        <p className="text-sm font-black text-slate-800">Loading leaderboard...</p>
      </div>
    );
  }

  const attempts = data?.attempts || [];
  const creatorName = data?.creatorName || "Friend";
  const isCreator = Boolean(data?.isCreator);
  const publicUrl = typeof window !== "undefined" ? `${window.location.origin}/quiz/${id}` : `https://dontblockme2.vercel.app/quiz/${id}`;

  const handleWhatsAppShare = () => {
    soundEffects.playPop();
    const text = encodeURIComponent(
      `*How well do you know ${creatorName}?* 🙈\n\nCan you score 10/10 without getting BLOCKED? 🚫\nCheck out the live scoreboard and take the test here 👇\n${publicUrl}`
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
          <div className="flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-yellow-300 border-2 border-slate-900 flex items-center justify-center text-2xl shadow-[0_3px_0_#1E293B]">
              {isCreator ? "👑" : "🏆"}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl font-black text-slate-900">
                  {isCreator ? "Your Scoreboard" : `${creatorName}'s Leaderboard`}
                </h1>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-yellow-200 border border-slate-900 text-slate-900">
                  {isCreator ? "Creator" : "Public"}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-500">
                {isCreator ? "You can see answer breakdowns below" : "See where everyone ranked!"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center -space-x-2">
              <KawaiiBear size="sm" mood="happy" className="w-10 h-10" />
              <KawaiiPanda size="sm" mood="shy" className="w-10 h-10" />
            </div>

            <button
              onClick={handleWhatsAppShare}
              className="p-2.5 rounded-xl bg-[#25D366] border-2 border-slate-900 text-white shadow-[0_2px_0_#15803d] active:translate-y-0.5 active:shadow-none"
              title="Share quiz to WhatsApp"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-sky-50 border-2 border-slate-900 text-center">
            <Users className="w-4 h-4 text-sky-600 mx-auto mb-1" />
            <div className="text-xl font-black text-slate-900">{data?.totalPlayers || 0}</div>
            <span className="text-[10px] font-black uppercase text-slate-500">Players</span>
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

      {/* Ad Placement: Above Leaderboard Ranking */}
      <AdBanner slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SCORES} />

      {/* Friends Leaderboard List */}
      <div className="bg-white border-3 border-slate-900 rounded-3xl p-6 shadow-[0_8px_0_#1E293B] mb-6">
        <h2 className="text-base font-black text-slate-900 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span>Leaderboard Rankings</span>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {attempts.length} {attempts.length === 1 ? "entry" : "entries"}
          </span>
        </h2>

        {attempts.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm font-black text-slate-700 mb-2">No friends have taken this test yet!</p>
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
              const isMyAttempt = highlightAttemptId === att.id;

              return (
                <div
                  key={att.id}
                  className={`rounded-2xl border-2 transition-all overflow-hidden ${
                    isMyAttempt
                      ? "border-yellow-500 bg-yellow-50 shadow-[0_4px_0_#CA8A04] ring-2 ring-yellow-400"
                      : "border-slate-900 bg-slate-50"
                  }`}
                >
                  <div
                    onClick={() => {
                      if (isCreator && att.answers && att.answers.length > 0) {
                        setExpandedId(isExpanded ? null : att.id);
                      }
                    }}
                    className={`p-3.5 flex items-center justify-between ${
                      isCreator ? "cursor-pointer hover:bg-slate-100" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-xl bg-white border border-slate-900 flex items-center justify-center font-mono font-black text-xs text-slate-800 shadow-[0_1.5px_0_#1E293B]">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-sm text-slate-900">
                            {att.friendName}
                          </span>
                          {isMyAttempt && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.2 rounded-full bg-yellow-400 text-slate-900 border border-slate-900">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] font-bold text-slate-500">
                          {new Date(att.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })} at {new Date(att.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-xs text-slate-800 bg-white px-2 py-1 rounded-lg border border-slate-900">
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
                      {isCreator && att.answers && att.answers.length > 0 && (
                        isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )
                      )}
                    </div>
                  </div>

                  {/* Expanded Breakdown for Creator */}
                  {isExpanded && att.answers && (
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

      {/* Public CTA for friends to make their own quiz */}
      {!isCreator && (
        <div className="bg-white border-3 border-slate-900 rounded-3xl p-6 shadow-[0_8px_0_#1E293B] text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-yellow-300 border-2 border-slate-900 flex items-center justify-center text-xl mb-3 shadow-[0_2px_0_#1E293B]">
            ⚡
          </div>
          <h3 className="text-lg font-black text-slate-900 mb-1">
            Now Test YOUR Friends!
          </h3>
          <p className="text-xs font-bold text-slate-600 mb-4">
            Create your own 10-question test in 60 seconds and see who your real friends are!
          </p>
          <button
            onClick={() => router.push("/create")}
            className="w-full py-3.5 rounded-2xl bg-yellow-400 hover:bg-yellow-300 border-2.5 border-slate-900 text-slate-900 font-black text-sm shadow-[0_4px_0_#CA8A04] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create My Own Quiz</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
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
