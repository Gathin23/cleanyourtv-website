"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CheckForm from "@/components/CheckForm";
import { Mark, Wordmark } from "@/components/Logo";
import { GH } from "@/lib/parse";
import { CHANNELS, COFFEE, PRIVACY_LIVE, PRIVACY_NAME, PRIVACY_PATH, shortCount } from "@/lib/site";

const NAV: [string, string][] = [
  ["TV list", "/tvs"],
  ...(PRIVACY_LIVE ? [[PRIVACY_NAME, PRIVACY_PATH] as [string, string]] : []),
  ["Add-ons", "/addons"],
  ["Press", "/press"],
  ["PR bot", "/bot"],
  ["App", "/app/android"],
];

const Cup = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z" />
    <path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17" />
    <path d="M8 3v2M12 3v2" />
  </svg>
);

/** The stripe, the logo, the nav (a channel guide behind a menu button on phones) and the GitHub pill. Home adds the On air light and the coffee link. */
export default function Header({ stars }: { stars: number }) {
  const path = usePathname().replace(/(.)\/$/, "$1");
  const home = path === "/";
  // The menu belongs to the page it was opened on, so following a link closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === path;
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenOn(null);
      button.current?.focus();
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);

  const current = (href: string) => (href === path ? "page" : undefined);
  const gh = (
    <a href={GH} className="gh-pill" aria-label={`GitHub, ${shortCount(stars)} stars`}>
      GitHub · {shortCount(stars)}
      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
        <path d="M12 2.8l2.8 5.7 6.3.9-4.6 4.4 1.1 6.2L12 17.1 6.4 20l1.1-6.2L2.9 9.4l6.3-.9z" />
      </svg>
    </a>
  );
  const coffee = (
    <a href={COFFEE} className="coffee">
      <Cup />
      Buy me a coffee
    </a>
  );

  return (
    <div className="mast">
      <div className="stripe" aria-hidden="true" />
      <header className="site-head">
        <nav aria-label="Main" className="wrap head-bar">
          <Link href="/" className="logo" aria-label="CleanYourTV, home">
            <Mark id="logo-glow-head" />
            <Wordmark />
          </Link>
          <div className="navlinks">
            {NAV.map(([label, href]) => (
              <Link key={label} href={href} aria-current={current(href)}>
                {/* "Non-Android TVs" loses its "TVs" when the bar is tight (home's, just above the phone menu). */}
                {label.endsWith(" TVs") ? (
                  <>
                    {label.slice(0, -4)}
                    <span className="nav-more">{"\u00a0"}TVs</span>
                  </>
                ) : (
                  label
                )}
              </Link>
            ))}
          </div>
          <div className="head-right">
            {home && <span className="onair live">On air</span>}
            {gh}
            {home && coffee}
            <button
              ref={button}
              type="button"
              className="menubtn"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="menu"
              onClick={() => setOpenOn(open ? null : path)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={open ? 2.4 : 2} strokeLinecap="round">
                <path d={open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"} />
              </svg>
            </button>
          </div>
        </nav>
      </header>
      <nav id="menu" className="menu" aria-label="Channel guide" hidden={!open}>
        <CheckForm id="m-tv" placeholder="Brand or model" small onGo={() => setOpenOn(null)} />
        <div>
          <p className="guide-label">Channel guide</p>
          <ul className="guide">
            {CHANNELS.map((c) => (
              <li key={c.ch}>
                <Link href={c.href} aria-current={current(c.href)} onClick={() => setOpenOn(null)}>
                  <span className="guide-ch">{c.ch}</span>
                  <span className="guide-name">{c.label}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#CFFFCF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="menu-end">
          {gh}
          {coffee}
        </div>
      </nav>
    </div>
  );
}
