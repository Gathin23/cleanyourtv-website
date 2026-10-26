import Link from "next/link";
import type { ReactNode } from "react";
import JsonLd from "@/components/JsonLd";
import OpenWithoutJs from "@/components/OpenWithoutJs";
import PrivacyGuide from "@/components/PrivacyGuide";
import { StepList } from "@/components/PrivacySteps";
import { BRANDS, UNDO } from "@/lib/privacy";
import { GH } from "@/lib/parse";
import { SITE, breadcrumbs, pageMeta } from "@/lib/seo";
import "./not-android.css";

// "Stop your TV tracking you": a guide for Samsung, LG, Roku, Vizio and other TVs CleanYourTV can't reach. Level 1 is the
// TV's own settings (pick the TV, its year, tick the steps, or one at a time with the remote); level 2 the guest network;
// level 3 DNS blocking; then a check of the home network. The research behind it
// (cleanyourtv-launch/tv-privacy-research.md) sits in the folds below; nothing it marks unverified is here.

const title = "Stop your TV tracking you";
const description =
  "For Samsung, LG, Roku, Vizio, Hisense VIDAA and Fire TV: stop your TV tracking you, no root needed. Step by step with your remote, two minutes, every step undoable.";
const CHECKED = "26 Oct 2026";

export const metadata = pageMeta("/not-android", `${title}, no root needed · CleanYourTV`, description);

const IMC = "https://arxiv.org/abs/2409.06203";
const HAGEZI = "https://github.com/hagezi/dns-blocklists";

