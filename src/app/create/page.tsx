"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Share2, 
  Copy, 
  Check, 
  Loader2, 
  Trophy, 
  RotateCcw,
  CheckCircle2
} from "lucide-react";
import { DONT_BLOCK_ME_QUESTIONS, DontBlockMeQuestion } from "@/lib/questions/dontBlockMe";
import { soundEffects } from "@/components/AudioEffects";

function CreateQuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialName = searchParams.get("name") || "";

  const [creatorName, setCreatorName] = useState(() => {
    if (initialName) return initialName;
    if (typeof window !== "undefined") {
      return localStorage.getItem("lovematch_nickname") || "";
    }
    return "";
  });
  const [questions, setQuestions] = useState<DontBlockMeQuestion[]>(() => DONT_BLOCK_ME_QUESTIONS.slice(0, 10));
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIdx, setCurrentIdx] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdQuiz, setCreatedQuiz] = useState<{ quizId: string; secretToken: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const currentQ = questions[currentIdx];
  const totalCount = questions.length;
  const answeredCount = Object.keys(answers).length;

  const handleSelectOption = (option: string) => {
    soundEffects.playPop();
    const updated = { ...answers, [currentQ.id]: option };
    setAnswers(updated);

    // Auto-advance after small tactile delay if not last question
    if (currentIdx < totalCount - 1) {
      setTimeout(() => {
        setCurrentIdx(prev => prev + 1);
      }, 180);
    }
  };

  const handleShuffleCurrent = () => {
    soundEffects.playPop();
    const unused = DONT_BLOCK_ME_QUESTIONS.filter(q => !questions.some(existing => existing.id === q.id));
    if (unused.length > 0) {
      const randomQ = unused[Math.floor(Math.random() * unused.length)];
      const nextQuestions = [...questions];
      nextQuestions[currentIdx] = randomQ;
      setQuestions(nextQuestions);
      // Clean answer for old question
      const nextAnswers = { ...answers };
      delete nextAnswers[currentQ.id];
      setAnswers(nextAnswers);
    }
  };

  const handleFinishQuiz = async () => {
    if (!creatorName.trim()) {
      alert("Please enter your name");
      return;
    }
    if (answeredCount < totalCount) {
      alert("Please answer all questions to set your answer key!");
      return;
    }

    setIsSubmitting(true);
    soundEffects.playPop();

    try {
      const payload = {
        creatorName: creatorName.trim(),
        questions: questions.map(q => ({
          id: q.id,
          text: q.text,
          emoji: q.emoji,
          options: q.options,
          correctAnswer: answers[q.id]
        }))
      };

      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to create quiz");
      }

      setCreatedQuiz({
        quizId: data.quizId,
        secretToken: data.secretToken
      });

      if (typeof window !== "undefined") {
        localStorage.setItem(`quiz_secret_${data.quizId}`, data.secretToken);
        localStorage.setItem("lovematch_nickname", creatorName.trim());
      }

      soundEffects.playFanfare();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to create quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPublicQuizUrl = () => {
    if (!createdQuiz) return "";
    if (typeof window !== "undefined") {
      return `${window.location.origin}/quiz/${createdQuiz.quizId}`;
    }
    return `https://love2match.vercel.app/quiz/${createdQuiz.quizId}`;
  };

  const handleWhatsAppShare = () => {
    soundEffects.playPop();
    const url = getPublicQuizUrl();
    const text = encodeURIComponent(
      `Can you answer 10 questions about me without getting BLOCKED? 🚫💀\n\nTake my "Don't Block Me" test here:\n${url}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleCopyLink = async () => {
    soundEffects.playPop();
    const url = getPublicQuizUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-8">
      {!createdQuiz ? (
        <div className="bg-white border-3 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-[0_8px_0_#1E293B]">
          {/* Header & Name Input */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Question {currentIdx + 1} of {totalCount}
              </span>
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-yellow-300 border border-slate-900 text-slate-900">
                Answer Key Mode
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-slate-100 rounded-full border-2 border-slate-900 overflow-hidden mb-4">
              <div
                className="h-full bg-yellow-400 transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / totalCount) * 100}%` }}
              />
            </div>

            <div className="mb-4">
              <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                placeholder="Enter your nickname"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-900 font-bold text-sm text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Active Question Box */}
          <div className="p-5 rounded-2xl bg-sky-50 border-2 border-slate-900 mb-6 relative">
            <button
              onClick={handleShuffleCurrent}
              title="Shuffle question"
              className="absolute top-3 right-3 text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-900 shadow-[0_1.5px_0_#1E293B] active:translate-y-0.5 active:shadow-none"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Change</span>
            </button>

            <span className="text-4xl block mb-2">{currentQ.emoji}</span>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
              {currentQ.text}
            </h3>
            <p className="text-xs font-bold text-sky-700 mt-1">
              👉 Tap the option that is truly about YOU:
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQ.options.map((opt, i) => {
              const isSelected = answers[currentQ.id] === opt;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectOption(opt)}
                  className={`w-full p-4 rounded-2xl border-2 text-left font-bold text-sm sm:text-base flex items-center justify-between transition-all ${
                    isSelected
                      ? "bg-yellow-300 border-slate-900 shadow-[0_4px_0_#1E293B] translate-x-1"
                      : "bg-white border-slate-900 hover:bg-slate-50 shadow-[0_3px_0_#1E293B] active:translate-y-0.5 active:shadow-none"
                  }`}
                >
                  <span className="text-slate-900">{opt}</span>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-slate-900 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              className="px-4 py-2.5 rounded-xl border-2 border-slate-900 bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-slate-700 shadow-[0_2px_0_#1E293B] active:translate-y-0.5 active:shadow-none flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Prev</span>
            </button>

            {currentIdx < totalCount - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentIdx(prev => Math.min(totalCount - 1, prev + 1))}
                className="px-5 py-2.5 rounded-xl border-2 border-slate-900 bg-sky-200 text-xs font-black text-slate-900 shadow-[0_2px_0_#1E293B] active:translate-y-0.5 active:shadow-none flex items-center gap-1"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting || answeredCount < totalCount}
                onClick={handleFinishQuiz}
                className="px-6 py-3 rounded-xl border-2.5 border-slate-900 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-xs sm:text-sm font-black text-slate-900 shadow-[0_4px_0_#CA8A04] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate My Test Link!</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Created Share Screen */
        <div className="bg-white border-3 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-[0_8px_0_#1E293B] text-center">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-yellow-300 border-2.5 border-slate-900 flex items-center justify-center text-3xl mb-4 shadow-[0_4px_0_#1E293B]">
            🎉
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
            Your Test is Ready!
          </h2>
          <p className="text-xs sm:text-sm font-bold text-slate-600 mb-6">
            Share this link with your friends on WhatsApp, Snapchat, or Instagram Story. See who gets 10/10 and who gets blocked!
          </p>

          {/* Sharing Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={handleWhatsAppShare}
              className="w-full py-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] border-2.5 border-slate-900 text-white font-black text-base shadow-[0_5px_0_#15803d] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              <span>Share to WhatsApp Status & Chats</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="w-full py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 text-slate-800 font-bold text-xs sm:text-sm shadow-[0_3px_0_#1E293B] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? "Link Copied to Clipboard!" : "Copy Public Quiz Link"}</span>
            </button>
          </div>

          {/* View Scoreboard CTA */}
          <div className="pt-4 border-t border-slate-200">
            <button
              onClick={() => router.push(`/quiz/${createdQuiz.quizId}/scores`)}
              className="w-full py-3.5 rounded-2xl bg-sky-200 hover:bg-sky-300 border-2 border-slate-900 text-slate-900 font-black text-sm shadow-[0_3px_0_#1E293B] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2"
            >
              <Trophy className="w-4 h-4 text-yellow-600" />
              <span>Go to My Secret Scoreboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CreateQuizPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-slate-800 animate-spin" />
        </div>
      }
    >
      <CreateQuizContent />
    </Suspense>
  );
}
