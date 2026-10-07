/**
 * FAQ content. Answers restate what the site already says (services, BRIEFS timelines, the stack) —
 * update both together. Each question appears on one page only, so its FAQPage markup isn't duplicated.
 */
export type Faq = { q: string; a: string };

/** Contact page: how working with us goes. */
export const GENERAL_FAQS: Faq[] = [
  {
    q: "How does your studio engage with clients?",
    a: "You work directly with the three founding engineers building your product. There are no account managers or outsourced junior teams in the middle.",
  },
  {
    q: "What happens after I send a brief?",
    a: "We read it ourselves and reply within 24 hours with an honest technical approach, a timeline and any questions. Then we have a short call to shape the scope and send you a clear proposal.",
  },
  {
    q: "How much does a project cost?",
    a: "It depends on what you need built. Share a rough budget in the brief, or choose “Not sure yet”, and we'll reply with the approach, timeline and cost before any work starts.",
  },
  {
    q: "What is your typical project timeline?",
    a: "High-converting websites typically take 2-3 weeks. Full custom web applications and SaaS MVPs range between 4 to 8 weeks depending on database complexity and API requirements.",
  },
  {
    q: "Do you work with clients outside India?",
    a: "Yes. Our team works from Noida and Chandigarh, India, and we work with clients in every country, over video calls and email.",
  },
  {
    q: "Can you add AI or automation to our existing software?",
    a: "Yes. We frequently integrate RAG systems, customer assistants, document processing pipelines, and voice calling agents directly into preexisting production databases and codebases.",
  },
  {
    q: "Do you offer code handoff and documentation?",
    a: "Every project includes full intellectual property ownership, typed TypeScript repositories, clean README documentation, and seamless Vercel / cloud deployment handoff.",
  },
];

/** Service pages, keyed by service slug. */
export const SERVICE_FAQS: Record<string, Faq[]> = {
  "ai-automation": [
    {
      q: "What kind of work can AI automation take over?",
      a: "Repetitive work that moves information between tools: reading PDFs and invoices into structured tables, updating your CRM and triggering the next stage, connecting the tools you already use with webhooks, running multi-step data pipelines, and turning podcasts or media into transcripts, briefs and captions.",
    },
    {
      q: "Do we need to change the software we already use?",
      a: "Usually not. We connect automations to the tools you already have — your CRM, spreadsheets, email and other apps — through their APIs and webhooks.",
    },
    {
      q: "How long does an automation project take?",
      a: "Adding automation or AI to an existing setup typically takes 1 to 4 weeks, depending on how many systems are involved. We start with one workflow, make sure it works, then add the next.",
    },
    {
      q: "What happens when the AI isn't sure?",
      a: "Unclear documents and unusual cases are flagged for a person on your team to review, instead of being processed on a guess.",
    },
  ],
  "ai-agents": [
    {
      q: "What can an AI agent do for my business?",
      a: "Answer and make phone calls, work as an AI receptionist for FAQs, lead capture and routing, answer from your own documents and pricing, support users inside your product, and qualify leads so your team sees the hot prospects first.",
    },
    {
      q: "Can an AI agent answer our phone calls?",
      a: "Yes. We build inbound and outbound voice calling agents that talk naturally, answer questions, book appointments and pass the call to your team when a person is needed.",
    },
    {
      q: "How does the agent know about our business?",
      a: "It answers from your own material — documents, FAQs and pricing — using retrieval (RAG), so its answers come from your information rather than guesswork.",
    },
    {
      q: "How long does it take to add an AI agent?",
      a: "Adding AI to an existing website or product typically takes 2 to 4 weeks.",
    },
  ],
  "website-engineering": [
    {
      q: "How long does a website take to build?",
      a: "A business website typically takes 2 to 3 weeks. A custom web application usually takes 4 to 6 weeks, depending on its features and data.",
    },
    {
      q: "Which technology do you build websites with?",
      a: "Mostly Next.js, React and TypeScript with Tailwind CSS, deployed on Vercel — a modern stack that loads fast and is easy to extend later.",
    },
    {
      q: "Will my website work on phones?",
      a: "Yes. Every site is built responsive and accessible, so it works on phones, tablets and desktops.",
    },
    {
      q: "Can we update the content ourselves?",
      a: "Yes, if you need to. We can set up a headless CMS and a content workflow so your team can edit pages without touching code.",
    },
    {
      q: "Will the website be ready for Google?",
      a: "Yes. Sites ship with the search basics built in: page titles and descriptions, a sitemap, structured data and fast load times.",
    },
  ],
  "3d-experiences": [
    {
      q: "Will 3D slow my website down?",
      a: "It shouldn't. We build 3D to stay fast: it loads after the page is visible, uses a lighter version on phones, and falls back to a still image where 3D isn't supported.",
    },
    {
      q: "Does 3D work on phones?",
      a: "Yes. Every scene has a mobile fallback and respects reduced-motion settings, so each visitor gets a version that works on their device.",
    },
    {
      q: "What is 3D on a website good for?",
      a: "Explaining a product or a system, scroll-driven storytelling on launch pages, and interactive identity or product configurators.",
    },
    {
      q: "What technology do you use for 3D?",
      a: "Real-time WebGL with Three.js, plus CSS 3D for lighter interface effects.",
    },
  ],
  "search-intelligence": [
    {
      q: "What is search intelligence?",
      a: "Building your site so search engines and AI answer engines can read, understand and recommend it — through clean technical SEO, structured data and content that matches what people search for.",
    },
    {
      q: "What does it include?",
      a: "Technical SEO (sitemaps, canonicals, crawlability), semantic HTML and Schema.org structured data, social preview metadata, content structured around search intent, and Core Web Vitals performance work.",
    },
    {
      q: "How soon will we see results on Google?",
      a: "Technical fixes are picked up the next time Google visits your pages, often within days. Ranking for competitive searches takes longer — usually months — and also depends on your content and on links from other websites.",
    },
    {
      q: "Can you improve an existing website's SEO?",
      a: "Yes. We can audit and fix an existing site's technical SEO, structured data and performance, often without a full rebuild.",
    },
  ],
  "digital-systems": [
    {
      q: "What do you mean by digital systems?",
      a: "The software behind a business: SaaS platforms, backends, APIs and apps that connect your website, AI and data into one product.",
    },
    {
      q: "Can you build a SaaS product with subscriptions?",
      a: "Yes — multi-tenant SaaS with Stripe billing and team seats, authentication and permissions, and the backend and APIs that run it.",
    },
    {
      q: "How long does a SaaS MVP take?",
      a: "Typically 6 to 8 weeks, depending on its features and integrations.",
    },
    {
      q: "Do we own the code?",
      a: "Yes. You own the code and the intellectual property, with documented repositories, deployment, backups and a clear handoff.",
    },
  ],
};
