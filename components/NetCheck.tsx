"use client";

import { useState } from "react";
import { NET_CONTROL, NET_HOSTS } from "@/lib/privacy";

// "Is your home network blocking TV tracking?" The phone, on the TV's Wi-Fi, asks for a few known tracking hosts.
// An opaque answer means the name resolved and the server replied: not blocked. A network error while the control
// host loads means the name didn't resolve (or resolved to nowhere): blocked. A timeout tells us nothing.
// Runs only when tapped.

type State = "reachable" | "blocked" | "unclear";
type Result = { brand: string; list: string; hosts: [string, State][] };

const TIMEOUT = 6000;
const SAY: Record<State, string> = { reachable: "Reachable", blocked: "Blocked", unclear: "Couldn’t tell" };

async function probe(url: string): Promise<State> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT);
  try {
    await fetch(url, { mode: "no-cors", cache: "no-store", credentials: "omit", referrerPolicy: "no-referrer", signal: ctl.signal });
    return "reachable";
  } catch (e) {
    return (e as Error).name === "AbortError" ? "unclear" : "blocked";
  } finally {
    clearTimeout(timer);
  }
}

/** A brand's row: reachable if any host answered, blocked if all failed, otherwise unclear. */
const rowState = (r: Result): State =>
  r.hosts.some(([, s]) => s === "reachable") ? "reachable" : r.hosts.every(([, s]) => s === "blocked") ? "blocked" : "unclear";

export default function NetCheck({ mine }: { mine?: string }) {
  const [phase, setPhase] = useState<"idle" | "running" | "done" | "nocontrol">("idle");
  const [results, setResults] = useState<Result[]>([]);

  const run = async () => {
    setPhase("running");
    setResults([]);
    const [control, hosts] = await Promise.all([
      Promise.all(NET_CONTROL.map(probe)),
      Promise.all(NET_HOSTS.map(async (b) => ({ ...b, hosts: await Promise.all(b.hosts.map(async (h) => [h, await probe(`https://${h}/`)] as [string, State])) }))),
    ]);
    if (!control.includes("reachable")) {
      setPhase("nocontrol");
      return;
    }
    setResults(hosts);
    setPhase("done");
  };

  const states = results.map(rowState);
  const verdict = states.includes("reachable") ? "open" : states.every((s) => s === "blocked") ? "blocked" : "unclear";
  return (
    <div className="na-net" aria-busy={phase === "running"}>
      {(phase === "idle" || phase === "running") && (
        <div className="na-net-start">
          <span className="ch c-mute">
            {phase === "running" ? `Checking ${NET_HOSTS.reduce((n, b) => n + b.hosts.length, 0)} servers…` : "Takes a few seconds"}
          </span>
          <button type="button" className="btn btn-green" onClick={run} disabled={phase === "running"}>
            {phase === "running" ? "Checking…" : "Run check"}
          </button>
        </div>
      )}
      <div aria-live="polite">
        {phase === "nocontrol" && (
          <div className="na-net-out">
            <div className="na-net-head" data-tone="unclear">
              <strong>Couldn&rsquo;t test</strong>
              <span>Your phone couldn&rsquo;t reach our test servers either, so we can&rsquo;t tell blocking from being offline. Check the Wi-Fi and try again.</span>
            </div>
            <div className="na-net-again">
              <button type="button" className="na-net-btn" onClick={run}>Run again</button>
            </div>
          </div>
        )}
        {phase === "done" && (
          <div className="na-net-out">
            <div className="na-net-head" data-tone={verdict}>
              {verdict === "open" && (
                <>
                  <strong>Not blocked yet</strong>
                  <span>Your network lets TVs reach their tracking servers. The TV settings still work; level 3 adds blocking.</span>
                </>
              )}
              {verdict === "blocked" && (
                <>
                  <strong>Blocked on your network</strong>
                  <span>None of the tracking servers we tried answered. Your blocker is working for these TVs.</span>
                </>
              )}
              {verdict === "unclear" && (
                <>
                  <strong>Couldn&rsquo;t tell for every TV</strong>
                  <span>Some servers didn&rsquo;t answer in time. Try again in a moment.</span>
                </>
              )}
            </div>
            <ul className="plain na-net-rows">
              {results.map((r, k) => (
                <li key={r.brand} data-mine={r.brand === mine || undefined}>
                  <span className="na-net-name">
                    {r.brand}
                    {r.brand === mine && <span> · your TV</span>}
                  </span>
                  <span className="ch na-net-state" data-tone={states[k]}>{SAY[states[k]]}</span>
                  {states[k] === "reachable" && (
                    <span className="na-net-hosts">
                      {r.hosts.filter(([, s]) => s === "reachable").map(([h]) => h).join(", ")}
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <div className="na-net-again">
              <button type="button" className="na-net-btn" onClick={run}>Run again</button>
              {verdict !== "blocked" && <a href="#dns">Set up blocking</a>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
