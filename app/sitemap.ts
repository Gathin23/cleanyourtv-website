import type { MetadataRoute } from "next";
import { loadFacts } from "@/lib/data";
import { COVERAGE } from "@/lib/press";
import { SITE, isoDay } from "@/lib/seo";

// The home page, /tvs, /addons, /faq and /bot change whenever the repo does, so their date is the repo's last commit; /press is as new as its newest article;
// /privacy by the day its menu paths were last checked; the Android app's pages by its privacy policy's effective date.
export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { updated } = await loadFacts();
  const press = COVERAGE.flatMap((g) => g.items.map((it) => isoDay(it[2]))).filter(Boolean).sort().pop() || updated;
  return [
    { url: `${SITE}/`, lastModified: updated, changeFrequency: "daily", priority: 1 },
    { url: `${SITE}/addons`, lastModified: updated, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE}/tvs`, lastModified: updated, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/faq`, lastModified: updated, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE}/bot`, lastModified: updated, changeFrequency: "daily", priority: 0.6 },
    { url: `${SITE}/privacy`, lastModified: "2026-10-26", changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/press`, lastModified: press, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE}/blog/reintroducing-cleanyourtv`, lastModified: "2026-10-20", changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE}/app/android`, lastModified: "2026-10-23", changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE}/app/android/privacy`, lastModified: "2026-10-23", changeFrequency: "monthly", priority: 0.5 },
  ];
}
