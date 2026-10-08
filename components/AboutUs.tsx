import { siteConfig } from "@/lib/config";
import { Eyebrow } from "./Eyebrow";

const PRINCIPLES = [
  { title: "One team for the whole product", text: "Frontend, backend, data, integrations and AI — no handoffs between agencies." },
  { title: "Direct engineer access", text: "No account managers. You talk to the three people writing and shipping your code." },
  { title: "AI where it earns its place", text: "We add AI where it removes manual work or opens revenue — not for the buzzword." },
  { title: "Built around your business", text: "No themes or pre-packaged templates. The system follows your workflow." },
  { title: "Typed, documented, yours", text: "TypeScript codebases, clear READMEs and full ownership of what we build." },
  { title: "Scope that fits", text: "From a single landing page to a multi-tenant SaaS — we adapt the engagement." },
];

export function AboutUs({ standalone = false }: { standalone?: boolean }) {
  const Heading = standalone ? "h1" : "h2";
  return (
    <section id="about" tabIndex={-1} aria-labelledby="about-title" className="surface-bone relative z-10 py-24 md:py-36">
      <div className="shell">
        <Eyebrow n="10" className="text-ash-600">Studio</Eyebrow>
        <div className="mt-6 grid gap-10 lg:grid-cols-12">
          <Heading id="about-title" className="display text-[length:var(--step-xl)] lg:col-span-7">
            Three engineers<span className="text-accent">.</span>
            <br />
            <span className="text-ash-600">No handoffs.</span>
          </Heading>
          <div className="lead space-y-5 text-ash-600 lg:col-span-4 lg:col-start-9 lg:self-end">
            <p className="text-ink-900">
              Trivian AI Solutions is an AI engineering company based in Noida and Chandigarh, India.
              We combine AI engineering, automation, web development, 3D, design and search into one
              practice — so the system you get is built as one thing, not stitched together.
            </p>
            <p>
              We stay small on purpose. It keeps us fast, keeps us accountable, and means the person
              you brief is the person who builds it.
            </p>
          </div>
        </div>

        <ol className="mt-20 border-t border-ink-900/15">
          {siteConfig.founders.map((f, i) => (
            <li key={f.name} className="grid gap-6 border-b border-ink-900/15 py-10 md:grid-cols-12">
              <p className="label text-accent md:col-span-1">0{i + 1}</p>
              <div className="md:col-span-4">
                <h3 className="display text-[length:var(--step-m)]">{f.name}</h3>
                <p className="label mt-3 text-ash-600">{f.role}</p>
              </div>
              <div className="md:col-span-4">
                <p className="label text-ink-900">{f.focus}</p>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-ash-600">{f.bio}</p>
              </div>
              <ul className="flex flex-wrap content-start gap-x-4 gap-y-1 font-mono text-[0.8125rem] text-ink-900 md:col-span-3">
                {f.skills.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <h3 className="label mt-20 text-ash-600">How we work</h3>
        <ul className="mt-8 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map((p, i) => (
            <li key={p.title} className="border-t border-ink-900 pt-5">
              <p className="label text-accent">{String(i + 1).padStart(2, "0")}</p>
              <p className="mt-3 text-lg font-semibold leading-snug">{p.title}</p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ash-600">{p.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
