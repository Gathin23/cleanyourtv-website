import Link from "next/link";
import CopyButton from "@/components/CopyButton";
import HomeCheck from "@/components/HomeCheck";
import JsonLd from "@/components/JsonLd";
import OnAirWall from "@/components/OnAirWall";
import { loadFacts, loadSiteData } from "@/lib/data";
import { GH } from "@/lib/parse";
import { COVERAGE_COUNTRIES, COVERAGE_TOTAL } from "@/lib/press";
import { homeGraph, pageMeta } from "@/lib/seo";
import { ON_AIR_SINCE, PRESS, PRESS_LOGO_W, PRIVACY_PATH, TRENDSHIFT, cdn, roundedCount } from "@/lib/site";
import "./home.css";

// Content comes from the cleanyourtv repo and GitHub at build time; the deploy workflow rebuilds the site every hour.

const description =
  "Your TV, minus the ads. Debloat any Android TV or Google TV over Wi-Fi and swap the ad-filled home screen for a clean Apple TV-style launcher. No root, fully reversible.";

export const metadata = pageMeta("/", "CleanYourTV: remove ads and bloat from Android TV and Google TV", description);

const WORDS = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

/** "One week", "Two weeks"… since the repo went public, as of this build. */
function onAir(): string {
  const days = Math.max(1, Math.floor((Date.now() - Date.parse(ON_AIR_SINCE + "T00:00:00Z")) / 86400000));
  if (days < 7) return `${WORDS[days] || days} ${days === 1 ? "day" : "days"}`;
  const weeks = Math.floor(days / 7);
  return `${WORDS[weeks] || weeks} ${weeks === 1 ? "week" : "weeks"}`;
}

const TILES: [string, string, string][] = [
  ["t-green", "Set up my Android TV", "#setup"],
  ["t-amber", "My TV isn't Android", PRIVACY_PATH],
  ["t-blue", "I want to build on it", "/addons"],
  ["t-red", "I'm writing about it", "/press"],
];

const STEPS: [string, string][] = [
  ["On the TV", "Switch on Wi-Fi debugging in Developer options."],
  ["On your computer", "Paste the prompt into your coding assistant. It finds the TV on your Wi-Fi."],
  ["Follow along", "Approve on the TV, pick a theme. One command undoes it all."],
];

