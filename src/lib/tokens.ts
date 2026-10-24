import { createHash, randomBytes } from "crypto";

// Human-readable alphabet excluding ambiguous characters (0, O, 1, I, L)
const ROOM_CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

/**
 * Generates an intuitive, readable 6-character room code.
 * Example: 'HEART8', 'LOVE42', 'SYNC77'
 */
export function generateRoomCode(length: number = 6): string {
  const bytes = randomBytes(length);
  let code = "";
  for (let i = 0; i < length; i++) {
    const index = bytes[i] % ROOM_CODE_ALPHABET.length;
    code += ROOM_CODE_ALPHABET[index];
  }
  return code;
}

/**
 * Generates a high-entropy guest session token.
 */
export function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Generates an invitation or share token.
 */
export function generateShareToken(): string {
  return randomBytes(16).toString("hex");
}

/**
 * SHA-256 hash for storing tokens and verification.
 */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Validates and sanitizes a player nickname.
 * Enforces 2-25 characters, removes control characters and tags.
 */
export function sanitizeNickname(input: string): { valid: boolean; nickname: string; error?: string } {
  if (!input || typeof input !== "string") {
    return { valid: false, nickname: "", error: "Nickname is required" };
  }

  // Trim and normalize whitespace
  const trimmed = input.trim().replace(/\s+/g, " ");

  // Strip complete HTML tags first
  const noTags = trimmed.replace(/<[^>]*>/g, "");

  // Strip remaining dangerous characters
  const clean = noTags
    .replace(/[<>'"&]/g, "")
    .trim()
    .slice(0, 25);

  if (clean.length < 2) {
    return { valid: false, nickname: "", error: "Nickname must be at least 2 characters long" };
  }

  return { valid: true, nickname: clean };
}
