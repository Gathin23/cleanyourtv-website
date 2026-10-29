"use client";

import type { CSSProperties } from "react";
import { useState } from "react";

// Ghost ads floating over the before picture. Press one to bust it; bust all five and the picture wipes to the after.


const G: { t: string; style: CSSProperties }[] = [
  { t: "Sponsored", style: { left: "0%", top: 22 } },
  { t: "Watch now", style: { left: "22%", top: 70 } },
  { t: "Promoted", style: { left: "44%", top: 6 } },
  { t: "AD 0:15", style: { left: "64%", top: 62 } },
  { t: "For you", style: { right: "0%", top: 16 } },
];

export default function HwGhosts({ onCleared }: { onCleared: () => void }) {
  const [busted, setBusted] = useState<Record<number, "pop" | "gone">>({});
  const bust = (i: number) => {
    if (busted[i]) return;
    setBusted((b) => ({ ...b, [i]: "pop" }));
    setTimeout(() => {
      setBusted((b) => {
        const next = { ...b, [i]: "gone" as const };
        if (G.every((_, j) => next[j] === "gone")) setTimeout(onCleared, 0);
        return next;
      });
    }, 550);
  };
  return (
    <div className="hw-ghosts">
      {G.map((g, i) =>
        busted[i] === "gone" ? null : (
          <button
            key={g.t}
            type="button"
            className={busted[i] === "pop" ? "hw-ghost hw-ghost-pop" : "hw-ghost"}
            style={{ ...g.style, "--i": i } as CSSProperties}
            aria-label={`Bust the "${g.t}" ghost ad`}
            onClick={() => bust(i)}
          >
            <span className="hw-ghost-body">
              <span className="hw-ghost-eyes">
                <span />
                <span />
              </span>
              <span className="hw-ghost-t">{busted[i] === "pop" ? "Busted" : g.t}</span>
            </span>
            <span className="hw-ghost-tail">
              <span />
              <span />
              <span />
              <span />
            </span>
          </button>
        ),
      )}
    </div>
  );
}
