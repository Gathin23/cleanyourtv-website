"use client";

import { useState, type ReactNode } from "react";

// Three made-up pull requests and the comment the bot would leave on each, to show the shape of a review.
// They are samples, not real PRs, so they carry no number or author.
type Fact = [ok: boolean, text: string];
const SAMPLES: { id: string; tab: string; verdict: string; pr: string; files: string; body: string; facts: Fact[]; second: string; labels: string[] }[] = [
  {
    id: "merge", tab: "A new TV for the list", verdict: "merge",
    pr: "Add a tested TCL model to the TV list", files: "examples/<new-tcl-model>/README.md  +12 −0",
    body: "The new entry follows the TV-list format, and every package it switches off is already on the safe list for this brand. Nothing to change.",
    facts: [[true, "Only touches examples/"], [true, "No protected packages"], [true, "No conflicts with main"], [true, "No new permissions or network use"]],
    second: "agrees.", labels: ["bot: merge", "tv-list"],
  },
  {
    id: "addon", tab: "A new card on Home", verdict: "add-on",
    pr: "Add a weather card to the Home screen", files: "launcher/app/src/main/  +240 −8",
    body: "A weather card is a nice idea, but the launcher has to stay small and this adds network use to it. It fits better as its own small app under addons/, so people who want it can add the card to Home.",
    facts: [[false, "Touches the launcher"], [false, "Adds network use"], [true, "No protected packages"], [true, "No conflicts with main"]],
    second: "agrees.", labels: ["bot: add-on"],
  },
  {
    id: "maint", tab: "A protected package", verdict: "needs maintainer",
    pr: "Switch off a protected system package", files: "examples/<tv-folder>/README.md  +3 −0",
    body: "This switches off a package on the protected list. That is always the maintainer’s call, so I have not suggested anything else.",
    facts: [[false, "Switches off a protected package"], [true, "Only touches examples/"], [true, "No conflicts with main"], [true, "No new permissions or network use"]],
    second: "not asked: a hard rule applies.", labels: ["bot: needs maintainer"],
  },
];

/** The section's text (children) over the sample verdicts as tabs, and beside them the comment for the one picked. */
export default function BotSamples({ median, children }: { median: string; children: ReactNode }) {
  const [pick, setPick] = useState(SAMPLES[0].id);
  const s = SAMPLES.find((x) => x.id === pick) || SAMPLES[0];
  return (
    <>
      <div className="stack bot-sample-text">
        {children}
        <div role="tablist" aria-label="Sample verdicts" className="bs-tabs">
          {SAMPLES.map((x) => (
            <button key={x.id} id={`bs-${x.id}`} type="button" role="tab" aria-selected={x.id === s.id} aria-controls="bs-panel" className="bs-tab" onClick={() => setPick(x.id)}>
              {x.tab}
              <span className="ch">{x.verdict}</span>
            </button>
          ))}
        </div>
      </div>
      <article id="bs-panel" role="tabpanel" aria-labelledby={`bs-${s.id}`} className="bs-review">
        <div className="bs-pr">
          <span className="ch bs-label">A sample pull request</span>
          <strong>{s.pr}</strong>
          <code>{s.files}</code>
        </div>
        <div className="bs-body">
          <div className="bs-who">
            <span className="bs-avatar" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 32 32">
                <path d="M11 3.5l5 6 5-6" stroke="#050505" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="3" y="10" width="26" height="18" rx="5" fill="#050505" />
              </svg>
            </span>
            <span><strong>maintainer-bot</strong> <span className="bs-time">reviewed in {median}</span></span>
          </div>
          <p className="bs-verdict">Suggestion: <strong>{s.verdict}</strong></p>
          <p className="bs-text">{s.body}</p>
          <div className="bs-facts">
            <span className="ch bs-label">Facts · no model</span>
            <ul className="plain">
              {s.facts.map(([ok, t]) => (
                <li key={t}>
                  <span className={ok ? "ch bs-ok" : "ch bs-flag"}>{ok ? "OK" : "FLAG"}</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="bs-second">Second opinion: {s.second}</p>
          <ul className="plain bs-labels" aria-label="Labels">
            {s.labels.map((l) => <li key={l}>{l}</li>)}
          </ul>
        </div>
      </article>
    </>
  );
}
