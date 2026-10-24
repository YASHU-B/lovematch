"use client";

import React, { useEffect, useState, useRef, use, Suspense } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { soundEffects } from "@/components/AudioEffects";
import { 
  Sparkles, 
  Heart, 
  Lock, 
  ArrowRight, 
  Copy, 
  Check, 
  Loader2, 
  WifiOff, 
  Clock,
  Share2
} from "lucide-react";
import { AuthorizedRoomState } from "@/lib/db/schema";
import { InteractiveOptionCard } from "@/components/InteractiveOptionCard";
import { CardRevealAnimation } from "@/components/CardRevealAnimation";

function RoomContent({
  params
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const router = useRouter();
  const roomCode = code.toUpperCase();

  const [state, setState] = useState<AuthorizedRoomState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Audio & confetti trigger ref to prevent duplicate triggers
  const lastRevealedRoundRef = useRef<number | null>(null);



  // Real-time synchronization loop
  useEffect(() => {
    let isMounted = true;

    const sync = async () => {
      try {
        const localToken = typeof window !== "undefined"
          ? localStorage.getItem(`lovematch_token_${roomCode}`) || ""
          : "";

        const res = await fetch(`/api/room/${roomCode}/sync`, {
          headers: { "x-session-token": localToken }
        });

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            throw new Error("Session expired or unauthorized. Please re-join the room.");
          }
          throw new Error("Unable to connect to room.");
        }

        const data = await res.json();
        if (isMounted && data.state) {
          setState(data.state);
          setIsOnline(true);
          setLoading(false);

          if (data.state.room.status === "finished") {
            router.push(`/results/${data.state.room.id}`);
            return;
          }

          const curRound = data.state.currentRound;
          if (
            curRound &&
            (curRound.phase === "revealed" || curRound.phase === "completed") &&
            lastRevealedRoundRef.current !== curRound.roundNumber
          ) {
            lastRevealedRoundRef.current = curRound.roundNumber;
            if (curRound.isMatch) {
              soundEffects.playMatchChime();
              confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.6 },
                colors: ["#EC4899", "#F472B6", "#C4B5FD", "#FFF8FC"]
              });
            } else {
              soundEffects.playMismatchBoop();
            }
          }
        }
      } catch (err: unknown) {
        if (isMounted) {
          setIsOnline(false);
          setError(err instanceof Error ? err.message : "Connection lost");
          setLoading(false);
        }
      }
    };

    sync();
    const interval = setInterval(sync, 1500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [roomCode, router]);

  // Handle answer locking
  const handleLockIn = async () => {
    if (!selectedOption || !state || isSubmitting) return;

    soundEffects.playPop();
    setIsSubmitting(true);
    setError(null);

    try {
      const localToken = typeof window !== "undefined"
        ? localStorage.getItem(`lovematch_token_${roomCode}`) || ""
        : "";

      const res = await fetch(`/api/room/${roomCode}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-token": localToken
        },
        body: JSON.stringify({ answerText: selectedOption })
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to submit answer");
      }

      if (data.state) {
        setState(data.state);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle advancing to next round
  const handleNextRound = async () => {
    if (!state || isAdvancing) return;

    soundEffects.playPop();
    setIsAdvancing(true);
    setSelectedOption("");
    setError(null);

    try {
      const localToken = typeof window !== "undefined"
        ? localStorage.getItem(`lovematch_token_${roomCode}`) || ""
        : "";

      const res = await fetch(`/api/room/${roomCode}/next`, {
        method: "POST",
        headers: {
          "x-session-token": localToken
        }
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to advance round");
      }

      if (data.state) {
        setState(data.state);
        if (data.state.room.status === "finished") {
          router.push(`/results/${data.state.room.id}`);
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to advance");
    } finally {
      setIsAdvancing(false);
    }
  };

  const copyRoomCode = async () => {
    await navigator.clipboard.writeText(roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const [joinNickname, setJoinNickname] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  const handleInlineJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinNickname.trim()) return;

    setIsJoining(true);
    setJoinError(null);

    try {
      const res = await fetch("/api/rooms/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomCode,
          nickname: joinNickname.trim()
        })
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to join room");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem(`lovematch_token_${roomCode}`, data.sessionToken);
      }

      window.location.reload();
    } catch (err: unknown) {
      setJoinError(err instanceof Error ? err.message : "Failed to join room");
      setIsJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
        <span className="text-sm text-pink-200">Connecting to room {roomCode}...</span>
      </div>
    );
  }

  if (error && !state) {
    const isAuthRequired =
      error.toLowerCase().includes("session") ||
      error.toLowerCase().includes("unauthorized") ||
      error.toLowerCase().includes("authentication");

    if (isAuthRequired) {
      return (
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border-2 border-pink-500/40 shadow-2xl">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-4 animate-pulse">
              <Heart className="w-7 h-7 fill-pink-500/30" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-pink-400 block mb-1">
              You&apos;re Invited!
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight mb-2">
              Join Room #{roomCode}
            </h2>
            <p className="text-xs text-pink-200/80 mb-6">
              Enter your nickname below to join your partner and start playing immediately:
            </p>

            {joinError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs">
                {joinError}
              </div>
            )}

            <form onSubmit={handleInlineJoin} className="space-y-4">
              <input
                type="text"
                required
                maxLength={25}
                value={joinNickname}
                onChange={(e) => setJoinNickname(e.target.value)}
                placeholder="e.g. Honey, Rohan, Bestie"
                className="w-full px-4 py-3.5 rounded-2xl glass-card border border-pink-500/30 text-white text-sm focus:border-pink-500 focus:outline-none placeholder:text-pink-300/40"
              />
              <button
                type="submit"
                disabled={isJoining}
                className="w-full min-touch-target flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 text-white font-extrabold text-base shadow-xl shadow-pink-500/35 transition-transform active:scale-95 disabled:opacity-50"
              >
                {isJoining ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Joining Room...</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 fill-white" />
                    <span>Enter Room & Start</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="glass-panel rounded-3xl p-8 border border-pink-500/30">
          <WifiOff className="w-12 h-12 text-rose-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white mb-2">Room Unavailable</h2>
          <p className="text-xs text-pink-200/80 mb-6">{error}</p>
          <button
            onClick={() => router.push("/join")}
            className="w-full py-3.5 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-sm"
          >
            Go to Join Screen
          </button>
        </div>
      </div>
    );
  }

  if (!state) return null;

  // Waiting for second player to join
  if (state.players.length < 2) {
    const inviteUrl = typeof window !== "undefined"
      ? `${window.location.origin}/join?code=${roomCode}`
      : `https://lovematch.app/join?code=${roomCode}`;

    return (
      <div className="w-full max-w-md mx-auto px-4 sm:px-6 py-8 sm:py-16 text-center">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border-2 border-pink-500/40 shadow-2xl">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-pink-500/20 border-2 border-pink-500/40 flex items-center justify-center text-pink-400 mb-5 animate-pulse">
            <Heart className="w-8 h-8 fill-pink-500/30" />
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight mb-2">
            Waiting for Your Partner...
          </h2>
          <p className="text-xs sm:text-sm text-pink-200/80 mb-6">
            Share the code below with your partner so they can join from their phone!
          </p>

          <div className="p-4 rounded-2xl glass-card border border-pink-500/40 mb-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-pink-300 block mb-1">
              Room Code
            </span>
            <div className="text-4xl font-black text-pink-400 tracking-widest font-mono">
              {roomCode}
            </div>
            <button
              onClick={copyRoomCode}
              className="mt-2 text-xs font-semibold text-pink-300 hover:text-white inline-flex items-center gap-1.5"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? "Copied!" : "Copy Code"}</span>
            </button>
          </div>

          <div className="space-y-3 mb-2">
            <button
              onClick={() => {
                const text = encodeURIComponent(
                  `Join my LoveMatch quiz! Room Code: ${roomCode}\nTap here to play:\n${inviteUrl}`
                );
                window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
              }}
              className="w-full min-touch-target flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] font-bold text-sm transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Share via WhatsApp</span>
            </button>

            <button
              onClick={async () => {
                await navigator.clipboard.writeText(inviteUrl);
                alert("Direct invite link copied to clipboard!");
              }}
              className="w-full min-touch-target flex items-center justify-center gap-2 py-3 rounded-2xl glass-card text-pink-200 hover:text-white text-xs font-semibold"
            >
              <Copy className="w-4 h-4 text-pink-400" />
              <span>Copy Direct Invite Link</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active game play
  const currentRound = state.currentRound;
  if (!currentRound) return null;

  const isSubject = currentRound.subjectPlayerId === state.myPlayerId;
  const isGuesser = currentRound.guesserPlayerId === state.myPlayerId;

  const partnerPlayer = state.players.find(p => p.id !== state.myPlayerId);
  const myPlayer = state.players.find(p => p.id === state.myPlayerId);

  const isRevealed = currentRound.phase === "revealed" || currentRound.phase === "completed";
  const hasLocked = currentRound.hasSubmitted;
  const isLastRound = currentRound.roundNumber >= state.room.questionCount;

  return (
    <div className="w-full max-w-lg mx-auto px-4 sm:px-6 py-4 sm:py-8 flex flex-col justify-between min-h-[calc(100dvh-75px)]">
      {/* Top Status Bar */}
      <div className="w-full mb-4">
        <div className="flex items-center justify-between text-xs text-pink-300 mb-2">
          {/* Room code badge */}
          <button
            onClick={copyRoomCode}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full glass-card hover:border-pink-500/50 transition-colors"
          >
            <span className="font-mono font-bold text-pink-200">#{roomCode}</span>
            {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          </button>

          {/* Connection status */}
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`} />
            <span className="text-[11px] font-semibold">{isOnline ? "Live Sync" : "Reconnecting"}</span>
          </div>

          {/* Round Counter */}
          <div className="font-bold text-white">
            Round {currentRound.roundNumber} / {state.room.questionCount}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-pink-500/20 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-500 to-rose-400 transition-all duration-500"
            style={{
              width: `${(currentRound.roundNumber / state.room.questionCount) * 100}%`
            }}
          />
        </div>

        {/* Players Readiness Pill */}
        <div className="flex items-center justify-between gap-2 mt-3 px-3 py-1.5 rounded-2xl glass-card text-xs">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${currentRound.hasSubmitted ? "bg-emerald-400" : "bg-amber-400 animate-ping"}`} />
            <span className="font-semibold text-white">{myPlayer?.nickname || "You"}</span>
            <span className="text-pink-300/70 text-[11px]">
              {currentRound.hasSubmitted ? "(Locked)" : "(Thinking)"}
            </span>
          </div>

          <div className="text-pink-400/50 font-black">VS</div>

          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${currentRound.partnerHasSubmitted ? "bg-emerald-400" : "bg-amber-400 animate-ping"}`} />
            <span className="font-semibold text-white">{partnerPlayer?.nickname || "Partner"}</span>
            <span className="text-pink-300/70 text-[11px]">
              {currentRound.partnerHasSubmitted ? "(Locked)" : "(Thinking)"}
            </span>
          </div>
        </div>
      </div>

      {/* Center Question & Options Area */}
      <div className="w-full glass-panel rounded-3xl p-5 sm:p-7 border border-pink-500/30 shadow-2xl flex flex-col justify-between my-auto">
        {/* Role Prompt Banner */}
        <div className="mb-4">
          {isSubject ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-300 text-xs font-bold">
              <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
              <span>Your Turn — Pick YOUR Honest Answer</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Predict {partnerPlayer?.nickname}&apos;s Choice!</span>
            </div>
          )}

          {/* Question Prompt */}
          <h2 className="text-lg sm:text-xl font-black text-white mt-3 leading-snug">
            {currentRound.question.prompt}
          </h2>
        </div>

        {/* Revealed State Banner with 3D Flip & Particles */}
        {isRevealed ? (
          <div className="space-y-4 my-2">
            <CardRevealAnimation
              isMatch={Boolean(currentRound.isMatch)}
              subjectNickname={myPlayer?.nickname || "Player 1"}
              guesserNickname={partnerPlayer?.nickname || "Player 2"}
              subjectAnswer={currentRound.subjectAnswer || ""}
              guesserPrediction={currentRound.guesserPrediction || ""}
              isSubject={isSubject}
              isGuesser={isGuesser}
            />

            {/* Advance Button */}
            <button
              onClick={handleNextRound}
              disabled={isAdvancing}
              className="w-full min-touch-target flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 text-white font-extrabold text-base shadow-xl shadow-pink-500/40 transition-transform active:scale-95 disabled:opacity-50 mt-4"
            >
              {isAdvancing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : isLastRound ? (
                <>
                  <span>View Final Results</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              ) : (
                <>
                  <span>Next Question</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        ) : (
          /* Answering State */
          <div className="space-y-2.5 my-2">
            {currentRound.question.options.map((opt, idx) => {
              const isSelected = hasLocked 
                ? currentRound.myAnswer === opt 
                : selectedOption === opt;

              return (
                <InteractiveOptionCard
                  key={idx}
                  index={idx}
                  option={opt}
                  isSelected={isSelected}
                  disabled={hasLocked}
                  onSelect={(chosen) => setSelectedOption(chosen)}
                />
              );
            })}

            {/* Bottom Action / Waiting Notice */}
            <div className="pt-3">
              {hasLocked ? (
                <div className="p-3.5 rounded-2xl glass-card border border-pink-500/30 flex items-center justify-center gap-2 text-pink-300 text-xs sm:text-sm font-semibold animate-pulse">
                  <Clock className="w-4 h-4 text-pink-400" />
                  <span>
                    Answer locked! Waiting for {partnerPlayer?.nickname} to submit...
                  </span>
                </div>
              ) : (
                <button
                  onClick={handleLockIn}
                  disabled={!selectedOption || isSubmitting}
                  className="w-full min-touch-target flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 text-white font-extrabold text-base shadow-xl shadow-pink-500/40 transition-transform active:scale-95 disabled:opacity-40"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Locking in...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Lock In Answer</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Score Badge */}
      <div className="w-full flex items-center justify-between text-xs text-pink-300/80 px-2 mt-3">
        <span>Current Score: <strong className="text-pink-400 font-bold">{state.scores.totalPoints} pts</strong></span>
        <span>Matches: <strong className="text-white font-bold">{state.scores.totalMatches}</strong></span>
      </div>
    </div>
  );
}

export default function GameRoomPage(props: {
  params: Promise<{ code: string }>;
}) {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
        <span className="text-sm text-pink-200">Entering Room...</span>
      </div>
    }>
      <RoomContent {...props} />
    </Suspense>
  );
}
