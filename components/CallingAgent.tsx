"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/use-autoplay";
import { Eyebrow } from "./Eyebrow";

// One simulated call on a timeline (seconds). Generic script — no real customer data.
const T = 16.5;
const GUTTER = 76; // px reserved on the left for lane labels
type Who = "caller" | "agent";
const RING = { start: 0, end: 1.6 };
const LINES: { who: Who; start: number; end: number; text: string }[] = [
  { who: "caller", start: 1.8, end: 5.0, text: "Hi — I'd like to book an appointment for Thursday afternoon." },
  { who: "agent", start: 5.6, end: 9.2, text: "Of course. I have 2:00 or 4:30 on Thursday. Which works better?" },
  { who: "caller", start: 9.8, end: 11.2, text: "2:00 works." },
  { who: "agent", start: 11.8, end: 15.4, text: "You're booked for Thursday at 2:00. I'm texting you a confirmation now." },
];
const ACTIONS = [
  { t: 5.0, label: "Intent: booking", row: 0 },
  { t: 5.3, label: "Calendar checked", row: 1 },
  { t: 11.3, label: "Slot reserved", row: 0 },
  { t: 15.0, label: "CRM updated", row: 1 },
  { t: 15.5, label: "Confirmation sent", row: 2 },
];
const OUTCOME = [
  { label: "Appointment", value: "Thursday, 2:00 PM", at: 11.3 },
  { label: "CRM", value: "Contact and call summary saved", at: 15.0 },
  { label: "Follow-up", value: "Confirmation text sent", at: 15.5 },
];
const STATES = ["Incoming call", "AI listens", "AI understands", "AI responds", "AI decides", "Action", "CRM · Calendar · Follow-up"];

function stateAt(t: number) {
  if (t < LINES[0].start) return 0;
  if (t < LINES[0].end) return 1;
  if (t < LINES[1].start) return 2;
  if (t < LINES[2].start) return 3;
  if (t < LINES[2].end) return 1;
  if (t < LINES[3].start) return 4;
  if (t < ACTIONS[3].t) return 5;
  return 6;
}

/** The discrete things the DOM shows at time t (React re-renders only when these change). */
function snapshot(t: number) {
  return {
    t: Math.floor(t),
    done: t >= T,
    state: stateAt(t),
    actions: ACTIONS.filter((a) => t >= a.t).length,
    words: LINES.map((l) => {
      const n = l.text.split(" ").length;
      return t >= l.end ? n : t <= l.start ? 0 : Math.ceil(((t - l.start) / (l.end - l.start)) * n);
    }),
  };
}
type Snap = ReturnType<typeof snapshot>;
const same = (a: Snap, b: Snap) =>
  a.t === b.t && a.done === b.done && a.state === b.state && a.actions === b.actions && a.words.join() === b.words.join();

/** Two voice lanes (caller above, agent below), revealed up to the playhead. */
function drawLanes(canvas: HTMLCanvasElement, t: number, now: number) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  if (canvas.width !== Math.round(w * dpr)) {
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const lane = h / 2;
  const x = (s: number) => GUTTER + (s / T) * (w - GUTTER - 8);
  ctx.fillStyle = "rgba(233,229,220,0.1)";
  ctx.fillRect(GUTTER, lane * 0.5, w - GUTTER, 1);
  ctx.fillRect(GUTTER, lane * 1.5, w - GUTTER, 1);

  const segments = [{ who: "ring" as const, ...RING }, ...LINES];
  for (const seg of segments) {
    const cy = seg.who === "agent" ? lane * 1.5 : lane * 0.5;
    const x0 = x(seg.start);
    const span = x(seg.end) - x0;
    const x1 = x(Math.min(seg.end, t));
    ctx.fillStyle = seg.who === "agent" ? "#ff5a1f" : seg.who === "ring" ? "#8f8d88" : "#e9e5dc";
    for (let px = x0, i = 0; px < x1; px += 5, i++) {
      const env = Math.sqrt(Math.sin(Math.PI * Math.min(1, (px - x0) / span)));
      let a = seg.who === "ring" ? (i % 6 < 2 ? 0.55 : 0.1) : 0.2 + 0.8 * Math.abs(Math.sin(i * 0.7) * Math.sin(i * 0.23 + seg.start));
      if (t < seg.end && x1 - px < 28) a *= 0.6 + 0.4 * Math.abs(Math.sin(now / 70 + i)); // live, at the playhead
      const bh = Math.max(2, a * env * lane * 0.85);
      ctx.fillRect(px, cy - bh / 2, 3, bh);
    }
  }
  if (t < T) {
    ctx.fillStyle = "#ff5a1f";
    ctx.fillRect(x(t), 0, 1.5, h);
  }
}

