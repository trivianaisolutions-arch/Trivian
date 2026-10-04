import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = pageMeta(
  "Privacy",
  "How Trivian AI Solutions handles information on this website.",
  "/privacy",
);

// Describes what this site actually does today. Update it if analytics, cookies or new data uses are added.
export default function PrivacyPage() {
  return (
    <div id="top" className="surface-ink min-h-screen">
      <Navbar />
      <main id="main" tabIndex={-1} className="shell max-w-3xl pb-28 pt-36">
        <p className="label text-ash-400">Last updated October 2026</p>
        <h1 className="display mt-6 text-[length:var(--step-l)]">Privacy</h1>
        <div className="mt-12 space-y-10 text-[1.0625rem] leading-relaxed text-ash-300 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-bone-50">
          <section>
            <h2>What this website collects</h2>
            <p>
              This website does not use analytics or advertising trackers. The only information we
              collect is what you choose to send us through the project form.
            </p>
          </section>
          <section>
            <h2>The project form</h2>
            <p>
              When you send a brief, we receive your name, email address, the project details you
              enter and, if you add them, your phone number, company and website. The brief is
              stored on our server and emailed to our team, and we email you a confirmation copy.
              These emails are delivered through Google (Gmail).
            </p>
          </section>
          <section>
            <h2>How we use it</h2>
            <p>
              We use your brief only to reply to you and to scope your project. We don&apos;t sell
              it or share it for marketing. Email us to see, correct or delete the details we hold
              about you.
            </p>
          </section>
          <section>
            <h2>Hosting</h2>
            <p>
              Like any website, our hosting provider may process standard request data, such as IP
              addresses, to deliver pages and keep the service secure.
            </p>
          </section>
          <section>
            <h2>Contact</h2>
            <p>
              Questions about privacy:{" "}
              <a href={`mailto:${siteConfig.contactEmail}`} className="link-line text-bone-100">
                {siteConfig.contactEmail}
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
