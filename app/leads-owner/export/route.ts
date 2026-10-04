import { readLeads } from "@/lib/leads";
import { isOwner } from "@/lib/owner-auth";

const COLUMNS = ["createdAt", "name", "email", "phone", "company", "website", "projectType", "budget", "timeline", "whatToBuild", "emailedOwner", "emailedClient", "id"] as const;

// Quote every cell; neutralise spreadsheet formulas (=, +, -, @) typed by visitors.
const cell = (v: unknown) => {
  const s = String(v ?? "");
  return `"${(/^[=+\-@]/.test(s) ? `'${s}` : s).replace(/"/g, '""')}"`;
};

export async function GET() {
  if (!(await isOwner())) return new Response("Unauthorized", { status: 401 });
  const leads = await readLeads();
  const csv = [COLUMNS.join(","), ...leads.map((l) => COLUMNS.map((c) => cell(l[c])).join(","))].join("\r\n");
  return new Response("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="trivian-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
