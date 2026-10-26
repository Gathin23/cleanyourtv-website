"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

// /privacy step 1: where each brand keeps its tracking switches. Every path is from the source linked under it
// (the research notes are in cleanyourtv-launch/tv-privacy-research.md); paths nobody could confirm are left out.

type Brand = {
  id: string;
  name: string;
  acr: ReactNode;
  paths: [string, string, ReactNode?][];
  more: [string, ReactNode][];
  breaks: ReactNode;
  sources: [string, string][];
};

/** "Settings > General > Live Plus" as menu steps. */
function Path({ p }: { p: string }) {
  const steps = p.split(" > ");
  return (
    <span className="pv-path">
      {steps.map((s, i) => (
        <span key={i}>
          {i > 0 && <span className="pv-sep" aria-hidden="true"> › </span>}
          {i > 0 && <span className="sr-only">, then </span>}
          <span className="pv-step">{s}</span>
        </span>
      ))}
    </span>
  );
}

const CR = "https://www.consumerreports.org/electronics/privacy/how-to-turn-off-smart-tv-snooping-features-a4840102036/";
const CR21 = "https://www.yahoo.com/news/turn-off-smart-tv-snooping-110157618.html";
const MARKUP = "https://themarkup.org/privacy/2023/12/12/your-smart-tv-knows-what-youre-watching";
const IMC = "https://arxiv.org/abs/2409.06203";
const NAI = "https://thenai.org/opt-out/connected-tv-choices/";

