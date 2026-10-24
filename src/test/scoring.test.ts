import { describe, it, expect } from "vitest";
import { 
  normalizeAnswer, 
  isPredictionMatch, 
  evaluateRound, 
  calculateGameResults,
  getSyncScoreTitle 
} from "../lib/scoring";

describe("Scoring Engine", () => {
  it("normalizes answers properly with trimming and lowercasing", () => {
    expect(normalizeAnswer("  Biryani  ")).toBe("biryani");
    expect(normalizeAnswer("PIZZA & PASTA")).toBe("pizza & pasta");
    expect(normalizeAnswer("Multiple   Spaces   Here")).toBe("multiple spaces here");
    expect(normalizeAnswer("")).toBe("");
  });

  it("evaluates exact match regardless of case and surrounding whitespace", () => {
    expect(isPredictionMatch("Biryani", "biryani")).toBe(true);
    expect(isPredictionMatch("  Quality Time  ", "quality time")).toBe(true);
    expect(isPredictionMatch("Sushi", "Pizza")).toBe(false);
  });

  it("handles accepted equivalents correctly", () => {
    const equivalents = {
      "Biryani": ["hyderabadi biryani", "chicken biryani"],
      "Quality Time": ["cuddles", "deep talks"]
    };

    expect(isPredictionMatch("Biryani", "Hyderabadi Biryani", equivalents)).toBe(true);
    expect(isPredictionMatch("chicken biryani", "biryani", equivalents)).toBe(true);
    expect(isPredictionMatch("Biryani", "Sushi", equivalents)).toBe(false);
  });

  it("scores 10 points for a match and 0 points for a mismatch", () => {
    const matchRound = evaluateRound({
      roundNumber: 1,
      questionId: "q1",
      questionPrompt: "What is your partner's favourite food?",
      subjectPlayerId: "p1",
      guesserPlayerId: "p2",
      subjectNickname: "Maya",
      guesserNickname: "Rohan",
      subjectAnswer: "Biryani",
      guesserPrediction: "Biryani"
    });

    expect(matchRound.isMatch).toBe(true);
    expect(matchRound.pointsAwarded).toBe(10);

    const mismatchRound = evaluateRound({
      roundNumber: 2,
      questionId: "q2",
      questionPrompt: "Who said I love you first?",
      subjectPlayerId: "p2",
      guesserPlayerId: "p1",
      subjectNickname: "Rohan",
      guesserNickname: "Maya",
      subjectAnswer: "Me",
      guesserPrediction: "My partner"
    });

    expect(mismatchRound.isMatch).toBe(false);
    expect(mismatchRound.pointsAwarded).toBe(0);
  });

  it("assigns appropriate title ranks according to score brackets", () => {
    expect(getSyncScoreTitle(100).title).toBe("Mind Readers");
    expect(getSyncScoreTitle(90).title).toBe("Mind Readers");
    expect(getSyncScoreTitle(80).title).toBe("Perfectly in Sync");
    expect(getSyncScoreTitle(70).title).toBe("Perfectly in Sync");
    expect(getSyncScoreTitle(60).title).toBe("Still Discovering");
    expect(getSyncScoreTitle(40).title).toBe("Still Discovering");
    expect(getSyncScoreTitle(20).title).toBe("Plot Twist!");
    expect(getSyncScoreTitle(0).title).toBe("Plot Twist!");
  });

  it("handles zero scored rounds safely without division by zero", () => {
    const result = calculateGameResults(
      "room-123",
      5,
      [],
      { id: "p1", nickname: "Maya" },
      { id: "p2", nickname: "Rohan" }
    );

    expect(result.totalScoredRounds).toBe(0);
    expect(result.loveSyncScore).toBe(0);
    expect(result.totalPoints).toBe(0);
    expect(result.resultTitle).toBe("Plot Twist!");
  });

  it("calculates accurate game totals for a 5-round quiz", () => {
    const rounds = [
      evaluateRound({
        roundNumber: 1,
        questionId: "q1",
        questionPrompt: "Q1",
        subjectPlayerId: "p1",
        guesserPlayerId: "p2",
        subjectNickname: "Maya",
        guesserNickname: "Rohan",
        subjectAnswer: "A",
        guesserPrediction: "A"
      }),
      evaluateRound({
        roundNumber: 2,
        questionId: "q2",
        questionPrompt: "Q2",
        subjectPlayerId: "p2",
        guesserPlayerId: "p1",
        subjectNickname: "Rohan",
        guesserNickname: "Maya",
        subjectAnswer: "B",
        guesserPrediction: "B"
      }),
      evaluateRound({
        roundNumber: 3,
        questionId: "q3",
        questionPrompt: "Q3",
        subjectPlayerId: "p1",
        guesserPlayerId: "p2",
        subjectNickname: "Maya",
        guesserNickname: "Rohan",
        subjectAnswer: "C",
        guesserPrediction: "C"
      }),
      evaluateRound({
        roundNumber: 4,
        questionId: "q4",
        questionPrompt: "Q4",
        subjectPlayerId: "p2",
        guesserPlayerId: "p1",
        subjectNickname: "Rohan",
        guesserNickname: "Maya",
        subjectAnswer: "D",
        guesserPrediction: "D"
      }),
      evaluateRound({
        roundNumber: 5,
        questionId: "q5",
        questionPrompt: "Q5",
        subjectPlayerId: "p1",
        guesserPlayerId: "p2",
        subjectNickname: "Maya",
        guesserNickname: "Rohan",
        subjectAnswer: "E",
        guesserPrediction: "F" // mismatch
      })
    ];

    const result = calculateGameResults(
      "room-123",
      5,
      rounds,
      { id: "p1", nickname: "Maya" },
      { id: "p2", nickname: "Rohan" }
    );

    expect(result.totalMatches).toBe(4);
    expect(result.totalScoredRounds).toBe(5);
    expect(result.totalPoints).toBe(40);
    expect(result.maxPossiblePoints).toBe(50);
    expect(result.loveSyncScore).toBe(80);
    expect(result.resultTitle).toBe("Perfectly in Sync");
  });
});
