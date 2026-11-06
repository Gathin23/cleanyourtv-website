import JsonLd from "@/components/JsonLd";
import CopyButton from "@/components/CopyButton";
import { GH } from "@/lib/parse";
import { SITE, breadcrumbs, pageMeta } from "@/lib/seo";
import "./diwali.css";

// The Diwali theme, on until 11 Nov 2026. Facts come from themes/diwali/{config.json,CREDITS.md,wallpapers/captions.txt}
// in the main repo, themes/README.md and the launcher's festive skin (Festival.java, DiyaDrawable.java).

const title = "Diwali theme for your TV";
const description =
  "A Diwali look for CleanYourTV Home: eight Diwali photos (diyas, a rangoli, marigolds, akash kandils, fireworks and a street in lights), a diya for Wi-Fi whose flame follows the signal, a bell, a marigold and a Happy Diwali greeting. One command on, one command off.";

export const metadata = pageMeta("/diwali", `${title} · CleanYourTV`, description, {
  image: {
    url: `${SITE}/dw/og-diwali.jpg`,
    width: 1200,
    height: 630,
    alt: "Diwali on your TV. The CleanYourTV Diwali theme: a TV showing Home over Diwali fireworks above a city, with Happy Diwali above the clock.",
  },
});

// What the theme does, one line each (from themes/diwali/config.json and the launcher's festive skin).
const FEATURES: [string, string, string][] = [
  ["🪔", "Wi-Fi diya", "Its flame follows the signal and goes out offline."],
  ["🔔", "Bell for Inputs", "It swings when focused."],
  ["🌼", "Marigold for Settings", "And a petal shower on the first Home of the day."],
  ["✨", "Happy Diwali", "Above the clock, in diya gold."],
  ["🖼️", "Eight Diwali photos", "A new one every 20 minutes, its photographer under the buttons."],
  ["📅", "Off by itself", "The skin switches itself off after 11 November."],
];

// [n, caption, author and licence, Commons file] from themes/diwali/wallpapers/captions.txt and CREDITS.md
const WALLS: [number, string, string, string][] = [
  [1, "A row of diyas", "Slyronit, CC BY-SA 4.0", "Diwali_Diyas_4.jpg"],
  [2, "Diyas set in a rangoli", "siddarth varanasi, CC BY 2.0", "Diya_set_in_a_rangoli.jpg"],
  [3, "Diyas and marigolds", "The open draft, CC BY-SA 4.0", "The_Glow_of_Togetherness,_Diwali_in_Common_Households_of_India_02.jpg"],
  [4, "Akash kandils for sale in Pune", "आर्या जोशी (Arya Joshi), CC BY-SA 4.0", "Diwali_Lanterns_in_Pun_Maharashtra.jpg"],
  [5, "Diwali fireworks over the Yarra, Melbourne", "Chris Phutully, CC BY 2.0", "Diwali_Fireworks,_Melbourne_Australia_2013.jpg"],
  [6, "Diwali fireworks over a lake, Chennai", "Sriram Jagannathan, CC BY 2.0", "Fireworks_Diwali_Chennai_India_November_2013_b.jpg"],
  [7, "A street in Diwali lights, Karnal", "Arne Hückelheim, CC BY-SA 3.0", "DiwaliStreetKarnal.JPG"],
  [8, "A diya with four flames", "Moneysha26, CC BY-SA 4.0", "Diwali_deepak_(diya).jpg"],
];

const INSTALL = `git clone https://github.com/Gathin23/cleanyourtv.git
cd cleanyourtv
TV_HOST=192.168.1.50 tools/theme.sh themes/diwali`;
const WINDOWS = "powershell -ExecutionPolicy Bypass -File tools\\theme.ps1 -TvHost 192.168.1.50 themes\\diwali";
const RESET = "TV_HOST=192.168.1.50 tools/theme.sh --reset";

