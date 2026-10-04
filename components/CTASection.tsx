import Link from "next/link";

/** Final scene: the 3D stack recombines into one lit form behind the question. */
export function CTASection() {
  return (
    <section data-scene="cta" aria-labelledby="cta-title" className="relative flex min-h-[115svh] flex-col justify-between py-28">
      <div className="shell text-center">
        <h2 id="cta-title" className="display text-[length:var(--step-xl)] text-bone-50">
          Have a system
          <br />
          worth building<span className="text-accent">?</span>
        </h2>
      </div>
      <div className="shell flex flex-col items-center gap-8 text-center">
        <p className="lead max-w-md text-ash-300">Tell us what you&apos;re trying to build, automate or improve.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="#contact" className="btn btn-signal">
            Start a project <span aria-hidden="true" className="btn-arrow">→</span>
          </a>
          <Link href="/case-studies" className="btn btn-line" data-cursor="view">
            View our work
          </Link>
        </div>
      </div>
    </section>
  );
}
