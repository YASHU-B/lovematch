import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, Clock, EyeOff, ArrowLeft } from "lucide-react";
import { KawaiiBear, KawaiiPanda, WavyUnderline } from "@/components/KawaiiCharacters";

export default function PrivacyPage() {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-black text-slate-800 hover:text-pink-600 mb-6 bg-white/80 px-3.5 py-1.5 rounded-full border border-slate-900 shadow-xs transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Don&apos;t Block Me</span>
      </Link>

      <div className="bg-white border-3 border-slate-900 rounded-3xl p-6 sm:p-10 shadow-[0_8px_0_#1E293B] space-y-8 select-none">
        {/* Header */}
        <div className="border-b-2 border-slate-100 pb-6 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
            <span className="p-1 rounded-lg bg-pink-100 border border-pink-300 text-pink-600">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-pink-600">
              Privacy & Data Policy
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Privacy Policy{" "}
            <WavyUnderline color="pink" className="w-28 h-2 mt-1 hidden sm:block" />
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-500 mt-2">
            Last updated: October 2026. Your friendship answers and scores are strictly yours.
          </p>

          <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
            <KawaiiBear size="sm" mood="cute" className="w-8 h-8" />
            <KawaiiPanda size="sm" mood="shy" className="w-8 h-8" />
          </div>
        </div>

        {/* Core Principles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl p-4 bg-sky-50 border-2 border-slate-900 text-left">
            <EyeOff className="w-5 h-5 text-sky-600 mb-2" />
            <h3 className="text-sm font-black text-slate-900 mb-1">Zero Accounts</h3>
            <p className="text-xs font-bold text-slate-600">
              No mandatory signups, no phone numbers, no emails, and no passwords required.
            </p>
          </div>

          <div className="rounded-2xl p-4 bg-pink-50 border-2 border-slate-900 text-left">
            <Lock className="w-5 h-5 text-pink-500 mb-2" />
            <h3 className="text-sm font-black text-slate-900 mb-1">Zero Answer Leaks</h3>
            <p className="text-xs font-bold text-slate-600">
              Creator answer keys are kept secret on the server so friends cannot cheat or peek.
            </p>
          </div>

          <div className="rounded-2xl p-4 bg-yellow-50 border-2 border-slate-900 text-left">
            <Clock className="w-5 h-5 text-yellow-600 mb-2" />
            <h3 className="text-sm font-black text-slate-900 mb-1">Automatic Cleanup</h3>
            <p className="text-xs font-bold text-slate-600">
              Inactive quiz sessions and responses expire naturally to preserve privacy.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <section className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <h2 className="text-base sm:text-lg font-black text-slate-900">
            1. Information We Collect
          </h2>
          <p className="font-bold">
            When you play Don&apos;t Block Me, we only collect the minimum information necessary to calculate scores:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 font-bold text-slate-600">
            <li>
              <strong>Nicknames:</strong> Casual names you provide (e.g. &quot;Yashu&quot;, &quot;Maya&quot;). We never ask for legal names.
            </li>
            <li>
              <strong>Quiz Answers:</strong> The options selected during quiz creation and quiz taking to calculate friend verdicts.
            </li>
            <li>
              <strong>Secret Tokens:</strong> Stored locally in your browser so only the quiz creator can inspect their private scoreboard.
            </li>
          </ul>
        </section>

        <section className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <h2 className="text-base sm:text-lg font-black text-slate-900">
            2. How Friend Attempts are Scored
          </h2>
          <p className="font-bold">
            When a friend answers your quiz, their answers are sent to our scoring engine. The server compares them against your answer key, calculates their score, and assigns a humorous verdict (Safe 💖, Warning ⚠️, or Blocked 🚫).
          </p>
        </section>

        <section className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <h2 className="text-base sm:text-lg font-black text-slate-900">
            3. Social Sharing & WhatsApp Links
          </h2>
          <p className="font-bold">
            Sharing your test on WhatsApp, Snapchat, or Instagram is 100% voluntary. We never automatically post or share anything without your direct action.
          </p>
        </section>

        <div className="pt-4 border-t-2 border-slate-100 text-xs font-bold text-slate-500">
          Have privacy questions? Reach out to us at <span className="text-slate-900 font-black">privacy@dontblockme.app</span>.
        </div>
      </div>
    </div>
  );
}
