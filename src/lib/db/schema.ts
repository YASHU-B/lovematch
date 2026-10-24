// Don't Block Me / YouTest Quiz Schemas

export interface ViralQuizQuestion {
  id: string;
  text: string;
  emoji: string;
  options: string[];
  correctAnswer: string;
}

export interface ViralQuiz {
  id: string;
  creatorName: string;
  secretToken: string;
  questions: ViralQuizQuestion[];
  createdAt: string;
  expiresAt: string;
}

export interface ViralQuizAnswerAttempt {
  questionId: string;
  questionText: string;
  selectedAnswer: string;
  correctAnswer: string;
  isMatch: boolean;
}

export interface ViralQuizAttempt {
  id: string;
  quizId: string;
  friendName: string;
  answers: ViralQuizAnswerAttempt[];
  score: number;
  total: number;
  percentage: number;
  verdict: "safe" | "warning" | "blocked";
  createdAt: string;
}
