import Link from "next/link";
import TvSite from "@/components/TvSite";
import JsonLd from "@/components/JsonLd";
import { loadFacts, loadSiteData } from "@/lib/data";
import { GH } from "@/lib/parse";
import { COVERAGE_TOTAL } from "@/lib/press";
import { homeGraph, pageMeta } from "@/lib/seo";

// Content comes from the cleanyourtv repo and GitHub at build time; the deploy workflow rebuilds the site every hour.

const description =
  "Your TV, minus the ads. Debloat any Android TV or Google TV over Wi-Fi and swap the ad-filled home screen for a clean Apple TV-style launcher. No root, fully reversible.";

export const metadata = pageMeta("/", "CleanYourTV: remove ads and bloat from Android TV and Google TV", description);

export default async function Page() {
  const [data, facts] = await Promise.all([loadSiteData(), loadFacts()]);
  return (
    <>
      <JsonLd data={homeGraph(facts, description)} />
      <TvSite data={data} pressTotal={COVERAGE_TOTAL} />
      {/* The TV above is mostly drawn and animated on the client. This is the same story in plain text for screen
          readers and crawlers: the pitch, the three setup screens of channel 03, the counts in its ticker and its links. */}
      <section className="sr-only" aria-labelledby="about-cleanyourtv">
        <h2 id="about-cleanyourtv">About CleanYourTV</h2>
        <p>
          Your TV, minus the ads. For Android TV and Google TV: an AI coding assistant removes the ads over Wi-Fi. No root, nothing uninstalled, free and
          open source.
        </p>
        <h3>How it works</h3>
        <ol>
          <li>On the TV: Settings, Device Preferences, About. Press OK on Build seven times, go back to Developer options and turn on USB debugging, and Network or ADB debugging if your TV shows it.</li>
          <li>On your computer: paste the prompt from <a href={GH + "/blob/main/PROMPT.md"}>PROMPT.md</a> into Claude Code, or another coding assistant with shell access, and put in your TV model.</li>
          <li>Follow along: accept &quot;Allow USB debugging?&quot; on the TV, then answer its checklist: which apps you use, which four go in the dock, and whether to keep the voice assistant, Chromecast and updates.</li>
        </ol>
        <p>Nothing uninstalled. One line restores it.</p>
        <h3>Supported TVs</h3>
        <p>Android TV and Google TV: {facts.tvs} TVs from {facts.brands.length} brands so far.</p>
        <h3>More</h3>
        <ul>
          <li><a href={GH}>CleanYourTV on GitHub</a></li>
          <li><Link href="/press">{COVERAGE_TOTAL} articles about CleanYourTV in the press</Link></li>
          <li><Link href="/addons">Add-ons, themes and settings for the launcher</Link></li>
          <li><Link href="/faq">Questions people ask</Link></li>
          <li><Link href="/blog/reintroducing-cleanyourtv">(Re)introducing CleanYourTV</Link></li>
        </ul>
      </section>
    </>
  );
}
