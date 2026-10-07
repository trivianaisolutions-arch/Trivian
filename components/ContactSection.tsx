"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import Link from "next/link";
import { submitLead } from "@/app/actions/submit-lead";
import { siteConfig } from "@/lib/config";
import { BUDGETS, EMPTY_BRIEF, MIN_BRIEF, PROJECT_TYPES, STEPS, TIMELINES, validateStep, type Brief, type BriefErrors } from "@/lib/brief";
import { BriefStack, IsoIcon, type Layer } from "./ContactArt";
import { Eyebrow } from "./Eyebrow";

const noSubscribe = () => () => {};
const clock = () => Date.now(); // read only in effects and event handlers
const field =
  "mt-2 w-full border border-ink-900/20 bg-bone-50 px-4 py-3 text-base text-ink-900 placeholder:text-ash-600/70 transition-colors hover:border-ink-900/40 focus:border-ink-900 aria-[invalid=true]:border-signal-deep";
const NEXT_UP = [
  ["We read it", "Our team reviews your brief — not a bot."],
  ["We reply within 24 hours", "With an honest approach, timeline and questions."],
  ["We plan it together", "A short call, then a clear proposal."],
];

/** Pill-style radio group (budget, timeline). */
function Pills({ name, label, options, value, onChange }: { name: keyof Brief; label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <fieldset>
      <legend className="label text-ash-600">
        {label} <span className="normal-case tracking-normal text-ash-600/80">(optional)</span>
      </legend>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {options.map((o) => (
          <label
            key={o}
            className="cursor-pointer border border-ink-900/20 bg-bone-50 px-3.5 py-2 text-sm transition-colors hover:border-ink-900/50 has-[:checked]:border-ink-900 has-[:checked]:bg-ink-900 has-[:checked]:text-bone-50 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-signal"
          >
            <input type="radio" name={name} value={o} checked={value === o} onChange={() => onChange(o)} className="sr-only" />
            {o}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

type Sent = { name: string; email: string; emailed: boolean };

export function ContactSection({ standalone = false }: { standalone?: boolean }) {
  const [form, setForm] = useState<Brief>(EMPTY_BRIEF);
  const [errors, setErrors] = useState<BriefErrors>({});
  const [step, setStep] = useState(0);
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState("");
  const [sent, setSent] = useState<Sent | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const mountedAt = useRef(0);
  const pointerPick = useRef(false);
  const Heading = standalone ? "h1" : "h2";
  const Sub = standalone ? "h2" : "h3";

  useEffect(() => {
    mountedAt.current = clock();
  }, []);

  // Service pages link here as /contact?type=… to preselect the project type (until the visitor picks one).
  const search = useSyncExternalStore(noSubscribe, () => window.location.search, () => "");
  const preset = new URLSearchParams(search).get("type") ?? "";
  const draft: Brief = { ...form, projectType: form.projectType || (PROJECT_TYPES.some((t) => t.value === preset) ? preset : "") };

  const update = (k: keyof Brief, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };
  const set = (k: keyof Brief) => (e: { target: { value: string } }) => update(k, e.target.value);

  const goTo = (n: number) => {
    setStep(n);
    setFailure("");
    requestAnimationFrame(() => titleRef.current?.focus({ preventScroll: false }));
  };

  const focusFirst = (found: BriefErrors) => {
    const first = Object.keys(found)[0];
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus());
  };

  const next = () => {
    const found = validateStep(draft, step);
    setErrors(found);
    if (Object.keys(found).length) return focusFirst(found);
    goTo(step + 1);
  };

  const send = async () => {
    const found = validateStep(draft, 2);
    setErrors(found);
    if (Object.keys(found).length) return focusFirst(found);
    setSending(true);
    setFailure("");
    try {
      const res = await submitLead(draft, { botcheck: honeypot.current?.value, elapsedMs: clock() - mountedAt.current });
      if (res.ok) {
        setSent({ name: res.name || draft.name, email: res.email || draft.email, emailed: res.emailed });
        return;
      }
      setFailure(res.error);
      if (res.fieldErrors) {
        setErrors(res.fieldErrors);
        const bad = STEPS.findIndex((s) => s.fields.some((k) => res.fieldErrors?.[k]));
        if (bad >= 0) goTo(bad);
      }
    } catch {
      setFailure("Something went wrong sending your brief. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (step < STEPS.length - 1) next();
    else void send();
  };

  const reset = () => {
    setForm(EMPTY_BRIEF);
    setErrors({});
    setSent(null);
    setStep(0);
    mountedAt.current = clock();
  };

  const err = (k: keyof Brief) =>
    errors[k] ? { "aria-invalid": true as const, "aria-describedby": `${k}-error` } : { "aria-invalid": false as const };
  const msg = (k: keyof Brief) =>
    errors[k] && (
      <p id={`${k}-error`} className="mt-1.5 text-sm text-signal-deep">
        {errors[k]}
      </p>
    );

  // Each answer becomes a layer of the 3D brief, in the order the form asks for them.
  const typeLabel = PROJECT_TYPES.find((t) => t.value === draft.projectType)?.label ?? "";
  const briefLen = draft.whatToBuild.trim().length;
  const layers: Layer[] = [
    { label: "Project", value: typeLabel },
    { label: "Brief", value: briefLen >= MIN_BRIEF ? draft.whatToBuild.trim() : "" },
    { label: "Budget", value: draft.budget },
    { label: "Timeline", value: draft.timeline },
    { label: "Name", value: draft.name.trim() },
    { label: "Email", value: /\S+@\S+\.\S{2,}/.test(draft.email) ? draft.email.trim() : "" },
  ];
  const ready = [0, 1, 2].every((s) => Object.keys(validateStep(draft, s)).length === 0);
  const firstName = (sent?.name ?? "").trim().split(/\s+/)[0];

  return (
    <section id="contact" tabIndex={-1} aria-labelledby="contact-title" className="surface-bone relative z-10 py-24 md:py-36">
      <div className="shell grid grid-cols-1 gap-14 lg:grid-cols-12">
        {/* Left: the brief assembling in 3D, plus what happens after sending. */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <Eyebrow n="11" className="text-ash-600">Start a project</Eyebrow>
            <Heading id="contact-title" className="display mt-6 text-[length:var(--step-l)]">
              Tell us what
              <br />
              you&apos;re building<span className="text-accent">.</span>
            </Heading>
            <p className="mt-6 max-w-md text-[0.9375rem] leading-relaxed text-ash-600">
              Three quick steps, about two minutes. Our team reads every brief and replies within
              24 hours.
            </p>

            <BriefStack layers={layers} ready={ready} sent={Boolean(sent)} className="mt-10 hidden lg:block" />

            <ol className="mt-8 hidden space-y-3 lg:block">
              {NEXT_UP.map(([t, d], i) => (
                <li key={t} className="flex gap-4 text-sm">
                  <span className="label grid h-6 w-6 shrink-0 place-items-center bg-ink-900 text-bone-50">{i + 1}</span>
                  <span>
                    <span className="font-semibold text-ink-900">{t}</span> <span className="text-ash-600">— {d}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="border border-ink-900/15 bg-bone-50/60 p-5 sm:p-8 md:p-10">
            {sent ? (
              <div role="status" aria-live="polite">
                <span aria-hidden="true" className="grid h-12 w-12 place-items-center bg-signal text-xl font-bold text-ink-950">✓</span>
                <Sub className="display mt-6 text-[length:var(--step-l)]">
                  Thank you{firstName ? `, ${firstName}` : ""}<span className="text-accent">.</span>
                </Sub>
                <p className="lead mt-5 max-w-lg text-ash-600">
                  Your brief is in.{" "}
                  {sent.emailed ? (
                    <>
                      We&apos;ve sent a confirmation to <strong className="text-ink-900">{sent.email}</strong>.
                    </>
                  ) : (
                    <>
                      We&apos;ll reply to <strong className="text-ink-900">{sent.email}</strong>.
                    </>
                  )}{" "}
                  Our team will get back to you within 24 hours.
                </p>
                <dl className="mt-8 grid gap-x-8 gap-y-3 border-t border-ink-900/15 pt-6 text-sm sm:grid-cols-3">
                  {[
                    ["Project", typeLabel],
                    ["Budget", draft.budget || "Not specified"],
                    ["Timeline", draft.timeline || "Not specified"],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="label text-ash-600">{k}</dt>
                      <dd className="mt-1 font-medium text-ink-900">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-10 flex flex-wrap gap-3">
                  <Link href="/case-studies" className="btn btn-signal">
                    See our work <span aria-hidden="true" className="btn-arrow">→</span>
                  </Link>
                  <button type="button" onClick={reset} className="btn btn-line">
                    Send another brief
                  </button>
                </div>
                <BriefStack layers={layers} ready sent className="mt-12 lg:hidden" />
              </div>
            ) : (
              <form ref={formRef} onSubmit={onSubmit} noValidate>
                {/* Progress */}
                <div className="flex items-center justify-between gap-4">
                  <p className="label text-ash-600" aria-live="polite">
                    Step <span className="text-accent">{step + 1}</span> of {STEPS.length}
                  </p>
                  <ol aria-hidden="true" className="flex flex-1 gap-1.5 sm:max-w-xs">
                    {STEPS.map((s, i) => (
                      <li key={s.title} className={`h-1 flex-1 transition-colors duration-300 ${i <= step ? "bg-signal-deep" : "bg-ink-900/15"}`} />
                    ))}
                  </ol>
                </div>
                <Sub ref={titleRef} tabIndex={-1} className="display mt-5 text-[length:var(--step-m)]">
                  {STEPS[step].title}
                </Sub>

                {/* Spam trap: invisible to people, tempting to bots. */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                  <label htmlFor="botcheck">Leave this empty</label>
                  <input ref={honeypot} id="botcheck" name="botcheck" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                <div className="mt-8 min-h-[20rem]">
                  {step === 0 && (
                    <fieldset onPointerDown={() => (pointerPick.current = true)} aria-describedby={errors.projectType ? "projectType-error" : undefined}>
                      <legend className="sr-only">Project type</legend>
                      <p className="text-[0.9375rem] text-ash-600">Choose the closest fit — you can explain the details next.</p>
                      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
                        {PROJECT_TYPES.map((t) => (
                          <label
                            key={t.value}
                            className="type-tile group relative flex cursor-pointer flex-col items-center gap-2 border border-ink-900/15 bg-bone-50 px-2 pb-3 pt-4 text-center transition-colors hover:border-ink-900/50 has-[:checked]:border-ink-900 has-[:checked]:bg-ink-900 has-[:checked]:text-bone-50 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-signal"
                          >
                            <input
                              type="radio"
                              name="projectType"
                              value={t.value}
                              checked={draft.projectType === t.value}
                              onChange={() => {
                                update("projectType", t.value);
                                // A click is a decision — move on. Arrow keys just change the selection.
                                if (pointerPick.current) setTimeout(() => goTo(1), 380);
                                pointerPick.current = false;
                              }}
                              className="sr-only"
                              {...err("projectType")}
                            />
                            <span aria-hidden="true" className="type-shadow absolute bottom-9 h-2 w-14 rounded-[50%] bg-ink-900/15" />
                            <IsoIcon name={t.icon} className="type-icon relative h-14 w-16" />
                            <span className="text-[0.8125rem] font-medium leading-tight">{t.label}</span>
                          </label>
                        ))}
                      </div>
                      {msg("projectType")}
                    </fieldset>
                  )}

                  {step === 1 && (
                    <div className="space-y-8">
                      <div>
                        <label htmlFor="whatToBuild" className="label text-ash-600">
                          What are you trying to build? *
                        </label>
                        <p className="mt-1 text-sm text-ash-600">The product, who it&apos;s for, or the process you want to automate. Two or three sentences is perfect.</p>
                        <textarea
                          id="whatToBuild"
                          name="whatToBuild"
                          rows={5}
                          placeholder="e.g. A booking system for our clinics that sends reminders and syncs with our CRM."
                          value={form.whatToBuild}
                          onChange={set("whatToBuild")}
                          className={`${field} resize-y`}
                          {...err("whatToBuild")}
                        />
                        <div className="mt-2 flex items-center gap-3">
                          <span aria-hidden="true" className="relative h-1 flex-1 overflow-hidden bg-ink-900/10">
                            <span className="absolute inset-y-0 left-0 bg-signal-deep transition-[width] duration-300" style={{ width: `${Math.min(100, (briefLen / MIN_BRIEF) * 100)}%` }} />
                          </span>
                          <span className="label w-36 text-right text-ash-600">{briefLen >= MIN_BRIEF ? "✓ Enough detail" : `${MIN_BRIEF - briefLen} more characters`}</span>
                        </div>
                        {msg("whatToBuild")}
                      </div>
                      <Pills name="budget" label="Budget" options={BUDGETS} value={form.budget} onChange={(v) => update("budget", v)} />
                      <Pills name="timeline" label="Timeline" options={TIMELINES} value={form.timeline} onChange={(v) => update("timeline", v)} />
                      <div>
                        <label htmlFor="website" className="label text-ash-600">
                          Current website <span className="normal-case tracking-normal text-ash-600/80">(optional)</span>
                        </label>
                        <input id="website" name="website" inputMode="url" autoComplete="url" placeholder="yourdomain.com" value={form.website} onChange={set("website")} className={field} {...err("website")} />
                        {msg("website")}
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="name" className="label text-ash-600">Full name *</label>
                        <input id="name" name="name" autoComplete="name" value={form.name} onChange={set("name")} className={field} {...err("name")} />
                        {msg("name")}
                      </div>
                      <div>
                        <label htmlFor="email" className="label text-ash-600">Work email *</label>
                        <input id="email" name="email" type="email" autoComplete="email" placeholder="you@company.com" value={form.email} onChange={set("email")} className={field} {...err("email")} />
                        {msg("email")}
                      </div>
                      <div>
                        <label htmlFor="phone" className="label text-ash-600">
                          Phone / WhatsApp <span className="normal-case tracking-normal text-ash-600/80">(optional)</span>
                        </label>
                        <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")} className={field} {...err("phone")} />
                        {msg("phone")}
                      </div>
                      <div>
                        <label htmlFor="company" className="label text-ash-600">
                          Company <span className="normal-case tracking-normal text-ash-600/80">(optional)</span>
                        </label>
                        <input id="company" name="company" autoComplete="organization" value={form.company} onChange={set("company")} className={field} {...err("company")} />
                        {msg("company")}
                      </div>
                      <p className="text-sm leading-relaxed text-ash-600 sm:col-span-2">
                        We&apos;ll only use these details to reply about your project. See our{" "}
                        <Link href="/privacy" className="link-line text-ink-900">
                          privacy policy
                        </Link>
                        .
                      </p>
                      <BriefStack layers={layers} ready={ready} sent={false} className="sm:col-span-2 lg:hidden" />
                    </div>
                  )}
                </div>

                {failure && (
                  <p role="alert" className="mt-6 border-l-2 border-signal-deep bg-signal/10 px-4 py-3 text-sm text-ink-900">
                    {failure} You can also email{" "}
                    <a href={`mailto:${siteConfig.contactEmail}`} className="link-line font-semibold">
                      {siteConfig.contactEmail}
                    </a>
                    .
                  </p>
                )}

                <div className="mt-8 flex items-center justify-between gap-3 border-t border-ink-900/15 pt-6">
                  {step > 0 ? (
                    <button type="button" onClick={() => goTo(step - 1)} className="btn btn-line">
                      <span aria-hidden="true">←</span> Back
                    </button>
                  ) : (
                    <span />
                  )}
                  <button type="submit" disabled={sending} className="btn btn-signal disabled:opacity-60">
                    {step < STEPS.length - 1 ? "Continue" : sending ? "Sending…" : "Send brief"}{" "}
                    <span aria-hidden="true" className="btn-arrow">→</span>
                  </button>
                </div>
              </form>
            )}
          </div>
          <p className="mt-5 text-sm text-ash-600">
            Prefer email or a call?{" "}
            <a href={`mailto:${siteConfig.contactEmail}`} className="link-line font-semibold text-ink-900">
              {siteConfig.contactEmail}
            </a>{" "}
            ·{" "}
            <a href={siteConfig.phoneHref} className="link-line font-semibold text-ink-900">
              {siteConfig.phone}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
