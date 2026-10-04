import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NextStep } from "@/components/NextStep";
import { caseStudies, getCaseStudyBySlug, hostOf } from "@/lib/case-studies";
import { JsonLd, breadcrumbs, pageMeta } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  if (!study) return { title: "Case study not found" };
  return pageMeta(`${study.title} — Case Study`, study.metaDescription, `/case-studies/${study.slug}`);
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  if (!study) notFound();

  const index = caseStudies.indexOf(study);
  const next = caseStudies[(index + 1) % caseStudies.length];

  return (
    <div id="top" className="surface-ink min-h-screen">
      <Navbar />
      <main id="main" tabIndex={-1}>
        <header className="shell pb-20 pt-36">
          <nav aria-label="Breadcrumb" className="label text-ash-400">
            <Link href="/" className="link-line">Studio</Link> <span aria-hidden="true">/</span>{" "}
            <Link href="/case-studies" className="link-line">Work</Link> <span aria-hidden="true">/</span>{" "}
            <span className="text-bone-100">{study.title}</span>
          </nav>
          <p className="label mt-12 flex flex-wrap gap-x-4 gap-y-2 text-ash-300">
            <span className="text-accent">0{index + 1}</span>
            <span>{study.category}</span>
            <span>{study.badge}</span>
          </p>
          <h1 className="display mt-6 text-[length:var(--step-xl)] text-bone-50">{study.title}</h1>
          <p className="label mt-6 text-ash-400">{study.tagline}</p>
          <p className="lead mt-8 max-w-3xl text-ash-300">{study.shortDescription}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href={study.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-signal">
              Visit {hostOf(study.liveUrl)} <span aria-hidden="true">↗</span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <Link href="/contact" className="btn btn-line">
              Scope a similar build
            </Link>
          </div>
        </header>

        <figure className="shell pb-20">
          <div className="max-w-4xl overflow-hidden border border-bone-100/10">
            <Image src={study.image} alt={study.imageAlt} placeholder="blur" sizes="(min-width: 1024px) 896px, 100vw" className="w-full" />
          </div>
          <figcaption className="label mt-4 text-ash-400">Live production homepage — {hostOf(study.liveUrl)}</figcaption>
        </figure>

        <section aria-label="Case study" className="surface-bone py-20 md:py-28">
          <dl className="shell grid gap-x-10 gap-y-14 md:grid-cols-12">
            <div className="md:col-span-5">
              <dt className="label text-accent">Problem</dt>
              <dd className="mt-4 text-[1.0625rem] leading-relaxed text-ink-900">{study.problem}</dd>
            </div>
            <div className="md:col-span-6 md:col-start-7">
              <dt className="label text-accent">System</dt>
              <dd className="mt-4 text-[1.0625rem] leading-relaxed text-ink-900">{study.solution}</dd>
            </div>
            <div className="md:col-span-12">
              <dt className="label text-accent">What was built</dt>
              <dd className="mt-6">
                <ol className="grid gap-x-10 border-t border-ink-900/15 sm:grid-cols-2">
                  {study.features.map((f, i) => (
                    <li key={f} className="flex gap-4 border-b border-ink-900/15 py-4 text-[0.9375rem] leading-relaxed text-ash-600">
                      <span className="label pt-1 text-ink-900">{String(i + 1).padStart(2, "0")}</span>
                      {f}
                    </li>
                  ))}
                </ol>
              </dd>
            </div>
            <div className="md:col-span-7">
              <dt className="label text-accent">Architecture</dt>
              <dd className="mt-4 text-[0.9375rem] leading-relaxed text-ash-600">{study.architecture}</dd>
            </div>
            <div className="md:col-span-4 md:col-start-9">
              <dt className="label text-accent">Technology</dt>
              <dd className="mt-4">
                <ul className="space-y-1.5 font-mono text-[0.8125rem] text-ink-900">
                  {study.technologies.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </dd>
            </div>
            <div className="md:col-span-12">
              <dt className="label text-accent">Result</dt>
              <dd className="display mt-4 text-[length:var(--step-m)]">
                {study.badge}, live at{" "}
                <a href={study.liveUrl} target="_blank" rel="noopener noreferrer" className="link-line">
                  {hostOf(study.liveUrl)}
                </a>
                .
              </dd>
            </div>
          </dl>
        </section>

        <NextStep next={{ href: `/case-studies/${next.slug}`, title: next.title }} />
      </main>
      <Footer />
      <JsonLd
        data={breadcrumbs([
          { name: "Studio", path: "/" },
          { name: "Selected work", path: "/case-studies" },
          { name: study.title, path: `/case-studies/${study.slug}` },
        ])}
      />
    </div>
  );
}
