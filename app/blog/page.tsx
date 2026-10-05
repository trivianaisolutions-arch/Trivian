import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NextStep } from "@/components/NextStep";
import { POSTS, formatDate, readMinutes } from "@/lib/posts";
import { JsonLd, breadcrumbs, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta(
  "Blog",
  "Plain-English guides to AI automation, AI agents, calling agents and modern websites — for business owners deciding what to build.",
  "/blog",
);

export default function BlogPage() {
  return (
    <div id="top" className="surface-ink min-h-screen">
      <Navbar />
      <main id="main" tabIndex={-1} className="shell pb-28 pt-36">
        <nav aria-label="Breadcrumb" className="label text-ash-400">
          <Link href="/" className="link-line">Studio</Link> <span aria-hidden="true">/</span> <span className="text-bone-100">Blog</span>
        </nav>
        <h1 className="display mt-8 text-[length:var(--step-xl)]">
          Blog<span className="text-accent">.</span>
        </h1>
        <p className="lead mt-6 max-w-2xl text-ash-300">
          Plain-English guides to AI automation, AI agents and modern websites — what they are, what they&apos;re good
          for, and how to start.
        </p>

        <ol className="mt-14 border-t border-bone-100/10">
          {POSTS.map((post) => (
            <li key={post.slug} className="group border-b border-bone-100/10">
              <Link href={`/blog/${post.slug}`} data-cursor="view" className="grid gap-4 py-10 md:grid-cols-12 md:items-baseline">
                <span className="label text-ash-400 md:col-span-3">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span className="mt-2 block">{readMinutes(post)} min read</span>
                </span>
                <span className="md:col-span-9">
                  <span className="display block text-[clamp(1.5rem,1rem+2vw,2.6rem)] transition-colors group-hover:text-signal">
                    {post.title}
                  </span>
                  <span className="mt-3 block max-w-2xl text-[0.9375rem] leading-relaxed text-ash-300">{post.description}</span>
                  <span className="label mt-5 block text-accent">Read article →</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </main>
      <NextStep />
      <Footer />
      <JsonLd data={breadcrumbs([{ name: "Studio", path: "/" }, { name: "Blog", path: "/blog" }])} />
    </div>
  );
}
