// Run: node --test lib/*.test.mjs   (Node 23.6+ strips the TypeScript types)
import { test } from "node:test";
import assert from "node:assert/strict";
import { EMPTY_BRIEF, briefText, clean, validate, validateStep } from "./brief.ts";

const good = {
  ...EMPTY_BRIEF,
  name: "Sam",
  email: "sam@example.com",
  projectType: "Website",
  whatToBuild: "A booking site that syncs with our calendar.",
};

test("a complete brief has no errors", () => {
  assert.deepEqual(validate(good), {});
});

test("required fields, bad email and unknown options are flagged", () => {
  const e = validate({ ...EMPTY_BRIEF, email: "not-an-email", whatToBuild: "short", budget: "a million" });
  assert.deepEqual(Object.keys(e).sort(), ["budget", "email", "name", "projectType", "whatToBuild"]);
  assert.ok(validate({ ...good, email: "a@b" }).email, "a@b has no TLD");
  assert.ok(validate({ ...good, projectType: "Hacking" }).projectType, "project type must be a known option");
  assert.ok(validate({ ...good, phone: "call me" }).phone);
  assert.equal(validate({ ...good, phone: "+91 98765 43210" }).phone, undefined);
  assert.ok(validate({ ...good, name: "x".repeat(500) }).name, "length limits");
});

test("validateStep only reports that step's fields", () => {
  assert.deepEqual(Object.keys(validateStep(EMPTY_BRIEF, 0)), ["projectType"]);
  assert.deepEqual(Object.keys(validateStep(EMPTY_BRIEF, 2)).sort(), ["email", "name"]);
});

test("clean() drops unknown keys and non-strings from untrusted input", () => {
  const c = clean({ name: "  Sam  ", email: 42, admin: true, whatToBuild: "a\r\nb" });
  assert.equal(c.name, "Sam");
  assert.equal(c.email, "");
  assert.equal("admin" in c, false);
  assert.equal(c.whatToBuild, "a\nb");
  assert.deepEqual(clean(null), EMPTY_BRIEF);
});

test("summary carries every field, blanks shown as dashes", () => {
  const body = briefText(good);
  assert.match(body, /^Name: Sam$/m);
  assert.match(body, /^Company: —$/m);
  assert.match(body, /^Budget: —$/m);
  assert.match(body, /^Project type: Website$/m);
  assert.ok(body.endsWith(good.whatToBuild));
});
