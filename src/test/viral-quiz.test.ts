import { describe, it, expect } from "vitest";
import { GameStore } from "../lib/db/store";

describe("Don't Block Me — Viral Quiz & Leaderboard System", () => {
  it("creates a quiz, scores friend attempts accurately, and assigns safe/blocked verdicts", async () => {
    // 1. Creator sets up quiz
    const { quiz, secretToken, id } = await GameStore.createViralQuiz({
      creatorName: "Sarah",
      questions: [
        {
          id: "q1",
          text: "What is my favorite food?",
          emoji: "🍕",
          options: ["Biryani", "Pizza", "Sushi", "Salad"],
          correctAnswer: "Biryani"
        },
        {
          id: "q2",
          text: "What do I do when bored?",
          emoji: "📱",
          options: ["Reels", "Nap", "Walk", "Read"],
          correctAnswer: "Reels"
        },
        {
          id: "q3",
          text: "What if you block me?",
          emoji: "🚫",
          options: ["Block back", "Call 20x", "Cry", "Ignore"],
          correctAnswer: "Block back"
        }
      ]
    });

    expect(id).toHaveLength(6);
    expect(secretToken).toBeDefined();
    expect(quiz.creatorName).toBe("Sarah");
    expect(quiz.questions).toHaveLength(3);

    // 2. Fetch public quiz as friend (correctAnswer must NOT be leaked!)
    const publicQuiz = await GameStore.getViralQuiz(id);
    expect(publicQuiz).not.toBeNull();
    expect(publicQuiz?.creatorName).toBe("Sarah");
    expect(publicQuiz?.isCreator).toBe(false);
    expect(publicQuiz?.questions[0].correctAnswer).toBeUndefined(); // Zero leak!

    // 3. Fetch as creator with secretToken (correctAnswer is present)
    const creatorQuiz = await GameStore.getViralQuiz(id, secretToken);
    expect(creatorQuiz?.isCreator).toBe(true);
    expect(creatorQuiz?.questions[0].correctAnswer).toBe("Biryani");

    // 4. Friend 1 (Maya) scores 3/3 (100% -> SAFE)
    const attempt1 = await GameStore.submitViralQuizAttempt({
      quizId: id,
      friendName: "Maya",
      answers: [
        { questionId: "q1", selectedAnswer: "Biryani" },
        { questionId: "q2", selectedAnswer: "Reels" },
        { questionId: "q3", selectedAnswer: "Block back" }
      ]
    });

    expect(attempt1.score).toBe(3);
    expect(attempt1.total).toBe(3);
    expect(attempt1.percentage).toBe(100);
    expect(attempt1.verdict).toBe("safe");

    // 5. Friend 2 (Jake) scores 0/3 (0% -> BLOCKED)
    const attempt2 = await GameStore.submitViralQuizAttempt({
      quizId: id,
      friendName: "Jake",
      answers: [
        { questionId: "q1", selectedAnswer: "Salad" },
        { questionId: "q2", selectedAnswer: "Read" },
        { questionId: "q3", selectedAnswer: "Ignore" }
      ]
    });

    expect(attempt2.score).toBe(0);
    expect(attempt2.percentage).toBe(0);
    expect(attempt2.verdict).toBe("blocked");

    // 6. Friend 3 (Chris) scores 1/3 (~33% -> BLOCKED)
    await GameStore.submitViralQuizAttempt({
      quizId: id,
      friendName: "Chris",
      answers: [
        { questionId: "q1", selectedAnswer: "Biryani" },
        { questionId: "q2", selectedAnswer: "Nap" },
        { questionId: "q3", selectedAnswer: "Cry" }
      ]
    });

    // 7. Verify Leaderboard Rankings
    const leaderboard = await GameStore.getViralQuizLeaderboard(id);
    expect(leaderboard.totalPlayers).toBe(3);
    expect(leaderboard.safeCount).toBe(1);
    expect(leaderboard.blockedCount).toBe(2);
    expect(leaderboard.attempts[0].friendName).toBe("Maya");
    expect(leaderboard.attempts[0].score).toBe(3);
  });
});
