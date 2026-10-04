"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import mark from "@/public/brand/trivian-mark.png";
import { siteConfig } from "@/lib/config";

const navLinks = [
  { label: "Work", href: "/case-studies" },
  { label: "Services", href: "/services" },
  { label: "Process", href: "/process" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <Image src={mark} alt="" width={36} height={36} loading="eager" className="h-9 w-9" />
      <span className="display text-[0.95rem] tracking-[-0.02em]">{siteConfig.name}</span>
    </span>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 text-bone-100 transition-colors duration-300 ${
        scrolled || open ? "bg-ink-950" : "bg-transparent"
      }`}
    >
      <div className="shell flex h-[var(--nav-h)] items-center justify-between">
        <Link href="/" aria-label={`${siteConfig.name} home`} onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="label link-line pb-0.5 text-ash-300 transition-colors hover:text-bone-50">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/contact" className="btn btn-signal hidden min-h-10 px-4 sm:inline-flex">
            Start a project
            <span aria-hidden="true" className="btn-arrow">→</span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="label grid h-10 min-w-10 place-items-center border border-bone-100/25 px-3 lg:hidden"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {/* Reading progress along the bar (scroll-driven CSS, where supported). */}
      <span aria-hidden="true" className={`scroll-progress absolute inset-x-0 bottom-0 hidden h-px bg-signal transition-opacity ${scrolled ? "opacity-100" : "opacity-0"}`} />

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="h-[calc(100svh-var(--nav-h))] overflow-y-auto border-t border-bone-100/10 bg-ink-950 lg:hidden">
          <ul className="shell flex flex-col pt-6">
            {navLinks.map((link, i) => (
              <li key={link.label} className="border-b border-bone-100/10">
                <Link href={link.href} onClick={() => setOpen(false)} className="flex items-baseline justify-between py-5">
                  <span className="display text-[2.4rem]">{link.label}</span>
                  <span className="label text-ash-400">0{i + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="shell py-8">
            <Link href="/contact" onClick={() => setOpen(false)} className="btn btn-signal w-full">
              Start a project <span aria-hidden="true">→</span>
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
