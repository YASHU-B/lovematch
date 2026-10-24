import { NextRequest, NextResponse } from "next/server";
import { GameStore } from "@/lib/db/store";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;
    const roomCode = code.toUpperCase();
    const room = await GameStore.findRoom(roomCode);

    if (!room) {
      return NextResponse.json({ error: "Room not found or expired" }, { status: 404 });
    }

    const tokenHeader = req.headers.get("x-session-token");
    const tokenCookie = req.cookies.get(`lovematch_session_${roomCode}`)?.value;
    const sessionToken = tokenHeader || tokenCookie;

    if (!sessionToken) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const player = GameStore.validateSession(room, sessionToken);
    if (!player) {
      return NextResponse.json({ error: "Invalid session token" }, { status: 403 });
    }

    const state = GameStore.getAuthorizedState(room, player.id);
    return NextResponse.json({ success: true, state });
  } catch (err: unknown) {
    console.error("Sync error:", err);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
