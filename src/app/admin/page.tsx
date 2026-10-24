"use client";

import React, { useState } from "react";
import { Question, CATEGORIES } from "@/lib/questions/data";
import { 
  Lock, 
  Plus, 
  Trash2, 
  Download, 
  AlertCircle, 
  Loader2, 
  Search
} from "lucide-react";

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // New question form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPrompt, setNewPrompt] = useState("");
  const [newCategory, setNewCategory] = useState(CATEGORIES[0].id);
  const [newOptionsText, setNewOptionsText] = useState("");
  const [savingQuestion, setSavingQuestion] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/questions`, {
        headers: { "x-admin-key": adminKey.trim() }
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Authentication failed");
      }

      setQuestions(data.questions);
      setIsAuthenticated(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to authenticate");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    const optionsArray = newOptionsText
      .split("\n")
      .map(s => s.trim())
      .filter(Boolean);

    if (optionsArray.length < 2) {
      setError("Please provide at least 2 answer options (one per line).");
      return;
    }

    setSavingQuestion(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey.trim()
        },
        body: JSON.stringify({
          category: newCategory,
          prompt: newPrompt.trim(),
          options: optionsArray,
          isActive: true
        })
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to create question");
      }

      setQuestions([data.question, ...questions]);
      setShowAddModal(false);
      setNewPrompt("");
      setNewOptionsText("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error creating question");
    } finally {
      setSavingQuestion(false);
    }
  };

  const handleDeactivate = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/questions?id=${id}`, {
        method: "DELETE",
        headers: { "x-admin-key": adminKey.trim() }
      });

      if (!res.ok) throw new Error("Failed to deactivate");

      setQuestions(questions.map(q => q.id === id ? { ...q, isActive: false } : q));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to deactivate");
    }
  };

  const exportQuestionsJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(questions, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `lovematch_questions_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredQuestions = questions.filter(q => {
    const matchesCategory = selectedCategory === "all" || q.category === selectedCategory;
    const matchesSearch = !searchQuery || q.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {!isAuthenticated ? (
        /* Login Screen */
        <div className="max-w-md mx-auto glass-panel rounded-3xl p-8 border border-pink-500/30 shadow-2xl text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mb-2">
            Admin Dashboard
          </h1>
          <p className="text-xs text-pink-200/80 mb-6">
            Enter the admin secret key to manage question banks, categories, and review stats.
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              required
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Admin Secret Key"
              className="w-full px-4 py-3.5 rounded-2xl glass-card border border-pink-500/30 text-white text-sm focus:border-pink-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full min-touch-target flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 text-white font-extrabold text-sm shadow-xl shadow-pink-500/35 transition-transform active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Access Dashboard</span>}
            </button>
          </form>
          <div className="mt-4 text-[11px] text-pink-300/60">
            Default local key: <code className="text-pink-300">lovematch-admin-2026</code>
          </div>
        </div>
      ) : (
        /* Authenticated Admin Management */
        <div className="space-y-6">
          {/* Header Stats */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel rounded-3xl p-6 border border-pink-500/30">
            <div>
              <h1 className="text-2xl font-black text-white">Question Management</h1>
              <p className="text-xs text-pink-200/80 mt-0.5">
                Total: <strong className="text-white">{questions.length}</strong> questions | Active: <strong className="text-emerald-400">{questions.filter(q => q.isActive).length}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold transition-all shadow-md shadow-pink-500/30"
              >
                <Plus className="w-4 h-4" />
                <span>Add Question</span>
              </button>
              <button
                onClick={exportQuestionsJSON}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl glass-card text-pink-200 hover:text-white text-xs font-semibold"
              >
                <Download className="w-4 h-4 text-pink-400" />
                <span className="hidden xs:inline">Export</span>
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search question prompts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl glass-card border border-pink-500/20 text-white text-xs placeholder:text-pink-300/40 focus:outline-none focus:border-pink-500"
              />
              <Search className="w-4 h-4 text-pink-400 absolute left-3 top-3" />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2.5 rounded-xl glass-card border border-pink-500/20 text-xs text-white bg-[#25112F]"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Questions List */}
          <div className="space-y-3">
            {filteredQuestions.map((q) => (
              <div
                key={q.id}
                className={`p-4 rounded-2xl border transition-all ${
                  q.isActive
                    ? "glass-card border-pink-500/20"
                    : "glass-card border-rose-500/20 opacity-50"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300">
                        {q.category}
                      </span>
                      <span className="text-[10px] text-pink-300/60 font-mono">ID: {q.id}</span>
                      {!q.isActive && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300">
                          Inactive
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-white mb-2">{q.prompt}</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {q.options.map((opt, i) => (
                        <span key={i} className="text-[11px] px-2 py-1 rounded-lg bg-pink-500/10 text-pink-200 border border-pink-500/15">
                          {opt}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {q.isActive && (
                      <button
                        onClick={() => handleDeactivate(q.id)}
                        title="Deactivate Question"
                        className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Question Modal */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-lg glass-panel rounded-3xl p-6 border-2 border-pink-500/40 shadow-2xl">
                <h2 className="text-xl font-bold text-white mb-4">Add New Question</h2>
                <form onSubmit={handleCreateQuestion} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-pink-300 uppercase mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl glass-card text-xs text-white bg-[#25112F]"
                    >
                      {CATEGORIES.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-pink-300 uppercase mb-1">Prompt</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. What is your partner's dream weekend getaway?"
                      value={newPrompt}
                      onChange={(e) => setNewPrompt(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl glass-card text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-pink-300 uppercase mb-1">
                      Options (1 option per line)
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Mountain Cabin&#10;Beach Resort&#10;Cozy Staycation&#10;Road Trip"
                      value={newOptionsText}
                      onChange={(e) => setNewOptionsText(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl glass-card text-xs text-white font-sans"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 rounded-xl text-xs text-pink-200 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingQuestion}
                      className="px-5 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs"
                    >
                      {savingQuestion ? "Saving..." : "Save Question"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
