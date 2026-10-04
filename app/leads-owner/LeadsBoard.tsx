"use client";

import { useState } from "react";
import { PROJECT_TYPES } from "@/lib/brief";
import type { Lead } from "@/lib/leads";

// Fixed locale + zone so server and browser render the same text.
const when = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });
const href = (site: string) => (/^https?:\/\//i.test(site) ? site : `https://${site}`);

export function LeadsBoard({ leads, recent }: { leads: Lead[]; recent: number }) {
  const [q, setQ] = useState("");
  const [type, setType] = useState("All");
  const needle = q.trim().toLowerCase();
  const shown = leads.filter(
    (l) =>
      (type === "All" || l.projectType === type) &&
      (!needle || [l.name, l.email, l.company, l.phone, l.whatToBuild, l.website].some((v) => v?.toLowerCase().includes(needle))),
  );

  return (
    <>
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="label text-accent">Owner dashboard</p>
          <h1 className="display mt-3 text-[length:var(--step-l)]">Leads</h1>
        </div>
        <dl className="flex gap-8">
          <div>
            <dt className="label text-ash-400">Total</dt>
            <dd className="display mt-1 text-3xl">{leads.length}</dd>
          </div>
          <div>
            <dt className="label text-ash-400">Last 7 days</dt>
            <dd className="display mt-1 text-3xl">{recent}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-10 flex flex-col gap-3 border-y border-bone-100/10 py-4 sm:flex-row sm:items-center">
        <label className="sr-only" htmlFor="lead-search">Search leads</label>
        <input
          id="lead-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, email, company, brief…"
          className="w-full border border-bone-100/15 bg-ink-900 px-4 py-2.5 text-[0.9375rem] text-bone-50 placeholder:text-ash-400 focus:border-bone-100 sm:max-w-sm"
        />
        <label className="sr-only" htmlFor="lead-type">Project type</label>
        <select
          id="lead-type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border border-bone-100/15 bg-ink-900 px-3 py-2.5 text-[0.9375rem] text-bone-50 focus:border-bone-100"
        >
          <option>All</option>
          {PROJECT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <span className="label text-ash-400 sm:ml-auto">
          {shown.length} shown
        </span>
        <a href="/leads-owner/export" className="btn btn-line min-h-10 px-4" download>
          Export CSV
        </a>
      </div>

      {leads.length === 0 ? (
        <p className="mt-16 max-w-md text-ash-300">
          No leads yet. When someone sends a brief from the website, it appears here — and in both owner inboxes.
        </p>
      ) : (
        <ol className="mt-8 space-y-4">
          {shown.map((l) => (
            <li key={l.id} className="border border-bone-100/10 bg-ink-900/60">
              <div className="flex flex-col gap-3 border-b border-bone-100/10 px-5 py-4 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <p className="text-lg font-semibold text-bone-50">
                    {l.name}
                    {l.company && <span className="font-normal text-ash-300"> · {l.company}</span>}
                  </p>
                  <p className="label mt-1 text-ash-400">{when.format(new Date(l.createdAt))} IST</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="label bg-signal px-2 py-1 text-ink-950">{l.projectType}</span>
                  <a href={`mailto:${l.email}?subject=${encodeURIComponent("Re: your project brief")}`} className="btn btn-signal min-h-9 px-3">
                    Reply
                  </a>
                </div>
              </div>
              <div className="grid gap-6 px-5 py-5 md:grid-cols-12">
                <dl className="grid grid-cols-[auto_1fr] content-start gap-x-4 gap-y-2 text-sm md:col-span-5">
                  <dt className="label pt-0.5 text-ash-400">Email</dt>
                  <dd className="break-all">
                    <a href={`mailto:${l.email}`} className="link-line text-bone-50">{l.email}</a>
                  </dd>
                  <dt className="label pt-0.5 text-ash-400">Phone</dt>
                  <dd>{l.phone ? <a href={`tel:${l.phone.replace(/[^\d+]/g, "")}`} className="link-line text-bone-50">{l.phone}</a> : "—"}</dd>
                  <dt className="label pt-0.5 text-ash-400">Website</dt>
                  <dd className="break-all">
                    {l.website ? (
                      <a href={href(l.website)} target="_blank" rel="noopener noreferrer nofollow" className="link-line text-bone-50">
                        {l.website}
                      </a>
                    ) : (
                      "—"
                    )}
                  </dd>
                  <dt className="label pt-0.5 text-ash-400">Budget</dt>
                  <dd>{l.budget || "—"}</dd>
                  <dt className="label pt-0.5 text-ash-400">Timeline</dt>
                  <dd>{l.timeline || "—"}</dd>
                  <dt className="label pt-0.5 text-ash-400">Emails</dt>
                  <dd className="flex flex-wrap gap-2">
                    <span className={`label px-1.5 py-0.5 ${l.emailedOwner ? "bg-bone-100 text-ink-950" : "border border-signal text-signal"}`}>
                      Owners {l.emailedOwner ? "✓" : "✗"}
                    </span>
                    <span className={`label px-1.5 py-0.5 ${l.emailedClient ? "bg-bone-100 text-ink-950" : "border border-signal text-signal"}`}>
                      Thank-you {l.emailedClient ? "✓" : "✗"}
                    </span>
                  </dd>
                </dl>
                <p className="whitespace-pre-wrap text-[0.9375rem] leading-relaxed text-ash-300 md:col-span-7">{l.whatToBuild}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
