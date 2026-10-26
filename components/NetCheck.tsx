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

export default function NetCheck() {
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

  return (
    <div className="pv2-net" data-phase={phase}>
      <p className="pv2-lead">
        Run this on your phone while it&rsquo;s on the same Wi-Fi as the TV. It shows whether your network already blocks the servers TVs report
        to.
      </p>
      <ul className="pv2-fine">
        <li>It checks your network&rsquo;s DNS, not the TV itself, so it only means something on the TV&rsquo;s network.</li>
        <li>Testing contacts those servers once, the way any web page visit would: no cookies and no page address go with it, and like any visit they see your IP address.</li>
        <li>It covers Samsung, LG, Roku, Vizio and Hisense VIDAA. Fire TV and Google TV aren&rsquo;t in it yet.</li>
      </ul>
      <button type="button" className="pv2-btn pv2-primary" onClick={run} disabled={phase === "running"}>
        {phase === "running" ? "Checking…" : phase === "idle" ? "Run check" : "Run it again"}
      </button>
      <div aria-live="polite" className="pv2-netout">
        {phase === "running" && <p className="pv2-help">Checking {NET_HOSTS.reduce((n, b) => n + b.hosts.length, 0)} servers. This takes a few seconds.</p>}
        {phase === "nocontrol" && (
          <div className="pv2-result" data-tone="no">
            <p>
              <strong>Couldn&rsquo;t test.</strong> Your phone couldn&rsquo;t reach our test servers either, so we can&rsquo;t tell blocking from
              being offline. Check the Wi-Fi and try again.
            </p>
          </div>
        )}
        {phase === "done" && (
          <ul className="pv2-netlist">
            {results.map((r) => {
              const open = r.hosts.filter(([, s]) => s === "reachable");
              const unclear = r.hosts.filter(([, s]) => s === "unclear");
              const tone = open.length ? "warn" : unclear.length ? "maybe" : "ok";
              return (
                <li key={r.brand} className="pv2-result" data-tone={tone}>
                  <p className="pv2-netbrand">
                    <strong>{r.brand}</strong>
                    <span>
                      {tone === "ok" && "Blocked on your network ✅"}
                      {tone === "warn" && "Your TV can still reach these ⚠️"}
                      {tone === "maybe" && "Couldn't tell; try again"}
                    </span>
                  </p>
                  {open.length > 0 && (
                    <>
                      <ul className="pv2-hosts">
                        {open.map(([h]) => (
                          <li key={h}><code>{h}</code></li>
                        ))}
                      </ul>
                      <a href="#dns" className="pv2-more">How to block them →</a>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
