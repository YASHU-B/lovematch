import { describe, it, expect } from "vitest";
import { 
  generateRoomCode, 
  generateSessionToken, 
  generateShareToken, 
  hashToken, 
  sanitizeNickname,
  extractRoomCode
} from "../lib/tokens";

describe("Security & Token Utilities", () => {
  it("generates 6-character room codes with readable uppercase characters", () => {
    const code = generateRoomCode(6);
    expect(code).toHaveLength(6);
    expect(code).toMatch(/^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{6}$/);
  });

  it("generates unique session and share tokens with high entropy", () => {
    const session1 = generateSessionToken();
    const session2 = generateSessionToken();
    expect(session1).not.toBe(session2);
    expect(session1).toHaveLength(64); // 32 bytes hex

    const share1 = generateShareToken();
    const share2 = generateShareToken();
    expect(share1).not.toBe(share2);
    expect(share1).toHaveLength(32); // 16 bytes hex
  });

  it("produces deterministic SHA-256 hashes", () => {
    const input = "test-token-12345";
    const hash1 = hashToken(input);
    const hash2 = hashToken(input);
    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64);
  });

  it("validates and sanitizes nicknames properly", () => {
    // Valid nickname
    const valid = sanitizeNickname("  Priya Sharma  ");
    expect(valid.valid).toBe(true);
    expect(valid.nickname).toBe("Priya Sharma");

    // Strips HTML and dangerous characters
    const xss = sanitizeNickname("<script>alert('xss')</script>Maya");
    expect(xss.valid).toBe(true);
    expect(xss.nickname).not.toContain("<");
    expect(xss.nickname).not.toContain(">");
    expect(xss.nickname).toContain("Maya");

    // Too short
    const tooShort = sanitizeNickname("A");
    expect(tooShort.valid).toBe(false);

    // Empty
    const empty = sanitizeNickname("   ");
    expect(empty.valid).toBe(false);

    // Too long (truncated or validated)
    const longName = "A".repeat(40);
    const resultLong = sanitizeNickname(longName);
    expect(resultLong.nickname.length).toBeLessThanOrEqual(25);
  });

  it("extracts clean 6-character room codes even from messy WhatsApp strings or URLs", () => {
    // Exact user case: WhatsApp text concatenated to code param
    expect(extractRoomCode("MQ5VHD Join my LoveMatch quiz room with code MQ5VHD!")).toBe("MQ5VHD");
    expect(extractRoomCode("MQ5VHD%20Join%20my%20LoveMatch%20quiz%20room%20with%20code%20MQ5VHD!")).toBe("MQ5VHD");
    expect(extractRoomCode("  heArT8  ")).toBe("HEART8");
    expect(extractRoomCode("https://love2match.vercel.app/join?code=MQ5VHD")).toBe("MQ5VHD");
    expect(extractRoomCode("")).toBe("");
  });
});
