"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { createPortal } from "react-dom";
import { StepBody, StepList } from "@/components/PrivacySteps";
import { BRANDS, brandById, yearLabel } from "@/lib/privacy";
import type { Brand, BrandId } from "@/lib/privacy";
import { GH } from "@/lib/parse";
import { lgYear, samsungYear } from "@/lib/tvYear";
import type { YearResult } from "@/lib/tvYear";

// /not-android level 1: pick the TV, find its year, then one step per card with Done, Back and Next, the way the home
// page's How-to wizard walks through setup. Progress is kept in localStorage; #samsung and #samsung-2024 link straight in.
// Before JS runs, the brand buttons are plain links to the full list further down the page.

type Year = number | "all" | null;
type Saved = { brand: BrandId | null; year: Year; model: string; idx: number; done: string[] };

const KEY = "cyt-privacy";
const LEVELS = ["network", "dns", "check", "undo", "why", "offline", "all"];
const HASH = new RegExp(`^#(${BRANDS.map((b) => b.id).join("|")})(?:-(\\d{4}|all))?$`);

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

/** Open a <details> level the page links to (#dns, #undo…) and bring it into view. */
function openLevel(id: string, scroll = true) {
  const el = document.getElementById(id);
  if (!el) return;
  const d = el instanceof HTMLDetailsElement ? el : el.closest("details");
  if (d) d.open = true;
  if (scroll) el.scrollIntoView({ block: "start" });
}

const yearText = (b: Brand, y: Year) => (y == null || y === "all" ? "year not sure" : yearLabel(b, y));

function issueUrl(kind: "worked" | "different", b: Brand, y: Year, model: string, done: string[], stepIdx: number) {
  const yr = y == null || y === "all" ? "not sure" : String(y);
  const step = b.steps[stepIdx];
  const title =
    kind === "worked"
      ? `Privacy guide worked: ${b.name} ${yr}${model ? ` ${model}` : ""}`
      : `Privacy guide: menu looked different on ${b.name} ${yr}${model ? ` ${model}` : ""}, step ${stepIdx + 1}`;
  const lines = [
    `**TV brand:** ${b.name}`,
    `**Year:** ${yr}`,
    `**Model number:** ${model || "(not given)"}`,
    "",
  ];
  if (kind === "worked") {
    lines.push("**Steps:**");
    b.steps.forEach((s, i) => lines.push(`- ${done.includes(`${b.id}:${s.id}`) ? "[x]" : "[ ]"} ${i + 1}. ${s.title}`));
    lines.push("", "Can we show your GitHub name next to these steps, as “Checked on a " + `${yr} ${b.name}${model ? ` ${model}` : ""} by @you”? (yes / no)`);
  } else {
    lines.push(`**Step:** ${stepIdx + 1}. ${step.title}`, "", "**What did your menu show instead?** (the names on screen, or a photo)", "", "");
  }
  lines.push("", `From https://cleanyour.tv/not-android#${b.id}${y == null ? "" : `-${y}`}`);
  return `${GH}/issues/new?labels=tv-support&title=${encodeURIComponent(title)}&body=${encodeURIComponent(lines.join("\n"))}`;
}

