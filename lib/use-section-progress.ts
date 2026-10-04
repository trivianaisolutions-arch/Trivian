"use client";

import { useEffect, useState, type RefObject } from "react";

/** 0→1 progress of a tall section scrolling past its sticky viewport. */
export function sectionProgress(el: Element) {
  const r = el.getBoundingClientRect();
  const span = r.height - window.innerHeight;
  if (span <= 0) {
    // Not taller than the viewport: progress while it crosses the screen.
    const total = r.height + window.innerHeight;
    return Math.min(1, Math.max(0, (window.innerHeight - r.top) / total));
  }
  return Math.min(1, Math.max(0, -r.top / span));
}

/**
 * Writes `--p` (0→1) on the element as it scrolls and, when `steps` is set,
 * returns the active step index. One rAF per scroll frame; no re-render unless
 * the step changes.
 */
export function useSectionProgress(ref: RefObject<HTMLElement | null>, steps = 0) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const p = sectionProgress(el);
      el.style.setProperty("--p", p.toFixed(4));
      if (steps) setStep(Math.min(steps - 1, Math.floor(p * steps)));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ref, steps]);

  return step;
}
