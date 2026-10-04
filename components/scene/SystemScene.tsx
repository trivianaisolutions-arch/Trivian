"use client";

import { useEffect, useRef } from "react";

/** Fixed WebGL canvas behind the homepage. three.js loads in its own chunk after hydration. */
export function SystemScene() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let stop: (() => void) | undefined;
    let cancelled = false;
    import("./engine").then(({ startScene }) => {
      if (!cancelled && ref.current) stop = startScene(ref.current);
    });
    return () => {
      cancelled = true;
      stop?.();
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
