import { describe, it, expect } from "vitest";
import { INITIAL_QUESTIONS, CATEGORIES, getRandomQuestions, getQuestionsByCategory } from "../lib/questions/data";

describe("Question Bank & Categories", () => {
  it("contains at least 60 questions across all categories", () => {
    expect(INITIAL_QUESTIONS.length).toBeGreaterThanOrEqual(60);
  });

  it("contains all 10 distinct categories", () => {
    expect(CATEGORIES).toHaveLength(10);
    const categoryIds = CATEGORIES.map(c => c.id);

    // Verify all 10 categories have questions
    categoryIds.forEach(catId => {
      const qs = getQuestionsByCategory(catId);
      expect(qs.length).toBeGreaterThanOrEqual(5);
    });
  });

  it("includes all 5 required seed questions", () => {
    const seed1 = INITIAL_QUESTIONS.find(q => q.prompt.includes("favourite food"));
    expect(seed1).toBeDefined();
    expect(seed1?.options).toContain("Biryani");

    const seed2 = INITIAL_QUESTIONS.find(q => q.prompt.includes("I love you"));
    expect(seed2).toBeDefined();

    const seed3 = INITIAL_QUESTIONS.find(q => q.prompt.includes("makes your partner happiest"));
    expect(seed3).toBeDefined();

    const seed4 = INITIAL_QUESTIONS.find(q => q.prompt.includes("jealous more easily"));
    expect(seed4).toBeDefined();

    const seed5 = INITIAL_QUESTIONS.find(q => q.prompt.includes("dream trip"));
    expect(seed5).toBeDefined();
  });

  it("shuffles and returns requested question count", () => {
    const sample5 = getRandomQuestions(5, "all");
    expect(sample5).toHaveLength(5);

    const sample10 = getRandomQuestions(10, "all");
    expect(sample10).toHaveLength(10);
  });
});
