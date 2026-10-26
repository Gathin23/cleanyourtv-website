"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const APP_REPO = "https://github.com/udhaykumarbala/cleanyourtv-app";

/** The Android app's pages end with where its privacy policy and its issues live. */
export default function FooterNote() {
  const path = usePathname();
  if (!path.startsWith("/app/android")) return null;
  return (
    <p className="wrap foot-note">
      The app: no accounts, no analytics, no ads. <Link href="/app/android/privacy">Read its privacy policy</Link> ·{" "}
      <a href={`${APP_REPO}/issues`}>Open an issue</a>
    </p>
  );
}
