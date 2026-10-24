import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { GameStore } from "@/lib/db/store";

const SubmitSchema = z.object({
  answerText: z.string().min(1).max(200)
});

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

    const body = await req.json();
    const parsed = SubmitSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid submission answer" }, { status: 400 });
    }

    const result = await GameStore.submitAnswer({
      roomCode,
      sessionToken,
      answerText: parsed.data.answerText
    });

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, state: result.state });
  } catch (err: unknown) {
    console.error("Submit error:", err);
    return NextResponse.json({ error: "Failed to submit answer" }, { status: 500 });
  }
}
