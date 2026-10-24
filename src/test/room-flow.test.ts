import { describe, it, expect } from "vitest";
import { GameStore } from "../lib/db/store";

describe("Room Flow & Private Reveal Gameplay", () => {
  it("executes a complete end-to-end 2-player quiz game", async () => {
    // 1. Host creates room
    const { room, hostPlayer, sessionToken: hostToken } = await GameStore.createRoom({
      nickname: "Maya",
      categoryId: "all",
      questionCount: 5
    });

    expect(room.code).toHaveLength(6);
    expect(room.status).toBe("waiting");
    expect(room.players[hostPlayer.id].nickname).toBe("Maya");

    // 2. Partner joins room
    const joinResult = await GameStore.joinRoom({
      roomCode: room.code,
      nickname: "Rohan"
    });

    expect("error" in joinResult).toBe(false);
    if ("error" in joinResult) return;

    const { guestPlayer, sessionToken: guestToken } = joinResult;
    expect(guestPlayer.nickname).toBe("Rohan");
    expect(room.status).toBe("playing");

    // 3. A 3rd player trying to join should be rejected
    const thirdJoin = await GameStore.joinRoom({
      roomCode: room.code,
      nickname: "Intruder"
    });
    expect("error" in thirdJoin).toBe(true);

    // 4. Verify Round 1 alternating roles
    const round1 = room.rounds[0];
    expect(round1.subjectPlayerId).toBe(hostPlayer.id);
    expect(round1.guesserPlayerId).toBe(guestPlayer.id);

    // 5. Host (Subject) answers privately
    const sub1 = await GameStore.submitAnswer({
      roomCode: room.code,
      sessionToken: hostToken,
      answerText: "Biryani"
    });
    expect("error" in sub1).toBe(false);
    if ("error" in sub1) return;

    // Security check: Guesser's state should NOT reveal host's answer yet!
    const guesserStateBefore = GameStore.getAuthorizedState(room, guestPlayer.id);
    expect(guesserStateBefore.currentRound?.hasSubmitted).toBe(false);
    expect(guesserStateBefore.currentRound?.partnerHasSubmitted).toBe(true);
    expect(guesserStateBefore.currentRound?.subjectAnswer).toBeUndefined(); // Answer remains private!
    expect(guesserStateBefore.currentRound?.phase).toBe("answering");

    // 6. Guesser submits matching prediction
    const sub2 = await GameStore.submitAnswer({
      roomCode: room.code,
      sessionToken: guestToken,
      answerText: "Biryani"
    });
    expect("error" in sub2).toBe(false);
    if ("error" in sub2) return;

    // 7. Simultaneous reveal should now be triggered!
    const guesserStateAfter = GameStore.getAuthorizedState(room, guestPlayer.id);
    expect(guesserStateAfter.currentRound?.phase).toBe("revealed");
    expect(guesserStateAfter.currentRound?.subjectAnswer).toBe("Biryani");
    expect(guesserStateAfter.currentRound?.guesserPrediction).toBe("Biryani");
    expect(guesserStateAfter.currentRound?.isMatch).toBe(true);
    expect(guesserStateAfter.currentRound?.pointsAwarded).toBe(10);
    expect(guesserStateAfter.scores.totalPoints).toBe(10);
    expect(guesserStateAfter.scores.totalMatches).toBe(1);

    // 8. Advance to Round 2
    const adv = await GameStore.nextRound({
      roomCode: room.code,
      sessionToken: hostToken
    });
    expect("error" in adv).toBe(false);
    expect(room.currentRound).toBe(2);

    // Verify Round 2 role alternation: Rohan (Guest) is Subject, Maya (Host) is Guesser!
    const round2 = room.rounds[1];
    expect(round2.subjectPlayerId).toBe(guestPlayer.id);
    expect(round2.guesserPlayerId).toBe(hostPlayer.id);
  });

  it("finds room by invitation shareToken reliably", async () => {
    const { room } = await GameStore.createRoom({
      nickname: "Alex",
      categoryId: "romantic-moments",
      questionCount: 5
    });

    expect(room.shareToken).toBeDefined();

    // Verify findRoom can locate the room using the share token
    const foundRoom = await GameStore.findRoom(room.shareToken);
    expect(foundRoom).not.toBeNull();
    expect(foundRoom?.id).toBe(room.id);
    expect(foundRoom?.code).toBe(room.code);
  });
});