const SOURCES: [string, string][] = [
  ["Consumer Reports, How to Turn Off Smart TV Snooping Features (Oct 2025)", "https://www.consumerreports.org/electronics/privacy/how-to-turn-off-smart-tv-snooping-features-a4840102036/"],
  ["Anselmi et al., Watching TV with the Second-Party, ACM IMC 2024", IMC],
  ["The Markup, Your Smart TV Knows What You're Watching (Dec 2023)", "https://themarkup.org/privacy/2023/12/12/your-smart-tv-knows-what-youre-watching"],
  ["FTC: Vizio to pay $2.2 million (Feb 2017)", "https://www.ftc.gov/news-events/news/press-releases/2017/02/vizio-pay-22-million-ftc-state-new-jersey-settle-charges-it-collected-viewing-histories-11-million"],
  ["TechSpot: Texas sues five smart TV makers (Dec 2025)", "https://www.techspot.com/news/110630-texas-sues-five-smart-tv-makers-over-claims.html"],
  ["BleepingComputer: Samsung TVs to stop collecting Texans' data without consent", "https://www.bleepingcomputer.com/news/security/samsung-tvs-to-stop-collecting-texans-data-without-express-consent/"],
  ["Fox 7 Austin: LG settlement with Texas (May 2026)", "https://www.fox7austin.com/news/lg-smart-tv-acr-data-collection-texas-settlement"],
  ["Samsung: Automatic Content Recognition", "https://www.samsung.com/us/support/answer/ANS10010616/"],
  ["LG: Understanding privacy on LG smart TVs (Sep 2026)", "https://www.lg.com/global/newsroom/news/statements/statement-understanding-privacy-on-lg-smart-tvs/"],
  ["Notebookcheck on the Samsung research (Oct 2026)", "https://www.notebookcheck.net/No-mic-Samsung-TVs-may-hijack-your-soundbar-to-listen-in-researcher-claims.1433508.0.html"],
  ["NSA: Best Practices for Securing Your Home Network (2023)", "https://media.defense.gov/2023/Feb/22/2003165170/-1/-1/0/CSI_BEST_PRACTICS_FOR_SECURING_YOUR_HOME_NETWORK.PDF"],
  ["CyberInsider: LG TVs scanning home networks (Sep 2026)", "https://cyberinsider.com/lg-smart-tvs-found-scanning-home-networks-for-nearby-devices/"],
  ["Princeton CITP: the tracking ecosystem of streaming devices (2019)", "https://blog.citp.princeton.edu/2019/09/18/watching-you-watch-the-tracking-ecosystem-of-over-the-top-tv-streaming-devices"],
  ["HaGeZi DNS blocklists", HAGEZI],
  ["NextDNS native tracking domains", "https://github.com/nextdns/native-tracking-domains/tree/main/domains"],
  ["NextDNS pricing", "https://nextdns.io/pricing"],
  ["Perflyst SmartTV blocklist", "https://github.com/Perflyst/PiHoleBlocklist"],
  ["Pi-hole install docs", "https://docs.pi-hole.net/main/basic-install/"],
  ["AdGuard DNS filtering syntax", "https://adguard-dns.io/kb/general/dns-filtering-syntax/"],
  ["9to5Mac: Apple TV and privacy (Jun 2025)", "https://9to5mac.com/2025/06/02/why-apple-tv-4k-is-the-only-privacy-friendly-tv-option/"],
  ["Google TV basic mode", "https://support.google.com/googletv/answer/10408998?hl=en"],
  ["VIDAA OS privacy policy (Enhanced Viewing Service, Nexxen)", "https://www.vidaa.com/os-privacy-policy/"],
  ["V (VIDAA): Enhanced Viewing Service privacy notice, updated Apr 2026", "https://v-home.com/enhanced-viewing-service-privacy-notice-us/"],
  ["Pocket-lint: How to disable ACR on a Hisense TV (Sep 2026)", "https://www.pocket-lint.com/how-to-disable-acr-on-a-hisense-tv/"],
  ["Hisense VIDAA U5 user manual", "https://commercial.appliancesonline.com.au/manuals/ak/6/3/0/a/630a17fa9e80408c8ad491b0e6ef5608a103fa20_85A7G_User_Manual.pdf"],
  ["VIDAA U6 e-manual", "https://partners.gorenje.com/fts/GetDigitDoc.aspx?sifra=20009530&jezik=en&tipVsebine=1&docName=55a56fevs+e-manual_en.pdf"],
  ["Hisense VIDAA U9 e-manual (2025)", "https://www.hisense.com.my/wp-content/uploads/2025/08/93041_9603VIDAA_U9_EUEMCO_E-Manual_eng_202502%E5%AE%8C%E6%95%B4%E6%9F%A5%E7%9C%8B%E7%89%88.pdf"],
  ["VIDAA support: TVs are supported by their maker (Hisense, Toshiba and others)", "https://www.vidaa.com/customer_support_category/vidaa-os/"],
  ["HaGeZi issue 11466: VIDAA telemetry hosts, and the two that break the Ads Privacy app", "https://github.com/hagezi/dns-blocklists/issues/11466"],
];

// Where the year rules in lib/tvYear.ts come from.
const YEAR_SOURCES: [string, string][] = [
  ["Samsung: Understanding the model numbers on your Samsung TV (2008–2023 codes)", "https://www.samsung.com/us/support/answer/ANS10006944/"],
  ["Samsung Canada: Guide to the model number, and where to find it", "https://www.samsung.com/ca/support/tv-audio-video/tv-decipher-model-code/"],
  ["DisplaySpecifications: Samsung UN55DU7200, a 2024 model (D)", "https://www.displayspecifications.com/en/model/acb13ab0"],
  ["Which?: TV model names explained (Samsung F and LG A and 5 for 2025)", "https://www.which.co.uk/news/article/dont-buy-the-wrong-tv-model-names-explained-a3kZl6F8vd8X"],
  ["TheProductAnalyst: LG TV model numbers explained (2026), after tab-tv's LG decoder", "https://theproductanalyst.com/lg-tv-model-numbers-explained/"],
  ["LG: How to find the model number", "https://www.lg.com/us/support/help-library/lg-tv-how-to-find-the-model-number--20153215656505"],
];

function Fold({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <details id={id} className="na-fold">
      <summary>{label}</summary>
      <div className="na-fold-body">{children}</div>
    </details>
  );
}

