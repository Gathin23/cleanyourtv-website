"use client";

import { useState } from "react";
import { HALLOWEEN } from "@/lib/halloween";

// My parents' TV before and after, the two photos lined up bezel to bezel (public/docs/hero-*.jpg).
// A range input over the whole picture is the slider, so keyboard and screen readers get it for free.
// The after photo is the home page's largest paint. WebP copies at 640, 960 and 1280 px wide (cwebp -q 80) are half the
// JPEG's bytes at full width and under a third at the 960 most phones pick; the JPEG stays for browsers without WebP.
// Both decode in step (no decoding="async"), so the after photo isn't painted alone first.

// The frame's width: the page less its margins on phones, 572 px beside the headline from 1040 px up.
const SIZES = "(min-width: 1040px) 572px, calc(100vw - 36px)";
const webp = (name: string) => `/docs/${name}-640.webp 640w, /docs/${name}-960.webp 960w, /docs/${name}.webp 1280w`;

export default function BeforeAfter() {
  const [pos, setPos] = useState(50);
  return (
    <figure className="ba" style={{ "--pos": `${pos}%` } as React.CSSProperties}>
      <div className="ba-frame">
        <picture>
          <source type="image/webp" srcSet={webp("hero-after")} sizes={SIZES} />
          <img className="ba-img" src="/docs/hero-after.jpg" alt="After: the clean CleanYourTV home screen, a clock and four app tiles" width={1280} height={760} fetchPriority="high" />
        </picture>
        <picture>
          <source type="image/webp" srcSet={webp("hero-before")} sizes={SIZES} />
          <img className="ba-img ba-img-before" src="/docs/hero-before.jpg" alt="Before: the stock home screen with a sponsored banner and rows of promoted apps" width={1280} height={760} />
        </picture>
        {HALLOWEEN && <span className="hw-ba-tint" aria-hidden="true" />}
        <span className="ba-tag" aria-hidden="true">{HALLOWEEN ? "Before · Haunted" : "Before"}</span>
        <span className="ba-tag ba-tag-after" aria-hidden="true">{HALLOWEEN ? "After · Exorcised" : "After"}</span>
        <span className="ba-line" aria-hidden="true">
          <span className="ba-knob">
            {HALLOWEEN ? (
              // Halloween: a bat in place of the arrows; its wings flap while the picture is hovered or dragged (app/halloween-home.css).
              <svg className="hw-bat" width="36" height="22.5" viewBox="0 0 32 20" fill="currentColor">
                <path d="M14.6 6 14 2.4l1.6 1.8h.8L18 2.4 17.4 6c.6 2 .1 6-1.4 9-1.5-3-2-7-1.4-9z" />
                <g className="hw-bat-wing">
                  <path d="M14.6 7C11 4 6 3 1 6c1.5 1.5 1.6 3 1 5 2-1 3.500-.5 4.500 1.500C8 10.500 10 10.500 11.500 12c1-1.500 2-2 2.900-1.500z" />
                </g>
                <g className="hw-bat-wing hw-bat-wing-r">
                  <path d="M17.4 7C21 4 26 3 31 6c-1.500 1.500-1.600 3-1 5-2-1-3.500-.5-4.500 1.500C24 10.500 22 10.500 20.500 12c-1-1.500-2-2-2.900-1.500z" />
                </g>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
              </svg>
            )}
          </span>
        </span>
        {HALLOWEEN && <span className="hw-crt" aria-hidden="true"><i /></span>}
        <input
          className="ba-range"
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Drag to compare the TV before and after"
          aria-valuetext={`${pos}% before`}
        />
      </div>
      <figcaption className="ba-cap ch">My parents&apos; TV, the afternoon it started. Drag to compare.</figcaption>
    </figure>
  );
}
