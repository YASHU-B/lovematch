import { Room, Player, Round, AuthorizedRoomState } from "./schema";
import { getRandomQuestions } from "../questions/data";
import { generateRoomCode, generateSessionToken, generateShareToken, hashToken } from "../tokens";
import { evaluateRound, calculateGameResults, FinalGameScoreResult } from "../scoring";
import { randomUUID } from "crypto";

// In-memory persistent global store for fast local dev & zero-config testing
// Persists across hot reloads in development via globalThis
declare global {
  var __lovematch_rooms: Map<string, Room> | undefined;
}

const roomsStore: Map<string, Room> = globalThis.__lovematch_rooms || new Map<string, Room>();
if (process.env.NODE_ENV !== "production") {
  globalThis.__lovematch_rooms = roomsStore;
}

export class GameStore {
  /**
   * Creates a new game room with host player.
   */
  static async createRoom(params: {
    nickname: string;
    categoryId: string;
    questionCount: number;
  }): Promise<{ room: Room; hostPlayer: Player; sessionToken: string }> {
    const rawCode = generateRoomCode(6);
    const codeHash = hashToken(rawCode);
    const roomId = randomUUID();
    const hostPlayerId = randomUUID();
    const sessionToken = generateSessionToken();
    const sessionTokenHash = hashToken(sessionToken);

    const questions = getRandomQuestions(params.questionCount, params.categoryId);

    const hostPlayer: Player = {
      id: hostPlayerId,
      roomId,
      nickname: params.nickname,
      sessionTokenHash,
      role: "host",
      isReady: true,
      joinedAt: new Date().toISOString(),
      lastSeenAt: new Date().toISOString()
    };

    // Pre-create initial rounds with alternating roles
    // Round 1: Host is Subject, Guest will be Guesser
    // Round 2: Guest is Subject, Host will be Guesser
    const rounds: Round[] = questions.map((q, idx) => ({
      id: randomUUID(),
      roomId,
      questionId: q.id,
      question: q,
      roundNumber: idx + 1,
      subjectPlayerId: idx % 2 === 0 ? hostPlayerId : "", // will fill guest player id on join
      guesserPlayerId: idx % 2 === 0 ? "" : hostPlayerId,
      phase: "answering",
      submissions: {}
    }));

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    const room: Room = {
      id: roomId,
      code: rawCode,
      codeHash,
      hostPlayerId,
      guestPlayerId: null,
      status: "waiting",
      categoryId: params.categoryId,
      questionCount: params.questionCount,
      currentRound: 1,
      players: {
        [hostPlayerId]: hostPlayer
      },
      rounds,
      shareToken: generateShareToken(),
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      lastActivityAt: now.toISOString()
    };

    roomsStore.set(rawCode.toUpperCase(), room);
    roomsStore.set(roomId, room);
    roomsStore.set(room.shareToken, room);

    return { room, hostPlayer, sessionToken };
  }

  /**
   * Finds room by room code, room ID, or share token.
   */
  static async findRoom(codeOrIdOrToken: string): Promise<Room | null> {
    if (!codeOrIdOrToken) return null;
    const clean = codeOrIdOrToken.trim();
    const upperKey = clean.toUpperCase();

    // 1. Direct key lookups
    let room = roomsStore.get(upperKey) || roomsStore.get(clean);

    // 2. Scan fallback across all rooms
    if (!room) {
      for (const r of roomsStore.values()) {
        if (
          r.code === upperKey ||
          r.code.toUpperCase() === upperKey ||
          r.id === clean ||
          r.shareToken === clean ||
          r.shareToken.toLowerCase() === clean.toLowerCase()
        ) {
          room = r;
          break;
        }
      }
    }

    if (!room) return null;

    // Check expiration
    if (new Date(room.expiresAt).getTime() < Date.now()) {
      room.status = "expired";
      return null;
    }

    return room;
  }

