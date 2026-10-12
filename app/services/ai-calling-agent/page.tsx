import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NextStep } from "@/components/NextStep";
import { Faq } from "@/components/Faq";
import { CallingAgent } from "@/components/CallingAgent";
import { CALLING_AGENT_FAQS } from "@/lib/faqs";
import { POSTS } from "@/lib/posts";
import { JsonLd, SITE_URL, breadcrumbs, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta(
  "AI Calling Agent & AI Receptionist",
  "AI calling agents and AI receptionists that answer calls, book appointments, qualify leads and hand over to your team — for clinics, real estate and sales.",
  "/services/ai-calling-agent",
);

const STEPS = [
  ["Answers", "The call comes in on your number — or the agent dials out — and it greets the caller, saying up front that it's an AI assistant."],
  ["Understands", "Speech recognition turns the caller's words into text while they talk, so they can speak naturally instead of pressing buttons."],
  ["Decides", "A language model reads that text with your instructions, prices and policies, and works out the right answer or next step."],
  ["Acts", "It checks your calendar, books or moves the appointment, or saves the caller's details to your CRM or sheet."],
  ["Hands over", "When a person is needed, it transfers the call or takes a message — with a written summary so nobody repeats themselves."],
];

const USES = [
  {
    title: "Clinics & healthcare",
    tasks: ["Book, move and cancel appointments", "Answer timings, location and the fees you publish", "Send reminders before visits", "Take messages after hours"],
    note: "Booking and admin only — medical questions and emergencies always go to your staff.",
  },
  {
    title: "Real estate",
    tasks: ["Answer enquiries on listings around the clock", "Ask budget, area and timeline questions", "Book site visits into an agent's calendar", "Call back new enquiries within minutes"],
  },
  {
    title: "Sales teams",
    tasks: ["Call new leads while they're still interested", "Ask your qualification questions", "Log answers and a summary in your CRM", "Pass hot leads straight to a salesperson"],
  },
  {
    title: "Busy front desks",
    tasks: ["Answer the questions you get every day", "Catch calls when every line is busy", "Route callers to the right person", "Turn missed calls into bookings"],
  },
];

const BUILT_IN = [
  "Inbound and outbound calls",
  "A natural voice that says it's AI",
  "Answers from your own documents and prices",
  "Booking into your calendar",
  "Caller details saved to your CRM or sheet",
  "Hand-over to your team with a call summary",
  "Transcripts so you can review every call",
  "Clear limits on what it may and may not do",
];

const GUIDES = ["what-is-an-ai-calling-agent", "ai-receptionist-for-clinics", "ai-calling-agent-vs-call-centre"];

export default function AiCallingAgentPage() {
  const guides = GUIDES.flatMap((slug) => POSTS.filter((p) => p.slug === slug));
  const url = `${SITE_URL}/services/ai-calling-agent`;

  return (
    <div id="top">
      <Navbar />
      <main id="main" tabIndex={-1} data-inner className="relative z-10">
        <header className="surface-ink">
          <div className="shell pb-20 pt-36">
            <nav aria-label="Breadcrumb" className="label text-ash-400">
              <Link href="/" className="link-line">Studio</Link> <span aria-hidden="true">/</span>{" "}
              <Link href="/services" className="link-line">Services</Link> <span aria-hidden="true">/</span>{" "}
              <span className="text-bone-100">AI Calling Agent</span>
            </nav>
            <p className="label mt-12 text-ash-300">
              <Link href="/services/ai-agents" className="link-line text-accent">AI Agents</Link> <span aria-hidden="true">·</span> Voice
            </p>
            <h1 className="display mt-6 text-[length:min(var(--step-xl),10.5vw)] text-bone-50">
              AI Calling Agent<span className="text-accent">.</span>
            </h1>
            <p className="lead mt-8 max-w-2xl text-ash-300">
              An AI voice agent that answers your phone, makes follow-up calls and books appointments in a natural
              voice — and hands the call to your team whenever a person is needed.
            </p>
            <p className="label mt-6 text-ash-400">For: Clinics · Real estate · Sales teams · Busy front desks</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/contact?type=AI%20Agents" className="btn btn-signal">
                Start a project <span aria-hidden="true" className="btn-arrow">→</span>
              </Link>
              <Link href="/services/ai-agents" className="btn btn-line">
                All AI agents
              </Link>
            </div>
          </div>
        </header>

        <section aria-labelledby="what-title" className="surface-bone py-20 md:py-28">
          <div className="shell grid grid-cols-1 gap-10 lg:grid-cols-12">
            <h2 id="what-title" className="display text-[length:var(--step-l)] lg:col-span-5">
              What it is
            </h2>
            <div className="space-y-5 text-[1.0625rem] leading-relaxed lg:col-span-7">
              <p>
                An AI calling agent — also called an <strong>AI voice agent</strong> or <strong>AI receptionist</strong> —
                is software that holds a real phone conversation. Callers talk normally; there&apos;s no &ldquo;press 1&rdquo;
                menu. It understands the question, answers from your business information, and then does something useful
                with the call.
              </p>
              <p className="text-ash-600">
                It works best on the calls that repeat all day: bookings, common questions, missed calls and follow-ups. The
                calls that need judgement stay with your team.
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="how-title" className="surface-ink border-t border-bone-100/10 py-20 md:py-28">
          <div className="shell">
            <h2 id="how-title" className="display text-[length:var(--step-l)]">
              How a call works
            </h2>
            <ol className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
              {STEPS.map(([title, text], i) => (
                <li key={title} className="border-t-2 border-bone-100 pt-5">
                  <p className="label text-accent">0{i + 1}</p>
                  <h3 className="mt-3 text-xl font-semibold">{title}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-ash-300">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <CallingAgent />

        <section aria-labelledby="uses-title" className="surface-bone relative z-10 py-20 md:py-28">
          <div className="shell">
            <h2 id="uses-title" className="display text-[length:var(--step-l)]">
              What it can do for you
            </h2>
            <ul className="mt-12 grid gap-x-10 gap-y-12 md:grid-cols-2">
              {USES.map((u) => (
                <li key={u.title} className="border-t-2 border-ink-900 pt-6">
                  <h3 className="text-xl font-semibold">{u.title}</h3>
                  <ul className="mt-4 space-y-2 text-[0.9375rem] leading-relaxed">
                    {u.tasks.map((t) => (
                      <li key={t} className="flex gap-3">
                        <span aria-hidden="true" className="text-accent">→</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                  {u.note && <p className="mt-4 text-sm text-ash-600">{u.note}</p>}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="built-title" className="surface-ink relative z-10 py-20 md:py-28">
          <div className="shell grid grid-cols-1 gap-10 lg:grid-cols-12">
            <h2 id="built-title" className="display text-[length:var(--step-l)] lg:col-span-5">
              What we set up
            </h2>
            <ol className="border-t border-bone-100/10 lg:col-span-7">
              {BUILT_IN.map((b, i) => (
                <li key={b} className="flex gap-6 border-b border-bone-100/10 py-5">
                  <span className="label pt-1.5 text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-lg leading-snug">{b}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {guides.length > 0 && (
          <section aria-labelledby="guides-title" className="surface-ink relative z-10 border-t border-bone-100/10 py-20 md:py-28">
            <div className="shell">
              <h2 id="guides-title" className="display text-[length:var(--step-l)]">
                Guides
              </h2>
              <ul className="mt-12 border-t border-bone-100/10">
                {guides.map((p) => (
                  <li key={p.slug} className="border-b border-bone-100/10">
                    <Link href={`/blog/${p.slug}`} data-cursor="view" className="group grid gap-3 py-8 md:grid-cols-12 md:items-baseline">
                      <span className="display text-[length:var(--step-m)] transition-colors group-hover:text-signal md:col-span-7">{p.title}</span>
                      <span className="text-[0.9375rem] leading-relaxed text-ash-300 md:col-span-5">{p.description}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <Faq
          faqs={CALLING_AGENT_FAQS}
          tone="bone"
          title={
            <>
              Questions about
              <br />
              <span className="text-ash-600">AI calling agents.</span>
            </>
          }
        />

        <NextStep next={{ href: "/services/ai-agents", title: "AI Agents" }} type="AI Agents" />
      </main>
      <Footer />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "AI Calling Agent",
          alternateName: ["AI voice agent", "AI receptionist"],
          description: "AI calling agents and AI voice receptionists that answer calls, book appointments, qualify leads and hand over to your team.",
          serviceType: "AI calling agent development",
          url,
          provider: { "@id": `${SITE_URL}/#organization` },
          areaServed: "Worldwide",
        }}
      />
      <JsonLd
        data={breadcrumbs([
          { name: "Studio", path: "/" },
          { name: "Services", path: "/services" },
          { name: "AI Calling Agent", path: "/services/ai-calling-agent" },
        ])}
      />
    </div>
  );
}
