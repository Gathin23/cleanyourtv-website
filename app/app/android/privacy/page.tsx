import Link from "next/link";
import type { ReactNode } from "react";
import JsonLd from "@/components/JsonLd";
import { SITE, breadcrumbs, pageMeta } from "@/lib/seo";
import "../../../prose.css";

// The Android app's privacy policy, word for word from PRIVACY.md in its repo, and the URL its Google Play listing shows.
// When PRIVACY.md changes, this page changes in a pull request; its two relative links point at the repo here.
const REPO = "https://github.com/udhaykumarbala/cleanyourtv-app";
const EFFECTIVE = "2026-10-23";

const title = "Privacy policy · Clean Your TV app for Android phones";
const description =
  "The privacy policy of the community-built Clean Your TV app for Android phones (tv.cleanyour.app). The app does not collect your data: no accounts, no analytics, no advertising, no crash reporting.";

export const metadata = pageMeta("/app/android/privacy", title, description);

const B = ({ children }: { children: ReactNode }) => <strong>{children}</strong>;
const A = ({ href, children }: { href: string; children: ReactNode }) => <a href={href}>{children}</a>;

export default function AndroidPrivacy() {
  const url = `${SITE}/app/android/privacy`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": url, url, name: title, description, datePublished: EFFECTIVE, isPartOf: { "@id": `${SITE}/#website` }, about: { "@id": `${SITE}/app/android#app` } },
      breadcrumbs(["Android app", "/app/android"], ["Privacy policy", "/app/android/privacy"]),
    ],
  };
  return (
    <main>
      <JsonLd data={jsonLd} />
      <article className="prose">
        <p className="prose-kicker">
          <Link href="/app/android">Android app</Link>&nbsp;· Privacy policy
        </p>
        <p className="dim">
          Privacy policy for the Clean Your TV app for Android phones (package <code>tv.cleanyour.app</code>)
        </p>

        <h1>Privacy policy</h1>

        <p>
          Clean Your TV (the Android app, package <code>tv.cleanyour.app</code>) is a community-built phone app for{" "}
          <A href="https://github.com/Gathin23/cleanyourtv">Clean Your TV</A>. It is published as open source by udhaykumarbala at{" "}
          <A href={REPO}>github.com/udhaykumarbala/cleanyourtv-app</A>.
        </p>
        <p>Effective date: {EFFECTIVE}.</p>

        <h2>The short version</h2>
        <ul>
          <li>The app does not collect your data. It has no accounts, no analytics, no advertising and no crash reporting service.</li>
          <li>
            Nothing about you, your phone or your TV is sent to us or to anyone else. We run no server for this app, so we could not receive it if it
            were.
          </li>
          <li>Everything the app learns about your TV stays on your phone.</li>
        </ul>

        <h2>What the app talks to</h2>
        <p>
          <B>Your TV, on your home network.</B> To clean your TV the app connects to the TV you pick, over your Wi-Fi, using Android&rsquo;s
          debugging connection (ADB, port 5555), and it listens for TVs announcing themselves on the network (mDNS) so it can find yours. This
          traffic stays inside your home network. The app reads the list of apps and the model of your TV, and it changes settings and apps on the TV
          when you tell it to.
        </p>
        <p>
          <B>GitHub, only in the GitHub and F-Droid versions, and only when you ask.</B> The version you download from GitHub or F-Droid has three
          features that contact GitHub, and only when you use them: &ldquo;Check for updates&rdquo; makes one request for the latest release, opening
          Cards and modules fetches the signed list of add-ons, and an optional add-on downloads from its GitHub release when you add it. GitHub sees
          the usual details of any web request (your IP address, for example) under{" "}
          <A href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">GitHub&rsquo;s privacy statement</A>.
          The app sends no identifier of its own. The home screen launcher and the TV progress screen are inside the app, so a normal clean-up makes
          no internet request at all.
        </p>
        <p>
          <B>The Google Play version makes no internet requests to GitHub.</B> It has no update check and no add-on downloads, because Google Play
          updates the app. A normal clean-up needs the internet for nothing.
        </p>
        <p>The app has no other internet connections: no advertising networks, analytics or tracking services.</p>

        <h2>What stays on your phone</h2>
        <ul>
          <li>
            <B>The key your TV trusts.</B> The first time you connect, the app makes a key that the TV remembers as &ldquo;this phone&rdquo;. It lives
            in the Android Keystore on your phone and never leaves it.
          </li>
          <li>
            <B>Restore points.</B> Before the first change the app saves a note of what your TV looked like, so everything can be put back. It stays
            on your phone. It leaves your phone only if you choose &ldquo;Save a copy&rdquo; and send the file somewhere yourself.
          </li>
          <li>
            <B>Your choices</B>, such as the dock and the look you picked, and the TVs you have set up.
          </li>
        </ul>
        <p>
          You can delete all of this at any time from the app&rsquo;s Settings, or by clearing the app&rsquo;s storage or uninstalling it in
          Android&rsquo;s settings.
        </p>

        <h2>Diagnostics</h2>
        <p>
          &ldquo;Share diagnostics&rdquo; is off until you use it. It shows you a preview of the report first, removes network addresses, serial
          numbers, keys and pairing codes, and sends nothing by itself: it opens Android&rsquo;s share sheet and you pick where it goes (a message,
          an email, a note), or you cancel.
        </p>

        <h2>Permissions</h2>
        <p>
          The app asks Android for: internet and network state (to reach the TV and, in the GitHub and F-Droid versions, GitHub), Wi-Fi multicast
          (to find the TV), a foreground service while it works on the TV, notifications (to tell you when it is done), and your screen lock
          (confirmed once before the first change, so a stranger holding your unlocked phone cannot change your TV). It does not ask for location,
          contacts, camera, microphone, photos or storage.
        </p>

        <h2>Children</h2>
        <p>
          The app is made for adults who set up their own or their family&rsquo;s TV. It does not knowingly collect anything from anyone, children
          included.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          If the app ever starts to collect or send data, this page changes first and the change is noted in the{" "}
          <A href={`${REPO}/blob/main/CHANGELOG.md`}>changelog</A>. The history of this file is public in the repository.
        </p>

        <h2>Contact</h2>
        <p>
          Questions or concerns: <A href={`${REPO}/issues`}>open an issue</A> on GitHub. For a security problem, please follow{" "}
          <A href={`${REPO}/blob/main/SECURITY.md`}>SECURITY.md</A> instead.
        </p>

        <p className="prose-end">
          This page mirrors <A href={`${REPO}/blob/main/PRIVACY.md`}>PRIVACY.md</A> in the app&rsquo;s repository, where its history is public.
          Back to <Link href="/app/android">the Android app</Link>.
        </p>
      </article>
    </main>
  );
}