const BRANDS: Brand[] = [
  {
    id: "samsung",
    name: "Samsung",
    acr: (
      <>
        ACR is called <strong>Viewing Information Services</strong>. Samsung says it only runs if you agreed to it, and you probably did,
        on the &ldquo;Agree to all&rdquo; screen during setup.
      </>
    ),
    paths: [
      ["2025", "Settings > All Settings > General & Privacy > Terms & Privacy", <>Untick Viewing Information Services. Some earlier models say &ldquo;Terms and Policy&rdquo;.</>],
      ["2022–2024", "Settings > All Settings > General & Privacy > Terms & Privacy > Privacy Choices > Terms & Conditions, Privacy Policy", <>Opt out of Viewing Information Services and the Interest-Based Advertisements Service Privacy Notice.</>],
      ["2019–2020", "Settings > Support > Terms & Privacy > Privacy Choices > Viewing Information Services"],
      ["Before 2019", "Smart Hub > Settings > Support > Terms & Policy > SyncPlus and Marketing"],
      ["Any year", "Home > Privacy Choices", <>An app in the home screen&rsquo;s side bar that opens the same agreements.</>],
    ],
    more: [
      [
        "Everything else on that screen",
        <>
          Untick Interest-Based Advertisements, Customization Service, Improve personalized ads and Get news and special offers, and turn
          on Do not track. This is the full set the <a href={IMC}>IMC 2024 study</a> switched off before the TVs stopped contacting ACR servers.
        </>,
      ],
      ["Ad ID", <>Settings › All Settings › General &amp; Privacy › Terms &amp; Privacy › Reset PSID gives the TV a new ad ID. On its own it does not turn off personalised ads.</>],
      [
        "Voice",
        <>
          Turn off Bixby&rsquo;s wake word: Settings › All Settings › Advanced Features › Voice › Bixby Settings › Voice Wake-Up (on sets
          before 2025, the same path under General &amp; Privacy). Bixby itself can&rsquo;t be turned off, only its wake-up.
        </>,
      ],
      [
        "Mic switch",
        <>
          Some models have a microphone switch on the lower edge of the TV, in the middle or towards the right. Off means no voice
          commands. The remote&rsquo;s mic only listens while you hold its button.
        </>,
      ],
      ["Pet Care", <>The barking sensor on Q8F and above uses the TV&rsquo;s mic while the TV is off. It is switched on from the SmartThings app, so leave it off unless you want it.</>],
    ],
    breaks: (
      <>
        Recommendations get less personal and voice control stops if you turn the mic off. Apps and HDMI work as before. Some owners
        report ad settings switching back after a firmware update, so look again after one.
      </>
    ),
    sources: [
      ["Consumer Reports, Oct 2025", CR],
      ["Samsung: ACR", "https://www.samsung.com/us/support/answer/ANS10010616/"],
      ["SamMobile, Feb 2025", "https://www.sammobile.com/news/samsung-tvs-displaying-repeated-privacy-pop-ups/"],
      ["Consumer Reports, 2021", CR21],
      ["Samsung: mic switch", "https://www.samsung.com/ca/support/tv-audio-video/how-to-enable-or-disable-the-microphone-switch-on-samsung-smart-tvs"],
      ["Samsung: Bixby", "https://www.samsung.com/hk_en/support/tv-audio-video/how-to-set-up-and-use-bixby-on-your-samsung-smart-tv/"],
      ["Samsung: Pet Care", "https://www.samsung.com/us/tvs/smart-tv/smart-home/"],
    ],
  },
  {
    id: "lg",
    name: "LG",
    acr: (
      <>
        ACR is called <strong>Live Plus</strong>, and it is also covered by the <strong>Viewing Information</strong> agreement. LG says
        it is off by default and works by audio fingerprinting; Pocket-lint reports it on by default, so check either way.
      </>
    ),
    paths: [
      ["2026", "Hold the Settings button > System > Additional settings > Live Plus"],
      ["2025 (webOS 25)", "All Settings > Support > Privacy & Terms > User Agreements", <>Opt out of Viewing Information.</>],
      ["2021–2024 (webOS 6 to 24)", "All Settings > General > System > Additional Settings > Live Plus"],
      ["2020 (webOS 5)", "Settings > General > Additional Settings > Live Plus"],
    ],
    more: [
      [
        "User Agreements",
        <>
          Settings › Privacy &amp; Terms › User Agreements (older sets: All Settings › Support › Privacy &amp; Terms). Only the Terms of
          Use and Privacy Policy are required. Untick Viewing information, Voice information, Interest-based &amp; Cross-device
          advertising and Who.Where.What?, and turn Do Not Sell My Personal Information on.
        </>,
      ],
      ["Ad tracking", <>All Settings › General › System › Additional Settings › Advertisement: turn Limit AD Tracking on.</>],
      ["Home screen", <>Additional Settings › Home Settings: untick Home Promotion and Content Recommendation. On 2026 sets also turn off Screen Saver Promotion, and under General › AI Service › LG AI Settings turn off AI Recommendations.</>],
      [
        "Mic",
        <>
          Voice recognition is off by default. Leave Hands-free Voice (&ldquo;Hi LG&rdquo;) off, because with it on the TV listens for the
          wake word in standby. Some models have a hardware mic switch. The Magic Remote&rsquo;s mic only listens while you hold its button.
        </>,
      ],
    ],
    breaks: <>Recommendations get less targeted and voice control stops if you decline Voice information. Apps keep working; every optional agreement can be accepted again in User Agreements.</>,
    sources: [
      ["Consumer Reports, Oct 2025", CR],
      ["LG statement, Sep 2026", "https://www.lg.com/global/newsroom/news/statements/statement-understanding-privacy-on-lg-smart-tvs/"],
      ["LG: User Agreements", "https://www.lg.com/us/support/help-library/how-to-accept-the-updated-user-agreements-on-your-lg-tv--20155426555618"],
      ["The Markup", MARKUP],
      ["XDA, Aug 2026", "https://www.xda-developers.com/hidden-lg-tv-settings-i-changed-immediately-to-make-my-new-tv-look-even-better/"],
      ["Pocket-lint", "https://www.pocket-lint.com/lg-tv-turn-off-live-plus/"],
      ["Consumer Reports, 2021", CR21],
    ],
  },
  {
    id: "roku",
    name: "Roku",
    acr: (
      <>
        ACR is called <strong>Automatic Content Recognition (ACR)</strong>; older guides call it <strong>Use info from TV inputs</strong>.
        It is only on Roku TVs (including TCL Roku TVs), not on Roku sticks.
      </>
    ),
    paths: [
      ["Roku TVs", "Home > Settings > Privacy > Smart TV Experience", <>Untick Automatic Content Recognition (ACR).</>],
      ["On the web", "my.roku.com > Privacy Settings > Smart TV Experience"],
    ],
    more: [
      ["Ads", <>Settings › Privacy › Advertising: untick Personalize ads (on older software it was Limit ad tracking). Resetting the advertising ID on its own does not opt you out.</>],
      ["Mic", <>Settings › Privacy › Microphone lets you take mic access away from each channel, or block it for all. The Voice Remote Pro has a switch for hands-free &ldquo;Hey Roku&rdquo;; push-to-talk still works with it off.</>],
    ],
    breaks: <>With ACR off you lose the &ldquo;More Ways to Watch&rdquo; suggestions from live TV. Tick the box again to undo.</>,
    sources: [
      ["Roku support", "https://support.roku.com/article/115005739288"],
      ["NAI", NAI],
      ["Roku: Voice Remote Pro", "https://support.roku.com/en-ca/article/learn-about-voice-remote-pro"],
      ["Roku: microphone", "https://developer.roku.com/dev/docs/romicrophone"],
      ["The Markup", MARKUP],
    ],
  },
  {
    id: "vizio",
    name: "Vizio",
    acr: <>ACR is called <strong>Viewing Data</strong> (before 2017, &ldquo;Smart Interactivity&rdquo;).</>,
    paths: [
      ["Current", "All Settings > Privacy & Legal > Viewing Data"],
      ["Older", "All Settings > Admin & Privacy > Viewing Data"],
      ["Before 2020", "System > Reset & Admin > Viewing Data"],
    ],
    more: [
      ["Ads", <>Menu › Privacy &amp; Legal › Advertising: turn Limited Ad Tracking on and use Reset TV Advertiser ID (before 2024 under Admin &amp; Privacy; before 2020, System › Reset &amp; Admin › Advertising). Ads still show.</>],
      ["Walmart", <>Walmart owns Vizio now. The Viewing Data page lets you choose whether Walmart may link your viewing to your Walmart account: say no. Some new Vizio OS TVs need a Walmart account for smart features, but not for basic TV.</>],
    ],
    breaks: <>Recommendations may get less personal. Turn Viewing Data back on in the same menu to undo.</>,
    sources: [
      ["Vizio: Viewing Data", "https://vizio.com/en/terms/privacy-policy/viewing-data-privacy-policy"],
      ["Vizio: ads FAQ", "https://vizio.com/en/terms/privacy-policy/ads-and-privacy-faq"],
      ["TechSpot, 2026", "https://www.techspot.com/news/111850-vizio-smart-tvs-now-require-walmart-accounts-smart.html"],
      ["FTC, 2017", "https://www.ftc.gov/business-guidance/blog/2017/02/what-vizio-was-doing-behind-tv-screen"],
    ],
  },
  {
    id: "firetv",
    name: "Fire TV",
    acr: (
      <>
        Fire TV smart TVs call it <strong>Over-the-air Viewing Data</strong>. Fire TV sticks and TVs also share app and device usage.{" "}
        <Link href="/tvs">CleanYourTV&rsquo;s cleanup works on Fire TV</Link> too.
      </>
    ),
    paths: [["All Fire TV", "Settings > Preferences > Privacy Settings", <>Turn off Device Usage Data, Collect App Usage Data and Interest-based Ads, and on Fire TV smart TVs, Over-the-air Viewing Data.</>]],
    more: [],
    breaks: <>Ads become less targeted. Turn each one back on in the same menu.</>,
    sources: [
      ["Amazon help", "https://digprjsurvey.amazon.com/csad/help/node/GQFYXZHZB2H629WN"],
      ["NAI", NAI],
    ],
  },
  {
    id: "google",
    name: "Google TV, Sony, TCL",
    acr: (
      <>
        On Google TV the switches are about ads; Sony and TCL add their own data settings on top. These TVs run Android TV or Google TV, so{" "}
        <Link href="/tvs">CleanYourTV works on them</Link> and goes further than the settings below.
      </>
    ),
    paths: [
      ["Google TV", "Settings > Privacy > Ads", <>Choose Delete advertising ID (stronger than a reset) or Opt out of Ads Personalization.</>],
      ["Older Android TV", "Settings > About > Legal Information > Ads"],
      ["Sony Bravia", "Settings > All Settings > Privacy", <>ACR here is <strong>Samba Interactive TV</strong>: turn it off. Older sets keep it under System or Device Preferences.</>],
      ["TCL Google TV", "Settings > Privacy > User Agreements", <>Withdraw the optional agreements, and opt out of the User Experience Improvement Program.</>],
    ],
    more: [["Sony's own options", <>Smart TV Features, Program Recommendations, Product Improvements and Share TV Data are off by default, per Consumer Reports. Worth a look in case setup turned them on.</>]],
    breaks: <>Ads stay, just untargeted. You can&rsquo;t decline Google&rsquo;s own terms and keep the smart features, so leave those.</>,
    sources: [
      ["Consumer Reports, Oct 2025", CR],
      ["NAI", NAI],
      ["Google: ads", "https://policies.google.com/technologies/ads?hl=en"],
    ],
  },
];

