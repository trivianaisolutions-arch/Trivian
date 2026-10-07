import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NextStep } from "@/components/NextStep";
import { siteConfig } from "@/lib/config";
import { SERVICES } from "@/lib/services";
import { JsonLd, breadcrumbs, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta(
  "Where We Work — Noida & Chandigarh",
  "Trivian AI Solutions works from Noida and Chandigarh, India, building AI agents, automation and websites for clients in every country. Call +91 87074 79271.",
  "/locations",
);

export default function LocationsPage() {
  return (
    <div id="top" className="surface-ink min-h-screen">
      <Navbar />
      <main id="main" tabIndex={-1}>
        <header className="shell pb-16 pt-36">
          <nav aria-label="Breadcrumb" className="label text-ash-400">
            <Link href="/" className="link-line">Studio</Link> <span aria-hidden="true">/</span>{" "}
            <span className="text-bone-100">Where we work</span>
          </nav>
          <h1 className="display mt-8 text-[length:var(--step-xl)]">
            Where we work<span className="text-accent">.</span>
          </h1>
          <p className="lead mt-6 max-w-2xl text-ash-300">
            Our team works from Noida and Chandigarh, India — and builds for businesses in every country.
          </p>
        </header>

        <section aria-label="Our locations" className="surface-bone py-20 md:py-28">
          <div className="shell grid gap-12 md:grid-cols-3">
            {siteConfig.cities.map((c) => (
              <div key={c.city} className="border-t-2 border-ink-900 pt-6">
                <h2 className="display text-[length:var(--step-m)]">{c.city}</h2>
                <p className="label mt-3 text-ash-600">{c.region}, India</p>
                <p className="mt-4 text-[1.0625rem] leading-relaxed">
                  Part of our team works from {c.city}.
                </p>
              </div>
            ))}
            <div className="border-t-2 border-ink-900 pt-6">
              <h2 className="display text-[length:var(--step-m)]">Worldwide</h2>
              <p className="label mt-3 text-ash-600">Every country</p>
              <p className="mt-4 text-[1.0625rem] leading-relaxed">
                We work with clients in India, the US, the UK, Europe, the Middle East and beyond — over video calls and email.
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="reach-title" className="shell grid gap-12 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-5">
            <h2 id="reach-title" className="display text-[length:var(--step-l)]">
              Talk to us<span className="text-accent">.</span>
            </h2>
            <dl className="mt-10 space-y-6">
              <div>
                <dt className="label text-ash-400">Phone</dt>
                <dd className="mt-2 text-xl">
                  <a href={siteConfig.phoneHref} className="link-line">{siteConfig.phone}</a>
                </dd>
              </div>
              <div>
                <dt className="label text-ash-400">Email</dt>
                <dd className="mt-2 text-xl">
                  <a href={`mailto:${siteConfig.contactEmail}`} className="link-line">{siteConfig.contactEmail}</a>
                </dd>
              </div>
              <div>
                <dt className="label text-ash-400">Project brief</dt>
                <dd className="mt-2 text-xl">
                  <Link href="/contact" className="link-line">Send it online — we reply within 24 hours</Link>
                </dd>
              </div>
            </dl>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <h2 className="label text-ash-400">What we build, wherever you are</h2>
            <ul className="mt-6 border-t border-bone-100/10">
              {SERVICES.map((s) => (
                <li key={s.slug} className="border-b border-bone-100/10">
                  <Link href={`/services/${s.slug}`} className="flex items-baseline justify-between gap-4 py-4 transition-colors hover:text-signal">
                    <span className="text-lg">{s.seo.title}</span>
                    <span aria-hidden="true" className="label">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <NextStep />
      <Footer />
      <JsonLd data={breadcrumbs([{ name: "Studio", path: "/" }, { name: "Where we work", path: "/locations" }])} />
    </div>
  );
}
