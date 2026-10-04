"use client";

import { Fragment, useRef } from "react";
import { useSectionProgress } from "@/lib/use-section-progress";
import { Eyebrow } from "./Eyebrow";

// One inquiry through eight working modules. Generic sample data — no customer details.
const STEPS = [
  { label: "Lead in", field: ["source", "website_form"] },
  { label: "AI agent", field: ["handled_by", "agent"] },
  { label: "Understands intent", field: ["intent", "booking"] },
  { label: "Qualifies", field: ["qualified", "true"] },
  { label: "Checks availability", field: ["slot", "thu_14:00"] },
  { label: "Books appointment", field: ["appointment", "confirmed"] },
  { label: "Updates CRM", field: ["crm_stage", "booked"] },
  { label: "Follow-up", field: ["follow_up", "sent"] },
];

// Desktop: a serpentine machine — row 1 runs left→right, row 2 returns right→left.
const POS = [
  "lg:col-start-1 lg:row-start-1",
  "lg:col-start-2 lg:row-start-1",
  "lg:col-start-3 lg:row-start-1",
  "lg:col-start-4 lg:row-start-1",
  "lg:col-start-4 lg:row-start-2",
  "lg:col-start-3 lg:row-start-2",
  "lg:col-start-2 lg:row-start-2",
  "lg:col-start-1 lg:row-start-2",
];
const CENTER = [
  ["12.5%", "25%"],
  ["37.5%", "25%"],
  ["62.5%", "25%"],
  ["87.5%", "25%"],
  ["87.5%", "75%"],
  ["62.5%", "75%"],
  ["37.5%", "75%"],
  ["12.5%", "75%"],
];

const fx = (on: boolean, cls: string) => (on ? cls : "");

