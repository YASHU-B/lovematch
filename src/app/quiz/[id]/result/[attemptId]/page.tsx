"use client";

import React, { useState, useEffect, use, Suspense } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { 
  Sparkles, 
  Share2, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  AlertCircle, 
  Copy, 
  Check,
  Trophy
} from "lucide-react";
import { soundEffects } from "@/components/AudioEffects";
import { KawaiiBear, KawaiiPanda, WavyUnderline } from "@/components/KawaiiCharacters";

interface AttemptData {
  id: string;
  quizId: string;
  friendName: string;
  score: number;
  total: number;
  percentage: number;
  verdict: "safe" | "warning" | "blocked";
  answers: {
    questionId: string;
    questionText: string;
    selectedAnswer: string;
    correctAnswer: string;
    isMatch: boolean;
  }[];
}

function QuizResultContent({
  params
}: {
  params: Promise<{ id: string; attemptId: string }>;
}) {
  const { id, attemptId } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState<AttemptData | null>(null);
  const [creatorName, setCreatorName] = useState("Friend");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadAttempt() {
      try {
        const res = await fetch(`/api/quiz/${id}/attempt/${attemptId}`);
        const data = await res.json();
        if (!res.ok || data.error) {
          throw new Error(data.error || "Attempt not found");
        }
        setAttempt(data.attempt);
        if (data.creatorName) setCreatorName(data.creatorName);

        // Sound effects & confetti
        if (data.attempt.verdict === "safe") {
          soundEffects.playFanfare();
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch {
            // Ignore
          }
        } else if (data.attempt.verdict === "blocked") {
          soundEffects.playBuzzer();
        } else {
          soundEffects.playPop();
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load result");
      } finally {
        setLoading(false);
      }
    }
    loadAttempt();
  }, [id, attemptId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-slate-800 animate-spin" />
        <p className="text-sm font-black text-slate-800">Unveiling verdict...</p>
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-16 text-center">
        <div className="bg-white border-3 border-slate-900 rounded-3xl p-8 shadow-[0_8px_0_#1E293B]">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-xl font-black text-slate-900 mb-2">Result Not Found</h2>
          <button
            onClick={() => router.push("/")}
            className="w-full py-3.5 rounded-2xl bg-yellow-400 border-2 border-slate-900 text-slate-900 font-black text-sm shadow-[0_3px_0_#CA8A04]"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const isSafe = attempt.verdict === "safe";
  const isWarning = attempt.verdict === "warning";
  const isBlocked = attempt.verdict === "blocked";

  const handleShareResult = () => {
    soundEffects.playPop();
    const verdictText = isSafe
      ? `I scored ${attempt.score}/${attempt.total} on ${creatorName}'s quiz! I'm SAFE from being blocked! 💖🥳`
      : isWarning
      ? `I scored ${attempt.score}/${attempt.total} on ${creatorName}'s quiz! I'm on thin ice! ⚠️👀`
      : `I scored ${attempt.score}/${attempt.total} on ${creatorName}'s quiz and got BLOCKED! 🚫💀`;

    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const text = encodeURIComponent(`${verdictText}\n\nCan you beat my score?\n${shareUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleCopyLink = async () => {
    soundEffects.playPop();
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Ignore
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8">
      {/* Main Verdict Card */}
      <div className="bg-white border-3 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-[0_8px_0_#1E293B] text-center mb-6 relative overflow-hidden">
        {/* Animated Mascot Verdict */}
        <div className="flex justify-center mb-3">
          {isSafe ? (
            <div className="flex items-center gap-2">
              <KawaiiBear size="md" mood="happy" withDrink={true} />
              <KawaiiPanda size="md" mood="happy" />
            </div>
          ) : isWarning ? (
            <KawaiiBear size="md" mood="cute" withLaptop={true} />
          ) : (
            <KawaiiBear size="md" mood="smug" />
          )}
        </div>

        <span className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-1">
          {attempt.friendName}&apos;s Verdict on {creatorName}&apos;s Test
        </span>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
          {isSafe ? (
            <span className="text-emerald-600">
              YOU ARE SAFE! 💖
              <WavyUnderline color="green" className="mx-auto w-36 h-2 mt-1" />
            </span>
          ) : isWarning ? (
            <span className="text-amber-600">
              ON THIN ICE! ⚠️
              <WavyUnderline color="yellow" className="mx-auto w-36 h-2 mt-1" />
            </span>
          ) : (
            <span className="text-rose-600">
              YOU ARE BLOCKED! 🚫
              <WavyUnderline color="pink" className="mx-auto w-40 h-2 mt-1" />
            </span>
          )}
        </h1>

        <div className="inline-block px-4 py-1.5 rounded-full bg-slate-100 border-2 border-slate-900 font-mono font-black text-lg text-slate-900 mb-4 shadow-[0_2px_0_#1E293B]">
          Score: {attempt.score} / {attempt.total} ({attempt.percentage}%)
        </div>

        <p className="text-xs sm:text-sm font-bold text-slate-600 mb-6 max-w-xs mx-auto">
          {isSafe && "You truly know them! You are certified bestie material and safe from the block list."}
          {isWarning && "You barely survived! Start taking notes on their habits before you get kicked out of the circle."}
          {isBlocked && "Fake friend detected! You hardly know them at all. Say your final goodbyes!"}
        </p>

        {/* Share Result Action */}
        <div className="space-y-2.5 mb-6">
          <button
            onClick={handleShareResult}
            className="w-full py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] border-2.5 border-slate-900 text-white font-black text-sm shadow-[0_4px_0_#15803d] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Share My Verdict to WhatsApp</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="w-full py-2.5 rounded-xl bg-slate-100 border border-slate-900 text-xs font-bold text-slate-700 shadow-[0_1.5px_0_#1E293B] active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Link Copied!" : "Copy Result Link"}</span>
          </button>

          {/* View Full Leaderboard */}
          <button
            onClick={() => router.push(`/quiz/${id}/scores?attemptId=${attempt.id}`)}
            className="w-full py-3.5 rounded-2xl bg-sky-200 hover:bg-sky-300 border-2.5 border-slate-900 text-slate-900 font-black text-sm shadow-[0_4px_0_#1E293B] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <Trophy className="w-4 h-4 text-yellow-600" />
            <span>View Full Leaderboard & Rankings 🏆</span>
          </button>
        </div>

        {/* Viral CTA: Create Your Own Quiz */}
        <div className="pt-4 border-t border-slate-200">
          <button
            onClick={() => router.push("/create")}
            className="w-full py-4 rounded-2xl bg-yellow-400 hover:bg-yellow-300 border-2.5 border-slate-900 text-slate-900 font-black text-base shadow-[0_5px_0_#CA8A04] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>Now Create YOUR Test to Expose Friends!</span>
          </button>
        </div>
      </div>

      {/* Answer Breakdown */}
      <div className="bg-white border-3 border-slate-900 rounded-3xl p-6 shadow-[0_8px_0_#1E293B]">
        <h3 className="text-base font-black text-slate-900 mb-4">
          Detailed Answer Breakdown 📋
        </h3>

        <div className="space-y-3">
          {attempt.answers.map((item, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border-2 ${
                item.isMatch
                  ? "bg-emerald-50 border-emerald-400"
                  : "bg-rose-50 border-rose-300"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="font-bold text-xs text-slate-900">
                  {idx + 1}. {item.questionText}
                </span>
                {item.isMatch ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                )}
              </div>

              <div className="text-[11px] font-bold space-y-0.5">
                <p className="text-slate-600">
                  You guessed: <span className="font-black text-slate-900">{item.selectedAnswer}</span>
                </p>
                {!item.isMatch && (
                  <p className="text-rose-600">
                    {creatorName}&apos;s real answer: <span className="font-black">{item.correctAnswer}</span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function QuizResultPage({
  params
}: {
  params: Promise<{ id: string; attemptId: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-slate-800 animate-spin" />
        </div>
      }
    >
      <QuizResultContent params={params} />
    </Suspense>
  );
}