export default function Diwali() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": `${SITE}/diwali`, url: `${SITE}/diwali`, name: title, description, isPartOf: { "@id": `${SITE}/#website` }, about: { "@id": `${SITE}/#app` } },
      breadcrumbs(["Diwali theme", "/diwali"]),
    ],
  };
  return (
    <main className="dw">
      <JsonLd data={jsonLd} />

      <section aria-labelledby="page-h" className="wrap dw-head">
        <div className="dw-head-text">
          <p className="kicker c-mint">Diwali special · 2026</p>
          <h1 id="page-h" className="dw-h1">
            <span>Diwali</span>
            <br />
            on your TV.
          </h1>
          <p className="lede dw-lede">Diyas, rangoli, lanterns and fireworks on Home. Free, one command on, one command off.</p>
        </div>
        {/* The page's largest picture, so it loads first: no lazy loading, explicit size, three widths. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="dw-shot"
          src="/dw/home-1280.webp"
          srcSet="/dw/home-640.webp 640w, /dw/home-1280.webp 1280w, /dw/home-1920.webp 1920w"
          sizes="(min-width: 1040px) 572px, calc(100vw - 48px)"
          width={1280}
          height={720}
          fetchPriority="high"
          alt="Home with the Diwali theme: Diwali fireworks over the Yarra in Melbourne, Happy Diwali above the clock, the bell, diya and marigold buttons in the top right and the dock of apps at the bottom"
        />
      </section>

      <section aria-labelledby="install-h" className="wrap dw-sec">
        <h2 id="install-h" className="dw-h2">Put it on your TV</h2>
        <ol className="dw-steps plain">
          <li>
            <span className="dw-step-n" aria-hidden="true">1</span>
            <span><strong>Same Wi-Fi</strong>Your TV and computer on one network. Find your TV&rsquo;s IP address.</span>
          </li>
          <li>
            <span className="dw-step-n" aria-hidden="true">2</span>
            <span><strong>Get the repo</strong>Clone <a href={GH}>CleanYourTV</a> on your computer.</span>
          </li>
          <li>
            <span className="dw-step-n" aria-hidden="true">3</span>
            <span><strong>Run one command</strong>It pushes the theme and restarts Home.</span>
          </li>
        </ol>
        <div className="dw-code-box">
          <div className="dw-code-bar">
            <span>macOS / Linux</span>
            <CopyButton from="dw-install" label="Copy" className="dw-copy" />
          </div>
          <pre className="dw-code" id="dw-install"><code>{INSTALL}</code></pre>
        </div>
        <div className="dw-code-box">
          <div className="dw-code-bar">
            <span>Windows</span>
            <CopyButton from="dw-win" label="Copy" className="dw-copy" />
          </div>
          <pre className="dw-code" id="dw-win"><code>{WINDOWS}</code></pre>
        </div>
        <p className="dw-tiny">Replace <code>192.168.1.50</code> with your TV&rsquo;s address. Needs the CleanYourTV launcher on the TV.</p>
        <div className="dw-code-box dw-code-small">
          <div className="dw-code-bar">
            <span>Back to normal</span>
            <CopyButton from="dw-reset" label="Copy" className="dw-copy" />
          </div>
          <pre className="dw-code" id="dw-reset"><code>{RESET}</code></pre>
        </div>
      </section>

      <section aria-labelledby="in-h" className="wrap dw-sec">
        <h2 id="in-h" className="dw-h2">What&rsquo;s in it</h2>
        <ul className="dw-cards plain">
          <li className="dw-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/dw/card-theme.webp" width={640} height={360} alt="" loading="lazy" decoding="async" />
            <h3>The theme</h3>
            <p>A frosted dock set low, so the picture shows, and diya-gold focus.</p>
          </li>
          <li className="dw-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/dw/card-skin.webp" width={640} height={360} alt="" loading="lazy" decoding="async" />
            <h3>The festive skin</h3>
            <p>Wi-Fi, Inputs and Settings become a diya, a bell and a marigold.</p>
          </li>
          <li className="dw-card">
            <span className="dw-thumbs" aria-hidden="true">
              {WALLS.map(([n]) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={n} src={`/dw/th-${n}.webp`} width={384} height={216} alt="" loading="lazy" decoding="async" />
              ))}
            </span>
            <h3>The wallpapers</h3>
            <p>Eight Diwali photos, a new one every 20 minutes.</p>
          </li>
        </ul>
        <ul className="dw-feats plain">
          {FEATURES.map(([icon, name, text]) => (
            <li key={name}>
              <span className="dw-feat-i" aria-hidden="true">{icon}</span>
              <span>
                <strong>{name}</strong>
                {text}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="walls-h" className="wrap dw-sec">
        <h2 id="walls-h" className="dw-h2">The photos</h2>
        <ul className="dw-credits plain">
          {WALLS.map(([n, cap, by, file]) => (
            <li key={n}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/dw/wall-${n}.webp`} width={640} height={360} alt={cap} loading="lazy" decoding="async" />
              <p>
                <a href={`https://commons.wikimedia.org/wiki/File:${file}`}>{cap}</a>
                <span>{by}</span>
              </p>
            </li>
          ))}
        </ul>
        <p className="dw-p">
          Photos from Wikimedia Commons, each under its own licence (not the repository&rsquo;s MIT), cropped to 16:9 and darkened behind the clock and the
          dock. Happy Diwali!
        </p>
      </section>
    </main>
  );
}
