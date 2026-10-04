// Project brief: the contact form's fields, options, validation and the text summary.
// Pure (no Node/DOM APIs) so the browser and the server share the same rules.

export const PROJECT_TYPES = [
  { value: "Website", label: "Website", icon: "website" },
  { value: "Web Application", label: "Web app", icon: "webapp" },
  { value: "SaaS", label: "SaaS platform", icon: "saas" },
  { value: "Mobile App", label: "Mobile app", icon: "mobile" },
  { value: "AI Agents", label: "AI agents", icon: "agents" },
  { value: "Automation", label: "Automation", icon: "automation" },
  { value: "AI Integration", label: "AI in my product", icon: "aiint" },
  { value: "3D Experience", label: "3D / WebGL", icon: "3d" },
  { value: "Search / SEO", label: "Search & SEO", icon: "search" },
  { value: "Backend / API", label: "Backend & API", icon: "backend" },
  { value: "Other", label: "Something else", icon: "other" },
] as const;
export const BUDGETS = ["< $5,000", "$5,000 - $15,000", "$15,000 - $30,000", "$30,000+", "Not sure yet"];
export const TIMELINES = ["ASAP (< 1 month)", "1 - 2 months", "3 - 6 months", "Flexible"];
export const MIN_BRIEF = 20;

export const EMPTY_BRIEF = {
  projectType: "",
  whatToBuild: "",
  budget: "",
  timeline: "",
  website: "",
  name: "",
  email: "",
  phone: "",
  company: "",
};
export type Brief = typeof EMPTY_BRIEF;
export type BriefErrors = Partial<Record<keyof Brief, string>>;

/** The three steps of the form and the fields each one owns. */
export const STEPS: { title: string; fields: (keyof Brief)[] }[] = [
  { title: "What do you need?", fields: ["projectType"] },
  { title: "Tell us about it", fields: ["whatToBuild", "budget", "timeline", "website"] },
  { title: "How do we reach you?", fields: ["name", "email", "phone", "company"] },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX: Record<keyof Brief, number> = {
  projectType: 40,
  whatToBuild: 5000,
  budget: 40,
  timeline: 40,
  website: 200,
  name: 120,
  email: 200,
  phone: 40,
  company: 160,
};

export function validate(f: Brief): BriefErrors {
  const e: BriefErrors = {};
  if (!PROJECT_TYPES.some((t) => t.value === f.projectType)) e.projectType = "Pick the closest fit — you can explain more next.";
  if (f.whatToBuild.trim().length < MIN_BRIEF) e.whatToBuild = `A sentence or two, please (at least ${MIN_BRIEF} characters).`;
  if (f.budget && !BUDGETS.includes(f.budget)) e.budget = "Pick one of the options.";
  if (f.timeline && !TIMELINES.includes(f.timeline)) e.timeline = "Pick one of the options.";
  if (!f.name.trim()) e.name = "Tell us who we're talking to.";
  if (!EMAIL_RE.test(f.email.trim())) e.email = "Enter an email address we can reply to.";
  if (f.phone && !/^[+\d][\d\s().-]{5,}$/.test(f.phone.trim())) e.phone = "That doesn't look like a phone number.";
  for (const k of Object.keys(MAX) as (keyof Brief)[]) if (f[k].length > MAX[k]) e[k] = "That's a bit long — please shorten it.";
  return e;
}

/** Errors for one step only (the form validates as you go). */
export function validateStep(f: Brief, step: number): BriefErrors {
  const all = validate(f);
  return Object.fromEntries(STEPS[step].fields.filter((k) => all[k]).map((k) => [k, all[k]]));
}

/** Server side: coerce untrusted input into a Brief (unknown keys dropped, strings trimmed). */
export function clean(input: unknown): Brief {
  const src = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const out = { ...EMPTY_BRIEF };
  for (const k of Object.keys(EMPTY_BRIEF) as (keyof Brief)[]) {
    const v = src[k];
    out[k] = typeof v === "string" ? v.replace(/\r\n?/g, "\n").trim() : "";
  }
  return out;
}

export function briefText(f: Brief) {
  return [
    `Name: ${f.name}`,
    `Company: ${f.company || "—"}`,
    `Email: ${f.email}`,
    `Phone: ${f.phone || "—"}`,
    `Current website: ${f.website || "—"}`,
    `Project type: ${f.projectType}`,
    `Budget: ${f.budget || "—"}`,
    `Timeline: ${f.timeline || "—"}`,
    "",
    "What we're trying to build:",
    f.whatToBuild,
  ].join("\n");
}
