import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { COVERAGE, COVERAGE_COUNTRIES, COVERAGE_TOTAL } from "@/lib/press";
import { VIDEOS, VIDEOS_AS_OF, videoDate } from "@/lib/videos";
import VideoGrid from "@/components/VideoGrid";
import PressGrid, { type PressRow } from "@/components/PressGrid";
import JsonLd from "@/components/JsonLd";
import { loadTweet } from "@/lib/data";
import { GH } from "@/lib/parse";
import { SITE, breadcrumbs, isoDay, pageMeta } from "@/lib/seo";
import { cdn } from "@/lib/site";
import "./press.css";

const title = "CleanYourTV in the press";
const description = `${COVERAGE_TOTAL} articles and ${VIDEOS.length} videos about CleanYourTV, from outlets in ${COVERAGE_COUNTRIES} countries: TechCrunch and Mashable to GIGAZINE and Xataka.`;

export const metadata = pageMeta("/press", title, description);

// "Featured in": the twelve biggest outlets that wrote about it, by reach, each as its wordmark (public/press/logos-wordmark/, CREDITS.md there)
// at a height that gives every logo about the same area, linking to its article here. Phones show the first six.
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

// ISO 8601 length for VideoObject: 754 -> PT12M34S
const isoLength = (s: number) => `PT${s >= 3600 ? `${Math.floor(s / 3600)}H` : ""}${Math.floor((s % 3600) / 60)}M${s % 60}S`;
// 35543 -> 35.5K
const compact = (n: number) => (n >= 1e6 ? `${(n / 1e6).toFixed(1).replace(/\.0$/, "")}M` : n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K` : String(n));

export default async function Press() {
  const tweet = await loadTweet();
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
  const stats = [
    { label: "Articles", value: String(COVERAGE_TOTAL), bar: "#FF8A8A" },
    { label: "Countries", value: String(COVERAGE_COUNTRIES), bar: "#FFDC96" },
    { label: "YouTube videos", value: String(VIDEOS.length), bar: "#6FA8FF" },
    { label: "Likes on the first post", value: compact(tweet.likes), bar: "#8EE08F" },
  ];

  // The page as a collection of the articles, in the order the list shows them, and of the videos.
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
      {
        "@type": "ItemList",
        "@id": `${SITE}/press#videos`,
        name: "Videos about CleanYourTV",
        numberOfItems: VIDEOS.length,
        itemListElement: VIDEOS.map((v, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "VideoObject",
            name: v.title,
            description: `${v.title}, by ${v.channel} on YouTube`,
            url: `https://www.youtube.com/watch?v=${v.id}`,
            embedUrl: `https://www.youtube.com/embed/${v.id}`,
            thumbnailUrl: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
            uploadDate: v.date,
            ...(v.duration > 0 ? { duration: isoLength(v.duration) } : {}),
            author: { "@type": "Person", name: v.channel },
            interactionStatistic: { "@type": "InteractionCounter", interactionType: { "@type": "WatchAction" }, userInteractionCount: v.views },
          },
        })),
      },
      breadcrumbs(["Press", "/press"]),
    ],
  };
  return (
    <main className="press">
      <JsonLd data={jsonLd} />
      <section aria-labelledby="page-h" className="wrap press-hero">
        <div className="stack press-hero-text">
          <p className="kicker c-pink">CH 05 · Press</p>
          <h1 id="page-h" className="h1 press-h1">In the press</h1>
          <p className="lede press-lede">Articles and videos about CleanYourTV from its first days. Headlines are as published, in the language they were written in.</p>
        </div>
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

      <section aria-label="Coverage in numbers" className="band">
        <dl className="wrap press-nums">
          {stats.map((s) => (
            <div key={s.label} style={{ "--bar": s.bar } as React.CSSProperties}>
              <dt>{s.label}</dt>
              <dd className="num">{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="logos-h" className="wrap press-logos">
        <h2 id="logos-h" className="kicker c-mute">Featured in</h2>
        <ul className="plain">
          {featured.map((it) => (
            <li key={it.url}>
              <a href={it.url} target="_blank" rel="noopener" aria-label={`${it.name} (opens in a new tab)`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cdn(`/press/logos-wordmark/${it.logo}.svg`)} alt="" style={{ height: it.height }} className={it.logo === "bild" ? "press-logo-box" : undefined} loading="lazy" decoding="async" />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="vid-h" className="wrap press-sec">
        <div className="spread">
          <div className="stack">
            <p className="kicker c-blue">On YouTube · most watched first</p>
            <h2 id="vid-h" className="h2 h2-sm">Videos</h2>
          </div>
          <span className="ch press-asof">Views as of {videoDate(VIDEOS_AS_OF)}</span>
        </div>
        <VideoGrid videos={VIDEOS.slice(0, 8)} shown={8} />
        <Link href="/tutorials" className="btn btn-ghost btn-sm press-more">
          See all {VIDEOS.length} community videos and tutorials →
        </Link>
      </section>

      <section aria-labelledby="art-h" className="wrap press-sec press-arts">
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
    </main>
  );
}
