import { Question } from "../questions/data";

export type RoomStatus = "waiting" | "playing" | "finished" | "expired";
export type PlayerRole = "host" | "guest";
export type RoundPhase = "answering" | "revealed" | "completed";

export interface Player {
  id: string;
  roomId: string;
  nickname: string;
  sessionTokenHash: string;
  role: PlayerRole;
  isReady: boolean;
  joinedAt: string;
  lastSeenAt: string;
}

export interface Submission {
  id: string;
  roundId: string;
  playerId: string;
  answerText: string;
  submittedAt: string;
}

export interface Round {
  id: string;
  roomId: string;
  questionId: string;
  question: Question;
  roundNumber: number;
  subjectPlayerId: string;
  guesserPlayerId: string;
  phase: RoundPhase;
  submissions: Record<string, Submission>; // key is playerId
  isMatch?: boolean;
  pointsAwarded?: number;
  revealAt?: string;
  completedAt?: string;
}

export interface Room {
  id: string;
  code: string;
  codeHash: string;
  hostPlayerId: string;
  guestPlayerId: string | null;
  status: RoomStatus;
  categoryId: string;
  questionCount: number;
  currentRound: number;
  players: Record<string, Player>;
  rounds: Round[];
  shareToken: string;
  createdAt: string;
  expiresAt: string;
  lastActivityAt: string;
}

export interface AuthorizedRoomState {
  room: {
    id: string;
    code: string;
    status: RoomStatus;
    categoryId: string;
    questionCount: number;
    currentRound: number;
    hostPlayerId: string;
    guestPlayerId: string | null;
  };
  players: {
    id: string;
    nickname: string;
    role: PlayerRole;
    isReady: boolean;
    isCurrentPlayer: boolean;
  }[];
  currentRound: {
    id: string;
    roundNumber: number;
    question: {
      id: string;
      category: string;
      prompt: string;
      options: string[];
    };
    subjectPlayerId: string;
    guesserPlayerId: string;
    phase: RoundPhase;
    // Security: Only reveal answers when phase === 'revealed' or 'completed'
    myAnswer?: string;
    hasSubmitted: boolean;
    partnerHasSubmitted: boolean;
    subjectAnswer?: string; // only present if revealed
    guesserPrediction?: string; // only present if revealed
    isMatch?: boolean;
    pointsAwarded?: number;
  } | null;
  scores: {
    totalPoints: number;
    totalMatches: number;
    totalScoredRounds: number;
    loveSyncScore: number;
    resultTitle?: string;
  };
  myPlayerId: string;
}
