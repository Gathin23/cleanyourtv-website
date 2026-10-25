import { loadFacts } from "@/lib/data";
import { llmsFullText } from "@/lib/llms";

// Written to out/llms-full.txt at build time and re-built every hour with the pages, so the README here follows the repo.
export const dynamic = "force-static";

export async function GET() {
  return new Response(llmsFullText(await loadFacts()), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
