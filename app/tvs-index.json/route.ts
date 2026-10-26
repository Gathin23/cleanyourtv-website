import { loadTvs } from "@/lib/data";
import { tvRow } from "@/lib/tvrows";

// Every tested model for the home page's type-ahead, fetched when someone starts typing so the page itself stays small.
// Re-built every hour with the pages, from the same examples/README.md as /tvs.
export const dynamic = "force-static";

export async function GET() {
  return Response.json((await loadTvs()).map(tvRow));
}
