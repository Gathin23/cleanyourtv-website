import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { COVERAGE, COVERAGE_COUNTRIES, COVERAGE_TOTAL } from "@/lib/press";
import { COUNTRY_ISO } from "@/lib/flags";
import { VIDEOS } from "@/lib/videos";
import PressGrid, { type PressRow } from "@/components/PressGrid";
import JsonLd from "@/components/JsonLd";
import { GH } from "@/lib/parse";
import { SITE, breadcrumbs, isoDay, pageMeta } from "@/lib/seo";
import { cdn } from "@/lib/site";
import "./press.css";

const title = "CleanYourTV in the press";
const description = `${COVERAGE_TOTAL} articles and ${VIDEOS.length} videos about CleanYourTV, from outlets in ${COVERAGE_COUNTRIES} countries: TechCrunch and Mashable to GIGAZINE and Xataka.`;

export const metadata = pageMeta("/press", title, description);

// "Featured in": the twelve biggest outlets that wrote about it, by reach, each as its wordmark on a dark tile, in its own colour
// where that reads on dark (public/press/logos-colour-dark/, CREDITS.md in logos-wordmark/), at a height that gives every logo
// about the same area, linking to its article here. Phones show the first six. LOGOS = "light" swaps to light tiles in full colour.
const LOGOS: "light" | "dark" = "dark";
const FEATURED: [outlet: string, logo: string, height: number][] = [
  ["TechCrunch", "techcrunch", 40],
  ["The Verge", "theverge", 27],
  ["Yahoo Tech", "yahoo", 29],
  ["Gizmodo", "gizmodo", 25],
  ["Mashable", "mashable", 22],
  ["TechRadar", "techradar", 23],
  ["Tom's Guide", "tomsguide", 24],
  ["PCWorld", "pcworld", 26],
  ["Android Authority", "androidauthority", 20],
  ["XDA", "xda", 30],
  ["Bild", "bild", 34],
  ["404 Media", "404media", 32],
];

// For a journalist: the pictures and the story. There is no press-kit archive, so these are the repo's own files.
const KIT: [string, string, string][] = [
  ["Screenshots and logos", `${GH}/tree/main/docs`, "GitHub"],
  ["Before and after photo", `${GH}/blob/main/docs/stock-vs-new.jpg`, "JPG"],
  ["The story, from the first post", "/blog/reintroducing-cleanyourtv", "READ"],
];
const CONTACT = "hello@itsgathin.com";


