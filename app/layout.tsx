import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { siteConfig } from "@/lib/config";
import { JsonLd, SITE_URL } from "@/lib/seo";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Cursor } from "@/components/Cursor";
import "./globals.css";

// Variable width axis drives the condensing/expanding display type.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const title = "trivian.ai — AI Engineering & Digital Systems Studio";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: "%s — trivian.ai" },
  description: siteConfig.supportingTagline,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description: siteConfig.positioningStatement,
    url: SITE_URL,
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: siteConfig.positioningStatement,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0d0e10",
  colorScheme: "dark",
};

const organization = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: siteConfig.name,
      url: SITE_URL,
      email: siteConfig.contactEmail,
      description: siteConfig.positioningStatement,
      knowsAbout: [
        "AI automation",
        "AI agents",
        "AI calling agents",
        "Website development",
        "Web applications",
        "3D web experiences",
        "WebGL",
        "Technical SEO",
        "Structured data",
        "SaaS development",
        "API integration",
        "CRM automation",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: siteConfig.name,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full">
        <a
          href="#main"
          className="label sr-only z-[200] bg-signal px-4 py-3 text-ink-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <JsonLd data={organization} />
        {children}
        <SmoothScroll />
        <Cursor />
      </body>
    </html>
  );
}
