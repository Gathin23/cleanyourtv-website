"use client";

import Link from "next/link";
import { useState } from "react";
import CheckForm from "@/components/CheckForm";
import { TONE_LABEL, brandAnswers } from "@/lib/checker";

/** The hero's checker: the search box, a chip per common brand, and the answer for the chip picked. */
export default function HomeCheck({ counts, total }: { counts: Record<string, number>; total: number }) {
  const answers = brandAnswers(counts, total);
  const [picked, setPicked] = useState<string | null>(null);
  const a = answers.find((x) => x.id === picked);
  return (
    <div className="hc">
      <CheckForm id="tv-b" />
      <div className="chips" role="group" aria-label="Or pick your TV's brand">
        {answers.map((x) => (
          <button key={x.id} type="button" className="chip" aria-pressed={x.id === picked} onClick={() => setPicked(x.id === picked ? null : x.id)}>
            {x.id !== "other" && <span className="dot" aria-hidden="true" style={{ background: x.android ? "#8EE08F" : "#FFDC96" }} />}
            {x.label}
          </button>
        ))}
      </div>
      <div aria-live="polite">
        {a && (
          <div className="result">
            <p className={`result-head r-${a.tone}`}>{TONE_LABEL[a.tone]}</p>
            <div className="result-body">
              <strong>{a.id === "other" ? "Another brand" : a.label}</strong>
              <p>{a.body}</p>
              <Link href={a.href}>{a.cta}</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
