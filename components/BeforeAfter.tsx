"use client";

import { useState } from "react";

// My parents' TV before and after, the two photos lined up bezel to bezel (public/docs/hero-*.jpg).
// A range input over the whole picture is the slider, so keyboard and screen readers get it for free.
export default function BeforeAfter() {
  const [pos, setPos] = useState(50);
  return (
    <figure className="ba" style={{ "--pos": `${pos}%` } as React.CSSProperties}>
      <div className="ba-frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="ba-img" src="/docs/hero-after.jpg" alt="After: the clean CleanYourTV home screen, a clock and four app tiles" width={1280} height={760} fetchPriority="high" decoding="async" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="ba-img ba-img-before" src="/docs/hero-before.jpg" alt="Before: the stock home screen with a sponsored banner and rows of promoted apps" width={1280} height={760} decoding="async" />
        <span className="ba-tag" aria-hidden="true">Before</span>
        <span className="ba-tag ba-tag-after" aria-hidden="true">After</span>
        <span className="ba-line" aria-hidden="true">
          <span className="ba-knob">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
            </svg>
          </span>
        </span>
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
