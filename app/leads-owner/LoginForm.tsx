"use client";

import { useActionState } from "react";
import { login } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <div className="mx-auto max-w-sm pt-10 md:pt-20">
      <p className="label text-accent">Owner access</p>
      <h1 className="display mt-4 text-[length:var(--step-l)]">Leads</h1>
      <p className="mt-4 text-[0.9375rem] leading-relaxed text-ash-300">
        Enter the owner password to see every brief sent from the website.
      </p>
      <form action={action} className="mt-10">
        <label htmlFor="password" className="label text-ash-400">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={Boolean(state?.error)}
          aria-describedby={state?.error ? "password-error" : undefined}
          className="mt-2 w-full border border-bone-100/20 bg-ink-900 px-4 py-3 text-base text-bone-50 transition-colors focus:border-bone-100"
        />
        {state?.error && (
          <p id="password-error" role="alert" className="mt-2 text-sm text-signal">
            {state.error}
          </p>
        )}
        <button type="submit" disabled={pending} className="btn btn-signal mt-6 w-full disabled:opacity-60">
          {pending ? "Checking…" : "Unlock leads"}
        </button>
      </form>
    </div>
  );
}
