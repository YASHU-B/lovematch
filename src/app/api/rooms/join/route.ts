import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { GameStore } from "@/lib/db/store";
import { sanitizeNickname, extractRoomCode } from "@/lib/tokens";

const JoinRoomSchema = z.object({
  roomCode: z.string().min(4).max(10),
  nickname: z.string().min(2).max(25)
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawCode = typeof body?.roomCode === "string" ? body.roomCode : "";
    const cleanRoomCode = extractRoomCode(rawCode);

    const parsed = JoinRoomSchema.safeParse({
      roomCode: cleanRoomCode,
      nickname: body?.nickname
    });

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

    const result = await GameStore.joinRoom({
      roomCode: parsed.data.roomCode.trim(),
      nickname
    });

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const { room, guestPlayer, sessionToken } = result;

    const response = NextResponse.json({
      success: true,
      roomCode: room.code,
      roomId: room.id,
      player: {
        id: guestPlayer.id,
        nickname: guestPlayer.nickname,
        role: guestPlayer.role
      },
      sessionToken
    });

    response.cookies.set(`lovematch_session_${room.code}`, sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 86400,
      path: "/"
    });

    return response;
  } catch (err: unknown) {
    console.error("Join room error:", err);
    return NextResponse.json({ error: "Failed to join room" }, { status: 500 });
  }
}
