"use client";

import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";

const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const m = matchMedia(REDUCED);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

/** True when the visitor has asked the OS for reduced motion. */
export function useReducedMotion() {
  return useSyncExternalStore(subscribeReduced, () => matchMedia(REDUCED).matches, () => false);
}

/** True while at least `threshold` of the element is on screen. */
export function useInView(ref: RefObject<Element | null>, threshold = 0.2) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, [ref, threshold]);
  return inView;
}
