"use client";

import { useEffect, useRef } from "react";

const LABELS: Record<string, string> = { explore: "Explore", view: "View", drag: "Drag", play: "Play" };

/**
 * Desktop-only cursor. States come from the nearest `[data-cursor]`
 * (explore · view · drag · play); links and buttons read as "interactive";
 * text fields fall back to the native caret.
 */
export function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches) return;
    const el = root.current!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.classList.add("has-cursor");
    el.hidden = false;

    let x = -100;
    let y = -100;
    let rx = x;
    let ry = y;
    let raf = 0;
    let state = "default";

    const setState = (next: string) => {
      if (next === state) return;
      state = next;
      el.dataset.state = next;
      label.current!.textContent = LABELS[next] ?? "";
    };

    const loop = () => {
      const k = reduced ? 1 : 0.2;
      rx += (x - rx) * k;
      ry += (y - ry) * k;
      ring.current!.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = Math.abs(x - rx) + Math.abs(y - ry) > 0.1 ? requestAnimationFrame(loop) : 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      dot.current!.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (!raf) raf = requestAnimationFrame(loop);

      const t = e.target as Element;
      const tagged = t.closest?.("[data-cursor]") as HTMLElement | null;
      if (t.closest?.("input:not([type='range']), textarea, select")) setState("hidden");
      else if (tagged) setState(tagged.dataset.cursor!);
      else if (t.closest?.("a, button, label, summary, [role='tab']")) setState("interactive");
      else setState("default");
    };
    const onLeave = () => setState("hidden");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div ref={root} hidden aria-hidden="true" data-state="default" className="cursor pointer-events-none fixed inset-0 z-[100]">
      <div ref={ring} className="absolute left-0 top-0 will-change-transform">
        <div className="cursor-ring flex items-center justify-center rounded-full">
          <span ref={label} className="cursor-label label text-[0.625rem] font-semibold" />
        </div>
      </div>
      <div ref={dot} className="cursor-dot absolute left-0 top-0 -ml-[3px] -mt-[3px] h-1.5 w-1.5 bg-signal will-change-transform" />
    </div>
  );
}
