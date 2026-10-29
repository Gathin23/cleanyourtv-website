import JsonLd from "@/components/JsonLd";
import CopyButton from "@/components/CopyButton";
import { Fog, Pumpkin } from "@/components/HwDecor";
import { GH } from "@/lib/parse";
import { SITE, breadcrumbs, pageMeta } from "@/lib/seo";
import { cdn } from "@/lib/site";
import "../halloween-home.css";
import "./halloween.css";

// The Halloween pack (theme + launcher skin), live until 1 Nov 2026. Facts come from the halloween-pack commits in the
// main repo: themes/halloween/{config.json,CREDITS.md}, themes/README.md and the launcher's Halloween skin.

const title = "Halloween pack for your TV";
const description =
  "A Halloween look for CleanYourTV Home until 1 November: seven night photos, a jack-o'-lantern for Wi-Fi that glows while you're online, a bat, a ghost and bats over the first Home of the day. One command to install, one to go back.";

export const metadata = pageMeta("/halloween", `${title} · CleanYourTV`, description);

// What the skin does, one line each (from the launcher's Halloween skin and themes/halloween).
const FEATURES: [string, string, string][] = [
  ["🌙", "Night wallpapers", "Night photos and an illustrated haunted house as wallpapers, behind a frosted dock."],
  ["🎃", "Wi-Fi jack-o'-lantern", "The Wi-Fi button glows while you're online and goes dark when the connection drops."],
  ["🦇", "Bat for Inputs", "It flaps when focused."],
  ["👻", "Ghost for Settings", "It floats up when focused."],
  ["🦇", "Bats over Home", "They fly up over the first Home of the day."],
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
      <section aria-labelledby="page-h" className="wrap hw-head hw-hero">
        <Fog />
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
        <p className="lede hw-lede">
          A spooky Home for CleanYourTV: seven night photos, a jack-o&rsquo;-lantern that glows while you&rsquo;re online, a bat, a ghost and bats over the
          first Home of the day. One command to put it on, one to take it off.
        </p>
      </section>

      <section aria-labelledby="in-h" className="wrap hw-sec">
        <h2 id="in-h" className="hw-h2">What&rsquo;s in the pack</h2>
        <ul className="hw-cards plain">
          <li className="hw-card">
            <h3>The theme</h3>
            <p>
              <code>themes/halloween</code>: a new night wallpaper every 30 minutes, a frosted-glass dock and a
              pumpkin-orange focus glow on a near-black background.
            </p>
          </li>
          <li className="hw-card">
            <h3>The skin</h3>
            <p>
              A jack-o&rsquo;-lantern for Wi-Fi whose carved face glows while the TV is online, a bat for Inputs that flaps when focused, a ghost for Settings that
              floats up, bats flying up over the first Home of the day, and &ldquo;Happy Halloween&rdquo;.
            </p>
          </li>
          <li className="hw-card">
            <h3>The wallpapers</h3>
            <p>Seven photos from Wikimedia Commons, cropped to leave the picture clear where Home doesn&rsquo;t cover it and darkened so the clock and dock stay readable.</p>
          </li>
          <li className="hw-card">
            <h3>The icons</h3>
            <p>The pumpkin, bat and ghost are Microsoft&rsquo;s Fluent Emoji 3D (MIT). The lit and dark pumpkins are the same picture with the face recoloured.</p>
          </li>
        </ul>
        <p className="hw-note">
          The skin switches itself off after 1 November (<code>festival_until</code> is 2026-11-01). The photos stay until you go back to the normal look.
          A launcher older than the skin shows the photos and the dock without it.
        </p>
      </section>

      <section aria-labelledby="shots-h" className="wrap hw-sec">
        <h2 id="shots-h" className="hw-h2">On a real TV</h2>
        <img
          className="hw-shot"
          src={cdn("/hw/bats-flying-1280.webp")}
          srcSet={`${cdn("/hw/bats-flying-1280.webp")} 1280w, ${cdn("/hw/bats-flying-1920.webp")} 1920w`}
          sizes="(min-width: 1290px) 1240px, calc(100vw - 48px)"
          width={1280}
          height={720}
          alt="Home with the Halloween theme on a real TV: the illustrated haunted-house wallpaper under a full moon, bats flying across Home, the dock with Netflix focused, and the jack-o'-lantern, bat and ghost buttons in the top right"
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
        <img className="hw-shot" src={cdn("/hw/screensaver-ghost.webp")} width={1280} height={720} alt="The Haunted screensaver on a real TV: a full moon behind dark trees, a ghost floating up on the left, a bat flying across and a small clock" loading="lazy" decoding="async" />
        <p className="hw-p">
          The Halloween photos slowly crossfading, with bats drifting across, a ghost that floats up every half minute or so, a flickering jack-o&rsquo;-lantern glow and a
          small clock. No network access, nothing running in the background. From the repository checkout (JDK 17 and Android SDK 34):
        </p>
        <pre className="hw-code" id="hw-saver"><code>{SAVER}</code></pre>
        <CopyButton from="hw-saver" label="Copy the command" className="btn btn-ghost" />
        <p className="hw-p">To remove it and get your old screensaver back: <code>TV_HOST=192.168.1.50 addons/haunted/build-and-install.sh --uninstall</code></p>
      </section>

      <section aria-labelledby="install-h" className="wrap hw-sec">
        <h2 id="install-h" className="hw-h2">Put it on your TV</h2>
        <p className="hw-p">
          Needs your TV on the same network with its address (the example uses <code>192.168.1.50</code>; use yours) and a checkout of the{" "}
          <a href={GH}>repository</a>. Pushing a theme restarts Home.
        </p>
        <pre className="hw-code" id="hw-install"><code>{INSTALL}</code></pre>
        <CopyButton from="hw-install" label="Copy the commands" className="btn btn-ghost" />
        <p className="hw-p">
          On Windows: <code>powershell -ExecutionPolicy Bypass -File tools\theme.ps1 -TvHost 192.168.1.50 themes\halloween</code>.
        </p>
      </section>

      <section aria-labelledby="back-h" className="wrap hw-sec">
        <h2 id="back-h" className="hw-h2">Back to the normal look</h2>
        <p className="hw-p">This clears the theme and the pictures and returns Home to the launcher&rsquo;s built-in look:</p>
        <pre className="hw-code" id="hw-reset"><code>{RESET}</code></pre>
        <CopyButton from="hw-reset" label="Copy the command" className="btn btn-ghost" />
        <p className="hw-p">The theme can never break Home: a key it doesn&rsquo;t understand is ignored, and a file that doesn&rsquo;t parse is ignored whole.</p>
      </section>

      <section aria-labelledby="credits-h" className="wrap hw-sec">
        <h2 id="credits-h" className="hw-h2">Credits</h2>
        <p className="hw-p">
          The photos are from Wikimedia Commons, each under its own licence (CC0, public domain, CC BY or CC BY-SA), not the repository&rsquo;s MIT licence.
          Each was cropped to 16:9, resized to 1920&times;1080, graded toward night and darkened toward the bottom and top-left; adaptations of the CC BY-SA
          pictures stay under CC BY-SA.
        </p>
        <ul className="hw-credits plain">
          {PHOTOS.map(([n, cap, by, file]) => (
            <li key={n}>
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
          The icons are from <a href="https://github.com/microsoft/fluentui-emoji">Fluent Emoji 3D</a>, MIT licence, Copyright (c) Microsoft Corporation.
        </p>
      </section>
    </main>
  );
}
