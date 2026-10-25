import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

// Everyone may crawl everything. The AI crawlers are named so a blanket rule elsewhere never shuts them out by accident.
const AI = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "CCBot"];

// Written to out/ as a static file by the export.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }, { userAgent: AI, allow: "/" }],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
