import Link from "next/link";
import type { ReactNode } from "react";
import { PRESS, PRESS_LOGO_W, cdn } from "@/lib/site";
import { COVERAGE_COUNTRIES, COVERAGE_TOTAL } from "@/lib/press";
import JsonLd from "@/components/JsonLd";
import { PERSON, SITE, breadcrumbs, pageMeta } from "@/lib/seo";
import "../../prose.css";

const title = "(Re)introducing CleanYourTV";
const published = "2026-10-20T03:00:00+05:30";
const cover = { url: "/blog/cover.png", width: 1600, height: 900, alt: "CleanYourTV: your TV, minus the ads" };

// The description keeps the numbers as they were on the day it was written.
export const metadata = pageMeta(
  "/blog/reintroducing-cleanyourtv",
  title,
  "Three days ago I fixed my parents' TV with a prompt. Then the internet fixed theirs: 66 TVs, 25 brands, 14 languages, one 300 KB launcher, nothing uninstalled.",
  { image: cover, article: { publishedTime: published } },
);


const B = ({ children }: { children: ReactNode }) => <strong>{children}</strong>;
const A = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href}>{children}</a>
);
const X = ({ h }: { h: string }) => <A href={`https://x.com/${h}`}>@{h}</A>;

export default function Article() {
  const url = `${SITE}/blog/reintroducing-cleanyourtv`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": url,
        headline: title,
        description: metadata.description,
        datePublished: published,
        dateModified: published,
        author: PERSON,
        publisher: { "@id": PERSON["@id"] },
        image: SITE + cover.url,
        url,
        mainEntityOfPage: url,
        isPartOf: { "@id": `${SITE}/#website` },
        about: { "@id": `${SITE}/#app` },
        inLanguage: "en",
      },
      breadcrumbs([title, "/blog/reintroducing-cleanyourtv"]),
    ],
  };
  return (
    <main>
      <JsonLd data={jsonLd} />
      <article className="prose">
        <p className="prose-kicker">
          <Link href="/">CleanYourTV</Link>&nbsp;· Blog · 20 October 2026 ·&nbsp;<X h="gathint" />
        </p>
        <h1>(Re)introducing CleanYourTV</h1>
        <p className="prose-sub">Three days ago I fixed my parents&rsquo; TV. Then the internet fixed theirs.</p>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cdn("/blog/cover.png")} alt="CleanYourTV. Your TV, minus the ads." className="prose-img" width={1600} height={900} />

        <p className="prose-box">
          <B>TL;DR:</B> A prompt that debloats any Android TV or Google TV over Wi-Fi and gives it an Apple TV-style home. No root, nothing uninstalled, one line undoes it. One tweet, three days, and it now has a name and a site: <A href="https://cleanyour.tv"><B>cleanyour.tv</B></A>. Skip to &ldquo;Try it&rdquo; at the bottom if you just want your TV back.
        </p>

        <h2>Three days, in numbers</h2>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cdn("/blog/stats.png")} alt="X: 4.8M views, 26.5K likes, 1.4K reposts, 660 comments. GitHub: 3,494 stars, 412 forks, 118 PRs, 36 contributors, as of 19 October" className="prose-img" width={1600} height={900} />
        <p>
          That card is from Monday night and already behind. The ones that did not fit on it: tested lists for 66 TV models across 25 brands, two of them projectors. Fourteen languages. 45,000 repo visitors. 61 screens people sent. Fifteen launchers and add-ons built on top. One launcher, 300 KB. Zero things uninstalled from anyone&rsquo;s TV.
        </p>

        <h2>Featured in</h2>
        <div className="prose-logos">
          {PRESS.map(([slug, name, url]) => (
            <a key={slug} href={url} title={name}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cdn(`/press/${slug}.png`)} alt={name} width={Math.round((PRESS_LOGO_W[slug] ?? 88) * 34 / 88)} height={34} />
            </a>
          ))}
        </div>
        <p>
          <A href="/press">And {COVERAGE_TOTAL - PRESS.length} more: all {COVERAGE_TOTAL} articles from {COVERAGE_COUNTRIES} countries &rarr;</A>
        </p>

        <h2>How it started</h2>
        <p>My parents&rsquo; TV showed an ad before you could reach Netflix. A full-screen one, for a bank, on a TV they had paid for. So on Saturday afternoon I sat down with Claude Code and gave it the model number.</p>
        <p>It found the TV on the Wi-Fi, listed everything running on it, and we went through the list together. Twenty-five Xiaomi packages later the ads, the telemetry and the &ldquo;Discover&rdquo; tab were gone. Then it wrote a new home screen: black background, four big tiles, a clock. My mum said &ldquo;oh, that&rsquo;s nice&rdquo; and that was the whole review.</p>
        <p>I <A href="https://x.com/gathint/status/2111379569030939102">tweeted the before and after</A> at 2:21 PM and went to make tea.</p>

        <h2>The part I did not plan</h2>
        <p>By the time the tea was done the tweet was moving. By the next morning it had 20,000 likes and the repo had 2,000 stars. Forty-five thousand people have since read a README about TV bloatware, on a weekend. On Monday <A href="https://techcrunch.com/2026/10/19/people-are-using-ai-to-make-their-smart-tvs-dumb-again/">TechCrunch wrote it up</A>.</p>
        <p>Then the pull requests started, and they have not stopped. 146 merged in three days.</p>
        <p>The replies were the best bit, because people did not say &ldquo;nice&rdquo;, they did it. On a Sony from 2017. On a Hisense that booted into recovery once, then behaved. On a Samsung projector that runs Samsung&rsquo;s own version of adb, and someone made that work too.</p>
        <p>A grandmother now has a TV that does not shout at her. Someone pinned two Tamil serials to the dock so his wife gets there faster. Someone&rsquo;s Fire TV &ldquo;now looks like a Wii&rdquo;. Someone turned theirs into a library bookshelf where every app is a book. Someone put live Polymarket odds on theirs, which I did not ask for and completely respect.</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cdn("/blog/collage.png")} alt="Forty TVs people sent, each with the launcher on it" className="prose-img" width={1600} height={900} />

        <h2>What it actually is</h2>
        <p>Honestly, it is a prompt. One markdown file you paste into Claude Code, or any coding assistant that can run a shell. It tells the assistant how to talk to an Android TV over Wi-Fi, what to back up first, and how to find the junk on <em>your</em> model instead of trusting someone else&rsquo;s list.</p>
        <p>It also tells the assistant to ask before touching anything: which apps you use, which four go in the dock, whether the voice assistant stays. Then it builds a small native launcher, installs it, makes it Home, and checks every step with screenshots pulled from the TV.</p>
        <p>Three rules from the first afternoon, still the rules. <B>No root</B>, the firmware is never touched. <B>Nothing is uninstalled</B>, everything is disabled and can be re-enabled. <B>One line undoes everything</B>, and I ran that line on my parents&rsquo; TV on Monday just to be sure. The sponsored row came back. Then I ran the install again.</p>

        <h2>What changed since Saturday</h2>
        <ul>
          <li><B>From 1 TV model to 66.</B> Xiaomi, TCL, Sony, Hisense, Philips, Panasonic, Skyworth, Vu, OnePlus, NVIDIA Shield, Chromecast, Fire TV, BenQ, CHiQ, RCA, SANYO, Toshiba, Insignia, Hitachi, Thomson, Redmi, PRISM+, AiPro2K. Twenty-five brands, every list written by the person who did it.</li>
          <li><B>Projectors.</B> XGIMI by <X h="zarubaf" />, Stellamore by <X h="aravinddass" />, with the keystone and autofocus services marked &ldquo;never disable&rdquo;.</li>
          <li><B>Fire TV.</B> Debloat works on Fire OS 6 and 7 now. Amazon&rsquo;s ads go, Amazon&rsquo;s home stays.</li>
          <li><B>Themes.</B> A <code>config.json</code> and a wallpaper, pushed to the TV, changes the whole look. No rebuild.</li>
          <li><B>Module cards.</B> Any app can declare its own tile. The launcher asks you once, &ldquo;Keep hidden&rdquo; by default. Built by <X h="udhaykumarbala" />, who also shipped an NES library as the first module.</li>
          <li><B>14 languages.</B> Russian by <X h="angelwzr" />, French by <X h="ScaryFr92" />, then Serbian, Polish, Arabic, Turkish, Portuguese and Hebrew in two days, next to Thai, Chinese, Catalan, Spanish and German.</li>
          <li><B>The Google TV crash loop, fixed.</B> The setup wizard was grabbing Home and crashing the system every 200 ms. The installer now checks and rolls back.</li>
          <li><B>Reduced motion</B> for TVs whose GPU cannot keep up, and a highlight that stopped crawling on 2019 MediaTek sets, by <X h="occcat" />.</li>
          <li><B>Windows.</B> Every script has a PowerShell twin.</li>
          <li><B>No adb needed.</B> macOS silently blocks Google&rsquo;s <code>adb</code>. <code>tools/tv.py</code> is a pure-Python client that does not care.</li>
          <li><B>Live tiles</B> when apps come and go, by <X h="angelwzr" />. Ethernet icon by <X h="sonalder-darlene" />. A VPN badge that turns red when the VPN dies, by <X h="zarubaf" />.</li>
          <li><B>A 300 KB launcher.</B> No network, no services, built for 1 GB sets.</li>
          <li><B>A Clock screensaver</B> that drifts so nothing burns in.</li>
          <li><B>One-command restore.</B> Tested on my parents&rsquo; TV, both directions.</li>
          <li><B>Fifteen things built on top.</B> A webOS port by <X h="OmkarK97" />, a Hisense restyle by <X h="YouLop009" />, a Stremio shelf by <X h="benfirad" />, a Control Center by <X h="samdegan2311" />, an aurora screensaver by <X h="rakshajag13" />, click sounds by <X h="rocavence" />, AirPlay by <X h="nguyenduchoai" />, Fire TV launchers by <X h="itsmeterrylin" />, <X h="ljis120301" /> and <X h="ivantrj" />, a TCL fork by <X h="eddysangalli" />, a Sony China fork by <X h="roninriddle" />, a Xiaomi glass home by <X h="majnioui" />, rotating wallpapers by <X h="Alafazam" />, and a library bookshelf by <X h="gcockfoster" />.</li>
          <li><B>A website, a name, a domain.</B> cleanyour.tv.</li>
        </ul>

        <h2>The honest bits</h2>
        <p>Fire TV takes the debloat half only, because Fire OS will not hand Home to a third-party launcher. Some China-market TCL sets refuse any APK not signed by TCL, so the prompt checks for that before building anything. And it is adb: you turn on USB debugging, allow one computer, and can turn it off again after. The same trust model as developing an Android app.</p>

        <h2>So, CleanYourTV</h2>
        <p>The repo was called tv-vibehack, a fine name for a Saturday and a bad one for something 25,000 people are reading. As of Monday it is <B>CleanYourTV</B>, at <B>cleanyour.tv</B>. Old links redirect.</p>
        <p>The website is an old television. You boot it, watch the fake cluttered home get zapped tile by tile, then change channels: the story, the screens people sent, how to set it up, and a credits roll with every person whose pull request was merged. Scroll to the bottom and keep pulling, and it turns off.</p>
        <p>The module cards are where this goes next. The launcher stays small, but apps can now plug a tile into it with your permission. A retro games shelf, a home-automation card, whatever you want, approved by you on the TV.</p>

        <h2>Try it</h2>
        <ol>
          <li>On the TV: Settings &rarr; About &rarr; press OK on Build seven times &rarr; Developer options &rarr; USB debugging on.</li>
          <li>On your computer: paste the prompt from <A href="https://github.com/Gathin23/cleanyourtv/blob/main/PROMPT.md">PROMPT.md</A> into Claude Code and give it your TV model.</li>
          <li>Accept &ldquo;Allow USB debugging?&rdquo; on the TV and answer its questions.</li>
        </ol>
        <p>About fifteen minutes. If your TV is not on the list, the prompt finds the bloat itself, and sending the list afterwards saves the next person the trouble.</p>
        <p><A href="https://github.com/Gathin23/cleanyourtv">Star the repo</A> if it helped. Send a screenshot if it worked. If it saved you from buying a new TV, there is a <A href="https://buymeacoffee.com/gathint">coffee button</A>.</p>
        <p>Thank you to the 88 people whose pull requests were merged, the many more who sent lists in the replies, and to my parents, who still do not know what any of this is but like that the ad is gone.</p>
        <p className="prose-sign">Gathin, 20 October 2026</p>
      </article>
    </main>
  );
}
