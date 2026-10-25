"use client";

import Link from "next/link";
import { useState } from "react";
import { GH } from "@/lib/parse";
import type { Tv } from "@/lib/parse";

// Letters and digits only, so "kd55x80j", "KD-55X80J" and "kd 55 x80j" all find the same set.
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");

/** Search box and brand dropdown over the tested models; every word typed has to match somewhere in the row. */
export default function TvFinder({ tvs, brands }: { tvs: Tv[]; brands: [string, number][] }) {
  const [q, setQ] = useState("");
  const [brand, setBrand] = useState("");
  const words = q.split(/\s+/).map(norm).filter(Boolean);
  const shown = tvs.filter((t) => {
    if (brand && t.brand.toLowerCase().replace(/\.$/, "") !== brand.toLowerCase().replace(/\.$/, "")) return false;
    const hay = norm(`${t.tv} ${t.os} ${t.folder}`);
    return words.every((w) => hay.includes(w));
  });
  const filtered = !!(words.length || brand);
  // A Samsung, LG or Roku search that finds nothing gets the honest answer, not "it still works".
  const other = !shown.length && words.some((w) => ["samsung", "tizen", "lg", "webos", "roku"].includes(w));
  return (
    <>
      <div className="tvs-filter">
        <label className="tvs-search">
          <span className="sr-only">Search by brand or model</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Brand or model, like Sony KD-55X80J"
            autoComplete="off"
            spellCheck={false}
          />
        </label>
        <label className="press-jump">
          <span className="sr-only">Filter by brand</span>
          <select value={brand} aria-label="Filter by brand" onChange={(e) => setBrand(e.target.value)}>
            <option value="">All brands · {tvs.length}</option>
            {brands.map(([b, n]) => (
              <option key={b} value={b}>
                {b} · {n}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="tvs-count" aria-live="polite">
        {filtered ? `${shown.length} of ${tvs.length} tested models` : `${tvs.length} tested models`}
        {filtered && (
          <button type="button" className="press-clear" onClick={() => { setQ(""); setBrand(""); }}>
            Clear
          </button>
        )}
      </p>
      {shown.length > 0 ? (
        <ul className="tvs-list">
          {shown.map((t) => (
            <li key={t.folder}>
              <a href={`${GH}/tree/main/examples/${t.folder}`} target="_blank" rel="noopener" className="tvs-row">
                <span className="tvs-name">{t.tv}</span>
                <span className="tvs-os">{t.os}</span>
                <span className="tvs-open" aria-hidden="true">List →</span>
                <span className="sr-only"> (opens the list on GitHub in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      ) : other ? (
        <div className="tvs-empty" data-tone="no">
          <p>
            <strong>Samsung, LG and Roku TVs are not supported.</strong> They run Tizen, webOS and Roku OS, which have no ADB, so
            there is no way to switch their apps off from outside.
          </p>
          <p>
            Some people have built webOS versions: <a href={`${GH}/blob/main/SHOWCASE.md#other-platforms-fire-tv-and-lg-webos`}>see the showcase →</a>
          </p>
        </div>
      ) : (
        <div className="tvs-empty">
          <p>
            <strong>Not on the list yet? It still works.</strong> These are only the models someone has already tested. On any
            Android TV or Google TV, the assistant reads what your TV has installed and builds a list for your model with you.
          </p>
          <p>
            <Link href="/#ch-03">How to set it up →</Link>
          </p>
        </div>
      )}
    </>
  );
}
