import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NextStep } from "@/components/NextStep";
import { Faq } from "@/components/Faq";
import { SERVICE_FAQS } from "@/lib/faqs";
import { AIAutomation } from "@/components/AIAutomation";
import { CallingAgent } from "@/components/CallingAgent";
import { WebDevShowcase } from "@/components/WebDevShowcase";
import { SystemLayers } from "@/components/SystemLayers";
import { SearchIntelligence } from "@/components/SearchIntelligence";
import { TechStack } from "@/components/TechStack";
import { SystemScene } from "@/components/scene/SystemScene";
import { BRIEFS, SERVICES, getService } from "@/lib/services";
import { getCaseStudyBySlug, hostOf } from "@/lib/case-studies";
import { JsonLd, SITE_URL, breadcrumbs, pageMeta } from "@/lib/seo";

// Each service reuses the homepage demo that shows it working. `dark` = the demo's own surface.
const DEMOS: Record<string, { Demo: () => React.ReactNode; dark: boolean }> = {
  automation: { Demo: AIAutomation, dark: false },
  agents: { Demo: CallingAgent, dark: true },
  web: { Demo: WebDevShowcase, dark: false },
  "3d": { Demo: SystemLayers, dark: true },
  search: { Demo: SearchIntelligence, dark: false },
  systems: { Demo: TechStack, dark: true },
};

const TONE = {
  ink: { surface: "surface-ink", muted: "text-ash-300", faint: "text-ash-400", rule: "border-bone-100/10" },
  bone: { surface: "surface-bone", muted: "text-ash-600", faint: "text-ash-600", rule: "border-ink-900/15" },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const s = getService((await params).slug);
  if (!s) return { title: "Service not found" };
  return pageMeta(s.title, s.summary, `/services/${s.slug}`);
}

export default async function ServicePage({ params }: PageProps) {
  const s = getService((await params).slug);
  if (!s) notFound();

  const index = SERVICES.indexOf(s);
  const next = SERVICES[(index + 1) % SERVICES.length];
  const { Demo, dark } = DEMOS[s.id];
  const briefs = BRIEFS.filter((b) => s.briefs.includes(b.id));
  const work = s.work.flatMap(({ slug, feature }) => {
    const study = getCaseStudyBySlug(slug);
    return study ? [{ study, feature: study.features[feature] }] : [];
  });

  // Alternate calm / dark surfaces around the demo.
  const caps = dark ? TONE.bone : TONE.ink;
  const briefTone = dark ? TONE.bone : TONE.ink;
  const workTone = briefs.length ? (briefTone === TONE.ink ? TONE.bone : TONE.ink) : briefTone;

  return (
    <div id="top">
      {s.id === "3d" && <SystemScene />}
      <Navbar />
      <main id="main" tabIndex={-1} data-inner className="relative z-10">
        <header className="surface-ink">
          <div className="shell pb-20 pt-36">
            <nav aria-label="Breadcrumb" className="label text-ash-400">
              <Link href="/" className="link-line">Studio</Link> <span aria-hidden="true">/</span>{" "}
              <Link href="/services" className="link-line">Services</Link> <span aria-hidden="true">/</span>{" "}
              <span className="text-bone-100">{s.title}</span>
            </nav>
            <p className="label mt-12 flex flex-wrap gap-x-4 text-ash-300">
              <span className="text-accent">0{index + 1} / 06</span>
              <span>{s.layer}</span>
            </p>
            <h1 className="display mt-6 text-[length:min(var(--step-xl),10.5vw)] text-bone-50">
              {s.title}
              <span className="text-accent">.</span>
            </h1>
            <p className="lead mt-8 max-w-2xl text-ash-300">{s.summary}</p>
            <p className="label mt-6 text-ash-400">For: {s.for}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href={`/contact?type=${encodeURIComponent(s.projectType)}`} className="btn btn-signal">
                Start a project <span aria-hidden="true" className="btn-arrow">→</span>
              </Link>
              <Link href="/services" className="btn btn-line">
                All services
              </Link>
            </div>
          </div>
        </header>

        <section aria-labelledby="capabilities-title" className={`${caps.surface} border-t ${caps.rule} py-20 md:py-28`}>
          <div className="shell grid grid-cols-1 gap-10 lg:grid-cols-12">
            <h2 id="capabilities-title" className="display text-[length:var(--step-l)] lg:col-span-5">
              What we build
            </h2>
            <ol className={`border-t ${caps.rule} lg:col-span-7`}>
              {s.capabilities.map((c, i) => (
                <li key={c} className={`flex gap-6 border-b ${caps.rule} py-5`}>
                  <span className="label pt-1.5 text-accent">0{i + 1}</span>
                  <span className="text-lg leading-snug">{c}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <Demo />

        {briefs.length > 0 && (
          <section aria-labelledby="briefs-title" className={`${briefTone.surface} relative z-10 py-20 md:py-28`}>
            <div className="shell">
              <h2 id="briefs-title" className="display text-[length:var(--step-l)]">
                Typical starting points
              </h2>
              <ul className="mt-12 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                {briefs.map((b) => (
                  <li key={b.id} className={`border-t-2 ${briefTone === TONE.ink ? "border-bone-100" : "border-ink-900"} pt-6`}>
                    <h3 className="text-xl font-semibold">&ldquo;{b.query}&rdquo;</h3>
                    <p className={`label mt-4 ${briefTone.faint}`}>
                      Typical timeline <span className="text-accent">{b.timeline}</span>
                    </p>
                    <p className="mt-3 font-mono text-[0.8125rem]">{b.stack}</p>
                    <p className={`mt-3 text-[0.9375rem] leading-relaxed ${briefTone.muted}`}>{b.approach}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {work.length > 0 && (
          <section aria-labelledby="work-title" className={`${workTone.surface} relative z-10 py-20 md:py-28`}>
            <div className="shell">
              <h2 id="work-title" className="display text-[length:var(--step-l)]">
                Where it&apos;s live
              </h2>
              <ol className={`mt-12 border-t ${workTone.rule}`}>
                {work.map(({ study, feature }) => (
                  <li key={study.slug} className={`grid gap-4 border-b ${workTone.rule} py-8 md:grid-cols-12 md:items-baseline`}>
                    <Link href={`/case-studies/${study.slug}`} data-cursor="view" className="display text-[length:var(--step-m)] transition-colors hover:text-signal md:col-span-5">
                      {study.title}
                    </Link>
                    <p className={`text-[0.9375rem] leading-relaxed ${workTone.muted} md:col-span-5`}>{feature}</p>
                    <a href={study.liveUrl} target="_blank" rel="noopener noreferrer" className="label link-line w-fit break-all md:col-span-2 md:justify-self-end">
                      {hostOf(study.liveUrl)} ↗<span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {SERVICE_FAQS[s.slug] && (
          <Faq
            faqs={SERVICE_FAQS[s.slug]}
            tone="bone"
            title={
              <>
                Questions about
                <br />
                <span className="text-ash-600">{s.title}.</span>
              </>
            }
          />
        )}

        <NextStep next={{ href: `/services/${next.slug}`, title: next.title }} type={s.projectType} />
      </main>
      <Footer />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: s.title,
          description: s.summary,
          serviceType: s.title,
          url: `${SITE_URL}/services/${s.slug}`,
          provider: { "@id": `${SITE_URL}/#organization` },
          areaServed: "Worldwide",
        }}
      />
      <JsonLd
        data={breadcrumbs([
          { name: "Studio", path: "/" },
          { name: "Services", path: "/services" },
          { name: s.title, path: `/services/${s.slug}` },
        ])}
      />
    </div>
  );
}
