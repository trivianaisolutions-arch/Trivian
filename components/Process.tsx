"use client";

import { useRef } from "react";
import Link from "next/link";
import { useSectionProgress } from "@/lib/use-section-progress";
import { Eyebrow } from "./Eyebrow";

// Stroke elements with class "draw" (pathLength=1) redraw when their stage becomes active.
const ACCENT = "var(--color-signal)";
const ICONS = [
  // Discover — magnifying glass over notes
  <g key="discover">
    <rect className="draw" pathLength={1} x="16" y="18" width="58" height="74" />
    <path className="draw" pathLength={1} d="M28 38h34M28 50h26M28 62h30" />
    <path d="M28 50h26" stroke={ACCENT} strokeWidth="3" />
    <circle className="draw" pathLength={1} cx="76" cy="70" r="20" fill="var(--color-bone-100)" />
    <path className="draw" pathLength={1} d="M90 84l16 16" strokeWidth="4" />
    <circle cx="76" cy="70" r="6" fill={ACCENT} stroke="none" />
  </g>,
  // Architect — sitemap tree
  <g key="architect">
    <rect x="46" y="12" width="28" height="18" fill={ACCENT} stroke="none" />
    <path className="draw" pathLength={1} d="M60 30v12M24 42h72M24 42v12M60 42v12M96 42v12" />
    <rect className="draw" pathLength={1} x="12" y="54" width="24" height="16" />
    <rect className="draw" pathLength={1} x="48" y="54" width="24" height="16" />
    <rect className="draw" pathLength={1} x="84" y="54" width="24" height="16" />
    <path className="draw" pathLength={1} d="M60 70v12M44 82h32M44 82v8M76 82v8" />
    <rect className="draw" pathLength={1} x="34" y="90" width="20" height="14" />
    <rect className="draw" pathLength={1} x="66" y="90" width="20" height="14" />
  </g>,
  // Design — page layout with a pen
  <g key="design">
    <rect className="draw" pathLength={1} x="12" y="16" width="84" height="84" />
    <path className="draw" pathLength={1} d="M12 30h84M22 42h40M22 50h28" />
    <rect className="draw" pathLength={1} x="68" y="40" width="20" height="20" />
    <rect x="22" y="58" width="22" height="9" fill={ACCENT} stroke="none" />
    <path className="draw" pathLength={1} d="M22 78h30M58 78h30M22 88h30M58 88h30" />
    <path className="draw" pathLength={1} d="M112 58L84 106l-6 8 2-10 28-48z" fill="var(--color-bone-100)" />
  </g>,
  // Build — code brackets
  <g key="build">
    <path className="draw" pathLength={1} d="M42 34L16 60l26 26M78 34l26 26-26 26" strokeWidth="4" />
    <path d="M68 24L52 96" stroke={ACCENT} strokeWidth="5" />
  </g>,
  // Integrate — modules joined by a connector, satellites attached
  <g key="integrate">
    <rect className="draw" pathLength={1} x="8" y="46" width="34" height="28" />
    <rect className="draw" pathLength={1} x="70" y="46" width="34" height="28" />
    <path className="draw" pathLength={1} d="M42 60h28" strokeWidth="3" />
    <circle cx="56" cy="60" r="6" fill={ACCENT} stroke="none" />
    <path className="draw" pathLength={1} d="M87 46V30M87 74v16" />
    <rect className="draw" pathLength={1} x="78" y="14" width="18" height="16" />
    <rect className="draw" pathLength={1} x="78" y="90" width="18" height="16" />
  </g>,
  // Optimize — performance gauge
  <g key="optimize">
    <path className="draw" pathLength={1} d="M18 86a42 42 0 0 1 84 0" strokeWidth="3" />
    <path className="draw" pathLength={1} d="M24 64l6 4M42 46l4 6M60 40v7M78 46l-4 6M96 64l-6 4" />
    <path d="M60 86l26-30" stroke={ACCENT} strokeWidth="4" />
    <circle cx="60" cy="86" r="5" fill="currentColor" stroke="none" />
    <path className="draw" pathLength={1} d="M30 100h60" />
  </g>,
  // Launch — rocket
  <g key="launch">
    <path className="draw" pathLength={1} d="M60 10c16 14 20 38 16 64H44c-4-26 0-50 16-64z" fill="var(--color-bone-100)" />
    <circle className="draw" pathLength={1} cx="60" cy="40" r="7" />
    <path className="draw" pathLength={1} d="M44 60L30 82l14-6M76 60l14 22-14-6" />
    <path d="M50 78q10 30 20 0z" fill={ACCENT} stroke="none" />
  </g>,
];

