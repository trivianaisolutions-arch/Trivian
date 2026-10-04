import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AboutUs } from "@/components/AboutUs";
import { NextStep } from "@/components/NextStep";
import { JsonLd, breadcrumbs, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta(
  "About Us",
  "Trivian AI Solutions is three engineers combining AI engineering, automation, web development, 3D and search — you work directly with the people who build.",
  "/about",
);

export default function AboutPage() {
  return (
    <div id="top" className="min-h-screen">
      <Navbar />
      <main id="main" tabIndex={-1} data-inner className="pt-[var(--nav-h)]">
        <AboutUs standalone />
        <NextStep next={{ href: "/case-studies", title: "See the work" }} />
      </main>
      <Footer />
      <JsonLd data={breadcrumbs([{ name: "Studio", path: "/" }, { name: "About", path: "/about" }])} />
    </div>
  );
}
