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

// Halloween: the official Buy Me a Coffee cup, in its brand yellow. Path from Simple Icons 13.21.0 (CC0-1.0), icons/buymeacoffee.svg;
// brand page https://www.buymeacoffee.com/brand. Inline, so no request.
const Bmc = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="#FFDD00">
    <path d="M20.216 6.415l-.132-.666c-.119-.598-.388-1.163-1.001-1.379-.197-.069-.42-.098-.57-.241-.152-.143-.196-.366-.231-.572-.065-.378-.125-.756-.192-1.133-.057-.325-.102-.69-.25-.987-.195-.4-.597-.634-.996-.788a5.723 5.723 0 00-.626-.194c-1-.263-2.05-.36-3.077-.416a25.834 25.834 0 00-3.7.062c-.915.083-1.88.184-2.75.5-.318.116-.646.256-.888.501-.297.302-.393.77-.177 1.146.154.267.415.456.692.58.36.162.737.284 1.123.366 1.075.238 2.189.331 3.287.37 1.218.05 2.437.01 3.65-.118.299-.033.598-.073.896-.119.352-.054.578-.513.474-.834-.124-.383-.457-.531-.834-.473-.466.074-.96.108-1.382.146-1.177.08-2.358.082-3.536.006a22.228 22.228 0 01-1.157-.107c-.086-.01-.18-.025-.258-.036-.243-.036-.484-.08-.724-.13-.111-.027-.111-.185 0-.212h.005c.277-.06.557-.108.838-.147h.002c.131-.009.263-.032.394-.048a25.076 25.076 0 013.426-.12c.674.019 1.347.067 2.017.144l.228.031c.267.04.533.088.798.145.392.085.895.113 1.07.542.055.137.08.288.111.431l.319 1.484a.237.237 0 01-.199.284h-.003c-.037.006-.075.01-.112.015a36.704 36.704 0 01-4.743.295 37.059 37.059 0 01-4.699-.304c-.14-.017-.293-.042-.417-.06-.326-.048-.649-.108-.973-.161-.393-.065-.768-.032-1.123.161-.29.16-.527.404-.675.701-.154.316-.199.66-.267 1-.069.34-.176.707-.135 1.056.087.753.613 1.365 1.37 1.502a39.69 39.69 0 0011.343.376.483.483 0 01.535.53l-.071.697-1.018 9.907c-.041.41-.047.832-.125 1.237-.122.637-.553 1.028-1.182 1.171-.577.131-1.165.2-1.756.205-.656.004-1.31-.025-1.966-.022-.699.004-1.556-.06-2.095-.58-.475-.458-.54-1.174-.605-1.793l-.731-7.013-.322-3.094c-.037-.351-.286-.695-.678-.678-.336.015-.718.3-.678.679l.228 2.185.949 9.112c.147 1.344 1.174 2.068 2.446 2.272.742.12 1.503.144 2.257.156.966.016 1.942.053 2.892-.122 1.408-.258 2.465-1.198 2.616-2.657.34-3.332.683-6.663 1.024-9.995l.215-2.087a.484.484 0 01.39-.426c.402-.078.787-.212 1.074-.518.455-.488.546-1.124.385-1.766zm-1.478.772c-.145.137-.363.201-.578.233-2.416.359-4.866.54-7.308.46-1.748-.06-3.477-.254-5.207-.498-.17-.024-.353-.055-.47-.18-.22-.236-.111-.71-.054-.995.052-.26.152-.609.463-.646.484-.057 1.046.148 1.526.22.577.088 1.156.159 1.737.212 2.48.226 5.002.19 7.472-.14.45-.06.899-.13 1.345-.21.399-.072.84-.206 1.08.206.166.281.188.657.162.974a.544.544 0 01-.169.364zm-6.159 3.9c-.862.37-1.84.788-3.109.788a5.884 5.884 0 01-1.569-.217l.877 9.004c.065.78.717 1.38 1.5 1.38 0 0 1.243.065 1.658.065.447 0 1.786-.065 1.786-.065.783 0 1.434-.6 1.499-1.38l.94-9.95a3.996 3.996 0 00-1.322-.238c-.826 0-1.491.284-2.26.613z" />
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
  // Halloween: an orange button to the pack page, in the header (a compact pumpkin on phones) and in the phone menu.
  const halloween = (inMenu: boolean) => (
    <Link href="/halloween" className={inMenu ? "hw-nav hw-nav-menu" : "hw-nav"} aria-current={current("/halloween")} aria-label={inMenu ? undefined : "Halloween"} onClick={inMenu ? () => setOpenOn(null) : undefined}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/hw/pumpkin-1x.webp" srcSet="/hw/pumpkin-1x.webp 1x, /hw/pumpkin-2x.webp 2x" width={34} height={32} alt="" />
      <span className={inMenu ? undefined : "hw-nav-t"}>Halloween</span>
    </Link>
  );
  const coffee = (
    <a href={COFFEE} className="coffee">
      {HALLOWEEN ? <Bmc /> : <Cup />}
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
            {HALLOWEEN && halloween(false)}
            {gh}
            {home && (HALLOWEEN ? (
              // Halloween: the header's coffee link shrinks to its icon (the phone menu keeps the words).
              <a href={COFFEE} className="coffee coffee-icon" aria-label="Buy me a coffee" title="Buy me a coffee">
                <Bmc />
              </a>
            ) : (
              coffee
            ))}
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
          {HALLOWEEN && halloween(true)}
          {gh}
          {coffee}
        </div>
      </nav>
    </div>
  );
}
