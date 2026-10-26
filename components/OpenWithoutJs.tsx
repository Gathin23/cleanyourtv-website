"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

/** A <details> that is open in the server HTML, so the page reads in full without JS, and folds once JS is running. */
export default function OpenWithoutJs({ id, className, summary, children }: { id: string; className: string; summary: ReactNode; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    // Leave it open when the visit came for it (#all, #all-samsung).
    if (ref.current && !/^#all/.test(location.hash)) ref.current.open = false;
  }, []);
  return (
    <details ref={ref} id={id} className={className} open>
      {summary}
      {children}
    </details>
  );
}
