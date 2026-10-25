import Link from "next/link";
import type { CSSProperties } from "react";
import JsonLd from "@/components/JsonLd";
import TvFinder from "@/components/TvFinder";
import { loadTvs } from "@/lib/data";
import { GH, brandsOf } from "@/lib/parse";
import { SITE, breadcrumbs, pageMeta } from "@/lib/seo";

// Which TVs it works on, and every model with a tested list: examples/README.md, re-read on every hourly build.

const title = "Supported TVs";
const description =
  "Does CleanYourTV work on your TV? Any Android TV or Google TV works. Search the models that already have a tested list, by brand or model number.";

export const metadata = pageMeta("/tvs", `${title} · CleanYourTV`, description);

// body is overflow:hidden for the TV, so the page scrolls inside main, as /faq and /press do.
const page: CSSProperties = {
  height: "100dvh",
  overflowY: "auto",
  background: "#050505",
  color: "#e9e9e9",
  fontFamily: "var(--font-outfit), Outfit, sans-serif",
  fontWeight: 300,
  WebkitFontSmoothing: "antialiased",
};
const wrap: CSSProperties = { maxWidth: 920, margin: "0 auto", padding: "40px 20px 120px", fontSize: 19, lineHeight: 1.6 };
const kicker: CSSProperties = { margin: "0 0 20px", fontSize: 15, letterSpacing: 2, textTransform: "uppercase", color: "#9a9a9a" };
const p: CSSProperties = { margin: "0 0 16px" };
const green = { color: "#cfffcf", borderBottomColor: "rgba(207,255,207,.35)" };

// The README's "Supported TVs" table, said plainly.
const PLATFORMS: { mark: string; name: string; what: string; tone: "yes" | "part" | "no" }[] = [
  { mark: "✓", name: "Android TV, Google TV", what: "Works: the cleanup and the new home screen (Android 8.0 or newer for the home screen).", tone: "yes" },
  { mark: "½", name: "Fire TV", what: "The cleanup only. Fire OS keeps its own home screen.", tone: "part" },
  { mark: "✕", name: "Samsung, LG, Roku", what: "Not supported. They run other systems (Tizen, webOS, Roku OS) with no ADB.", tone: "no" },
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
    <main className="page-main" style={page}>
      <JsonLd data={jsonLd} />
      <article style={wrap}>
        <p style={kicker}>
          <Link href="/" className="home-link" style={green}>cleanyour.tv</Link> &nbsp;·&nbsp; Supported TVs
        </p>
        <h1 style={{ fontSize: 44, lineHeight: 1.1, fontWeight: 400, margin: "0 0 14px", letterSpacing: -0.5 }}>Does it work on my TV?</h1>
        <p style={{ ...p, fontSize: 20, color: "#bdbdbd" }}>
          If your TV runs <strong style={{ fontWeight: 500, color: "#fff" }}>Android TV or Google TV</strong>, yes. Your model does not need to be
          on the list below.
        </p>

        <ul className="tvs-platforms">
          {PLATFORMS.map((x) => (
            <li key={x.name} data-tone={x.tone}>
              <span className="tvs-mark" aria-hidden="true">{x.mark}</span>
              <span>
                <strong>{x.name}</strong>
                <span>{x.what}</span>
              </span>
            </li>
          ))}
        </ul>

        <h2 style={{ fontSize: 28, fontWeight: 400, margin: "44px 0 8px", letterSpacing: -0.2, lineHeight: 1.25 }}>Tested models</h2>
        <p style={{ ...p, color: "#bdbdbd", fontSize: 17 }}>
          {tvs.length} models from {brands.length} brands already have a list, so the assistant starts from what worked on the same set.
          Yours is missing? The assistant builds one for it, and you can <a href={`${GH}/blob/main/CONTRIBUTING.md`} style={green}>add it here</a>.
        </p>

        <TvFinder tvs={tvs} brands={brands} />

        <p style={{ margin: "56px 0 0", color: "#9a9a9a", fontSize: 17 }}>
          Ready? <Link href="/#ch-03" style={green}>Set it up</Link> in three steps. More in the <Link href="/faq" style={green}>FAQ</Link>.
        </p>
      </article>
    </main>
  );
}
