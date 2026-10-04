// Owner session tokens: "<expiresAtMs>.<hmac>", signed with SESSION_SECRET. Pure Node crypto.
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const sign = (payload: string, secret: string) => createHmac("sha256", secret).update(payload).digest("base64url");

export function createToken(secret: string, ttlMs: number, now = Date.now()) {
  const exp = String(now + ttlMs);
  return `${exp}.${sign(exp, secret)}`;
}

export function verifyToken(token: string | undefined, secret: string, now = Date.now()) {
  if (!token || !secret) return false;
  const [exp, mac] = token.split(".");
  if (!exp || !mac || !/^\d+$/.test(exp) || Number(exp) < now) return false;
  const expected = Buffer.from(sign(exp, secret));
  const given = Buffer.from(mac);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/** Constant-time password check (hashing first makes the lengths equal). */
export function passwordMatches(given: string, expected: string) {
  if (!expected) return false;
  const h = (s: string) => createHash("sha256").update(s).digest();
  return timingSafeEqual(h(given), h(expected));
}

/** Fixed-window limiter keyed by IP (in memory — resets when the server restarts). */
export function rateLimiter(max: number, windowMs: number) {
  const hits = new Map<string, number[]>();
  return (key: string, now = Date.now()) => {
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    if (recent.length >= max) {
      hits.set(key, recent);
      return false;
    }
    recent.push(now);
    hits.set(key, recent);
    return true;
  };
}
