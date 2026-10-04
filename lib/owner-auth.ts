import "server-only";
import { cookies } from "next/headers";
import { verifyToken } from "./session";

export const OWNER_COOKIE = "trivian_owner";
export const OWNER_TTL_MS = 7 * 24 * 60 * 60 * 1000; // stay signed in for a week

/** True only for a request carrying a valid, unexpired owner session. */
export async function isOwner() {
  const token = (await cookies()).get(OWNER_COOKIE)?.value;
  return verifyToken(token, process.env.SESSION_SECRET ?? "");
}
