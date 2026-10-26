import type { ReactNode } from "react";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import LoopVideo from "@/components/LoopVideo";
import { SITE, breadcrumbs, pageMeta } from "@/lib/seo";
import { PRIVACY_PATH } from "@/lib/site";
import "./android.css";

// The community-built phone app for Clean Your TV, by udhaykumarbala, given a home under /app with Gathin's agreement.
// Every line here is from the app's own repo (README, store text and site); change it there first.
// The pictures and the demo loop are his too (docs/images/), re-encoded for the web.
const REPO = "https://github.com/udhaykumarbala/cleanyourtv-app";
const DOWNLOAD = `${REPO}/releases/latest`;
const AUTHOR = "https://github.com/udhaykumarbala";
const VERSION = "0.3.0";
const IMG = "/app/android";

const title = "Clean Your TV app for Android phones";
const description =
  "A community-built phone app for Clean Your TV: clean up your Android TV or Google TV from your Android phone over Wi-Fi. No laptop, no coding agent, no cables. Free and open source.";
const BANNER_ALT =
  "Community-maintained app for Clean Your TV. Clean your TV from your phone. No laptop. No coding agent. Open the app on your Android phone, tap Start, and the ads and bloat are gone in about five minutes. Three steps: connect, analyse, clean.";

export const metadata = pageMeta("/app/android", title, description, {
  image: { url: `${IMG}/og.png`, width: 1200, height: 630, alt: BANNER_ALT },
});

// The three steps, with his phone screenshots and their alt text from his README.
const STEPS: { step: string; when: string; img: string; alt: string; text: string }[] = [
  {
    step: "Connect", when: "about a minute", img: "step-connect.webp",
    alt: "Look at the TV: the TV asks whether to trust this phone; tick Always allow, then choose OK",
    text: "The app finds your TV on the Wi-Fi and shows you how to let the phone in with the remote.",
  },
  {
    step: "Analyse", when: "nothing changes yet", img: "step-analyse.webp",
    alt: "We found 22 things to switch off, grouped into adverts, tracking, apps nobody asked for and brand extras, with everything it keeps listed below",
    text: "It reads what is on the TV and shows the plan: what goes off and what stays.",
  },
  {
    step: "Clean", when: "a restore point first", img: "step-clean.webp",
    alt: "Your TV is ready: 23 things switched off, new home screen on, everything can be put back",
    text: "Tap “Make it clean”. The clutter goes and the new home screen comes on.",
  },
];

// The plan screen drawn in the hero's phone, as the app shows it after Analyse.
const PLAN: [string, boolean][] = [["Adverts", true], ["Tracking", true], ["Apps nobody asked for", true], ["Brand extras", true], ["Your apps", false]];

const SAFE: ReactNode[] = [
  <><b>Plan first.</b> Nothing runs until you have seen it and tapped.</>,
  <><b>Restore point</b> saved on the phone before the first change.</>,
  <><b>Nothing uninstalled.</b> Apps are only switched off.</>,
  <><b>Undo anything,</b> one app or everything.</>,
  <><b>A watchdog</b> on the TV puts its own home screen back if the phone doesn&rsquo;t confirm within 150 seconds.</>,
];
const KEEPS: ReactNode[] = [
  "Your apps: Netflix, YouTube, Prime Video, live TV and HDMI inputs.",
  "The basics: Wi-Fi, remote, keyboard and the parts Android needs.",
  "Casting, the voice assistant and software updates, unless you switch them off.",
];
const NEEDS: ReactNode[] = [
  "An Android phone on Android 9 or newer, with a screen lock.",
  "An Android TV or Google TV on the same Wi-Fi.",
  "Network debugging on in the TV settings. The app shows where, and switches it off again at the end.",
];
const FACTS: [string, string, ReactNode[]][] = [
  ["Safe by design", "and-green", SAFE],
  ["What it keeps", "and-blue", KEEPS],
  ["What you need", "and-amber", NEEDS],
];

const Download = ({ version }: { version?: boolean }) => (
  <a href={DOWNLOAD} className="btn btn-green">
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4v12M6 10l6 6 6-6M5 20h14" />
    </svg>
    Download the APK{version && <span className="ch and-ver">v{VERSION}</span>}
  </a>
);

