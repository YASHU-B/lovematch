import type { Metadata } from "next";
import { GameStore } from "@/lib/db/store";

export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const quiz = await GameStore.getViralQuiz(id);
    const name = quiz?.creatorName?.trim() || "your friend";

    return {
      title: `How well do you know ${name}? - Don't Block Me`,
      description: `Dare for you! Can you answer 10 questions about ${name} without getting BLOCKED? Take ${name}'s friendship test now! 🚫`,
      openGraph: {
        title: `How well do you know ${name}? - Don't Block Me`,
        description: `Can you score 10/10 on ${name}'s quiz without getting BLOCKED? Prove you're a real friend! 💖🚫`,
        siteName: "Don't Block Me",
        type: "website"
      },
      twitter: {
        card: "summary_large_image",
        title: `How well do you know ${name}? - Don't Block Me`,
        description: `Can you score 10/10 on ${name}'s quiz without getting BLOCKED? Prove you're a real friend! 💖🚫`
      }
    };
  } catch {
    return {
      title: "How well do you know your friend? - Don't Block Me",
      description: "Answer 10 questions to prove you're a real friend and stay off the block list! 🚫"
    };
  }
}

export default function QuizLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
