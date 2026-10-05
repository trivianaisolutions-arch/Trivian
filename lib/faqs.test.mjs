import { test } from "node:test";
import assert from "node:assert/strict";
import { GENERAL_FAQS, SERVICE_FAQS } from "./faqs.ts";
import { SERVICES } from "./services.ts";

test("every service page has FAQs", () => {
  for (const s of SERVICES) assert.ok(SERVICE_FAQS[s.slug]?.length >= 3, s.slug);
});

test("each question lives on one page only (no duplicate FAQPage markup)", () => {
  const qs = [...GENERAL_FAQS, ...Object.values(SERVICE_FAQS).flat()].map((f) => f.q.toLowerCase());
  assert.equal(new Set(qs).size, qs.length);
});
