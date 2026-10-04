import Link from "next/link";

/** Closing band for inner pages: optional "next" link, then the project CTA. */
export function NextStep({ next, type }: { next?: { href: string; title: string }; type?: string }) {
  return (
    <section aria-label="Next step" className="surface-ink relative z-10 border-t border-bone-100/10 py-20 md:py-28">
      <div className="shell">
        {next && (
          <Link href={next.href} data-cursor="view" className="group block">
            <span className="label text-ash-400">Next →</span>
            <span className="display mt-4 block text-[length:var(--step-l)] transition-colors group-hover:text-signal">{next.title}</span>
          </Link>
        )}
        <div className={`flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between ${next ? "mt-14 border-t border-bone-100/10 pt-10" : ""}`}>
          <p className="display text-[length:var(--step-m)]">
            Have a system worth building<span className="text-accent">?</span>
          </p>
          <Link href={type ? `/contact?type=${encodeURIComponent(type)}` : "/contact"} className="btn btn-signal self-start sm:self-auto">
            Start a project <span aria-hidden="true" className="btn-arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
