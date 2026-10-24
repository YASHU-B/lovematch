import { NextRequest, NextResponse } from "next/server";
import { GameStore } from "@/lib/db/store";
import { sanitizeNickname } from "@/lib/tokens";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { friendName, answers } = body;

    const sanitized = sanitizeNickname(friendName || "");
    if (!sanitized.valid) {
      return NextResponse.json(
        { error: sanitized.error || "Please enter a valid nickname" },
        { status: 400 }
      );
    }

    if (!Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: "Answers list cannot be empty" },
        { status: 400 }
      );
    }

    const attempt = await GameStore.submitViralQuizAttempt({
      quizId: id,
      friendName: sanitized.nickname,
      answers
    });

    return NextResponse.json({
      success: true,
      attempt
    });
  } catch (err: unknown) {
    console.error("Error submitting quiz attempt:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to submit attempt" },
      { status: 500 }
    );
  }
}
