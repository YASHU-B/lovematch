import { NextRequest, NextResponse } from "next/server";
import { INITIAL_QUESTIONS, Question } from "@/lib/questions/data";
import { z } from "zod";

// Admin questions store in memory / module state for dynamic editing
const questionBank: Question[] = [...INITIAL_QUESTIONS];

const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || "lovematch-admin-2026";

function isAuthorizedAdmin(req: NextRequest): boolean {
  const adminKey = req.headers.get("x-admin-key") || req.nextUrl.searchParams.get("key");
  return Boolean(adminKey && adminKey === ADMIN_SECRET);
}

const QuestionMutationSchema = z.object({
  id: z.string().optional(),
  category: z.string().min(1),
  prompt: z.string().min(5),
  options: z.array(z.string().min(1)).min(2).max(8),
  isActive: z.boolean().default(true),
  acceptedEquivalents: z.record(z.string(), z.array(z.string())).optional()
});

export async function GET(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized admin access" }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    total: questionBank.length,
    activeCount: questionBank.filter(q => q.isActive).length,
    questions: questionBank
  });
}

export async function POST(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized admin access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = QuestionMutationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid question data", details: parsed.error.issues }, { status: 400 });
    }

    const newQuestion: Question = {
      id: parsed.data.id || `custom-${Date.now()}`,
      category: parsed.data.category,
      prompt: parsed.data.prompt,
      options: parsed.data.options,
      isActive: parsed.data.isActive,
      acceptedEquivalents: parsed.data.acceptedEquivalents
    };

    questionBank.unshift(newQuestion);
    return NextResponse.json({ success: true, question: newQuestion });
  } catch (err: unknown) {
    console.error("Admin POST question error:", err);
    return NextResponse.json({ error: "Failed to add question" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized admin access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = QuestionMutationSchema.safeParse(body);
    if (!parsed.success || !parsed.data.id) {
      return NextResponse.json({ error: "Invalid question data or missing ID" }, { status: 400 });
    }

    const index = questionBank.findIndex(q => q.id === parsed.data.id);
    if (index === -1) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    questionBank[index] = {
      ...questionBank[index],
      ...parsed.data
    };

    return NextResponse.json({ success: true, question: questionBank[index] });
  } catch (err: unknown) {
    console.error("Admin PUT question error:", err);
    return NextResponse.json({ error: "Failed to update question" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized admin access" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Question ID required" }, { status: 400 });
  }

  const index = questionBank.findIndex(q => q.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  // Soft delete / toggle active
  questionBank[index].isActive = false;
  return NextResponse.json({ success: true, message: `Question ${id} deactivated` });
}
