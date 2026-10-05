import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ContactSection } from "@/components/ContactSection";
import { Faq } from "@/components/Faq";
import { GENERAL_FAQS } from "@/lib/faqs";
import { JsonLd, breadcrumbs, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta(
  "Start a Project",
  "Talk directly with our three-person engineering team about your AI automation, website, web application, SaaS, 3D or search project.",
  "/contact",
);

export default function ContactPage() {
  return (
    <div id="top" className="min-h-screen">
      <Navbar />
      <main id="main" tabIndex={-1} data-inner className="pt-[var(--nav-h)]">
        <ContactSection standalone />

        <Faq
          faqs={GENERAL_FAQS}
          title={
            <>
              Questions,
              <br />
              <span className="text-ash-400">answered.</span>
            </>
          }
        />
      </main>
      <Footer />
      <JsonLd data={breadcrumbs([{ name: "Studio", path: "/" }, { name: "Start a project", path: "/contact" }])} />
    </div>
  );
}
