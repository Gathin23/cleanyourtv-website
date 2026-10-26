import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import JsonLd from "@/components/JsonLd";
import NetCheck from "@/components/NetCheck";
import OpenWithoutJs from "@/components/OpenWithoutJs";
import PrivacyGuide from "@/components/PrivacyGuide";
import { StepList } from "@/components/PrivacySteps";
import { BRANDS, DOMAINS, UNDO } from "@/lib/privacy";
import type { Verdict } from "@/lib/privacy";
import { GH } from "@/lib/parse";
import { SITE, breadcrumbs, pageMeta } from "@/lib/seo";

// "Fix my TV": a phone-first guide for Samsung, LG, Roku, Vizio and other TVs CleanYourTV can't reach. Level 1 is the
// TV's own settings, one card at a time; level 2 the guest network; level 3 DNS blocking. The research behind it
// (cleanyourtv-launch/tv-privacy-research.md) sits in the folds below; nothing it marks unverified is here.

const title = "Stop your TV tracking you";
const description =
  "For Samsung, LG, Roku, Vizio, Hisense VIDAA and Fire TV: stop your TV tracking you, no root needed. Step by step with your remote, two minutes, every step undoable.";
const CHECKED = "26 Oct 2026";

export const metadata = pageMeta("/not-android", `${title}, no root needed · CleanYourTV`, description);

// body is overflow:hidden for the TV, so the page scrolls inside main, as /faq and /tvs do.
const page: CSSProperties = {
  height: "100dvh",
  overflowY: "auto",
  background: "#050505",
  color: "#e9e9e9",
  fontFamily: "var(--font-outfit), Outfit, sans-serif",
  fontWeight: 300,
  WebkitFontSmoothing: "antialiased",
};
const wrap: CSSProperties = { maxWidth: 760, margin: "0 auto", padding: "32px 20px 120px", fontSize: 19, lineHeight: 1.55 };
const kicker: CSSProperties = { margin: "0 0 16px", fontSize: 15, letterSpacing: 2, textTransform: "uppercase", color: "#9a9a9a" };
const green = { color: "#cfffcf", borderBottomColor: "rgba(207,255,207,.35)" };

const IMC = "https://arxiv.org/abs/2409.06203";
const HAGEZI = "https://github.com/hagezi/dns-blocklists";
const PERFLYST = "https://raw.githubusercontent.com/Perflyst/PiHoleBlocklist/master/SmartTV.txt";
const TONE: Record<Verdict, string> = { Block: "block", Keep: "keep", Optional: "maybe", "Don’t block": "keep" };

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

/** A level's fold: "Level 2 · 10 minutes · Guest network" with a chevron. */
function LevelHead({ n, time, name }: { n: number; time: string; name: string }) {
  return (
    <summary className="pv2-levelhead">
      <span className="pv2-levelno">Level {n}</span>
      <span className="pv2-levelname">
        {name}
        <span className="pv2-leveltime">{time}</span>
      </span>
      <span className="pv-chev" aria-hidden="true">▾</span>
    </summary>
  );
}

