import { NextRequest, NextResponse } from "next/server";
import { GameStore } from "@/lib/db/store";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; attemptId: string }> }
) {
  try {
    const { id, attemptId } = await params;
    const attempt = await GameStore.getViralQuizAttempt(id, attemptId);
    const quiz = await GameStore.getViralQuiz(id);

    if (!attempt) {
      return NextResponse.json(
        { error: "Attempt not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      attempt,
      creatorName: quiz?.creatorName || "Friend"
    });
  } catch (err: unknown) {
    console.error("Error fetching attempt:", err);
    return NextResponse.json(
      { error: "Failed to fetch attempt" },
      { status: 500 }
    );
  }
}
