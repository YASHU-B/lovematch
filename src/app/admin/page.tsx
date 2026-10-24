"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  Users, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  RotateCw, 
  Lock, 
  KeyRound, 
  ExternalLink,
  ArrowRight
} from "lucide-react";
import { soundEffects } from "@/components/AudioEffects";

interface AdminStats {
  totalQuizzesCreated: number;
  totalMembersPlayed: number;
  activePlayingNow: number;
  safeCount: number;
  warningCount: number;
  blockedCount: number;
  safeRate: number;
  recentQuizzes: {
    id: string;
    creatorName: string;
    createdAt: string;
    attemptsCount: number;
    safeCount: number;
    blockedCount: number;
  }[];
  recentAttempts: {
    id: string;
    quizId: string;
    friendName: string;
    score: number;
    total: number;
    verdict: "safe" | "warning" | "blocked";
    createdAt: string;
  }[];
}

export default function AdminDashboardPage() {
  const [passcode, setPasscode] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("admin_passcode") || "";
    }
    return "";
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchStats = useCallback(async (key: string) => {
    try {
      const res = await fetch(`/api/admin/stats?key=${encodeURIComponent(key)}`);
      const data = await res.json();
      if (res.ok && data.stats) {
        setStats(data.stats);
        setLastUpdated(new Date());
      }
    } catch {
      // Background poll failure
    }
  }, []);

  const verifyAndFetch = useCallback(async (key: string) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await fetch(`/api/admin/stats?key=${encodeURIComponent(key)}`);
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Invalid admin key");
      }
      setIsAuthenticated(true);
      setStats(data.stats);
      setLastUpdated(new Date());
      if (typeof window !== "undefined") {
        sessionStorage.setItem("admin_passcode", key);
      }
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : "Authentication failed");
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check if initial admin passcode was found in session storage
  useEffect(() => {
    if (!passcode) return;
    const timer = setTimeout(() => {
      void verifyAndFetch(passcode);
    }, 10);
    return () => clearTimeout(timer);
  }, [passcode, verifyAndFetch]);

  // Auto-refresh interval (every 10 seconds)
  useEffect(() => {
    if (!isAuthenticated || !autoRefresh || !passcode) return;
    const interval = setInterval(() => {
      void fetchStats(passcode);
    }, 10000);
    return () => clearInterval(interval);
  }, [isAuthenticated, autoRefresh, passcode, fetchStats]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;
    soundEffects.playPop();
    void verifyAndFetch(passcode.trim());
  };

  const handleManualRefresh = () => {
    soundEffects.playPop();
    void fetchStats(passcode);
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-16">
        <div className="bg-white border-3 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-[0_8px_0_#1E293B] text-center">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-yellow-300 border-2.5 border-slate-900 flex items-center justify-center text-3xl mb-4 shadow-[0_3px_0_#1E293B]">
            <Lock className="w-8 h-8 text-slate-900" />
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
            Admin Metrics Access
          </h1>
          <p className="text-xs font-bold text-slate-500 mb-6">
            Enter the admin passcode to track members played, active players, and quiz logs.
          </p>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-700 text-xs font-bold">
              {authError} (Hint: default is admin2026)
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter admin passcode"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-900 font-bold text-sm text-slate-900 focus:bg-white focus:outline-none"
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>

            <button
              type="submit"
              disabled={loading || !passcode.trim()}
              className="w-full py-3.5 rounded-2xl bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 border-2.5 border-slate-900 text-slate-900 font-black text-sm shadow-[0_4px_0_#CA8A04] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? "Checking Access..." : "Unlock Dashboard"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-3 border-slate-900 rounded-3xl p-6 shadow-[0_6px_0_#1E293B] mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">
              Admin Analytics & Member Tracker
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-300 border border-slate-900 text-[10px] font-black text-slate-900 uppercase">
              LIVE
            </span>
          </div>
          <p className="text-xs font-bold text-slate-500 mt-1">
            Real-time tracking of created tests, players, and active member engagement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-xl border border-slate-900 text-xs font-bold transition-all ${
              autoRefresh 
                ? "bg-emerald-100 text-emerald-800 border-emerald-500" 
                : "bg-slate-100 text-slate-600"
            }`}
          >
            Auto-refresh: {autoRefresh ? "ON (10s)" : "OFF"}
          </button>

          <button
            onClick={handleManualRefresh}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 text-slate-800 shadow-[0_2px_0_#1E293B] active:translate-y-0.5 active:shadow-none"
            title="Refresh now"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Members Played */}
        <div className="bg-white border-3 border-slate-900 rounded-3xl p-5 shadow-[0_6px_0_#1E293B]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
              Members Played
            </span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {stats?.totalMembersPlayed ?? 0}
          </div>
          <div className="text-[11px] font-bold text-slate-500 mt-1 flex items-center gap-1.5">
            <span className="text-emerald-600">{stats?.safeCount ?? 0} Safe</span>
            <span>•</span>
            <span className="text-rose-500">{stats?.blockedCount ?? 0} Blocked</span>
          </div>
        </div>

        {/* Currently Playing / Active */}
        <div className="bg-white border-3 border-slate-900 rounded-3xl p-5 shadow-[0_6px_0_#1E293B] relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
              Playing Now
            </span>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
          </div>
          <div className="text-3xl font-black text-emerald-600">
            {stats?.activePlayingNow ?? 0}
          </div>
          <div className="text-[11px] font-bold text-slate-500 mt-1">
            Active in last 30 minutes
          </div>
        </div>

        {/* Total Quizzes Created */}
        <div className="bg-white border-3 border-slate-900 rounded-3xl p-5 shadow-[0_6px_0_#1E293B]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
              Tests Created
            </span>
            <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-400" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {stats?.totalQuizzesCreated ?? 0}
          </div>
          <div className="text-[11px] font-bold text-slate-500 mt-1">
            Unique quizzes generated
          </div>
        </div>

        {/* Safe / Bestie Rate */}
        <div className="bg-white border-3 border-slate-900 rounded-3xl p-5 shadow-[0_6px_0_#1E293B]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
              Bestie Rate
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {stats?.safeRate ?? 0}%
          </div>
          <div className="text-[11px] font-bold text-slate-500 mt-1">
            Survived without blocking
          </div>
        </div>
      </div>

      {/* Main Content Layout: Live Activity Stream & Recent Quizzes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Members Activity Stream */}
        <div className="bg-white border-3 border-slate-900 rounded-3xl p-6 shadow-[0_6px_0_#1E293B]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-pink-500" />
              <span>Live Player Activity Stream</span>
            </h2>
            <span className="text-xs font-bold text-slate-400">
              Latest {stats?.recentAttempts.length ?? 0}
            </span>
          </div>

          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
            {!stats?.recentAttempts || stats.recentAttempts.length === 0 ? (
              <p className="text-xs font-bold text-slate-500 py-6 text-center">
                No players have completed a test yet.
              </p>
            ) : (
              stats.recentAttempts.map((att) => {
                const isSafe = att.verdict === "safe";
                const isWarning = att.verdict === "warning";
                return (
                  <div
                    key={att.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border-2 border-slate-900"
                  >
                    <div>
                      <div className="font-black text-xs text-slate-900 flex items-center gap-1.5">
                        <span>{att.friendName}</span>
                        <span className="text-slate-400 font-normal">tested on</span>
                        <Link
                          href={`/quiz/${att.quizId}/scores`}
                          className="font-mono text-sky-600 hover:underline"
                        >
                          #{att.quizId}
                        </Link>
                      </div>
                      <div className="text-[10px] font-bold text-slate-400">
                        {new Date(att.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-xs text-slate-700">
                        {att.score}/{att.total}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black border border-slate-900 ${
                          isSafe
                            ? "bg-emerald-300 text-slate-900"
                            : isWarning
                            ? "bg-yellow-300 text-slate-900"
                            : "bg-rose-400 text-white"
                        }`}
                      >
                        {isSafe ? "SAFE 💖" : isWarning ? "THIN ICE ⚠️" : "BLOCKED 🚫"}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Created Quizzes & Direct Links */}
        <div className="bg-white border-3 border-slate-900 rounded-3xl p-6 shadow-[0_6px_0_#1E293B]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-400" />
              <span>Created Quizzes Overview</span>
            </h2>
            <span className="text-xs font-bold text-slate-400">
              Latest {stats?.recentQuizzes.length ?? 0}
            </span>
          </div>

          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
            {!stats?.recentQuizzes || stats.recentQuizzes.length === 0 ? (
              <p className="text-xs font-bold text-slate-500 py-6 text-center">
                No tests created yet.
              </p>
            ) : (
              stats.recentQuizzes.map((q) => (
                <div
                  key={q.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-900 flex items-center justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-xs text-slate-900">
                        #{q.id}
                      </span>
                      <span className="font-bold text-xs text-slate-800">
                        by {q.creatorName}
                      </span>
                    </div>
                    <div className="text-[10px] font-bold text-slate-500 mt-0.5">
                      {q.attemptsCount} members played ({q.safeCount} safe, {q.blockedCount} blocked)
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/quiz/${q.id}`}
                      target="_blank"
                      className="px-2.5 py-1 rounded-xl bg-white border border-slate-900 text-[11px] font-bold text-slate-800 hover:bg-slate-100 flex items-center gap-1 shadow-[0_1.5px_0_#1E293B]"
                    >
                      <span>Take</span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </Link>

                    <Link
                      href={`/quiz/${q.id}/scores`}
                      target="_blank"
                      className="px-2.5 py-1 rounded-xl bg-yellow-300 border border-slate-900 text-[11px] font-black text-slate-900 hover:bg-yellow-200 flex items-center gap-1 shadow-[0_1.5px_0_#1E293B]"
                    >
                      <span>Scores</span>
                      <ExternalLink className="w-3 h-3 text-slate-700" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {lastUpdated && (
        <div className="text-center text-[11px] font-bold text-slate-400 mt-6">
          Last synchronized: {lastUpdated.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