export default function PrivacyGuide() {
  const [ready, setReady] = useState(false);
  const [brandId, setBrandId] = useState<BrandId | null>(null);
  const [year, setYear] = useState<Year>(null);
  const [model, setModel] = useState("");
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState<string[]>([]);
  const root = useRef<HTMLDivElement>(null);

  const brand = brandId ? brandById(brandId) : undefined;
  const hash = brand ? (brand.decoder && year != null ? `${brand.id}-${year}` : brand.id) : "";

  // First visit: the link's #samsung-2024 wins, then whatever was saved; also open #dns and friends.
  useEffect(() => {
    const fromHash = () => {
      const m = location.hash.match(HASH);
      if (m) {
        const s = load();
        const y: Year = m[2] ? (m[2] === "all" ? "all" : Number(m[2])) : null;
        setBrandId(m[1] as BrandId);
        setYear(y);
        setIdx(s && s.brand === m[1] && s.year === y ? s.idx : 0);
        return true;
      }
      const id = location.hash.slice(1);
      if (LEVELS.includes(id)) openLevel(id);
      return false;
    };
    const restore = () => {
      const s = load();
      if (s) {
        setDone(s.done || []);
        setModel(s.model || "");
      }
      if (!fromHash() && s && s.brand && brandById(s.brand)) {
        setBrandId(s.brand);
        setYear(s.year);
        setIdx(s.idx || 0);
      }
      setReady(true);
    };
    restore();
    addEventListener("hashchange", fromHash);
    // In-page links to a closed level (#dns, #undo) open it, even when the hash is already there.
    const click = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.('a[href^="#"]');
      const id = a?.getAttribute("href")?.slice(1);
      if (id && LEVELS.includes(id)) openLevel(id, false);
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
    save({ brand: brandId, year, model, idx, done });
    const cur = location.hash;
    if (hash ? cur !== `#${hash}` : HASH.test(cur)) {
      try {
        history.replaceState(null, "", hash ? `#${hash}` : location.pathname + location.search);
      } catch {
        /* ignore */
      }
    }
    if (brandId) document.documentElement.dataset.pvPrint = "1";
    else delete document.documentElement.dataset.pvPrint;
  }, [ready, brandId, year, model, idx, done, hash]);

  // After each move, focus the new card's heading, so screen readers and keyboards land on it.
  const focusTop = () =>
    requestAnimationFrame(() => {
      const h = root.current?.querySelector<HTMLElement>("h2");
      if (!h) return;
      h.tabIndex = -1;
      h.focus();
    });
  const go = (i: number) => {
    setIdx(i);
    focusTop();
  };
  const pick = (id: BrandId) => {
    setBrandId(id);
    setYear(null);
    setIdx(0);
    focusTop();
  };
  const reset = () => {
    setBrandId(null);
    setYear(null);
    setIdx(0);
    focusTop();
  };

  return (
    <div className="pv2-guide" ref={root} data-ready={ready || undefined}>
      {!brand && <Picker onPick={pick} />}
      {brand && brand.decoder && year == null && (
        <YearStep brand={brand} model={model} setModel={setModel} onYear={(y) => { setYear(y); setIdx(0); focusTop(); }} onBack={reset} />
      )}
      {brand && (!brand.decoder || year != null) && idx < brand.steps.length && (
        <StepCard
          brand={brand}
          year={year}
          model={model}
          idx={idx}
          done={done}
          onDone={() => {
            const k = `${brand.id}:${brand.steps[idx].id}`;
            setDone((d) => (d.includes(k) ? d : [...d, k]));
            go(idx + 1);
          }}
          onUndone={() => setDone((d) => d.filter((k) => k !== `${brand.id}:${brand.steps[idx].id}`))}
          onGo={go}
          onYear={() => setYear(null)}
          onBack={reset}
        />
      )}
      {brand && (!brand.decoder || year != null) && idx >= brand.steps.length && (
        <DoneScreen brand={brand} year={year} model={model} done={done} hash={hash} onGo={go} onBack={reset} onYear={() => setYear(null)} onRestart={() => {
          setDone((d) => d.filter((k) => !k.startsWith(`${brand.id}:`)));
          go(0);
        }} />
      )}
      {ready && brand && createPortal(<Printout brand={brand} year={year} model={model} hash={hash} />, document.body)}
    </div>
  );
}

