"use client";

import { useRouter } from "next/navigation";
import { useState, type KeyboardEvent, type ReactNode } from "react";
import { notAndroid, privacyHref, routeFor } from "@/lib/checker";
import { PRIVACY_LIVE } from "@/lib/site";
import { closest, matches, norm, searchWords, type TvRow } from "@/lib/tvrows";

const SHOWN = 8;

// The tested models, fetched once per visit on the first focus or keypress (from /tvs-index.json, so the page stays small).
let index: Promise<TvRow[]> | null = null;
const loadIndex = () =>
  (index ??= fetch("/tvs-index.json")
    .then((r) => (r.ok ? (r.json() as Promise<TvRow[]>) : []))
    .catch(() => {
      index = null;
      return [];
    }));

/** `text` with every part that matches a search word in <mark>, matched the way the list matches: letters and digits only. */
function highlight(text: string, words: string[]): ReactNode[] {
  const pos: number[] = [];
  let flat = "";
  for (let i = 0; i < text.length; i++) {
    const c = norm(text[i]);
    if (c) {
      flat += c;
      pos.push(i);
    }
  }
  const on = new Array<boolean>(text.length).fill(false);
  for (const w of words) {
    for (let at = flat.indexOf(w); at >= 0; at = flat.indexOf(w, at + 1)) {
      for (let k = pos[at]; k <= pos[at + w.length - 1]; k++) on[k] = true;
    }
  }
  const out: ReactNode[] = [];
  let start = 0;
  for (let i = 1; i <= text.length; i++) {
    if (i === text.length || on[i] !== on[start]) {
      const part = text.slice(start, i);
      out.push(on[start] ? <mark key={start}>{part}</mark> : part);
      start = i;
    }
  }
  return out;
}

/** href null: a line that informs but can't be picked (the privacy guide, until it is live). */
type Option = { key: string; href: string | null; kind: "privacy" | "soon" | "tv" | "all"; body: ReactNode };

/**
 * "Does it work on my TV?": a combobox over the tested models. Typing two letters lists the matches, a TV that is not
 * Android leads with the privacy guide; picking one or pressing Check goes to /tvs?q=…, which lands on the results.
 */
export default function CheckForm({ id, placeholder = "Type a brand or model", small, onGo }: { id: string; placeholder?: string; small?: boolean; onGo?: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<TvRow[] | null>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const listId = `${id}-list`;

  const load = () => {
    if (!rows) loadIndex().then(setRows);
  };
  const go = (href: string) => {
    setOpen(false);
    onGo?.();
    router.push(href);
  };

  const words = searchWords(q);
  const options: Option[] = [];
  if (q.trim().length >= 2) {
    const not = notAndroid(q);
    if (not)
      options.push(
        PRIVACY_LIVE
          ? { key: "privacy", href: privacyHref(q), kind: "privacy", body: <>{not} isn&apos;t Android <span aria-hidden="true">→</span> Non-Android TV guide</> }
          : { key: "privacy", href: null, kind: "soon", body: <>{not} isn&apos;t Android · privacy guide coming tonight</> },
      );
    if (rows) {
      const hits = rows.filter((t) => matches(t, words));
      // No exact model: offer the nearest tested ones (same brand, same series) instead of an empty list.
      const near = hits.length || not ? [] : closest(rows, words, 5);
      // Models whose brand and name carry the words come before ones that only match on a chip or a folder name,
      // and two lists for the same model and system show once.
      const named = (t: TvRow) => (words.every((w) => norm(`${t.b} ${t.n}`).includes(w)) ? 0 : 1);
      const seen = new Set<string>();
      const top = [...(hits.length ? hits : near)].sort((a, b) => named(a) - named(b)).filter((t) => {
        const k = norm(`${t.b} ${t.n} ${t.o}`);
        return !seen.has(k) && !!seen.add(k);
      });
      for (const t of top.slice(0, SHOWN)) {
        const label = `${t.b} ${t.n}`;
        options.push({
          key: t.f,
          href: `/tvs?q=${encodeURIComponent(label)}`,
          kind: "tv",
          body: (
            <>
              <span className="cb-name">
                <strong>{highlight(t.b, words)}</strong> {highlight(t.n, words)}
              </span>
              <span className="cb-os">{t.o}</span>
            </>
          ),
        });
      }
      if (hits.length || !not)
        options.push({
          key: "all",
          href: `/tvs?q=${encodeURIComponent(q.trim())}`,
          kind: "all",
          body: hits.length ? (
            <>See all {hits.length} {hits.length === 1 ? "match" : "matches"} <span aria-hidden="true">→</span></>
          ) : (
            <>{near.length ? "No exact match" : "Not tested yet"}: if it runs Android TV or Google TV, it still works <span aria-hidden="true">→</span></>
          ),
        });
    }
  }
  const expanded = open && options.length > 0;
  const current = expanded && active >= 0 && active < options.length && options[active].href ? active : -1;
  // The next option that can be picked, from `from` in direction `step`; -1 back at the input.
  const step = (from: number, dir: 1 | -1) => {
    for (let i = from + dir; i >= 0 && i < options.length; i += dir) if (options[i].href) return i;
    return dir === 1 ? from : -1;
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    load();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive(step(current, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(step(current, -1));
    } else if (e.key === "Enter" && current >= 0) {
      e.preventDefault();
      go(options[current].href!);
    } else if (e.key === "Escape" && expanded) {
      // Close the list only; the phone menu around it stays open.
      e.preventDefault();
      e.stopPropagation();
      setOpen(false);
      setActive(-1);
    }
  };

  return (
    <div
      className="cb"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <form
        role="search"
        action="/tvs"
        className={small ? "check check-sm" : "check"}
        onSubmit={(e) => {
          e.preventDefault();
          go(routeFor(q));
        }}
      >
        <label htmlFor={id}>Does it work on my TV?</label>
        <div className="check-row">
          <input
            id={id}
            name="q"
            type="search"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={expanded}
            aria-controls={listId}
            aria-activedescendant={current >= 0 ? `${id}-opt-${current}` : undefined}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
              setActive(-1);
            }}
            onFocus={() => {
              load();
              setOpen(true);
            }}
            onKeyDown={onKey}
            placeholder={placeholder}
            autoComplete="off"
            spellCheck={false}
          />
          <button type="submit">Check</button>
        </div>
      </form>
      <ul id={listId} role="listbox" aria-label="Tested TVs that match" className="cb-list" hidden={!expanded}>
        {expanded &&
          options.map((o, i) => (
            <li
              key={o.key}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={i === current}
              aria-disabled={o.href ? undefined : true}
              className={`cb-opt cb-${o.kind}`}
              onMouseDown={(e) => e.preventDefault()}
              onMouseMove={() => o.href && i !== current && setActive(i)}
              onClick={() => o.href && go(o.href)}
            >
              {o.body}
            </li>
          ))}
      </ul>
    </div>
  );
}
