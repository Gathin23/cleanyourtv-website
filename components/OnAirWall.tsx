"use client";

import { useState, type ReactNode } from "react";
import { cdn, thumb } from "@/lib/site";

export type WallItem = { handle: string; image: string; link: string; tv: string };

/** Photos people posted of their cleaned TV. The page carries the first few (children); the whole wall comes from /wall.json when asked for. */
export default function OnAirWall({ total, head, children }: { total: number; head: ReactNode; children: ReactNode }) {
  const [items, setItems] = useState<WallItem[] | null>(null);
  const [state, setState] = useState<"closed" | "loading" | "open" | "failed">("closed");
  const toggle = async () => {
    if (state === "open") return setState("closed");
    if (items) return setState("open");
    setState("loading");
    try {
      const r = await fetch("/wall.json");
      if (!r.ok) throw new Error(String(r.status));
      setItems((await r.json()) as WallItem[]);
      setState("open");
    } catch {
      setState("failed");
    }
  };
  const open = state === "open" && items;
  return (
    <>
      <div className="spread">
        {head}
        <button type="button" className="wall-btn" aria-expanded={!!open} aria-controls="wall" onClick={toggle}>
          {open ? "Show fewer" : state === "loading" ? "Loading the wall…" : state === "failed" ? "Couldn't load it. Try again" : `See the whole wall · ${total}`}
        </button>
      </div>
      <div id="wall">
        {open ? (
          <ul className="plain wall">
            {items.map((x) => (
              <li key={x.link + x.image}>
                <a href={x.link} target="_blank" rel="noopener">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cdn(thumb(x.image))} alt={`${x.tv}, posted by ${x.handle}`} width={320} height={180} loading="lazy" decoding="async" />
                  <span>{x.handle}</span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          children
        )}
      </div>
    </>
  );
}
