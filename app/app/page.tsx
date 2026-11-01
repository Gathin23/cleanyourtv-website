import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { SITE, breadcrumbs, pageMeta } from "@/lib/seo";
import "./apps.css";

// Community apps that clean a TV with CleanYourTV's lists, each built and maintained by someone else.
// Picked on 1 Nov 2026 from a scan of 41 app repos (releases, outside PRs merged, issue replies, CI builds,
// disable-only with undo, no tracking). Keep the list short and re-check it when an app goes quiet.

const title = "Community apps for CleanYourTV";
const description =
  "Clean your TV from your phone or laptop with free, open-source apps built by the community on CleanYourTV's tested TV lists. Each one is made and maintained by an independent developer, not by CleanYourTV.";

export const metadata = pageMeta("/app", title, description);

type App = { name: string; by: string; byUrl: string; platform: string; text: string; repo: string; release: string; more?: [string, string] };

const APPS: App[] = [
  {
    name: "Clean Your TV app", by: "udhaykumarbala", byUrl: "https://github.com/udhaykumarbala", platform: "Android phone · Android 9+",
    text: "Finds your TV on the Wi-Fi, shows the plan before anything changes, saves a restore point and puts the new home screen on.",
    repo: "https://github.com/udhaykumarbala/cleanyourtv-app", release: "v0.4.7 · 30 Oct", more: ["/app/android", "About this app"],
  },
  {
    name: "Tellyscope", by: "man15h", byUrl: "https://github.com/man15h", platform: "Android phone · Android 8+",
    text: "Matches your TV to one of CleanYourTV's lists, shows every app before it turns any off, and keeps an undo for each change.",
    repo: "https://github.com/man15h/tellyscope", release: "v0.14.0 · 30 Oct",
  },
  {
    name: "TidyTV", by: "jolan94", byUrl: "https://github.com/jolan94", platform: "Android phone · Android 8+ · on Google Play",
    text: "Turns off ads, trackers and bloat from your phone using CleanYourTV's tested lists, with a backup first and a one-tap restore.",
    repo: "https://github.com/jolan94/tidytv", release: "v0.10.1 · 29 Oct",
  },
  {
    name: "CleanMyTV", by: "wingedpanther", byUrl: "https://github.com/wingedpanther", platform: "Mac and Windows",
    text: "A desktop app that applies CleanYourTV's list for your TV over Wi-Fi, switches apps off instead of uninstalling them, and restores everything in one click.",
    repo: "https://github.com/wingedpanther/cleanmytv", release: "v0.4.1 · 1 Nov",
  },
];

export default function CommunityApps() {
  const url = `${SITE}/app`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "CollectionPage", "@id": url, url, name: title, description, isPartOf: { "@id": `${SITE}/#website` } },
      breadcrumbs(["Community apps", "/app"]),
    ],
  };
  return (
    <main>
      <JsonLd data={jsonLd} />
      <section aria-labelledby="page-h" className="wrap sec capps-head">
        <p className="kicker c-green">Community apps</p>
        <h1 id="page-h" className="h1 capps-h1">Clean your TV from your phone or laptop.</h1>
        <p className="lede">Free, open-source apps that use CleanYourTV&apos;s tested TV lists. No coding agent needed.</p>
        <p className="capps-owner">
          <b>Built and maintained by independent developers, not by CleanYourTV.</b> Each app has its own repo, its own releases and its own
          issues: if an app misbehaves, report it there.
        </p>
      </section>

      <section aria-label="Apps" className="wrap capps-grid-wrap">
        <ul className="plain capps-grid">
          {APPS.map((a) => (
            <li key={a.name} className="capps-card">
              <div className="capps-top">
                <h2 className="capps-name">{a.name}</h2>
                <span className="ch capps-rel">{a.release}</span>
              </div>
              <p className="capps-plat dim">{a.platform}</p>
              <p className="capps-text">{a.text}</p>
              <p className="capps-by dim">
                Community-built by <a href={a.byUrl}>{a.by}</a>
              </p>
              <div className="capps-btns">
                <a href={a.repo} className="btn btn-ghost btn-sm">Repo and download</a>
                {a.more && <Link href={a.more[0]} className="btn btn-ghost btn-sm">{a.more[1]}</Link>}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="tips-h" className="wrap sec capps-tips">
        <h2 id="tips-h" className="h2-sm">Before you pick one</h2>
        <ul className="capps-list">
          <li><b>Pick one app.</b> Each installs its own copy of the CleanYourTV launcher. To switch apps, uninstall the launcher first, or the new one won&apos;t install over it.</li>
          <li><b>Every app here only switches apps off and can undo it.</b> Nothing is uninstalled.</li>
          <li><b>Prefer to do it yourself?</b> The <Link href="/">CleanYourTV prompt</Link> works with any coding agent and is the version we maintain.</li>
          <li><b>Built an app on CleanYourTV?</b> Open a pull request adding it to <a href="https://github.com/Gathin23/cleanyourtv/blob/main/SHOWCASE.md">SHOWCASE.md</a>. Apps are listed here when they&apos;re open source, release regularly, answer issues and send no tracking.</li>
        </ul>
      </section>
    </main>
  );
}
