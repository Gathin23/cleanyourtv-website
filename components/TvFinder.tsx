"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GH } from "@/lib/parse";
import { PRIVACY_LIVE, PRIVACY_PATH, PRIVACY_SOON } from "@/lib/site";
import { closest, matches, searchWords, type TvRow } from "@/lib/tvrows";

const brandKey = (b: string) => b.toLowerCase().replace(/\.$/, "");
// The first rows show; the rest stay in the page (so every tested model is in its HTML) until asked for or searched.
const CAP = 30;

type Answer = "" | "yes" | "no" | "unsure";

/** No tested list for this TV: ask what it runs, since any Android TV or Google TV works, tested or not. */
function AndroidCheck() {
  const [a, setA] = useState<Answer>("");
  const pick = (v: Answer, label: string) => (
    <button type="button" className="chip" aria-pressed={a === v} onClick={() => setA(v)}>
      {label}
    </button>
  );
  return (
    <div className="tvf-ask">
      <p>
        <strong>Is it an Android TV or Google TV?</strong> Then it works, tested or not: these are only the models someone has already shared a list for.
      </p>
      <div className="chips" role="group" aria-label="What does your TV run?">
        {pick("yes", "Yes, Android TV or Google TV")}
        {pick("no", "No, Samsung, LG, Roku…")}
        {pick("unsure", "Not sure")}
      </div>
      {a === "yes" && (
        <p className="tvf-answer" aria-live="polite">
          Good, you can use it. The assistant reads what your TV has installed and builds a list for your model with you, with the same backup and undo.{" "}
          <Link href="/#setup">Set it up</Link> or use the <Link href="/app/android">phone app</Link>.
        </p>
      )}
      {a === "no" && (
        <p className="tvf-answer" aria-live="polite">
          Then CleanYourTV can&rsquo;t run on it, since those systems have no ADB.{" "}
          {PRIVACY_LIVE ? (
            <>
              <Link href={PRIVACY_PATH}>The Non-Android TV guide</Link> still turns off most of the tracking, step by step with your remote.
            </>
          ) : (
            PRIVACY_SOON
          )}
        </p>
      )}
      {a === "unsure" && (
        <p className="tvf-answer" aria-live="polite">
          Look at the home screen: Google TV says so at the top. Or open Settings: Android TV and Google TV have <strong>Device Preferences</strong> (or{" "}
          <strong>System</strong> › About showing Android TV OS). Fire TV works for the cleanup half. A Samsung, LG or Roku home screen means it isn&rsquo;t Android.
        </p>
      )}
    </div>
  );
}

