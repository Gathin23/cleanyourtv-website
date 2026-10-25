import type { NextConfig } from "next";

// A fully static export (out/) for Cloudflare Pages. The deploy workflow rebuilds it every hour so the GitHub data stays fresh.
// Response headers and the /app redirect live in public/_headers and public/_redirects, which Pages reads from out/.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
