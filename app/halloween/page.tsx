import JsonLd from "@/components/JsonLd";
import CopyButton from "@/components/CopyButton";
import { Fog, Garland, Pumpkin } from "@/components/HwDecor";
import { GH } from "@/lib/parse";
import { SITE, breadcrumbs, pageMeta } from "@/lib/seo";
import { cdn } from "@/lib/site";
import "../halloween-home.css";
import "./halloween.css";

// The Halloween pack (theme + launcher skin), live until 1 Nov 2026. Facts come from the halloween-pack commits in the
// main repo: themes/halloween/{config.json,CREDITS.md}, themes/README.md and the launcher's Halloween skin.

const title = "Halloween pack for your TV";
const description =
  "A Halloween look for CleanYourTV Home until 1 November: night wallpapers and an illustrated haunted house, a jack-o'-lantern for Wi-Fi that glows while you're online, a bat, a ghost and bats over Home. One command on, one command off.";

export const metadata = pageMeta("/halloween", `${title} · CleanYourTV`, description);

// What the skin does, one line each (from the launcher's Halloween skin and themes/halloween).
const FEATURES: [string, string, string][] = [
  ["🌙", "Night wallpapers", "Photos and an illustrated haunted house."],
  ["🎃", "Wi-Fi jack-o'-lantern", "Glows online, goes dark offline."],
  ["🦇", "Bat for Inputs", "Flaps when focused."],
  ["👻", "Ghost for Settings", "Floats up when focused."],
  ["🦇", "Bats over Home", "They fly up on the first Home of the day."],
];

// [file, caption, author and licence, Commons page]
const PHOTOS: [string, string, string, string][] = [
  ["001", "Jack-o'-lantern on the steps", "Alabama Extension, CC0", "Jack-O-Lantern_at_night.jpg"],
  ["002", "Full moon behind a sequoia grove, California", "US Forest Service, public domain", "Lit_by_the_Moon_SQF_A1_-1619-Edit_(52321356482).jpg"],
  ["003", "Cemetery chapel in the fog, Chorzów, Poland", "Adrian Tync, CC BY-SA 4.0", "Chorz%C3%B3w_St_Hedwig_cemetery_chapel_in_fog_2021.jpg"],
  ["004", "A jack-o'-lantern by candlelight", "Douglaspperkins, CC BY 4.0", "Jack-o-lantern_2.jpg"],
  ["005", "The moon rising behind the trees", "Halleyuncometafotografo, CC BY-SA 4.0", "Horizonte_lunar.jpg"],
  ["006", "Old cemetery in the fog", "Андрей Романенко (Andrey Romanenko), CC BY-SA 4.0", "Great_Cemetery_in_the_fog_03.jpg"],
  ["007", "Full moon over the Gullmarn fjord, Sweden", "W.carter, CC BY-SA 4.0", "Full_moon_over_Gullmarn_fjord_at_Holma_Marina_2.jpg"],
];

const INSTALL = `git clone https://github.com/Gathin23/cleanyourtv.git
cd cleanyourtv
TV_HOST=192.168.1.50 tools/theme.sh themes/halloween`;
const WINDOWS = "powershell -ExecutionPolicy Bypass -File tools\\theme.ps1 -TvHost 192.168.1.50 themes\\halloween";
const SAVER = "TV_HOST=192.168.1.50 addons/haunted/build-and-install.sh";
const RESET = "TV_HOST=192.168.1.50 tools/theme.sh --reset";

