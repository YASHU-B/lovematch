import { NextRequest, NextResponse } from "next/server";
import { GameStore } from "@/lib/db/store";

export async function GET(req: NextRequest) {
  try {
    const adminKey = req.headers.get("x-admin-key") || req.nextUrl.searchParams.get("key");
    const expectedKey = process.env.ADMIN_SECRET_KEY || "admin2026";

    if (adminKey !== expectedKey) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const stats = await GameStore.getAdminStats();

    return NextResponse.json({
      success: true,
      stats
    });
  } catch (err: unknown) {
    console.error("Admin stats error:", err);
    return NextResponse.json(
      { error: "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
}