const STAGES = [
  { title: "Discover", tasks: ["Workflows", "User journeys", "Constraints", "Goals"], text: "We analyse business workflows, user journeys, technical constraints and commercial targets.", output: "Scope and objective spec" },
  { title: "Architect", tasks: ["Architecture", "Data models", "APIs", "Milestones"], text: "We define the software architecture, data models, third-party APIs and deployment milestones.", output: "System blueprint" },
  { title: "Design", tasks: ["Interfaces", "Readability", "Conversion", "Brand"], text: "We design high-contrast, responsive interfaces focused on readability, conversion and brand precision.", output: "Interactive UX prototype" },
  { title: "Build", tasks: ["Frontend", "Backend", "Database", "AI services"], text: "We write the frontend, backend services, database schemas and AI services in typed code.", output: "Production codebase" },
  { title: "Integrate", tasks: ["CRM", "Calendars", "Payments", "Email"], text: "We connect the system to the tools you already run — CRM, calendars, payments, email and APIs.", output: "Connected integrations" },
  { title: "Optimize", tasks: ["Testing", "Accessibility", "Core Web Vitals"], text: "End-to-end testing, accessibility checks and Core Web Vitals optimisation.", output: "Tested, measured build" },
  { title: "Launch", tasks: ["Domain", "Deployment", "Handoff"], text: "Domain configuration, production deployment and a documented handoff. You own the code.", output: "Live software" },
];

