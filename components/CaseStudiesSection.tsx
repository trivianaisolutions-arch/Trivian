import Link from "next/link";
import Image from "next/image";
import { caseStudies, hostOf } from "@/lib/case-studies";
import { Eyebrow } from "./Eyebrow";

export function CaseStudiesSection() {
  return (
    <section id="work" tabIndex={-1} aria-labelledby="work-title" className="surface-ink relative z-10 py-24 md:py-36">
      <div className="shell flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow n="07" className="text-ash-300">Selected work</Eyebrow>
          <h2 id="work-title" className="display mt-6 text-[length:var(--step-l)]">
            Shipped<span className="text-accent">.</span> Live<span className="text-accent">.</span>
            <br />
            <span className="text-ash-400">In production.</span>
          </h2>
        </div>
        <p className="max-w-sm text-[0.9375rem] leading-relaxed text-ash-300">
          Real projects we designed, built and launched. Each one is described as built — no
          invented metrics.
        </p>
      </div>

      <ol className="mt-20 border-t border-bone-100/10">
        {caseStudies.map((study, i) => (
          <li key={study.slug} className="group border-b border-bone-100/10">
            <article className="shell py-12 md:py-16">
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
                <header className="flex items-start gap-6 md:gap-10 lg:col-span-7">
                  <span className="label pt-3 text-accent">0{i + 1}</span>
                  <div className="min-w-0">
                    <Link href={`/case-studies/${study.slug}`} data-cursor="view" className="block">
                      <h3 className="work-title display text-[clamp(2.2rem,1rem+4.2vw,5.75rem)] text-bone-50 transition-colors duration-300 group-hover:text-signal">
                        {study.title}
                      </h3>
                    </Link>
                    <p className="label mt-4 text-ash-400">{study.tagline}</p>
                  </div>
                </header>

                <Link href={`/case-studies/${study.slug}`} data-cursor="view" tabIndex={-1} aria-hidden="true" className="work-shot block overflow-hidden border border-bone-100/10 md:ml-16 lg:col-span-5 lg:ml-0">
                  <Image
                    src={study.image}
                    alt={study.imageAlt}
                    placeholder="blur"
                    sizes="(min-width: 1440px) 540px, (min-width: 1024px) 38vw, (min-width: 768px) 88vw, 100vw"
                    className="w-full transition-transform duration-700 ease-expo group-hover:scale-[1.03]"
                  />
                </Link>
              </div>

              <dl className="mt-12 grid gap-8 text-[0.9375rem] leading-relaxed sm:grid-cols-2 lg:grid-cols-12 lg:gap-6 md:pl-16">
                <div className="lg:col-span-2">
                  <dt className="label text-ash-400">Project</dt>
                  <dd className="mt-3 text-bone-100">{study.client}</dd>
                  <dd className="mt-1 text-sm text-ash-400">{study.category}</dd>
                </div>
                <div className="lg:col-span-3">
                  <dt className="label text-ash-400">Problem</dt>
                  <dd className="mt-3 text-ash-300">{study.problem}</dd>
                </div>
                <div className="lg:col-span-3">
                  <dt className="label text-ash-400">System</dt>
                  <dd className="mt-3 text-ash-300">{study.solution}</dd>
                </div>
                <div className="lg:col-span-2">
                  <dt className="label text-ash-400">Technology</dt>
                  <dd className="mt-3">
                    <ul className="space-y-1 font-mono text-[0.8125rem] text-ash-300">
                      {study.technologies.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div className="lg:col-span-2">
                  <dt className="label text-ash-400">Result</dt>
                  <dd className="mt-3 text-bone-100">{study.badge}, live in production.</dd>
                  <dd className="mt-3 flex flex-col gap-2">
                    <a href={study.liveUrl} target="_blank" rel="noopener noreferrer" className="label link-line w-fit break-all text-bone-100">
                      {hostOf(study.liveUrl)} ↗<span className="sr-only"> (opens in a new tab)</span>
                    </a>
                    <Link href={`/case-studies/${study.slug}`} className="label link-line w-fit text-accent">
                      Case study →
                    </Link>
                  </dd>
                </div>
              </dl>
            </article>
          </li>
        ))}
      </ol>

      <div className="shell mt-12">
        <Link href="/case-studies" className="btn btn-line">
          Index of all work <span aria-hidden="true" className="btn-arrow">→</span>
        </Link>
      </div>
    </section>
  );
}
