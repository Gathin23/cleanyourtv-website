import { loadFacts } from "@/lib/data";
import { llmsText } from "@/lib/llms";

// Written to out/llms.txt at build time and re-built every hour with the pages, so the counts follow the repo.
export const dynamic = "force-static";

export async function GET() {
  return new Response(llmsText(await loadFacts()), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
