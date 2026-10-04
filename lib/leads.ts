import "server-only";
import { appendFile, mkdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Brief } from "./brief";

export type Lead = Brief & {
  id: string;
  createdAt: string;
  emailedOwner: boolean;
  emailedClient: boolean;
};

// Storage: Upstash Redis when connected (Vercel → Storage → Upstash adds these env vars),
// otherwise one JSON lead per line in data/leads.jsonl (needs a persistent disk: VPS / own machine).
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || "";
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || "";
const KEY = "trivian:leads";
const FILE = join(process.cwd(), "data", "leads.jsonl");

async function redis(command: string[]) {
  const res = await fetch(REDIS_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Redis ${command[0]} failed: ${res.status}`);
  return (await res.json()).result;
}

export async function saveLead(lead: Lead) {
  const line = JSON.stringify(lead);
  if (REDIS_URL) {
    await redis(["RPUSH", KEY, line]);
    return;
  }
  await mkdir(join(process.cwd(), "data"), { recursive: true });
  await appendFile(FILE, line + "\n", { encoding: "utf8", mode: 0o600 });
}

export const countRecent = (leads: Lead[], days = 7, now = Date.now()) =>
  leads.filter((l) => now - new Date(l.createdAt).getTime() < days * 86_400_000).length;

/** Newest first. A corrupt entry is skipped rather than breaking the dashboard. */
export async function readLeads(): Promise<Lead[]> {
  let lines: string[] = [];
  try {
    lines = REDIS_URL ? ((await redis(["LRANGE", KEY, "0", "-1"])) ?? []) : (await readFile(FILE, "utf8")).split("\n");
  } catch (e) {
    if (REDIS_URL) console.error("[leads] could not read leads:", e);
    return [];
  }
  return lines
    .filter(Boolean)
    .flatMap((line) => {
      try {
        return [JSON.parse(line) as Lead];
      } catch {
        return [];
      }
    })
    .reverse();
}
