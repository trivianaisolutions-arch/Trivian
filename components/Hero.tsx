"use client";

import { useRef } from "react";
import { useSectionProgress } from "@/lib/use-section-progress";

/** Static isometric stack, shown only when WebGL is unavailable. */
function StackFallback() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 420"
      className="scene-fallback absolute right-[4%] top-[14%] w-[min(46vw,560px)] opacity-80 max-md:left-1/2 max-md:right-auto max-md:top-[10%] max-md:w-[78vw] max-md:-translate-x-1/2"
    >
      {Array.from({ length: 6 }, (_, i) => {
        const y = 330 - i * 52;
        return (
          <g key={i}>
            <path d={`M200 ${y - 60} L360 ${y} L200 ${y + 60} L40 ${y} Z`} fill="#1a1b1f" stroke={i === 2 ? "#ff5a1f" : "#e9e5dc"} strokeOpacity={i === 2 ? 1 : 0.25} />
            <path d={`M40 ${y} L40 ${y + 6} L200 ${y + 66} L360 ${y + 6} L360 ${y}`} fill="none" stroke="#e9e5dc" strokeOpacity="0.15" />
          </g>
        );
      })}
      {[120, 200, 280].map((x) => (
        <line key={x} x1={x} y1="80" x2={x} y2="360" stroke="#ff5a1f" strokeOpacity="0.5" strokeDasharray="2 8" />
      ))}
    </svg>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  useSectionProgress(ref);

  return (
    <section ref={ref} data-scene="hero" aria-labelledby="hero-title" className="hero relative h-[175svh] md:h-[210svh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <StackFallback />

        {/* Legibility scrim for the copy on small screens, where it sits over the stack. */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink-950 via-ink-950/75 to-transparent md:hidden" />


        <div className="shell relative flex h-full flex-col justify-end pb-[max(2rem,7svh)] pt-28">
          <p className="hero-fade label mb-6 text-ash-300">
            AI engineering <span className="text-accent">/</span> automation <span className="text-accent">/</span> web{" "}
            <span className="text-accent">/</span> 3D <span className="text-accent">/</span> search
          </p>

          <h1 id="hero-title" className="hero-title display text-[length:var(--step-hero)] text-bone-50">
            <span className="hero-line-1 block">We build</span>
            <span className="hero-line-2 block md:pl-[0.9em]">digital systems</span>
            <span className="hero-line-3 block">
              that think<span className="text-accent">.</span>
            </span>
          </h1>

          <div className="hero-fade mt-8 grid gap-8 md:mt-12 md:grid-cols-12 md:items-end">
            <p className="lead max-w-xl text-ash-300 md:col-span-6 lg:col-span-5">
              We don&apos;t just build websites. We engineer AI automation, intelligent websites,
              3D experiences and search-ready architecture — as one connected system.
            </p>
            <div className="flex flex-wrap gap-3 md:col-span-6 md:justify-end lg:col-span-7">
              <a href="#contact" className="btn btn-signal">
                Start a project <span aria-hidden="true" className="btn-arrow">→</span>
              </a>
              <a href="#work" className="btn btn-line" data-cursor="explore">
                Explore our work
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
