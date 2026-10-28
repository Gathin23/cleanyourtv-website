// One tested model as the TV list, its search and the home page's type-ahead see it, and the one way they match a search.
// Client-safe (no Node imports).
import type { Tv } from "./parse";

/** folder, brand, name, meta line, OS, and whether it is cleanup only (Fire TV). */
export type TvRow = { f: string; b: string; n: string; m: string; o: string; p?: 1 };

// Letters and digits only, so "kd55x80j", "KD-55X80J" and "kd 55 x80j" all find the same set.
export const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");

/** A search as the words that must each appear somewhere in a row. */
export const searchWords = (q: string) => q.split(/\s+/).map(norm).filter(Boolean);

/** Everything a search looks through in one row, normalised. Lists that filter on every keystroke work this out once per row. */
export const hayOf = (t: TvRow) => norm(`${t.b} ${t.n} ${t.m} ${t.o} ${t.f}`);

export const matches = (t: TvRow, words: string[], hay = hayOf(t)) => words.every((w) => hay.includes(w));

// A region at the end of the name ("…, India") belongs on the meta line; "1st gen 2018" or "1 GB" stays with the name.
const isPlace = (s: string) => /^\p{Lu}[\p{L} .'-]*$/u.test(s) && s.split(" ").length <= 3 && !/\b(TV|gen|series|projector)\b/i.test(s);

/** The README's "Sony BRAVIA 4K UR2 (BRAVIA_UR2_4K, MediaTek)" as a name ("BRAVIA 4K UR2") and a meta line ("BRAVIA_UR2_4K · MediaTek"). */
export function tvRow(t: Tv): TvRow {
  const parens = Array.from(t.tv.matchAll(/\(([^)]*)\)/g), (m) => m[1]);
  const bare = t.tv.replace(/\s*\([^)]*\)/g, "").trim();
  const parts = bare.split(/,\s*/);
  const places: string[] = [];
  while (parts.length > 1 && isPlace(parts[parts.length - 1])) places.unshift(parts.pop()!);
  let name = parts.join(", ");
  const first = t.tv.split(/[\s(]/)[0];
  if (name.startsWith(first + " ") && t.brand === first) name = name.slice(first.length + 1);
  const meta = [...parens.flatMap((p) => p.split(/[,;]\s*/)), ...places].map((s) => s.trim()).filter(Boolean).join(" · ");
  const fire = /fire os/i.test(t.os) || /\bFire TV\b/.test(t.tv);
  return { f: t.folder, b: t.brand, n: name || t.model, m: meta, o: t.os, ...(fire ? { p: 1 as const } : {}) };
}


// Words that say nothing about which TV it is, so they never make two rows look alike.
const VAGUE = new Set(["tv", "smart", "android", "google", "the", "my", "inch", "led", "uhd", "hd", "4k", "8k", "series", "model"]);

/** A model word and its looser forms: "55c745k" also tries "c745k", "55c745" and "c745" (no screen size, no region letter). */
function loose(w: string): string[] {
  const out = [w];
  if (/\d/.test(w) && w.length >= 5) {
    const noSize = w.replace(/^\d{2,3}(?=[a-z])/, "");
    const noTail = w.replace(/(?<=\d)[a-z]{1,2}$/, "");
    const both = noSize.replace(/(?<=\d)[a-z]{1,2}$/, "");
    for (const v of [noSize, noTail, both]) if (v.length >= 3 && !out.includes(v)) out.push(v);
  }
  return out;
}

/**
 * When no row has every word: the rows that share the most words with the search (a brand, a model series without its
 * screen size), best first. Empty when the search shares nothing useful with any tested model.
 */
export function closest(rows: TvRow[], words: string[], max = 12): TvRow[] {
  // A bare screen size ("43", "55") matches half the list, so it doesn't count.
  const useful = words.filter((w) => w.length >= 2 && !VAGUE.has(w) && !/^\d{2,3}$/.test(w)).map(loose);
  if (!useful.length) return [];
  const scored = rows
    .map((t) => {
      const hay = norm(`${t.b} ${t.n} ${t.m} ${t.f}`);
      const brand = norm(t.b);
      // The brand counts double, so "toshiba 43" stays with Toshiba rather than any 43" set.
      // Under four letters a model fragment turns up inside unrelated codes ("xr9" in K-65XR90M2), so it needs to be longer.
      return { t, s: useful.reduce((n, vs) => n + (vs[0] === brand ? 2 : vs.some((v) => v.length >= 4 && hay.includes(v)) ? 1 : 0), 0) };
    })
    .filter((x) => x.s > 0);
  if (!scored.length) return [];
  const best = Math.max(...scored.map((x) => x.s));
  return scored.filter((x) => x.s === best).slice(0, max).map((x) => x.t);
}
