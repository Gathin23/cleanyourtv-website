import type { NextConfig } from "next";

// A fully static export (out/), served as Cloudflare Workers static assets (wrangler.jsonc). The deploy workflow rebuilds it every hour so the GitHub data stays fresh.
// Response headers and the /app redirect live in public/_headers and public/_redirects, which Cloudflare reads from out/.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
