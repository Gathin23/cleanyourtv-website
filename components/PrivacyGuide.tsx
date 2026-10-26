"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import CopyButton from "@/components/CopyButton";
import NetCheck from "@/components/NetCheck";
import { Keys, StepBody, StepList, Toggles, pathsFor } from "@/components/PrivacySteps";
import { BRANDS, DOMAINS, brandById, choiceOf, pickLabel, stepsFor } from "@/lib/privacy";
import type { Brand, BrandId, Pick, Step, Verdict } from "@/lib/privacy";
import { GH } from "@/lib/parse";
import { lgYear, samsungYear } from "@/lib/tvYear";
import type { YearResult } from "@/lib/tvYear";

// /not-android's guide: 1 pick the TV, 2 answer its question (the year, with a model-number decoder for Samsung and LG;
// the VIDAA version; Roku TV or stick…), 3 tick off the steps. "One step at a time" opens the same steps full screen, one
// per screen, for doing them with the remote in the other hand. Then the levels that go further, and the network check.
// Progress stays in localStorage; #samsung, #samsung-2024 and #roku-tv link straight in. Before JS runs, the brand
// buttons are links to the full list further down the page.

type Level = "l1" | "l2" | "l3";
type Saved = { brand: BrandId | null; pick: Pick; model: string; done: string[] };

const KEY = "cyt-not-android";
const HASH = new RegExp(`^#(${BRANDS.map((b) => b.id).join("|")})(?:-([a-z0-9-]+))?$`);
// In-page anchors: the two levels are tabs, the rest are folds further down that open when linked.
const LEVEL_IDS: Record<string, Level> = { further: "l2", network: "l2", dns: "l3" };
const FOLDS = ["undo", "why", "offline", "all", "sources"];
const HAGEZI = "https://github.com/hagezi/dns-blocklists";
const PERFLYST = "https://raw.githubusercontent.com/Perflyst/PiHoleBlocklist/master/SmartTV.txt";
const IMC = "https://arxiv.org/abs/2409.06203";
const TONE: Record<Verdict, string> = { Block: "block", Keep: "keep", Optional: "maybe", "Don’t block": "keep" };

function load(): Saved | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Saved) : null;
  } catch {
    return null;
  }
}
function save(s: Saved) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* private mode or storage off: progress just isn't kept */
  }
}

/** A pick the brand understands: one of its answers, "all", or (Samsung and LG) a year. */
function validPick(b: Brand, p: string | undefined): Pick {
  if (!p) return null;
  if (p === "all" || b.ask.choices.some((c) => c.id === p) || (b.decoder && /^\d{4}$/.test(p))) return p;
  return null;
}

function openFold(id: string, scroll = true) {
  const el = document.getElementById(id);
  if (!el) return;
  const d = el instanceof HTMLDetailsElement ? el : el.closest("details");
  if (d) d.open = true;
  if (scroll) el.scrollIntoView({ block: "start" });
}

const stepKey = (b: Brand, s: Step) => `${b.id}:${s.id}`;

/** Roughly a minute a step: "about 2 minutes" for one or two, "about 5" for Samsung's six; "a few minutes" before a TV is picked. */
function timeFor(n: number | null): string {
  if (!n) return "a few minutes";
  if (n <= 2) return "about 2 minutes";
  if (n <= 4) return "about 3 minutes";
  if (n <= 6) return "about 5 minutes";
  return "a few minutes";
}

const smooth = (): ScrollBehavior => (matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");

/** Bring the network check into view and put focus on its Run button (or Run again, after a run). */
function goCheck() {
  document.getElementById("check")?.scrollIntoView({ block: "start", behavior: smooth() });
  const btn = document.querySelector<HTMLButtonElement>("#check .na-net-start .btn, #check .na-net-btn");
  btn?.focus({ preventScroll: true });
}

/** The nudge at the end of level 1: the network check, a couple of minutes more. */
function CheckNudge({ onGo, className }: { onGo: () => void; className?: string }) {
  return (
    <a
      href="#check"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        onGo();
      }}
    >
      2 more minutes? Check if your Wi-Fi blocks the rest <span aria-hidden="true">→</span>
    </a>
  );
}
const tvText = (b: Brand, pick: Pick, model: string) => [b.name, pickLabel(b, pick), model && b.decoder && pick && /^\d{4}$/.test(pick) ? model.toUpperCase().replace(/\s+/g, "") : ""].filter(Boolean).join(" ");

