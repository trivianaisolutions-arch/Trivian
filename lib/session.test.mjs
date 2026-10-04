// Run: node --test lib/*.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { createToken, passwordMatches, rateLimiter, verifyToken } from "./session.ts";

const SECRET = "test-secret";

test("a fresh token verifies; tampered, expired or wrong-secret tokens don't", () => {
  const t = createToken(SECRET, 60_000, 1_000);
  assert.equal(verifyToken(t, SECRET, 2_000), true);
  assert.equal(verifyToken(t, SECRET, 70_000), false, "expired");
  assert.equal(verifyToken(t, "other-secret", 2_000), false, "wrong secret");
  const [exp, mac] = t.split(".");
  assert.equal(verifyToken(`${Number(exp) + 99999}.${mac}`, SECRET, 2_000), false, "extended expiry");
  assert.equal(verifyToken(undefined, SECRET), false);
  assert.equal(verifyToken("garbage", SECRET), false);
  assert.equal(verifyToken(t, "", 2_000), false, "no secret configured");
});

test("password check", () => {
  assert.equal(passwordMatches("abc", "abc"), true);
  assert.equal(passwordMatches("abd", "abc"), false);
  assert.equal(passwordMatches("", ""), false, "empty configured password never matches");
});

test("rate limiter blocks after max hits within the window", () => {
  const allow = rateLimiter(2, 1_000);
  assert.equal(allow("ip", 0), true);
  assert.equal(allow("ip", 10), true);
  assert.equal(allow("ip", 20), false);
  assert.equal(allow("other", 20), true, "per key");
  assert.equal(allow("ip", 1_500), true, "window expired");
});
