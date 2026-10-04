import type { StaticImageData } from "next/image";
import bsaShot from "@/public/work/business-security-alliance.jpg";
import podcastShot from "@/public/work/security-leader-podcast.jpg";
import brewShot from "@/public/work/brew-with-aditya.jpg";

export interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  tagline: string;
  category: string;
  shortDescription: string;
  /** Search-result snippet: under 160 characters so Google shows it whole. */
  metaDescription: string;
  problem: string;
  solution: string;
  features: string[];
  technologies: string[];
  architecture: string;
  liveUrl: string;
  repositoryUrl?: string;
  aiFeatures?: string;
  featured: boolean;
  accentColor: string;
  badge: string;
  /** Screenshot of the live production homepage. */
  image: StaticImageData;
  imageAlt: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "business-security-alliance",
    title: "Business Security Alliance",
    client: "Business Security Alliance (BSA)",
    tagline: "The Global Professional Network for the Security Industry",
    category: "Web Application / Member Platform",
    badge: "Live Member Platform",
    image: bsaShot,
    imageAlt: "Homepage of the live Business Security Alliance member platform",
    accentColor: "cyan",
    featured: true,
    shortDescription:
      "A high-performance web platform featuring a live member directory, interactive 3D executive passport generator, regional chapter directory, events schedule, and real-time community engagement.",
    metaDescription:
      "Case study: the Business Security Alliance member platform, with a live member directory, 3D executive passport generator, chapters and events.",
    problem:
      "Security leaders, CISOs, and enterprise risk practitioners across physical, electronic, and cybersecurity needed a dedicated, zero-noise professional network to discover verified peers, exchange field telemetry, and coordinate across global hubs (Washington DC, London, Frankfurt) without generic social media noise.",
    solution:
      "Engineered a modern, responsive web application built with Next.js, featuring an interactive 3D Executive Passport builder, live search directory, regional chapters, and real-time database queries.",
    features: [
      "Interactive 3D Executive Passport Builder with customized disciplines and instant verification preview",
      "Live Searchable Member Directory with discipline filtering and regional hub tagging",
      "Real-time Platform Telemetry showcasing live member counts, active chapters, and open opportunities",
      "Community Events & Opportunities Board connecting security leaders across 80+ countries",
      "Zero-Trust Architecture Showcase with responsive dark cyber aesthetic",
      "Member authentication and streamlined onboarding portal",
    ],
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Dynamic DB Queries",
      "Vercel",
    ],
    architecture:
      "Built on Next.js App Router with server-rendered layout shells and client-side interactive islands for the 3D card tilt and discipline configuration. Uses responsive CSS grid layouts, dynamic SVG badges, and lightweight animations for maximum page speed.",
    liveUrl: "https://www.businesssecurityalliance.com/",
  },
  {
    slug: "security-leader-podcast",
    title: "Security Leader Podcast",
    client: "Hosted by Business Security Alliance",
    tagline: "Where the World's Security Leaders Speak",
    category: "Media Platform & Audio Engine",
    badge: "Media Platform",
    image: podcastShot,
    imageAlt: "Homepage of the live Security Leader Podcast media platform",
    accentColor: "sky",
    featured: true,
    shortDescription:
      "A broadcast media web application featuring an interactive live audio visualizer equalizer, dynamic episode player, YouTube stream integration, and host intelligence profiles.",
    metaDescription:
      "Case study: the Security Leader Podcast media platform, with a live audio visualizer, episode player, YouTube streams and host profiles.",
    problem:
      "The Business Security Alliance needed a broadcast-grade media platform to showcase unfiltered conversations with global CISOs and security pioneers, requiring responsive audio visualizer experiences, YouTube video streaming, and detailed guest spotlighting.",
    solution:
      "Designed and developed an atmospheric dark-mode media hub with Next.js and custom CSS animation engines, featuring an interactive 48-bar audio frequency visualizer, integrated YouTube broadcast player, host cards with 3D tilt effects, and structured video schema markup.",
    features: [
      "Interactive Live Audio Visualizer with 48 animated frequency bars and mute/unmute audio engine",
      "Featured Broadcast Player integrated with YouTube video streams and broadcast telemetry",
      "3D Perspective Host Showcase highlighting executive leadership and guest bios",
      "Episode Explorer with timestamps, topics, and multi-platform listening links",
      "SEO VideoObject structured data for Google search indexing and social sharing cards",
      "Optimized responsive layout with custom typography and smooth micro-interactions",
    ],
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Web Audio / CSS Animations",
      "YouTube API",
      "JSON-LD Video Schema",
    ],
    architecture:
      "Utilizes Next.js with optimized image and media loading pipelines, 3D CSS perspective transforms, and client-side audio state toggling to provide an immersive listening and viewing experience.",
    liveUrl: "https://www.securityleaderpodcast.com/",
  },
  {
    slug: "brew-with-aditya",
    title: "Brew With Aditya",
    client: "Brew With Aditya Specialty Coffee",
    tagline: "Artisanal Specialty Coffee by India's Youngest Roaster",
    category: "E-Commerce & Specialty Coffee Platform",
    badge: "Brand & Commerce Hub",
    image: brewShot,
    imageAlt: "Homepage of the live Brew With Aditya specialty coffee platform",
    accentColor: "amber",
    featured: true,
    shortDescription:
      "A high-performance brand, media, and subscription platform for artisanal specialty coffee, connecting coffee champions, brewing podcasts, and roast ordering with a Render API backend.",
    metaDescription:
      "Case study: the Brew With Aditya specialty coffee platform, combining brand, brewing podcasts, subscriptions and roast ordering.",
    problem:
      "An artisanal specialty coffee brand needed a unified web presence to sell roasted single-origin coffees, showcase champion interviews and brewing podcasts, and provide instant mobile app integration for loyal customers.",
    solution:
      "Built a high-converting web application with fast preconnection to a dedicated Render backend API, seamless iOS Smart App banner integration, smooth scroll navigation, and analytics optimization.",
    features: [
      "Dedicated API Backend Integration hosted on Render for dynamic roast inventory and order management",
      "Podcast & Media Streaming Hub featuring champions in the specialty coffee industry",
      "iOS Smart App Banner integration (`app-id=6805394981`) for frictionless mobile onboarding",
      "Deferred Analytics & Performance Optimization with requestIdleCallback to guarantee instant initial paint",
      "Mobile-responsive specialty coffee product showcase with clean visual hierarchy",
      "High-speed DNS prefetching and production SEO indexing",
    ],
    technologies: [
      "React / Next.js",
      "Tailwind CSS",
      "Render API Backend",
      "REST APIs",
      "iOS Smart App Banner",
      "GA4 / Clarity Analytics",
    ],
    architecture:
      "Decoupled frontend architecture with preconnected API backend on Render, high-speed DNS prefetching, zero-render-blocking script deferral, and responsive mobile-first commerce layout.",
    liveUrl: "https://brewwithaditya.com/",
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}

export function getAllCaseStudies(): CaseStudy[] {
  return caseStudies;
}

export const hostOf = (url: string) => new URL(url).hostname.replace(/^www\./, "");
