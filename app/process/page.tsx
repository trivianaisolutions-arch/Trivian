import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Process } from "@/components/Process";
import { NextStep } from "@/components/NextStep";
import { JsonLd, breadcrumbs, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta(
  "Our Process",
  "Discover, architect, design, build, integrate, optimize, launch — how Trivian AI Solutions takes an idea to production software.",
  "/process",
);

export default function ProcessPage() {
  return (
    <div id="top" className="min-h-screen">
      <Navbar />
      <main id="main" tabIndex={-1} data-inner className="pt-[var(--nav-h)]">
        <Process standalone />
        <NextStep next={{ href: "/services", title: "What we build" }} />
      </main>
      <Footer />
      <JsonLd data={breadcrumbs([{ name: "Studio", path: "/" }, { name: "Process", path: "/process" }])} />
    </div>
  );
}
