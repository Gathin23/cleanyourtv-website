import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import JsonLd from "@/components/JsonLd";
import PrivacyBrands from "@/components/PrivacyBrands";
import { GH } from "@/lib/parse";
import { SITE, breadcrumbs, pageMeta } from "@/lib/seo";

// For Samsung, LG, Roku, Vizio and other TVs CleanYourTV can't reach: the settings, the network and the DNS steps that stop
// most of the tracking without root. Facts come from cleanyourtv-launch/tv-privacy-research.md; nothing it marks unverified is here.

const title = "Stop your TV tracking you";
const description =
  "Turn off ACR and ad tracking on Samsung, LG, Roku, Vizio, Sony, TCL and Fire TV, then block what's left with DNS. No root, about 15 minutes, every step undoable.";
const CHECKED = "26 Oct 2026";

export const metadata = pageMeta("/privacy", `${title}, no root needed · CleanYourTV`, description);

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
const wrap: CSSProperties = { maxWidth: 800, margin: "0 auto", padding: "40px 20px 120px", fontSize: 19, lineHeight: 1.6 };
const kicker: CSSProperties = { margin: "0 0 20px", fontSize: 15, letterSpacing: 2, textTransform: "uppercase", color: "#9a9a9a" };
const h2: CSSProperties = { fontSize: 28, fontWeight: 400, margin: "56px 0 12px", letterSpacing: -0.2, lineHeight: 1.25 };
const p: CSSProperties = { margin: "0 0 16px" };
const green = { color: "#cfffcf", borderBottomColor: "rgba(207,255,207,.35)" };
const strong: CSSProperties = { fontWeight: 500, color: "#fff" };

const IMC = "https://arxiv.org/abs/2409.06203";
const HAGEZI = "https://github.com/hagezi/dns-blocklists";
const PERFLYST = "https://raw.githubusercontent.com/Perflyst/PiHoleBlocklist/master/SmartTV.txt";

function Step({ n, id, children }: { n: number; id: string; children: ReactNode }) {
  return (
    <h2 id={id} style={h2}>
      <span className="pv-stepno">Step {n}</span>
      {children}
    </h2>
  );
}

type Row = [domains: string, what: string, verdict: "Block" | "Keep" | "Optional" | "Don't block", note: ReactNode];

// Block-or-keep per brand: HaGeZi's native lists, Perflyst's SmartTV.txt comments and the IMC 2024 paper.
const DOMAINS: { brand: string; rows: Row[]; after?: ReactNode }[] = [
  {
    brand: "Samsung",
    rows: [
      ["acr-us-prd.samsungcloud.tv, acr-eu-prd.samsungcloud.tv", "ACR fingerprints", "Block", "The most traffic during live TV and HDMI."],
      ["samsungacr.com", "ACR logging and config", "Block", "Covers log-ingestion and log-config."],
      ["acr0.samsungcloudsolution.com", "ACR keep-alive", "Block", "HaGeZi blocks it; Perflyst leaves it open."],
      ["samsungads.com, samsungtvads.com", "Samsung Ads", "Block", ""],
      ["lcprd1.samsungcloudsolution.net", "Logging", "Optional", "One user had to allow it again when app downloads failed; another saw no problem."],
      ["samsungcloudsolution.com", "The whole domain: many services", "Don't block", "Blocking it all breaks the TV's internet connection."],
      ["time.samsungcloudsolution.com", "Clock", "Keep", "Without it Plex, YouTube and Prime Video stop working."],
      ["otnprd8–11.samsungcloudsolution.net, samsungotn.net", "Firmware updates", "Keep", "Security updates come through here."],
      ["osb-ussvc.samsungqbe.com", "Samsung TV Plus", "Keep", "If you watch TV Plus."],
      ["auth.samsungosp.com", "Samsung account", "Keep", "Sign-in fails without it."],
    ],
  },
  {
    brand: "LG",
    rows: [
      ["lgsmartad.com, lgads.tv, ad.lgappstv.com", "LG ads", "Block", ""],
      ["alphonso.tv", "ACR (LG Ad Solutions)", "Block", "The IMC 2024 study saw LG's ACR traffic go here."],
      ["us.lgtvsdp.com", "Clock and services", "Keep", "If it is blocked, the clock resets to 2019 after a reboot and Plex, HBO Max and YouTube fail."],
      ["lgtvsdp.com, lgappstv.com", "Content Store", "Keep", "Only ad.lgappstv.com goes."],
      ["ngfts.lge.com", "Store pictures, AI features", "Keep", ""],
      ["snu.lge.com, su.lge.com, nsu.lge.com", "Software updates", "Keep", ""],
    ],
  },
  {
    brand: "Roku",
    rows: [
      ["logs.roku.com and its subdomains", "Logging", "Block", "One Pi-hole user's live TV guide went blank; allow it again if yours does."],
      ["ads.roku.com, ravm.tv", "Roku ads", "Block", ""],
      ["acr.roku.com, cloudservices.roku.com", "ACR and cloud services", "Block", "Both are in HaGeZi's Roku list."],
    ],
    after: <>Don&rsquo;t block everything with &ldquo;roku&rdquo; in it: a broad rule like that broke one user&rsquo;s Roku completely.</>,
  },
  {
    brand: "Vizio",
    rows: [
      ["tvinteractive.tv", "Inscape ACR", "Block", "control, control2, mcp and tvmeta-dynamic."],
      ["alphonso.tv", "ACR", "Block", ""],
      ["api.vizio.com, images.vizio.com", "Smart features", "Keep", "Perflyst: required for the smart TV features."],
    ],
    after: <>HaGeZi has no Vizio list, so add these by hand.</>,
  },
];

