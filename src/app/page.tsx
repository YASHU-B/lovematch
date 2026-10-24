import React from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Heart, 
  Share2, 
  ArrowRight, 
  CheckCircle2, 
  Smartphone, 
  HelpCircle
} from "lucide-react";
import { CATEGORIES } from "@/lib/questions/data";

export default function LandingPage() {
  const faqItems = [
    {
      q: "Do we need to download an app or create an account?",
      a: "No! LoveMatch is 100% web-based and requires zero app installs or signups. Simply enter your nickname, share your private room link or code with your partner, and play instantly."
    },
    {
      q: "Can my partner peek at my answers before revealing?",
      a: "Never. Your answers are encrypted and held privately on our secure servers. They are only unlocked simultaneously once both of you have locked in your submissions."
    },
    {
      q: "How does the multiplayer work across different phones?",
      a: "Each round alternates roles: one person answers for themselves (the Subject), and their partner predicts what they chose (the Guesser). When both submit, the real-time engine reveals both cards together and calculates your match points."
    },
    {
      q: "Is LoveMatch only for romantic couples?",
      a: "While designed with couples in mind (dating, married, and long-distance), we also include a dedicated 'Best Friends Mode' perfect for besties, roommates, and duo friendships!"
    },
    {
      q: "How long is our private room kept?",
      a: "Rooms expire automatically after 24 hours of inactivity. We never sell your personal answers or store relationship details."
    }
  ];

  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      {/* Hero Section */}
      <section className="w-full relative px-4 sm:px-6 pt-10 sm:pt-16 pb-16 max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-pink-500/40 text-pink-300 text-xs sm:text-sm font-semibold mb-6 animate-pulse-glow">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span>The #1 Couples & Friends Multiplayer Quiz</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15] max-w-3xl mb-5">
          How Well Do You <span className="text-gradient-romantic">Really Know</span> Your Person?
        </h1>

        {/* Supporting Text */}
        <p className="text-base sm:text-lg md:text-xl text-pink-150/90 text-pink-200/90 max-w-2xl mb-8 leading-relaxed">
          Answer the questions privately. Reveal the truth together. Discover how in sync you really are.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-14">
          <Link
            href="/play"
            className="w-full sm:w-auto min-touch-target flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-700 text-white font-extrabold text-base sm:text-lg shadow-xl shadow-pink-500/35 transition-all transform hover:-translate-y-0.5 active:scale-95"
          >
            <span>Play Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/create"
            className="w-full sm:w-auto min-touch-target flex items-center justify-center gap-2 px-7 py-4 rounded-2xl glass-card text-pink-100 hover:text-white hover:border-pink-500/60 font-bold text-base transition-all"
          >
            <Sparkles className="w-5 h-5 text-pink-400" />
            <span>Create a Challenge</span>
          </Link>
        </div>

        {/* Live Reveal Interactive Mockup Preview */}
        <div className="w-full max-w-md sm:max-w-lg glass-panel rounded-3xl p-5 sm:p-6 border border-pink-500/30 shadow-2xl relative">
          <div className="flex items-center justify-between border-b border-pink-500/20 pb-3 mb-4 text-xs font-semibold text-pink-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Simultaneous Reveal Preview
            </span>
            <span className="text-pink-400">Round 1 of 5</span>
          </div>

          <p className="text-base sm:text-lg font-bold text-white mb-5">
            &ldquo;What is your partner&apos;s favourite food?&rdquo;
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Subject answer card */}
            <div className="glass-card rounded-2xl p-3.5 border border-pink-500/40 text-left bg-pink-500/10">
              <span className="text-[11px] font-semibold text-pink-300 block mb-1">Priya (Subject)</span>
              <div className="text-sm sm:text-base font-extrabold text-white flex items-center gap-1.5">
                <span>Biryani</span>
              </div>
            </div>

            {/* Guesser prediction card */}
            <div className="glass-card rounded-2xl p-3.5 border border-pink-500/40 text-left bg-pink-500/10">
              <span className="text-[11px] font-semibold text-pink-300 block mb-1">Rohan (Predicted)</span>
              <div className="text-sm sm:text-base font-extrabold text-white flex items-center gap-1.5">
                <span>Biryani</span>
              </div>
            </div>
          </div>

          {/* Match Banner */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-pink-500/20 to-purple-500/20 border border-emerald-400/40 flex items-center justify-between text-xs sm:text-sm font-bold">
            <div className="flex items-center gap-2 text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>It&apos;s a Match!</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 text-xs">
              +10 Points
            </span>
          </div>
        </div>
      </section>

      {/* 3-Step How It Works */}
      <section className="w-full py-16 px-4 sm:px-6 bg-[#1a0a22]/70 border-y border-pink-500/15">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-400">Simple & Private</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
              How LoveMatch Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <div className="glass-card rounded-3xl p-6 flex flex-col items-start border border-pink-500/20">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400 mb-4 font-black text-xl">
                1
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Create & Invite</h3>
              <p className="text-sm text-pink-200/80 leading-relaxed">
                Pick a category and share your private 6-letter room code or link via WhatsApp or Instagram. No passwords or app downloads needed.
              </p>
            </div>

            <div className="glass-card rounded-3xl p-6 flex flex-col items-start border border-pink-500/20">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-4 font-black text-xl">
                2
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Answer in Private</h3>
              <p className="text-sm text-pink-200/80 leading-relaxed">
                Each round alternates roles: one person answers honestly, and the other predicts their choice. Answers stay strictly secret until locked in.
              </p>
            </div>

            <div className="glass-card rounded-3xl p-6 flex flex-col items-start border border-pink-500/20">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-4 font-black text-xl">
                3
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Simultaneous Reveal</h3>
              <p className="text-sm text-pink-200/80 leading-relaxed">
                Once both tap Lock In, both answers reveal at the exact same second! Celebrate matches, laugh at surprises, and earn your Love Sync Score.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Carousel / Grid */}
      <section className="w-full py-16 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-pink-400">10 Curated Packs</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Popular Quiz Categories
            </h2>
          </div>
          <Link
            href="/play"
            className="text-sm font-semibold text-pink-400 hover:text-pink-300 flex items-center gap-1"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.slice(0, 6).map((cat) => (
            <Link
              key={cat.id}
              href={`/create?category=${cat.id}`}
              className="glass-card glass-card-interactive rounded-2xl p-5 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                    <Heart className="w-5 h-5 fill-pink-400/20" />
                  </div>
                  {cat.badge && (
                    <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-bold uppercase tracking-wider">
                      {cat.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-white mb-1 group-hover:text-pink-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-pink-200/75 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-pink-500/15 flex items-center justify-between text-xs font-medium text-pink-300">
                <span>Start Quiz</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Love Sync Score Showcase */}
      <section className="w-full py-16 px-4 sm:px-6 bg-[#210e2b]/80 border-t border-pink-500/15">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-400">Shareable Memories</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1 mb-4">
              Earn Your Love Sync Score & Download Story Cards
            </h2>
            <p className="text-sm sm:text-base text-pink-200/85 leading-relaxed mb-6">
              Are you <em>Mind Readers</em> (90–100%) or will you find unexpected <em>Plot Twists</em>? At the end of every quiz, generate high-definition story cards ready for your Instagram Stories and WhatsApp Status.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="flex items-center gap-2 text-xs font-semibold text-pink-300">
                <Smartphone className="w-4 h-4 text-pink-400" />
                <span>Instagram Story (1080×1920)</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-pink-300">
                <Share2 className="w-4 h-4 text-pink-400" />
                <span>One-Tap WhatsApp Share</span>
              </div>
            </div>
          </div>

          <div className="w-64 sm:w-72 glass-panel rounded-3xl p-6 text-center border-2 border-pink-500/40 shadow-2xl relative animate-float">
            <div className="w-36 h-36 mx-auto rounded-full bg-pink-500/20 border-4 border-pink-500 flex flex-col items-center justify-center shadow-[0_0_35px_rgba(236,72,153,0.4)] mb-4">
              <span className="text-4xl font-black text-white">88%</span>
              <span className="text-[10px] font-bold text-pink-300 uppercase tracking-wider">Sync Score</span>
            </div>
            <h4 className="text-xl font-extrabold text-pink-300 mb-1">Perfectly in Sync</h4>
            <p className="text-xs text-pink-200/70">Priya & Rohan answered 5 rounds together</p>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="w-full py-16 px-4 sm:px-6 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-pink-400">Got Questions?</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, idx) => (
            <div key={idx} className="glass-card rounded-2xl p-5 border border-pink-500/20">
              <h3 className="text-base font-bold text-white mb-2 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-pink-400 mt-1 shrink-0" />
                <span>{item.q}</span>
              </h3>
              <p className="text-xs sm:text-sm text-pink-200/80 pl-6 leading-relaxed">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Sticky Mobile / Final CTA */}
      <section className="w-full py-12 px-4 sm:px-6 bg-gradient-to-t from-[#16071c] to-transparent text-center">
        <div className="max-w-md mx-auto">
          <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-3">
            Ready to test your bond?
          </h3>
          <p className="text-xs sm:text-sm text-pink-200/80 mb-6">
            Create a private challenge in under 15 seconds. Free forever.
          </p>
          <Link
            href="/create"
            className="w-full min-touch-target flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-extrabold text-base shadow-xl shadow-pink-500/30 transition-transform active:scale-95"
          >
            <Sparkles className="w-5 h-5" />
            <span>Create Free Challenge</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
