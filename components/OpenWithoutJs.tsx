"use client";

import { useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";

/**
 * A <details> that is open in the server HTML, so the page reads in full without JS, and folds once JS is running.
 * On a first load the head script (lib/prepaint.ts) has already folded it when the HTML was read (data-folded); then it's
 * left alone, so a fold the browser opened since (find in page, a search result's #:~:text= link) stays open.
 */
export default function OpenWithoutJs({ id, className, summary, children }: { id: string; className: string; summary: ReactNode; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  // A layout effect, so on a client-side visit it folds before the first paint.
  useLayoutEffect(() => {
    // Leave it open when the visit came for it (#all, #all-samsung).
    if (ref.current && !ref.current.dataset.folded && !/^#all/.test(location.hash)) ref.current.open = false;
  }, []);
  return (
    // The head script may have folded it before hydration.
    <details ref={ref} id={id} className={className} open suppressHydrationWarning>
      {summary}
      {children}
    </details>
  );
}
