export type Service = {
  id: string;
  slug: string;
  title: string;
  layer: string;
  /** Read by the 3D scene: a layer index (0 data … 5 search), "twist" or "all". */
  focus: string;
  /** Preselects the contact form's project type (must match a ContactSection option). */
  projectType: string;
  summary: string;
  capabilities: string[];
  for: string;
  /** Ids into BRIEFS. */
  briefs: string[];
  /** Live work where this capability shipped: case-study slug + index of the feature that shows it. */
  work: { slug: string; feature: number }[];
};

export const SERVICES: Service[] = [
  {
    id: "automation",
    slug: "ai-automation",
    title: "AI Automation",
    layer: "Automation layer",
    focus: "2",
    projectType: "Automation",
    summary:
      "Background pipelines that take repetitive work off your team — documents read, records updated, next steps triggered.",
    capabilities: [
      "PDF document and invoice extraction into structured tables",
      "CRM updates and stage triggers",
      "Webhook integrations between the tools you already use",
      "Multi-step data pipelines and background jobs",
      "Podcast and media transcripts turned into briefs and captions",
    ],
    for: "Operations · Sales pipelines · Back office · Media teams",
    briefs: ["extend", "ai"],
    work: [],
  },
  {
    id: "agents",
    slug: "ai-agents",
    title: "AI Agents",
    layer: "AI layer",
    focus: "1",
    projectType: "AI Agents",
    summary:
      "Agents that understand a request and act on it — answering, qualifying, booking and routing on your site, inside your product or on the phone.",
    capabilities: [
      "Inbound and outbound voice calling agents",
      "AI receptionist for FAQs, lead capture and routing",
      "Retrieval (RAG) over your documents and pricing",
      "In-app copilots and context-aware support agents",
      "Lead qualification that flags hot prospects",
    ],
    for: "Front desk · Support · Sales · SaaS products",
    briefs: ["ai"],
    work: [],
  },
  {
    id: "web",
    slug: "website-engineering",
    title: "Website Engineering",
    layer: "Interface layer",
    focus: "3",
    projectType: "Website",
    summary: "Websites and web applications engineered around how your business actually works — not around a theme.",
    capabilities: [
      "Business websites and landing pages",
      "Custom web applications, dashboards and portals",
      "Role-based access and real-time data views",
      "Headless CMS and content workflows",
      "Responsive and accessible on every device",
    ],
    for: "Businesses · Startups · Agencies · E-commerce",
    briefs: ["website", "webapp", "internal"],
    work: [
      { slug: "business-security-alliance", feature: 1 },
      { slug: "security-leader-podcast", feature: 3 },
      { slug: "brew-with-aditya", feature: 4 },
    ],
  },
  {
    id: "3d",
    slug: "3d-experiences",
    title: "3D Experiences",
    layer: "Every layer, in depth",
    focus: "twist",
    projectType: "3D Experience",
    summary: "Interactive 3D and WebGL that explains a product or a system — rendered in the browser and built to stay fast.",
    capabilities: [
      "Real-time WebGL scenes with Three.js",
      "Scroll-driven 3D storytelling",
      "Interactive 3D identity and product configurators",
      "CSS 3D perspective interfaces",
      "Mobile fallbacks and reduced-motion support",
    ],
    for: "Launches · Brand sites · Configurators",
    briefs: [],
    work: [
      { slug: "business-security-alliance", feature: 0 },
      { slug: "security-leader-podcast", feature: 2 },
    ],
  },
  {
    id: "search",
    slug: "search-intelligence",
    title: "Search Intelligence",
    layer: "Search layer",
    focus: "5",
    projectType: "Search / SEO",
    summary: "Sites built so search engines and AI answer engines can read, understand and recommend them.",
    capabilities: [
      "Technical SEO: sitemaps, canonicals, crawlability",
      "Semantic HTML and Schema.org structured data",
      "Open Graph and social preview metadata",
      "Content architecture mapped to search intent",
      "Core Web Vitals and performance work",
    ],
    for: "Any site that needs to be found",
    briefs: ["website"],
    work: [
      { slug: "security-leader-podcast", feature: 4 },
      { slug: "brew-with-aditya", feature: 5 },
    ],
  },
  {
    id: "systems",
    slug: "digital-systems",
    title: "Digital Systems",
    layer: "The whole stack, connected",
    focus: "all",
    projectType: "SaaS",
    summary: "SaaS platforms, backends and apps that connect everything above into one product.",
    capabilities: [
      "Multi-tenant SaaS with Stripe billing and team seats",
      "PostgreSQL schemas, REST and GraphQL APIs",
      "Authentication, permissions and webhook dispatch",
      "Cross-platform apps and companion products",
      "Deployment, backups and documented handoff",
    ],
    for: "B2B software · Internal tools · Platforms",
    briefs: ["saas", "mobile", "extend"],
    work: [
      { slug: "business-security-alliance", feature: 5 },
      { slug: "brew-with-aditya", feature: 0 },
    ],
  },
];

export const getService = (slug: string) => SERVICES.find((s) => s.slug === slug);

// Common starting points and how we'd typically approach them.
export const BRIEFS = [
  { id: "website", query: "I need a website", type: "Website", timeline: "2 - 3 weeks", stack: "Next.js · Tailwind CSS · Vercel Edge · SEO schema", approach: "Static / ISR pre-rendering, edge asset compression and structured metadata for search visibility." },
  { id: "webapp", query: "I have an idea for a web app", type: "Web Application", timeline: "4 - 6 weeks", stack: "React 19 · TypeScript · PostgreSQL · REST / GraphQL", approach: "Modular UI components, secure session management, schema-enforced queries and role-based permissions." },
  { id: "saas", query: "I want to build a SaaS product", type: "SaaS", timeline: "6 - 8 weeks", stack: "Next.js App Router · Stripe · PostgreSQL · Multi-tenant auth", approach: "Tenant data segregation, subscription webhooks, seat management and background worker queues." },
  { id: "internal", query: "I need an internal business system", type: "Web Application", timeline: "3 - 5 weeks", stack: "Next.js · Tailwind · PostgreSQL · Internal webhooks", approach: "Audit logs, data-table filtering, CSV/PDF export pipelines and direct third-party API sync." },
  { id: "mobile", query: "I need a mobile app", type: "Mobile App", timeline: "4 - 7 weeks", stack: "Cross-platform framework · REST endpoints · Push infrastructure", approach: "Decoupled API endpoints, offline caching, native packaging and fast cloud sync." },
  { id: "extend", query: "I already have a website but need more", type: "Backend / API", timeline: "1 - 3 weeks", stack: "Custom REST APIs · Automated webhooks · AI add-ons", approach: "Non-disruptive proxy routing, webhook listeners, modular sub-path deployments and headless upgrades." },
  { id: "ai", query: "I want AI inside my product", type: "AI Integration", timeline: "2 - 4 weeks", stack: "Vector DB / RAG · LLM APIs · Voice agent engine", approach: "Retrieval over internal data, low-latency streaming endpoints and autonomous webhook agents." },
];
