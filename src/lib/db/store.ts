import { 
  ViralQuiz, 
  ViralQuizAttempt, 
  ViralQuizQuestion 
} from "./schema";
import { generateRoomCode, generateSessionToken } from "../tokens";
import { randomUUID } from "crypto";
import { getSupabaseAdmin } from "./client";

// Global persistent in-memory maps for dev and testing
declare global {
  var __lovematch_viral_quizzes: Map<string, ViralQuiz> | undefined;
  var __lovematch_viral_attempts: Map<string, ViralQuizAttempt[]> | undefined;
}

const viralQuizzesStore: Map<string, ViralQuiz> = 
  globalThis.__lovematch_viral_quizzes || new Map<string, ViralQuiz>();
const viralAttemptsStore: Map<string, ViralQuizAttempt[]> = 
  globalThis.__lovematch_viral_attempts || new Map<string, ViralQuizAttempt[]>();

if (process.env.NODE_ENV !== "production") {
  globalThis.__lovematch_viral_quizzes = viralQuizzesStore;
  globalThis.__lovematch_viral_attempts = viralAttemptsStore;
}

export { type ViralQuiz, type ViralQuizAttempt, type ViralQuizQuestion };

export class GameStore {
  /**
   * Creates a viral Don't Block Me quiz with creator's answer key.
   */
  static async createViralQuiz(params: {
    creatorName: string;
    questions: {
      id: string;
      text: string;
      emoji: string;
      options: string[];
      correctAnswer: string;
    }[];
  }): Promise<{ quiz: ViralQuiz; secretToken: string; id: string }> {
    const id = generateRoomCode(6);
    const secretToken = generateSessionToken();

    const quiz: ViralQuiz = {
      id,
      creatorName: params.creatorName.trim(),
      secretToken,
      questions: params.questions,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
    };

    // Store in-memory
    viralQuizzesStore.set(id, quiz);

    // Persist to Supabase if available
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        await supabase.from("viral_quizzes").insert({
          id,
          creator_name: quiz.creatorName,
          secret_token: quiz.secretToken,
          questions: quiz.questions,
          created_at: quiz.createdAt,
          expires_at: quiz.expiresAt
        });
      } catch (err) {
        console.error("Supabase insert viral_quizzes error:", err);
      }
    }

    return { quiz, secretToken, id };
  }

  /**
   * Retrieves a viral quiz. If secretToken does not match, correctAnswer is stripped for zero-leak privacy!
   */
  static async getViralQuiz(
    quizId: string,
    secretToken?: string
  ): Promise<{
    id: string;
    creatorName: string;
    questions: { id: string; text: string; emoji: string; options: string[]; correctAnswer?: string }[];
    isCreator: boolean;
    expiresAt: string;
  } | null> {
    const cleanId = quizId.toUpperCase();
    let quiz = viralQuizzesStore.get(cleanId);

    if (!quiz) {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          const { data } = await supabase
            .from("viral_quizzes")
            .select("*")
            .eq("id", cleanId)
            .maybeSingle();

          if (data) {
            quiz = {
              id: data.id,
              creatorName: data.creator_name,
              secretToken: data.secret_token,
              questions: data.questions,
              createdAt: data.created_at,
              expiresAt: data.expires_at
            };
            viralQuizzesStore.set(cleanId, quiz);
          }
        } catch (err) {
          console.error("Supabase fetch viral_quizzes error:", err);
        }
      }
    }

    if (!quiz) return null;

    const isCreator = Boolean(secretToken && quiz.secretToken === secretToken);

    return {
      id: quiz.id,
      creatorName: quiz.creatorName,
      isCreator,
      expiresAt: quiz.expiresAt,
      questions: quiz.questions.map(q => ({
        id: q.id,
        text: q.text,
        emoji: q.emoji,
        options: q.options,
        ...(isCreator ? { correctAnswer: q.correctAnswer } : {})
      }))
    };
  }

  /**
   * Submits a friend's attempt on a viral quiz, evaluates answers, and assigns the verdict.
   */
  static async submitViralQuizAttempt(params: {
    quizId: string;
    friendName: string;
    answers: { questionId: string; selectedAnswer: string }[];
  }): Promise<ViralQuizAttempt> {
    const cleanId = params.quizId.toUpperCase();
    let quiz = viralQuizzesStore.get(cleanId);

    if (!quiz) {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        const { data } = await supabase
          .from("viral_quizzes")
          .select("*")
          .eq("id", cleanId)
          .maybeSingle();

        if (data) {
          quiz = {
            id: data.id,
            creatorName: data.creator_name,
            secretToken: data.secret_token,
            questions: data.questions,
            createdAt: data.created_at,
            expiresAt: data.expires_at
          };
          viralQuizzesStore.set(cleanId, quiz);
        }
      }
    }

    if (!quiz) {
      throw new Error("Quiz not found or expired");
    }

    const questionMap = new Map(quiz.questions.map(q => [q.id, q]));
    let score = 0;

    const evaluatedAnswers = params.answers.map(ans => {
      const q = questionMap.get(ans.questionId);
      const isMatch = Boolean(q && q.correctAnswer.trim().toLowerCase() === ans.selectedAnswer.trim().toLowerCase());
      if (isMatch) score += 1;

      return {
        questionId: ans.questionId,
        questionText: q?.text || "",
        selectedAnswer: ans.selectedAnswer,
        correctAnswer: q?.correctAnswer || "",
        isMatch
      };
    });

    const total = quiz.questions.length;
    const percentage = Math.round((score / (total || 1)) * 100);

    let verdict: "safe" | "warning" | "blocked" = "blocked";
    if (percentage >= 70) {
      verdict = "safe";
    } else if (percentage >= 40) {
      verdict = "warning";
    } else {
      verdict = "blocked";
    }

    const attempt: ViralQuizAttempt = {
      id: randomUUID(),
      quizId: quiz.id,
      friendName: params.friendName.trim(),
      answers: evaluatedAnswers,
      score,
      total,
      percentage,
      verdict,
      createdAt: new Date().toISOString()
    };

    const existingAttempts = viralAttemptsStore.get(quiz.id) || [];
    existingAttempts.push(attempt);
    viralAttemptsStore.set(quiz.id, existingAttempts);

    // Persist to Supabase
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        await supabase.from("viral_quiz_attempts").insert({
          id: attempt.id,
          quiz_id: attempt.quizId,
          friend_name: attempt.friendName,
          answers: attempt.answers,
          score: attempt.score,
          total: attempt.total,
          percentage: attempt.percentage,
          verdict: attempt.verdict,
          created_at: attempt.createdAt
        });
      } catch (err) {
        console.error("Supabase insert viral_quiz_attempts error:", err);
      }
    }

    return attempt;
  }

  /**
   * Retrieves the creator's scoreboard and public leaderboard.
   */
  static async getViralQuizLeaderboard(
    quizId: string,
    secretToken?: string
  ): Promise<{
    quizId: string;
    creatorName: string;
    isCreator: boolean;
    quiz: ViralQuiz | null;
    attempts: ViralQuizAttempt[];
    totalPlayers: number;
    safeCount: number;
    blockedCount: number;
  }> {
    const cleanId = quizId.toUpperCase();
    let quiz = viralQuizzesStore.get(cleanId) || null;
    let attempts = [...(viralAttemptsStore.get(cleanId) || [])];

    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        if (!quiz) {
          const { data: quizData } = await supabase
            .from("viral_quizzes")
            .select("*")
            .eq("id", cleanId)
            .maybeSingle();

          if (quizData) {
            quiz = {
              id: quizData.id,
              creatorName: quizData.creator_name,
              secretToken: quizData.secret_token,
              questions: quizData.questions,
              createdAt: quizData.created_at,
              expiresAt: quizData.expires_at
            };
            viralQuizzesStore.set(cleanId, quiz);
          }
        }

        const { data: dbAttempts } = await supabase
          .from("viral_quiz_attempts")
          .select("*")
          .eq("quiz_id", cleanId)
          .order("score", { ascending: false })
          .order("created_at", { ascending: true });

        if (dbAttempts && dbAttempts.length > 0) {
          attempts = dbAttempts.map(d => ({
            id: d.id,
            quizId: d.quiz_id,
            friendName: d.friend_name,
            answers: d.answers,
            score: d.score,
            total: d.total,
            percentage: d.percentage,
            verdict: d.verdict,
            createdAt: d.created_at
          }));
          viralAttemptsStore.set(cleanId, attempts);
        }
      } catch (err) {
        console.error("Supabase fetch leaderboard error:", err);
      }
    }

    // Sort by score descending, then by creation date ascending
    attempts.sort((a, b) => b.score - a.score || new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    const safeCount = attempts.filter(a => a.verdict === "safe").length;
    const blockedCount = attempts.filter(a => a.verdict === "blocked").length;
    const isCreator = Boolean(secretToken && quiz?.secretToken === secretToken);

    return {
      quizId: cleanId,
      creatorName: quiz?.creatorName || "Friend",
      isCreator,
      quiz: isCreator ? quiz : null,
      attempts: attempts.map(att => ({
        id: att.id,
        quizId: att.quizId,
        friendName: att.friendName,
        score: att.score,
        total: att.total,
        percentage: att.percentage,
        verdict: att.verdict,
        createdAt: att.createdAt,
        answers: isCreator ? att.answers : []
      })),
      totalPlayers: attempts.length,
      safeCount,
      blockedCount
    };
  }

  /**
   * Retrieves a single attempt by ID.
   */
  static async getViralQuizAttempt(quizId: string, attemptId: string): Promise<ViralQuizAttempt | null> {
    const cleanId = quizId.toUpperCase();
    const attempts = viralAttemptsStore.get(cleanId) || [];
    const found = attempts.find(a => a.id === attemptId);
    if (found) return found;

    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data } = await supabase
          .from("viral_quiz_attempts")
          .select("*")
          .eq("id", attemptId)
          .maybeSingle();

        if (data) {
          const attempt: ViralQuizAttempt = {
            id: data.id,
            quizId: data.quiz_id,
            friendName: data.friend_name,
            answers: data.answers,
            score: data.score,
            total: data.total,
            percentage: data.percentage,
            verdict: data.verdict,
            createdAt: data.created_at
          };
          return attempt;
        }
      } catch (err) {
        console.error("Supabase fetch attempt error:", err);
      }
    }

    return null;
  }

  /**
   * Retrieves administrative global metrics: total members played, currently playing/recent, total quizzes created, and activity logs.
   */
  static async getAdminStats(): Promise<{
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
  }> {
    let quizzes: ViralQuiz[] = Array.from(viralQuizzesStore.values());
    let attempts: ViralQuizAttempt[] = Array.from(viralAttemptsStore.values()).flat();

    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data: dbQuizzes } = await supabase
          .from("viral_quizzes")
          .select("id, creator_name, secret_token, questions, created_at, expires_at")
          .order("created_at", { ascending: false })
          .limit(100);

        if (dbQuizzes && dbQuizzes.length > 0) {
          quizzes = dbQuizzes.map(q => ({
            id: q.id,
            creatorName: q.creator_name,
            secretToken: q.secret_token,
            questions: q.questions,
            createdAt: q.created_at,
            expiresAt: q.expires_at
          }));
        }

        const { data: dbAttempts } = await supabase
          .from("viral_quiz_attempts")
          .select("id, quiz_id, friend_name, answers, score, total, percentage, verdict, created_at")
          .order("created_at", { ascending: false })
          .limit(200);

        if (dbAttempts && dbAttempts.length > 0) {
          attempts = dbAttempts.map(a => ({
            id: a.id,
            quizId: a.quiz_id,
            friendName: a.friend_name,
            answers: a.answers,
            score: a.score,
            total: a.total,
            percentage: a.percentage,
            verdict: a.verdict,
            createdAt: a.created_at
          }));
        }
      } catch (err) {
        console.error("Supabase getAdminStats error:", err);
      }
    }

    const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000;
    const activeRecentAttempts = attempts.filter(
      a => new Date(a.createdAt).getTime() > thirtyMinutesAgo
    ).length;
    const activeRecentQuizzes = quizzes.filter(
      q => new Date(q.createdAt).getTime() > thirtyMinutesAgo
    ).length;

    // Active playing count (recent attempts + active creator setups)
    const activePlayingNow = Math.max(activeRecentAttempts + activeRecentQuizzes, attempts.length > 0 ? 1 : 0);

    const safeCount = attempts.filter(a => a.verdict === "safe").length;
    const warningCount = attempts.filter(a => a.verdict === "warning").length;
    const blockedCount = attempts.filter(a => a.verdict === "blocked").length;
    const totalMembersPlayed = attempts.length;
    const safeRate = totalMembersPlayed > 0 ? Math.round((safeCount / totalMembersPlayed) * 100) : 0;

    // Build map of attempts per quiz
    const attemptsByQuiz = new Map<string, ViralQuizAttempt[]>();
    for (const att of attempts) {
      const list = attemptsByQuiz.get(att.quizId) || [];
      list.push(att);
      attemptsByQuiz.set(att.quizId, list);
    }

    const recentQuizzes = quizzes.slice(0, 15).map(q => {
      const quizAttempts = attemptsByQuiz.get(q.id) || [];
      return {
        id: q.id,
        creatorName: q.creatorName,
        createdAt: q.createdAt,
        attemptsCount: quizAttempts.length,
        safeCount: quizAttempts.filter(a => a.verdict === "safe").length,
        blockedCount: quizAttempts.filter(a => a.verdict === "blocked").length
      };
    });

    const recentAttempts = attempts.slice(0, 20).map(a => ({
      id: a.id,
      quizId: a.quizId,
      friendName: a.friendName,
      score: a.score,
      total: a.total,
      verdict: a.verdict,
      createdAt: a.createdAt
    }));

    return {
      totalQuizzesCreated: quizzes.length,
      totalMembersPlayed,
      activePlayingNow,
      safeCount,
      warningCount,
      blockedCount,
      safeRate,
      recentQuizzes,
      recentAttempts
    };
  }
}
