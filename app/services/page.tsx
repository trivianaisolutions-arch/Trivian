import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NextStep } from "@/components/NextStep";
import { SERVICES } from "@/lib/services";
import { siteConfig } from "@/lib/config";
import { JsonLd, breadcrumbs } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Services",
  description:
    "AI automation, AI agents, website engineering, 3D experiences, search intelligence and digital systems — engineered as one connected system.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <div id="top" className="surface-ink min-h-screen">
      <Navbar />
      <main id="main" tabIndex={-1} data-inner>
        <div className="shell pb-16 pt-36">
          <nav aria-label="Breadcrumb" className="label text-ash-400">
            <Link href="/" className="link-line">Studio</Link> <span aria-hidden="true">/</span> <span className="text-bone-100">Services</span>
          </nav>
          <h1 className="display mt-8 text-[length:var(--step-xl)]">
            Six capabilities<span className="text-accent">.</span>
            <br />
            <span className="text-ash-400">One system.</span>
          </h1>
          <p className="lead mt-8 max-w-2xl text-ash-300">{siteConfig.positioningStatement}</p>
        </div>

        <ol className="border-t border-bone-100/10">
          {SERVICES.map((s, i) => (
            <li key={s.slug} className="group border-b border-bone-100/10">
              <Link href={`/services/${s.slug}`} data-cursor="explore" className="shell grid gap-5 py-10 md:grid-cols-12 md:items-baseline md:py-12">
                <span className="label text-accent md:col-span-1">0{i + 1}</span>
                <span className="display text-[clamp(2rem,1rem+3.6vw,4.5rem)] transition-colors group-hover:text-signal md:col-span-6">
                  {s.title}
                </span>
                <span className="md:col-span-5">
                  <span className="block text-[0.9375rem] leading-relaxed text-ash-300">{s.summary}</span>
                  <span className="label mt-3 block text-ash-400">{s.for}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>

        <NextStep next={{ href: "/process", title: "How we work: the process" }} />
      </main>
      <Footer />
      <JsonLd data={breadcrumbs([{ name: "Studio", path: "/" }, { name: "Services", path: "/services" }])} />
    </div>
  );
}
