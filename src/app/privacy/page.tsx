import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, Clock, EyeOff, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-pink-300 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to LoveMatch</span>
      </Link>

      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-pink-500/30 shadow-2xl space-y-8">
        <div className="border-b border-pink-500/20 pb-6">
          <div className="flex items-center gap-2 text-pink-400 mb-2">
            <ShieldCheck className="w-6 h-6" />
            <span className="text-xs font-bold uppercase tracking-wider">Privacy & Trust</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-pink-200/70 mt-1">
            Last updated: October 2026. Your romantic moments and answers are strictly yours.
          </p>
        </div>

        {/* Core Principles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card rounded-2xl p-4 border border-pink-500/20">
            <EyeOff className="w-5 h-5 text-pink-400 mb-2" />
            <h3 className="text-sm font-bold text-white mb-1">Zero Tracking</h3>
            <p className="text-xs text-pink-200/75">
              No mandatory signups, no phone numbers, no email addresses, and no social logins required.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-4 border border-pink-500/20">
            <Lock className="w-5 h-5 text-purple-400 mb-2" />
            <h3 className="text-sm font-bold text-white mb-1">Encrypted Answers</h3>
            <p className="text-xs text-pink-200/75">
              Your submissions are hidden until both players lock in. No peeking or early exposure.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-4 border border-pink-500/20">
            <Clock className="w-5 h-5 text-rose-400 mb-2" />
            <h3 className="text-sm font-bold text-white mb-1">24-Hour Expiry</h3>
            <p className="text-xs text-pink-200/75">
              Game rooms and session data are automatically scrubbed and deleted after 24 hours of inactivity.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <section className="space-y-3 text-xs sm:text-sm text-pink-100/90 leading-relaxed">
          <h2 className="text-lg font-bold text-white">1. Information We Collect</h2>
          <p>
            When you play LoveMatch, we only collect the minimum information necessary to run your quiz:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-pink-200/80">
            <li><strong>Nicknames:</strong> Temporary names you and your partner provide (e.g. &quot;Maya&quot;, &quot;Honey&quot;). We do not require real legal names.</li>
            <li><strong>Quiz Answers:</strong> The options selected during active gameplay to compute your Love Sync Score.</li>
            <li><strong>Anonymous Session Tokens:</strong> Cryptographically generated temporary tokens to authenticate your browser in your private room.</li>
          </ul>
        </section>

        <section className="space-y-3 text-xs sm:text-sm text-pink-100/90 leading-relaxed">
          <h2 className="text-lg font-bold text-white">2. How Your Answers are Protected</h2>
          <p>
            Submissions are stored securely and never broadcast to other players until the authorized simultaneous reveal event. Even in real-time mode, our server-side authorization ensures the opposing player cannot query or inspect your answer while you are answering.
          </p>
        </section>

        <section className="space-y-3 text-xs sm:text-sm text-pink-100/90 leading-relaxed">
          <h2 className="text-lg font-bold text-white">3. Public Sharing & Social Story Cards</h2>
          <p>
            Sharing is entirely optional. When you download a Result Story Card or share a link on WhatsApp or Instagram, only your nicknames, aggregate score, and result title (e.g. &quot;Mind Readers&quot;) are rendered. We never automatically post to social networks or publish answers publicly.
          </p>
        </section>

        <section className="space-y-3 text-xs sm:text-sm text-pink-100/90 leading-relaxed">
          <h2 className="text-lg font-bold text-white">4. Data Retention & Automatic Cleanup</h2>
          <p>
            Rooms and player submissions expire 24 hours after creation. You can also request immediate manual purge of your room data at any time by contacting our team at privacy@lovematch.app with your room code.
          </p>
        </section>

        <div className="pt-4 border-t border-pink-500/20 text-xs text-pink-300/70">
          For privacy inquiries or deletion requests, contact us at <span className="text-pink-300 font-semibold">privacy@lovematch.app</span>.
        </div>
      </div>
    </div>
  );
}
