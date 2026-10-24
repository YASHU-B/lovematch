import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { GameStore } from "@/lib/db/store";
import { sanitizeNickname } from "@/lib/tokens";

const CreateRoomSchema = z.object({
  nickname: z.string().min(2).max(25),
  categoryId: z.string().default("all"),
  questionCount: z.union([z.literal(5), z.literal(10)]).default(5)
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateRoomSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid parameters", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { valid, nickname, error } = sanitizeNickname(parsed.data.nickname);
    if (!valid) {
      return NextResponse.json({ error: error || "Invalid nickname" }, { status: 400 });
    }

    const { room, hostPlayer, sessionToken } = await GameStore.createRoom({
      nickname,
      categoryId: parsed.data.categoryId,
      questionCount: parsed.data.questionCount
    });

    const response = NextResponse.json({
      success: true,
      roomCode: room.code,
      roomId: room.id,
      shareToken: room.shareToken,
      player: {
        id: hostPlayer.id,
        nickname: hostPlayer.nickname,
        role: hostPlayer.role
      },
      sessionToken
    });

    // Set secure session cookie
    response.cookies.set(`lovematch_session_${room.code}`, sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 86400, // 24 hours
      path: "/"
    });

    return response;
  } catch (err: unknown) {
    console.error("Create room error:", err);
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 });
  }
}
