/**
 * Blog articles. To publish one, add an entry here — the list page, article page and sitemap pick it up.
 * Paragraph text supports **bold** and [links](/path). Write from real experience; no invented numbers.
 */
export type Block = string | { h2: string } | { list: string[]; ordered?: boolean } | { table: string[][] };

export type Post = {
  slug: string;
  title: string;
  /** Search-result snippet: under 160 characters. */
  description: string;
  /** YYYY-MM-DD */
  date: string;
  body: Block[];
};

export const POSTS: Post[] = [
  {
    slug: "ai-calling-agent-vs-call-centre",
    title: "AI calling agent vs call centre: which is right for you?",
    description:
      "An honest comparison of AI calling agents and human call centres — availability, busy periods, complex calls and cost — and why most businesses need both.",
    date: "2026-10-12",
    body: [
      "When the phone rings more than your team can handle, there are two classic answers: more people — an in-house team or an outsourced call centre — or software. AI calling agents have made the second option far more capable. But they don't replace people for every call, and choosing the wrong one for the wrong calls costs you customers.",
      { h2: "The difference at a glance" },
      {
        table: [
          ["", "AI calling agent", "Call centre (people)"],
          ["Availability", "Every hour of every day", "Set shifts; nights and weekends cost more"],
          ["Busy periods", "Many calls at the same time", "Callers queue, or you hire for the peak"],
          ["Repetitive calls", "The same accurate answer every time", "Quality varies with training and tiredness"],
          ["Complex or emotional calls", "Limited — it should hand over", "People are much better at these"],
          ["Changes", "Update the instructions once", "Retrain every team member"],
          ["How you pay", "Mostly for usage — the calls it handles", "Mostly per person or per hour"],
          ["Setup", "Write instructions, connect your tools", "Hire, train and manage people"],
        ],
      },
      { h2: "When an AI calling agent fits best" },
      {
        list: [
          "**Most calls repeat** — bookings, opening hours, prices you publish, order or appointment status.",
          "**Calls arrive outside working hours**, and missed calls mean lost customers.",
          "**Your volume jumps** — after a campaign, in a season, or at the start of each day.",
          "**Speed matters**, like calling back a new lead while they're still interested.",
        ],
      },
      { h2: "When people are the better choice" },
      {
        list: [
          "**Calls need judgement** — complaints, negotiations, or a decision that isn't in any script.",
          "**Callers are upset or vulnerable** and need empathy more than speed.",
          "**The conversation is sensitive** — health, money or legal questions that need a qualified person.",
          "**Relationships are the product**, such as account managers who know each client.",
        ],
      },
      { h2: "Why most businesses need both" },
      "The strongest setup is usually a combination: the AI agent takes the first line and the repetitive calls, and your people take everything else. Three common ways to start:",
      {
        list: [
          "**After hours** — the AI agent answers when the office is closed and leaves your team a summary for the morning.",
          "**Overflow** — it picks up when every line is busy, so nobody hears an endless ring.",
          "**One call type** — it handles bookings, for example, while your team handles the rest.",
        ],
      },
      "In every case, a good agent passes the caller to a person whenever it should, with a written summary so the caller never has to repeat themselves.",
      { h2: "Questions to answer before you choose" },
      {
        ordered: true,
        list: [
          "**What share of your calls are repetitive?** Listen to a week of calls and sort them.",
          "**When do calls come in?** Look for nights, weekends and peaks you can't cover today.",
          "**Which systems does a call touch?** Calendar, CRM, order system — the agent will need access to them.",
          "**Which rules apply?** Telling callers they're talking to AI, recording calls, and your country's rules for automated calls.",
        ],
      },
      "We build AI calling agents connected to the tools a business already uses. [See our AI calling agent service](/services/ai-calling-agent), read [what an AI calling agent is](/blog/what-is-an-ai-calling-agent), or [tell us about your calls](/contact).",
    ],
  },
  {
    slug: "ai-receptionist-for-clinics",
    title: "AI receptionist for clinics: how it works",
    description:
      "How an AI receptionist answers a clinic's calls, books and moves appointments, sends reminders and hands over to staff — plus what it must never do.",
    date: "2026-10-12",
    body: [
      "A clinic's phone rarely stops. The same person at the front desk is checking patients in, answering questions and picking up call after call — and every call that goes unanswered can be an appointment that goes elsewhere. An AI receptionist answers those calls in a natural voice, takes care of the routine ones, and leaves your staff free for the patients in front of them.",
      { h2: "What an AI receptionist can handle" },
      {
        list: [
          "**Booking, moving and cancelling appointments**, straight into your calendar or booking system.",
          "**Everyday questions** — opening hours, location and parking, which doctor is in on which days, the consultation fees you publish, what to bring.",
          "**Reminders and confirmations** before appointments, which can help reduce missed visits.",
          "**After-hours calls**, with a message and a short summary waiting for your team in the morning.",
          "**Routing** — sending the caller to the right department or person.",
        ],
      },
      { h2: "What it must never do" },
      "This matters more in a clinic than almost anywhere else. An AI receptionist is for admin, not medicine. It should be set up so that it:",
      {
        list: [
          "**never gives medical advice**, diagnoses or interprets symptoms and reports;",
          "**tells callers with an emergency** to contact emergency services right away and transfers urgent calls to staff;",
          "**hands over** anything clinical, any complaint and anything it isn't sure about.",
        ],
      },
      { h2: "How a typical call goes" },
      "Say a patient calls at 9 pm to move tomorrow's appointment. The receptionist greets them and says it's an AI assistant. It confirms who they are with details the clinic chooses, finds the booking, offers the free slots later in the week, moves the appointment and sends a confirmation. The whole call takes a minute or two, and your staff see the change in the morning without having picked up the phone.",
      { h2: "Connecting it to your clinic" },
      {
        list: [
          "**Your calendar or practice software**, so it can see free slots and book them. Many systems allow this through an integration; others work with a shared calendar.",
          "**Your clinic's information** — doctors, timings, services, published fees and policies — kept up to date so its answers stay right.",
          "**Your existing phone number**, by forwarding calls after hours or when the line is busy.",
        ],
      },
      { h2: "Patient privacy" },
      "Health information is sensitive. Collect only what a booking needs, limit who can see call records, tell callers if calls are recorded, and follow the data-protection rules that apply to you — such as India's Digital Personal Data Protection Act, or HIPAA for clinics in the US. Check the details with your compliance adviser before going live.",
      { h2: "How to start" },
      {
        ordered: true,
        list: [
          "**Start with one call type** — appointment bookings are the usual first choice.",
          "**Write down how your best receptionist handles it**: the questions, the answers and when to pass the call on.",
          "**Connect the calendar** and test it with your own staff first.",
          "**Go live after hours**, read the call transcripts for the first weeks, then extend it to busy daytime hours.",
        ],
      },
      "We build AI receptionists and calling agents connected to the tools a clinic already uses. [See our AI calling agent service](/services/ai-calling-agent), compare [AI calling agents and call centres](/blog/ai-calling-agent-vs-call-centre), or [tell us about your clinic](/contact).",
    ],
  },
  {
    slug: "how-long-does-it-take-to-build-a-saas-mvp",
    title: "How long does it take to build a SaaS MVP?",
    description:
      "What decides how long a SaaS MVP takes to build, what to include and leave out, how the work runs, and how to launch sooner without cutting corners.",
    date: "2026-10-12",
    body: [
      "An MVP — minimum viable product — is the smallest version of your software that real customers can use, and pay for, to solve one real problem. Its job is to prove the idea works before you invest in everything else. So the honest answer to “how long does it take?” is: **it depends far more on what you choose to build first than on how fast anyone types.**",
      "For a focused SaaS MVP — one core workflow, sign-in, subscriptions and an admin view — our typical build is **6 to 8 weeks**. Here's what pushes that up or down, and how to keep it short.",
      { h2: "What decides the timeline" },
      {
        list: [
          "**The number of core workflows.** One workflow done well ships fast. Three half-finished ones take longer and prove less.",
          "**User roles and permissions.** A single type of user is simple. Admins, team members, clients and guests each add screens and rules.",
          "**Teams and billing.** Companies with several seats, plans and invoices (for example through Stripe) need careful handling of who pays and who can do what.",
          "**Integrations.** Every connection — a CRM, calendar, payment provider or another company's API — adds setup and testing.",
          "**AI features.** An assistant that answers from your own data, or a step that reads documents, needs good test material and checks for wrong answers.",
          "**Decisions on your side.** Projects slow down most when key questions — pricing, who the first users are, what “done” looks like — stay open.",
        ],
      },
      { h2: "What an MVP should include — and what can wait" },
      {
        table: [
          ["", "Build it now", "Leave it for later"],
          ["Product", "The one workflow your first customers pay for", "Nice-to-have features and edge cases"],
          ["Accounts", "Sign-up, sign-in, password reset", "Single sign-on and complex team hierarchies"],
          ["Payments", "One or two plans with subscription billing", "Coupons, usage-based pricing, many currencies"],
          ["Admin", "A simple view to see users and fix problems", "Full analytics dashboards"],
          ["Design", "Clean, responsive and easy to use", "Custom illustrations and animations"],
        ],
      },
      "Everything in the right column is worth building — once real customers have shown you which parts they actually want.",
      { h2: "How the work usually runs" },
      "Most of our projects follow the same seven steps. For an MVP they overlap and move quickly:",
      {
        ordered: true,
        list: [
          "**Discover** — agree on the problem, the first users and what success looks like.",
          "**Architect** — plan the data, the integrations and the milestones.",
          "**Design** — screens for the core workflow, tested on phones and desktops.",
          "**Build** — the frontend, backend and database, in typed code.",
          "**Integrate** — payments, email and the tools you already use.",
          "**Optimize** — testing, accessibility and speed.",
          "**Launch** — deploy to your domain and hand over documented code that you own.",
        ],
      },
      "You'll find more detail on each step in [our process](/process).",
      { h2: "How to launch sooner without cutting corners" },
      {
        list: [
          "**Write down the one job your MVP must do.** If a feature doesn't help that job, it waits.",
          "**Use proven building blocks** for sign-in, payments and email instead of building them from scratch.",
          "**Decide quickly.** Name one person who can say yes or no on scope and design.",
          "**Put it in front of real users early**, then improve it from what they actually do.",
        ],
      },
      { h2: "What about cost?" },
      "Cost follows the same factors as time: the number of workflows, roles, integrations and AI features. Rather than a one-size price, a short call about your idea gives you a clear scope, timeline and cost before any work starts.",
      "We build SaaS platforms, backends and apps end to end. [See our SaaS & custom software development work](/services/digital-systems), read about [business tasks you can automate with AI](/blog/business-tasks-you-can-automate-with-ai), or [tell us what you want to build](/contact).",
    ],
  },
  {
    slug: "ai-chatbot-vs-ai-agent",
    title: "AI chatbot vs AI agent: what's the difference?",
    description:
      "Chatbots answer questions; AI agents get things done. A clear comparison of the two, with examples, and how to decide which one your business needs.",
    date: "2026-10-05",
    body: [
      "The two words get used as if they mean the same thing, but they describe different tools. The short version: **a chatbot talks, an AI agent acts.** Knowing the difference helps you pay for the right thing — and not buy an agent when a chatbot would do, or the other way round.",
      { h2: "What is an AI chatbot?" },
      "A chatbot is a conversation window — on a website, on WhatsApp or inside an app — that answers questions. Older chatbots followed fixed scripts and buttons. Modern AI chatbots use a language model, so they understand questions however they're phrased and answer from the information you give them: your FAQs, policies or product catalogue.",
      "What makes it a chatbot is that its job ends with the answer. If the customer needs something done, a person usually does it.",
      { h2: "What is an AI agent?" },
      "An AI agent is given a goal and the tools to reach it. It works through several steps on its own: it looks something up, decides what to do next, takes an action in another system, checks the result and carries on.",
      "Asked to reschedule an appointment, for example, an agent can find the booking, check the calendar for free slots, offer the options, move the booking and send a confirmation — without a person in the loop. An agent doesn't even need a chat window: it can work by phone, by email, or quietly in the background whenever a new order or document arrives.",
      { h2: "The difference at a glance" },
      {
        table: [
          ["", "AI chatbot", "AI agent"],
          ["Main job", "Answers questions", "Completes tasks"],
          ["Works through", "A chat window", "Chat, phone, email or in the background"],
          ["Steps", "One question, one answer", "Several steps, deciding as it goes"],
          ["Connected to", "Your knowledge: FAQs, documents", "Your knowledge and your tools: calendar, CRM, email"],
          ["Needs", "Accurate information", "Accurate information, permissions and safety checks"],
          ["Typical use", "Answering enquiries at any hour", "Bookings, follow-ups, updating records, handling requests"],
        ],
      },
      { h2: "When a chatbot is enough" },
      {
        list: [
          "Most of the messages you get are questions with clear answers.",
          "You want instant replies at any hour, and a person can handle whatever comes next.",
          "You're trying AI for the first time and want something simple and low-risk.",
        ],
      },
      { h2: "When you need an agent" },
      {
        list: [
          "Customers ask for things to be **done**, not just explained — bookings, changes, status updates.",
          "The same multi-step task repeats all day across several tools.",
          "Speed matters, and waiting for a person to pick the task up loses customers.",
        ],
      },
      { h2: "What to check before an agent does real work" },
      "Because an agent takes actions, it needs more care than a chatbot:",
      {
        list: [
          "**Limited permissions.** Let it use only the tools and data its task needs.",
          "**Approval for big actions.** Refunds, payments and anything hard to undo should wait for a person to confirm.",
          "**A record of every action**, so you can see what it did and why.",
          "**A clear handover** to your team whenever it isn't sure.",
        ],
      },
      { h2: "Start with one, grow into the other" },
      "Many businesses start with a chatbot that answers questions, then give it its first tool — booking appointments, say — and it becomes an agent. Building it in that order keeps the risk low and shows value early.",
      "We build both, connected to the systems you already use. [See how we build AI agents](/services/ai-agents), read about [which tasks are worth automating](/blog/business-tasks-you-can-automate-with-ai), or [tell us what you'd like it to handle](/contact).",
    ],
  },
  {
    slug: "business-tasks-you-can-automate-with-ai",
    title: "Business tasks you can automate with AI today",
    description:
      "Ten everyday business tasks AI can already take off your team's plate — from replying to enquiries to reading invoices — and how to pick the first one.",
    date: "2026-10-05",
    body: [
      "Most businesses don't need a robot. They need fewer hours spent copying details between emails, spreadsheets and apps. That repetitive work is exactly what AI automation is good at. Here are ten tasks AI can handle reliably today, and how to choose where to begin.",
      { h2: "1. Replying to common enquiries" },
      "An AI assistant on your website or WhatsApp can answer the questions you get every day — your services, timings, the prices you publish, how to book — instantly, at any hour. Anything it can't answer goes to your team with the conversation attached.",
      { h2: "2. Capturing and following up on leads" },
      "When someone fills in a form, sends a message or calls, AI can save their details to your CRM, send a personal reply within seconds and remind your team to follow up — so no enquiry sits unanswered.",
      { h2: "3. Booking appointments and sending reminders" },
      "Customers can book, reschedule or cancel by chat or phone, straight into your calendar, with automatic reminders before the appointment.",
      { h2: "4. Reading documents and pulling out the details" },
      "Invoices, purchase orders, forms and PDFs can be read automatically, with the important fields — names, dates, amounts, GST numbers — entered into your system. A person checks only the ones the AI flags as unclear.",
      { h2: "5. Keeping your CRM and spreadsheets up to date" },
      "Instead of someone copying information from emails and chats into a sheet, an automation updates records as things happen and keeps every tool in sync.",
      { h2: "6. Summarising calls and meetings" },
      "AI can turn a recorded call or meeting into a short summary with the decisions and next steps, and file it against the right customer.",
      { h2: "7. Drafting emails, quotes and proposals" },
      "From a few notes, AI can draft a reply, a quote or a first version of a proposal in your tone. Your team reviews it and sends it — and the blank-page time disappears.",
      { h2: "8. Sorting support requests" },
      "Incoming emails and tickets can be read, tagged by topic and urgency and sent to the right person, with suggested replies for the simple ones.",
      { h2: "9. Producing regular reports" },
      "Weekly sales, stock or campaign reports can be put together automatically from your data, with a plain-language note on what changed.",
      { h2: "10. Preparing content for review" },
      "Product descriptions, social posts and FAQs can be drafted from material you already have. Keep a person in charge of approving anything that goes public.",
      { h2: "How to choose the first task" },
      "Good first candidates share four traits:",
      {
        list: [
          "**They repeat often** — daily or weekly, not once a quarter.",
          "**They follow clear steps**, even if a few cases need judgement.",
          "**The information is already digital** — emails, forms, PDFs, chats.",
          "**A mistake is easy to catch** before it causes harm.",
        ],
      },
      "Don't start with work where an error is costly and hard to spot, like final payments or legal decisions. Automate the preparation, and keep the approval with a person.",
      { h2: "A simple way to start" },
      {
        ordered: true,
        list: [
          "**List the tasks** your team repeats every week, and roughly how long each takes.",
          "**Pick one** that scores well on the four traits above.",
          "**Map its steps** — where the information comes from and where it needs to end up.",
          "**Automate one step at a time**, with a person reviewing the output at first.",
          "**Measure the time saved**, then move on to the next task.",
        ],
      },
      "Small automations that work beat one big project that takes months to deliver.",
      "We build automations like these around the tools you already use. [See our AI automation work](/services/ai-automation), read about [AI calling agents](/blog/what-is-an-ai-calling-agent), or [send us the task you'd like to automate](/contact).",
    ],
  },
  {
    slug: "what-is-an-ai-calling-agent",
    title: "What is an AI calling agent, and how does it work for a business?",
    description:
      "A plain-English guide to AI calling agents: what they are, how a call works, what they handle well, when a human should step in, and how to start.",
    date: "2026-10-05",
    body: [
      "An AI calling agent is software that answers or makes phone calls and holds a real conversation in a natural voice. It understands what the caller says, replies, and then does something useful with the call — books an appointment, logs the enquiry in your CRM, or passes the call to a person on your team.",
      "Unlike an old phone menu (“press 1 for sales”), the caller simply talks. And unlike a recorded message, the agent can answer follow-up questions.",
      { h2: "How a call works, step by step" },
      "Behind every call, a few systems work together in a loop that repeats throughout the conversation:",
      {
        ordered: true,
        list: [
          "**The phone line.** A telephony provider connects the call to the agent, just as it would connect it to a person's phone.",
          "**Listening.** Speech recognition turns the caller's words into text as they speak.",
          "**Thinking.** A language model reads that text, together with your instructions and business information, and decides what to say or do next.",
          "**Acting.** If the caller wants to book, the agent checks your calendar; if they leave details, it saves them to your CRM or a spreadsheet.",
          "**Speaking.** Text-to-speech turns the reply into a natural-sounding voice.",
        ],
      },
      "How good a calling agent is depends less on its voice and more on two things: how well it knows your business, and which systems it's allowed to use.",
      { h2: "What a calling agent handles well" },
      {
        list: [
          "**Answering common questions** — opening hours, the prices you publish, locations, how a service works.",
          "**Booking, moving and cancelling appointments**, directly in your calendar.",
          "**Qualifying new leads** — asking the questions your sales team would ask, then sending them a summary.",
          "**Calling back missed calls and new enquiries**, so a lead doesn't go cold overnight.",
          "**Reminders and confirmations** before appointments.",
          "**Taking messages after hours**, with a written summary waiting for your team in the morning.",
        ],
      },
      { h2: "When a human should take over" },
      "A good calling agent knows its limits. Set it up to hand the call to a person — or take a message — when:",
      {
        list: [
          "the caller is upset, or the topic is sensitive;",
          "the question needs judgement, negotiation or a commitment on price;",
          "the agent isn't confident it understood;",
          "the caller simply asks for a human.",
        ],
      },
      "The handover should be smooth: the agent passes on what it has already learned, so the caller doesn't have to repeat themselves.",
      { h2: "What to get right before you go live" },
      {
        list: [
          "**Say that it's AI.** Tell callers at the start that they're speaking with an AI assistant. It builds trust, and callers increasingly expect it.",
          "**Follow calling and privacy rules.** Outbound calls must follow your country's telecom rules — in India, TRAI's regulations on commercial calls — and respect do-not-call preferences. Handle recordings and personal details carefully.",
          "**Give it accurate information.** The agent can only be as right as the knowledge you give it, so keep prices, timings and policies up to date.",
          "**Review real calls.** Read the transcripts in the first weeks and fix any answers that weren't right.",
        ],
      },
      { h2: "How to start without a big project" },
      {
        ordered: true,
        list: [
          "**Pick one call type** that's frequent and repetitive — appointment bookings or after-hours enquiries, for example.",
          "**Write down how your best team member handles it**: the questions they ask, the answers they give and when they escalate.",
          "**Connect only the systems that call needs** — usually a calendar and a CRM or sheet.",
          "**Test it with your own team** before customers hear it.",
          "**Go live on a small share of calls**, review the transcripts, then expand.",
        ],
      },
      "Once one call type works reliably, adding the next one is much faster.",
      { h2: "Is it right for your business?" },
      "A calling agent makes sense when your phone rings more than your team can answer, when calls come in outside working hours, or when the same questions take up hours every week. If most of your calls need careful human judgement, start smaller — with after-hours message taking, say — and grow from there.",
      "We design and build calling agents connected to the tools a business already uses. [See our AI calling agent service](/services/ai-calling-agent), compare [AI calling agents and call centres](/blog/ai-calling-agent-vs-call-centre), or [tell us about your calls](/contact) and we'll suggest where an agent would help first.",
    ],
  },
];

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug);

const words = (b: Block) =>
  (typeof b === "string" ? b : "h2" in b ? b.h2 : "list" in b ? b.list.join(" ") : b.table.flat().join(" ")).split(/\s+/).length;

export const readMinutes = (p: Post) => Math.max(1, Math.round(p.body.reduce((n, b) => n + words(b), 0) / 200));

export const formatDate = (d: string) =>
  new Date(`${d}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
