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

/**
 * Safely extracts a clean 6-character room code from raw user input, URLs, or concatenated WhatsApp messages.
 * e.g. "MQ5VHD Join my LoveMatch quiz room with code MQ5VHD!" -> "MQ5VHD"
 * or "https://love2match.vercel.app/join?code=MQ5VHD%20Join..." -> "MQ5VHD"
 */
export function extractRoomCode(input: string | null | undefined): string {
  if (!input || typeof input !== "string") return "";
  const cleaned = input.trim().replace(/%20/g, " ");

  // 1. Check for URL param: ?code=XYZ123 or &code=XYZ123
  const urlParamMatch = cleaned.match(/[?&]code=([23456789ABCDEFGHJKMNPQRSTUVWXYZ]{6})/i);
  if (urlParamMatch) {
    return urlParamMatch[1].toUpperCase();
  }

  // 2. Check for URL path: /room/XYZ123
  const urlPathMatch = cleaned.match(/\/room\/([23456789ABCDEFGHJKMNPQRSTUVWXYZ]{6})/i);
  if (urlPathMatch) {
    return urlPathMatch[1].toUpperCase();
  }

  // 3. Check if starts with a 6-character room code (e.g. "MQ5VHD Join my LoveMatch...")
  const startsWithMatch = cleaned.match(/^([23456789ABCDEFGHJKMNPQRSTUVWXYZ]{6})(?![A-Za-z0-9])/i);
  if (startsWithMatch) {
    return startsWithMatch[1].toUpperCase();
  }

  // 4. Check for "code" or "room" keyword followed by separator and 6 characters
  const keywordMatch = cleaned.match(/(?:code|room)[^A-Za-z0-9]+([23456789ABCDEFGHJKMNPQRSTUVWXYZ]{6})\b/i);
  if (keywordMatch) {
    return keywordMatch[1].toUpperCase();
  }

  // 5. Match standalone 6-character code with word boundaries
  const standaloneMatch = cleaned.match(/\b([23456789ABCDEFGHJKMNPQRSTUVWXYZ]{6})\b/i);
  if (standaloneMatch) {
    return standaloneMatch[1].toUpperCase();
  }

  // Fallback: take first 6 alphanumeric chars if no exact pattern matched
  const alphaNum = cleaned.replace(/[^A-Za-z0-9]/g, "");
  return alphaNum.slice(0, 6).toUpperCase();
}

