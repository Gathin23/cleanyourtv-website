import type { CSSProperties } from "react";

// Halloween decorations drawn from CSS only (app/halloween-home.css): a candle-lit jack-o'-lantern, the drips off the
// stripe, the garland of small ones under the header, the fog in the hero. No JS, no images.

/** A jack-o'-lantern of three lobes, a stem and a face that flickers; `s` is its width in px. */
export function Pumpkin({ s, delay = 0, small = false, glow = true }: { s: number; delay?: number; small?: boolean; glow?: boolean }) {
  return (
    <span className="hw-pk" style={{ "--s": `${s}px`, "--d": `${delay}s` } as CSSProperties}>
      {glow && <span className="hw-pk-glow" />}
      <span className="hw-pk-stem" />
      <span className="hw-pk-lobe hw-pk-l" />
      <span className="hw-pk-lobe hw-pk-r" />
      <span className="hw-pk-lobe hw-pk-c" />
      <span className="hw-pk-face">
        <span className="hw-pk-eye hw-pk-e1" />
        <span className="hw-pk-eye hw-pk-e2" />
        {!small && <span className="hw-pk-nose" />}
        <span className="hw-pk-mouth" />
      </span>
    </span>
  );
}

const DRIPS: [string, string, number, number][] = [
  ["8%", "#e9e9e9", 18, 5.2],
  ["31%", "#ff9a3c", 46, 7],
  ["38.5%", "#ff9a3c", 22, 4.6],
  ["48%", "#8ee08f", 34, 6.1],
  ["63%", "#d58be6", 28, 8.2],
  ["75%", "#ff6b6b", 54, 6.6],
  ["81.5%", "#ff6b6b", 16, 5.4],
  ["94%", "#6fa8ff", 24, 7.4],
];

/** The stripe's colours running down as drips. Sits in the masthead, under the stripe. */
export function Drips() {
  return (
    <div className="hw-drips" aria-hidden="true">
      {DRIPS.map(([l, c, h, d], i) => (
        <span key={l} className="hw-drip" style={{ left: l, "--c": c, "--h": `${h}px`, "--t": `${d}s`, "--o": `${-i * 0.7}s` } as CSSProperties}>
          <span className="hw-drip-run" />
          <span className="hw-drip-drop" />
        </span>
      ))}
    </div>
  );
}

/** A wire sagging under the header with twelve small pumpkins swaying and twinkling on it. */
export function Garland() {
  return (
    <div className="hw-garland" aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => (
        <span key={`w${i}`} className="hw-wire" style={{ left: `${(i * 100) / 12}%` }} />
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <span key={`b${i}`} className="hw-bulb" style={{ left: `${((i + 0.5) * 100) / 12}%`, "--sw": `${4 + (i % 3)}s`, "--so": `${-i * 0.6}s`, "--tw": `${1.6 + (i % 4) * 0.4}s`, "--to": `${-i * 0.35}s` } as CSSProperties}>
          <span className="hw-bulb-cord" />
          <span className="hw-bulb-pk">
            <Pumpkin s={22} delay={i % 3} small />
          </span>
        </span>
      ))}
    </div>
  );
}

/** Three slow clouds of fog behind the hero. */
export function Fog() {
  return (
    <div className="hw-fog" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span key={i} style={{ bottom: -80 + i * 20, left: `${-10 + i * 35}%`, animationDuration: `${16 + i * 5}s`, animationDelay: `${-i * 4}s` }} />
      ))}
    </div>
  );
}
