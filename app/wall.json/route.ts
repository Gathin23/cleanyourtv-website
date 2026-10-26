import fs from "node:fs/promises";
import path from "node:path";
import type { ResultItem } from "@/lib/parse";

// The On air wall's photos (content/results.json without the quotes), fetched by the home page only when someone opens the wall.
export const dynamic = "force-static";

export async function GET() {
  const results = JSON.parse(await fs.readFile(path.join(process.cwd(), "content", "results.json"), "utf8")) as ResultItem[];
  return Response.json(results.map(({ handle, image, link, tv }) => ({ handle, image, link, tv })));
}
