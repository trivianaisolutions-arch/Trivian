"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "@/lib/use-autoplay";
import { Eyebrow } from "./Eyebrow";

const STEP_SECONDS = 5.5;

const STEPS = [
  {
    title: "Make it readable",
    text: "Clean code, semantic HTML and structured data, so search engines understand exactly what your business is and does.",
    tasks: ["Semantic HTML", "Schema.org data", "Clean URLs & sitemap", "Fast pages", "Accessibility"],
    frame: "What a search engine reads on this page",
    badge: "Live",
  },
  {
    title: "Get found",
    text: "Pages built around what people actually search for — fast enough to rank, with rich results that stand out.",
    tasks: ["Technical SEO", "Search intent", "Content architecture", "Core Web Vitals", "Rich results"],
    frame: "A search results page",
    badge: "Illustration",
  },
  {
    title: "Get cited by AI",
    text: "AI assistants answer questions by quoting sources they can read and trust. We make your site one of them.",
    tasks: ["Clear entities & facts", "Answer-ready content", "AI-crawler access", "Metadata & Open Graph"],
    frame: "An AI assistant answering a customer",
    badge: "Illustration",
  },
];

type Outline = { level: number; text: string }[];

/** Reads this page's real headings and structured data — what a crawler sees. */
function useCrawlerView() {
  const [view, setView] = useState<{ outline: Outline; schema: string[] } | null>(null);
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const outline = Array.from(document.querySelectorAll<HTMLElement>("main h1, main h2")).map((h) => ({
        level: Number(h.tagName[1]),
        text: h.innerText.replace(/\s+/g, " ").trim(),
      }));
      const schema = new Set<string>();
      document.querySelectorAll('script[type="application/ld+json"]').forEach((s) => {
        try {
          const data = JSON.parse(s.textContent ?? "{}");
          for (const node of data["@graph"] ?? [data]) if (node["@type"]) schema.add(node["@type"]);
        } catch {
          /* ignore malformed blocks */
        }
      });
      setView({ outline, schema: [...schema] });
    });
    return () => cancelAnimationFrame(id);
  }, []);
  return view;
}

/** Placeholder for the visitor's own business in the illustrations. */
const You = ({ children }: { children: React.ReactNode }) => <span className="font-semibold text-signal-deep">{children}</span>;

type CrawlerView = ReturnType<typeof useCrawlerView>;

