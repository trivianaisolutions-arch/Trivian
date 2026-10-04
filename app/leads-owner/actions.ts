"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { OWNER_COOKIE, OWNER_TTL_MS } from "@/lib/owner-auth";
import { createToken, passwordMatches, rateLimiter } from "@/lib/session";

const allowAttempt = rateLimiter(8, 15 * 60_000); // 8 tries per connection per 15 minutes

export async function login(_prev: { error?: string } | undefined, formData: FormData) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
  if (!allowAttempt(ip)) return { error: "Too many attempts. Try again in 15 minutes." };

  const { OWNER_PASSWORD = "", SESSION_SECRET = "" } = process.env;
  if (!OWNER_PASSWORD || !SESSION_SECRET) return { error: "Owner access isn't configured on the server." };
  if (!passwordMatches(String(formData.get("password") ?? ""), OWNER_PASSWORD)) return { error: "That password isn't right." };

  const local = /^(localhost|127\.0\.0\.1)(:|$)/.test(h.get("host") ?? "");
  (await cookies()).set(OWNER_COOKIE, createToken(SESSION_SECRET, OWNER_TTL_MS), {
    httpOnly: true,
    sameSite: "strict",
    secure: !local,
    path: "/leads-owner",
    maxAge: OWNER_TTL_MS / 1000,
  });
  redirect("/leads-owner");
}

export async function logout() {
  (await cookies()).set(OWNER_COOKIE, "", { path: "/leads-owner", maxAge: 0 });
  redirect("/leads-owner");
}
