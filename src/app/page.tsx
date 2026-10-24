"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight } from "lucide-react";
import { PlayfulMascot } from "@/components/PlayfulMascot";
import { soundEffects } from "@/components/AudioEffects";
import { AdBanner } from "@/components/AdBanner";

export default function LandingPage() {
  const router = useRouter();
  const [creatorName, setCreatorName] = useState("");

  const handleStartQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatorName.trim()) return;
    soundEffects.playPop();
    if (typeof window !== "undefined") {
      localStorage.setItem("lovematch_nickname", creatorName.trim());
    }
    router.push(`/create?name=${encodeURIComponent(creatorName.trim())}`);
  };

  const steps = [
    {
      step: "01",
      emoji: "✍️",
      title: "Set Your Answer Key",
      desc: "Answer 10 hilarious & personal questions about your habits, food, and secrets."
    },
    {
      step: "02",
      emoji: "📲",
      title: "Share with Friends",
      desc: "Send your unique link on WhatsApp, Snapchat, Instagram Story, or group chats."
    },
    {
      step: "03",
      emoji: "👑",
      title: "Expose Fake Friends",
      desc: "Check your private scoreboard to see who knows you best and who gets BLOCKED!"
    }
  ];

  const sampleResults = [
    { name: "Chloe (Bestie)", score: "10/10", verdict: "SAFE! 💖", safe: true },
    { name: "Sam (Roommate)", score: "8/10", verdict: "SAFE! 🎉", safe: true },
    { name: "Leo (Acquaintance)", score: "5/10", verdict: "ON THIN ICE ⚠️", warning: true },
    { name: "Jake (Ex)", score: "1/10", verdict: "BLOCKED! 🚫", blocked: true }
  ];

  return (
    <div className="flex flex-col items-center w-full min-h-screen relative overflow-hidden pb-16">
      {/* Floating Animated Badges / Stickers (block.youtest.me style) */}
      <div className="hidden lg:block absolute top-28 left-8 animate-float-sticker pointer-events-none select-none z-10" style={{ "--rot": "-6deg" } as React.CSSProperties}>
        <div className="px-3.5 py-1.5 rounded-2xl bg-yellow-300 border-2 border-slate-900 text-slate-900 text-xs font-black shadow-[0_3px_0_#1E293B]">
          🙈 Don&apos;t Block Me 2!
        </div>
      </div>
      <div className="hidden lg:block absolute top-40 right-10 animate-float-sticker pointer-events-none select-none z-10" style={{ "--rot": "6deg", animationDelay: "1.2s" } as React.CSSProperties}>
        <div className="px-3.5 py-1.5 rounded-2xl bg-pink-400 border-2 border-slate-900 text-white text-xs font-black shadow-[0_3px_0_#1E293B]">
          🔮 Who Can You Trust?
        </div>
      </div>
      <div className="hidden lg:block absolute top-96 left-12 animate-float-sticker pointer-events-none select-none z-10" style={{ "--rot": "-4deg", animationDelay: "2.4s" } as React.CSSProperties}>
        <div className="px-3.5 py-1.5 rounded-2xl bg-emerald-400 border-2 border-slate-900 text-slate-900 text-xs font-black shadow-[0_3px_0_#1E293B]">
          👑 10/10 True Bestie
        </div>
      </div>
      <div className="hidden lg:block absolute top-96 right-12 animate-float-sticker pointer-events-none select-none z-10" style={{ "--rot": "5deg", animationDelay: "3.2s" } as React.CSSProperties}>
        <div className="px-3.5 py-1.5 rounded-2xl bg-rose-400 border-2 border-slate-900 text-white text-xs font-black shadow-[0_3px_0_#1E293B]">
          🚫 Fake Friend Alert!
        </div>
      </div>

      {/* Hero Section */}
      <section className="w-full relative px-4 sm:px-6 pt-6 sm:pt-10 pb-12 max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Playful Interactive Mascot */}
        <div className="mb-4">
          <PlayfulMascot size="md" interactive={true} />
        </div>

        {/* Pill Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border-2 border-slate-900 text-slate-800 text-xs sm:text-sm font-black mb-4 shadow-[0_3px_0_#1E293B]">
          <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-400" />
          <span>The Viral &quot;Don&apos;t Block Me 2&quot; Friendship Quiz</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] max-w-2xl mb-4">
          Find Friends You <span className="text-pink-600 underline decoration-wavy decoration-yellow-400">Can&apos;t Trust!</span>
        </h1>

        <p className="text-base sm:text-xl font-bold text-slate-700 max-w-xl mb-8 leading-snug">
          Answer 10 questions about yourself. Share your link with friends. See who knows you best and who gets <span className="text-rose-600 font-black">BLOCKED! 🚫</span>
        </p>

        {/* Fast Action Card / Quiz Creator Box */}
        <div className="w-full max-w-md bg-white border-3 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-[0_8px_0_#1E293B] mb-8 text-left">
          <div className="text-center mb-5">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-1">
              Step 1 of 2: Who is creating the test?
            </span>
            <h2 className="text-xl font-black text-slate-900">
              Enter Your Name to Begin 🎯
            </h2>
          </div>

          <form onSubmit={handleStartQuiz} className="space-y-4">
            <div>
              <input
                type="text"
                required
                maxLength={20}
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                placeholder="e.g. Alex or Sarah"
                className="w-full px-4 py-3.5 rounded-2xl bg-sky-50 border-2 border-slate-900 focus:bg-white focus:outline-none text-slate-900 font-bold text-base placeholder:text-slate-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]"
              />
            </div>

            <button
              type="submit"
              disabled={!creatorName.trim()}
              className="w-full py-4 rounded-2xl bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed border-2.5 border-slate-900 text-slate-900 font-black text-base shadow-[0_5px_0_#CA8A04] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
            >
              <span>Create My Quiz!</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-slate-500">
            <span>⚡ Takes 60 seconds</span>
            <span>🔒 100% Free • No Login</span>
          </div>
        </div>
      </section>

      {/* Ad Placement: Below Hero */}
      <div className="w-full max-w-2xl px-4 mt-2 mb-2">
        <AdBanner slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME} />
      </div>

      {/* How it Works Section */}
      <section className="w-full max-w-4xl px-4 sm:px-6 py-12 mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-black uppercase tracking-wider text-slate-700 bg-white border border-slate-900 px-3 py-1 rounded-full shadow-[0_2px_0_#1E293B]">
            Simple & Viral
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            How &quot;Don&apos;t Block Me&quot; Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border-3 border-slate-900 rounded-3xl p-6 shadow-[0_6px_0_#1E293B] flex flex-col items-center text-center relative"
            >
              <div className="text-4xl mb-3">{item.emoji}</div>
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Step {item.step}
              </span>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                {item.title}
              </h3>
              <p className="text-xs font-bold text-slate-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Live Sample Scoreboard Preview (Safe vs Blocked) */}
      <section className="w-full max-w-md px-4 sm:px-6 py-6 mx-auto">
        <div className="bg-white border-3 border-slate-900 rounded-3xl p-6 shadow-[0_8px_0_#1E293B]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <div>
                <h3 className="text-base font-black text-slate-900">Live Scoreboard</h3>
                <p className="text-[11px] font-bold text-slate-500">Who passed vs who got blocked</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-yellow-300 border border-slate-900 text-[10px] font-black text-slate-900">
              SAMPLE
            </span>
          </div>

          <div className="space-y-2.5">
            {sampleResults.map((res, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border-2 border-slate-900"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-black text-xs text-slate-400">#{i + 1}</span>
                  <span className="font-bold text-xs text-slate-900">{res.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-xs text-slate-700">{res.score}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black border border-slate-900 ${
                      res.safe
                        ? "bg-emerald-300 text-slate-900"
                        : res.warning
                        ? "bg-amber-300 text-slate-900"
                        : "bg-rose-400 text-white"
                    }`}
                  >
                    {res.verdict}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
