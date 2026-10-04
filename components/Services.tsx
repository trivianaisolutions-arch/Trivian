"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { SERVICES } from "@/lib/services";
import { Eyebrow } from "./Eyebrow";

export function Services() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const s = SERVICES[active];

  const onKey = (e: KeyboardEvent) => {
    const keys: Record<string, number> = {
      ArrowDown: active + 1,
      ArrowRight: active + 1,
      ArrowUp: active - 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: SERVICES.length - 1,
    };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = (keys[e.key] + SERVICES.length) % SERVICES.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section
      id="services"
      tabIndex={-1}
      data-scene="services"
      data-focus={s.focus}
      aria-labelledby="services-title"
      className="relative py-24 md:py-32 lg:min-h-svh"
    >
      <div className="shell grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Mobile: a window onto the 3D stack above the list. */}
        <div aria-hidden="true" className="h-[42svh] lg:hidden" />

        <div className="lg:col-span-6">
          <Eyebrow n="01" className="text-ash-300">What we build</Eyebrow>
          <h2 id="services-title" className="display mt-6 text-[length:var(--step-l)]">
            Six capabilities.
            <br />
            <span className="text-ash-400">One system.</span>
          </h2>

          <div role="tablist" aria-orientation="vertical" aria-label="Capabilities" onKeyDown={onKey} className="mt-12 border-t border-bone-100/10">
            {SERVICES.map((svc, i) => {
              const on = i === active;
              return (
                <button
                  key={svc.id}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  id={`tab-${svc.id}`}
                  role="tab"
                  type="button"
                  aria-selected={on}
                  aria-controls="service-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                  data-cursor="explore"
                  className={`group flex w-full items-baseline gap-5 border-b border-bone-100/10 py-4 text-left transition-colors duration-300 md:py-5 ${
                    on ? "text-bone-50" : "text-ash-400 hover:text-bone-100"
                  }`}
                >
                  <span className={`label w-6 shrink-0 ${on ? "text-accent" : ""}`}>0{i + 1}</span>
                  <span
                    className="display text-[clamp(1.5rem,1rem+2vw,2.6rem)] transition-[font-stretch] duration-500 ease-expo"
                    style={{ fontStretch: on ? "125%" : "100%" }}
                  >
                    {svc.title}
                  </span>
                  <span aria-hidden="true" className={`ml-auto h-px self-center bg-signal transition-[width] duration-500 ease-expo ${on ? "w-10" : "w-0"}`} />
                </button>
              );
            })}
          </div>
        </div>

        <div
          id="service-panel"
          role="tabpanel"
          aria-labelledby={`tab-${s.id}`}
          className="self-end bg-ink-950 p-6 md:p-8 lg:col-span-4 lg:col-start-9 lg:bg-ink-950/90"
        >
          <p className="label flex justify-between gap-4 text-ash-400">
            <span>0{active + 1} / 06</span>
            <span className="text-accent">{s.layer}</span>
          </p>
          <p className="lead mt-6 text-bone-50">{s.summary}</p>
          <ul className="mt-6 space-y-2.5 border-t border-bone-100/10 pt-6 text-[0.9375rem] text-ash-300">
            {s.capabilities.map((c) => (
              <li key={c} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.6em] h-px w-3 shrink-0 bg-signal" />
                {c}
              </li>
            ))}
          </ul>
          <p className="label mt-6 text-ash-400">For: {s.for}</p>
          <Link href={`/services/${s.slug}`} className="label link-line mt-6 inline-block text-accent">
            Explore {s.title} →
          </Link>
        </div>
      </div>
    </section>
  );
}
