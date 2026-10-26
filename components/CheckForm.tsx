"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { routeFor } from "@/lib/checker";

/** "Does it work on my TV?": a brand or model goes to the TV list, searched, or to the privacy guide for TVs that are not Android. */
export default function CheckForm({ id, placeholder = "Type a brand or model", small, onGo }: { id: string; placeholder?: string; small?: boolean; onGo?: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  return (
    <form
      role="search"
      action="/tvs"
      className={small ? "check check-sm" : "check"}
      onSubmit={(e) => {
        e.preventDefault();
        onGo?.();
        router.push(routeFor(q));
      }}
    >
      <label htmlFor={id}>Does it work on my TV?</label>
      <div className="check-row">
        <input id={id} name="q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} autoComplete="off" spellCheck={false} />
        <button type="submit">Check</button>
      </div>
    </form>
  );
}