function issueUrl(kind: "worked" | "different", b: Brand, pick: Pick, model: string, done: string[], step: Step | null) {
  const tv = tvText(b, pick, model);
  const steps = stepsFor(b, pick);
  const title = kind === "worked" ? `Non-Android TV guide worked: ${tv}` : `Non-Android TV guide: menu looked different on ${tv}${step ? `, step ${steps.indexOf(step) + 1}` : ""}`;
  const lines = [`**TV brand:** ${b.name}`, `**Year or version:** ${pickLabel(b, pick) || "not sure"}`, `**Model number:** ${model || "(not given)"}`, ""];
  if (kind === "worked") {
    lines.push("**Steps:**");
    steps.forEach((s, i) => lines.push(`- ${done.includes(stepKey(b, s)) ? "[x]" : "[ ]"} ${i + 1}. ${s.title}`));
    lines.push("", `Can we show your GitHub name next to these steps, as “Checked on a ${tv} by @you”? (yes / no)`);
  } else {
    if (step) lines.push(`**Step:** ${steps.indexOf(step) + 1}. ${step.title}`, "");
    lines.push("**What did your menu show instead?** (the names on screen, or a photo)", "", "");
  }
  lines.push("", `From https://cleanyour.tv/not-android#${b.id}${pick ? `-${pick}` : ""}`);
  return `${GH}/issues/new?labels=tv-support&title=${encodeURIComponent(title)}&body=${encodeURIComponent(lines.join("\n"))}`;
}

const Check = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12l5 5L20 6" />
  </svg>
);
const Remote = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <rect x="7" y="2" width="10" height="20" rx="3" />
    <path d="M12 7v2M10 13h4" />
  </svg>
);

