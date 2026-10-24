"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, User, KeyRound, Loader2, AlertCircle, Heart, CheckCircle2 } from "lucide-react";
import { extractRoomCode } from "@/lib/tokens";

function JoinRoomContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawCode = searchParams.get("code") || "";
  const initialCode = extractRoomCode(rawCode);

  const [roomCode, setRoomCode] = useState(() => initialCode);
  const [nickname, setNickname] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("lovematch_nickname") || "";
    }
    return "";
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-redirect if player already has an active session token for this room
  useEffect(() => {
    if (typeof window !== "undefined" && initialCode) {
      const existingSession = localStorage.getItem(`lovematch_token_${initialCode}`);
      if (existingSession) {
        router.push(`/room/${initialCode}`);
      }
    }
  }, [initialCode, router]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = extractRoomCode(roomCode);

    if (!cleanCode) {
      setError("Please enter a valid 6-character room code");
      return;
    }
    if (!nickname.trim()) {
      setError("Please enter your nickname");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/rooms/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomCode: cleanCode,
          nickname: nickname.trim()
        })
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to join room");
      }

      // Save sessionToken and nickname to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(`lovematch_token_${data.roomCode}`, data.sessionToken);
        localStorage.setItem("lovematch_nickname", nickname.trim());
      }

      // Route straight to room
      router.push(`/room/${data.roomCode}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to join room");
    } finally {
      setLoading(false);
    }
  };

  const isPreFilled = Boolean(initialCode);

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-6 py-8 sm:py-16">
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-pink-500/30 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-3">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {isPreFilled ? "You're Invited to Play!" : "Join a Room"}
          </h1>
          <p className="text-xs text-pink-200/80 mt-1">
            {isPreFilled
              ? "Your partner is waiting in this room. Enter your nickname to begin!"
              : "Enter the room code sent by your partner to play together."}
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {isPreFilled && (
          <div className="mb-5 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-between text-xs font-semibold text-emerald-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Room Code Detected</span>
            </div>
            <span className="font-mono font-black text-sm text-white tracking-wider">
              #{initialCode}
            </span>
          </div>
        )}

        <form onSubmit={handleJoin} className="space-y-5">
          {/* Room Code (editable if not pre-filled or can be adjusted) */}
          <div>
            <label htmlFor="roomCode" className="block text-xs font-bold uppercase tracking-wider text-pink-300 mb-1.5">
              Room Code
            </label>
            <div className="relative">
              <input
                id="roomCode"
                type="text"
                required
                maxLength={10}
                value={roomCode}
                onChange={(e) => setRoomCode(extractRoomCode(e.target.value))}
                placeholder="e.g. HEART8"
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl glass-card border border-pink-500/30 focus:border-pink-500 focus:outline-none text-white text-base font-mono tracking-widest uppercase placeholder:font-sans placeholder:tracking-normal placeholder:text-pink-300/40"
              />
              <KeyRound className="w-4 h-4 text-pink-400 absolute left-3.5 top-4" />
            </div>
          </div>

          {/* Nickname */}
          <div>
            <label htmlFor="joinNickname" className="block text-xs font-bold uppercase tracking-wider text-pink-300 mb-1.5">
              Your Nickname
            </label>
            <div className="relative">
              <input
                id="joinNickname"
                type="text"
                required
                maxLength={25}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g. Rohan, Bae, Cookie"
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl glass-card border border-pink-500/30 focus:border-pink-500 focus:outline-none text-white text-sm placeholder:text-pink-300/40"
              />
              <User className="w-4 h-4 text-pink-400 absolute left-3.5 top-4" />
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
                <span>Connecting to Room...</span>
              </>
            ) : (
              <>
                <Heart className="w-5 h-5 fill-white" />
                <span>Enter & Start Challenge</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
      </div>
    }>
      <JoinRoomContent />
    </Suspense>
  );
}