  /**
   * Joins an existing room as a guest.
   */
  static async joinRoom(params: {
    roomCode: string;
    nickname: string;
  }): Promise<{ room: Room; guestPlayer: Player; sessionToken: string } | { error: string }> {
    const room = await this.findRoom(params.roomCode);
    if (!room) {
      return { error: "Room not found or has expired. Please check the room code." };
    }

    if (room.status === "expired") {
      return { error: "This room has expired." };
    }

    // Check if room already has 2 players
    const existingPlayers = Object.values(room.players);
    if (existingPlayers.length >= 2) {
      return { error: "This room is already full (maximum 2 players)." };
    }

    const guestPlayerId = randomUUID();
    const sessionToken = generateSessionToken();
    const sessionTokenHash = hashToken(sessionToken);

    const guestPlayer: Player = {
      id: guestPlayerId,
      roomId: room.id,
      nickname: params.nickname,
      sessionTokenHash,
      role: "guest",
      isReady: true,
      joinedAt: new Date().toISOString(),
      lastSeenAt: new Date().toISOString()
    };

    room.players[guestPlayerId] = guestPlayer;
    room.guestPlayerId = guestPlayerId;
    room.status = "playing"; // Game can now begin!
    room.lastActivityAt = new Date().toISOString();

    // Assign guest ID to alternating rounds
    room.rounds.forEach((round, idx) => {
      if (idx % 2 === 0) {
        // Round 1, 3, 5: Host is subject, Guest is guesser
        round.guesserPlayerId = guestPlayerId;
      } else {
        // Round 2, 4, 6: Guest is subject, Host is guesser
        round.subjectPlayerId = guestPlayerId;
      }
    });

    return { room, guestPlayer, sessionToken };
  }

  /**
   * Validates player session for a room and returns player ID.
   */
  static validateSession(room: Room, sessionToken: string): Player | null {
    if (!sessionToken) return null;
    const tokenHash = hashToken(sessionToken);
    for (const player of Object.values(room.players)) {
      if (player.sessionTokenHash === tokenHash) {
        player.lastSeenAt = new Date().toISOString();
        return player;
      }
    }
    return null;
  }

  /**
   * Gets secure authorized state of a room for a player.
   * NEVER leaks private answers until round phase is 'revealed'.
   */
  static getAuthorizedState(room: Room, playerId: string): AuthorizedRoomState {
    const playersList = Object.values(room.players).map(p => ({
      id: p.id,
      nickname: p.nickname,
      role: p.role,
      isReady: p.isReady,
      isCurrentPlayer: p.id === playerId
    }));

    const currentRoundIndex = room.currentRound - 1;
    const activeRound = room.rounds[currentRoundIndex] || null;

    let currentRoundState: AuthorizedRoomState["currentRound"] = null;

    if (activeRound) {
      const mySubmission = activeRound.submissions[playerId];
      const partnerId = Object.keys(room.players).find(id => id !== playerId);
      const partnerSubmission = partnerId ? activeRound.submissions[partnerId] : undefined;

      const isRevealed = activeRound.phase === "revealed" || activeRound.phase === "completed";

      const subjectAnswer = isRevealed && activeRound.subjectPlayerId
        ? activeRound.submissions[activeRound.subjectPlayerId]?.answerText
        : undefined;

      const guesserPrediction = isRevealed && activeRound.guesserPlayerId
        ? activeRound.submissions[activeRound.guesserPlayerId]?.answerText
        : undefined;

      currentRoundState = {
        id: activeRound.id,
        roundNumber: activeRound.roundNumber,
        question: {
          id: activeRound.question.id,
          category: activeRound.question.category,
          prompt: activeRound.question.prompt,
          options: activeRound.question.options
        },
        subjectPlayerId: activeRound.subjectPlayerId,
        guesserPlayerId: activeRound.guesserPlayerId,
        phase: activeRound.phase,
        myAnswer: mySubmission?.answerText,
        hasSubmitted: Boolean(mySubmission),
        partnerHasSubmitted: Boolean(partnerSubmission),
        subjectAnswer,
        guesserPrediction,
        isMatch: activeRound.isMatch,
        pointsAwarded: activeRound.pointsAwarded
      };
    }

    // Calculate score summary from completed or revealed rounds
    const scoredRounds = room.rounds.filter(r => r.phase === "revealed" || r.phase === "completed");
    const totalMatches = scoredRounds.filter(r => r.isMatch).length;
    const totalPoints = scoredRounds.reduce((acc, r) => acc + (r.pointsAwarded || 0), 0);
    const loveSyncScore = scoredRounds.length > 0
      ? Math.round((totalMatches / scoredRounds.length) * 100)
      : 0;

    return {
      room: {
        id: room.id,
        code: room.code,
        status: room.status,
        categoryId: room.categoryId,
        questionCount: room.questionCount,
        currentRound: room.currentRound,
        hostPlayerId: room.hostPlayerId,
        guestPlayerId: room.guestPlayerId
      },
      players: playersList,
      currentRound: currentRoundState,
      scores: {
        totalPoints,
        totalMatches,
        totalScoredRounds: scoredRounds.length,
        loveSyncScore
      },
      myPlayerId: playerId
    };
  }

