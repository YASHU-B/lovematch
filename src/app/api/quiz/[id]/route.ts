import { NextRequest, NextResponse } from "next/server";
import { GameStore } from "@/lib/db/store";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token") || req.headers.get("x-secret-token") || undefined;

    const quiz = await GameStore.getViralQuiz(id, token);
    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz not found or has expired" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      quiz
    });
  } catch (err: unknown) {
    console.error("Error fetching viral quiz:", err);
    return NextResponse.json(
      { error: "Failed to fetch quiz" },
      { status: 500 }
    );
  }
}
