import { NextRequest, NextResponse } from "next/server";
import { GameStore } from "@/lib/db/store";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await context.params;
    const results = await GameStore.getFinalResults(roomId);

    if (!results) {
      return NextResponse.json({ error: "Game results not found or room expired" }, { status: 404 });
    }

    return NextResponse.json({ success: true, results });
  } catch (err: unknown) {
    console.error("Fetch results error:", err);
    return NextResponse.json({ error: "Failed to retrieve game results" }, { status: 500 });
  }
}
