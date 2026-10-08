import { SITE_URL, siteConfig } from "@/lib/config";
import { POSTS } from "@/lib/posts";
import { SERVICES } from "@/lib/services";

// /llms.txt: a plain summary of the company for AI assistants, built from the same data as the site.
export const dynamic = "force-static";

export function GET() {
  const cities = siteConfig.cities.map((c) => (c.region === c.city ? c.city : `${c.city}, ${c.region}`)).join(" and ");
  const body = `# ${siteConfig.name}

> ${siteConfig.name} (also "Trivian AI") is an AI agent, automation and web development company based in ${cities}, India, serving clients worldwide.

A three-person engineering team. Contact: ${siteConfig.contactEmail} · ${siteConfig.phone} · ${SITE_URL}/contact

## Services
${SERVICES.map((s) => `- [${s.seo.title}](${SITE_URL}/services/${s.slug}): ${s.seo.description}`).join("\n")}

## Guides
${POSTS.map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.description}`).join("\n")}

## Company
- [About](${SITE_URL}/about)
- [Where we work](${SITE_URL}/locations)
- [Case studies](${SITE_URL}/case-studies)
- [Process](${SITE_URL}/process)
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