/** Brand buttons over one panel each. Without JS every panel shows and the buttons are jump links; #tv-lg opens LG directly. */
export default function PrivacyBrands() {
  const [brand, setBrand] = useState<string | null>(null);
  useEffect(() => {
    const read = () => {
      const h = location.hash.replace(/^#tv-/, "");
      setBrand(BRANDS.some((b) => b.id === h) ? h : (cur) => cur || BRANDS[0].id);
    };
    read();
    addEventListener("hashchange", read);
    return () => removeEventListener("hashchange", read);
  }, []);
  const pick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setBrand(id);
    try { history.replaceState(null, "", `#tv-${id}`); } catch { /* ignore */ }
  };
  return (
    <>
      <nav className="pv-tabs" aria-label="Pick your TV brand">
        {BRANDS.map((b) => (
          <a key={b.id} href={`#tv-${b.id}`} className="pv-tab" aria-current={brand === b.id ? "true" : undefined} onClick={pick(b.id)}>
            {b.name}
          </a>
        ))}
      </nav>
      {BRANDS.map((b) => (
        <section key={b.id} id={`tv-${b.id}`} className="pv-brand" hidden={!!brand && brand !== b.id} aria-label={b.name}>
          <h3>{b.name}</h3>
          <p className="pv-acr">{b.acr}</p>
          <h4>Turn it off</h4>
          <dl className="pv-paths">
            {b.paths.map(([when, path, note]) => (
              <div key={when}>
                <dt>{when}</dt>
                <dd>
                  <Path p={path} />
                  {note && <span className="pv-note">{note}</span>}
                </dd>
              </div>
            ))}
          </dl>
          {b.more.length > 0 && (
            <>
              <h4>While you&rsquo;re there</h4>
              <ul className="pv-more">
                {b.more.map(([t, body]) => (
                  <li key={t}>
                    <strong>{t}.</strong> {body}
                  </li>
                ))}
              </ul>
            </>
          )}
          <p className="pv-breaks">
            <strong>What changes:</strong> {b.breaks}
          </p>
          <p className="pv-src">
            Sources:{" "}
            {b.sources.map(([label, url], i) => (
              <span key={url}>
                {i > 0 && " · "}
                <a href={url} target="_blank" rel="noopener">{label}</a>
              </span>
            ))}
          </p>
        </section>
      ))}
    </>
  );
}