const TONE: Record<Row[2], string> = { Block: "block", Keep: "keep", Optional: "maybe", "Don't block": "keep" };

const UNDO: [string, string, string][] = [
  ["ACR off", "Less personal “recommended for you” rows; Roku drops More Ways to Watch", "Tick the same setting again"],
  ["Ad tracking off, ad ID reset or deleted", "Nothing; ads stay, just untargeted", "Turn it back on"],
  ["Voice wake word or mic switch off", "No voice search or assistant", "Switch it back on"],
  ["Optional agreements declined", "Small extras, like LG's AI recommendations", "Accept them again in User Agreements or Privacy Choices"],
  ["Guest network", "Casting from a phone on your main Wi-Fi", "Move the TV back to your main Wi-Fi"],
  ["DNS blocklist", "Usually nothing; too broad a list can break the app store, guide data or the clock", "Allow the blocked name from the query log, or turn the list off"],
];

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
];

export default function Privacy() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE}/privacy`,
        url: `${SITE}/privacy`,
        name: title,
        description,
        dateModified: "2026-10-26",
        isPartOf: { "@id": `${SITE}/#website` },
      },
      breadcrumbs(["Stop your TV tracking you", "/privacy"]),
    ],
  };
  return (
    <main className="page-main" style={page}>
      <JsonLd data={jsonLd} />
      <article style={wrap} className="pv">
        <p style={kicker}>
          <Link href="/" className="home-link" style={green}>cleanyour.tv</Link> &nbsp;·&nbsp; Privacy
        </p>
        <h1 style={{ fontSize: 44, lineHeight: 1.1, fontWeight: 400, margin: "0 0 14px", letterSpacing: -0.5 }}>{title}</h1>
        <p style={{ ...p, fontSize: 20, color: "#bdbdbd" }}>
          For Samsung, LG, Roku, Vizio and any other smart TV. <strong style={strong}>No root</strong>, nothing that can break the TV,
          about 15 minutes, and every step can be undone.
        </p>
        <ol className="pv-toc" aria-label="On this page">
          <li><a href="#settings">Turn off the tracking settings</a></li>
          <li><a href="#network">Give the TV its own network</a></li>
          <li><a href="#dns">Block what&rsquo;s left with DNS</a></li>
        </ol>

        <section className="pv-why" aria-labelledby="why">
          <h2 id="why" className="pv-label">What&rsquo;s going on</h2>
          <p style={p}>
            Most smart TVs can recognise what&rsquo;s on screen, including live TV and whatever comes in over HDMI, and report it back for advertising and measurement.
            It&rsquo;s called <strong style={strong}>automatic content recognition</strong>, or ACR.
          </p>
          <ul>
            <li>
              A peer-reviewed study at <a href={IMC}>ACM IMC 2024</a> found ACR on Samsung and LG TVs works even when the TV is only a
              screen for an HDMI device. It also found that opting out stopped the traffic to ACR servers.
            </li>
            <li>
              In December 2025 Texas <a href="https://www.techspot.com/news/110630-texas-sues-five-smart-tv-makers-over-claims.html">sued
              five TV makers</a> over ACR, Samsung and LG among them. Samsung and LG have since agreed to ask Texans for consent. That covers
              Texas only; everywhere else, the settings below are how you say no.
            </li>
            <li>
              In 2017 Vizio <a href="https://www.ftc.gov/news-events/news/press-releases/2017/02/vizio-pay-22-million-ftc-state-new-jersey-settle-charges-it-collected-viewing-histories-11-million">paid
              $2.2 million</a> to the FTC and New Jersey for collecting viewing data from about 11 million TVs without consent.
            </li>
          </ul>
          <p style={{ ...p, margin: 0, fontSize: 17, color: "#9a9a9a" }}>
            This month a security researcher, <a href="https://x.com/log4j/status/2113014142600953868">@log4j</a>, reported further
            findings from a 2025 Samsung TV. Nobody has reproduced them yet, the full write-up isn&rsquo;t out, and Samsung hasn&rsquo;t
            responded (<a href="https://www.notebookcheck.net/No-mic-Samsung-TVs-may-hijack-your-soundbar-to-listen-in-researcher-claims.1433508.0.html">Notebookcheck</a>).
            We&rsquo;ll update this page when the report is published.
          </p>
        </section>

        <Step n={1} id="settings">Turn off the tracking settings</Step>
        <p style={p}>
          This does the most. Consumer Reports puts it plainly: <a href="https://www.consumerreports.org/electronics/privacy/how-to-turn-off-smart-tv-snooping-features-a4840102036/">&ldquo;you
          can&rsquo;t stop all the data collection, but you can reduce the snooping&rdquo;</a>. The Markup counted between 10 and 37 clicks
          to opt out, so here are the paths. Pick your TV:
        </p>
        <PrivacyBrands />
        <p className="pv-small">
          Menus move with firmware updates, so the names on your TV may differ slightly. Spotted a wrong path?{" "}
          <a href={`${GH}/issues/new`}>Open an issue</a>.
        </p>

        <Step n={2} id="network">Give the TV its own network</Step>
        <p style={p}>
          Put the TV on your router&rsquo;s <strong style={strong}>guest network</strong>, or an IoT network if it has one. The NSA&rsquo;s
          home-network advice is to keep guests on <a href="https://media.defense.gov/2023/Feb/22/2003165170/-1/-1/0/CSI_BEST_PRACTICS_FOR_SECURING_YOUR_HOME_NETWORK.PDF">a
          separate network from your more trusted devices</a>, and a TV fits that well: it doesn&rsquo;t need to see your laptop or phone.
          Researchers at Gamers Nexus <a href="https://cyberinsider.com/lg-smart-tvs-found-scanning-home-networks-for-nearby-devices/">found
          an LG TV listing 38 devices</a> on one home network (LG says device discovery is a standard function).
        </p>
        <ol className="pv-list">
          <li>Turn on the guest network in your router&rsquo;s app or admin page.</li>
          <li>On the TV, forget your main Wi-Fi and join the guest one. If it&rsquo;s wired, use Wi-Fi instead, or a port your router assigns to guests.</li>
        </ol>
        <p className="pv-small">
          The catch: casting from a phone on your main Wi-Fi stops working across the two networks, unless your router can pass mDNS
          between them. Join your phone to the guest network to cast, or move the TV back.
        </p>

        <Step n={3} id="dns">Block what&rsquo;s left with DNS</Step>
        <p style={p}>
          Settings cover what the TV maker lets you switch off. A DNS blocker goes further: the TV can&rsquo;t find the tracking servers at all. In 2019, Princeton
          researchers found <a href="https://blog.citp.princeton.edu/2019/09/18/watching-you-watch-the-tracking-ecosystem-of-over-the-top-tv-streaming-devices">Roku&rsquo;s
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
              Runs on a Raspberry Pi or any always-on computer. <a href="https://docs.pi-hole.net/main/basic-install/">Install it</a>, then
              set your router&rsquo;s DHCP DNS to its address.
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
        <p style={p}>
          Then add <a href={HAGEZI}>HaGeZi&rsquo;s native tracker list</a> for your brand: <code>native.samsung</code>,{" "}
          <code>native.lgwebos</code>, <code>native.roku</code> or <code>native.amazon</code> for Fire TV. For Pi-hole and AdGuard Home the
          address is:
        </p>
        <pre className="pv-pre"><code>https://cdn.jsdelivr.net/gh/hagezi/dns-blocklists@latest/adblock/native.samsung.txt</code></pre>
        <p style={p}>
          Swap <code>native.samsung</code> for your brand&rsquo;s list. HaGeZi&rsquo;s standard lists (Light, Multi, Pro and up) already
          include all the native trackers, so if you use one of those, you&rsquo;re covered. HaGeZi warns they &ldquo;can occasionally
          limit functionality&rdquo;; the table below shows what not to block.
        </p>
        <div className="pv-callout">
          <strong>On NextDNS, &ldquo;Native Tracking Protection&rdquo; isn&rsquo;t enough for a TV.</strong> It covers eight vendors. Its
          Samsung entry is <a href="https://github.com/nextdns/native-tracking-domains/tree/main/domains">phone and Knox telemetry</a>,
          not the TV&rsquo;s ACR or ad servers, and there is no LG or Vizio entry at all. Add a HaGeZi list from the Blocklists tab instead.
        </div>

        <details className="pv-details">
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

        <p style={p}>
          <strong style={strong}>If the blocker sees nothing from the TV:</strong> some devices, notably Google&rsquo;s, ignore the DNS your
          router hands out and ask <code>8.8.8.8</code> directly. If your router can redirect DNS, that catches them.
        </p>
        <details className="pv-details">
          <summary>
            <span>Advanced: redirect hard-coded DNS at the router</span>
            <span className="pv-chev" aria-hidden="true">▾</span>
          </summary>
          <p style={p}>
            The idea: a firewall rule sends every outgoing request on port 53 to your own blocker, and port 853 (DNS over TLS) is
            blocked so it can&rsquo;t be used to go around the rule.
          </p>
          <ul className="pv-list">
            <li><a href="https://docs.netgate.com/pfsense/en/latest/recipes/dns-redirect.html">pfSense: DNS redirect</a></li>
            <li><a href="https://openwrt.org/docs/guide-user/firewall/fw3_configurations/intercept_dns">OpenWrt: intercept DNS</a></li>
            <li><a href="https://homenetworkguy.com/how-to/redirect-all-dns-requests-to-local-dns-resolver/">OPNsense (community guide)</a></li>
            <li><a href="https://forum.mikrotik.com/t/redirect-all-dns-requests-to-local-hosted-pi-hole/160801">MikroTik (forum)</a></li>
            <li>UniFi: CyberSecure › Content Filter intercepts DNS at the gateway.</li>
          </ul>
          <p className="pv-small">
            Most ISP routers can&rsquo;t do this; then set the router&rsquo;s DHCP DNS and accept that Google devices may go around it.
            Some devices show &ldquo;no internet&rdquo; once <code>8.8.8.8</code> is redirected. HaGeZi&rsquo;s{" "}
            <code>doh-vpn-proxy-bypass</code> list stops devices sidestepping the blocker over DNS-over-HTTPS or VPNs.
          </p>
        </details>

        <h2 id="undo" style={h2}>If something breaks</h2>
        <p style={p}>Every step goes back the way it came:</p>
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
          Two things not to do: don&rsquo;t decline the TV&rsquo;s required terms (most smart apps stop, <a href="https://www.consumerreports.org/televisions/samsung-roku-smart-tvs-vulnerable-to-hacking-consumer-reports-finds/">Consumer
          Reports found</a>), and don&rsquo;t block the update domains.
        </p>

        <h2 id="offline" style={h2}>The last resort: keep the TV offline</h2>
        <p style={p}>
          A TV that never goes online can&rsquo;t send anything. Leave it off the network and plug in a separate streaming box. Apple TV is the
          usual pick: tvOS has no ACR, and Siri, location and analytics are opt-in at setup (<a href="https://9to5mac.com/2025/06/02/why-apple-tv-4k-is-the-only-privacy-friendly-tv-option/">9to5Mac</a>).
          On it, also turn off Settings › General › Privacy &amp; Security › Tracking › Allow Apps to Ask to Track.
        </p>
        <ul className="pv-list">
          <li>
            <strong style={strong}>Google TV</strong> has a <a href="https://support.google.com/googletv/answer/10408998?hl=en">basic TV mode</a>:
            no account or internet, aerial, cable and HDMI still work. Going back needs a factory reset.
          </li>
          <li>
            <strong style={strong}>Samsung</strong> lets you <a href="https://www.tomsguide.com/uk/how-to/set-up-2020-samsung-smart-tv">skip
            network setup</a>; you lose the apps and Smart Hub.
          </li>
          <li>
            <strong style={strong}>Roku TVs</strong> need internet once to activate, then <a href="https://community.roku.com/t5/Discussions/Setup-Roku-TV-without-internet/m-p/975146">can
            run offline</a> on aerial and HDMI, according to Roku&rsquo;s community staff.
          </li>
        </ul>
        <p className="pv-small">
          An offline TV gets no security updates. That&rsquo;s fine while it stays offline; just don&rsquo;t connect it &ldquo;once&rdquo; years
          later.
        </p>

        <aside className="pv-final">
          <p className="pv-final-h">Have an Android TV or Google TV? CleanYourTV goes further.</p>
          <p>
            It switches off the tracking and ad apps themselves over Wi-Fi and swaps the ad-filled home screen for a clean one. No root,
            and one line puts it all back. <Link href="/tvs">Check your TV</Link> or <Link href="/#ch-03">set it up</Link>.
          </p>
          <p className="pv-small">We don&rsquo;t recommend rooting a TV to get rid of tracking: it can brick it.</p>
        </aside>

        <section className="pv-sources" aria-labelledby="sources">
          <h2 id="sources" className="pv-label">Sources</h2>
          <p className="pv-small">Each brand&rsquo;s own sources are listed under its settings above.</p>
          <ul>
            {SOURCES.map(([label, url]) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noopener">{label}</a>
              </li>
            ))}
          </ul>
          <p className="pv-small">
            Last checked {CHECKED}. Spotted a wrong menu path? <a href={`${GH}/issues/new`}>Open an issue</a>.
          </p>
        </section>
      </article>
    </main>
  );
}
