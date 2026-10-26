import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import TvFinder from "@/components/TvFinder";
import { loadTvs } from "@/lib/data";
import { GH, brandsOf } from "@/lib/parse";
import { SITE, breadcrumbs, pageMeta } from "@/lib/seo";
import { PRIVACY_LIVE, PRIVACY_PATH } from "@/lib/site";
import { tvRow } from "@/lib/tvrows";
import "./tvs.css";

// Which TVs it works on, and every model with a tested list: examples/README.md, re-read on every hourly build.

const title = "Supported TVs";
const description =
  "Does CleanYourTV work on your TV? Any Android TV or Google TV works. Search the models that already have a tested list, by brand or model number.";

export const metadata = pageMeta("/tvs", `${title} · CleanYourTV`, description);

// The README's "Supported TVs" table, said plainly. Samsung, LG and Roku owners get the privacy guide, which works without CleanYourTV.
const PLATFORMS = [
  { tone: "yes", mark: "M4 12l5 5L20 6", label: "Works", name: "Android TV, Google TV", what: "The cleanup and the new home screen. The home screen needs Android 8.0 or newer.", cta: "Set it up in three steps", href: "/#setup" },
  { tone: "part", mark: "M5 12h14", label: "Cleanup only", name: "Fire TV", what: "The ads and bloat go, but Fire OS keeps its own home screen.", cta: "Set it up", href: "/#setup" },
  { tone: "no", mark: "M6 6l12 12M18 6L6 18", label: "Not supported", name: "Samsung, LG, Roku", what: `They run other systems (Tizen, webOS, Roku OS) with no ADB.${PRIVACY_LIVE ? " You can still turn off most of the tracking." : ""}`, cta: "Use the privacy guide", href: PRIVACY_PATH },
];

export default async function Tvs() {
  const tvs = await loadTvs();
  const brands = brandsOf(tvs);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": `${SITE}/tvs`, url: `${SITE}/tvs`, name: title, description, isPartOf: { "@id": `${SITE}/#website` }, about: { "@id": `${SITE}/#app` } },
      breadcrumbs(["Supported TVs", "/tvs"]),
    ],
  };
  return (
    <main className="tvs">
      <JsonLd data={jsonLd} />
      <section aria-labelledby="page-h" className="wrap page-head">
        <p className="kicker c-mint">CH 09 · TV list</p>
        <h1 id="page-h" className="h1">Does it work on my TV?</h1>
        <p className="lede tvs-lede">
          If your TV runs <strong>Android TV or Google TV</strong>, yes. Your model does not need to be on the list below.
        </p>
      </section>

      <section aria-label="Answers by platform" className="wrap tvs-answers">
        {PLATFORMS.map((x) => (
          <div key={x.name} className={`tvs-ans tvs-${x.tone}`}>
            <span className="tvs-mark ch">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d={x.mark} />
              </svg>
              {x.label}
            </span>
            <h2>{x.name}</h2>
            <p>{x.what}</p>
            {x.href === PRIVACY_PATH && !PRIVACY_LIVE ? (
              <p className="soon-cta">Privacy guide coming tonight</p>
            ) : (
              <Link href={x.href} className="tvs-cta">{x.cta}</Link>
            )}
          </div>
        ))}
      </section>

      <section aria-labelledby="list-h" className="band">
        <div className="wrap tvs-band">
          <div className="spread">
            <div className="stack tvs-band-head">
              <h2 id="list-h" className="h2 tvs-h2">Tested models</h2>
              <p className="dim tvs-band-text">
                Each one already has a list, tested by someone on their own TV, so your assistant starts from what worked on the same set.
              </p>
            </div>
            <dl className="tvs-counts">
              <div><dt>models</dt><dd className="num">{tvs.length}</dd></div>
              <div><dt>brands</dt><dd className="num">{brands.length}</dd></div>
            </dl>
          </div>
          <TvFinder tvs={tvs.map(tvRow)} brands={brands} />
        </div>
      </section>

      <section aria-labelledby="missing-h" className="wrap tvs-missing-wrap">
        <div className="tvs-missing">
          <div className="stack">
            <h2 id="missing-h" className="tvs-missing-h">Yours is missing?</h2>
            <p className="dim">
              That&apos;s fine. Your assistant builds a list for it as it goes. Add it here afterwards and the next person with your TV starts from yours.
            </p>
          </div>
          <a href={`${GH}/blob/main/CONTRIBUTING.md`} className="btn btn-blue btn-md">Add your TV</a>
        </div>
      </section>
    </main>
  );
}
