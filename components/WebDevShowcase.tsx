"use client";

import { useRef, useState } from "react";
import { useInView, useReducedMotion } from "@/lib/use-autoplay";
import { Eyebrow } from "./Eyebrow";

const STAGES = [
  { stage: "Strategy", view: "Wireframe", text: "Goals, audience and the one action each page has to drive. Content is placed before anything is styled." },
  { stage: "Architecture", view: "Structure", text: "Sitemap, URL structure, grid and component inventory — the skeleton everything else hangs on." },
  { stage: "Design", view: "Interface", text: "Typography, colour and hierarchy built for readability, conversion and brand precision." },
  { stage: "Development", view: "Motion", text: "Typed Next.js and React components, real interactions and transitions that respond to the user." },
  { stage: "3D", view: "3D", text: "Where depth explains something, WebGL and 3D layers go in — with fallbacks for every device." },
  { stage: "SEO", view: "SEO", text: "Semantic HTML, metadata, structured data and Core Web Vitals, checked page by page." },
  { stage: "Deployment", view: "Production", text: "Tested, deployed, documented and handed over. You own the code." },
];

/** The page being built. Its look is driven entirely by data-* attributes (see globals.css). */
function Specimen({ stage }: { stage: number }) {
  return (
    <div
      className="specimen relative aspect-[4/3.1] w-full"
      data-stage={stage}
      data-structure={stage >= 1 ? "" : undefined}
      data-ui={stage >= 2 ? "" : undefined}
      aria-hidden="true"
    >
      <div className="sp-stage absolute inset-0 flex flex-col gap-[3%] p-[4%]">
        {/* 12-column grid overlay (structure stage) */}
        <div className="sp-grid pointer-events-none absolute inset-[4%] grid grid-cols-12 gap-[2%]">
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} className="bg-signal/10" />
          ))}
        </div>

        <div className="sp-block sp-z1 flex h-[9%] items-center justify-between px-[3%]">
          <span className="sp-tag">nav</span>
          <span className="sp-seo label absolute -top-5 left-0 text-signal-deep">&lt;header&gt;</span>
          <span className="sp-ink h-[34%] w-[16%] bg-ink-900" />
          <span className="sp-ink flex w-[34%] justify-between">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="h-1 w-[18%] bg-ash-600" />
            ))}
          </span>
        </div>

        <div className="flex h-[44%] gap-[3%]">
          <div className="sp-block sp-z2 flex w-[62%] flex-col justify-end gap-[6%] p-[4%]">
            <span className="sp-tag">hero</span>
            <span className="sp-seo label absolute -top-5 left-0 text-signal-deep">&lt;h1&gt;</span>
            <span className="sp-ink sp-motion display text-[clamp(1rem,2.6vw,2.4rem)] leading-[0.9] text-ink-900">A clear promise.</span>
            <span className="sp-ink h-1.5 w-[70%] bg-ash-600/60" />
            <span className="sp-ink sp-pulse sp-accent h-[14%] w-[34%] bg-ink-900" />
          </div>
          <div className="sp-block sp-dark sp-z3 w-[35%] overflow-hidden">
            <span className="sp-tag">media</span>
            <span className="sp-seo label absolute -top-5 left-0 text-signal-deep">&lt;figure&gt;</span>
            <span className="sp-ink sp-motion absolute inset-[18%] border border-bone-100/30" />
          </div>
        </div>

        <div className="flex flex-1 gap-[3%]">
          <div className="sp-block sp-z1 w-[40%] p-[4%]">
            <span className="sp-tag">content</span>
            <span className="sp-seo label absolute -top-5 left-0 text-signal-deep">&lt;article&gt;</span>
            <span className="sp-ink block h-1.5 w-[80%] bg-ink-900" />
            <span className="sp-ink mt-2 block h-1 w-[90%] bg-ash-600/60" />
            <span className="sp-ink mt-1.5 block h-1 w-[70%] bg-ash-600/60" />
          </div>
          <div className="sp-block sp-z2 flex-1 p-[4%]">
            <span className="sp-tag">content</span>
            <span className="sp-seo label absolute -top-5 left-0 text-signal-deep">&lt;section&gt;</span>
            <span className="sp-ink block h-1.5 w-[60%] bg-ink-900" />
            <span className="sp-ink mt-2 block h-1 w-[85%] bg-ash-600/60" />
          </div>
        </div>

        <div className="sp-block sp-dark sp-z1 h-[8%]">
          <span className="sp-tag">footer</span>
          <span className="sp-seo label absolute -top-5 left-0 text-signal-deep">&lt;footer&gt;</span>
        </div>
      </div>

      <ul className="sp-seo label absolute -bottom-9 left-0 flex flex-wrap gap-x-4 text-signal-deep">
        <li>title</li>
        <li>meta description</li>
        <li>canonical</li>
        <li>JSON-LD</li>
      </ul>
    </div>
  );
}

