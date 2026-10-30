import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import TutorialGrid, { TutorialCard } from "@/components/TutorialGrid";
import { GH } from "@/lib/parse";
import { SITE, breadcrumbs, pageMeta } from "@/lib/seo";
import { cdn } from "@/lib/site";
import { FEATURED, LANGS, TUTORIAL_VIDEOS } from "@/lib/tutorials";
import { VIDEOS_AS_OF, videoDate, videoEmbed, videoUrl } from "@/lib/videos";
import "./tutorials.css";

// Every community video about CleanYourTV, walk-throughs first (lib/tutorials.ts says which is which, and the language).
// Nothing from YouTube or Bilibili loads until a visitor presses play: the player (youtube-nocookie, or Bilibili's) is swapped in on click.

const tutorials = TUTORIAL_VIDEOS.filter((v) => v.kind === "tutorial");
const languages = new Set(tutorials.map((v) => v.lang)).size;

const title = "Community tutorials";
const description = `${tutorials.length} video walk-throughs of CleanYourTV in ${languages} languages, made by people who cleaned their own Android TV or Google TV, plus ${TUTORIAL_VIDEOS.length - tutorials.length} more videos about it.`;

export const metadata = pageMeta("/tutorials", `${title} · CleanYourTV`, description);

/** 754 -> PT12M34S */
const isoDuration = (s: number) => `PT${Math.floor(s / 60)}M${s % 60}S`;

export default function Tutorials() {
  const featured = FEATURED.map((id) => TUTORIAL_VIDEOS.find((v) => v.id === id)).filter((v) => v !== undefined);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE}/tutorials`,
        url: `${SITE}/tutorials`,
        name: title,
        description,
        isPartOf: { "@id": `${SITE}/#website` },
        about: { "@id": `${SITE}/#app` },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: tutorials.length,
          itemListElement: tutorials.map((v, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "VideoObject",
              name: v.title,
              description: `${v.title}, by ${v.channel} (${LANGS[v.lang] || v.lang}).`,
              thumbnailUrl: cdn(`/press/videos/${v.id}.jpg`),
              uploadDate: v.date,
              ...(v.duration > 0 ? { duration: isoDuration(v.duration) } : {}),
              contentUrl: videoUrl(v),
              embedUrl: videoEmbed(v),
              inLanguage: v.lang,
              author: { "@type": "Person", name: v.channel },
            },
          })),
        },
      },
      breadcrumbs(["Community tutorials", "/tutorials"]),
    ],
  };

  return (
    <main className="tut">
      <JsonLd data={jsonLd} />

      <section aria-labelledby="page-h" className="wrap page-head">
        <p className="kicker c-blue">CH 11 · Tutorials</p>
        <h1 id="page-h" className="h1">{title}</h1>
        <p className="lede">
          Made by people who cleaned their own TVs. Pick your language, press play. {tutorials.length} walk-throughs in {languages} languages.
        </p>
        <p className="tut-note dim">
          Nothing from YouTube or Bilibili loads until you press play. Prefer to read? The <Link href="/#setup">three steps</Link> are on the home page.
        </p>
      </section>

      <section aria-labelledby="feat-h" className="wrap tut-sec">
        <h2 id="feat-h" className="kicker c-mute">Start here</h2>
        <ul className="plain tut-feat">
          {featured.map((v) => (
            <li key={v.id}>
              <TutorialCard v={v} big />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="all-h" className="wrap tut-sec">
        <div className="spread">
          <h2 id="all-h" className="h2 h2-sm">Every video</h2>
          <span className="ch tut-asof">Views as of {videoDate(VIDEOS_AS_OF)}</span>
        </div>
        <TutorialGrid videos={TUTORIAL_VIDEOS} />
        <p className="tut-foot">
          Made a video about CleanYourTV? <a href={`${GH}/issues/new?title=${encodeURIComponent("Video: ")}`}>Add it here</a> with the YouTube or Bilibili link, and it joins this page and{" "}
          <Link href="/press">the press page</Link>.
        </p>
      </section>
    </main>
  );
}
