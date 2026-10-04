import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CaseStudyIndex } from "@/components/CaseStudyIndex";
import { JsonLd, breadcrumbs } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Selected Work",
  description:
    "Production projects designed, built and launched by Trivian AI Solutions — member platforms, media platforms and e-commerce, with transparent technical breakdowns.",
  alternates: { canonical: "/case-studies" },
};

export default function CaseStudiesPage() {
  return (
    <div id="top" className="surface-ink min-h-screen">
      <Navbar />
      <main id="main" tabIndex={-1} className="shell pb-28 pt-36">
        <nav aria-label="Breadcrumb" className="label text-ash-400">
          <Link href="/" className="link-line">Studio</Link> <span aria-hidden="true">/</span> <span className="text-bone-100">Work</span>
        </nav>
        <h1 className="display mt-8 text-[length:var(--step-xl)]">
          Selected work<span className="text-accent">.</span>
        </h1>
        <p className="lead mt-6 max-w-2xl text-ash-300">
          Real projects designed, built and launched into production by our three-person team —
          described as built, with links to the live sites.
        </p>
        <div className="mt-14">
          <CaseStudyIndex />
        </div>
      </main>
      <Footer />
      <JsonLd data={breadcrumbs([{ name: "Studio", path: "/" }, { name: "Selected work", path: "/case-studies" }])} />
    </div>
  );
}
