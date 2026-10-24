"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/lib/questions/data";
import { 
  Sparkles, 
  Copy, 
  Check, 
  Share2, 
  ArrowRight, 
  User, 
  Heart, 
  Loader2,
  AlertCircle
} from "lucide-react";

function CreateRoomContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialCat = searchParams.get("category") || "all";
  const initialCount = Number(searchParams.get("count")) === 10 ? 10 : 5;

  const [nickname, setNickname] = useState("");
  const [categoryId, setCategoryId] = useState(initialCat);
  const [questionCount, setQuestionCount] = useState<5 | 10>(initialCount as 5 | 10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Created room state
  const [createdRoom, setCreatedRoom] = useState<{
    roomCode: string;
    roomId: string;
    shareToken: string;
    sessionToken: string;
  } | null>(null);

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setError("Please enter your nickname");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: nickname.trim(),
          categoryId,
          questionCount
        })
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to create room");
      }

      // Save sessionToken to localStorage for resilience
      if (typeof window !== "undefined") {
        localStorage.setItem(`lovematch_token_${data.roomCode}`, data.sessionToken);
      }

      setCreatedRoom({
        roomCode: data.roomCode,
        roomId: data.roomId,
        shareToken: data.shareToken,
        sessionToken: data.sessionToken
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getInviteUrl = () => {
    if (!createdRoom) return "";
    const origin = typeof window !== "undefined" ? window.location.origin : "https://lovematch.app";
    return `${origin}/challenge/${createdRoom.shareToken}`;
  };

  const handleCopyLink = async () => {
    const url = getInviteUrl();
    await navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCode = async () => {
    if (!createdRoom) return;
    await navigator.clipboard.writeText(createdRoom.roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleNativeShare = async () => {
    if (!createdRoom) return;
    const url = getInviteUrl();
    const shareData = {
      title: "LoveMatch Challenge",
      text: `${nickname} challenged you to a LoveMatch quiz! Room Code: ${createdRoom.roomCode}. Who knows who better?`,
      url
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User dismissed
      }
    } else {
      handleCopyLink();
    }
  };

  const enterGameRoom = () => {
    if (!createdRoom) return;
    router.push(`/room/${createdRoom.roomCode}`);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {!createdRoom ? (
        /* Create Room Form */
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-pink-500/30 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-3">
              <Heart className="w-6 h-6 fill-pink-500/20" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Create a Challenge
            </h1>
            <p className="text-xs text-pink-200/80 mt-1">
              Start a private quiz room and challenge your favorite person.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-5">
            {/* Nickname Input */}
            <div>
              <label htmlFor="nickname" className="block text-xs font-bold uppercase tracking-wider text-pink-300 mb-1.5">
                Your Nickname
              </label>
              <div className="relative">
                <input
                  id="nickname"
                  type="text"
                  required
                  maxLength={25}
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="e.g. Maya, Honey, Bestie"
                  className="w-full pl-10 pr-4 py-3.5 rounded-2xl glass-card border border-pink-500/30 focus:border-pink-500 focus:outline-none text-white text-sm placeholder:text-pink-300/40"
                />
                <User className="w-4 h-4 text-pink-400 absolute left-3.5 top-4" />
              </div>
            </div>

            {/* Category Selector */}
            <div>
              <label htmlFor="category" className="block text-xs font-bold uppercase tracking-wider text-pink-300 mb-1.5">
                Quiz Theme
              </label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl glass-card border border-pink-500/30 focus:border-pink-500 focus:outline-none text-white text-sm bg-[#25112F]"
              >
                <option value="all">🌟 All-Rounder Mix (Curated Variety)</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.badge || "Classic"})
                  </option>
                ))}
              </select>
            </div>

            {/* Question Count Toggle */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-pink-300 mb-1.5">
                Length
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setQuestionCount(5)}
                  className={`py-3 rounded-2xl text-xs sm:text-sm font-bold border transition-all ${
                    questionCount === 5
                      ? "glass-card-selected text-white"
                      : "glass-card text-pink-300 hover:text-white"
                  }`}
                >
                  ⚡ 5 Questions
                </button>
                <button
                  type="button"
                  onClick={() => setQuestionCount(10)}
                  className={`py-3 rounded-2xl text-xs sm:text-sm font-bold border transition-all ${
                    questionCount === 10
                      ? "glass-card-selected text-white"
                      : "glass-card text-pink-300 hover:text-white"
                  }`}
                >
                  ✨ 10 Questions
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full min-touch-target flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-extrabold text-base shadow-xl shadow-pink-500/35 transition-transform active:scale-95 disabled:opacity-50 mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating Room...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Create Private Room</span>
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        /* Room Created Success & Share Screen */
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border-2 border-pink-500/40 shadow-2xl text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-pink-500/50">
            <Sparkles className="w-7 h-7" />
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight mb-1">
            Room Created!
          </h2>
          <p className="text-xs text-pink-200/80 mb-6">
            Share this private room code or invite link with your partner.
          </p>

          {/* Big Room Code Display */}
          <div className="p-4 rounded-2xl glass-card border-2 border-pink-500/50 mb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-pink-300 block mb-1">
              Your Private Room Code
            </span>
            <div className="text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-300 to-lavender-200">
              {createdRoom.roomCode}
            </div>
            <button
              onClick={handleCopyCode}
              className="mt-2 text-xs font-semibold text-pink-300 hover:text-white inline-flex items-center gap-1.5"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? "Code Copied!" : "Copy Code"}</span>
            </button>
          </div>

          {/* Sharing Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={handleNativeShare}
              className="w-full min-touch-target flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] font-bold text-sm transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Share via WhatsApp / Instagram</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="w-full min-touch-target flex items-center justify-center gap-2 py-3 rounded-2xl glass-card text-pink-200 hover:text-white text-xs font-semibold"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-pink-400" />}
              <span>{copiedLink ? "Link Copied to Clipboard!" : "Copy Full Invitation Link"}</span>
            </button>
          </div>

          {/* Enter Room CTA */}
          <button
            onClick={enterGameRoom}
            className="w-full min-touch-target flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-extrabold text-base shadow-xl shadow-pink-500/40 transition-transform active:scale-95"
          >
            <span>Enter Game Room</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function CreateRoomPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
      </div>
    }>
      <CreateRoomContent />
    </Suspense>
  );
}