/** Search box, brand chips (the five biggest) and a select for the rest, over the tested models; every word typed has to match. */
export default function TvFinder({ tvs, brands }: { tvs: TvRow[]; brands: [string, number][] }) {
  const [q, setQ] = useState("");
  const [brand, setBrand] = useState("");
  const [all, setAll] = useState(false);
  // /tvs?q=sony (from the home page's checker) arrives already searched, scrolled to the search box and its results.
  useEffect(() => {
    const v = new URLSearchParams(location.search).get("q");
    if (!v) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the URL is only readable after hydration
    setQ(v);
    requestAnimationFrame(() => document.getElementById("search")?.scrollIntoView({ block: "start" }));
  }, []);
  const words = searchWords(q);
  const shown = tvs.filter((t) => (!brand || brandKey(t.b) === brand) && matches(t, words));
  const filtered = !!(words.length || brand);
  const top = brands.slice(0, 5);
  const rest = brands.slice(5);
  const picked = brands.find(([b]) => brandKey(b) === brand);
  const capped = !all && !words.length && shown.length > CAP;
  // A Samsung, LG or Roku search that finds nothing gets the honest answer, not "it still works".
  const other = !shown.length && words.some((w) => ["samsung", "tizen", "lg", "webos", "roku", "vizio"].includes(w));
  // Nothing has every word: show the models that share the most (the brand, the series without its screen size).
  const near = !shown.length && !other ? closest(tvs.filter((t) => !brand || brandKey(t.b) === brand), words, 8) : [];
  const row = (t: TvRow, hidden: boolean) => (
    <li key={t.f} hidden={hidden}>
      <a href={`${GH}/tree/main/examples/${t.f}`} target="_blank" rel="noopener" className="tvf-row">
        <span className="tvf-name">
          <span className="tvf-model"><strong>{t.b}</strong> {t.n}</span>
          {t.m && <span className="tvf-meta">{t.m}</span>}
        </span>
        <span className="tvf-os">
          <span className="ch">{t.o}</span>
          {t.p && <span className="tvf-part ch">cleanup only</span>}
        </span>
        <span className="tvf-open">List on GitHub<span className="sr-only"> (opens in a new tab)</span></span>
      </a>
    </li>
  );
  const chip = (key: string, label: string, n?: number) => (
    <button key={key || "all"} type="button" className="chip" aria-pressed={brand === key} onClick={() => setBrand(key)}>
      {label}
      {n !== undefined && <span className="chip-n">{n}</span>}
    </button>
  );
  return (
    <div className="tvf">
      <div id="search" className="tvf-search">
        <div className="tvf-field tvf-q">
          <label htmlFor="tv-q">Search by brand or model</label>
          <input id="tv-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. BRAVIA, 65OLED907, Chromecast" autoComplete="off" spellCheck={false} />
        </div>
        {rest.length > 0 && (
          <div className="tvf-field tvf-more">
            <label htmlFor="tv-more">More brands</label>
            <select id="tv-more" value={rest.some(([b]) => brandKey(b) === brand) ? brand : ""} onChange={(e) => setBrand(e.target.value)}>
              <option value="">Pick a brand</option>
              {rest.map(([b, n]) => (
                <option key={b} value={brandKey(b)}>
                  {b} · {n}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="chips" role="group" aria-label="Filter by brand">
        {chip("", "All brands")}
        {top.map(([b, n]) => chip(brandKey(b), b, n))}
      </div>

      <p className="tvf-count ch" aria-live="polite">
        {filtered ? `${shown.length} of ${tvs.length} tested models` : `${tvs.length} tested models`}
        {filtered && (
          <button type="button" className="tvf-clear" onClick={() => { setQ(""); setBrand(""); }}>
            Clear
          </button>
        )}
      </p>

      {shown.length > 0 ? (
        <ul className="plain tvf-list">{shown.map((t, i) => row(t, capped && i >= CAP))}</ul>
      ) : other ? (
        <div className="tvf-empty">
          <p>
            <strong>Samsung, LG and Roku TVs are not supported.</strong> They run Tizen, webOS and Roku OS, which have no ADB, so there is no way to switch
            their apps off from outside.
          </p>
          {PRIVACY_LIVE ? (
            <p>
              <Link href={PRIVACY_PATH}>You can still stop most of the tracking</Link>: the settings, network and DNS steps for these TVs, no root needed.
            </p>
          ) : (
            <p>{PRIVACY_SOON}</p>
          )}
          <p>
            Some people have built webOS versions: <a href={`${GH}/blob/main/SHOWCASE.md#other-platforms-fire-tv-and-lg-webos`}>see the showcase</a>.
          </p>
        </div>
      ) : (
        <div className="tvf-empty">
          {near.length > 0 && (
            <>
              <p>
                <strong>No exact match for &ldquo;{q.trim()}&rdquo;.</strong> The closest tested {near.length === 1 ? "model" : "models"}:
              </p>
              <ul className="plain tvf-list tvf-near">{near.map((t) => row(t, false))}</ul>
            </>
          )}
          <AndroidCheck />
        </div>
      )}

      {capped && (
        <button type="button" className="btn btn-ghost btn-sm tvf-all" onClick={() => setAll(true)}>
          Show all {shown.length} {picked ? `${picked[0]} ` : ""}models
        </button>
      )}
    </div>
  );
}
