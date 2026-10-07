import { test } from "node:test";
import assert from "node:assert/strict";
import { SERVICES } from "./services.ts";

// Google cuts titles around 60 characters and snippets around 160.
test("service search titles and snippets fit in Google results", () => {
  for (const s of SERVICES) {
    assert.ok(`${s.seo.title} — Trivian AI Solutions`.length <= 60, s.seo.title);
    assert.ok(s.seo.description.length <= 160, `${s.slug}: ${s.seo.description.length}`);
  }
});
