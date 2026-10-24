export interface RoundScoringInput {
  roundNumber: number;
  questionId: string;
  questionPrompt: string;
  subjectPlayerId: string;
  guesserPlayerId: string;
  subjectNickname: string;
  guesserNickname: string;
  subjectAnswer: string;
  guesserPrediction: string;
  acceptedEquivalents?: Record<string, string[]>;
}

export interface RoundScoredResult {
  roundNumber: number;
  questionId: string;
  questionPrompt: string;
  subjectPlayerId: string;
  guesserPlayerId: string;
  subjectNickname: string;
  guesserNickname: string;
  subjectAnswer: string;
  guesserPrediction: string;
  isMatch: boolean;
  pointsAwarded: number;
}

export interface PlayerScoreSummary {
  playerId: string;
  nickname: string;
  correctPredictions: number;
  totalPredictions: number;
  predictionAccuracy: number; // 0-100%
}

export interface FinalGameScoreResult {
  roomId: string;
  totalQuestions: number;
  totalScoredRounds: number;
  totalMatches: number;
  totalPoints: number;
  maxPossiblePoints: number;
  loveSyncScore: number; // 0-100 percentage
  resultTitle: string;
  resultDescription: string;
  playerScores: Record<string, PlayerScoreSummary>;
  rounds: RoundScoredResult[];
}

/**
 * Normalizes answer text for consistent comparison:
 * Trims leading/trailing whitespace, converts to lowercase, collapses consecutive spaces.
 */
export function normalizeAnswer(answer: string): string {
  if (!answer) return "";
  return answer.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Checks if guesser prediction matches the subject answer,
 * considering direct matches or accepted equivalents.
 */
export function isPredictionMatch(
  subjectAnswer: string,
  guesserPrediction: string,
  acceptedEquivalents?: Record<string, string[]>
): boolean {
  if (!subjectAnswer || !guesserPrediction) return false;

  const normalizedSubject = normalizeAnswer(subjectAnswer);
  const normalizedGuesser = normalizeAnswer(guesserPrediction);

  if (normalizedSubject === normalizedGuesser) {
    return true;
  }

  // Check custom accepted equivalents map if defined
  if (acceptedEquivalents) {
    for (const [canonical, aliases] of Object.entries(acceptedEquivalents)) {
      const normCanonical = normalizeAnswer(canonical);
      const normAliases = aliases.map(normalizeAnswer);
      const group = [normCanonical, ...normAliases];

      if (group.includes(normalizedSubject) && group.includes(normalizedGuesser)) {
        return true;
      }
    }
  }

  return false;
}

export function evaluateRound(input: RoundScoringInput): RoundScoredResult {
  const isMatch = isPredictionMatch(
    input.subjectAnswer,
    input.guesserPrediction,
    input.acceptedEquivalents
  );
  const pointsAwarded = isMatch ? 10 : 0;

  return {
    roundNumber: input.roundNumber,
    questionId: input.questionId,
    questionPrompt: input.questionPrompt,
    subjectPlayerId: input.subjectPlayerId,
    guesserPlayerId: input.guesserPlayerId,
    subjectNickname: input.subjectNickname,
    guesserNickname: input.guesserNickname,
    subjectAnswer: input.subjectAnswer,
    guesserPrediction: input.guesserPrediction,
    isMatch,
    pointsAwarded
  };
}

export function getSyncScoreTitle(percentage: number): { title: string; description: string } {
  if (percentage >= 90) {
    return {
      title: "Mind Readers",
      description: "Incredible connection! You anticipate each other's thoughts and know each other inside and out."
    };
  }
  if (percentage >= 70) {
    return {
      title: "Perfectly in Sync",
      description: "Wonderful harmony! You share deep understanding, great communication, and mutual appreciation."
    };
  }
  if (percentage >= 40) {
    return {
      title: "Still Discovering",
      description: "Exciting potential! You know many key quirks, with plenty of delightful surprises still to uncover."
    };
  }
  return {
    title: "Plot Twist!",
    description: "Every answer was an unexpected adventure! Time for a cozy date night to share untold stories."
  };
}

export function calculateGameResults(
  roomId: string,
  totalQuestionsPlanned: number,
  rounds: RoundScoredResult[],
  player1: { id: string; nickname: string },
  player2: { id: string; nickname: string }
): FinalGameScoreResult {
  const totalScoredRounds = rounds.length;
  const totalMatches = rounds.filter(r => r.isMatch).length;
  const totalPoints = rounds.reduce((sum, r) => sum + r.pointsAwarded, 0);
  const maxPossiblePoints = Math.max(totalQuestionsPlanned, totalScoredRounds) * 10;

  // Safe division: prevent NaN / division by zero
  const loveSyncScore = totalScoredRounds > 0 
    ? Math.round((totalMatches / totalScoredRounds) * 100)
    : 0;

  const { title: resultTitle, description: resultDescription } = getSyncScoreTitle(loveSyncScore);

  // Calculate individual accuracy for each player as guesser
  const computeAccuracy = (playerId: string, nickname: string): PlayerScoreSummary => {
    const guesserRounds = rounds.filter(r => r.guesserPlayerId === playerId);
    const correct = guesserRounds.filter(r => r.isMatch).length;
    const total = guesserRounds.length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    return {
      playerId,
      nickname,
      correctPredictions: correct,
      totalPredictions: total,
      predictionAccuracy: accuracy
    };
  };

  const playerScores: Record<string, PlayerScoreSummary> = {
    [player1.id]: computeAccuracy(player1.id, player1.nickname),
    [player2.id]: computeAccuracy(player2.id, player2.nickname)
  };

  return {
    roomId,
    totalQuestions: totalQuestionsPlanned,
    totalScoredRounds,
    totalMatches,
    totalPoints,
    maxPossiblePoints,
    loveSyncScore,
    resultTitle,
    resultDescription,
    playerScores,
    rounds
  };
}