function Picker({ onPick }: { onPick: (id: BrandId) => void }) {
  return (
    <div className="pv2-picker">
      <h2 className="pv2-h2">Pick your TV</h2>
      <ul className="pv2-brands">
        {BRANDS.filter((b) => b.id !== "google").map((b) => (
          <li key={b.id}>
            <a
              href={`#all-${b.id}`}
              className="pv2-brand"
              onClick={(e) => {
                e.preventDefault();
                onPick(b.id);
              }}
            >
              <span className="pv2-brand-name">{b.name}</span>
              <span className="pv2-brand-os">{b.os}</span>
            </a>
          </li>
        ))}
      </ul>
      {/* Google TV and Android TV are CleanYourTV's own ground: their steps stay, one line down. */}
      <p className="pv2-google">
        <a
          href="#all-google"
          className="pv2-google-go"
          onClick={(e) => {
            e.preventDefault();
            onPick("google");
          }}
        >
          Have Google TV or Android TV? Turn these off too →
        </a>
        <span>
          Then <Link href="/tvs">CleanYourTV</Link> can do the rest.
        </span>
      </p>
    </div>
  );
}

function YearStep({ brand, model, setModel, onYear, onBack }: { brand: Brand; model: string; setModel: (m: string) => void; onYear: (y: Year) => void; onBack: () => void }) {
  const [res, setRes] = useState<YearResult | null>(null);
  const decode = brand.decoder === "lg" ? lgYear : samsungYear;
  const check = (e: FormEvent) => {
    e.preventDefault();
    setRes(decode(model));
  };
  const example = brand.decoder === "lg" ? "OLED65C4PUA or 55UQ7570" : "QN65QN90D or UN55DU7200";
  return (
    <div className="pv2-card">
      <Bar brand={brand} year={null} onBack={onBack} />
      <h2 className="pv2-title">Which year is your {brand.name}?</h2>
      <p className="pv2-lead">The menus moved over the years. Type the model number and we&rsquo;ll find the year.</p>
      <form className="pv2-model" onSubmit={check}>
        <label htmlFor="pv2-model">Model number</label>
        <div className="pv2-model-row">
          <input
            id="pv2-model"
            value={model}
            onChange={(e) => {
              setModel(e.target.value);
              setRes(null);
            }}
            placeholder={example}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            enterKeyHint="go"
          />
          <button type="submit" className="pv2-btn">Find the year</button>
        </div>
      </form>
      <div aria-live="polite">
        {res?.kind === "year" && (
          <div className="pv2-result" data-tone="ok">
            <p>
              <strong>{model.toUpperCase().replace(/\s+/g, "")} is a {res.year} TV.</strong> {res.why}
            </p>
            <button type="button" className="pv2-btn pv2-primary" onClick={() => onYear(res.year)}>
              Show the {res.year} steps →
            </button>
          </div>
        )}
        {res?.kind === "either" && (
          <div className="pv2-result">
            <p>
              <strong>That code could be either year.</strong> {res.why} Bought it new recently? It&rsquo;s the later one.
            </p>
            <div className="pv2-row">
              {res.years.map((y) => (
                <button key={y} type="button" className="pv2-btn" onClick={() => onYear(y)}>{y}</button>
              ))}
            </div>
          </div>
        )}
        {res?.kind === "unknown" && (
          <div className="pv2-result" data-tone="no">
            <p>
              <strong>{res.why}</strong> We won&rsquo;t guess. Pick the year below if you know it, or choose &ldquo;I don&rsquo;t know&rdquo; to
              see every year&rsquo;s path.
            </p>
          </div>
        )}
      </div>
      <p className="pv2-help">
        <strong>Where&rsquo;s the model number?</strong> {brand.findModel}
      </p>
      <p className="pv2-or">Or pick the year:</p>
      <div className="pv2-years">
        {brand.years!.map((y) => (
          <button key={y} type="button" className="pv2-btn" onClick={() => onYear(y)}>{yearLabel(brand, y)}</button>
        ))}
      </div>
      <button type="button" className="pv2-btn pv2-wide" onClick={() => onYear("all")}>I don&rsquo;t know: show every year</button>
    </div>
  );
}

