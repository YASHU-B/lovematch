import { NextRequest, NextResponse } from "next/server";
import { GameStore } from "@/lib/db/store";
import { sanitizeNickname } from "@/lib/tokens";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { creatorName, questions } = body;

    const sanitized = sanitizeNickname(creatorName || "");
    if (!sanitized.valid) {
      return NextResponse.json(
        { error: sanitized.error || "Please enter a valid creator name (2-25 characters)" },
        { status: 400 }
      );
    }

    if (!Array.isArray(questions) || questions.length < 3) {
      return NextResponse.json(
        { error: "Quiz must have at least 3 questions with answers selected" },
        { status: 400 }
      );
    }

    // Verify all questions have text, options, and a chosen answer
    for (const q of questions) {
      if (!q.text || !Array.isArray(q.options) || !q.correctAnswer) {
        return NextResponse.json(
          { error: "Each question must have options and an answer chosen" },
          { status: 400 }
        );
      }
    }

    const result = await GameStore.createViralQuiz({
      creatorName: sanitized.nickname,
      questions
    });

    return NextResponse.json({
      success: true,
      quizId: result.id,
      secretToken: result.secretToken,
      creatorName: sanitized.nickname,
      questionCount: questions.length
    });
  } catch (err: unknown) {
    console.error("Error creating viral quiz:", err);
    return NextResponse.json(
      { error: "Failed to create quiz" },
      { status: 500 }
    );
  }
}