export default function Privacy() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE}/not-android`,
        url: `${SITE}/not-android`,
        name: title,
        description,
        dateModified: "2026-10-26",
        isPartOf: { "@id": `${SITE}/#website` },
      },
      breadcrumbs(["Privacy guide", "/not-android"]),
    ],
  };
  return (
    <main className="na">
      <JsonLd data={jsonLd} />
      <section aria-labelledby="page-h" className="wrap page-head na-hero">
        <p className="kicker c-amber">CH 02 · Privacy guide · Samsung, LG, Roku, Vizio, Hisense, Fire TV</p>
        <h1 id="page-h" className="h1">{title}</h1>
        <p className="lede na-lede">Two minutes with your remote. No root, nothing to install, and every step can be undone.</p>
        <details className="na-what">
          <summary>What is it tracking?</summary>
          <p>
            Most smart TVs recognise what&rsquo;s on screen, including live TV and whatever comes in over HDMI, and report it back for advertising.
            It&rsquo;s called automatic content recognition, or ACR. A 2024 study of Samsung and LG TVs found that opting out in the settings stopped
            the traffic to ACR servers. <a href="#why">Why this matters</a>
          </p>
        </details>
      </section>

      <PrivacyGuide />

      <section aria-labelledby="know-h" className="na-know">
        <div className="wrap na-know-in">
          <h2 id="know-h" className="h2 h2-sm">Good to know</h2>
          <Fold id="undo" label="If something breaks: how to undo each step">
            <div className="na-table">
              <table>
                <thead>
                  <tr>
                    <th scope="col">You did</th>
                    <th scope="col">You might lose</th>
                    <th scope="col">To undo</th>
                  </tr>
                </thead>
                <tbody>
                  {UNDO.map(([did, lose, undo]) => (
                    <tr key={did}>
                      <td>{did}</td>
                      <td>{lose}</td>
                      <td>{undo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="na-warn-text">
              <strong>Two things not to do:</strong> don&rsquo;t decline the TV&rsquo;s required terms (most smart apps stop,{" "}
              <a href="https://www.consumerreports.org/televisions/samsung-roku-smart-tvs-vulnerable-to-hacking-consumer-reports-finds/">Consumer Reports found</a>),
              and don&rsquo;t block the update domains.
            </p>
          </Fold>

          <Fold id="why" label="Why this matters">
            <p>
              Most smart TVs can recognise what&rsquo;s on screen, including live TV and whatever comes in over HDMI, and report it back for advertising and
              measurement. It&rsquo;s called automatic content recognition, or ACR.
            </p>
            <p>
              A peer-reviewed study at <a href={IMC}>ACM IMC 2024</a> found ACR on Samsung and LG TVs works even when the TV is only a screen for an HDMI
              device. It also found that opting out stopped the traffic to ACR servers.
            </p>
            <p>
              In December 2025 Texas <a href="https://www.techspot.com/news/110630-texas-sues-five-smart-tv-makers-over-claims.html">sued five TV makers</a> over ACR,
              Samsung and LG among them. Samsung and LG have since agreed to ask Texans for consent. That covers Texas only; everywhere else, the settings are
              how you say no.
            </p>
            <p>
              In 2017 Vizio{" "}
              <a href="https://www.ftc.gov/news-events/news/press-releases/2017/02/vizio-pay-22-million-ftc-state-new-jersey-settle-charges-it-collected-viewing-histories-11-million">paid $2.2 million</a>{" "}
              to the FTC and New Jersey for collecting viewing data from about 11 million TVs without consent.
            </p>
            <p className="na-small">
              This month a security researcher, <a href="https://x.com/log4j/status/2113014142600953868">@log4j</a>, reported further findings from a 2025 Samsung TV.
              Nobody has reproduced them yet, the full write-up isn&rsquo;t out, and Samsung hasn&rsquo;t responded (
              <a href="https://www.notebookcheck.net/No-mic-Samsung-TVs-may-hijack-your-soundbar-to-listen-in-researcher-claims.1433508.0.html">Notebookcheck</a>). We&rsquo;ll
              update this page when the report is published.
            </p>
            <p className="na-take">
              Privacy isn&rsquo;t about hiding; it&rsquo;s about deciding. You can still choose to share what you watch. These steps make it your choice, instead of
              the default you clicked past during setup.
            </p>
          </Fold>

          <Fold id="offline" label="The last resort: keep the TV offline">
            <p>
              A TV that never goes online can&rsquo;t send anything. Leave it off the network and plug in a separate streaming box. Apple TV is the usual pick:
              tvOS has no ACR, and Siri, location and analytics are opt-in at setup (
              <a href="https://9to5mac.com/2025/06/02/why-apple-tv-4k-is-the-only-privacy-friendly-tv-option/">9to5Mac</a>). On it, also turn off Settings › General ›
              Privacy &amp; Security › Tracking › Allow Apps to Ask to Track.
            </p>
            <ul>
              <li>
                <strong>Google TV</strong> has a <a href="https://support.google.com/googletv/answer/10408998?hl=en">basic TV mode</a>: no account or internet, aerial,
                cable and HDMI still work. Going back needs a factory reset.
              </li>
              <li>
                <strong>Samsung</strong> lets you <a href="https://www.tomsguide.com/uk/how-to/set-up-2020-samsung-smart-tv">skip network setup</a>; you lose the apps
                and Smart Hub.
              </li>
              <li>
                <strong>Roku TVs</strong> need internet once to activate, then{" "}
                <a href="https://community.roku.com/t5/Discussions/Setup-Roku-TV-without-internet/m-p/975146">can run offline</a> on aerial and HDMI, according to
                Roku&rsquo;s community staff.
              </li>
            </ul>
            <p className="na-warn-text">An offline TV gets no security updates. That&rsquo;s fine while it stays offline; just don&rsquo;t connect it &ldquo;once&rdquo; years later.</p>
          </Fold>

          <OpenWithoutJs id="all" className="na-fold" summary={<summary>Every TV, every step, on one page</summary>}>
            <div className="na-fold-body">
              <p className="na-small">Where the menu moved over the years, every year&rsquo;s path is listed.</p>
              {BRANDS.map((b) => (
                <section key={b.id} id={`all-${b.id}`} className="na-allbrand" aria-label={b.name}>
                  <h3 className="na-h3">{b.name}</h3>
                  <p className="na-small">{b.intro}</p>
                  {b.findVersion && <p className="na-small">{b.findVersion}</p>}
                  <StepList brand={b} pick={null} />
                  {b.outro && <p className="na-small">{b.outro}</p>}
                </section>
              ))}
            </div>
          </OpenWithoutJs>

          <Fold id="sources" label="Sources">
            <p className="na-small">Each step&rsquo;s own sources are listed with it.</p>
            <ul className="na-sources">
              {SOURCES.map(([label, url]) => (
                <li key={url}>
                  <a href={url} target="_blank" rel="noopener">{label}</a>
                </li>
              ))}
            </ul>
            <h3 className="na-h4">Model years</h3>
            <ul className="na-sources">
              {YEAR_SOURCES.map(([label, url]) => (
                <li key={url}>
                  <a href={url} target="_blank" rel="noopener">{label}</a>
                </li>
              ))}
            </ul>
            <p className="na-small">
              Last checked {CHECKED}. Spotted a wrong menu path? <a href={`${GH}/issues/new?labels=tv-support`}>Open an issue</a>.
            </p>
          </Fold>
        </div>
      </section>

      <section aria-label="Android TV" className="wrap na-android">
        <div className="na-android-box">
          <div className="stack">
            <strong>Have an Android TV or Google TV? CleanYourTV goes further.</strong>
            <span className="dim">
              It switches off the tracking and ad apps themselves over Wi-Fi and swaps the ad-filled home screen for a clean one. No root, and one line puts it
              all back. We don&rsquo;t recommend rooting a TV to get rid of tracking: it can brick it.
            </span>
          </div>
          <Link href="/tvs" className="btn btn-green btn-md">Check your TV</Link>
        </div>
      </section>
    </main>
  );
}