export default function AndroidApp() {
  const url = `${SITE}/app/android`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": url, url, name: title, description, isPartOf: { "@id": `${SITE}/#website` }, about: { "@id": `${url}#app` } },
      {
        "@type": "SoftwareApplication",
        "@id": `${url}#app`,
        name: "Clean Your TV app for Android phones",
        description,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Android 9 or newer",
        softwareVersion: VERSION,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        isAccessibleForFree: true,
        license: "https://opensource.org/licenses/MIT",
        downloadUrl: DOWNLOAD,
        codeRepository: REPO,
        image: `${SITE}${IMG}/og.png`,
        screenshot: STEPS.map((s) => `${SITE}${IMG}/${s.img}`),
        isBasedOn: { "@id": `${SITE}/#app` },
        author: { "@type": "Person", name: "udhaykumarbala", url: AUTHOR },
      },
      breadcrumbs(["Android app", "/app/android"]),
    ],
  };
  return (
    <main className="and">
      <JsonLd data={jsonLd} />

      {/* Hero: the pitch, and the phone beside the TV it just cleaned (drawn, not a picture). */}
      <section aria-labelledby="page-h" className="wrap and-hero">
        <div className="and-hero-text">
          <p className="kicker c-green">CH 08 · Android app · community-built</p>
          <h1 id="page-h" className="h1 and-h1">Clean your TV from your phone.</h1>
          <p className="lede">
            <strong>No laptop. No coding agent.</strong> <span className="hide-phone">Open the app on your Android phone, tap Start, and</span>
            <span className="and-phone-only">Tap Start, and</span> the ads and bloat are gone in about five minutes.
          </p>
          <div className="btns">
            <Download version />
            <a href={REPO} className="btn btn-ghost">Source on GitHub</a>
          </div>
          <ul className="plain and-tags" aria-label="At a glance">
            <li className="tag">Android 9+</li>
            <li className="tag">MIT · open source</li>
            <li className="tag">131 TV models · 46 brands</li>
            <li className="tag">No accounts, no ads</li>
          </ul>
        </div>

        <figure className="and-fig">
          <div className="and-stage">
            <div className="and-tv" aria-hidden="true">
              <div className="and-clock"><span>21:04</span><span>Good evening</span></div>
              <div className="and-dock"><i /><i /><i /><i /></div>
            </div>
            <div
              className="and-phone"
              role="img"
              aria-label="The app's plan screen: it found 22 things to switch off, grouped into adverts, tracking, apps nobody asked for and brand extras, with a Make it clean button"
            >
              <span className="ch and-phone-step">Step 2 · Analyse</span>
              <span className="and-phone-h">We found 22 things to switch off</span>
              <div className="and-plan">
                {PLAN.map(([label, off]) => (
                  <div key={label} className={off ? undefined : "and-stays"}>
                    <span>{label}</span>
                    <span>{off ? "off" : "stay"}</span>
                  </div>
                ))}
              </div>
              <div className="and-make">Make it clean</div>
            </div>
          </div>
          <figcaption className="ch and-cap">The app on your phone, the TV&rsquo;s new home screen, over your Wi-Fi.</figcaption>
        </figure>
      </section>

      {/* 01: the demo loop. */}
      <section aria-labelledby="watch-h" className="rule-top">
        <div className="wrap and-watch">
          <div className="stack">
            <p className="kicker c-pink">01 · Watch it</p>
            <h2 id="watch-h" className="h2">Watch it clean a TV.</h2>
          </div>
          <div className="and-video">
            <LoopVideo
              mp4={`${IMG}/demo.mp4`}
              webm={`${IMG}/demo.webm`}
              poster={`${IMG}/demo-poster.webp`}
              width={1200}
              height={744}
              label="Three steps, phone and TV side by side. 1 Connect: the app finds the TV and the TV asks to allow the phone. 2 Analyse: the phone reads the TV and shows 22 things to switch off while the TV is untouched. 3 Clean: the phone shows Making it clean while the TV shows a lantern scanning the old cards and drawing them into a soft black hole, and the TV ends on its new home screen."
            />
          </div>
        </div>
      </section>

      {/* 02: the three steps, each with his screenshot. */}
      <section aria-labelledby="steps-h" className="wrap sec and-steps-sec">
        <div className="stack">
          <p className="kicker c-green">02 · Three steps</p>
          <h2 id="steps-h" className="h2">About five minutes.</h2>
        </div>
        <ol className="plain and-steps">
          {STEPS.map((s, i) => (
            <li key={s.step}>
              <div className="and-shot">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${IMG}/${s.img}`} alt={s.alt} width={360} height={780} loading="lazy" decoding="async" />
              </div>
              <div className="and-step-text">
                <div className="and-step-top">
                  <h3 className="h3"><span className="ch">{i + 1}</span>{s.step}</h3>
                  <span className="ch">{s.when}</span>
                </div>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="dim and-after">
          Come back any time to put an app back, check for leftovers after a TV update, change the dock or the look, or undo everything.
        </p>
      </section>

      {/* 03: safety, what stays, what you need. */}
      <section aria-labelledby="how-h" className="band">
        <div className="wrap sec and-how">
          <div className="stack">
            <p className="kicker c-blue">03 · How it works</p>
            <h2 id="how-h" className="h2">Careful by default.</h2>
          </div>
          <div className="and-facts">
            {FACTS.map(([h, tone, items]) => (
              <div key={h} className={`and-fact ${tone}`}>
                <h3 className="h3">{h}</h3>
                <ul>
                  {items.map((x, i) => <li key={i}>{x}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="and-not">
            <p><strong>Not for Samsung, LG or Roku.</strong> Those TVs don&rsquo;t run Android, so the app can&rsquo;t work on them.</p>
            <Link href={PRIVACY_PATH} className="btn btn-sm and-not-btn">Use the privacy guide</Link>
          </div>
        </div>
      </section>

      {/* Closing: get it, and who made it. */}
      <section aria-labelledby="end-h" className="wrap sec and-end">
        <div className="stack and-end-text">
          <h2 id="end-h" className="h2 and-end-h">Your TV, tidied up.</h2>
          <p className="dim">
            Free and open source (MIT). It carries the same launcher and the same community TV lists as CleanYourTV. Google Play and F-Droid versions are on
            the way.
          </p>
          <div className="btns">
            <Download />
            <a href={REPO} className="btn btn-ghost">Source on GitHub</a>
          </div>
        </div>
        <a href={AUTHOR} className="and-credit">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${IMG}/udhaykumarbala.webp`} alt="" width={64} height={64} loading="lazy" decoding="async" />
          <span className="stack">
            <span className="ch c-green">Community-built</span>
            <span className="and-credit-name">by udhaykumarbala</span>
            <span className="dim">Built on CleanYourTV. Issues go to the app&rsquo;s own repo.</span>
          </span>
        </a>
      </section>
    </main>
  );
}
