import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Navbar";
import { countRecent, readLeads } from "@/lib/leads";
import { isOwner } from "@/lib/owner-auth";
import { logout } from "./actions";
import { LeadsBoard } from "./LeadsBoard";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Leads",
  robots: { index: false, follow: false, nocache: true },
};

// Private: renders the login screen unless the request carries a valid owner session.
export default async function LeadsOwnerPage() {
  const owner = await isOwner();
  const leads = owner ? await readLeads() : [];
  const recent = countRecent(leads);

  return (
    <div className="surface-ink min-h-screen">
      <header className="border-b border-bone-100/10">
        <div className="shell flex h-16 items-center justify-between">
          <Link href="/" aria-label="trivian.ai home">
            <Logo />
          </Link>
          {owner && (
            <form action={logout}>
              <button type="submit" className="label link-line text-ash-300 hover:text-bone-50">
                Log out
              </button>
            </form>
          )}
        </div>
      </header>
      <main id="main" className="shell py-12 md:py-16">
        {owner ? <LeadsBoard leads={leads} recent={recent} /> : <LoginForm />}
      </main>
    </div>
  );
}