function ReadableStage({ view }: { view: CrawlerView }) {
  return (
    <div className="grid h-full grid-cols-1 gap-6 sm:grid-cols-[1fr_auto]">
      <div className="relative min-h-0 overflow-hidden">
        {/* The crawler reading the page, top to bottom. */}
        <span aria-hidden="true" className="scan-line pointer-events-none absolute inset-0 border-t border-signal" />
        <p className="label text-ash-600">Page outline</p>
        <ul className="mt-3 space-y-1.5 font-mono text-[0.8125rem] text-ink-900">
          {view
            ? view.outline.slice(0, 11).map((h, i) => (
                <li key={i} className="flex gap-3" style={{ paddingLeft: (h.level - 1) * 16 }}>
                  <span className="text-accent">h{h.level}</span>
                  <span className="truncate">{h.text}</span>
                </li>
              ))
            : <li className="text-ash-600">Reading…</li>}
        </ul>
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-bone-50 to-transparent" />
      </div>
      <div className="border-t border-ink-900/15 pt-4 sm:w-48 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
        <p className="label text-ash-600">Structured data</p>
        <ul className="mt-3 space-y-2">
          {(view?.schema ?? []).map((t) => (
            <li key={t} className="flex items-center gap-2 font-mono text-[0.8125rem] text-ink-900">
              <span aria-hidden="true" className="h-2 w-2 bg-signal" />
              {t}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm leading-snug text-ash-600">Search engines read this structure, not the design.</p>
      </div>
    </div>
  );
}

function RankedStage() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border border-ink-900/20 bg-bone-100 px-4 py-2.5 text-[0.9375rem]">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-4-4" />
        </svg>
        <span className="truncate">
          <You>your service</You> near me
        </span>
      </div>
      {/* Your result climbs from the bottom to #1, then the rich-result details appear. */}
      <ol className="relative mt-4 min-h-0 flex-1 space-y-2 overflow-hidden [--row:4.75rem]">
        <li className="rank-yours relative h-[var(--row)] border border-signal-deep bg-bone-100 px-4 py-2.5">
          <p className="flex items-center gap-2 font-mono text-[0.75rem] text-ash-600">
            <span aria-hidden="true" className="h-3 w-3 bg-signal" /> yourbusiness.com
          </p>
          <p className="mt-0.5 truncate font-semibold text-ink-900">Your Business — exactly what you offer</p>
          <p className="rank-extra mt-1 flex gap-3 truncate text-xs text-signal-deep">
            <span>Services</span>
            <span>Pricing</span>
            <span>Book online</span>
            <span>FAQ</span>
          </p>
          <span className="rank-extra label absolute right-3 top-2.5 bg-ink-900 px-1.5 py-0.5 text-bone-50">#1</span>
        </li>
        {[0, 1, 2].map((i) => (
          <li key={i} aria-hidden="true" className="rank-other h-[var(--row)] border border-ink-900/10 px-4 py-3">
            <span className="block h-2 w-24 bg-ink-900/15" />
            <span className="mt-2 block h-2.5 w-3/4 bg-ink-900/25" />
            <span className="mt-2 block h-2 w-1/2 bg-ink-900/10" />
          </li>
        ))}
      </ol>
    </div>
  );
}

function CitedStage() {
  const lines = [
    <>
      Based on their website, <You>Your Business</You> offers <You>your service</You> nearby,
    </>,
    <>with clear pricing and online booking.</>,
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-5">
      <p className="ai-line ml-auto max-w-[80%] bg-ink-900 px-4 py-3 text-[0.9375rem] text-bone-50">
        Who&apos;s the best option for <span className="text-signal">your service</span> near me?
      </p>
      <div className="max-w-[88%] border border-ink-900/15 bg-bone-100 px-4 py-4">
        <p className="label ai-line text-ash-600" style={{ animationDelay: "0.5s" }}>
          AI answer
        </p>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-900">
          {lines.map((l, i) => (
            <span key={i} className="ai-line block" style={{ animationDelay: `${0.9 + i * 0.45}s` }}>
              {l}
            </span>
          ))}
        </p>
        <p className="ai-line mt-4 flex flex-wrap items-center gap-2" style={{ animationDelay: "2s" }}>
          <span className="label text-ash-600">Sources</span>
          <span className="cite-pop label border border-signal-deep bg-signal px-2 py-1 text-ink-950">yourbusiness.com ↗</span>
          <span className="label border border-ink-900/15 px-2 py-1 text-ash-600">another-site.com</span>
        </p>
      </div>
    </div>
  );
}

export function SearchIntelligence() {
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const section = useRef<HTMLElement>(null);
  const inView = useInView(section);
  const reduced = useReducedMotion();
  // Read once, so replaying step 1 doesn't re-measure (and shift) the outline.
  const view = useCrawlerView();
  // The active step's progress bar is the clock: when it fills, the next step plays.
  const running = inView && !paused && !reduced;
  const s = STEPS[step];

  return (
    <section ref={section} id="search" aria-labelledby="search-title" className="surface-bone relative z-10 py-24 md:py-36">
      <div className="shell grid grid-cols-1 gap-x-14 gap-y-10 lg:grid-cols-12">
        <div className="lg:col-span-5 lg:row-start-1">
          <Eyebrow n="06" className="text-ash-600">Search intelligence</Eyebrow>
          <h2 id="search-title" className="display mt-6 text-[clamp(2.1rem,1rem+2.8vw,3.4rem)]">
            Built for search<span className="text-accent">.</span>
            <br />
            <span className="text-ash-600">Ready for AI.</span>
          </h2>
          <p className="lead mt-6 max-w-md text-ash-600">
            Three things have to happen before customers find you online. We engineer all three.
          </p>
        </div>

        {/* All three steps stay visible; the active one is highlighted (nothing moves the layout). */}
        <ol className="border-b border-ink-900/15 lg:col-span-5 lg:row-start-2">
            {STEPS.map((st, i) => {
              const on = i === step;
              return (
                <li key={st.title}>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(i);
                      if (reduced) setPaused(true);
                    }}
                    aria-current={on ? "step" : undefined}
                    className="block w-full text-left"
                  >
                    <span aria-hidden="true" className="relative block h-0.5 overflow-hidden bg-ink-900/15">
                      {i < step && <span className="absolute inset-0 bg-ink-900" />}
                      {on &&
                        (reduced ? (
                          <span className="absolute inset-0 bg-signal-deep" />
                        ) : (
                          <span
                            key={step}
                            onAnimationEnd={() => setStep((x) => (x + 1) % STEPS.length)}
                            className="stage-fill absolute inset-0 bg-signal-deep"
                            style={{ animationDuration: `${STEP_SECONDS}s`, animationPlayState: running ? "running" : "paused" }}
                          />
                        ))}
                    </span>
                    <span className="flex items-baseline gap-4 py-5">
                      <span className={`label ${on ? "text-accent" : "text-ash-600"}`}>0{i + 1}</span>
                      <span className={`display text-[length:var(--step-m)] transition-colors ${on ? "text-ink-900" : "text-ash-600 hover:text-ink-900"}`}>
                        {st.title}
                      </span>
                    </span>
                  </button>
                  <div className="pb-6 pl-9">
                    <p className={`text-[0.9375rem] leading-relaxed transition-colors ${on ? "text-ink-900" : "text-ash-600"}`}>{st.text}</p>
                    <ul aria-label={`${st.title} covers`} className="mt-3 flex flex-wrap gap-1.5">
                      {st.tasks.map((t) => (
                        <li
                          key={t}
                          className={`label border px-2 py-1 transition-colors ${on ? "border-signal-deep text-ink-900" : "border-ink-900/15 text-ash-600"}`}
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
        </ol>

        <div className="max-lg:row-start-2 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:self-center">
          <figure className="flex h-[30rem] flex-col border border-ink-900/15 bg-bone-50 lg:h-[34rem]">
            <figcaption className="label flex items-center justify-between gap-4 border-b border-ink-900/15 px-5 py-3 text-ash-600">
              <span className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPaused((v) => !v)}
                  aria-label={running ? "Pause search walkthrough" : "Play search walkthrough"}
                  data-cursor="play"
                  className="grid h-6 w-6 place-items-center border border-ink-900/30 text-ink-900 hover:border-ink-900"
                >
                  <span aria-hidden="true" className="text-[0.55rem]">{running ? "❚❚" : "▶"}</span>
                </button>
                <span>
                  <span className="text-accent">0{step + 1}</span> {s.frame}
                </span>
              </span>
              <span className={s.badge === "Live" ? "text-accent" : ""}>{s.badge}</span>
            </figcaption>
            {/* Remounted per step so its animation replays. */}
            <div key={step} className="min-h-0 flex-1 p-5 sm:p-7" aria-live={running ? "off" : "polite"}>
              {step === 0 ? <ReadableStage view={view} /> : step === 1 ? <RankedStage /> : <CitedStage />}
            </div>
          </figure>
          <p className="label mt-5 text-ash-600">
            Every site we build ships with a sitemap, robots.txt, canonical URLs, Open Graph and JSON-LD.
          </p>
        </div>
      </div>
    </section>
  );
}
