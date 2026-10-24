"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User, KeyRound, Loader2, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
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
      <div className="bg-white border-3 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-[0_8px_0_#1E293B]">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-yellow-300 border-2 border-slate-900 flex items-center justify-center text-2xl mb-3 shadow-[0_3px_0_#1E293B]">
            🔑
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {isPreFilled ? "You're Invited to Play!" : "Join a Live Room"}
          </h1>
          <p className="text-xs font-bold text-slate-600 mt-1">
            {isPreFilled
              ? "Your partner is waiting in this room. Enter your nickname to begin!"
              : "Enter the 6-character room code to join the live challenge."}
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {isPreFilled && (
          <div className="mb-5 p-3 rounded-2xl bg-emerald-50 border-2 border-emerald-400 flex items-center justify-between text-xs font-bold text-emerald-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Room Code Detected</span>
            </div>
            <span className="font-mono font-black text-sm text-slate-900 tracking-wider">
              #{initialCode}
            </span>
          </div>
        )}

        <form onSubmit={handleJoin} className="space-y-4">
          {/* Room Code */}
          <div>
            <label htmlFor="roomCode" className="block text-xs font-black uppercase text-slate-500 mb-1">
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
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-sky-50 border-2 border-slate-900 focus:bg-white focus:outline-none text-slate-900 text-base font-mono font-black tracking-widest uppercase placeholder:font-sans placeholder:tracking-normal placeholder:text-slate-400"
              />
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-4" />
            </div>
          </div>

          {/* Nickname */}
          <div>
            <label htmlFor="nickname" className="block text-xs font-black uppercase text-slate-500 mb-1">
              Your Nickname
            </label>
            <div className="relative">
              <input
                id="nickname"
                type="text"
                required
                maxLength={20}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g. Jordan"
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-sky-50 border-2 border-slate-900 focus:bg-white focus:outline-none text-slate-900 text-base font-bold placeholder:text-slate-400"
              />
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-4" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 border-2.5 border-slate-900 text-slate-900 font-black text-base shadow-[0_5px_0_#CA8A04] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Entering Room...</span>
              </>
            ) : (
              <>
                <span>Enter Room Now</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function JoinRoomPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-slate-800 animate-spin" />
        </div>
      }
    >
      <JoinRoomContent />
    </Suspense>
  );
}