/** What each module visibly does. Animations run only while the module is active. */
function Work({ i, active, done }: { i: number; active: boolean; done: boolean }) {
  const show = active || done;
  const dim = show ? "" : "opacity-40";
  switch (i) {
    case 0:
      return (
        <div className={`space-y-2.5 ${dim}`}>
          <div className="flex gap-1.5">
            {["Form", "Chat", "Call"].map((s, k) => (
              <span key={s} className={`label border px-1.5 py-0.5 ${k === 0 && show ? "border-signal-deep bg-signal text-ink-950" : "border-ink-900/20 text-ash-600"}`}>
                {s}
              </span>
            ))}
          </div>
          <p className={`border border-ink-900/15 bg-bone-100 px-2.5 py-2 text-[0.8125rem] leading-snug ${fx(active, "fx-up")}`}>
            &ldquo;Hi, can I book a consultation this week?&rdquo;
          </p>
        </div>
      );
    case 1:
      return (
        <div className={`flex items-center gap-3 ${dim}`}>
          <span className="relative grid h-12 w-12 shrink-0 place-items-center bg-ink-900">
            {active && <span aria-hidden="true" className="station-ping absolute inset-0 border-2 border-signal" />}
            <span aria-hidden="true" className="flex h-5 items-center gap-[3px]">
              {[8, 16, 11, 19, 9].map((h, k) => (
                <span key={k} className={`w-[3px] bg-signal ${fx(active, "fx-eq")}`} style={{ height: h, animationDelay: `${k * 0.12}s` }} />
              ))}
            </span>
          </span>
          <div>
            <p className="text-sm font-semibold">{show ? "Picked up instantly" : "Waiting for a lead"}</p>
            <p className="label mt-1 text-ash-600">24/7 · no queue</p>
          </div>
        </div>
      );
    case 2: {
      const words: [string, string?][] = [["Hi,"], ["can"], ["I"], ["book", "intent"], ["a"], ["consultation", "service"], ["this week?", "when"]];
      return (
        <div className={dim}>
          <p className="text-[0.8125rem] leading-relaxed">
            {words.map(([w, tag], k) => (
              <Fragment key={k}>
                <span
                  className={tag && show ? `bg-signal/25 px-0.5 ${fx(active, "fx-mark")}` : ""}
                  style={tag ? { animationDelay: `${0.3 + k * 0.12}s` } : undefined}
                >
                  {w}
                </span>{" "}
              </Fragment>
            ))}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1">
            {[
              ["intent", "booking"],
              ["service", "consultation"],
              ["when", "this week"],
            ].map(([k, v], n) => (
              <span key={k} className={`font-mono text-[0.6875rem] border border-ink-900/20 bg-bone-100 px-1.5 py-0.5 ${fx(active, "fx-up")}`} style={{ animationDelay: `${1 + n * 0.25}s` }}>
                <span className="text-ash-600">{k}:</span> {show ? v : "—"}
              </span>
            ))}
          </div>
        </div>
      );
    }
    case 3:
      return (
        <ul className={`space-y-2 ${dim}`}>
          {["In your service area", "Matches your criteria", "Ready to book"].map((c, k) => (
            <li key={c} className="flex items-center gap-2.5 text-[0.8125rem]">
              <span
                aria-hidden="true"
                className={`grid h-4 w-4 shrink-0 place-items-center border text-[0.625rem] font-bold ${show ? "border-signal-deep bg-signal text-ink-950" : "border-ink-900/30"} ${fx(active, "fx-pop")}`}
                style={{ animationDelay: `${0.3 + k * 0.4}s` }}
              >
                {show ? "✓" : ""}
              </span>
              {c}
            </li>
          ))}
        </ul>
      );
    case 4: {
      const busy = [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1]; // 5 days × 3 slots, column-major
      const target = 10; // Thursday, 2nd slot
      return (
        <div className={dim}>
          <div className="grid grid-cols-5 gap-1 text-center">
            {["M", "T", "W", "T", "F"].map((d, k) => (
              <span key={k} className="label text-ash-600">
                {d}
              </span>
            ))}
            {Array.from({ length: 15 }, (_, n) => {
              const day = n % 5;
              const slot = Math.floor(n / 5);
              const idx = day * 3 + slot;
              const isTarget = idx === target;
              return (
                <span
                  key={n}
                  className={`h-4 border ${isTarget && show ? "border-signal-deep bg-signal" : busy[idx] ? "border-transparent bg-ink-900/15" : "border-ink-900/25"} ${fx(active && !isTarget, "fx-scan")} ${fx(active && isTarget, "fx-pop")}`}
                  style={{ animationDelay: `${isTarget ? 1.7 : idx * 0.1}s` }}
                />
              );
            })}
          </div>
          <p className="label mt-2.5 text-ash-600">{show ? "Free slot found · Thu 2:00 PM" : "Calendar"}</p>
        </div>
      );
    }
    case 5:
      return (
        <div className={`flex items-center gap-3 ${dim}`}>
          <div className={`w-16 shrink-0 border border-ink-900 text-center ${fx(active, "fx-up")}`}>
            <p className="label bg-ink-900 py-0.5 text-bone-50">Thu</p>
            <p className="display py-1.5 text-xl">2:00</p>
          </div>
          <div>
            <p className="text-sm font-semibold">Appointment booked</p>
            <p className={`label mt-1 ${show ? "text-accent" : "text-ash-600"} ${fx(active, "fx-pop")}`} style={{ animationDelay: "0.6s" }}>
              {show ? "✓ Confirmed" : "Pending"}
            </p>
          </div>
        </div>
      );
    case 6:
      return (
        <dl className={`grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-[0.8125rem] ${dim}`}>
          <dt className="label pt-0.5 text-ash-600">Contact</dt>
          <dd>New lead</dd>
          <dt className="label pt-0.5 text-ash-600">Source</dt>
          <dd>Website form</dd>
          <dt className="label pt-0.5 text-ash-600">Stage</dt>
          <dd>
            <span className={`label inline-block px-1.5 py-0.5 ${show ? "bg-ink-900 text-bone-50" : "border border-ink-900/20"} ${fx(active, "fx-pop")}`} style={{ animationDelay: "0.7s" }}>
              {show ? "Booked" : "New"}
            </span>
          </dd>
        </dl>
      );
    default:
      return (
        <div className={dim}>
          <p className={`ml-auto max-w-[95%] bg-ink-900 px-3 py-2 text-[0.8125rem] leading-snug text-bone-50 ${fx(active, "fx-up")}`}>
            You&apos;re confirmed for Thu, 2:00 PM. Reply R to reschedule.
          </p>
          <p className={`label mt-2.5 flex items-center gap-2 text-ash-600 ${fx(active, "fx-up")}`} style={{ animationDelay: "0.8s" }}>
            <span aria-hidden="true" className="h-2 w-2 bg-signal" /> Reminder scheduled · 24h before
          </p>
        </div>
      );
  }
}

