"use client";

import { useEffect, useRef, useState } from "react";
import { Pumpkin } from "@/components/HwDecor";

// The Halloween page's three interactive bits: the countdown chip, the terminal that types itself, the Lights out torch.
// Nothing here runs before hydration, and each one reads as a plain static line first.

const pad = (n: number) => String(n).padStart(2, "0");

/** "Halloween in 1d 22:14:05" until 31 Oct, local time; then "It is Halloween" until 1 Nov. */
export function Countdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const t0 = setTimeout(() => setNow(Date.now()), 0);
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      clearTimeout(t0);
      clearInterval(t);
    };
  }, []);
  let label = "Halloween in";
  let value = " ";
  if (now !== null) {
    const diff = new Date(2026, 9, 31).getTime() - now;
    if (diff > 0) {
      value = `${Math.floor(diff / 864e5)}d ${pad(Math.floor(diff / 36e5) % 24)}:${pad(Math.floor(diff / 6e4) % 60)}:${pad(Math.floor(diff / 1e3) % 60)}`;
    } else if (now < new Date(2026, 10, 1).getTime()) {
      label = "It is Halloween";
      value = "Lights out";
    } else {
      label = "Thanks for watching";
      value = "See you next year";
    }
  }
  return (
    <p className="hw-count" aria-live="off">
      <span className="hw-count-dot" />
      <span>{label}</span>
      <span className="hw-count-v">{value}</span>
    </p>
  );
}

const LINES: [string, string, string][] = [
  ["$", "adb connect 192.168.1.42", "hw-t-dim"],
  ["›", "Found a Google TV on your network", "hw-t-mint"],
  ["›", "Something is haunting the home screen…", "hw-t-violet"],
  ["›", "Switching off ad and bloat packages", "hw-t-mint"],
  ["›", "Setting the clean launcher as home", "hw-t-mint"],
  ["✓", "Done. Nothing was uninstalled.", "hw-t-ok"],
  ["", "  To undo, ask it to restore your TV.", "hw-t-dim"],
];

/** The terminal: the lines appear one by one when it scrolls into view, with a Replay button. Reduced motion shows all at once. */
export function Terminal() {
  const el = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(LINES.length);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);
  const play = () => {
    clearInterval(timer.current);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return setN(LINES.length);
    setN(0);
    timer.current = setInterval(() => setN((k) => (k >= LINES.length ? (clearInterval(timer.current), k) : k + 1)), 620);
  };
  useEffect(() => {
    const node = el.current;
    if (!node || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((es) => {
      if (es.some((x) => x.isIntersecting)) {
        io.disconnect();
        play();
      }
    }, { threshold: 0.35 });
    io.observe(node);
    return () => {
      io.disconnect();
      clearInterval(timer.current);
    };
  }, []);
  return (
    <div ref={el} className="term hw-term" role="figure" aria-label="What your coding assistant does, as an example">
      <div className="term-bar">
        <span aria-hidden="true">Your assistant, live</span>
        <span className="hw-term-end">
          <button type="button" className="hw-replay" onClick={play}>Replay</button>
          <span className="hw-rec" aria-hidden="true"><i />REC</span>
        </span>
      </div>
      <pre aria-live="off">
        {LINES.map(([m, t, c], i) => (i < n ? <span key={t} className={c}>{m && <span className={m === "$" ? "t-dim" : undefined}>{m} </span>}{t}{"\n"}</span> : null))}
        <span className="t-dim">$</span> <span className="hw-cursor" aria-hidden="true" />
      </pre>
    </div>
  );
}

/** "Lights out": the page goes dark except a circle around the pointer. Esc brings the lights back. */
export function Lights() {
  const [on, setOn] = useState(false);
  const torch = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 320 });
  const bg = () => `radial-gradient(circle 280px at ${pos.current.x}px ${pos.current.y}px, rgba(255,220,150,.07) 0%, rgba(5,5,5,0) 38%, rgba(3,3,3,.97) 100%)`;
  useEffect(() => {
    if (on && torch.current) torch.current.style.background = bg();
  }, [on]);
  useEffect(() => {
    pos.current = { x: innerWidth / 2, y: 320 };
    const move = (e: MouseEvent | TouchEvent) => {
      const p = "touches" in e ? e.touches[0] : e;
      pos.current = { x: p.clientX, y: p.clientY };
      if (torch.current) torch.current.style.background = bg();
    };
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOn(false);
    addEventListener("mousemove", move);
    addEventListener("touchmove", move, { passive: true });
    addEventListener("keydown", key);
    return () => {
      removeEventListener("mousemove", move);
      removeEventListener("touchmove", move);
      removeEventListener("keydown", key);
    };
  }, []);
  return (
    <>
      {on && <div ref={torch} className="hw-torch" aria-hidden="true" />}
      <button type="button" className={on ? "hw-lights hw-lights-on" : "hw-lights"} aria-pressed={on} onClick={() => setOn(!on)}>
        <span className="hw-lights-sw"><Pumpkin s={22} small glow={false} /></span>
        {on ? "Lights on · Esc" : "Lights out"}
      </button>
    </>
  );
}
