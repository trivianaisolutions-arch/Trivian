import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <div id="top" className="surface-ink min-h-screen">
      <Navbar />
      <main id="main" tabIndex={-1} className="shell flex min-h-svh flex-col justify-center py-36">
        <p className="label text-accent">Error 404</p>
        <h1 className="display mt-6 text-[length:var(--step-xl)]">
          No route
          <br />
          <span className="text-ash-400">in this system.</span>
        </h1>
        <p className="lead mt-8 max-w-md text-ash-300">The page you asked for doesn&apos;t exist, or it has moved.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-signal">
            Back to the studio <span aria-hidden="true" className="btn-arrow">→</span>
          </Link>
          <Link href="/case-studies" className="btn btn-line">
            Selected work
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
