import Link from "next/link";
import type { CSSProperties } from "react";
import { GH } from "@/lib/parse";
import { loadAddonsData } from "@/lib/data";
import AddonsTabs from "@/components/AddonsTabs";
import JsonLd from "@/components/JsonLd";
import { SITE, breadcrumbs, pageMeta } from "@/lib/seo";

// Themes, keys and add-ons are read from the cleanyourtv repo, re-fetched on every hourly build,
// so a merged theme or add-on shows up here with no site change.

const title = "Add-ons, themes and settings · CleanYourTV";
const description = "Everything optional around the small CleanYourTV launcher: themes you push without a rebuild, small settings for the home screen, and add-on apps that plug in as a card.";

export const metadata = pageMeta("/addons", title, description);

// body is overflow:hidden for the TV, so the page scrolls inside main, as /press and the blog do.
const page: CSSProperties = {
  height: "100dvh",
  overflowY: "auto",
  background: "#050505",
  color: "#e9e9e9",
  fontFamily: "var(--font-outfit), Outfit, sans-serif",
  fontWeight: 300,
  WebkitFontSmoothing: "antialiased",
};
const wrap: CSSProperties = { maxWidth: 1160, margin: "0 auto", padding: "40px 16px 120px", fontSize: 17, lineHeight: 1.5 };
const kicker: CSSProperties = { margin: "0 0 20px", fontSize: 15, letterSpacing: 2, textTransform: "uppercase", color: "#9a9a9a" };
const green = { color: "#cfffcf", borderBottomColor: "rgba(207,255,207,.35)" };

export default async function Addons() {
  const data = await loadAddonsData();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": `${SITE}/addons`, url: `${SITE}/addons`, name: title, description, isPartOf: { "@id": `${SITE}/#website` }, about: { "@id": `${SITE}/#app` } },
      breadcrumbs(["Add-ons", "/addons"]),
    ],
  };
  return (
    <main className="page-main" style={page}>
      <JsonLd data={jsonLd} />
      <div style={wrap}>
        <p style={kicker}>
          <Link href="/" className="home-link" style={green}>cleanyour.tv</Link> &nbsp;·&nbsp; Add-ons
        </p>
        <h1 className="ao-title">Add-ons, themes and settings</h1>
        <p className="ao-lede">Pick one, copy its line, and give it to your coding agent. Nothing changes until you do.</p>

        <AddonsTabs data={data} />

        <p className="ao-foot">
          Looking for whole launchers and forks? See <Link href="/#ch-04" style={green}>What people built</Link> and{" "}
          <a href={GH + "/blob/main/SHOWCASE.md"} style={green}>SHOWCASE.md</a>. Questions? See <Link href="/faq" style={green}>the FAQ</Link>. Sending one? <Link href="/bot" style={green}>The review bot</Link> reads it first.
        </p>
      </div>
    </main>
  );
}