export function CallingAgent() {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const tRef = useRef(T);
  const [snap, setSnap] = useState<Snap>(() => snapshot(T)); // server + no-JS + reduced motion: the finished call
  const [playing, setPlaying] = useState(false);
  const reduced = useReducedMotion();

  const play = () => {
    tRef.current = 0;
    setSnap(snapshot(0));
    setPlaying(true);
  };

  // Plays once when the section first comes into view (not under reduced motion).
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        tRef.current = 0;
        setSnap(snapshot(0));
        setPlaying(true);
      },
      { threshold: 0.4 },
    );
    io.observe(section.current!);
    return () => io.disconnect();
  }, []);

  // Playback clock: draws every frame, updates the DOM only when something visible changes.
  useEffect(() => {
    const c = canvas.current!;
    if (!playing) {
      const redraw = () => drawLanes(c, tRef.current, 0);
      redraw();
      const ro = new ResizeObserver(redraw);
      ro.observe(c);
      return () => ro.disconnect();
    }
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      tRef.current = Math.min(T, tRef.current + (now - last) / 1000);
      last = now;
      drawLanes(c, tRef.current, now);
      const next = snapshot(tRef.current);
      setSnap((prev) => (same(prev, next) ? prev : next));
      if (tRef.current >= T) setPlaying(false);
      else raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const status = snap.done ? "Call complete" : STATES[snap.state];

  return (
    <section ref={section} id="calling" aria-labelledby="calling-title" className="surface-ink relative z-10 py-24 md:py-36">
      <div className="shell grid grid-cols-1 gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Eyebrow n="03" className="text-ash-300">AI calling agents</Eyebrow>
          <h2 id="calling-title" className="display mt-6 text-[length:var(--step-l)]">
            Every call
            <br />
            answered<span className="text-accent">.</span>
            <br />
            <span className="text-ash-400">Every next step handled.</span>
          </h2>
          <p className="lead mt-8 max-w-md text-ash-300">
            Voice agents that pick up, understand what the caller needs, respond naturally and then
            do the work — booking, routing and writing everything back to your systems.
          </p>

          <div className="mt-10 border border-bone-100/10">
            <p className="label border-b border-bone-100/10 px-5 py-3 text-ash-400">Call outcome</p>
            <dl>
              {OUTCOME.map((o) => {
                const done = snap.actions > ACTIONS.findIndex((a) => a.t === o.at);
                return (
                  <div key={o.label} className="flex items-baseline justify-between gap-4 border-b border-bone-100/10 px-5 py-3.5 last:border-b-0">
                    <dt className="label text-ash-400">{o.label}</dt>
                    <dd className="relative text-right text-[0.9375rem]">
                      <span className={`transition-opacity duration-500 ${done ? "text-bone-50" : "invisible"}`}>
                        <span aria-hidden="true" className="mr-2 inline-block h-2 w-2 bg-signal" />
                        {o.value}
                      </span>
                      {!done && <span className="absolute inset-0 text-ash-400">Waiting…</span>}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </div>

        <div className="lg:col-span-7">
          <figure className="border border-bone-100/10">
            {/* Call header: status, timer, replay */}
            <figcaption className="label flex items-center justify-between gap-4 border-b border-bone-100/10 px-5 py-3 text-ash-400">
              <span className="flex min-w-0 items-center gap-3">
                <span aria-hidden="true" className={`h-2 w-2 shrink-0 ${playing ? "animate-pulse bg-signal" : "bg-ash-400"}`} />
                <span aria-live={playing ? "off" : "polite"} className="truncate text-bone-100">
                  {status}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-3 sm:gap-5">
                <span className="font-mono tabular-nums">0:{String(snap.t).padStart(2, "0")}</span>
                <button type="button" onClick={play} disabled={playing} data-cursor="play" className="link-line w-[4.5rem] whitespace-nowrap text-right sm:w-[7.5rem] text-bone-100 disabled:text-ash-400">
                  {playing ? "Live…" : <>Replay<span className="max-sm:hidden"> call</span></>}
                </button>
              </span>
            </figcaption>

            {/* Live transcript: every word is always laid out (no layout shift), revealed as it's spoken. */}
            <ol className="space-y-4 px-5 py-6">
              {LINES.map((l, i) => (
                <li key={i} className={`transition-opacity duration-300 ${snap.words[i] ? "opacity-100" : "opacity-0"}`}>
                  <p className={`label ${l.who === "agent" ? "text-accent" : "text-ash-400"}`}>{l.who === "agent" ? "AI agent" : "Caller"}</p>
                  <p className={`mt-1 text-[0.9375rem] leading-relaxed ${l.who === "agent" ? "text-bone-50" : "text-ash-300"}`}>
                    {l.text.split(" ").map((w, j) => (
                      <span key={j} className={`transition-opacity duration-200 ${j < snap.words[i] ? "opacity-100" : "opacity-0"}`}>
                        {w}{" "}
                      </span>
                    ))}
                  </p>
                </li>
              ))}
            </ol>

            {/* Voice lanes */}
            <div className="relative border-t border-bone-100/10">
              <canvas ref={canvas} aria-hidden="true" className="block h-28 w-full" />
              <span className="label pointer-events-none absolute left-3 top-[22%] -translate-y-1/2 text-ash-400">Caller</span>
              <span className="label pointer-events-none absolute left-3 top-[75%] -translate-y-1/2 text-accent">AI agent</span>
            </div>

            {/* What the agent does, at the moment it does it. Phones: a timestamped list instead of a lane. */}
            <div className="relative flex flex-col gap-2 border-t border-bone-100/10 px-3 pb-4 pt-9 sm:block sm:h-[6.75rem] sm:p-0" aria-label="Agent actions">
              <span className="label pointer-events-none absolute left-3 top-2 text-ash-400">Actions</span>
              {ACTIONS.map((a, i) => {
                const pct = (a.t / T) * 100;
                return (
                  <span
                    key={a.label}
                    className={`label flex items-center gap-1.5 whitespace-nowrap text-bone-100 transition-opacity duration-300 sm:absolute sm:left-[var(--x)] sm:top-[var(--y)] ${
                      i < snap.actions ? "opacity-100" : "opacity-0"
                    } ${pct > 70 ? "sm:-translate-x-full sm:flex-row-reverse" : ""}`}
                    style={{ "--x": `calc(${GUTTER}px + (100% - ${GUTTER + 8}px) * ${a.t / T})`, "--y": `${1.9 + a.row * 1.5}rem` } as React.CSSProperties}
                  >
                    <span aria-hidden="true" className="h-2 w-2 shrink-0 bg-signal" />
                    <span className="font-mono tabular-nums text-ash-400 sm:hidden">0:{String(Math.floor(a.t)).padStart(2, "0")}</span>
                    {a.label}
                  </span>
                );
              })}
            </div>

            <ol className="grid border-t border-bone-100/10 sm:grid-cols-7">
              {STATES.map((s, i) => {
                const on = !snap.done && i === snap.state;
                return (
                  <li
                    key={s}
                    aria-current={on ? "step" : undefined}
                    className={`label border-bone-100/10 px-3 py-3 transition-colors max-sm:border-b sm:border-r sm:last:border-r-0 ${
                      on ? "bg-signal text-ink-950" : snap.done || i < snap.state ? "text-bone-100" : "text-ash-400"
                    }`}
                  >
                    <span className="block opacity-70">0{i + 1}</span>
                    {s}
                  </li>
                );
              })}
            </ol>
          </figure>
          <p className="label mt-6 text-ash-400">
            Simulated call — no audio is recorded or played.{reduced ? " Press replay to watch it." : ""}
          </p>
        </div>
      </div>
    </section>
  );
}