export default async function Page() {
  const [data, facts] = await Promise.all([loadSiteData(), loadFacts()]);
  const counts = Object.fromEntries(facts.brands.map(([b, n]) => [b.toLowerCase(), n]));
  const stats: { label: string; value: string; sub?: string; bar: string; phone?: boolean }[] = [
    { label: "GitHub stars", value: roundedCount(data.stars), bar: "#E9E9E9" },
    { label: "Forks", value: roundedCount(data.forks), bar: "#8EE08F" },
    { label: "Contributors", value: roundedCount(data.contributors), bar: "#FFDC96", phone: false },
    { label: "TV models tested", value: String(facts.tvs), sub: `from ${facts.brands.length} brands`, bar: "#6FA8FF" },
    { label: "Press articles", value: String(COVERAGE_TOTAL), sub: `in ${COVERAGE_COUNTRIES} countries`, bar: "#FF8A8A" },
  ];
  const photos = data.results.slice(0, 4);
  return (
    <main className="home">
      <JsonLd data={homeGraph(facts, description)} />

      <section aria-labelledby="hero-h" className="wrap hero">
        <div className="stack hero-top">
          <p className="kicker c-mint">CH 00 · For Android TV and Google TV</p>
          <h1 id="hero-h" className="h1 hero-h">
            Your TV, minus<br /> the ads.
          </h1>
        </div>
        <div className="hero-grid">
          <div className="hero-left">
            <p className="lede hero-lede">
              <span className="hide-phone">Switches off ads and bloatware and puts a small, clean launcher on your TV. </span>No root. Nothing uninstalled. One command
              undoes it.
            </p>
            <HomeCheck counts={counts} total={facts.tvs} />
          </div>
          <figure className="ba">
            <div className="ba-screen" role="img" aria-label="Before and after: a TV home screen with a sponsored banner next to the clean CleanYourTV launcher">
              <div className="ba-before">
                <span className="ba-tag">Before</span>
                <div className="ba-banner"><span>Sponsored</span></div>
                <div className="ba-row">
                  <i style={{ background: "#6B2E2E" }} /><i style={{ background: "#2E466B" }} /><i style={{ background: "#6B5A2E" }} /><i style={{ background: "#2E6B50" }} />
                </div>
                <div className="ba-row">
                  <i style={{ background: "#552E6B" }} /><i style={{ background: "#6B2E50" }} /><i style={{ background: "#2E5A6B" }} /><i style={{ background: "#6B402E" }} />
                </div>
              </div>
              <div className="ba-after">
                <span className="ba-tag ba-tag-after">After</span>
                <div className="ba-clock"><span>21:04</span><span>Good evening</span></div>
                <div className="ba-row ba-dock">
                  <i style={{ background: "#FF6B6B" }} /><i style={{ background: "#6FA8FF" }} /><i style={{ background: "#8EE08F" }} /><i style={{ background: "#D58BE6" }} />
                </div>
              </div>
            </div>
          </figure>
        </div>
      </section>

      <section aria-labelledby="paths-h" className="wrap paths">
        <h2 id="paths-h" className="kicker c-mute">Pick your button</h2>
        <div className="tiles">
          {TILES.map(([tone, label, href], i) => (
            <Link key={label} href={href} className={`tile ${tone}`}>
              <span className="tile-n">{i + 1}</span>
              <span className="tile-t">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="stats-h" className="band">
        <div className="stripe stripe-thin" aria-hidden="true" />
        <div className="wrap numbers">
          <div className="spread">
            <div className="stack">
              <p className="kicker live">Live from GitHub</p>
              <h2 id="stats-h" className="h2 h2-sm">{onAir()} on air, by the numbers.</h2>
            </div>
            <a href={TRENDSHIFT.url} className="trend">
              <span className="trend-n">#{TRENDSHIFT.rank}</span>
              <span className="trend-t">
                <span>Trending repo of the week</span>
                <span className="ch">Trendshift · {TRENDSHIFT.week}</span>
              </span>
            </a>
          </div>
          <dl className="stats">
            {stats.map((s) => (
              <div key={s.label} className={s.phone === false ? "stat hide-phone" : "stat"} style={{ "--bar": s.bar } as React.CSSProperties}>
                <dt>
                  {s.label}
                  {s.sub && <span className="stat-sub">{s.sub}</span>}
                </dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
          <div className="spread numbers-foot">
            <span className="ch">Refreshed every hour from the repo</span>
            <Link href="/press">See all press coverage</Link>
          </div>
        </div>
      </section>

      <section id="setup" aria-labelledby="setup-h" className="wrap sec setup">
        <div className="setup-text">
          <p className="kicker c-green">CH 01 · Set up</p>
          <h2 id="setup-h" className="h2">Three steps. Your coding assistant does the typing.</h2>
          <ol className="plain steps">
            {STEPS.map(([t, d], i) => (
              <li key={t}>
                <span className="steps-n">0{i + 1}</span>
                <div>
                  <strong>{t}</strong>
                  <p>{d}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="btns">
            <Link href="/tvs" className="btn btn-mint">Set up your TV</Link>
            <CopyButton from="prompt-text" label="Copy the prompt" className="btn btn-ghost" />
          </div>
          <p className="setup-note">
            The prompt is <a href={`${GH}/blob/main/PROMPT.md`}>PROMPT.md</a> in the repo. Put your TV model on the line that asks for it.
          </p>
          <pre id="prompt-text" hidden>{data.prompt}</pre>
        </div>
        <div className="term" aria-label="What your coding assistant does, as an example" role="figure">
          <div className="term-bar" aria-hidden="true"><span>Your assistant, live</span><span>REC</span></div>
          <pre>
            <span className="t-dim">$</span> adb connect 192.168.1.42{"\n"}
            <span className="t-mint">›</span> Found a Google TV on your network{"\n"}
            <span className="t-mint">›</span> Switching off ad and bloat packages{"\n"}
            <span className="t-mint">›</span> Setting the clean launcher as home{"\n"}
            <span className="t-ok">✓</span> Done. Nothing was uninstalled.{"\n"}
            <span className="t-dim">  To undo, ask it to restore your TV.</span>
          </pre>
        </div>
      </section>

      <section aria-labelledby="na-h" className="na">
        <div className="wrap na-in">
          <div className="na-text">
            <p className="kicker">CH 02 · Not Android?</p>
            <h2 id="na-h" className="na-h">Samsung, LG or Roku?</h2>
            <p>CleanYourTV can&apos;t run on these. Our privacy guide still turns off most of the tracking, step by step, no root needed.</p>
          </div>
          <Link href={PRIVACY_PATH} className="btn na-btn">Fix my TV&apos;s privacy</Link>
        </div>
      </section>

      <section aria-labelledby="air-h" className="wrap sec air">
        <OnAirWall
          total={data.results.length}
          head={
            <div className="stack">
              <p className="kicker c-pink">CH 03 · On air</p>
              <h2 id="air-h" className="h2">Cleaned TVs, sent in by you.</h2>
            </div>
          }
        >
          <ul className="plain photos">
            {photos.map((x) => (
              <li key={x.link + x.image}>
                <a href={x.link} target="_blank" rel="noopener">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cdn(x.image)} alt={`${x.tv}, posted by ${x.handle}`} loading="lazy" decoding="async" />
                  <span>{x.handle}</span>
                </a>
              </li>
            ))}
          </ul>
        </OnAirWall>
        <ul className="plain logos" aria-label="Featured in">
          {PRESS.slice(0, 6).map(([slug, name, url]) => (
            <li key={slug}>
              <a href={url} target="_blank" rel="noopener">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cdn(`/press/${slug}.png`)} alt={name} width={Math.round(((PRESS_LOGO_W[slug] ?? 88) * 28) / 88)} height={28} loading="lazy" decoding="async" />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="safe-h" className="rule-top">
        <div className="wrap sec safe">
          <div className="stack">
            <p className="kicker c-blue">CH 04 · Is it safe?</p>
            <h2 id="safe-h" className="h2">Yes, and you can undo it.</h2>
          </div>
          <div className="grid-cards">
            <div className="card">
              <h3 className="h3">Nothing uninstalled</h3>
              <p>Apps are switched off, not deleted.</p>
            </div>
            <div className="card">
              <h3 className="h3">One command undoes it</h3>
              <p>Your TV goes back exactly as it was.</p>
            </div>
            <div className="card">
              <h3 className="h3">Open source</h3>
              <p>
                <a href={GH}>Read every line.</a> {roundedCount(data.contributors)} people already have.
              </p>
            </div>
          </div>
          <p className="safe-more">
            More in <Link href="/faq">the questions people ask</Link>, or read <Link href="/blog/reintroducing-cleanyourtv">how it started</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}
