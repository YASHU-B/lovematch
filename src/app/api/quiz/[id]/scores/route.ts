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

    const data = await GameStore.getViralQuizLeaderboard(id, token);

    return NextResponse.json({
      success: true,
      ...data
    });
  } catch (err: unknown) {
    console.error("Error fetching leaderboard:", err);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