/** "‹ Change TV" and what's picked. */
function Bar({ brand, year, model, onBack, onYear }: { brand: Brand; year: Year; model?: string; onBack: () => void; onYear?: () => void }) {
  return (
    <div className="pv2-bar">
      <button type="button" className="pv2-link" onClick={onBack}>‹ Change TV</button>
      <span className="pv2-picked">
        {brand.name}
        {brand.decoder && year != null && (
          <>
            {" · "}
            <button type="button" className="pv2-link" onClick={onYear} aria-label={`Year: ${yearText(brand, year)}. Change the year`}>
              {yearText(brand, year)}
            </button>
          </>
        )}
        {model && typeof year === "number" && brand.decoder ? ` · ${model.toUpperCase().replace(/\s+/g, "")}` : ""}
      </span>
    </div>
  );
}

function Progress({ n, of, done }: { n: number; of: number; done: number }) {
  return (
    <div className="pv2-progress">
      <div className="pv2-count" aria-live="polite">
        Step {n} of {of}
        <span className="pv2-countdone"> · {done} done</span>
      </div>
      <div className="pv2-track" role="progressbar" aria-label="Steps done" aria-valuemin={0} aria-valuemax={of} aria-valuenow={done}>
        <span style={{ width: `${(done / of) * 100}%` }} />
      </div>
    </div>
  );
}

function StepCard(props: {
  brand: Brand;
  year: Year;
  model: string;
  idx: number;
  done: string[];
  onDone: () => void;
  onUndone: () => void;
  onGo: (i: number) => void;
  onYear: () => void;
  onBack: () => void;
}) {
  const { brand, year, model, idx, done, onDone, onUndone, onGo, onYear, onBack } = props;
  const step = brand.steps[idx];
  const isDone = done.includes(`${brand.id}:${step.id}`);
  const count = brand.steps.filter((s) => done.includes(`${brand.id}:${s.id}`)).length;
  const last = idx === brand.steps.length - 1;
  return (
    <div className="pv2-card">
      <Bar brand={brand} year={year} model={model} onBack={onBack} onYear={onYear} />
      {idx === 0 && <p className="pv2-intro">{brand.intro}</p>}
      {idx === 0 && brand.findVersion && <p className="pv2-help">{brand.findVersion}</p>}
      <Progress n={idx + 1} of={brand.steps.length} done={count} />
      <h2 className="pv2-title">{step.title}</h2>
      <StepBody brand={brand} step={step} year={typeof year === "number" ? year : null} />
      <div className="pv2-actions">
        {isDone ? (
          <button type="button" className="pv2-btn pv2-primary" aria-pressed="true" onClick={() => onGo(idx + 1)}>
            Done ✓ · {last ? "Finish" : "Next step"} →
          </button>
        ) : (
          <button type="button" className="pv2-btn pv2-primary" aria-pressed="false" onClick={onDone}>
            Done ✓
          </button>
        )}
        <div className="pv2-nav">
          <button type="button" className="pv2-btn" onClick={() => (idx === 0 ? (brand.decoder ? onYear() : onBack()) : onGo(idx - 1))}>
            Back
          </button>
          {isDone ? (
            <button type="button" className="pv2-btn" onClick={onUndone}>Not done</button>
          ) : (
            <button type="button" className="pv2-btn" onClick={() => onGo(idx + 1)}>{last ? "Skip to the end" : "Skip"}</button>
          )}
        </div>
      </div>
      <p className="pv2-different">
        Menu looked different?{" "}
        <a href={issueUrl("different", brand, year, model, done, idx)} target="_blank" rel="noopener">Tell us on GitHub</a>
      </p>
    </div>
  );
}

