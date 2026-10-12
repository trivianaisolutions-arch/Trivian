import { test } from "node:test";
import assert from "node:assert/strict";
import { POSTS } from "./posts.ts";

test("blog snippets fit in Google results and slugs are unique", () => {
  for (const p of POSTS) assert.ok(p.description.length <= 160, `${p.slug}: ${p.description.length}`);
  assert.equal(new Set(POSTS.map((p) => p.slug)).size, POSTS.length);
});
