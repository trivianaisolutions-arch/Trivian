import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NextStep } from "@/components/NextStep";
import { siteConfig } from "@/lib/config";
import { POSTS, type Block, formatDate, getPost, readMinutes } from "@/lib/posts";
import { JsonLd, SITE_URL, breadcrumbs, pageMeta } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return { title: "Article not found" };
  return pageMeta(post.title, post.description, `/blog/${post.slug}`);
}

/** **bold** and [label](/path) inside a paragraph or list item. */
function rich(text: string) {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    const bold = part.match(/^\*\*(.+)\*\*$/);
    if (bold) return <strong key={i} className="font-semibold text-ink-950">{bold[1]}</strong>;
    const link = part.match(/^\[(.+)\]\((.+)\)$/);
    if (link)
      return (
        <Link key={i} href={link[2]} className="text-signal-deep underline decoration-1 underline-offset-4 hover:text-ink-950">
          {link[1]}
        </Link>
      );
    return part;
  });
}

function BlockView({ block }: { block: Block }) {
  if (typeof block === "string") return <p>{rich(block)}</p>;
  if ("h2" in block) return <h2 className="display pt-6 text-[clamp(1.35rem,1rem+1vw,1.9rem)] leading-tight text-ink-950">{block.h2}</h2>;
  if ("list" in block) {
    const List = block.ordered ? "ol" : "ul";
    return (
      <List className={`space-y-3 pl-6 marker:text-signal-deep ${block.ordered ? "list-decimal" : "list-disc"}`}>
        {block.list.map((item) => (
          <li key={item} className="pl-1">{rich(item)}</li>
        ))}
      </List>
    );
  }
  const [head, ...rows] = block.table;
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-[0.9375rem] leading-snug">
        <thead>
          <tr>
            {head.map((h, i) => (i === 0 ? <td key={i} /> : <th key={i} scope="col" className="label border-b border-ink-900/25 py-3 pr-4 text-ink-900">{h}</th>))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, ...cells]) => (
            <tr key={label} className="border-b border-ink-900/10 align-top">
              <th scope="row" className="py-3 pr-4 font-semibold text-ink-950">{label}</th>
              {cells.map((c, i) => (
                <td key={i} className="py-3 pr-4">{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const next = POSTS[(POSTS.indexOf(post) + 1) % POSTS.length];
  const url = `${SITE_URL}/blog/${post.slug}`;

  return (
    <div id="top" className="surface-ink min-h-screen">
      <Navbar />
      <main id="main" tabIndex={-1}>
        <article>
          <header className="shell pb-16 pt-36">
            <nav aria-label="Breadcrumb" className="label text-ash-400">
              <Link href="/" className="link-line">Studio</Link> <span aria-hidden="true">/</span>{" "}
              <Link href="/blog" className="link-line">Blog</Link>
            </nav>
            <p className="label mt-12 flex flex-wrap gap-x-4 text-ash-300">
              <time dateTime={post.date} className="text-accent">{formatDate(post.date)}</time>
              <span>{readMinutes(post)} min read</span>
            </p>
            <h1 className="display mt-6 max-w-5xl text-[clamp(1.9rem,1rem+3vw,4rem)] text-bone-50">{post.title}</h1>
            <p className="lead mt-8 max-w-3xl text-ash-300">{post.description}</p>
          </header>
          <div className="surface-bone py-16 md:py-24">
            <div className="shell">
              <div className="max-w-[44rem] space-y-6 text-[1.0625rem] leading-[1.75] text-ink-900">
                {post.body.map((block, i) => (
                  <BlockView key={i} block={block} />
                ))}
              </div>
            </div>
          </div>
        </article>
        <NextStep next={next === post ? undefined : { href: `/blog/${next.slug}`, title: next.title }} />
      </main>
      <Footer />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          dateModified: post.date,
          inLanguage: "en",
          mainEntityOfPage: url,
          url,
          image: `${SITE_URL}/opengraph-image`,
          author: { "@type": "Organization", name: siteConfig.name, url: SITE_URL },
          publisher: { "@type": "Organization", name: siteConfig.name, url: SITE_URL, logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.png` } },
        }}
      />
      <JsonLd data={breadcrumbs([{ name: "Studio", path: "/" }, { name: "Blog", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }])} />
    </div>
  );
}