function DoneScreen(props: {
  brand: Brand;
  year: Year;
  model: string;
  done: string[];
  hash: string;
  onGo: (i: number) => void;
  onBack: () => void;
  onYear: () => void;
  onRestart: () => void;
}) {
  const { brand, year, model, done, hash, onGo, onBack, onYear, onRestart } = props;
  const [which, setWhich] = useState(0);
  const [msg, setMsg] = useState("");
  const [link, setLink] = useState("");
  const skipped = brand.steps.map((s, i) => [s, i] as const).filter(([s]) => !done.includes(`${brand.id}:${s.id}`));
  const share = async () => {
    const url = `${location.origin}/not-android#${hash}`;
    const text = `Steps to stop a ${brand.name} TV tracking what you watch, about 2 minutes with the remote.`;
    setLink("");
    if (navigator.share) {
      try {
        await navigator.share({ title: "Stop your TV tracking you", text, url });
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
    <div className="pv2-card pv2-done">
      <Bar brand={brand} year={year} model={model} onBack={onBack} onYear={onYear} />
      <Progress n={brand.steps.length} of={brand.steps.length} done={brand.steps.length - skipped.length} />
      <h2 className="pv2-title">{skipped.length ? "Nearly there" : "Done. Your TV tracks a lot less now."}</h2>
      {skipped.length > 0 && (
        <div className="pv2-skipped">
          <p>You skipped {skipped.length === 1 ? "one step" : `${skipped.length} steps`}:</p>
          <ul>
            {skipped.map(([s, i]) => (
              <li key={s.id}>
                <button type="button" className="pv2-link" onClick={() => onGo(i)}>{i + 1}. {s.title}</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {brand.outro && <p className="pv2-note">{brand.outro}</p>}

      <h3 className="pv2-h3">Did this work on your TV?</h3>
      <p className="pv2-help">Tell us on GitHub, so the next person with your TV knows the path is right.</p>
      <div className="pv2-row">
        <a className="pv2-btn" href={issueUrl("worked", brand, year, model, done, 0)} target="_blank" rel="noopener">✅ Worked on my TV</a>
        <a className="pv2-btn" href={issueUrl("different", brand, year, model, done, which)} target="_blank" rel="noopener">✗ My menu looked different</a>
      </div>
      <label className="pv2-which">
        <span>Which step looked different?</span>
        <select value={which} onChange={(e) => setWhich(Number(e.target.value))}>
          {brand.steps.map((s, i) => (
            <option key={s.id} value={i}>{i + 1}. {s.title}</option>
          ))}
        </select>
      </label>

      <h3 className="pv2-h3">Do this for your parents</h3>
      <p className="pv2-help">Print the steps for their TV, or send them the link. It opens straight on these steps.</p>
      <div className="pv2-row">
        <button type="button" className="pv2-btn" onClick={() => window.print()}>Print / save as PDF</button>
        <button type="button" className="pv2-btn" onClick={share}>Send to family</button>
      </div>
      <p className="pv2-msg" aria-live="polite">
        {msg}
        {link && <input className="pv2-copy" readOnly value={link} onFocus={(e) => e.currentTarget.select()} aria-label="Link to these steps" />}
      </p>

      <h3 className="pv2-h3">Want more?</h3>
      <div className="pv2-row">
        <a className="pv2-btn pv2-primary" href="#network">Next: 10 minutes, guest network ↓</a>
      </div>
      <div className="pv2-nav pv2-end">
        <button type="button" className="pv2-link" onClick={onRestart}>Start again</button>
        <a className="pv2-link" href="#undo">How to undo all this</a>
      </div>
    </div>
  );
}

/** Print stylesheet target: only this TV's steps, in black on white. */
function Printout({ brand, year, model, hash }: { brand: Brand; year: Year; model: string; hash: string }) {
  return (
    <section className="pv2-print" aria-hidden="true">
      <h1>Stop your TV tracking you</h1>
      <p className="pv2-print-tv">
        {brand.name}
        {brand.decoder ? ` · ${yearText(brand, year)}` : ""}
        {model && typeof year === "number" && brand.decoder ? ` · ${model.toUpperCase().replace(/\s+/g, "")}` : ""}
      </p>
      <p>
        About 2 minutes with the TV remote. ☐ means untick or turn off, ☑ means tick or turn on. Every step can be undone the
        same way.
      </p>
      {brand.findVersion && <p>{brand.findVersion}</p>}
      <StepList brand={brand} year={typeof year === "number" ? year : null} />
      {brand.outro && <p>{brand.outro}</p>}
      <p className="pv2-print-foot">cleanyour.tv/not-android#{hash} · Menu paths last checked 26 Oct 2026</p>
    </section>
  );
}
