"use client";

import { useState } from "react";

/** One article, compact: outlet, headline, date ("19 Oct" or ""), url, and its group's index in `groups`. */
export type PressRow = [outlet: string, headline: string, date: string, url: string, group: number];

// Short country labels for the rows and chips; the select keeps the full names.
const short = (g: string) => g.replace(/ \(.*\)$/, "");
const PAGE = 24;

/** Every article, newest first, a page at a time; chips for the biggest countries and a select for the rest. `groups` is biggest first. */
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
      <ol className="plain arts" aria-live="polite">
        {shown.slice(0, count).map(([outlet, headline, date, url, g]) => (
          <li key={url}>
            <a href={url} target="_blank" rel="noopener" className="art">
              <span className="art-src">
                <span className="art-date ch">{date}</span>
                <span className="art-outlet">{outlet}</span>
                <span className="art-country">{short(groups[g].label)}</span>
              </span>
              <span className="art-title">{headline}</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ol>
      {count < shown.length && (
        <button type="button" className="btn btn-mint btn-sm press-more" onClick={() => setCount((c) => c + PAGE)}>
          Show more articles <span className="ch">{shown.length - count} left</span>
        </button>
      )}
    </>
  );
}
