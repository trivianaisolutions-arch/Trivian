import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // One official address: once SITE_LIVE_URL is set on the production deployment, every other
  // host (the …vercel.app address, www.) forwards there. Preview deployments are left alone.
  async redirects() {
    const live = process.env.SITE_LIVE_URL?.replace(/\/$/, "");
    if (process.env.VERCEL_ENV !== "production" || !live) return [];
    const host = new URL(live).host.replace(/\./g, "\\.");
    return [{ source: "/:path*", missing: [{ type: "host", value: host }], destination: `${live}/:path*`, permanent: true }];
  },
};

export default nextConfig;
