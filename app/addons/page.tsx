import Link from "next/link";
import { GH } from "@/lib/parse";
import { loadAddonsData } from "@/lib/data";
import AddonsTabs from "@/components/AddonsTabs";
import JsonLd from "@/components/JsonLd";
import { SITE, breadcrumbs, pageMeta } from "@/lib/seo";
import "./addons.css";

// Themes, keys and add-ons are read from the cleanyourtv repo, re-fetched on every hourly build,
// so a merged theme or add-on shows up here with no site change.

const title = "Add-ons, themes and settings · CleanYourTV";
const description = "Everything optional around the small CleanYourTV launcher: themes you push without a rebuild, small settings for the home screen, and add-on apps that plug in as a card.";

export const metadata = pageMeta("/addons", title, description);

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
    <main>
      <JsonLd data={jsonLd} />
      <AddonsTabs data={data}>
        <p className="kicker c-blue">CH 06 · Add-ons</p>
        <h1 id="page-h" className="h1 ao-title">Add-ons, themes and settings</h1>
        <p className="lede">Pick one, copy its line, and give it to your coding agent. Nothing changes until you do.</p>
      </AddonsTabs>

      <section aria-label="More" className="band ao-more-band">
        <div className="wrap ao-more">
          <a href={`${GH}/blob/main/SHOWCASE.md`} className="ao-more-card ao-more-blue">
            <span className="ao-more-t">What people built</span>
            <span>Whole launchers and forks, in SHOWCASE.md</span>
          </a>
          <Link href="/bot" className="ao-more-card">
            <span className="ao-more-t">Sending one?</span>
            <span className="dim">The review bot reads it first</span>
          </Link>
          <Link href="/faq" className="ao-more-card">
            <span className="ao-more-t">Questions?</span>
            <span className="dim">See the FAQ</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
