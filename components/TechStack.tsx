"use client";

import { useState } from "react";
import { Eyebrow } from "./Eyebrow";

// Tools are the ones this studio works with (and this site is built on); positions are % of the diagram.
const NODES = [
  { id: "ai", name: "AI", x: 50, y: 10, tools: ["LLMs & embeddings", "RAG systems", "AI agents", "Voice AI"] },
  { id: "web", name: "Web", x: 15, y: 40, tools: ["Next.js", "React 19", "TypeScript", "Tailwind CSS"] },
  { id: "automation", name: "Automation", x: 50, y: 40, tools: ["Webhooks", "Event queues", "Background jobs"] },
  { id: "data", name: "Data", x: 85, y: 40, tools: ["PostgreSQL", "MySQL · MongoDB", "Prisma ORM", "Redis"] },
  { id: "3d", name: "3D", x: 15, y: 70, tools: ["Three.js · WebGL", "CSS 3D"] },
  { id: "apis", name: "APIs", x: 50, y: 70, tools: ["Node.js", "Python · FastAPI", "REST · GraphQL"] },
  { id: "crm", name: "CRM", x: 85, y: 70, tools: ["CRM integrations", "Stripe", "Resend"] },
  { id: "business", name: "Business", x: 50, y: 94, tools: ["Your operations"] },
];
const EDGES: [string, string][] = [
  ["ai", "web"],
  ["ai", "automation"],
  ["ai", "data"],
  ["web", "3d"],
  ["automation", "apis"],
  ["data", "crm"],
  ["3d", "business"],
  ["apis", "business"],
  ["crm", "business"],
];
const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));

export function TechStack() {
  const [active, setActive] = useState<string | null>(null);
  const lit = (a: string, b: string) => active === a || active === b;

  return (
    <section id="architecture" aria-labelledby="architecture-title" className="surface-ink relative z-10 py-24 md:py-36">
      <div className="shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow n="09" className="text-ash-300">Technology architecture</Eyebrow>
            <h2 id="architecture-title" className="display mt-6 text-[length:var(--step-l)]">
              Not a logo wall<span className="text-accent">.</span>
              <br />
              <span className="text-ash-400">A working stack.</span>
            </h2>
          </div>
          <p className="max-w-sm text-[0.9375rem] leading-relaxed text-ash-300">
            Every tool has a place in the system and a reason to be there. Point at a node to trace
            what it connects to.
          </p>
        </div>

        <div className="relative mt-16 lg:aspect-[16/10]">
          <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 hidden h-full w-full lg:block">
            {EDGES.map(([a, b]) => {
              const A = byId[a];
              const B = byId[b];
              const on = lit(a, b);
              return (
                <g key={a + b}>
                  <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#e9e5dc" strokeOpacity={active && !on ? 0.06 : 0.16} vectorEffect="non-scaling-stroke" />
                  <line
                    x1={A.x}
                    y1={A.y}
                    x2={B.x}
                    y2={B.y}
                    className="flow-line"
                    stroke="#ff5a1f"
                    strokeOpacity={on ? 1 : active ? 0 : 0.5}
                    strokeWidth={on ? 2 : 1}
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              );
            })}
          </svg>

          <ul className="grid gap-px bg-bone-100/10 sm:grid-cols-2 lg:block lg:bg-transparent">
            {NODES.map((n) => (
              <li
                key={n.id}
                onPointerEnter={() => setActive(n.id)}
                onPointerLeave={() => setActive(null)}
                style={{ "--x": `${n.x}%`, "--y": `${n.y}%` } as React.CSSProperties}
                className={`bg-ink-950 p-5 transition-colors duration-300 lg:absolute lg:left-[var(--x)] lg:top-[var(--y)] lg:w-56 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:border ${
                  active === n.id ? "lg:border-signal" : "lg:border-bone-100/15"
                } ${n.id === "business" ? "sm:col-span-2" : ""}`}
              >
                <p className="display text-xl">{n.name}</p>
                <ul className="mt-3 space-y-1 font-mono text-[0.75rem] text-ash-300">
                  {n.tools.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>

        <p className="label mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-bone-100/10 pt-6 text-ash-400 lg:mt-14">
          <span className="text-bone-100">Infrastructure</span>
          <span>Vercel</span>
          <span>Render</span>
          <span>Docker</span>
          <span>CI/CD</span>
          <span>Cloud APIs</span>
        </p>
      </div>
    </section>
  );
}
