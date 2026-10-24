import { NextRequest, NextResponse } from "next/server";
import { GameStore } from "@/lib/db/store";
import { CATEGORIES } from "@/lib/questions/data";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await context.params;
    // Find room by shareToken
    // In our rooms store, check all rooms for matching shareToken
    const room = await GameStore.findRoom(token);

    if (!room) {
      return NextResponse.json({ error: "Invitation not found or expired" }, { status: 404 });
    }

    const hostPlayer = room.players[room.hostPlayerId];
    const categoryInfo = CATEGORIES.find(c => c.id === room.categoryId);

    // Restricted public preview
    return NextResponse.json({
      success: true,
      challenge: {
        roomCode: room.code,
        hostNickname: hostPlayer?.nickname || "Your Partner",
        categoryName: categoryInfo?.name || "All Rounder",
        questionCount: room.questionCount,
        status: room.status,
        expiresAt: room.expiresAt
      }
    });
  } catch (err: unknown) {
    console.error("Challenge preview error:", err);
    return NextResponse.json({ error: "Failed to load challenge preview" }, { status: 500 });
  }
}
