/** The one official address. Canonical tags, sitemap, email links and the host redirect all use it. */
export const SITE_URL = "https://trivianaisolutions.in";

export interface Founder {
  name: string;
  role: string;
  focus: string;
  bio: string;
  avatarColor: string;
  skills: string[];
}

export interface StudioConfig {
  name: string;
  tagline: string;
  supportingTagline: string;
  positioningStatement: string;
  coreStatement: string;
  contactEmail: string;
  phone: string;
  /** tel: link form of `phone`. */
  phoneHref: string;
  /** Where the team works from. Clients are served worldwide. */
  cities: { city: string; region: string }[];
  location: string;
  founders: Founder[];
}

export const siteConfig: StudioConfig = {
  name: "Trivian AI Solutions",
  tagline: "We build digital systems that think.",
  supportingTagline:
    "AI automation, AI agents, intelligent websites, 3D experiences and search-ready architecture — engineered as one connected system by a three-person studio.",
  positioningStatement: "We don't just build websites. We engineer intelligent digital systems.",
  coreStatement: "You have an idea or business problem. We build the software.",
  contactEmail: "hello@trivianaisolutions.in",
  phone: "+91 87074 79271",
  phoneHref: "tel:+918707479271",
  cities: [
    { city: "Noida", region: "Uttar Pradesh" },
    { city: "Chandigarh", region: "Chandigarh" },
  ],
  location: "Noida & Chandigarh, India · Clients worldwide",
  founders: [
    {
      name: "Founder & Lead Architect",
      role: "Full-Stack Engineer & Product Lead",
      focus: "Web Apps • SaaS Platforms • AI Integration",
      bio: "Specializes in modern Next.js frontend architecture, scalable cloud systems, and embedding pragmatic AI models directly into commercial software workflows.",
      avatarColor: "from-cyan-500/20 to-blue-600/30 border-cyan-500/40 text-cyan-400",
      skills: ["Next.js", "React", "TypeScript", "FastAPI", "LLM Pipelines", "PostgreSQL"],
    },
    {
      name: "Founder & Backend Specialist",
      role: "Backend & Systems Engineer",
      focus: "Distributed APIs • Database Architecture • DevOps",
      bio: "Specializes in high-throughput API endpoints, database schemas, secure multi-tenant SaaS auth, serverless compute, and production deployments.",
      avatarColor: "from-blue-500/20 to-indigo-600/30 border-blue-500/40 text-blue-400",
      skills: ["Node.js", "Python", "PostgreSQL", "Docker", "REST/GraphQL", "Auth Systems"],
    },
    {
      name: "Founder & Automation Engineer",
      role: "Applications & AI Automation Engineer",
      focus: "Mobile & Web Apps • Workflow Automation • AI Agents",
      bio: "Engineers responsive cross-device applications, automated business data pipelines, custom voice/chat calling agents, and CRM integrations.",
      avatarColor: "from-emerald-500/20 to-teal-600/30 border-emerald-500/40 text-emerald-400",
      skills: ["Cross-Platform Apps", "Automation Pipelines", "Voice AI", "RAG Systems", "Webhooks"],
    },
  ],
};
