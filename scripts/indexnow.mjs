// Tells IndexNow search engines (Bing, Yandex, Seznam, Naver…) about every page in the live sitemap.
// Run: node scripts/indexnow.mjs — also runs from .github/workflows/indexnow.yml after each production deploy.
// Google doesn't use IndexNow; it reads the sitemap from Search Console.
import { readdirSync } from "node:fs";

const SITE = process.env.SITE_URL ?? "https://trivianaisolutions.in";
const keyFile = readdirSync(new URL("../public/", import.meta.url)).find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) throw new Error("No IndexNow key file (32 hex chars + .txt) in public/");

const sitemap = await (await fetch(`${SITE}/sitemap.xml`)).text();
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!urlList.length) throw new Error(`No URLs found in ${SITE}/sitemap.xml`);

// ponytail: sends every URL on each deploy; send only changed URLs once the site has hundreds of pages.
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(SITE).host, key: keyFile.slice(0, -4), keyLocation: `${SITE}/${keyFile}`, urlList }),
});
console.log(`IndexNow: ${res.status} ${res.statusText} for ${urlList.length} URLs`);
if (!res.ok) process.exit(1);
