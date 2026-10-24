import React from "react";
import Link from "next/link";
import { Scale, ArrowLeft, HeartHandshake, Smile, AlertTriangle } from "lucide-react";
import { KawaiiBear, KawaiiPanda, WavyUnderline } from "@/components/KawaiiCharacters";

export default function TermsPage() {
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
            <span className="p-1 rounded-lg bg-yellow-100 border border-yellow-300 text-yellow-700">
              <Scale className="w-4 h-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-yellow-700">
              User Agreement
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Terms of Service{" "}
            <WavyUnderline color="yellow" className="w-28 h-2 mt-1 hidden sm:block" />
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-500 mt-2">
            Last updated: October 2026. Please read these terms before playing.
          </p>

          <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
            <KawaiiBear size="sm" mood="happy" className="w-8 h-8" />
            <KawaiiPanda size="sm" mood="happy" className="w-8 h-8" />
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl p-4 bg-yellow-50 border-2 border-slate-900 text-left">
            <Smile className="w-5 h-5 text-yellow-600 mb-2" />
            <h3 className="text-sm font-black text-slate-900 mb-1">100% Fun & Humor</h3>
            <p className="text-xs font-bold text-slate-600">
              Verdicts like &quot;Blocked&quot; or &quot;Fake Friend&quot; are playful jokes meant for friendly teasing only.
            </p>
          </div>

          <div className="rounded-2xl p-4 bg-emerald-50 border-2 border-slate-900 text-left">
            <HeartHandshake className="w-5 h-5 text-emerald-600 mb-2" />
            <h3 className="text-sm font-black text-slate-900 mb-1">Friendly Respect</h3>
            <p className="text-xs font-bold text-slate-600">
              Please enter kind nicknames and avoid hateful, obscene, or harmful content.
            </p>
          </div>

          <div className="rounded-2xl p-4 bg-rose-50 border-2 border-slate-900 text-left">
            <AlertTriangle className="w-5 h-5 text-rose-500 mb-2" />
            <h3 className="text-sm font-black text-slate-900 mb-1">No Real Blocks</h3>
            <p className="text-xs font-bold text-slate-600">
              We never actually block anyone on WhatsApp, Instagram, or any external service.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <section className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <h2 className="text-base sm:text-lg font-black text-slate-900">
            1. Entertainment Purpose
          </h2>
          <p className="font-bold">
            Don&apos;t Block Me is designed as a fun, viral social quiz for friends and classmates. All test results, rankings, and verdicts (such as &quot;Safe 💖&quot;, &quot;On Thin Ice ⚠️&quot;, or &quot;Blocked 🚫&quot;) are generated solely for humor, banter, and conversation-starting.
          </p>
        </section>

        <section className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <h2 className="text-base sm:text-lg font-black text-slate-900">
            2. Acceptable Use
          </h2>
          <p className="font-bold">
            You agree to use this website in a respectful manner. When entering nicknames or creating quizzes, you must not submit content that is defamatory, harassing, sexually explicit, abusive, or infringing upon another person&apos;s rights.
          </p>
        </section>

        <section className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <h2 className="text-base sm:text-lg font-black text-slate-900">
            3. Intellectual Property
          </h2>
          <p className="font-bold">
            All original quiz formats, artwork, Bear & Panda kawaii illustrations, animations, and software code are the proprietary intellectual property of the project. You are free to share links and scorecards across social media.
          </p>
        </section>

        <section className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <h2 className="text-base sm:text-lg font-black text-slate-900">
            4. Disclaimer & Limitation of Liability
          </h2>
          <p className="font-bold">
            Don&apos;t Block Me is provided on an &quot;as-is&quot; basis without warranties of any kind. We are not responsible for any personal disagreements or hurt feelings resulting from friend quiz scores.
          </p>
        </section>

        <div className="pt-4 border-t-2 border-slate-100 text-xs font-bold text-slate-500">
          Questions regarding these Terms? Contact us at <span className="text-slate-900 font-black">terms@dontblockme.app</span>.
        </div>
      </div>
    </div>
  );
}
