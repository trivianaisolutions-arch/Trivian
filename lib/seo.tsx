import type { Metadata } from "next";
import { SITE_URL, siteConfig } from "./config";

export { SITE_URL };

const SHARE_IMAGE = [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${siteConfig.name} — We build digital systems that think.` }];

/**
 * A page's search + share metadata in one place. A page that sets `openGraph` replaces the layout's
 * whole object (Next merges metadata shallowly), so the share image, URL and title are always set here.
 */
export function pageMeta(title: string, description: string, path: string): Metadata {
  const full = `${title} — ${siteConfig.name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: full, description, url: path, siteName: siteConfig.name, locale: "en_US", type: "website", images: SHARE_IMAGE },
    twitter: { card: "summary_large_image", title: full, description, images: SHARE_IMAGE },
  };
}

/** Structured data, escaped against `</script>` injection (per the Next.js JSON-LD guide). */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