export function WebDevShowcase() {
  const [stage, setStage] = useState(0);
  const [paused, setPaused] = useState(false);
  const section = useRef<HTMLElement>(null);
  const inView = useInView(section);
  const reduced = useReducedMotion();
  const s = STAGES[stage];
  // The progress bar's CSS animation is the clock: when it ends, the next stage starts.
  // Plays whenever the section is on screen — no mouse or touch needed.
  const running = inView && !paused && !reduced;

  const next = () => setStage((i) => (i + 1) % STAGES.length);

  return (
    <section ref={section} id="web" aria-labelledby="web-title" className="surface-bone relative z-10 py-24 md:py-36">
      <div className="shell">
        <Eyebrow n="04" className="text-ash-600">Website engineering</Eyebrow>
        <h2 id="web-title" className="display mt-6 max-w-5xl text-[length:var(--step-l)]">
          Website development
          <br />
          <span className="text-ash-600">without the template.</span>
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <Specimen stage={stage} />
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <p className="label text-ash-600">
              Stage {stage + 1} / 7 <span className="text-accent">→ {s.view}</span>
            </p>
            <h3 className="display mt-4 text-[length:var(--step-m)]">{s.stage}</h3>
            {/* Announce only stage changes the visitor asked for, not every autoplay tick. */}
            <p className="mt-4 min-h-[4.5em] text-[0.9375rem] leading-relaxed text-ash-600" aria-live={running ? "off" : "polite"}>
              {s.text}
            </p>
          </div>
        </div>

        {/* Build timeline: plays on its own; any stage can be opened directly. */}
        <div className="mt-20 flex items-start gap-4 sm:gap-8">
          <button
            type="button"
            onClick={() => setPaused((v) => !v)}
            aria-label={paused || reduced ? "Play build sequence" : "Pause build sequence"}
            data-cursor="play"
            className="label grid h-10 w-10 shrink-0 place-items-center border border-ink-900/30 transition-colors hover:border-ink-900"
          >
            <span aria-hidden="true">{running ? "❚❚" : "▶"}</span>
          </button>
          <ol className="grid flex-1 grid-cols-7 gap-1.5 sm:gap-3">
            {STAGES.map((st, i) => (
              <li key={st.stage}>
                <button
                  type="button"
                  onClick={() => {
                    setStage(i);
                    if (reduced) setPaused(true);
                  }}
                  aria-current={i === stage ? "step" : undefined}
                  aria-label={`Stage ${i + 1}: ${st.stage}`}
                  className={`label block w-full text-left transition-colors max-sm:text-[0.5625rem] ${i === stage ? "text-ink-900" : "text-ash-600 hover:text-ink-900"}`}
                >
                  <span aria-hidden="true" className="relative mb-3 block h-0.5 overflow-hidden bg-ink-900/15">
                    {i < stage && <span className="absolute inset-0 bg-ink-900" />}
                    {i === stage &&
                      (reduced ? (
                        <span className="absolute inset-0 bg-signal-deep" />
                      ) : (
                        <span
                          key={stage}
                          onAnimationEnd={next}
                          className="stage-fill absolute inset-0 bg-signal-deep"
                          style={{ animationPlayState: running ? "running" : "paused" }}
                        />
                      ))}
                  </span>
                  <span className="text-accent">0{i + 1}</span>
                  <span className="mt-1 block truncate max-sm:hidden">{st.stage}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
