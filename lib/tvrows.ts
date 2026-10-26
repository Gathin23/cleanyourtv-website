// One tested model as the TV list, its search and the home page's type-ahead see it, and the one way they match a search.
// Client-safe (no Node imports).
import type { Tv } from "./parse";

/** folder, brand, name, meta line, OS, and whether it is cleanup only (Fire TV). */
export type TvRow = { f: string; b: string; n: string; m: string; o: string; p?: 1 };

// Letters and digits only, so "kd55x80j", "KD-55X80J" and "kd 55 x80j" all find the same set.
export const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");

/** A search as the words that must each appear somewhere in a row. */
export const searchWords = (q: string) => q.split(/\s+/).map(norm).filter(Boolean);

export const matches = (t: TvRow, words: string[]) => {
  const hay = norm(`${t.b} ${t.n} ${t.m} ${t.o} ${t.f}`);
  return words.every((w) => hay.includes(w));
};

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

