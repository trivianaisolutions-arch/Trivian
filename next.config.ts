import type { NextConfig } from "next";
import { SITE_URL } from "./lib/config";

const nextConfig: NextConfig = {
  // One official address. On production, once SITE_LIVE_URL is set (any value: it only says "the
  // domain is live"), every other host — …vercel.app, www., forwarding domains — goes to SITE_URL,
  // the same address every page declares as canonical. Preview deployments are left alone.
  async redirects() {
    if (process.env.VERCEL_ENV !== "production" || !process.env.SITE_LIVE_URL) return [];
    const host = new URL(SITE_URL).host.replace(/\./g, "\\.");
    return [{ source: "/:path*", missing: [{ type: "host", value: host }], destination: `${SITE_URL}/:path*`, permanent: true }];
  },
};

export default nextConfig;