export function AIAutomation() {
  const ref = useRef<HTMLElement>(null);
  const step = useSectionProgress(ref, STEPS.length);

  // Connector k joins module k → k+1. The one just travelled flows; earlier ones are solid.
  const seg = (k: number) => (k < step - 1 ? "done" : k === step - 1 ? "flow" : "todo");

  return (
    <section ref={ref} id="automation" aria-labelledby="automation-title" className="surface-bone relative z-10 lg:h-[380svh]">
      <div className="lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col lg:overflow-hidden">
        <div className="shell flex flex-col gap-4 pt-24 lg:flex-row lg:items-end lg:justify-between lg:pt-[calc(var(--nav-h)+1.25rem)] short:pt-[calc(var(--nav-h)+0.75rem)]">
          <div>
            <Eyebrow n="02" className="text-ash-600">AI automation</Eyebrow>
            <h2 id="automation-title" className="display mt-4 text-[clamp(2.1rem,1rem+2.6vw,3.6rem)] short:mt-2 short:text-[2.1rem]">
              Automation that actually
              <br />
              does the work<span className="text-accent">.</span>
            </h2>
          </div>
          <div className="lg:text-right">
            <p className="label flex items-center gap-2 text-ink-900 lg:justify-end" aria-live="polite">
              <span aria-hidden="true" className="h-2 w-2 animate-pulse bg-signal" />
              Running · <span className="text-accent">{String(step + 1).padStart(2, "0")}/08</span> {STEPS[step].label}
            </p>
            <p className="mt-2 max-w-sm text-[0.9375rem] leading-relaxed text-ash-600 short:hidden">
              One inquiry, followed through every step — the way we wire AI agents into your calendar,
              CRM and inbox. Scroll to run the machine.
            </p>
          </div>
        </div>

        <div className="shell mt-10 lg:mt-6 lg:min-h-0 lg:flex-1 short:mt-4">
          <div className="relative lg:h-full">
          {/* Conveyor connectors between modules (desktop) */}
          <svg aria-hidden="true" className="pointer-events-none absolute inset-0 hidden h-full w-full overflow-visible lg:block">
            <line x1="0%" y1="25%" x2={CENTER[0][0]} y2="25%" stroke="var(--color-signal-deep)" strokeWidth="2" className="flow-line" />
            <text x="0%" y="25%" dy="-10" className="fill-ash-600 font-mono text-[10px] tracking-[0.16em]">
              IN
            </text>
            {CENTER.slice(0, -1).map(([x1, y1], k) => {
              const [x2, y2] = CENTER[k + 1];
              const s = seg(k);
              return (
                <line
                  key={k}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  strokeWidth={s === "todo" ? 1 : 2}
                  stroke={s === "flow" ? "var(--color-signal-deep)" : s === "done" ? "var(--color-ink-900)" : "color-mix(in oklab, var(--color-ink-900) 22%, transparent)"}
                  strokeDasharray={s === "todo" ? "3 6" : undefined}
                  className={s === "flow" ? "flow-line" : ""}
                />
              );
            })}
            <line
              x1={CENTER[7][0]}
              y1="75%"
              x2="0%"
              y2="75%"
              strokeWidth="2"
              stroke={step === 7 ? "var(--color-signal-deep)" : "color-mix(in oklab, var(--color-ink-900) 22%, transparent)"}
              strokeDasharray={step === 7 ? undefined : "3 6"}
              className={step === 7 ? "flow-line" : ""}
            />
          </svg>

          <ol className="relative grid grid-cols-1 gap-y-8 lg:h-full lg:grid-cols-4 lg:grid-rows-2 lg:gap-x-14 lg:gap-y-12 short:gap-y-7">
            {STEPS.map((s, i) => {
              const active = i === step;
              const done = i < step;
              return (
                <li
                  key={s.label}
                  aria-current={active ? "step" : undefined}
                  className={`relative flex h-[13.5rem] flex-col border bg-bone-50 p-4 short:p-3 transition-[border-color,box-shadow,opacity] duration-500 lg:h-auto lg:min-h-0 ${POS[i]} ${
                    active
                      ? "border-signal-deep shadow-[0_0_0_5px_color-mix(in_oklab,var(--color-signal)_18%,transparent)]"
                      : done
                        ? "border-ink-900/50"
                        : "border-ink-900/15"
                  }`}
                >
                  {/* Phones: a short connector down to the next module */}
                  {i < STEPS.length - 1 && (
                    <span aria-hidden="true" className={`absolute -bottom-8 left-8 h-8 w-0.5 lg:hidden ${done ? "bg-ink-900" : active ? "bg-signal-deep" : "bg-ink-900/15"}`} />
                  )}
                  <div className="label flex items-center justify-between">
                    <span className="text-accent">{String(i + 1).padStart(2, "0")}</span>
                    <span className={`flex items-center gap-1.5 ${active ? "text-ink-900" : "text-ash-600"}`}>
                      <span aria-hidden="true" className={`h-1.5 w-1.5 ${active ? "animate-pulse bg-signal" : done ? "bg-ink-900" : "bg-ink-900/25"}`} />
                      {active ? "Running" : done ? "Done" : "Queued"}
                    </span>
                  </div>
                  <h3 className={`mt-1.5 font-semibold leading-tight ${active || done ? "text-ink-900" : "text-ash-600"}`}>{s.label}</h3>
                  <div key={active ? "on" : "off"} className="mt-3 min-h-0 flex-1 overflow-hidden short:mt-2">
                    <Work i={i} active={active} done={done} />
                  </div>
                </li>
              );
            })}
          </ol>
          </div>
        </div>

        {/* The record the machine is building */}
        <div className="shell pb-16 pt-8 lg:pb-8 lg:pt-6 short:pb-4 short:pt-3">
          <p className="flex flex-wrap items-center gap-1.5 font-mono text-[0.75rem]">
            <span className="mr-1 text-ash-600">lead.record</span>
            {STEPS.map((s, i) => (
              <span
                key={s.field[0]}
                className={`border px-1.5 py-0.5 transition-colors duration-500 ${
                  i === step ? "border-signal-deep bg-signal text-ink-950" : i < step ? "border-ink-900/40 text-ink-900" : "border-ink-900/10 text-ash-600/60"
                }`}
              >
                {s.field[0]}: {i <= step ? s.field[1] : "—"}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