export function Process({ standalone = false }: { standalone?: boolean }) {
  const Heading = standalone ? "h1" : "h2";
  const StepHeading = standalone ? "h2" : "h3";
  const ref = useRef<HTMLElement>(null);
  const step = useSectionProgress(ref, STAGES.length);

  return (
    <section ref={ref} id="process" aria-labelledby="process-title" className="surface-bone relative z-10 [--panel-w:min(34rem,40vw)] lg:h-[420svh]">
      <div className="lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col lg:overflow-hidden">
        <div className="shell pt-24 lg:pt-[calc(var(--nav-h)+1.5rem)]">
          <Eyebrow n="08" className="text-ash-600">Process</Eyebrow>
          <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <Heading id="process-title" className="display text-[clamp(2.1rem,1rem+3vw,4rem)]">
              Idea to production
              <br />
              <span className="text-ash-600">in seven stages.</span>
            </Heading>
            <p className="max-w-sm text-[0.9375rem] leading-relaxed text-ash-600">
              One team takes your project through every stage. You always know where it is, what
              you get from it and what comes next.
            </p>
          </div>

          {/* The whole journey at a glance; fills as you scroll (desktop). */}
          <ol aria-hidden="true" className="relative mt-8 hidden grid-cols-7 lg:grid">
            <span className="absolute left-[calc(100%/14)] right-[calc(100%/14)] top-[7px] h-px bg-ink-900/15">
              <span className="absolute inset-y-0 left-0 bg-signal-deep transition-[width] duration-500 ease-expo" style={{ width: `${(step / (STAGES.length - 1)) * 100}%` }} />
            </span>
            {STAGES.map((s, i) => (
              <li key={s.title} className="relative flex flex-col items-center gap-2.5">
                <span
                  className={`h-[15px] w-[15px] border transition-colors duration-300 ${
                    i < step ? "border-ink-900 bg-ink-900" : i === step ? "border-signal-deep bg-signal" : "border-ink-900/30 bg-bone-100"
                  }`}
                />
                <span className={`label transition-colors ${i === step ? "text-ink-900" : "text-ash-600"}`}>
                  <span className="text-accent">0{i + 1}</span> {s.title}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Desktop: one panel per stage on a track moved by vertical scroll. Mobile: a vertical timeline. */}
        <ol
          className="process-track mt-12 pb-16 lg:my-auto lg:flex lg:w-max lg:py-6 lg:pl-[clamp(1rem,4vw,3rem)]"
          style={{ "--step": step } as React.CSSProperties}
        >
          {STAGES.map((s, i) => {
            const on = i === step;
            return (
              <li
                key={s.title}
                data-active={on ? "" : undefined}
                aria-current={on ? "step" : undefined}
                className="group shell grid grid-cols-[1.25rem_1fr] gap-x-5 lg:mx-0 lg:block lg:w-[var(--panel-w)] lg:max-w-none lg:px-0"
              >
                {/* Mobile timeline rail */}
                <span aria-hidden="true" className="relative flex justify-center lg:hidden">
                  <span className="absolute bottom-0 top-5 w-px bg-ink-900/20 group-last:hidden" />
                  <span className={`relative mt-1.5 h-3 w-3 border transition-colors ${i <= step ? "border-signal-deep bg-signal" : "border-ink-900/40 bg-bone-100"}`} />
                </span>

                <div className="pb-14 lg:border-l lg:border-ink-900/15 lg:px-10 lg:pb-0">
                  <div className="flex items-start justify-between gap-6">
                    <svg
                      viewBox="0 0 120 120"
                      aria-hidden="true"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="square"
                      className={`stage-icon h-20 w-20 shrink-0 text-ink-900 transition-opacity duration-500 lg:h-24 lg:w-24 ${on ? "" : "lg:opacity-40"}`}
                    >
                      {ICONS[i]}
                    </svg>
                    <span aria-hidden="true" data-n={`0${i + 1}`} className="ghost-n display text-[clamp(3rem,2rem+3vw,5.5rem)] leading-none text-ink-900/10" />
                  </div>
                  <StepHeading className={`display mt-5 text-[length:var(--step-m)] transition-colors duration-500 ${on ? "" : "lg:text-ash-600"}`}>{s.title}</StepHeading>
                  <ul aria-label={`${s.title} covers`} className="mt-3 flex flex-wrap gap-1.5">
                    {s.tasks.map((t) => (
                      <li key={t} className="label border border-ink-900/20 px-2 py-1 text-ink-900">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 max-w-sm text-[0.9375rem] leading-relaxed text-ash-600">{s.text}</p>
                  <p className="label mt-5 text-ink-900">
                    <span className="text-accent">You get →</span> {s.output}
                  </p>
                </div>
              </li>
            );
          })}
          {/* End of the journey: the next step is yours. */}
          <li className="shell lg:mx-0 lg:flex lg:w-[var(--panel-w)] lg:max-w-none lg:items-center lg:px-0">
            <div className="border-t-2 border-ink-900 pt-8 lg:ml-10 lg:border-l lg:border-t-0 lg:border-ink-900/15 lg:pl-10 lg:pt-0">
              <p className="display text-[length:var(--step-m)]">
                Your system, live<span className="text-accent">.</span>
              </p>
              <p className="mt-3 max-w-xs text-[0.9375rem] leading-relaxed text-ash-600">Tell us what you want to build and we&apos;ll map it to these seven stages.</p>
              <Link href="/contact" className="btn btn-signal mt-6">
                Start a project <span aria-hidden="true" className="btn-arrow">→</span>
              </Link>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}