  /**
   * Submits an answer privately for the current round.
   * If both players have submitted, automatically triggers simultaneous reveal and server scoring!
   */
  static async submitAnswer(params: {
    roomCode: string;
    sessionToken: string;
    answerText: string;
  }): Promise<{ state: AuthorizedRoomState } | { error: string }> {
    const room = await this.findRoom(params.roomCode);
    if (!room) return { error: "Room not found" };

    const player = this.validateSession(room, params.sessionToken);
    if (!player) return { error: "Unauthorized session" };

    const currentRound = room.rounds[room.currentRound - 1];
    if (!currentRound) return { error: "No active round found" };

    if (currentRound.phase !== "answering") {
      return { error: "Submissions are closed for this round" };
    }

    // Record submission
    currentRound.submissions[player.id] = {
      id: randomUUID(),
      roundId: currentRound.id,
      playerId: player.id,
      answerText: params.answerText.trim(),
      submittedAt: new Date().toISOString()
    };
    room.lastActivityAt = new Date().toISOString();

    // Check if both players have submitted
    const playerIds = Object.keys(room.players);
    const bothSubmitted = playerIds.length === 2 && playerIds.every(id => Boolean(currentRound.submissions[id]));

    if (bothSubmitted) {
      // Authorize simultaneous reveal!
      currentRound.phase = "revealed";
      currentRound.revealAt = new Date().toISOString();

      const subjectSub = currentRound.submissions[currentRound.subjectPlayerId];
      const guesserSub = currentRound.submissions[currentRound.guesserPlayerId];

      const scored = evaluateRound({
        roundNumber: currentRound.roundNumber,
        questionId: currentRound.questionId,
        questionPrompt: currentRound.question.prompt,
        subjectPlayerId: currentRound.subjectPlayerId,
        guesserPlayerId: currentRound.guesserPlayerId,
        subjectNickname: room.players[currentRound.subjectPlayerId]?.nickname || "Player 1",
        guesserNickname: room.players[currentRound.guesserPlayerId]?.nickname || "Player 2",
        subjectAnswer: subjectSub?.answerText || "",
        guesserPrediction: guesserSub?.answerText || "",
        acceptedEquivalents: currentRound.question.acceptedEquivalents
      });

      currentRound.isMatch = scored.isMatch;
      currentRound.pointsAwarded = scored.pointsAwarded;
    }

    return { state: this.getAuthorizedState(room, player.id) };
  }

  /**
   * Advances the game to the next round.
   */
  static async nextRound(params: {
    roomCode: string;
    sessionToken: string;
  }): Promise<{ state: AuthorizedRoomState } | { error: string }> {
    const room = await this.findRoom(params.roomCode);
    if (!room) return { error: "Room not found" };

    const player = this.validateSession(room, params.sessionToken);
    if (!player) return { error: "Unauthorized session" };

    const currentRound = room.rounds[room.currentRound - 1];
    if (currentRound && currentRound.phase === "revealed") {
      currentRound.phase = "completed";
      currentRound.completedAt = new Date().toISOString();
    }

    if (room.currentRound >= room.questionCount) {
      room.status = "finished";
    } else {
      room.currentRound += 1;
    }
    room.lastActivityAt = new Date().toISOString();

    return { state: this.getAuthorizedState(room, player.id) };
  }

  /**
   * Computes final game results and share metadata.
   */
  static async getFinalResults(roomIdOrCode: string): Promise<FinalGameScoreResult | null> {
    const room = await this.findRoom(roomIdOrCode);
    if (!room) return null;

    const players = Object.values(room.players);
    const p1 = players[0] || { id: "p1", nickname: "Player 1" };
    const p2 = players[1] || { id: "p2", nickname: "Player 2" };

    const scoredRounds = room.rounds
      .filter(r => r.phase === "revealed" || r.phase === "completed")
      .map(r => {
        const subAnswer = r.submissions[r.subjectPlayerId]?.answerText || "";
        const guessAnswer = r.submissions[r.guesserPlayerId]?.answerText || "";
        return evaluateRound({
          roundNumber: r.roundNumber,
          questionId: r.questionId,
          questionPrompt: r.question.prompt,
          subjectPlayerId: r.subjectPlayerId,
          guesserPlayerId: r.guesserPlayerId,
          subjectNickname: room.players[r.subjectPlayerId]?.nickname || "Player 1",
          guesserNickname: room.players[r.guesserPlayerId]?.nickname || "Player 2",
          subjectAnswer: subAnswer,
          guesserPrediction: guessAnswer,
          acceptedEquivalents: r.question.acceptedEquivalents
        });
      });

    return calculateGameResults(
      room.id,
      room.questionCount,
      scoredRounds,
      { id: p1.id, nickname: p1.nickname },
      { id: p2.id, nickname: p2.nickname }
    );
  }
}
