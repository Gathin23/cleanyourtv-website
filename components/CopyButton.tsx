"use client";

import { useState } from "react";

/** Copies `text`, or the text of the element with id `from` (so a long text sits in the page once, not again in its props). */
export default function CopyButton({ text, from, label, className }: { text?: string; from?: string; label: string; className?: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    const value = text ?? (from ? document.getElementById(from)?.textContent ?? "" : "");
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const t = document.createElement("textarea");
      t.value = value;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    setDone(true);
    setTimeout(() => setDone(false), 1600);
  };
  return (
    <button type="button" className={className} onClick={copy}>
      <span aria-live="polite">{done ? "Copied" : label}</span>
    </button>
  );
}
