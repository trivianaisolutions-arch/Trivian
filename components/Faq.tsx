import type { ReactNode } from "react";
import type { Faq as FaqItem } from "@/lib/faqs";
import { JsonLd } from "@/lib/seo";

const TONES = {
  ink: { surface: "surface-ink", rule: "border-bone-100/10", muted: "text-ash-300" },
  bone: { surface: "surface-bone", rule: "border-ink-900/15", muted: "text-ash-600" },
};

/** Open/close question list (native <details>, no JS) plus its FAQPage structured data. */
export function Faq({ faqs, title, tone = "ink" }: { faqs: FaqItem[]; title: ReactNode; tone?: keyof typeof TONES }) {
  const t = TONES[tone];
  return (
    <section aria-labelledby="faq-title" className={`${t.surface} relative z-10 border-t ${t.rule} py-24 md:py-32`}>
      <div className="shell grid grid-cols-1 gap-12 lg:grid-cols-12">
        <h2 id="faq-title" className="display text-[length:var(--step-l)] lg:col-span-5">
          {title}
        </h2>
        <div className={`border-t ${t.rule} lg:col-span-7`}>
          {faqs.map((f, i) => (
            <details key={f.q} className={`group border-b ${t.rule}`}>
              <summary className="flex cursor-pointer list-none items-baseline gap-5 py-6 [&::-webkit-details-marker]:hidden">
                <span className="label text-accent">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 text-lg font-semibold">{f.q}</span>
                <span aria-hidden="true" className="label transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className={`pb-6 pl-10 text-[0.9375rem] leading-relaxed ${t.muted}`}>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
    </section>
  );
}
