"use client";

import React, { useEffect, useState, use, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Heart, User, ArrowRight, Loader2, AlertCircle } from "lucide-react";

interface ChallengeData {
  roomCode: string;
  hostNickname: string;
  categoryName: string;
  questionCount: number;
  status: string;
  expiresAt: string;
}

function ChallengeContent({
  params
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [nickname, setNickname] = useState("");
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    async function loadPreview() {
      try {
        const res = await fetch(`/api/challenge/${token}`);
        const data = await res.json();
        if (!res.ok || data.error) {
          throw new Error(data.error || "Invitation expired or invalid");
        }
        setChallenge(data.challenge);

        // If this device already has an active session token for this room, jump straight in
        if (typeof window !== "undefined" && data.challenge?.roomCode) {
          const existing = localStorage.getItem(`lovematch_token_${data.challenge.roomCode}`);
          if (existing) {
            router.push(`/room/${data.challenge.roomCode}`);
            return;
          }
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load invitation");
      } finally {
        setLoading(false);
      }
    }
    loadPreview();
  }, [token, router]);

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !challenge) return;

    setJoining(true);
    setError(null);

    try {
      const res = await fetch("/api/rooms/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomCode: challenge.roomCode,
          nickname: nickname.trim()
        })
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to join room");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem(`lovematch_token_${data.roomCode}`, data.sessionToken);
      }

      router.push(`/room/${data.roomCode}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to join challenge");
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
        <span className="text-sm text-pink-200">Loading challenge...</span>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="glass-panel rounded-3xl p-8 border border-pink-500/30">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white mb-2">Invitation Unavailable</h2>
          <p className="text-xs text-pink-200/80 mb-6">{error || "This invite has expired or already ended."}</p>
          <button
            onClick={() => router.push("/create")}
            className="w-full py-3.5 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-sm"
          >
            Create Your Own Challenge
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-6 py-8 sm:py-16">
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border-2 border-pink-500/40 shadow-2xl text-center">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center text-white mb-5 shadow-lg shadow-pink-500/50 animate-bounce">
          <Heart className="w-8 h-8 fill-white" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-pink-400 block mb-1">
          Special Challenge
        </span>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
          {challenge.hostNickname} Challenged You!
        </h1>

        <p className="text-xs sm:text-sm text-pink-200/80 mb-6">
          How well do you know each other? Answer privately, reveal simultaneously, and discover your Love Sync Score!
        </p>

        <div className="glass-card rounded-2xl p-4 border border-pink-500/30 mb-6 flex items-center justify-around text-center">
          <div>
            <span className="text-[10px] uppercase font-bold text-pink-300 block">Theme</span>
            <span className="text-sm font-bold text-white">{challenge.categoryName}</span>
          </div>
          <div className="w-px h-6 bg-pink-500/20" />
          <div>
            <span className="text-[10px] uppercase font-bold text-pink-300 block">Rounds</span>
            <span className="text-sm font-bold text-pink-400">{challenge.questionCount} Questions</span>
          </div>
        </div>

        <form onSubmit={handleAccept} className="space-y-4">
          <div>
            <label htmlFor="challengeNickname" className="block text-xs font-bold uppercase tracking-wider text-pink-300 text-left mb-1.5">
              Enter Your Nickname
            </label>
            <div className="relative">
              <input
                id="challengeNickname"
                type="text"
                required
                maxLength={25}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g. Sweetheart, Rahul, Boo"
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl glass-card border border-pink-500/30 focus:border-pink-500 focus:outline-none text-white text-sm placeholder:text-pink-300/40"
              />
              <User className="w-4 h-4 text-pink-400 absolute left-3.5 top-4" />
            </div>
          </div>

          <button
            type="submit"
            disabled={joining}
            className="w-full min-touch-target flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-extrabold text-base shadow-xl shadow-pink-500/35 transition-transform active:scale-95 disabled:opacity-50"
          >
            {joining ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Entering Room...</span>
              </>
            ) : (
              <>
                <span>Accept & Start Challenge</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ChallengeInvitePage(props: {
  params: Promise<{ token: string }>;
}) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
      </div>
    }>
      <ChallengeContent {...props} />
    </Suspense>
  );
}
