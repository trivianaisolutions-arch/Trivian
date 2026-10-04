"use client";

import { useRef } from "react";
import { useSectionProgress } from "@/lib/use-section-progress";
import { Eyebrow } from "./Eyebrow";

// Top → bottom; the 3D scene highlights layer (5 - step) as this list advances.
const LAYERS = [
  { name: "Search", text: "How people and AI systems find you — structure, metadata, structured data." },
  { name: "Content", text: "What you say, organised around what people actually look for." },
  { name: "Interface", text: "Where people act — fast, accessible, designed for the action that matters." },
  { name: "Automation", text: "What happens next — workflows, webhooks and background jobs." },
  { name: "AI", text: "Understanding and decisions — agents, retrieval and language models." },
  { name: "Data", text: "The memory underneath — schemas, APIs and integrations." },
];

export function SystemLayers() {
  const ref = useRef<HTMLElement>(null);
  const step = useSectionProgress(ref, LAYERS.length);

  return (
    <section ref={ref} id="systems" tabIndex={-1} data-scene="layers" aria-labelledby="systems-title" className="relative h-[320svh]">
      <div className="sticky top-0 flex h-svh flex-col justify-end pb-10 pt-[calc(var(--nav-h)+1.5rem)] lg:justify-center lg:pb-0">
        <div className="shell">
          <div className="max-lg:bg-ink-950 max-lg:pt-6 lg:max-w-md">
            <Eyebrow n="05" className="text-ash-300">Inside the system</Eyebrow>
            <h2 id="systems-title" className="display mt-5 text-[length:var(--step-l)]">
              Every layer,
              <br />
              engineered<span className="text-accent">.</span>
            </h2>
            <p className="mt-5 text-[0.9375rem] leading-relaxed text-ash-300 max-sm:hidden">
              Scroll to open the stack. Each layer is part of what we build — and they only work
              because they&apos;re connected.
            </p>

            <ol className="mt-8 border-t border-bone-100/10">
              {LAYERS.map((l, i) => {
                const on = i === step;
                return (
                  <li key={l.name} aria-current={on ? "true" : undefined} className="border-b border-bone-100/10 py-2.5 lg:py-3">
                    <p className={`label flex gap-4 transition-colors ${on ? "text-bone-50" : "text-ash-400"}`}>
                      <span className={on ? "text-accent" : ""}>0{LAYERS.length - i}</span>
                      {l.name}
                    </p>
                    <p
                      className={`grid text-sm leading-snug text-ash-300 transition-[grid-template-rows,opacity] duration-500 ease-expo ${
                        on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <span className="overflow-hidden pl-9 pt-1.5">{l.text}</span>
                    </p>
                  </li>
                );
              })}
            </ol>
            <p className="label mt-6 text-ash-400">Rendered live in your browser with WebGL.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
