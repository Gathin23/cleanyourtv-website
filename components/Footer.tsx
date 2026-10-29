import Link from "next/link";
import FooterNote from "@/components/FooterNote";
import { Mark, Wordmark } from "@/components/Logo";
import { HALLOWEEN } from "@/lib/halloween";
import { GH } from "@/lib/parse";
import { COFFEE, ON_AIR_SINCE, PRIVACY_LIVE, PRIVACY_NAME, PRIVACY_PATH } from "@/lib/site";

const since = new Date(ON_AIR_SINCE + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/** Three columns of links under a 2 px rule; /app/android adds a line about the app's own privacy. */
export default function Footer() {
  return (
    <footer className="site-foot">
      <div className="wrap foot-grid">
        <div className="foot-brand">
          <Link href="/" className="logo foot-logo" aria-label="CleanYourTV, home">
            <Mark id="logo-glow-foot" />
            <Wordmark />
          </Link>
          <span className="foot-since">On air since {since}</span>
          {HALLOWEEN && <span className="foot-since hw-foot">Halloween special, until 1 Nov</span>}
        </div>
        <nav aria-label="Use it" className="foot-nav">
          <Link href="/tvs">TV list</Link>
          <Link href="/#setup">Set up</Link>
          <Link href="/tutorials">Tutorials</Link>
          {PRIVACY_LIVE && <Link href={PRIVACY_PATH}>{PRIVACY_NAME}</Link>}
          <Link href="/app/android">Android app</Link>
        </nav>
        <nav aria-label="Build" className="foot-nav">
          <a href={GH}>GitHub</a>
          <Link href="/addons">Add-ons</Link>
          <Link href="/bot">PR bot</Link>
          <Link href="/faq">FAQ</Link>
        </nav>
        <nav aria-label="About" className="foot-nav">
          <Link href="/blog/reintroducing-cleanyourtv">The story</Link>
          <Link href="/press">Press</Link>
          <a href={COFFEE} className="foot-coffee">Buy me a coffee</a>
        </nav>
      </div>
      <FooterNote />
    </footer>
  );
}