/** `hero` is the page's kicker, title and subtitle; `after` what goes under the "you need" line. */
export default function PrivacyGuide({ hero, after }: { hero: React.ReactNode; after: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [brandId, setBrandId] = useState<BrandId | null>(null);
  const [pick, setPick] = useState<Pick>(null);
  const [model, setModel] = useState("");
  const [done, setDone] = useState<string[]>([]);
  const [remote, setRemote] = useState(false);
  const [level, setLevel] = useState<Level>("l2");
  // On phones only the step in hand is open; the rest fold to a line, as in the phone design.
  const [phone, setPhone] = useState(false);
  const [openStep, setOpenStep] = useState<string | null>(null);
  // After Mark done: the step to bring into view and focus once it has opened ("done" for the end band).
  const moveTo = useRef<string | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const mq = matchMedia("(max-width: 600px)");
    const on = () => setPhone(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const brand = brandId ? brandById(brandId) : undefined;
  const hash = brand ? `${brand.id}${pick ? `-${pick}` : ""}` : "";

  // First visit: the link's #samsung-2024 wins, then whatever was saved. #dns and #network pick their level; #undo and
  // the other folds open.
  useEffect(() => {
    const fromHash = () => {
      const m = location.hash.match(HASH);
      if (m) {
        const b = brandById(m[1])!;
        setBrandId(b.id);
        setPick(validPick(b, m[2]));
        return true;
      }
      const id = location.hash.slice(1);
      if (LEVEL_IDS[id]) {
        setLevel(LEVEL_IDS[id]);
        requestAnimationFrame(() => document.getElementById("further")?.scrollIntoView({ block: "start" }));
      } else if (FOLDS.includes(id) || id === "check") openFold(id);
      return false;
    };
    // localStorage and the hash are only readable after hydration.
    const restore = () => {
      const s = load();
      if (s) {
        setDone(s.done || []);
        setModel(s.model || "");
      }
      if (!fromHash() && s?.brand && brandById(s.brand)) {
        setBrandId(s.brand);
        setPick(validPick(brandById(s.brand)!, s.pick ?? undefined));
      }
      setReady(true);
    };
    restore();
    addEventListener("hashchange", fromHash);
    // In-page links to a level or a closed fold open it, even when the hash is already there.
    const click = (e: MouseEvent) => {
      const id = (e.target as Element).closest?.('a[href^="#"]')?.getAttribute("href")?.slice(1);
      if (!id) return;
      if (LEVEL_IDS[id]) {
        e.preventDefault();
        setLevel(LEVEL_IDS[id]);
        document.getElementById("further")?.scrollIntoView({ block: "start" });
      } else if (FOLDS.includes(id)) openFold(id, false);
    };
    document.addEventListener("click", click);
    return () => {
      removeEventListener("hashchange", fromHash);
      document.removeEventListener("click", click);
    };
  }, []);

  // Keep the address and localStorage in step with the guide; print only this TV's steps once one is picked.
  useEffect(() => {
    if (!ready) return;
    save({ brand: brandId, pick, model, done });
    const cur = location.hash;
    if (hash ? cur !== `#${hash}` : HASH.test(cur)) {
      try {
        history.replaceState(null, "", hash ? `#${hash}` : location.pathname + location.search);
      } catch {
        /* ignore */
      }
    }
    if (brandId) document.documentElement.dataset.naPrint = "1";
    else delete document.documentElement.dataset.naPrint;
  }, [ready, brandId, pick, model, done, hash]);

  const choose = (id: BrandId) => {
    setBrandId(id);
    setPick(null);
    requestAnimationFrame(() => document.getElementById("year-h")?.scrollIntoView({ block: "start", behavior: "smooth" }));
  };
  const steps = brand ? stepsFor(brand, pick) : [];
  const isDone = (s: Step) => !!brand && done.includes(stepKey(brand, s));
  // Mark done moves on: the step folds, and the next one not done opens and comes into view (the done band after the last).
  const toggle = (s: Step) => {
    const k = stepKey(brand!, s);
    const was = done.includes(k);
    setDone((d) => (was ? d.filter((x) => x !== k) : [...d, k]));
    if (was) {
      setOpenStep(s.id);
      return;
    }
    const i = steps.indexOf(s);
    const next = [...steps.slice(i + 1), ...steps.slice(0, i)].find((x) => !isDone(x));
    moveTo.current = next ? next.id : "done";
    setOpenStep(next?.id ?? null);
  };
  useEffect(() => {
    const to = moveTo.current;
    if (!to) return;
    moveTo.current = null;
    const target = document.getElementById(to === "done" ? "na-done" : `step-${to}`);
    target?.scrollIntoView({ block: "start", behavior: smooth() });
    target?.querySelector<HTMLElement>("h3, [data-head]")?.focus({ preventScroll: true });
  }, [done, openStep]);
  const mark = (s: Step) => {
    const k = stepKey(brand!, s);
    setDone((d) => (d.includes(k) ? d : [...d, k]));
  };
  const count = steps.filter(isDone).length;
  const current = openStep && steps.some((x) => x.id === openStep) ? openStep : steps.find((x) => !isDone(x))?.id;
  // Open: the step in hand, and on a computer every step not done yet. Done steps fold to a line.
  const isOpen = (s: Step) => s.id === current || (!phone && !isDone(s));
  const allDone = steps.length > 0 && count === steps.length;

  return (
    <>
      <section aria-labelledby="page-h" className="wrap page-head na-hero">
        {hero}
        <p className="na-need">
          <Remote />
          <span>
            You need: your TV remote and {timeFor(brand ? steps.length : null)}. Nothing to download.
          </span>
        </p>
        {after}
      </section>

      <section aria-labelledby="pick-h" className="wrap na-pick">
        <h2 id="pick-h" className="na-h2"><span className="ch">1</span>Which TV do you have?</h2>
        <ul className="plain na-brands">
          {BRANDS.filter((b) => b.id !== "google").map((b) => (
            <li key={b.id}>
              <a
                href={`#all-${b.id}`}
                className="na-brand"
                aria-current={b.id === brandId ? "true" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  choose(b.id);
                }}
              >
                <span className="na-brand-name">{b.name}</span>
                <span className="na-brand-os">{b.os}</span>
              </a>
            </li>
          ))}
        </ul>
        {/* Google TV and Android TV are CleanYourTV's own ground: their quick switches stay, one line down. */}
        <p className="na-aside">
          Have Google TV or Android TV?{" "}
          <a
            href="#all-google"
            aria-current={brandId === "google" ? "true" : undefined}
            onClick={(e) => {
              e.preventDefault();
              choose("google");
            }}
          >
            Turn off its quick switches
          </a>
          , then <Link href="/tvs">CleanYourTV can do the rest</Link>.
        </p>
      </section>

      {brand && (
        <>
          <Ask key={brand.id} brand={brand} pick={pick} model={model} setModel={setModel} setPick={setPick} />

          <section aria-labelledby="steps-h" className="na-steps">
            <div className="wrap na-steps-in">
              <div className="spread na-steps-head">
                <div className="stack">
                  <h2 id="steps-h" className="na-h2"><span className="ch">3</span>Your {brand.name} steps</h2>
                  <p className="na-intro">{brand.intro}</p>
                </div>
                <div className="na-progress">
                  <span className="ch">
                    <span>{count} of {steps.length} done</span>
                    <span className="c-mute">{pickLabel(brand, pick) || (pick === "all" ? "Every path" : "Answer 2 for fewer menus")}</span>
                  </span>
                  <div className="na-bar" role="progressbar" aria-label="Steps done" aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={count}>
                    <span style={{ width: `${steps.length ? (count / steps.length) * 100 : 0}%` }} />
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="na-remote-btn"
                onClick={(e) => {
                  opener.current = e.currentTarget;
                  setRemote(true);
                }}
              >
                <Remote />
                One step at a time, with your remote
              </button>
              <p className="na-remote-note">
                <strong>Remote in hand?</strong> Open this page on your phone and use one step at a time: big text, one menu path per screen.
              </p>

              <ol className="plain na-cards">
                {steps.map((s, i) =>
                  !isOpen(s) ? (
                    <li key={s.id} id={`step-${s.id}`} className="na-card na-card-fold" data-done={isDone(s) || undefined}>
                      <button type="button" className="na-card-open" aria-expanded="false" onClick={() => setOpenStep(s.id)}>
                        <span className="ch na-num">Step {i + 1}{s.tag ? ` · ${s.tag}` : ""}</span>
                        <span className="na-card-title">{s.title}</span>
                      </button>
                      <button type="button" className="na-tick" aria-pressed={isDone(s)} aria-label={`Step ${i + 1} done`} onClick={() => toggle(s)}>
                        {isDone(s) && <Check size={22} />}
                      </button>
                    </li>
                  ) : (
                  <li key={s.id} id={`step-${s.id}`} className="na-card" data-done={isDone(s) || undefined}>
                    <div className="na-card-main">
                      <div className="na-card-head">
                        <span className="ch na-num">Step {i + 1}</span>
                        <h3 tabIndex={-1}>{s.title}</h3>
                        {s.tag && <span className="na-tag">{s.tag}</span>}
                      </div>
                      <p className="na-does">{s.does}</p>
                      <StepBody
                        brand={brand}
                        step={s}
                        pick={pick}
                        extra={
                          <a className="na-diff" href={issueUrl("different", brand, pick, model, done, s)} target="_blank" rel="noopener">
                            Menu looked different?
                          </a>
                        }
                      />
                    </div>
                    <div className="na-card-side">
                      <button type="button" className="na-mark" aria-pressed={isDone(s)} onClick={() => toggle(s)}>
                        {isDone(s) ? <Check /> : <span className="na-box" aria-hidden="true" />}
                        {isDone(s) ? "Done" : "Mark done"}
                        <span className="sr-only">: step {i + 1}</span>
                      </button>
                    </div>
                  </li>
                  ),
                )}
              </ol>

              {allDone ? (
                <DoneBand brand={brand} pick={pick} model={model} done={done} hash={hash} time={timeFor(steps.length)} />
              ) : (
                brand.outro && <p className="na-outro">{brand.outro}</p>
              )}
            </div>
          </section>
        </>
      )}

      <Further brand={brand} level={level} setLevel={setLevel} ready={ready} time={timeFor(brand ? steps.length : null)} />

      <section id="check" aria-labelledby="check-h" className="na-check">
        <div className="wrap na-check-in">
          <div className="stack na-check-text">
            <p className="kicker c-green">Check</p>
            <h2 id="check-h" className="h2 h2-sm">Is your home network blocking TV tracking?</h2>
            <p className="dim">Run this on your phone while it&rsquo;s on the same Wi-Fi as the TV.</p>
            <ul className="na-fine">
              <li>It checks your network&rsquo;s DNS, not the TV itself, so it only means something on the TV&rsquo;s network.</li>
              <li>It contacts those servers once, the way any page visit would: no cookies and no page address go with it. Like any visit, they see your IP address.</li>
              <li>It covers Samsung, LG, Roku, Vizio and Hisense VIDAA. Not Fire TV or Google TV yet.</li>
            </ul>
          </div>
          <NetCheck mine={brand?.name} />
        </div>
      </section>

      {remote && brand && (
        <RemoteMode
          brand={brand}
          pick={pick}
          steps={steps}
          start={Math.max(0, steps.findIndex((s) => !isDone(s)))}
          isDone={isDone}
          onDone={mark}
          onExit={(to) => {
            setRemote(false);
            if (to === "network") setLevel("l2");
            requestAnimationFrame(() => {
              if (to === "check") goCheck();
              else if (to) document.getElementById("further")?.scrollIntoView({ block: "start" });
              else opener.current?.focus();
            });
          }}
        />
      )}

      {ready && brand && createPortal(<Printout brand={brand} pick={pick} model={model} hash={hash} time={timeFor(steps.length)} />, document.body)}
    </>
  );
}

/** Step 2: the brand's question, its answers, and for Samsung and LG the model-number decoder. */
function Ask({ brand, pick, model, setModel, setPick }: { brand: Brand; pick: Pick; model: string; setModel: (m: string) => void; setPick: (p: Pick) => void }) {
  const [res, setRes] = useState<YearResult | null>(null);
  // The model-number finder is for "Not sure"; a year picked or linked (#samsung-2024) leaves it closed.
  const [finder, setFinder] = useState(pick === "all");
  const on = choiceOf(brand, pick);
  const decode = brand.decoder === "lg" ? lgYear : samsungYear;
  const example = brand.decoder === "lg" ? "e.g. OLED65C4PUA or 55UQ7570" : "e.g. UN55DU7200";
  return (
    <section aria-labelledby="year-h" className="na-ask">
      <div className="wrap na-ask-in">
        <h2 id="year-h" className="na-h2"><span className="ch">2</span>{brand.ask.q}</h2>
        <p className="na-help">{brand.ask.help}</p>
        <div className="chips na-choices" role="group" aria-label={brand.ask.q}>
          {[...brand.ask.choices, { id: "all", label: "Not sure" }].map((c) => (
            <button
              key={c.id}
              type="button"
              className="na-choice"
              aria-pressed={on === c.id}
              onClick={() => {
                setPick(on === c.id ? null : c.id);
                setFinder(c.id === "all" && on !== c.id);
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
        {brand.decoder && finder && (
          <div className="na-decoder">
            <div className="na-decoder-in">
              <label htmlFor="na-model">Not sure? Type the model number and we&rsquo;ll work out the year</label>
              <input
                id="na-model"
                value={model}
                onChange={(e) => {
                  const v = e.target.value;
                  setModel(v);
                  const r = v.replace(/[^a-z0-9]/gi, "").length >= 5 ? decode(v) : null;
                  setRes(r);
                  if (r?.kind === "year") setPick(String(r.year));
                }}
                placeholder={example}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
              />
              <span className="na-help">{brand.findModel}</span>
            </div>
            <div className="na-decoded" aria-live="polite">
              {!res && <p className="ch c-mute">Type it in to check</p>}
              {res?.kind === "year" && (
                <>
                  <p className="ch c-mint">Looks like a {res.year} TV</p>
                  <p className="na-why">{res.why}</p>
                </>
              )}
              {res?.kind === "either" && (
                <>
                  <p className="ch c-amber">Could be either year</p>
                  <p className="na-why">{res.why} Bought it new recently? It&rsquo;s the later one.</p>
                  <div className="chips">
                    {res.years.map((y) => (
                      <button key={y} type="button" className="na-choice" aria-pressed={pick === String(y)} onClick={() => setPick(String(y))}>
                        {y}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {res?.kind === "unknown" && (
                <>
                  <p className="ch c-mute">Couldn&rsquo;t read that one</p>
                  <p className="na-why">{res.why} Pick the year above if you know it, or &ldquo;Not sure&rdquo; for every path.</p>
                </>
              )}
            </div>
          </div>
        )}
        {!brand.decoder && brand.findVersion && <p className="na-help">{brand.findVersion}</p>}
      </div>
    </section>
  );
}

/** Every step ticked: the level-1 band, and what the old guide offered at the end: feedback, print, send to family. */
function DoneBand({ brand, pick, model, done, hash, time }: { brand: Brand; pick: Pick; model: string; done: string[]; hash: string; time: string }) {
  const [msg, setMsg] = useState("");
  const [link, setLink] = useState("");
  const share = async () => {
    const url = `${location.origin}/not-android#${hash}`;
    const text = `Steps to stop a ${brand.name} TV tracking what you watch, ${time} with the remote.`;
    setLink("");
    if (navigator.share) {
      try {
        await navigator.share({ title: "Clean up your non-Android TV", text, url });
        return;
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setMsg("Link copied. Paste it into a message to your family.");
    } catch {
      setLink(url);
      setMsg("Copy this link:");
    }
  };
  return (
    <div className="na-done" id="na-done">
      <div className="na-done-band">
        <div className="stack">
          <span className="ch">Level 1 done</span>
          <strong data-head tabIndex={-1}>Your {brand.name} has stopped the tracking it lets you switch off.</strong>
          {brand.outro && <span>{brand.outro}</span>}
          <CheckNudge onGo={goCheck} className="na-nudge" />
        </div>
        <a href="#further" className="btn na-done-go">Go further</a>
      </div>
      <div className="na-done-more">
        <div className="stack">
          <h3 className="h3">Did this work on your TV?</h3>
          <p className="dim">Tell us on GitHub, so the next person with your TV knows the path is right.</p>
          <div className="btns">
            <a className="btn btn-ghost btn-sm" href={issueUrl("worked", brand, pick, model, done, null)} target="_blank" rel="noopener">Worked on my TV</a>
            <a className="btn btn-ghost btn-sm" href={issueUrl("different", brand, pick, model, done, null)} target="_blank" rel="noopener">My menu looked different</a>
          </div>
        </div>
        <div className="stack">
          <h3 className="h3">Do this for your parents</h3>
          <p className="dim">Print the steps for their TV, or send them the link. It opens straight on these steps.</p>
          <div className="btns">
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => window.print()}>Print or save as PDF</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={share}>Send to family</button>
          </div>
          <p className="na-msg" aria-live="polite">
            {msg}
            {link && <input className="na-copy" readOnly value={link} onFocus={(e) => e.currentTarget.select()} aria-label="Link to these steps" />}
          </p>
        </div>
      </div>
    </div>
  );
}

/** One step per screen, for doing them with the remote in the other hand. */
function RemoteMode(props: {
  brand: Brand;
  pick: Pick;
  steps: Step[];
  start: number;
  isDone: (s: Step) => boolean;
  onDone: (s: Step) => void;
  onExit: (to?: "network" | "check") => void;
}) {
  const { brand, pick, steps, start, isDone, onDone, onExit } = props;
  const [i, setI] = useState(start);
  const head = useRef<HTMLHeadingElement>(null);
  const exit = useRef(onExit);
  useEffect(() => {
    exit.current = onExit;
  });
  const finished = i >= steps.length;
  const s = steps[Math.min(i, steps.length - 1)];

  useEffect(() => {
    document.documentElement.classList.add("menu-open");
    const key = (e: KeyboardEvent) => e.key === "Escape" && exit.current();
    addEventListener("keydown", key);
    return () => {
      document.documentElement.classList.remove("menu-open");
      removeEventListener("keydown", key);
    };
  }, []);
  // Each new screen starts at its heading, for screen readers and keyboards.
  useEffect(() => {
    head.current?.focus();
  }, [i]);

  const { list, anyYear } = pathsFor(brand, s, pick);
  return (
    <div className="na-rm" role="dialog" aria-modal="true" aria-label={`${brand.name}, one step at a time`}>
      <header className="na-rm-head">
        <div className="na-rm-top">
          <button type="button" className="na-rm-exit" onClick={() => onExit()}>
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
            Full guide
          </button>
          <span className="ch c-amber">{[brand.name, pickLabel(brand, pick)].filter(Boolean).join(" · ")}</span>
        </div>
        <div className="na-rm-bars" role="progressbar" aria-label="Steps done" aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={steps.filter(isDone).length}>
          {steps.map((x, k) => (
            <span key={x.id} data-on={isDone(x) || undefined} data-cur={k === i || undefined} />
          ))}
        </div>
      </header>

      {!finished ? (
        <>
          <div className="na-rm-main">
            <div className="stack">
              <span className="ch c-amber na-rm-n">
                Step {i + 1} of {steps.length}
                {s.tag ? ` · ${s.tag}` : ""}
              </span>
              <h2 ref={head} tabIndex={-1}>{s.title}</h2>
              <p className="na-does">{s.does}</p>
            </div>
            {s.text && <p className="na-rm-text">{s.text}</p>}
            {list.map((v, k) => (
              <div key={k} className="na-rm-variant">
                {list.length > 1 && v.label && <p className="na-vlabel">{v.label}</p>}
                <span className="na-rm-label">On your remote, go to</span>
                <ol className="plain na-rm-path">
                  {v.crumbs.map((c, n) => (
                    <li key={n}>
                      <span className="ch">{n + 1}</span>
                      <span className={n === v.crumbs.length - 1 ? "na-key na-key-last" : "na-key"}>{c}</span>
                    </li>
                  ))}
                </ol>
                {(v.items || []).length > 0 && (
                  <div className="na-rm-then">
                    <span className="na-rm-label">Then</span>
                    <Toggles items={v.items || []} />
                  </div>
                )}
                {v.note && <p className="na-note">{v.note}</p>}
              </div>
            ))}
            {!list.length && (s.items || []).length > 0 && (
              <div className="na-rm-then">
                <span className="na-rm-label">Then</span>
                <Toggles items={s.items || []} />
              </div>
            )}
            {anyYear && (
              <div className="na-alt">
                <span>Can&rsquo;t find it? On any year:</span>
                <Keys crumbs={anyYear.crumbs} label="any year" />
              </div>
            )}
            {s.note && <p className="na-note">{s.note}</p>}
            <details className="na-undo">
              <summary>Undo this step</summary>
              <p>{s.undo}</p>
            </details>
          </div>
          <footer className="na-rm-foot">
            <button type="button" className="btn btn-ghost" onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}>Back</button>
            <button
              type="button"
              className="btn btn-mint"
              onClick={() => {
                onDone(s);
                setI(i + 1);
              }}
            >
              {i === steps.length - 1 ? "Done, finish" : "Done, next step"}
            </button>
          </footer>
        </>
      ) : (
        <div className="na-rm-main na-rm-done">
          <span className="na-rm-tick" aria-hidden="true"><Check size={36} /></span>
          <h2 ref={head} tabIndex={-1}>Your {brand.name} is done.</h2>
          <p className="na-rm-text">It has stopped the tracking it lets you switch off.{brand.outro ? ` ${brand.outro}` : ""}</p>
          <button type="button" className="btn btn-green na-rm-nudge" onClick={() => onExit("check")}>
            2 more minutes? Check if your Wi-Fi blocks the rest <span aria-hidden="true">→</span>
          </button>
          <button type="button" className="btn btn-blue" onClick={() => onExit("network")}>Go further: guest network</button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setI(0)}>Start again</button>
        </div>
      )}
    </div>
  );
}

/** Go further: level 1 is the steps above, 2 the guest network, 3 DNS blocking. Every level reads without JS. */
function Further({ brand, level, setLevel, ready, time }: { brand?: Brand; level: Level; setLevel: (l: Level) => void; ready: boolean; time: string }) {
  const levels: [Level, string, string, string][] = [
    ["l1", "Level 1", time.replace(/^about /, ""), "TV settings"],
    ["l2", "Level 2", "10 minutes", "Guest network"],
    ["l3", "Level 3", "Advanced", "DNS blocking"],
  ];
  const tables = DOMAINS.filter((d) => !brand || d.brand === brand.name);
  return (
    <section id="further" aria-labelledby="further-h" className="na-further">
      <div className="wrap na-further-in">
        <div className="stack">
          <p className="kicker c-blue">Go further</p>
          <h2 id="further-h" className="h2">Settings only cover what the TV maker lets you switch off.</h2>
        </div>
        <div className="na-levels" role="tablist" aria-label="Levels">
          {levels.map(([id, k, time, name]) => (
            <button key={id} id={`tab-${id}`} type="button" role="tab" aria-selected={level === id} aria-controls={`panel-${id}`} className="na-level" onClick={() => setLevel(id)}>
              <span className="ch">{k} · {time}</span>
              <span className="na-level-name">{name}</span>
            </button>
          ))}
        </div>

        <div id="panel-l1" role="tabpanel" aria-labelledby="tab-l1" className="na-panel" hidden={ready && level !== "l1"}>
          <p className="dim">
            The steps above: {time} with your remote, and the biggest single change. The <a href={IMC}>IMC 2024 study</a> found that opting
            out in the settings stopped Samsung and LG TVs&rsquo; traffic to ACR servers.
          </p>
          <a href="#pick-h">Back to your steps</a>
        </div>

        <div id="panel-l2" role="tabpanel" aria-labelledby="tab-l2" className="na-panel na-panel-2" hidden={ready && level !== "l2"}>
          <div id="network" className="stack">
            <h3 className="na-h3">Put the TV on your guest network</h3>
            <p className="dim">
              So it can&rsquo;t see your laptop or phone. The NSA&rsquo;s home-network advice is to keep guests on{" "}
              <a href="https://media.defense.gov/2023/Feb/22/2003165170/-1/-1/0/CSI_BEST_PRACTICS_FOR_SECURING_YOUR_HOME_NETWORK.PDF">a separate network from your more trusted devices</a>.
              Researchers at Gamers Nexus <a href="https://cyberinsider.com/lg-smart-tvs-found-scanning-home-networks-for-nearby-devices/">found an LG TV listing 38 devices</a> on one home network
              (LG says device discovery is a standard function).
            </p>
          </div>
          <ol className="plain na-mini">
            <li>
              <span className="ch c-blue">1</span>
              <span><strong>Turn on the guest network.</strong> In your router&rsquo;s app or admin page. Some routers call it an IoT network.</span>
            </li>
            <li>
              <span className="ch c-blue">2</span>
              <span><strong>Move the TV to it.</strong> On the TV, forget your main Wi-Fi and join the guest one. If the TV is wired, use Wi-Fi instead, or a port your router gives to guests.</span>
            </li>
            <li>
              <span className="ch c-amber">!</span>
              <span><strong>Know the catch.</strong> Casting from a phone on your main Wi-Fi stops working across the two networks, unless your router passes mDNS between them. Join your phone to the guest network to cast.</span>
            </li>
            <li className="na-mini-undo"><strong>Undo:</strong> move the TV back to your main Wi-Fi.</li>
          </ol>
        </div>

        <div id="panel-l3" role="tabpanel" aria-labelledby="tab-l3" className="na-panel na-panel-3" hidden={ready && level !== "l3"}>
          <p id="dns" className="dim na-wide">
            A DNS blocker goes further: the TV can&rsquo;t find the tracking servers at all. In 2019, Princeton researchers found{" "}
            <a href="https://blog.citp.princeton.edu/2019/09/18/watching-you-watch-the-tracking-ecosystem-of-over-the-top-tv-streaming-devices">Roku&rsquo;s privacy options stopped its ad ID leaking</a>,
            but not the number of trackers it contacted.
          </p>
          <div className="grid-cards na-blockers">
            <div className="card">
              <span className="ch c-green">Easiest · nothing to install</span>
              <h3 className="h3">NextDNS</h3>
              <p>
                Point your router&rsquo;s DNS at it. Free for 300,000 queries a month; past that it{" "}
                <a href="https://nextdns.io/pricing">stops blocking without telling you</a>, and a TV plus a household can get there.
              </p>
            </div>
            <div className="card">
              <span className="ch c-amber">Needs an always-on computer</span>
              <h3 className="h3">Pi-hole</h3>
              <p>
                Runs on a Raspberry Pi or any always-on computer. <a href="https://docs.pi-hole.net/main/basic-install/">Install it</a>, then set your router&rsquo;s DHCP DNS to its address.
              </p>
            </div>
            <div className="card">
              <span className="ch c-amber">Script or Docker</span>
              <h3 className="h3">AdGuard Home</h3>
              <p>
                <a href="https://github.com/AdguardTeam/AdGuardHome">The same idea</a>. Use Adblock-format lists: its plain-domain rules{" "}
                <a href="https://adguard-dns.io/kb/general/dns-filtering-syntax/">don&rsquo;t cover subdomains</a>.
              </p>
            </div>
          </div>

          <div className="stack na-list-box">
            <h3 className="na-h3">Then add the tracker list{brand ? ` for your ${brand.name}` : " for your TV"}</h3>
            {brand?.list ? (
              <>
                <p className="dim">
                  Add <a href={HAGEZI}>HaGeZi&rsquo;s</a> <code>{brand.list}</code> list. HaGeZi&rsquo;s standard lists (Light, Multi, Pro and up) already include
                  all the native trackers. For Pi-hole and AdGuard Home the address is:
                </p>
                <div className="na-url">
                  <code id="na-list-url">https://cdn.jsdelivr.net/gh/hagezi/dns-blocklists@latest/adblock/{brand.list}.txt</code>
                  <CopyButton from="na-list-url" label="Copy" className="na-url-copy" />
                </div>
              </>
            ) : brand ? (
              <p className="dim">{brand.listNote}</p>
            ) : (
              <p className="dim">
                <a href={HAGEZI}>HaGeZi</a> has a native list for each brand: <code>native.samsung</code>, <code>native.lgwebos</code>, <code>native.roku</code> or{" "}
                <code>native.amazon</code> for Fire TV. Pick your TV above for its address.
              </p>
            )}
            <p className="na-warn">
              <strong>On NextDNS, &ldquo;Native Tracking Protection&rdquo; isn&rsquo;t enough for a TV.</strong> It covers eight vendors. Its Samsung entry is{" "}
              <a href="https://github.com/nextdns/native-tracking-domains/tree/main/domains">phone and Knox telemetry</a>, not the TV&rsquo;s ACR or ad servers,
              and there&rsquo;s no LG, Vizio or Hisense entry. Add a HaGeZi list from the Blocklists tab instead.
            </p>
          </div>

          {tables.length > 0 && (
            <details className="na-fold-sm" id="domains">
              <summary>{brand ? `${brand.name}: which domains to block, and which to keep` : "Which domains to block, and which to keep"}</summary>
              {tables.map((d) => (
                <div key={d.brand} className="na-dom">
                  {!brand && <h4 className="na-h4">{d.brand}</h4>}
                  <div className="na-table">
                    <table>
                      <thead>
                        <tr>
                          <th scope="col">Domain</th>
                          <th scope="col">What it is</th>
                          <th scope="col">Block?</th>
                        </tr>
                      </thead>
                      <tbody>
                        {d.rows.map(([dom, what, verdict, note]) => (
                          <tr key={dom}>
                            <td className="na-mono">{dom}</td>
                            <td>{what}</td>
                            <td>
                              <strong className="na-verdict" data-tone={TONE[verdict]}>{verdict}</strong> {note && <span>{note}</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {d.after && <p className="na-small">{d.after}</p>}
                </div>
              ))}
              <p className="na-small">
                Keep update domains open: an up-to-date TV is safer. From <a href={HAGEZI}>HaGeZi&rsquo;s lists</a>, <a href={PERFLYST}>Perflyst&rsquo;s SmartTV list</a> and the{" "}
                <a href={IMC}>IMC 2024 study</a>.
              </p>
            </details>
          )}
          <details className="na-fold-sm">
            <summary>The blocker sees nothing from the TV? Redirect hard-coded DNS at the router</summary>
            <p className="dim">
              Some devices, notably Google&rsquo;s, ignore the DNS your router hands out and ask <code>8.8.8.8</code> directly. A firewall rule sends every outgoing
              request on port 53 to your own blocker, and port 853 (DNS over TLS) is blocked so it can&rsquo;t be used to go around it. Guides:{" "}
              <a href="https://docs.netgate.com/pfsense/en/latest/recipes/dns-redirect.html">pfSense</a>,{" "}
              <a href="https://openwrt.org/docs/guide-user/firewall/fw3_configurations/intercept_dns">OpenWrt</a>,{" "}
              <a href="https://homenetworkguy.com/how-to/redirect-all-dns-requests-to-local-dns-resolver/">OPNsense</a> (community),{" "}
              <a href="https://forum.mikrotik.com/t/redirect-all-dns-requests-to-local-hosted-pi-hole/160801">MikroTik</a> (forum); UniFi does it under CyberSecure ›
              Content Filter.
            </p>
            <p className="na-small">
              Most ISP routers can&rsquo;t do this; then set the router&rsquo;s DHCP DNS and accept that Google devices may go around it. Some devices show &ldquo;no
              internet&rdquo; once <code>8.8.8.8</code> is redirected. HaGeZi&rsquo;s <code>doh-vpn-proxy-bypass</code> list stops devices sidestepping the blocker over
              DNS-over-HTTPS or VPNs.
            </p>
          </details>
          <p className="na-small">
            <strong className="c-mint">Undo:</strong> allow the blocked name from the blocker&rsquo;s query log, or turn the list off. Don&rsquo;t block update domains.{" "}
            Done? <a href="#check">Check your network</a> from your phone.
          </p>
        </div>
      </div>
    </section>
  );
}

/** Print target: only this TV's steps, in black on white. */
function Printout({ brand, pick, model, hash, time }: { brand: Brand; pick: Pick; model: string; hash: string; time: string }) {
  return (
    <section className="na-print" aria-hidden="true">
      <h1>Clean up your non-Android TV</h1>
      <p className="na-print-tv">{tvText(brand, pick, model)}</p>
      <p>{time.charAt(0).toUpperCase() + time.slice(1)} with the TV remote. &ldquo;Turn off&rdquo; means untick or switch off, &ldquo;Turn on&rdquo; means tick or switch on. Every step can be undone the same way.</p>
      {brand.findVersion && <p>{brand.findVersion}</p>}
      <StepList brand={{ ...brand, steps: stepsFor(brand, pick) }} pick={pick} />
      {brand.outro && <p>{brand.outro}</p>}
      <p className="na-print-foot">cleanyour.tv/not-android#{hash} · Menu paths last checked 26 Oct 2026</p>
    </section>
  );
}
