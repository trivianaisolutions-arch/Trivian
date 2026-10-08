import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { caseStudies } from "@/lib/case-studies";
import { SERVICES } from "@/lib/services";

const navigation = [
  { label: "Selected work", href: "/case-studies" },
  { label: "Services", href: "/services" },
  { label: "Process", href: "/process" },
  { label: "Studio", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Where we work", href: "/locations" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
];

export function Footer() {
  return (
    <footer className="surface-ink relative z-10 border-t border-bone-100/10">
      <div className="shell grid gap-12 py-20 md:grid-cols-12">
        <div className="@container md:col-span-5">
          <p className="lead max-w-sm text-ash-300">
            Trivian AI Solutions is an AI agent, automation and web development company in Noida
            and Chandigarh, India — a three-person team building for clients worldwide.
          </p>
          <a href={`mailto:${siteConfig.contactEmail}`} className="display link-line mt-8 inline-block text-[length:min(var(--step-m),6.2cqi)] normal-case">
            {siteConfig.contactEmail}
          </a>
          <a href={siteConfig.phoneHref} className="link-line mt-4 block w-fit text-lg text-bone-100">
            {siteConfig.phone}
          </a>
          <p className="label mt-4 text-ash-400">
            {siteConfig.cities.map((c) => c.city).join(" · ")}, India — clients worldwide
          </p>
        </div>

        <nav aria-label="Capabilities" className="md:col-span-2 md:col-start-7">
          <h2 className="label mb-5 text-ash-400">Capabilities</h2>
          <ul className="space-y-2.5 text-sm">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="link-line">{s.title}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Footer" className="md:col-span-2">
          <h2 className="label mb-5 text-ash-400">Navigate</h2>
          <ul className="space-y-2.5 text-sm">
            {navigation.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="link-line">{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-2">
          <h2 className="label mb-5 text-ash-400">Live builds</h2>
          <ul className="space-y-2.5 text-sm">
            {caseStudies.map((s) => (
              <li key={s.slug}>
                <a href={s.liveUrl} target="_blank" rel="noopener noreferrer" className="link-line">
                  {s.title} <span aria-hidden="true">↗</span>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="shell overflow-hidden">
        <div aria-hidden="true" className="footer-mark display select-none whitespace-nowrap text-[min(7vw,6.5rem)] leading-[0.78] text-ink-800" />
      </div>

      <div className="shell label flex flex-col gap-3 border-t border-bone-100/10 py-6 text-ash-400 sm:flex-row sm:items-center sm:justify-between">
        <span>
          © {new Date().getFullYear()} {siteConfig.name} — {siteConfig.location}
        </span>
        <a href="#top" className="link-line w-fit">Back to top ↑</a>
      </div>
    </footer>
  );
}
