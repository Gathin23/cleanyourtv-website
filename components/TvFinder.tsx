"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GH } from "@/lib/parse";
import { PRIVACY_PATH } from "@/lib/site";

/** One tested model, as compact as the list needs: folder, brand, name, meta line, OS, and whether it is cleanup only (Fire TV). */
export type TvRow = { f: string; b: string; n: string; m: string; o: string; p?: 1 };

// Letters and digits only, so "kd55x80j", "KD-55X80J" and "kd 55 x80j" all find the same set.
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");
const brandKey = (b: string) => b.toLowerCase().replace(/\.$/, "");
// The first rows show; the rest stay in the page (so every tested model is in its HTML) until asked for or searched.
const CAP = 30;

/** Search box, brand chips (the five biggest) and a select for the rest, over the tested models; every word typed has to match. */
export default function TvFinder({ tvs, brands }: { tvs: TvRow[]; brands: [string, number][] }) {
  const [q, setQ] = useState("");
  const [brand, setBrand] = useState("");
  const [all, setAll] = useState(false);
  // /tvs?q=sony (from the home page's checker) arrives already searched.
  useEffect(() => {
    const v = new URLSearchParams(location.search).get("q");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the URL is only readable after hydration
    if (v) setQ(v);
  }, []);
  const words = q.split(/\s+/).map(norm).filter(Boolean);
  const shown = tvs.filter((t) => (!brand || brandKey(t.b) === brand) && words.every((w) => norm(`${t.b} ${t.n} ${t.m} ${t.o} ${t.f}`).includes(w)));
  const filtered = !!(words.length || brand);
  const top = brands.slice(0, 5);
  const rest = brands.slice(5);
  const picked = brands.find(([b]) => brandKey(b) === brand);
  const capped = !all && !words.length && shown.length > CAP;
  // A Samsung, LG or Roku search that finds nothing gets the honest answer, not "it still works".
  const other = !shown.length && words.some((w) => ["samsung", "tizen", "lg", "webos", "roku", "vizio"].includes(w));
  const chip = (key: string, label: string, n?: number) => (
    <button key={key || "all"} type="button" className="chip" aria-pressed={brand === key} onClick={() => setBrand(key)}>
      {label}
      {n !== undefined && <span className="chip-n">{n}</span>}
    </button>
  );
  return (
    <div className="tvf">
      <div className="tvf-search">
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
        <ul className="plain tvf-list">
          {shown.map((t, i) => (
            <li key={t.f} hidden={capped && i >= CAP}>
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
          ))}
        </ul>
      ) : other ? (
        <div className="tvf-empty">
          <p>
            <strong>Samsung, LG and Roku TVs are not supported.</strong> They run Tizen, webOS and Roku OS, which have no ADB, so there is no way to switch
            their apps off from outside.
          </p>
          <p>
            <Link href={PRIVACY_PATH}>You can still stop most of the tracking</Link>: the settings, network and DNS steps for these TVs, no root needed.
          </p>
          <p>
            Some people have built webOS versions: <a href={`${GH}/blob/main/SHOWCASE.md#other-platforms-fire-tv-and-lg-webos`}>see the showcase</a>.
          </p>
        </div>
      ) : (
        <div className="tvf-empty">
          <p>
            <strong>Not on the list yet? It still works.</strong> These are only the models someone has already tested. On any Android TV or Google TV, the
            assistant reads what your TV has installed and builds a list for your model with you.
          </p>
          <p>
            <Link href="/#setup">How to set it up</Link>
          </p>
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
