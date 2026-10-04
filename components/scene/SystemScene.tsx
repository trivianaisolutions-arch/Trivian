"use client";

import { useEffect, useRef } from "react";

const TRIGGERS = ["pointerdown", "touchstart", "wheel", "scroll", "keydown"] as const;

/**
 * Fixed WebGL canvas behind the homepage. three.js loads in its own chunk, never during first paint:
 * phones start it on the first touch/scroll, desktops once the browser is idle after load.
 * Until then the hero shows the static drawing of the same stack (cross-faded on ready).
 */
export function SystemScene() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let stop: (() => void) | undefined;
    let cancelled = false;
    let started = false;
    let idleId = 0;
    let timer = 0;

    const start = () => {
      if (started) return;
      started = true;
      unbind();
      import("./engine").then(({ startScene }) => {
        if (!cancelled && ref.current) stop = startScene(ref.current);
      });
    };
    const unbind = () => {
      TRIGGERS.forEach((e) => window.removeEventListener(e, start));
      window.removeEventListener("load", whenIdle);
    };
    const whenIdle = () => {
      if (typeof window.requestIdleCallback === "function") idleId = window.requestIdleCallback(start, { timeout: 2500 });
      else timer = window.setTimeout(start, 1500); // Safari < 18
    };

    TRIGGERS.forEach((e) => window.addEventListener(e, start, { passive: true, once: true }));
    if (!matchMedia("(pointer: coarse)").matches) {
      if (document.readyState === "complete") whenIdle();
      else window.addEventListener("load", whenIdle, { once: true });
    }

    return () => {
      cancelled = true;
      unbind();
      if (idleId) window.cancelIdleCallback(idleId);
      window.clearTimeout(timer);
      stop?.();
      document.documentElement.classList.remove("scene-ready");
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="scene-canvas pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