export default async function Press() {
  // Groups biggest first, so the chips are the three biggest and the select holds the rest.
  const groups = COVERAGE.map((g) => ({ label: g.group, count: g.items.length })).sort((a, b) => b.count - a.count);
  const at = new Map(groups.map((g, i) => [g.label, i]));
  // Every article, newest first; undated ones last, in the list's order.
  const items = COVERAGE.flatMap((g) => g.items.map(([outlet, headline, date, url, thumb, icon]) => ({ outlet, headline, date, url, thumb, icon, group: g.group })))
    .map((it, i) => ({ it, d: isoDay(it.date), i }))
    .sort((a, b) => (b.d || "0").localeCompare(a.d || "0") || a.i - b.i)
    .map(({ it }) => it);
  // A card's cover: a picture tools/press-covers.py fetched or screenshot, else the og:image saved with the article, else none (the card shows the outlet's icon).
  const covers = JSON.parse(fs.readFileSync(path.join(process.cwd(), "content", "press-covers.json"), "utf8")) as Record<string, string>;
  const cover = (thumb: string) =>
    covers[thumb] ? `/press/covers/${covers[thumb]}` : fs.existsSync(path.join(process.cwd(), "public", "press", "thumbs", `${thumb}.jpg`)) ? `/press/thumbs/${thumb}.jpg` : "";
  const rows: PressRow[] = items.map((it) => [it.outlet, it.headline, it.date, it.url, at.get(it.group) ?? 0, cover(it.thumb), `/press/icons/${it.icon}.png`]);
  const featured = FEATURED.flatMap(([name, logo, height]) => {
    const it = items.find((i) => i.outlet === name || i.outlet.startsWith(name + " ("));
    return it ? [{ ...it, name, logo, height }] : [];
  });
  // Behind the numbers, every outlet that wrote about it, as a slow credits wall: one name each, the big ones a little brighter,
  // dealt round-robin into rows (each row's names twice, so the CSS drift loops).
  const big = new Set(FEATURED.map(([name]) => name));
  const outlets = [...new Set(items.map((i) => i.outlet.replace(/ \(.*\)$/, "")))];
  const WALL_ROWS = 16;
  const wall = Array.from({ length: WALL_ROWS }, (_, r) => outlets.filter((_, i) => i % WALL_ROWS === r));
  // Under the big article count: the countries, each as its round flag (lib/flags.ts), most articles first.
  const flags = COVERAGE.filter((g) => g.country)
    .map((g) => ({ name: g.group, iso: COUNTRY_ISO[g.group], count: g.items.length }))
    .sort((x, y) => y.count - x.count || x.name.localeCompare(y.name));

  // The page as a collection of the articles, in the order the list shows them (the videos' VideoObjects live on /tutorials).
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE}/press`,
        url: `${SITE}/press`,
        name: title,
        description,
        isPartOf: { "@id": `${SITE}/#website` },
        about: { "@id": `${SITE}/#app` },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: items.length,
          itemListElement: items.map((it, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Article",
              headline: it.headline,
              url: it.url,
              publisher: { "@type": "Organization", name: it.outlet.replace(/ \(.*\)$/, "") },
              ...(isoDay(it.date) ? { datePublished: isoDay(it.date) } : {}),
            },
          })),
        },
      },
      breadcrumbs(["Press", "/press"]),
    ],
  };
  return (
    <main className="press">
      <JsonLd data={jsonLd} />
      {/* The top: the title and a way in on the left, the numbers on a TV screen on the right, the outlets straight under both. */}
      <section aria-labelledby="page-h" className="wrap phx">
        <div className="phx-text">
          <p className="kicker c-pink">CH 05 · Press</p>
          <h1 id="page-h" className="h1 phx-h1">In the press</h1>
          <p className="lede phx-lede">
            {COVERAGE_TOTAL} articles from {COVERAGE_COUNTRIES} countries, each headline as published, in its own language.
          </p>
          <ul className="plain phx-links">
            <li><a href="#articles">Read the articles ↓</a></li>
            <li><Link href="/tutorials">Watch tutorials →</Link></li>
            <li><a href="#press-kit">Press kit ↓</a></li>
          </ul>
        </div>
        <div className="phx-tv" role="group" aria-label="Coverage in numbers">
          <div className="stripe phx-stripe" aria-hidden="true" />
          <div className="phx-wall" aria-hidden="true">
            {wall.map((row, r) => (
              <div key={r} className="phx-wall-row">
                <div className="phx-wall-track">
                  {[0, 1].map((copy) =>
                    row.map((name) => (
                      <span key={`${copy}-${name}`} className={big.has(name) ? "phx-wall-big" : undefined}>
                        {name}
                      </span>
                    )),
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="phx-screen">
            <p className="phx-big">
              <span className="phx-num">{COVERAGE_TOTAL}</span>
              <span className="ch phx-unit">articles</span>
            </p>
            <div className="phx-row">
              <p className="phx-stat">
                <span className="phx-stat-n">{COVERAGE_COUNTRIES}</span>
                <span className="ch phx-stat-l">countries</span>
              </p>
              <ul className="plain phx-flags" aria-label={`The ${COVERAGE_COUNTRIES} countries`}>
                {flags.map((f) => (
                  <li key={f.iso}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cdn(`/press/flags/${f.iso}.svg`)} alt={f.name} title={`${f.name} · ${f.count} ${f.count === 1 ? "article" : "articles"}`} width={26} height={26} loading="lazy" decoding="async" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="logos-h" className="wrap press-logos phx-logos">
        <h2 id="logos-h" className="kicker c-mute">Featured in</h2>
        <ul className={`plain press-logos-${LOGOS}`}>
          {featured.map((it) => (
            <li key={it.url}>
              <a href={it.url} target="_blank" rel="noopener" aria-label={`${it.name} (opens in a new tab)`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cdn(`/press/${LOGOS === "light" ? "logos-colour" : "logos-colour-dark"}/${it.logo}.svg`)} alt="" style={{ height: it.height }} loading="lazy" decoding="async" />
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Every video lives on /tutorials now; one line here points there. */}
      <p className="wrap press-vids">
        <Link href="/tutorials">
          Videos and tutorials: see all {VIDEOS.length} on /tutorials <span aria-hidden="true">→</span>
        </Link>
      </p>

      <section id="articles" aria-labelledby="art-h" className="wrap press-sec press-arts">
        <div className="stack">
          <p className="kicker c-amber">Newest first</p>
          <h2 id="art-h" className="h2 h2-sm">Articles</h2>
        </div>
        <PressGrid items={rows} groups={groups} />
        <p className="press-foot">
          Wrote about CleanYourTV and not on this list? <a href={`${GH}/issues/new`}>Open an issue</a> with the link. The same list is{" "}
          <a href={`${GH}/blob/main/docs/PRESS.md`}>docs/PRESS.md</a> in the repo. New here? Start with <Link href="/faq">the questions people ask</Link>, or see{" "}
          <Link href="/bot">the bot that reviews every pull request</Link>.
        </p>
      </section>

      {/* For anyone writing about it: the pictures, the story and who to ask, after the coverage itself. */}
      <section id="press-kit" className="wrap press-kit-sec">
        <aside aria-labelledby="kit-h" className="kit">
          <h2 id="kit-h">Writing about it?</h2>
          <ul className="plain">
            {KIT.map(([label, href, tag]) => (
              <li key={label}>
                {href.startsWith("/") ? (
                  <Link href={href}>{label}<span className="ch">{tag}</span></Link>
                ) : (
                  <a href={href}>{label}<span className="ch">{tag}</span></a>
                )}
              </li>
            ))}
          </ul>
          <p>
            Questions: <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
          </p>
        </aside>
      </section>
    </main>
  );
}
