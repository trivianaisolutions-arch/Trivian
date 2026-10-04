"use client";

import { useState, type CSSProperties } from "react";

/* ─── Isometric 3D icons, built from boxes ─────────────────────────────
   Each box: [x, y, z, w, d, h, accent?]  accent 1 = orange top, 2 = orange front. */
type BoxDef = [number, number, number, number, number, number, number?];

export const ICONS: Record<string, BoxDef[]> = {
  website: [[0, 0, 0, 40, 30, 3], [0, 0, 3, 40, 7, 3], [4, 11, 3, 18, 15, 2, 1], [25, 11, 3, 11, 6, 2], [25, 19, 3, 11, 7, 2]],
  webapp: [[0, 0, 0, 40, 32, 3], [3, 3, 3, 15, 12, 7], [21, 3, 3, 16, 12, 12, 1], [3, 18, 3, 34, 11, 3]],
  saas: [[0, 0, 0, 34, 34, 4], [0, 0, 11, 34, 34, 4], [0, 0, 22, 34, 34, 4, 1]],
  mobile: [[8, 14, 0, 20, 5, 38, 2]],
  backend: [[0, 0, 0, 30, 30, 7], [0, 0, 10, 30, 30, 7, 1], [0, 0, 20, 30, 30, 7]],
  aiint: [[0, 0, 0, 40, 30, 4], [13, 9, 4, 12, 12, 12, 1]],
  automation: [[0, 10, 0, 10, 10, 10], [10, 14, 3, 5, 2, 2], [15, 10, 0, 10, 10, 10], [25, 14, 3, 5, 2, 2], [30, 10, 0, 10, 10, 10, 1]],
  agents: [[6, 6, 0, 26, 26, 10], [32, 0, 18, 6, 6, 6], [12, 12, 10, 14, 14, 14, 1], [0, 32, 6, 6, 6, 6]],
  "3d": [[0, 0, 0, 36, 36, 3], [10, 10, 16, 16, 16, 16, 1]],
  search: [[0, 0, 0, 34, 34, 3], [4, 4, 3, 6, 6, 6], [13, 13, 3, 8, 8, 34, 1], [24, 24, 3, 6, 6, 6]],
  other: [[6, 6, 0, 24, 24, 24, 1]],
};

const COS = Math.cos(Math.PI / 6);
const iso = (x: number, y: number, z: number): [number, number] => [(x - y) * COS, (x + y) * 0.5 - z];

export function IsoIcon({ name, className = "" }: { name: string; className?: string }) {
  // Back-to-front so nearer boxes paint over farther ones.
  const boxes = [...ICONS[name]].sort((a, b) => a[0] + a[1] - (b[0] + b[1]) || a[2] - b[2]);
  const faces = boxes.map(([x, y, z, w, d, h, accent]) => {
    const p = (a: number, b: number, c: number) => iso(a, b, c).map((n) => n.toFixed(2)).join(",");
    return {
      top: [p(x, y, z + h), p(x + w, y, z + h), p(x + w, y + d, z + h), p(x, y + d, z + h)].join(" "),
      front: [p(x, y + d, z + h), p(x + w, y + d, z + h), p(x + w, y + d, z), p(x, y + d, z)].join(" "),
      side: [p(x + w, y, z + h), p(x + w, y + d, z + h), p(x + w, y + d, z), p(x + w, y, z)].join(" "),
      accent,
    };
  });
  // Fit the viewBox to the drawing.
  const pts = boxes.flatMap(([x, y, z, w, d, h]) =>
    [x, x + w].flatMap((a) => [y, y + d].flatMap((b) => [z, z + h].map((c) => iso(a, b, c)))),
  );
  const xs = pts.map((q) => q[0]);
  const ys = pts.map((q) => q[1]);
  const pad = 3;
  const vb = [Math.min(...xs) - pad, Math.min(...ys) - pad, Math.max(...xs) - Math.min(...xs) + pad * 2, Math.max(...ys) - Math.min(...ys) + pad * 2];

  return (
    <svg viewBox={vb.map((n) => n.toFixed(1)).join(" ")} aria-hidden="true" className={`iso ${className}`}>
      {faces.map((f, i) => (
        <g key={i}>
          <polygon points={f.front} className={f.accent === 2 ? "al" : "l"} />
          <polygon points={f.side} className={f.accent === 2 ? "ar" : "r"} />
          <polygon points={f.top} className={f.accent === 1 ? "a" : "t"} />
        </g>
      ))}
    </svg>
  );
}

/* ─── The brief, assembled in 3D as the form fills ──────────────────── */
export type Layer = { label: string; value: string };

export function BriefStack({ layers, ready, sent, className = "" }: { layers: Layer[]; ready: boolean; sent: boolean; className?: string }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const filled = layers.filter((l) => l.value).length;

  return (
    <div className={className}>
      <div
        className="brief-scene relative mx-auto aspect-square w-full max-w-[22rem]"
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          setTilt({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
        }}
        onPointerLeave={() => setTilt({ x: 0, y: 0 })}
        aria-hidden="true"
      >
        <div
          className={`brief-stack ${sent ? "is-sent" : ""}`}
          style={{ "--tz": `${-40 + tilt.x * 18}deg`, "--tx": `${58 - tilt.y * 12}deg` } as CSSProperties}
        >
          {layers.map((l, i) => (
            <div key={l.label} className="plate" data-on={l.value ? "" : undefined} data-top={i === layers.length - 1 && ready ? "" : undefined} style={{ "--i": i } as CSSProperties}>
              <div className="plate-ghost" />
              <div className="plate-body">
                <div className="plate-front" />
                <div className="plate-side" />
                <div className="plate-top">
                  <span className="plate-label">
                    <span className="text-accent">0{i + 1}</span> {l.label}
                  </span>
                  <span className="plate-value">{l.value}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="label mt-2 flex items-center justify-center gap-3 text-ash-600">
        <span className="flex gap-1">
          {layers.map((l) => (
            <span key={l.label} className={`h-1.5 w-4 transition-colors ${l.value ? "bg-signal-deep" : "bg-ink-900/15"}`} />
          ))}
        </span>
        {sent ? "Brief sent" : ready ? "Brief ready to send" : `Your brief · ${filled}/${layers.length} layers`}
      </p>
    </div>
  );
}
