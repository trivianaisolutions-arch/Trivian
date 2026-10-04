"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { caseStudies } from "@/lib/case-studies";

const CATEGORIES = ["All", "Web Application", "Media Platform", "E-Commerce"];

export function CaseStudyIndex() {
  const [filter, setFilter] = useState("All");
  const studies = filter === "All" ? caseStudies : caseStudies.filter((s) => s.category.includes(filter));

  return (
    <>
      <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            aria-pressed={filter === cat}
            onClick={() => setFilter(cat)}
            className={`label border px-3.5 py-2 transition-colors ${
              filter === cat ? "border-bone-100 bg-bone-100 text-ink-950" : "border-bone-100/20 text-ash-300 hover:border-bone-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <ol className="mt-14 border-t border-bone-100/10" aria-live="polite">
        {studies.map((study) => (
          <li key={study.slug} className="group border-b border-bone-100/10">
            <Link href={`/case-studies/${study.slug}`} data-cursor="view" className="grid gap-6 py-10 md:grid-cols-12 md:items-baseline">
              <span className="label text-accent md:col-span-1">0{caseStudies.indexOf(study) + 1}</span>
              <span className="md:col-span-6">
                <span className="display block text-[clamp(2rem,1rem+3.6vw,4.5rem)] transition-colors group-hover:text-signal">
                  {study.title}
                </span>
                <span className="mt-3 block max-w-xl text-[0.9375rem] leading-relaxed text-ash-300">{study.shortDescription}</span>
                <span className="label mt-5 block text-ash-400">
                  {study.category}
                  <span className="mt-2 block font-mono normal-case tracking-normal text-ash-300">{study.technologies.slice(0, 4).join(" · ")}</span>
                </span>
              </span>
              <span className="block overflow-hidden border border-bone-100/10 md:col-span-5 md:self-center">
                <Image
                  src={study.image}
                  alt={study.imageAlt}
                  placeholder="blur"
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="w-full transition-transform duration-700 ease-expo group-hover:scale-[1.03]"
                />
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </>
  );
}
