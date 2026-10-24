import { NextRequest, NextResponse } from "next/server";
import { GameStore } from "@/lib/db/store";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;
    const roomCode = code.toUpperCase();

    const tokenHeader = req.headers.get("x-session-token");
    const tokenCookie = req.cookies.get(`lovematch_session_${roomCode}`)?.value;
    const sessionToken = tokenHeader || tokenCookie;

    if (!sessionToken) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const result = await GameStore.nextRound({
      roomCode,
      sessionToken
    });

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, state: result.state });
  } catch (err: unknown) {
    console.error("Next round error:", err);
    return NextResponse.json({ error: "Failed to advance round" }, { status: 500 });
  }
}
