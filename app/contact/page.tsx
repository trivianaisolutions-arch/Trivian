import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ContactSection } from "@/components/ContactSection";
import { JsonLd, breadcrumbs } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Start a Project",
  description:
    "Talk directly with our three-person engineering team about your AI automation, website, web application, SaaS, 3D or search project.",
  alternates: { canonical: "/contact" },
};

const faqs = [
  {
    q: "How does your studio engage with clients?",
    a: "You work directly with the three founding engineers building your product. There are no account managers or outsourced junior teams in the middle.",
  },
  {
    q: "What is your typical project timeline?",
    a: "High-converting websites typically take 2-3 weeks. Full custom web applications and SaaS MVPs range between 4 to 8 weeks depending on database complexity and API requirements.",
  },
  {
    q: "Can you add AI or automation to our existing software?",
    a: "Yes. We frequently integrate RAG systems, customer assistants, document processing pipelines, and voice calling agents directly into preexisting production databases and codebases.",
  },
  {
    q: "Do you offer code handoff and documentation?",
    a: "Every project includes full intellectual property ownership, typed TypeScript repositories, clean README documentation, and seamless Vercel / cloud deployment handoff.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function ContactPage() {
  return (
    <div id="top" className="min-h-screen">
      <Navbar />
      <main id="main" tabIndex={-1} data-inner className="pt-[var(--nav-h)]">
        <ContactSection standalone />

        <section aria-labelledby="faq-title" className="surface-ink py-24 md:py-32">
          <div className="shell grid grid-cols-1 gap-12 lg:grid-cols-12">
            <h2 id="faq-title" className="display text-[length:var(--step-l)] lg:col-span-5">
              Questions,
              <br />
              <span className="text-ash-400">answered.</span>
            </h2>
            <div className="border-t border-bone-100/10 lg:col-span-7">
              {faqs.map((f, i) => (
                <details key={f.q} className="group border-b border-bone-100/10">
                  <summary className="flex cursor-pointer list-none items-baseline gap-5 py-6 [&::-webkit-details-marker]:hidden">
                    <span className="label text-accent">0{i + 1}</span>
                    <span className="flex-1 text-lg font-semibold">{f.q}</span>
                    <span aria-hidden="true" className="label transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="pb-6 pl-10 text-[0.9375rem] leading-relaxed text-ash-300">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbs([{ name: "Studio", path: "/" }, { name: "Start a project", path: "/contact" }])} />
    </div>
  );
}
