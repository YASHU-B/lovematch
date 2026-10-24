"use client";

import React, { useState, useEffect, use, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  ArrowLeft,
  Trophy,
  ExternalLink,
  Users
} from "lucide-react";
import { soundEffects } from "@/components/AudioEffects";
import { NotebookQuestionCard } from "@/components/NotebookQuestionCard";
import { KawaiiBear, KawaiiPanda, WavyUnderline } from "@/components/KawaiiCharacters";

interface QuizQuestion {
  id: string;
  text: string;
  emoji: string;
  options: string[];
}

interface QuizData {
  id: string;
  creatorName: string;
  questions: QuizQuestion[];
}

interface LeaderboardAttempt {
  id: string;
  friendName: string;
  score: number;
  total: number;
  percentage: number;
  verdict: "safe" | "warning" | "blocked";
  createdAt: string;
}

interface LeaderboardData {
  attempts: LeaderboardAttempt[];
  totalPlayers: number;
  safeCount: number;
  blockedCount: number;
}

function QuizTakingContent({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardData | null>(null);

  // Friend state
  const [friendName, setFriendName] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadQuizAndScores() {
      try {
        const [quizRes, scoresRes] = await Promise.all([
          fetch(`/api/quiz/${id}`),
          fetch(`/api/quiz/${id}/scores`)
        ]);

        const quizData = await quizRes.json();
        if (!quizRes.ok || quizData.error) {
          throw new Error(quizData.error || "Quiz not found or expired");
        }
        setQuiz(quizData.quiz);

        if (scoresRes.ok) {
          const scoresData = await scoresRes.json();
          if (scoresData.success) {
            setLeaderboard({
              attempts: scoresData.attempts || [],
              totalPlayers: scoresData.totalPlayers || 0,
              safeCount: scoresData.safeCount || 0,
              blockedCount: scoresData.blockedCount || 0
            });
          }
        }

        if (typeof window !== "undefined") {
          const saved = localStorage.getItem("lovematch_nickname");
          if (saved) setFriendName(saved);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    }
    loadQuizAndScores();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-16 h-16 rounded-3xl bg-white border-2 border-slate-900 shadow-[0_4px_0_#1E293B] flex items-center justify-center text-3xl animate-bounce">
          ☁️
        </div>
        <p className="text-sm font-black text-slate-800">Loading quiz...</p>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-16 text-center">
        <div className="bg-white border-3 border-slate-900 rounded-3xl p-8 shadow-[0_8px_0_#1E293B]">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-xl font-black text-slate-900 mb-2">Quiz Not Found</h2>
          <p className="text-xs font-bold text-slate-600 mb-6">
            {error || "This quiz link might have expired or does not exist."}
          </p>
          <button
            onClick={() => router.push("/")}
            className="w-full py-3.5 rounded-2xl bg-yellow-400 border-2 border-slate-900 text-slate-900 font-black text-sm shadow-[0_3px_0_#CA8A04]"
          >
            Create Your Own Quiz
          </button>
        </div>
      </div>
    );
  }

  const questions = quiz.questions;
  const currentQ = questions[currentIdx];
  const totalCount = questions.length;

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendName.trim()) return;
    soundEffects.playPop();
    if (typeof window !== "undefined") {
      localStorage.setItem("lovematch_nickname", friendName.trim());
    }
    setHasStarted(true);
  };

  const handleSelectAnswer = async (option: string) => {
    soundEffects.playPop();
    const updatedAnswers = { ...answers, [currentQ.id]: option };
    setAnswers(updatedAnswers);

    if (currentIdx < totalCount - 1) {
      setTimeout(() => {
        setCurrentIdx(prev => prev + 1);
      }, 180);
    } else {
      // Last question answered - submit directly!
      await submitAttempt(updatedAnswers);
    }
  };

  const submitAttempt = async (finalAnswers: Record<string, string>) => {
    setIsSubmitting(true);
    try {
      const formattedAnswers = Object.entries(finalAnswers).map(([qId, ans]) => ({
        questionId: qId,
        selectedAnswer: ans
      }));

      const res = await fetch(`/api/quiz/${quiz.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          friendName: friendName.trim(),
          answers: formattedAnswers
        })
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to submit answers");
      }

      router.push(`/quiz/${quiz.id}/result/${data.attempt.id}`);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Submission failed");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6">
      {!hasStarted ? (
        /* Welcome / Name Screen + Live Leaderboard */
        <div className="space-y-6">
          <div className="bg-white border-3 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-[0_8px_0_#1E293B] text-center">
            {/* Mascot Welcome Duo */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <KawaiiBear size="md" mood="cute" />
              <KawaiiPanda size="md" mood="happy" />
            </div>

            <span className="text-xs font-black uppercase tracking-wider text-pink-600 block mb-1">
              Friendship Test
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
              How Well Do You Know{" "}
              <span className="text-pink-600 relative inline-block">
                {quiz.creatorName}
                <WavyUnderline color="pink" className="absolute -bottom-1 left-0 w-full h-2" />
              </span>
              ?
            </h1>
            <p className="text-xs sm:text-sm font-bold text-slate-600 mb-6">
              Answer {totalCount} questions. Get a high score to prove you&apos;re a real bestie... or get <span className="text-rose-600 font-black">BLOCKED! 🚫</span>
            </p>

            <form onSubmit={handleStart} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                  Your Nickname
                </label>
                <input
                  type="text"
                  required
                  maxLength={20}
                  value={friendName}
                  onChange={(e) => setFriendName(e.target.value)}
                  placeholder="e.g. Maya or Chris"
                  className="w-full px-4 py-3.5 rounded-2xl bg-sky-50 border-2 border-slate-900 font-bold text-base text-slate-900 focus:bg-white focus:outline-none shadow-inner"
                />
              </div>

              <button
                type="submit"
                disabled={!friendName.trim()}
                className="w-full py-4 rounded-2xl bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 border-2.5 border-slate-900 text-slate-900 font-black text-base shadow-[0_5px_0_#CA8A04] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
              >
                <span>Start Guessing! 🚀</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <p className="text-[11px] font-bold text-slate-400 mt-4">
              {quiz.creatorName} will see your score on the live scoreboard!
            </p>
          </div>

          {/* Live Leaderboard / Hall of Fame Card directly on the Join Screen */}
          <div className="bg-white border-3 border-slate-900 rounded-3xl p-6 sm:p-7 shadow-[0_8px_0_#1E293B]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-yellow-300 border-2 border-slate-900 flex items-center justify-center text-xl shadow-[0_2px_0_#1E293B]">
                  🏆
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 leading-tight">
                    Live Scoreboard
                  </h2>
                  <p className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-sky-600" />
                    <span>{leaderboard?.totalPlayers || 0} friends played</span>
                  </p>
                </div>
              </div>

              <Link
                href={`/quiz/${id}/scores`}
                className="text-xs font-black text-sky-600 hover:text-sky-700 flex items-center gap-1 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200 shadow-xs"
              >
                <span>Full Board</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            {/* Quick Stats: Safe vs Blocked */}
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-xs font-black text-emerald-700">
                  😇 {leaderboard?.safeCount || 0} Safe
                </span>
              </div>
              <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-center">
                <span className="text-xs font-black text-rose-700">
                  🚫 {leaderboard?.blockedCount || 0} Blocked
                </span>
              </div>
            </div>

            {/* Top Players List */}
            {leaderboard && leaderboard.attempts.length > 0 ? (
              <div className="space-y-2.5">
                {leaderboard.attempts.slice(0, 5).map((att, i) => {
                  const isTop1 = i === 0;
                  const isTop2 = i === 1;
                  const isTop3 = i === 2;
                  const isBlocked = att.verdict === "blocked";

                  return (
                    <div
                      key={att.id}
                      className={`p-3 rounded-2xl border-2 flex items-center justify-between gap-3 ${
                        isTop1
                          ? "bg-amber-50 border-amber-300 shadow-[0_2px_0_#F59E0B]"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-6 text-center font-black text-sm text-slate-700 shrink-0">
                          {isTop1 ? "🥇" : isTop2 ? "🥈" : isTop3 ? "🥉" : `#${i + 1}`}
                        </span>
                        <span className="font-extrabold text-slate-900 text-sm truncate">
                          {att.friendName}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-black text-slate-800">
                          {att.score}/{att.total}
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                            isBlocked
                              ? "bg-rose-100 text-rose-700 border-rose-300"
                              : "bg-emerald-100 text-emerald-800 border-emerald-300"
                          }`}
                        >
                          {isBlocked ? "Blocked 🚫" : "Safe 💖"}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {leaderboard.attempts.length > 5 && (
                  <p className="text-center text-xs font-bold text-slate-400 pt-1">
                    + {leaderboard.attempts.length - 5} more friends on the scoreboard
                  </p>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-center">
                <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                <p className="text-xs font-bold text-sky-800">
                  No one has played yet! Be the very first friend to take the quiz and rank #1 🥇
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Question Screen with NotebookQuestionCard */
        <div className="space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700">
              Question {currentIdx + 1} of {totalCount}
            </span>
            <span className="text-xs font-black px-3 py-1 rounded-full bg-pink-200 border border-slate-900 text-slate-900 shadow-xs">
              Guessing {quiz.creatorName}&apos;s Choice 👀
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-white/70 rounded-full border-2 border-slate-900 overflow-hidden shadow-xs">
            <div
              className="h-full bg-pink-400 transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / totalCount) * 100}%` }}
            />
          </div>

          {/* Torn Notebook Paper Card with 3D Options */}
          <NotebookQuestionCard
            questionNumber={currentIdx + 1}
            totalQuestions={totalCount}
            creatorName={quiz.creatorName}
            questionText={currentQ.text}
            emoji={currentQ.emoji}
            options={currentQ.options}
            selectedOption={answers[currentQ.id]}
            onSelectOption={handleSelectAnswer}
            isCreatorMode={false}
          />

          {/* Navigation Controls */}
          {currentIdx > 0 && !isSubmitting && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setCurrentIdx(prev => prev - 1)}
                className="px-3.5 py-2 rounded-2xl border-2 border-slate-900 bg-white text-xs font-bold text-slate-700 shadow-[0_2px_0_#1E293B] active:translate-y-0.5 active:shadow-none flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Question</span>
              </button>
            </div>
          )}

          {isSubmitting && (
            <div className="flex items-center justify-center gap-2 p-4 text-sm font-black text-slate-800 bg-white/80 rounded-2xl border-2 border-slate-900 shadow-sm">
              <Loader2 className="w-5 h-5 animate-spin text-pink-600" />
              <span>Calculating your verdict...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function QuizTakingPage({
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
      <QuizTakingContent params={params} />
    </Suspense>
  );
}
