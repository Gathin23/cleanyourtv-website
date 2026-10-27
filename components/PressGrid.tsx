"use client";

import { useState } from "react";
import { cdn } from "@/lib/site";

/** One article: outlet, headline, date ("19 Oct" or ""), url, its group's index in `groups`, cover path ("" for none) and the outlet's icon path. */
export type PressRow = [outlet: string, headline: string, date: string, url: string, group: number, cover: string, icon: string];

// Short country labels for the cards and chips; the select keeps the full names.
const short = (g: string) => g.replace(/ \(.*\)$/, "");
// Every article is from the launch year, so "19 Oct" reads as "19 Oct 2026".
const day = (d: string) => (d ? `${d} 2026` : "");
const PAGE = 24;

/** Every article as a card, newest first, a page at a time; chips for the biggest countries and a select for the rest. `groups` is biggest first. */
export default function PressGrid({ items, groups }: { items: PressRow[]; groups: { label: string; count: number }[] }) {
  const [group, setGroup] = useState(-1);
  const [count, setCount] = useState(PAGE);
  const shown = group < 0 ? items : items.filter((i) => i[4] === group);
  const pick = (g: number) => {
    setGroup(g);
    setCount(PAGE);
  };
  const chip = (g: number, label: string, n: number) => (
    <button key={g} type="button" className="chip" aria-pressed={group === g} onClick={() => pick(g)}>
      {label} <span className="chip-n">{n}</span>
    </button>
  );
  return (
    <>
      <div className="chips" role="group" aria-label="Filter by country">
        {chip(-1, "All countries", items.length)}
        {groups.slice(0, 3).map((g, i) => chip(i, short(g.label), g.count))}
        <label htmlFor="more-c" className="sr-only">More countries</label>
        <select id="more-c" className="chip" value={group > 2 ? group : ""} onChange={(e) => pick(e.target.value === "" ? -1 : Number(e.target.value))}>
          <option value="">More countries</option>
          {groups.slice(3).map((g, i) => (
            <option key={g.label} value={i + 3}>
              {g.label} · {g.count}
            </option>
          ))}
        </select>
      </div>
      <ul className="plain pc-grid" aria-live="polite">
        {shown.slice(0, count).map(([outlet, headline, date, url, g, cover, icon]) => (
          <li key={url}>
            <a href={url} target="_blank" rel="noopener" className="pc-card">
              <span className="pc-cover">
                {cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cdn(cover)} alt="" width={640} height={360} loading="lazy" decoding="async" />
                ) : (
                  // No picture for this one: the outlet's icon on a tinted panel.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="pc-cover-icon" src={cdn(icon)} alt="" width={64} height={64} loading="lazy" decoding="async" />
                )}
              </span>
              <span className="pc-body">
                <span className="pc-outlet">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cdn(icon)} alt="" width={22} height={22} loading="lazy" decoding="async" />
                  <span className="pc-outlet-name">{outlet}</span>
                </span>
                <span className="pc-title">{headline}</span>
                <span className="pc-meta ch">{[day(date), short(groups[g].label)].filter(Boolean).join(" · ")}</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      {count < shown.length && (
        <button type="button" className="btn btn-mint btn-sm press-more" onClick={() => setCount((c) => c + PAGE)}>
          Show more articles <span className="ch">{shown.length - count} left</span>
        </button>
      )}
    </>
  );
}
