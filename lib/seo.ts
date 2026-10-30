// Metadata and structured data shared by every route: the site URL, the share image, the author,
// and the JSON-LD the pages render on the server.
import type { Metadata } from "next";
import { GH } from "./parse";
import type { Facts } from "./data";

export const SITE = "https://cleanyour.tv";
export const NAME = "CleanYourTV";
export const X_URL = "https://x.com/gathint";
export const PH_URL = "https://www.producthunt.com/products/cleanyourtv";
const OG = { url: "/docs/og.png", width: 1200, height: 630, alt: "Clean Your TV. Your TV, minus the ads." };

type Image = { url: string; width: number; height: number; alt: string };

/** Title, description, canonical, Open Graph and Twitter for one route, with the site's share image unless the page brings its own. */
export function pageMeta(path: string, title: string, description: string, opts: { image?: Image; article?: { publishedTime: string } } = {}): Metadata {
  const url = SITE + path;
  const image = opts.image || OG;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: NAME,
      locale: "en_US",
      images: [image],
      ...(opts.article ? { type: "article", publishedTime: opts.article.publishedTime, authors: [X_URL] } : { type: "website" }),
    },
    twitter: { card: "summary_large_image", creator: "@gathint", title, description, images: [image.url] },
  };
}

export const PERSON = { "@type": "Person", "@id": `${SITE}/#gathin`, name: "Gathin", url: X_URL, sameAs: [X_URL, "https://github.com/Gathin23"] };

/** Home, then each [name, path] down to the page itself. */
export function breadcrumbs(...trail: [string, string][]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [["Home", "/"], ...trail].map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: SITE + path })),
  };
}

/** The home page: the site, the app itself and its author. Counts are the live ones. */
export function homeGraph(f: Facts, description: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${SITE}/#website`, url: `${SITE}/`, name: NAME, description, inLanguage: "en", publisher: { "@id": PERSON["@id"] } },
      {
        "@type": ["SoftwareApplication", "SoftwareSourceCode"],
        "@id": `${SITE}/#app`,
        name: NAME,
        url: `${SITE}/`,
        description: `${description} Tested lists for ${f.tvs} TV models from ${f.brandCount} brands; the launcher speaks ${f.languages} languages.`,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Android TV, Google TV",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        isAccessibleForFree: true,
        license: "https://opensource.org/licenses/MIT",
        codeRepository: GH,
        image: SITE + OG.url,
        sameAs: [GH, PH_URL, X_URL],
        author: { "@id": PERSON["@id"] },
      },
      PERSON,
    ],
  };
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** The press list's "19 Oct" as "2026-10-19" (every article is from the launch year), or "" when there is no date. */
export function isoDay(d: string): string {
  const m = d.match(/^(\d{1,2}) ([A-Z][a-z]{2})$/);
  const mo = m ? MONTHS.indexOf(m[2]) : -1;
  return mo < 0 ? "" : `2026-${String(mo + 1).padStart(2, "0")}-${m![1].padStart(2, "0")}`;
}