function Fold({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <details id={id} className="pv2-fold">
      <summary>
        <span>{label}</span>
        <span className="pv-chev" aria-hidden="true">▾</span>
      </summary>
      <div className="pv2-foldbody">{children}</div>
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
      breadcrumbs(["Not Android", "/not-android"]),
    ],
  };
  return (
    <main className="page-main" style={page}>
      <JsonLd data={jsonLd} />
      <article style={wrap} className="pv pv2">
        <p style={kicker}>
          <Link href="/" className="home-link" style={green}>cleanyour.tv</Link> &nbsp;·&nbsp; Not Android
        </p>
        <h1 className="pv2-h1">{title}</h1>
        <p className="pv2-sub">Two minutes with your remote. No root, nothing to install, and every step can be undone.</p>

        <section id="settings" className="pv2-level pv2-level1" aria-label="Level 1, 2 minutes: TV settings">
          <p className="pv2-levelhead pv2-levelhead-static">
            <span className="pv2-levelno">Level 1</span>
            <span className="pv2-levelname">
              TV settings<span className="pv2-leveltime">2 minutes</span>
            </span>
          </p>
          <PrivacyGuide />
        </section>

        <details id="network" className="pv2-level">
          <LevelHead n={2} time="10 minutes" name="Guest network" />
          <div className="pv2-levelbody">
            <p>
              Put the TV on your router&rsquo;s guest network, so it can&rsquo;t see your laptop or phone. The NSA&rsquo;s home-network advice is to
              keep guests on <a href="https://media.defense.gov/2023/Feb/22/2003165170/-1/-1/0/CSI_BEST_PRACTICS_FOR_SECURING_YOUR_HOME_NETWORK.PDF">a
              separate network from your more trusted devices</a>. Researchers at Gamers Nexus{" "}
              <a href="https://cyberinsider.com/lg-smart-tvs-found-scanning-home-networks-for-nearby-devices/">found an LG TV listing 38 devices</a> on
              one home network (LG says device discovery is a standard function).
            </p>
            <ol className="pv2-mini">
              <li>
                <strong>Turn on the guest network</strong>
                <span>In your router&rsquo;s app or admin page. Some routers call it an IoT network.</span>
              </li>
              <li>
                <strong>Move the TV to it</strong>
                <span>On the TV, forget your main Wi-Fi and join the guest one. If the TV is wired, use Wi-Fi instead, or a port your router gives to guests.</span>
              </li>
              <li>
                <strong>Know the catch</strong>
                <span>Casting from a phone on your main Wi-Fi stops working across the two networks, unless your router passes mDNS between them. Join your phone to the guest network to cast.</span>
              </li>
            </ol>
            <p className="pv2-undo">
              <strong>Undo:</strong> move the TV back to your main Wi-Fi. <a href="#undo">Everything else you can undo</a>
            </p>
          </div>
        </details>

        <details id="dns" className="pv2-level">
          <LevelHead n={3} time="Advanced" name="DNS blocking" />
          <div className="pv2-levelbody">
            <p>
              Settings cover what the TV maker lets you switch off. A DNS blocker goes further: the TV can&rsquo;t find the tracking servers at
              all. In 2019, Princeton researchers found{" "}
              <a href="https://blog.citp.princeton.edu/2019/09/18/watching-you-watch-the-tracking-ecosystem-of-over-the-top-tv-streaming-devices">Roku&rsquo;s
              privacy options stopped its ad ID leaking</a>, but not the number of trackers it contacted.
            </p>
            <div className="pv-cards">
              <div>
                <strong>NextDNS</strong>
                <span>
                  Nothing to install: point your router&rsquo;s DNS at it. Free for 300,000 queries a month; past that it{" "}
                  <a href="https://nextdns.io/pricing">stops blocking without telling you</a>, and a TV plus a household can get there.
                </span>
              </div>
              <div>
                <strong>Pi-hole</strong>
                <span>
                  Runs on a Raspberry Pi or any always-on computer. <a href="https://docs.pi-hole.net/main/basic-install/">Install it</a>, then set
                  your router&rsquo;s DHCP DNS to its address.
                </span>
              </div>
              <div>
                <strong>AdGuard Home</strong>
                <span>
                  The same idea, <a href="https://github.com/AdguardTeam/AdGuardHome">as a script or Docker</a>. Use Adblock-format lists: its
                  plain-domain rules <a href="https://adguard-dns.io/kb/general/dns-filtering-syntax/">don&rsquo;t cover subdomains</a>.
                </span>
              </div>
            </div>
            <p>
              Then add <a href={HAGEZI}>HaGeZi&rsquo;s native tracker list</a> for your brand: <code>native.samsung</code>, <code>native.lgwebos</code>,{" "}
              <code>native.roku</code> or <code>native.amazon</code> for Fire TV. For Pi-hole and AdGuard Home the address is:
            </p>
            <pre className="pv-pre"><code>https://cdn.jsdelivr.net/gh/hagezi/dns-blocklists@latest/adblock/native.samsung.txt</code></pre>
            <p>
              Swap <code>native.samsung</code> for your brand&rsquo;s list. HaGeZi&rsquo;s standard lists (Light, Multi, Pro and up) already include all
              the native trackers. There is no native list for Hisense VIDAA, but the standard lists cover its tracking hosts too. HaGeZi warns they &ldquo;can occasionally limit functionality&rdquo;; the tables below show what not to block.
            </p>
            <div className="pv-callout">
              <strong>On NextDNS, &ldquo;Native Tracking Protection&rdquo; isn&rsquo;t enough for a TV.</strong> It covers eight vendors. Its Samsung entry is{" "}
              <a href="https://github.com/nextdns/native-tracking-domains/tree/main/domains">phone and Knox telemetry</a>, not the TV&rsquo;s ACR or ad
              servers, and there is no LG, Vizio or Hisense entry at all. Add a HaGeZi list from the Blocklists tab instead.
            </div>
            <p>
              Done? <a href="#check">Check your network</a> from your phone.
            </p>

            <details className="pv-details" id="domains">
              <summary>
                <span>Which domains to block, and which to keep</span>
                <span className="pv-chev" aria-hidden="true">▾</span>
              </summary>
              <p className="pv-small">
                From <a href={HAGEZI}>HaGeZi&rsquo;s lists</a>, the comments in <a href={PERFLYST}>Perflyst&rsquo;s SmartTV list</a> and the{" "}
                <a href={IMC}>IMC 2024 study</a>. Keep update domains open: an up-to-date TV is safer.
              </p>
              {DOMAINS.map((d) => (
                <div key={d.brand} className="pv-dom">
                  <h3>{d.brand}</h3>
                  <div className="pv-table">
                    <table>
                      <thead>
                        <tr>
                          <th scope="col">Domain</th>
                          <th scope="col">What it is</th>
                          <th scope="col">Block?</th>
                        </tr>
                      </thead>
                      <tbody>
                        {d.rows.map(([dom, what, verdict, note]) => (
                          <tr key={dom}>
                            <td>{dom.split(", ").map((x) => <code key={x}>{x}</code>)}</td>
                            <td>{what}</td>
                            <td>
                              <span className="pv-verdict" data-tone={TONE[verdict]}>{verdict}</span>
                              {note && <span className="pv-why-note">{note}</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {d.after && <p className="pv-small">{d.after}</p>}
                </div>
              ))}
            </details>

            <p>
              <strong>If the blocker sees nothing from the TV:</strong> some devices, notably Google&rsquo;s, ignore the DNS your router hands out
              and ask <code>8.8.8.8</code> directly. If your router can redirect DNS, that catches them.
            </p>
            <details className="pv-details">
              <summary>
                <span>Redirect hard-coded DNS at the router</span>
                <span className="pv-chev" aria-hidden="true">▾</span>
              </summary>
              <p>
                A firewall rule sends every outgoing request on port 53 to your own blocker, and port 853 (DNS over TLS) is blocked so it
                can&rsquo;t be used to go around the rule.
              </p>
              <ul className="pv-list">
                <li><a href="https://docs.netgate.com/pfsense/en/latest/recipes/dns-redirect.html">pfSense: DNS redirect</a></li>
                <li><a href="https://openwrt.org/docs/guide-user/firewall/fw3_configurations/intercept_dns">OpenWrt: intercept DNS</a></li>
                <li><a href="https://homenetworkguy.com/how-to/redirect-all-dns-requests-to-local-dns-resolver/">OPNsense (community guide)</a></li>
                <li><a href="https://forum.mikrotik.com/t/redirect-all-dns-requests-to-local-hosted-pi-hole/160801">MikroTik (forum)</a></li>
                <li>UniFi: CyberSecure › Content Filter intercepts DNS at the gateway.</li>
              </ul>
              <p className="pv-small">
                Most ISP routers can&rsquo;t do this; then set the router&rsquo;s DHCP DNS and accept that Google devices may go around it. Some
                devices show &ldquo;no internet&rdquo; once <code>8.8.8.8</code> is redirected. HaGeZi&rsquo;s <code>doh-vpn-proxy-bypass</code> list
                stops devices sidestepping the blocker over DNS-over-HTTPS or VPNs.
              </p>
            </details>
            <p className="pv2-undo">
              <strong>Undo:</strong> allow the blocked name from the blocker&rsquo;s query log, or turn the list off. Don&rsquo;t block update
              domains. <a href="#undo">Everything else you can undo</a>
            </p>
          </div>
        </details>

        <section id="check" className="pv2-section" aria-labelledby="check-h">
          <h2 id="check-h" className="pv2-h2">Is your home network blocking TV tracking?</h2>
          <NetCheck />
        </section>

        <div className="pv2-folds">
          <Fold id="undo" label="If something breaks: how to undo each step">
            <div className="pv-table">
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
                      <td data-label="You might lose">{lose}</td>
                      <td data-label="To undo">{undo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="pv-small">
              Two things not to do: don&rsquo;t decline the TV&rsquo;s required terms (most smart apps stop,{" "}
              <a href="https://www.consumerreports.org/televisions/samsung-roku-smart-tvs-vulnerable-to-hacking-consumer-reports-finds/">Consumer
              Reports found</a>), and don&rsquo;t block the update domains.
            </p>
          </Fold>

          <Fold id="why" label="Why this matters">
            <p>
              Most smart TVs can recognise what&rsquo;s on screen, including live TV and whatever comes in over HDMI, and report it back for
              advertising and measurement. It&rsquo;s called automatic content recognition, or ACR.
            </p>
            <ul className="pv-list">
              <li>
                A peer-reviewed study at <a href={IMC}>ACM IMC 2024</a> found ACR on Samsung and LG TVs works even when the TV is only a screen
                for an HDMI device. It also found that opting out stopped the traffic to ACR servers.
              </li>
              <li>
                In December 2025 Texas <a href="https://www.techspot.com/news/110630-texas-sues-five-smart-tv-makers-over-claims.html">sued five TV
                makers</a> over ACR, Samsung and LG among them. Samsung and LG have since agreed to ask Texans for consent. That covers Texas
                only; everywhere else, the settings are how you say no.
              </li>
              <li>
                In 2017 Vizio{" "}
                <a href="https://www.ftc.gov/news-events/news/press-releases/2017/02/vizio-pay-22-million-ftc-state-new-jersey-settle-charges-it-collected-viewing-histories-11-million">paid
                $2.2 million</a> to the FTC and New Jersey for collecting viewing data from about 11 million TVs without consent.
              </li>
            </ul>
            <p className="pv-small">
              This month a security researcher, <a href="https://x.com/log4j/status/2113014142600953868">@log4j</a>, reported further findings
              from a 2025 Samsung TV. Nobody has reproduced them yet, the full write-up isn&rsquo;t out, and Samsung hasn&rsquo;t responded (
              <a href="https://www.notebookcheck.net/No-mic-Samsung-TVs-may-hijack-your-soundbar-to-listen-in-researcher-claims.1433508.0.html">Notebookcheck</a>).
              We&rsquo;ll update this page when the report is published.
            </p>
            <p className="pv2-take">
              Privacy isn&rsquo;t about hiding; it&rsquo;s about deciding. You can still choose to share what you watch. These steps make it your
              choice, instead of the default you clicked past during setup.
            </p>
          </Fold>

          <Fold id="offline" label="The last resort: keep the TV offline">
            <p>
              A TV that never goes online can&rsquo;t send anything. Leave it off the network and plug in a separate streaming box. Apple TV is the
              usual pick: tvOS has no ACR, and Siri, location and analytics are opt-in at setup (
              <a href="https://9to5mac.com/2025/06/02/why-apple-tv-4k-is-the-only-privacy-friendly-tv-option/">9to5Mac</a>). On it, also turn off
              Settings › General › Privacy &amp; Security › Tracking › Allow Apps to Ask to Track.
            </p>
            <ul className="pv-list">
              <li>
                <strong>Google TV</strong> has a <a href="https://support.google.com/googletv/answer/10408998?hl=en">basic TV mode</a>: no account or
                internet, aerial, cable and HDMI still work. Going back needs a factory reset.
              </li>
              <li>
                <strong>Samsung</strong> lets you <a href="https://www.tomsguide.com/uk/how-to/set-up-2020-samsung-smart-tv">skip network setup</a>; you
                lose the apps and Smart Hub.
              </li>
              <li>
                <strong>Roku TVs</strong> need internet once to activate, then{" "}
                <a href="https://community.roku.com/t5/Discussions/Setup-Roku-TV-without-internet/m-p/975146">can run offline</a> on aerial and HDMI,
                according to Roku&rsquo;s community staff.
              </li>
            </ul>
            <p className="pv-small">
              An offline TV gets no security updates. That&rsquo;s fine while it stays offline; just don&rsquo;t connect it &ldquo;once&rdquo; years
              later.
            </p>
          </Fold>

          <OpenWithoutJs
            id="all"
            className="pv2-fold"
            summary={
              <summary>
                <span>Every TV, every step, on one page</span>
                <span className="pv-chev" aria-hidden="true">▾</span>
              </summary>
            }
          >
            <div className="pv2-foldbody">
              <p className="pv-small">☐ means untick or turn off, ☑ means tick or turn on. Where the menu moved over the years, every year&rsquo;s path is listed.</p>
              {BRANDS.map((b) => (
                <section key={b.id} id={`all-${b.id}`} className="pv2-allbrand" aria-label={b.name}>
                  <h3>{b.name}</h3>
                  <p className="pv-small">{b.intro}</p>
                  {b.findVersion && <p className="pv-small">{b.findVersion}</p>}
                  <StepList brand={b} year={null} />
                  {b.outro && <p className="pv-small">{b.outro}</p>}
                </section>
              ))}
            </div>
          </OpenWithoutJs>
        </div>

        <aside className="pv-final">
          <p className="pv-final-h">Have an Android TV or Google TV? CleanYourTV goes further.</p>
          <p>
            It switches off the tracking and ad apps themselves over Wi-Fi and swaps the ad-filled home screen for a clean one. No root, and
            one line puts it all back. <Link href="/tvs">Check your TV</Link> or <Link href="/#ch-03">set it up</Link>.
          </p>
          <p className="pv-small">We don&rsquo;t recommend rooting a TV to get rid of tracking: it can brick it.</p>
        </aside>

        <section className="pv-sources" aria-labelledby="sources">
          <h2 id="sources" className="pv-label">Sources</h2>
          <p className="pv-small">Each step&rsquo;s own sources are listed on its card.</p>
          <ul>
            {SOURCES.map(([label, url]) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noopener">{label}</a>
              </li>
            ))}
          </ul>
          <h3 className="pv-label">Model years</h3>
          <ul>
            {YEAR_SOURCES.map(([label, url]) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noopener">{label}</a>
              </li>
            ))}
          </ul>
          <p className="pv-small">
            Last checked {CHECKED}. Spotted a wrong menu path? <a href={`${GH}/issues/new?labels=tv-support`}>Open an issue</a>.
          </p>
        </section>
      </article>
    </main>
  );
}
