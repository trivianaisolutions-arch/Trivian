"use server";

import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { clean, validate, type BriefErrors } from "@/lib/brief";
import { saveLead, type Lead } from "@/lib/leads";
import { mailConfigured, notifyOwners, thankClient } from "@/lib/mailer";
import { rateLimiter } from "@/lib/session";

const allow = rateLimiter(5, 10 * 60_000); // 5 briefs per connection per 10 minutes
const MIN_FILL_MS = 3000; // faster than a person can fill three steps

export type SubmitResult =
  | { ok: true; name: string; email: string; emailed: boolean }
  | { ok: false; error: string; fieldErrors?: BriefErrors };

/** Public endpoint: everything here is treated as untrusted input. */
export async function submitLead(input: unknown, meta: { botcheck?: string; elapsedMs?: number }): Promise<SubmitResult> {
  // Spam traps — a hidden field was filled, or it was too fast for a human. Look successful, store nothing.
  if (meta?.botcheck || typeof meta?.elapsedMs !== "number" || meta.elapsedMs < MIN_FILL_MS) {
    return { ok: true, name: "", email: "", emailed: false };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
  if (!allow(ip)) return { ok: false, error: "Too many briefs from your connection. Please try again in a few minutes." };

  const brief = clean(input);
  const fieldErrors = validate(brief);
  if (Object.keys(fieldErrors).length) return { ok: false, error: "Please check the highlighted fields.", fieldErrors };

  const lead: Lead = { ...brief, id: randomUUID(), createdAt: new Date().toISOString(), emailedOwner: false, emailedClient: false };

  if (mailConfigured()) {
    const [owner, client] = await Promise.allSettled([notifyOwners(lead), thankClient(lead)]);
    lead.emailedOwner = owner.status === "fulfilled";
    lead.emailedClient = client.status === "fulfilled";
    if (owner.status === "rejected") console.error("[lead] owner notification failed:", owner.reason?.message ?? owner.reason);
    if (client.status === "rejected") console.error("[lead] thank-you email failed:", client.reason?.message ?? client.reason);
  } else {
    console.error("[lead] email is not configured (GMAIL_USER / GMAIL_APP_PASSWORD / LEAD_NOTIFY_TO)");
  }

  let stored = true;
  try {
    await saveLead(lead);
  } catch (e) {
    stored = false;
    console.error("[lead] could not store lead:", e);
  }

  // Only a failure if the lead reached neither the store nor the owners' inbox.
  if (!stored && !lead.emailedOwner) {
    return { ok: false, error: "We couldn't send your brief just now. Please try again, or email us directly." };
  }
  return { ok: true, name: brief.name, email: brief.email, emailed: lead.emailedClient };
}
