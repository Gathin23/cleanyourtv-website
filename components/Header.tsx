"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CheckForm from "@/components/CheckForm";
import { Drips } from "@/components/HwDecor";
import { Mark, Wordmark } from "@/components/Logo";
import { HALLOWEEN } from "@/lib/halloween";
import { GH } from "@/lib/parse";
import { CHANNELS, COFFEE, shortCount } from "@/lib/site";

const NAV: [string, string][] = [
  ["TV list", "/tvs"],
  ["Add-ons", "/addons"],
  ["Tutorials", "/tutorials"],
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

/** The stripe, the logo, the nav (a channel guide behind a menu button on phones) and the GitHub pill. Home adds the coffee link. */
export default function Header({ stars }: { stars: number }) {
  const path = usePathname().replace(/(.)\/$/, "$1");
  const home = path === "/";
  // Halloween: the dripping stripe belongs to the home page and the pack page.
  // Matched on a normalised path, so /halloween, /halloween/ and /halloween.html all count (a static server may serve the .html name).
  const bare = path.replace(/\.html$/, "").replace(/\/index$/, "") || "/";
  const hw = HALLOWEEN && (bare === "/" || bare === "/halloween");
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
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
      </svg>
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
    <div className={hw ? "mast hw-mast" : "mast"}>
      <div className="stripe" aria-hidden="true" />
      {hw && <Drips />}
      <header className="site-head">
        <nav aria-label="Main" className="wrap head-bar">
          <Link href="/" className="logo" aria-label="CleanYourTV, home">
            {HALLOWEEN ? (
              // Halloween: the spooky logo (the pumpkin is the "o"), trimmed, 238x34 at 1x.
              // eslint-disable-next-line @next/next/no-img-element
              <img className="hw-logo" src="/hw/logo-1x.webp" srcSet="/hw/logo-1x.webp 1x, /hw/logo-2x.webp 2x" width={238} height={34} alt="CleanYourTV" />
            ) : (
              <>
                <Mark id="logo-glow-head" />
                <Wordmark />
              </>
            )}
          </Link>
          <div className="navlinks">
            {NAV.map(([label, href]) => (
              <Link key={label} href={href} aria-current={current(href)}>
                {label}
              </Link>
            ))}
          </div>
          <div className="head-right">
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