export default function Halloween() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": `${SITE}/halloween`, url: `${SITE}/halloween`, name: title, description, isPartOf: { "@id": `${SITE}/#website` }, about: { "@id": `${SITE}/#app` } },
      breadcrumbs(["Halloween pack", "/halloween"]),
    ],
  };
  return (
    <main className="hw hw-on">
      <JsonLd data={jsonLd} />
      <Garland />

      <section aria-labelledby="page-h" className="wrap hw-head hw-hero">
        <Fog />
        <div className="hw-head-text">
          <p className="kicker c-mint">CH 13 · Halloween special · until 1 Nov 2026</p>
          <h1 id="page-h" className="hw-h1">
            Halloween<br />
            for your <span className="hw-glitch">TV.</span>
          </h1>
          <div className="hw-pks" aria-hidden="true">
            <Pumpkin s={46} delay={0.4} />
            <Pumpkin s={74} delay={1.3} />
            <Pumpkin s={38} delay={2.1} small />
          </div>
          <p className="lede hw-lede">Turn your TV spooky this Halloween. One command on, one command off.</p>
        </div>
        {/* The page's largest picture, so it loads first: no lazy loading, explicit size, three widths. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="hw-shot hw-hero-shot"
          src={cdn("/hw/bats-flying-1280.webp")}
          srcSet={`${cdn("/hw/bats-flying-640.webp")} 640w, ${cdn("/hw/bats-flying-1280.webp")} 1280w, ${cdn("/hw/bats-flying-1920.webp")} 1920w`}
          sizes="(min-width: 1040px) 572px, calc(100vw - 48px)"
          width={1280}
          height={720}
          fetchPriority="high"
          alt="Home with the Halloween theme on a real TV: the illustrated haunted-house wallpaper under a full moon, bats flying across Home, the dock with Netflix focused, and the jack-o'-lantern, bat and ghost buttons in the top right"
        />
      </section>

      <section aria-labelledby="install-h" className="wrap hw-sec">
        <h2 id="install-h" className="hw-h2">Apply it to your TV</h2>
        <ol className="hw-steps plain">
          <li>
            <span className="hw-step-n" aria-hidden="true">1</span>
            <span><strong>Same Wi-Fi</strong>Your TV and computer on one network. Find your TV&rsquo;s IP address.</span>
          </li>
          <li>
            <span className="hw-step-n" aria-hidden="true">2</span>
            <span><strong>Get the repo</strong>Clone <a href={GH}>CleanYourTV</a> on your computer.</span>
          </li>
          <li>
            <span className="hw-step-n" aria-hidden="true">3</span>
            <span><strong>Run one command</strong>It pushes the theme and restarts Home.</span>
          </li>
        </ol>
        <div className="hw-code-box">
          <div className="hw-code-bar">
            <span>macOS / Linux</span>
            <CopyButton from="hw-install" label="Copy" className="hw-copy" />
          </div>
          <pre className="hw-code" id="hw-install"><code>{INSTALL}</code></pre>
        </div>
        <div className="hw-code-box">
          <div className="hw-code-bar">
            <span>Windows</span>
            <CopyButton from="hw-win" label="Copy" className="hw-copy" />
          </div>
          <pre className="hw-code" id="hw-win"><code>{WINDOWS}</code></pre>
        </div>
        <p className="hw-tiny">Replace <code>192.168.1.50</code> with your TV&rsquo;s address.</p>
        <div className="hw-code-box hw-code-small">
          <div className="hw-code-bar">
            <span>Back to normal</span>
            <CopyButton from="hw-reset" label="Copy" className="hw-copy" />
          </div>
          <pre className="hw-code" id="hw-reset"><code>{RESET}</code></pre>
        </div>
      </section>

      <section aria-labelledby="in-h" className="wrap hw-sec">
        <h2 id="in-h" className="hw-h2">What&rsquo;s in the pack</h2>
        <ul className="hw-cards plain">
          <li className="hw-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cdn("/hw/card-theme.webp")} width={640} height={360} alt="" loading="lazy" decoding="async" />
            <h3>The theme</h3>
            <p>Frosted dock, a new wallpaper every 30 minutes, pumpkin-orange glow.</p>
          </li>
          <li className="hw-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cdn("/hw/card-skin.webp")} width={640} height={360} alt="" loading="lazy" decoding="async" />
            <h3>The skin</h3>
            <p>Wi-Fi, Inputs and Settings become a jack-o&rsquo;-lantern, a bat and a ghost.</p>
          </li>
          <li className="hw-card">
            <span className="hw-thumbs" aria-hidden="true">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={n} src={cdn(`/hw/th-${n}.webp`)} width={256} height={144} alt="" loading="lazy" decoding="async" />
              ))}
            </span>
            <h3>The wallpapers</h3>
            <p>Seven night photos and an illustrated haunted house.</p>
          </li>
          <li className="hw-card">
            <span className="hw-icons" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cdn("/hw/icon-pumpkin.webp")} width={96} height={96} alt="" loading="lazy" decoding="async" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cdn("/hw/icon-bat.webp")} width={128} height={128} alt="" loading="lazy" decoding="async" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cdn("/hw/icon-ghost.webp")} width={96} height={96} alt="" loading="lazy" decoding="async" />
            </span>
            <h3>The icons</h3>
            <p>Fluent Emoji 3D, lit and dark.</p>
          </li>
        </ul>
        <p className="hw-note">The skin switches itself off after 1 November.</p>
      </section>

      <section aria-labelledby="shots-h" className="wrap hw-sec">
        <h2 id="shots-h" className="hw-h2">On a real TV</h2>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="hw-shot"
          src={cdn("/hw/01-home-main.webp")}
          width={1280}
          height={720}
          alt="Home on a real TV with the Halloween theme: the illustrated haunted house under a full moon, the dock with Netflix focused, and the jack-o'-lantern, bat and ghost buttons in the top right"
          loading="lazy"
          decoding="async"
        />
        <ul className="hw-feats plain">
          {FEATURES.map(([icon, name, text]) => (
            <li key={name}>
              <span className="hw-feat-i" aria-hidden="true">{icon}</span>
              <span>
                <strong>{name}</strong>
                {text}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="saver-h" className="wrap hw-sec">
        <h2 id="saver-h" className="hw-h2">Bonus: the Haunted screensaver</h2>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="hw-shot" src={cdn("/hw/screensaver-ghost.webp")} width={1280} height={720} alt="The Haunted screensaver on a real TV: a full moon behind dark trees, a ghost floating up on the left, a bat flying across and a small clock" loading="lazy" decoding="async" />
        <p className="hw-p">Night photos crossfading, with bats, a ghost and a flickering glow.</p>
        <div className="hw-code-box">
          <div className="hw-code-bar">
            <span>From the repo checkout</span>
            <CopyButton from="hw-saver" label="Copy" className="hw-copy" />
          </div>
          <pre className="hw-code" id="hw-saver"><code>{SAVER}</code></pre>
        </div>
        <p className="hw-tiny">Needs JDK 17 and Android SDK 34. To remove it: <code>addons/haunted/build-and-install.sh --uninstall</code></p>
      </section>

      <section aria-labelledby="credits-h" className="wrap hw-sec">
        <h2 id="credits-h" className="hw-h2">Credits</h2>
        <p className="hw-p">Photos from Wikimedia Commons, each under its own licence (not the repository&rsquo;s MIT), cropped and graded toward night.</p>
        <ul className="hw-credits plain">
          {PHOTOS.map(([n, cap, by, file]) => (
            <li key={n}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cdn(`/hw/wall-${n}.webp`)} width={640} height={360} alt={cap} loading="lazy" decoding="async" />
              <p>
                <a href={`https://commons.wikimedia.org/wiki/File:${file}`}>{cap}</a>
                <span>{by}</span>
              </p>
            </li>
          ))}
        </ul>
        <p className="hw-p">Haunted house illustration · CleanYourTV, CC0.</p>
        <p className="hw-p">
          Icons from <a href="https://github.com/microsoft/fluentui-emoji">Fluent Emoji 3D</a>, MIT licence, Copyright (c) Microsoft Corporation.
        </p>
      </section>
    </main>
  );
}
