"use client";
// The whole site is one old television. This is a port of the Claude Design prototype
// (design/cleanyour.tv.dc.html): same refs, state and methods, with the content coming in as props.
import React from "react";
import { GH, brandsOf } from "@/lib/parse";
import type { SiteData } from "@/lib/parse";
import { GROUPS, KONAMI, NAMES, ORDER, PRESS, PRESS_LOGO_W, S, SHOWCASE_IMAGES, cdn, thumb, TERM, TERM_TOTAL, THEMES, TILE_COLORS, classify, termCost, wait } from "@/lib/site";
import type { ThemeName } from "@/lib/site";

const TWEET = "https://x.com/gathint/status/2111379569030939102";
const COFFEE = "https://buymeacoffee.com/gathint";
const BOOT_DELAY = 700;
const PH = "https://www.producthunt.com/products/cleanyourtv";
const FEAT_SECS = 6;
/** The phone channel bar's short labels, in channel order. */
const TABS = ["Home", "Story", "On air", "Set up", "Built on it", "Credits"];

type Counter = { key: string; label: string; value: number; max: number; display: number };
type Slide = { kind: "show" | "theme"; name: string; what: string; meta: string; by: string; byUrl: string; url: string; wall: "aurora" | "black"; tiles: number; site?: ThemeName; kicker: string; image?: string; group: string };
/** Short chip names for SHOWCASE.md's sections; an unknown section shows its own heading. */
const GROUP_SHORT: Record<string, string> = { "Home screens built as their own app": "Home screens", "Forks of the launcher": "Forks", "Screensavers and add-ons": "Add-ons", "Tools and companion apps": "Tools", "Other platforms: Fire TV and LG webOS": "Fire TV & webOS" };
type Spring = { p: number; v: number; t: number };
type Axis = "x" | "y" | "w" | "h";

type Props = { data: SiteData; pressTotal: number };
type State = {
  nudge: boolean; osd: string; theme: ThemeName; sound: boolean; power: boolean; booted: boolean; mobile: boolean; mounted: boolean; focus: number;
  clock: string; ampm: string; date: string; greeting: string;
  counters: Counter[];
  ch: number; wiz: number; os: "mac" | "win"; typed: number; copied: boolean; slide: number; feat: number; held: boolean;
};

const REF_KEYS = ["root", "screen", "scroll", "launcher", "ambient", "dock", "glass", "clutter", "miss", "title", "osd", "flash", "off", "featBar", "wall", "credits", "end"] as const;
type RefKey = (typeof REF_KEYS)[number];

export default class TvSite extends React.Component<Props, State> {
  r: Record<RefKey, React.RefObject<HTMLDivElement | null>>;
  staticRef = React.createRef<HTMLCanvasElement>();
  scopeRef = React.createRef<HTMLCanvasElement>();
  slides: Slide[];
  bootId = 0; skipBoot = false; konami: string[] = []; tweens: Record<string, number> = {}; quietUntil = 0;
  spring: Record<Axis, Spring> = { x: { p: 0, v: 0, t: 0 }, y: { p: 0, v: 0, t: 0 }, w: { p: 10, v: 0, t: 10 }, h: { p: 10, v: 0, t: 10 } };
  glassRaf = 0; loopRaf = 0; scopeRaf = 0; lastT = 0; lastLoop = 0; scopeP = 0;
  featT = 0; cy = 0; pause = { c: false, w: false }; resumeT: Record<string, ReturnType<typeof setTimeout>> = {};
  reduced = false; mq!: MediaQueryList; onMq!: () => void; onKey!: (e: KeyboardEvent) => void; onResize!: () => void;
  clockTimer!: ReturnType<typeof setInterval>; typeT!: ReturnType<typeof setInterval>; osdT!: ReturnType<typeof setTimeout>; copyT!: ReturnType<typeof setTimeout>;
  io!: IntersectionObserver; typingStarted = false; tx = 0;
  resumeCh = 0; instant = false; pull = 0; pullAt = 0; pullY = 0; bottomAt = 0; onWheel!: (e: WheelEvent) => void; onTouchS!: (e: TouchEvent) => void; onTouchM!: (e: TouchEvent) => void; onTouchE!: () => void; onScroll!: () => void; nudgeY = 0;
  gaugeRef = React.createRef<HTMLDivElement>(); termRef = React.createRef<HTMLDivElement>(); tabsRef = React.createRef<HTMLDivElement>(); gaugeTextRef = React.createRef<HTMLDivElement>();
  _ac: AudioContext | null = null; humNode: { o: OscillatorNode; o2: OscillatorNode; g: GainNode; g2: GainNode } | null = null;

  constructor(p: Props) {
    super(p);
    this.r = Object.fromEntries(REF_KEYS.map((k) => [k, React.createRef<HTMLDivElement>()])) as Record<RefKey, React.RefObject<HTMLDivElement | null>>;
    const d = p.data;
    // Projects with a screenshot lead; the ones still waiting for one follow, then the themes.
    // Grouped by SHOWCASE.md section (in the page's order); inside a group, projects with a screenshot lead. Then the themes.
    const groupOf = (c?: string) => (c ? GROUP_SHORT[c] || c : "Showcase");
    const order: string[] = [];
    d.showcase.forEach((s) => { const g = groupOf(s.category); if (!order.includes(g)) order.push(g); });
    const shows = d.showcase
      .map((s, i) => ({ s, i, g: groupOf(s.category), image: SHOWCASE_IMAGES[`${s.by}/${s.name}`.toLowerCase()] ?? SHOWCASE_IMAGES[s.by.toLowerCase()] }))
      .sort((a, b) => order.indexOf(a.g) - order.indexOf(b.g) || Number(!a.image) - Number(!b.image) || a.i - b.i);
    const count = (g: string) => shows.filter((x) => x.g === g).length;
    this.slides = shows
      .map<Slide>(({ s, g, image }) => {
        const n = shows.filter((x) => x.g === g).findIndex((x) => x.s === s) + 1;
        return { kind: "show", name: s.name, what: s.what, meta: "Built on " + s.builtOn, by: s.by, byUrl: "https://github.com/" + s.by, url: s.url, wall: "aurora", tiles: 4, image, group: g, kicker: `${g.toUpperCase()} · ${String(n).padStart(2, "0")} / ${String(count(g)).padStart(2, "0")}` };
      })
      .concat(d.themes.map<Slide>((t) => ({ kind: "theme", name: t.name + "/", what: t.what, meta: "In themes/" + t.name + "/", by: "cleanyourtv", byUrl: GH, url: GH + "/tree/main/themes/" + t.name, wall: t.name === "aurora" ? "aurora" : "black", tiles: t.name === "six-columns" ? 6 : 4, site: t.name === "aurora" ? "aurora" : "black", kicker: "THEME", image: t.image, group: "Themes" })));
    this.state = {
      nudge: false, osd: "CH 00", theme: "black", sound: false, power: true, booted: false, mobile: false, mounted: false, focus: 0,
      clock: "", ampm: "", date: "", greeting: "",
      counters: [
        { key: "stars", label: "STARS", value: d.stars, max: Math.max(5000, d.stars * 1.4), display: 0 },
        { key: "forks", label: "FORKS", value: d.forks, max: Math.max(600, d.forks * 1.4), display: 0 },
        { key: "contributors", label: "CONTRIBUTORS", value: d.contributors, max: Math.max(120, d.contributors * 1.6), display: 0 },
      ],
      ch: 0, wiz: 0, os: "mac", typed: 0, copied: false, slide: 0, feat: 0, held: false,
    };
  }

  componentDidMount() {
    let theme: string | null = null, sound = false;
    try { theme = localStorage.getItem("cyt-theme"); sound = localStorage.getItem("cyt-sound") === "1"; } catch { /* private mode */ }
    // A refresh lands back on the channel that was showing, without the boot sequence.
    try { const n = Number(sessionStorage.getItem("cyt-ch")); if (n >= 1 && n <= 5) this.resumeCh = n; } catch { /* ignore */ }
    // Deep links win over the remembered channel: #ch-03 or ?ch=3 opens that channel; ?boot=0 skips the boot sequence.
    try {
      const q = new URLSearchParams(location.search);
      const m = /^#ch-0?([0-5])$/.exec(location.hash);
      const n = m ? Number(m[1]) : q.has("ch") ? Number(q.get("ch")) : NaN;
      if (n >= 1 && n <= 5) this.resumeCh = n; else if (n === 0) { this.resumeCh = 0; this.instant = true; }
      if (q.get("boot") === "0") this.instant = true;
    } catch { /* ignore */ }
    this.reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.mq = matchMedia("(max-width: 1100px)");
    this.onMq = () => { this.setPadR(); this.observe(); this.setState({ mobile: this.mq.matches }, () => this.retarget()); };
    this.mq.addEventListener("change", this.onMq);
    const t: ThemeName = theme && theme in THEMES ? (theme as ThemeName) : "black";
    this.setState({ mounted: true, mobile: this.mq.matches, sound, theme: t }, () => this.applyTheme(t));
    this.setVar("--mute-ink", sound ? "#CFFFCF" : "rgba(255,255,255,.75)"); this.setPadR();
    this.tickClock(); this.clockTimer = setInterval(() => this.tickClock(), 20000);
    this.onKey = (e) => this.key(e); window.addEventListener("keydown", this.onKey);
    this.onResize = () => { this.retarget(); this.drawScope(this.scopeP || 0); }; window.addEventListener("resize", this.onResize);
    const sc = this.r.scroll.current!;
    this.observe();
    // Turning the set off takes a deliberate pull: sit at the very bottom and keep scrolling.
    // The momentum of the scroll that reached the bottom does not count; only scrolling after a short rest does.
    this.onWheel = (e) => {
      if (!(e.deltaY > 0 && this.atBottom())) { this.bottomAt = 0; return; }
      const now = performance.now(); if (!this.bottomAt) this.bottomAt = now;
      if (now - this.bottomAt > 900) this.addPull(Math.min(e.deltaY, 60) / 1100);
    };
    // Phones have no pull at all ("Turn it off" is the way); elsewhere a touch only counts if it starts at the bottom.
    this.onTouchS = (e) => { this.pullY = !this.mq.matches && this.atBottom() ? e.touches[0].clientY : NaN; };
    this.onTouchM = (e) => { const dy = this.pullY - e.touches[0].clientY; if (dy > 0 && this.atBottom()) this.setPull(dy / 320); };
    this.onTouchE = () => { if (this.pull < 1) this.setPull(0); };
    sc.addEventListener("wheel", this.onWheel, { passive: true }); sc.addEventListener("touchstart", this.onTouchS, { passive: true });
    sc.addEventListener("touchmove", this.onTouchM, { passive: true }); sc.addEventListener("touchend", this.onTouchE);
    this.onScroll = () => { if (this.state.nudge && this.mq.matches && Math.abs(sc.scrollTop - this.nudgeY) > sc.clientHeight * 0.6) this.setState({ nudge: false }); };
    sc.addEventListener("scroll", this.onScroll, { passive: true });
    this.lastLoop = performance.now(); this.loopRaf = requestAnimationFrame(this.loop);
    this.boot();
  }
  componentDidUpdate(_: Props, prev: State) {
    if (!this.state.mobile) return;
    // Phones: the terminal has a fixed height, so it follows the newest line; the channel bar keeps the channel on screen in view.
    const t = this.termRef.current; if (t && prev.typed !== this.state.typed) t.scrollTop = t.scrollHeight;
    const bar = this.tabsRef.current, tab = bar?.querySelector<HTMLElement>(`[data-tab="${this.state.ch}"]`);
    if (bar && tab && (prev.ch !== this.state.ch || prev.mobile !== this.state.mobile)) bar.scrollTo({ left: tab.offsetLeft - (bar.clientWidth - tab.offsetWidth) / 2, behavior: this.reduced ? "auto" : "smooth" });
  }
  componentWillUnmount() {
    clearInterval(this.clockTimer); clearInterval(this.typeT); window.removeEventListener("keydown", this.onKey); window.removeEventListener("resize", this.onResize);
    this.mq.removeEventListener("change", this.onMq); cancelAnimationFrame(this.glassRaf); cancelAnimationFrame(this.loopRaf); cancelAnimationFrame(this.scopeRaf);
    this.io?.disconnect(); this.hum(false);
    const sc = this.r.scroll.current; if (sc) { sc.removeEventListener("wheel", this.onWheel); sc.removeEventListener("touchstart", this.onTouchS); sc.removeEventListener("touchmove", this.onTouchM); sc.removeEventListener("touchend", this.onTouchE); sc.removeEventListener("scroll", this.onScroll); }
  }

  // ---- helpers
  // The channel on screen: on desktop the one at least half in view; on phones the one crossing the middle of the screen,
  // so channels taller than two screens still count.
  observe() {
    const sc = this.r.scroll.current; if (!sc) return; this.io?.disconnect();
    this.io = new IntersectionObserver((es) => es.forEach((e) => this.onSection(e)), this.mq.matches ? { root: sc, rootMargin: "-45% 0px -45% 0px", threshold: 0 } : { root: sc, threshold: [0.5] });
    sc.querySelectorAll("section[data-ch]").forEach((s) => this.io.observe(s));
  }
  setPadR() { this.setVar("--pad-r", this.mq.matches ? "clamp(16px,6cqw,84px)" : "156px"); }
  setVar(k: string, v: string) { const el = this.r.root.current; if (el) el.style.setProperty(k, v); }
  applyTheme(name: ThemeName) {
    const t = THEMES[name]; Object.keys(t).forEach((k) => { if (k.startsWith("--")) this.setVar(k, t[k]); });
    const paper = name === "paper";
    this.setVar("--osd", paper ? "#0B3D1E" : "#CFFFCF"); this.setVar("--osd-glow", paper ? "rgba(11,61,30,.25)" : "rgba(140,255,140,.6)");
  }
  setTheme(name: ThemeName) { this.setState({ theme: name }); this.applyTheme(name); try { localStorage.setItem("cyt-theme", name); } catch { /* ignore */ } this.showOsd(THEMES[name].label, 1400); }
  tickClock() {
    const d = new Date(); const h = d.getHours();
    const h12 = h % 12 || 12; const m = String(d.getMinutes()).padStart(2, "0");
    const greeting = h < 5 ? "Good night" : h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : h < 22 ? "Good evening" : "Good night";
    this.setState({ clock: `${h12}:${m}`, ampm: h < 12 ? "AM" : "PM", greeting, date: d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }) });
  }
  showOsd(text: string, ms = 1600, flicker = true) {
    const el = this.r.osd.current; if (!el) return;
    this.setState({ osd: text });
    clearTimeout(this.osdT);
    el.style.transition = flicker ? "none" : "opacity .3s"; el.style.animation = "none"; void el.offsetWidth;
    el.style.opacity = "1"; if (flicker && !this.reduced) el.style.animation = "osdFlicker .45s steps(1)";
    this.osdT = setTimeout(() => { el.style.animation = "none"; el.style.transition = "opacity .3s"; el.style.opacity = "0"; }, ms);
  }
  drawStatic() {
    const c = this.staticRef.current; if (!c) return; const ctx = c.getContext("2d"); if (!ctx) return;
    const img = ctx.createImageData(c.width, c.height); const d = img.data;
    for (let i = 0; i < d.length; i += 4) { const v = (Math.random() * 255) | 0; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; }
    ctx.putImageData(img, 0, 0);
  }
  async cut(ms = 250) {
    const c = this.staticRef.current; if (!c || this.reduced) return;
    c.style.opacity = "1"; this.noise(ms);
    const end = performance.now() + ms;
    const tick = () => { this.drawStatic(); if (performance.now() < end) requestAnimationFrame(tick); else c.style.opacity = "0"; };
    tick(); await wait(ms);
  }

  // ---- audio (synthesised, off by default)
  ac() {
    if (!this._ac) { const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext; this._ac = new Ctx(); }
    if (this._ac.state === "suspended") this._ac.resume(); return this._ac;
  }
  click() {
    if (!this.state.sound) return; const ac = this.ac(), t = ac.currentTime;
    const o = ac.createOscillator(), g = ac.createGain(); o.type = "sine";
    o.frequency.setValueAtTime(1800, t); o.frequency.exponentialRampToValueAtTime(700, t + 0.04);
    g.gain.setValueAtTime(0.07, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
    o.connect(g).connect(ac.destination); o.start(t); o.stop(t + 0.07);
  }
  noise(ms: number) {
    if (!this.state.sound) return; const ac = this.ac(); const n = (ac.sampleRate * ms / 1000) | 0;
    const b = ac.createBuffer(1, n, ac.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    const s = ac.createBufferSource(); s.buffer = b; const g = ac.createGain(); g.gain.value = 0.035; s.connect(g).connect(ac.destination); s.start();
  }
  hum(on: boolean) {
    if (on) {
      if (!this.state.sound || !this.state.power || this.humNode) return; const ac = this.ac(), t = ac.currentTime;
      const o = ac.createOscillator(); o.type = "sine"; o.frequency.value = 60;
      const o2 = ac.createOscillator(); o2.type = "sine"; o2.frequency.value = 15625;
      const g = ac.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.018, t + 0.8);
      const g2 = ac.createGain(); g2.gain.value = 0.004;
      o.connect(g).connect(ac.destination); o2.connect(g2).connect(ac.destination); o.start(); o2.start();
      this.humNode = { o, o2, g, g2 };
    } else if (this.humNode && this._ac) {
      const { o, o2, g, g2 } = this.humNode, t = this._ac.currentTime;
      g.gain.linearRampToValueAtTime(0, t + 0.25); g2.gain.linearRampToValueAtTime(0, t + 0.25); o.stop(t + 0.3); o2.stop(t + 0.3); this.humNode = null;
    }
  }

  // ---- counters
  countUp(key: string, ms = 1300) {
    const c = this.state.counters.find((x) => x.key === key); if (!c) return; const from = c.display, to = c.value; const t0 = performance.now();
    cancelAnimationFrame(this.tweens[key]);
    const step = () => {
      const k = Math.min(1, (performance.now() - t0) / ms); const e = 1 - Math.pow(1 - k, 3);
      const display = Math.round(from + (to - from) * e);
      this.setState((s) => ({ counters: s.counters.map((x) => (x.key === key ? { ...x, display } : x)) }));
      if (k < 1) this.tweens[key] = requestAnimationFrame(step);
    };
    if (this.reduced) this.setState((s) => ({ counters: s.counters.map((x) => (x.key === key ? { ...x, display: to } : x)) })); else step();
  }

  // ---- glass highlight spring (stiffness 260, damping ratio .58)
  tileRect(i: number) {
    const dock = this.r.dock.current, L = this.r.launcher.current; if (!dock || !L) return null;
    const t = dock.querySelector<HTMLElement>(`[data-tile="${i}"]`); if (!t) return null;
    const a = t.getBoundingClientRect(), b = L.getBoundingClientRect(); const pad = 6;
    return { x: a.left - b.left - pad, y: a.top - b.top - pad, w: a.width + pad * 2, h: a.height + pad * 2, color: t.dataset.color || "#fff" };
  }
  focusTile(i: number, snap = false) {
    i = (i + 4) % 4; const rect = this.tileRect(i); if (!rect) return;
    this.setState({ focus: i });
    const dock = this.r.dock.current!;
    dock.querySelectorAll<HTMLElement>("[data-tile]").forEach((t) => { const on = Number(t.dataset.tile) === i; t.style.transform = on ? "scale(1.06)" : "scale(1)"; const n = t.querySelector<HTMLElement>("[data-name]"); if (n) n.style.opacity = on ? "1" : "0"; });
    this.setVar("--glow", rect.color + "66");
    const s = this.spring; s.x.t = rect.x; s.y.t = rect.y; s.w.t = rect.w; s.h.t = rect.h;
    const g = this.r.glass.current!; g.style.opacity = "1";
    if (snap || this.reduced) { (["x", "y", "w", "h"] as Axis[]).forEach((k) => { s[k].p = s[k].t; s[k].v = 0; }); this.paintGlass(); return; }
    if (!this.glassRaf) { this.lastT = performance.now(); this.glassRaf = requestAnimationFrame(this.stepGlass); }
  }
  retarget() { if (this.state.booted) this.focusTile(this.state.focus, true); }
  paintGlass() { const s = this.spring, g = this.r.glass.current; if (!g) return; g.style.transform = `translate(${s.x.p}px,${s.y.p}px)`; g.style.width = s.w.p + "px"; g.style.height = s.h.p + "px"; }
  stepGlass = (now: number) => {
    const dt = Math.min(1 / 30, (now - this.lastT) / 1000); this.lastT = now;
    const k = 260, c = 2 * 0.58 * Math.sqrt(k); let settled = true;
    (["x", "y", "w", "h"] as Axis[]).forEach((key) => { const s = this.spring[key]; const a = k * (s.t - s.p) - c * s.v; s.v += a * dt; s.p += s.v * dt; if (Math.abs(s.v) > 0.05 || Math.abs(s.t - s.p) > 0.1) settled = false; });
    this.paintGlass();
    if (settled) { (["x", "y", "w", "h"] as Axis[]).forEach((a) => { this.spring[a].p = this.spring[a].t; this.spring[a].v = 0; }); this.paintGlass(); this.glassRaf = 0; }
    else this.glassRaf = requestAnimationFrame(this.stepGlass);
  };

  // ---- On air rotation + credits roll (direct DOM, only while their channel is on)
  loop = (now: number) => {
    const dt = Math.min(0.05, (now - this.lastLoop) / 1000); this.lastLoop = now; const ch = this.state.ch;
    if (!this.reduced && this.state.power) {
      if (ch === 2 && this.props.data.results.length > 1) {
        if (!this.state.held && !this.pause.w) { this.featT += dt; if (this.featT >= FEAT_SECS) this.featGo(this.state.feat + 1, true); }
        const bar = this.r.featBar.current; if (bar) bar.style.transform = `scaleX(${Math.min(1, this.featT / FEAT_SECS)})`;
      }
      if (this.pull > 0 && now - this.pullAt > 160) this.setPull(this.pull - dt * 0.7);
      if (ch === 5) { const c = this.r.credits.current; if (c && !this.pause.c) { const h = c.scrollHeight / 2; this.cy += 26 * dt; if (h && this.cy >= h) this.cy -= h; c.style.transform = `translateY(${-this.cy}px)`; } }
    }
    this.loopRaf = requestAnimationFrame(this.loop);
  };
  setPause(k: "c" | "w", v: boolean, later?: boolean) { clearTimeout(this.resumeT[k]); if (later) this.resumeT[k] = setTimeout(() => { this.pause[k] = false; }, 2500); else this.pause[k] = v; }

  // ---- oscilloscope
  drawScope(p: number) {
    const c = this.scopeRef.current; if (!c) return; this.scopeP = p;
    const dpr = Math.min(2, window.devicePixelRatio || 1); const w = c.clientWidth, h = c.clientHeight; if (!w || !h) return;
    if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
    const x = c.getContext("2d"); if (!x) return; x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, w, h);
    x.strokeStyle = "rgba(140,255,140,.12)"; x.lineWidth = 1; x.shadowBlur = 0;
    for (let i = 1; i < 8; i++) { x.beginPath(); x.moveTo(Math.round(i * w / 8) + 0.5, 0); x.lineTo(Math.round(i * w / 8) + 0.5, h); x.stroke(); }
    for (let i = 1; i < 4; i++) { x.beginPath(); x.moveTo(0, Math.round(i * h / 4) + 0.5); x.lineTo(w, Math.round(i * h / 4) + 0.5); x.stroke(); }
    const pts = this.props.data.starSeries, n = pts.length - 1, upto = p * n, pad = 10;
    const px = (i: number) => pad + (w - pad * 2) * i / n, py = (v: number) => h - pad - (h - pad * 2) * v;
    x.strokeStyle = "#9CFF9C"; x.lineWidth = 2; x.shadowColor = "rgba(140,255,140,.9)"; x.shadowBlur = 8; x.lineJoin = "round";
    x.beginPath(); x.moveTo(px(0), py(pts[0])); let lx = px(0), ly = py(pts[0]);
    for (let i = 1; i <= Math.ceil(upto); i++) { const f = Math.min(1, upto - (i - 1)); const v = pts[i - 1] + (pts[i] - pts[i - 1]) * f; lx = px(i - 1 + f); ly = py(v); x.lineTo(lx, ly); }
    x.stroke(); x.fillStyle = "#E8FFE8"; x.beginPath(); x.arc(lx, ly, 3, 0, Math.PI * 2); x.fill();
  }
  animateScope() {
    cancelAnimationFrame(this.scopeRaf);
    if (this.reduced) return this.drawScope(1);
    const t0 = performance.now();
    const step = () => { const k = Math.min(1, (performance.now() - t0) / 1600); this.drawScope(1 - Math.pow(1 - k, 2)); if (k < 1) this.scopeRaf = requestAnimationFrame(step); };
    step();
  }

  // ---- terminal
  startTyping() {
    clearInterval(this.typeT); this.typingStarted = true;
    const total = TERM_TOTAL[this.state.os];
    if (this.reduced) return this.setState({ typed: total });
    this.setState({ typed: 0 });
    this.typeT = setInterval(() => { const t = Math.min(total, this.state.typed + 2); this.setState({ typed: t }); if (t >= total) clearInterval(this.typeT); }, 30);
  }
  termView() {
    let budget = this.state.typed; const out: { text: string; color: string; img: string; alt: string }[] = [];
    for (const l of TERM[this.state.os]) {
      if (budget <= 0) break; const cost = termCost(l);
      if (l[0] === "cmd") { const n = Math.min(l[1].length, budget); out.push({ text: "$ " + l[1].slice(0, n) + (budget < cost ? "▌" : ""), color: "#FFFFFF", img: "", alt: "" }); }
      else if (budget >= cost) out.push(l[0] === "img" ? { text: "  " + l[1], color: "rgba(216,245,218,.8)", img: l[2], alt: l[3] } : { text: (l[0] === "note" ? "› " : "  ") + l[1], color: l[0] === "note" ? "#CFFFCF" : "rgba(216,245,218,.85)", img: "", alt: "" });
      budget -= cost;
    }
    return out;
  }

  // ---- channels
  onSection(e: IntersectionObserverEntry) {
    if (!e.isIntersecting) return; const n = Number((e.target as HTMLElement).dataset.ch); if (n === this.state.ch) return;
    this.setState({ ch: n }); this.remember(n);
    if (n === 1) this.maybeNudge();
    // Scrolling between channels only updates the corner label; static is kept for the remote and number keys.
    if (performance.now() > this.quietUntil && this.state.booted) this.showOsd(`CH 0${n}`, 1200, false);
    this.enter(n);
  }
  // A small one-time note pointing to /addons, shown on the way down to On air; dismissed for good once closed or followed.
  nudgeT = 0;
  maybeNudge() {
    try { if (localStorage.getItem("cyt-nudge-addons")) return; localStorage.setItem("cyt-nudge-addons", "1"); } catch { return; }
    // On phones it sits above the channel bar for 6 s, and goes once you scroll on.
    const phone = this.mq.matches; this.nudgeY = this.r.scroll.current?.scrollTop ?? 0;
    this.setState({ nudge: true }); clearTimeout(this.nudgeT); this.nudgeT = window.setTimeout(() => this.setState({ nudge: false }), phone ? 6000 : 14000);
  }
  enter(n: number) { if (n === 1) this.animateScope(); if (n === 2) { this.featT = 0; this.preload(this.state.feat + 1); } if (n === 3 && !this.typingStarted) this.startTyping(); }
  channel(n: number) {
    this.click(); if (!this.state.power || n < 0) return;
    if (!this.state.booted) this.finalize(++this.bootId);
    if (n > 5) { this.showOsd(`CH 0${n}  NO SIGNAL`); this.cut(250); return; }
    const sc = this.r.scroll.current!, target = sc.querySelector<HTMLElement>(`#ch-0${n}`); if (!target) return;
    this.quietUntil = performance.now() + 900; this.showOsd(`CH 0${n}`);
    if (this.reduced) { sc.animate([{ opacity: 1 }, { opacity: 0, offset: 0.5 }, { opacity: 1 }], { duration: 500 }); setTimeout(() => { sc.scrollTop = target.offsetTop; }, 250); }
    else { this.cut(250); setTimeout(() => { sc.scrollTop = target.offsetTop; }, 110); }
    if (n !== this.state.ch) { this.setState({ ch: n }); this.enter(n); }
    this.remember(n);
  }
  remember(n: number) {
    try { sessionStorage.setItem("cyt-ch", String(n)); } catch { /* ignore */ }
    // Keep the address in step so a channel can be linked to; replaceState never scrolls the page.
    try { history.replaceState(null, "", n ? `#ch-0${n}` : location.pathname + location.search); } catch { /* ignore */ }
  }

  // ---- boot: power on, parody home, cleanup, launcher
  resetScene() {
    const cl = this.r.clutter.current!, g = this.r.glass.current!, ti = this.r.title.current!, dock = this.r.dock.current!;
    cl.getAnimations({ subtree: true }).forEach((a) => a.cancel()); cl.style.opacity = "1"; cl.style.visibility = "visible";
    g.style.opacity = "0"; ti.style.opacity = "0"; ti.style.transition = "none";
    dock.querySelectorAll<HTMLElement>("[data-tile]").forEach((t) => { t.style.opacity = "0"; t.style.transform = "scale(1)"; const n = t.querySelector<HTMLElement>("[data-name]"); if (n) n.style.opacity = "0"; });
    this.setState((s) => ({ booted: false, ch: 0, counters: s.counters.map((c) => ({ ...c, display: 0 })) }));
  }
  async boot() {
    const id = ++this.bootId; const alive = () => this.bootId === id && this.state.power;
    this.skipBoot = false; this.resetScene();
    const cl = this.r.clutter.current!, fl = this.r.flash.current!, sc = this.r.scroll.current!;
    sc.scrollTop = 0; this.setVar("--led", "#4bff7a");
    const resume = this.resumeCh; this.resumeCh = 0;
    // Phones skip the boot: the headline and buttons are there at once, with no flash.
    if (resume || this.instant || this.mq.matches) {
      this.instant = false;
      this.finalize(id);
      if (resume) {
        const target = sc.querySelector<HTMLElement>(`#ch-0${resume}`); if (target) sc.scrollTop = target.offsetTop;
        this.quietUntil = performance.now() + 1500; this.setState({ ch: resume }); this.enter(resume);
      }
      return;
    }
    if (this.reduced) {
      await wait(1400); if (!alive()) return;
      cl.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 600, fill: "forwards" });
      await wait(600); return this.finalize(id);
    }
    fl.style.opacity = "1"; cl.style.opacity = "0";
    await fl.animate([{ transform: "scaleY(.004)", opacity: 1 }, { transform: "scaleY(1)", opacity: 1, offset: 0.55 }, { transform: "scaleY(1)", opacity: 0 }], { duration: 520, easing: "cubic-bezier(.2,.8,.3,1)", fill: "forwards" }).finished;
    if (!alive()) return; fl.style.opacity = "0"; this.hum(true);
    cl.style.opacity = "1";
    await this.cut(250); if (!alive()) return;
    this.showOsd("CH 00");
    await wait(BOOT_DELAY); if (!alive()) return; if (this.skipBoot) return this.finalize(id);
    const pop = cl.querySelector<HTMLElement>("[data-popup]")!; this.click();
    pop.animate([{ transform: "translate(-50%,-50%) rotate(0deg)", opacity: 1 }, { transform: "translate(-30%,-20%) rotate(14deg) scale(.9)", opacity: 1, offset: 0.35 }, { transform: "translate(90%,120%) rotate(40deg) scale(.6)", opacity: 0 }], { duration: 480, easing: "cubic-bezier(.5,0,.9,.4)", fill: "forwards" });
    await wait(380); if (!alive()) return; if (this.skipBoot) return this.finalize(id);
    const zaps = Array.from(cl.querySelectorAll<HTMLElement>("[data-zap]")).sort((a, b) => Number(a.dataset.zap) - Number(b.dataset.zap));
    for (const el of zaps) {
      this.click();
      el.animate([{ filter: "brightness(1)", transform: "scale(1)", opacity: 1 }, { filter: "brightness(5)", transform: "scale(1.08)", opacity: 1, offset: 0.3 }, { filter: "brightness(5)", transform: "scale(1.1,.02)", opacity: 1, offset: 0.75 }, { filter: "brightness(5)", transform: "scale(0,.02)", opacity: 0 }], { duration: 300, easing: "ease-in", fill: "forwards" });
      await wait(60); if (!alive()) return; if (this.skipBoot) return this.finalize(id);
    }
    await wait(220);
    const rows = Array.from(cl.querySelectorAll<HTMLElement>("[data-row]")).sort((a, b) => Number(a.dataset.row) - Number(b.dataset.row));
    for (const el of rows) {
      this.click();
      el.animate([{ transform: "scaleY(1)", opacity: 1 }, { transform: "scaleY(.02)", opacity: 0.9, offset: 0.7 }, { transform: "scaleY(0)", opacity: 0 }], { duration: 260, easing: "cubic-bezier(.6,0,.9,.4)", fill: "forwards" });
      await wait(120); if (!alive()) return; if (this.skipBoot) return this.finalize(id);
    }
    await wait(150);
    cl.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: "forwards" });
    await wait(300); if (!alive()) return;
    cl.style.visibility = "hidden";
    const tiles = this.r.dock.current!.querySelectorAll<HTMLElement>("[data-tile]");
    tiles.forEach((t, i) => { t.style.opacity = "1"; t.animate([{ transform: "translateY(18px) scale(.96)", opacity: 0 }, { transform: "translateY(0) scale(1)", opacity: 1 }], { duration: 320, delay: i * 50, easing: "cubic-bezier(.2,.8,.2,1)", fill: "backwards" }); });
    await wait(360); if (!alive()) return;
    this.setState({ booted: true }); this.state.counters.forEach((c) => this.countUp(c.key));
    const ti = this.r.title.current!; ti.style.transition = "opacity .6s"; ti.style.opacity = "1";
    for (const i of [0, 1, 2, 3, 0]) { this.focusTile(i); this.click(); await wait(i === 3 ? 420 : 300); if (!alive()) return; }
  }
  // Skipping ends the boot now rather than at its next checkpoint: a new boot id stops the running sequence.
  skip() { if (this.state.booted || !this.state.power) return; this.click(); this.finalize(++this.bootId); }
  finalize(id: number) {
    if (this.bootId !== id) return;
    const cl = this.r.clutter.current!, ti = this.r.title.current!;
    cl.getAnimations({ subtree: true }).forEach((a) => a.cancel()); cl.style.opacity = "0"; cl.style.visibility = "hidden";
    this.r.dock.current!.querySelectorAll<HTMLElement>("[data-tile]").forEach((t) => { t.style.opacity = "1"; });
    this.setState({ booted: true }, () => { this.state.counters.forEach((c) => this.countUp(c.key)); this.focusTile(0, true); });
    ti.style.transition = "opacity .6s"; ti.style.opacity = "1"; this.hum(true);
  }

  // ---- the pull that turns it off
  atBottom() { const sc = this.r.scroll.current; return !!sc && this.state.power && this.state.booted && sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 4; }
  addPull(d: number) { this.pullAt = performance.now(); this.setPull(this.pull + d); }
  setPull(v: number) {
    this.pull = Math.max(0, Math.min(1, v));
    const g = this.gaugeRef.current, t = this.gaugeTextRef.current;
    if (g) g.style.width = this.pull * 100 + "%";
    if (t) t.textContent = this.pull <= 0 ? "KEEP SCROLLING TO TURN IT OFF" : this.pull < 1 ? `PULLING  ${Math.round(this.pull * 100)}%` : "OFF";
    if (this.pull >= 1) { this.pull = 0; this.powerOff(); }
  }

  // ---- power
  async powerOff() {
    if (!this.state.power) return;
    this.bootId++; this.click(); this.hum(false); this.setState({ power: false, booted: false }); this.setVar("--led", "#ff3b3b");
    const sc = this.r.scroll.current!, off = this.r.off.current!;
    if (!this.reduced) {
      await sc.animate([{ transform: "scaleY(1)", filter: "brightness(1)" }, { transform: "scaleY(.006)", filter: "brightness(2.5)" }], { duration: 300, easing: "cubic-bezier(.7,0,.9,.4)", fill: "forwards" }).finished;
      await sc.animate([{ transform: "scaleY(.006) scaleX(1)", filter: "brightness(2.5)" }, { transform: "scaleY(.006) scaleX(0)", filter: "brightness(4)" }], { duration: 170, easing: "ease-in", fill: "forwards" }).finished;
      await wait(250);
    }
    sc.style.visibility = "hidden";
    off.style.display = "flex"; off.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, fill: "forwards" });
  }
  powerOn() {
    const sc = this.r.scroll.current!, off = this.r.off.current!;
    off.getAnimations().forEach((a) => a.cancel()); off.style.display = "none"; off.style.opacity = "0";
    sc.getAnimations().forEach((a) => a.cancel()); sc.style.visibility = ""; sc.style.transform = ""; sc.style.filter = "";
    this.quietUntil = performance.now() + 1500; this.setPull(0);
    this.setState({ power: true }, () => this.boot());
  }

  // ---- remote
  cycleTheme() {
    this.click();
    const sl = this.slides[this.state.slide];
    if (this.state.ch === 4 && sl && sl.kind === "theme" && sl.site && sl.site !== this.state.theme) return this.setTheme(sl.site);
    this.setTheme(ORDER[(ORDER.indexOf(this.state.theme) + 1) % ORDER.length]);
  }
  toggleSound() {
    const sound = !this.state.sound;
    this.setState({ sound }, () => {
      try { localStorage.setItem("cyt-sound", sound ? "1" : "0"); } catch { /* ignore */ }
      this.setVar("--mute-ink", sound ? "#CFFFCF" : "rgba(255,255,255,.75)");
      if (sound) { this.ac(); this.click(); this.hum(true); } else this.hum(false);
      this.showOsd(sound ? "SOUND ON" : "MUTE", 1200);
    });
  }
  wizGo(i: number) { i = Math.max(0, Math.min(2, i)); if (i === this.state.wiz) return; this.click(); this.setState({ wiz: i }); }
  slideGo(i: number) { const n = this.slides.length; if (!n) return; this.click(); this.setState({ slide: ((i % n) + n) % n }); }
  side(d: number) { const ch = this.state.ch; if (ch === 0) return this.move(d); if (ch === 2) return this.featGo(this.state.feat + d); if (ch === 3) return this.wizGo(this.state.wiz + d); if (ch === 4) return this.slideGo(this.state.slide + d); }
  key(e: KeyboardEvent) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = ((e.target as HTMLElement | null)?.tagName) || ""; if (tag === "INPUT" || tag === "TEXTAREA") return;
    this.konami.push(e.key); this.konami = this.konami.slice(-10); if (this.konami.join() === KONAMI.join()) { this.konami = []; return this.missIt(); }
    if (/^[0-9]$/.test(e.key)) return this.channel(+e.key);
    if (e.key === "ArrowLeft") { e.preventDefault(); return this.side(-1); }
    if (e.key === "ArrowRight") { e.preventDefault(); return this.side(1); }
    if (e.key === "ArrowUp") { e.preventDefault(); return this.channel(this.state.ch - 1); }
    if (e.key === "ArrowDown") { e.preventDefault(); return this.channel(Math.min(5, this.state.ch + 1)); }
    if (e.key === "Enter" && tag !== "BUTTON" && tag !== "A") return this.ok();
    if (e.key === "m" || e.key === "M") return this.toggleSound();
    if (e.key === "i" || e.key === "I") return this.cycleTheme();
    if (e.key === "p" || e.key === "P") return this.state.power ? this.powerOff() : this.powerOn();
  }
  move(d: number) { if (!this.state.booted) return this.skip(); this.click(); this.focusTile(this.state.focus + d); }
  ok() {
    if (!this.state.power) return this.powerOn(); if (!this.state.booted) return this.skip();
    const ch = this.state.ch;
    if (ch === 3) return this.wizGo(this.state.wiz + 1);
    if (ch === 4) return this.slideGo(this.state.slide + 1);
    this.channel(ch + 1);
  }
  async missIt() {
    if (!this.state.booted) return; const cl = this.r.clutter.current!, miss = this.r.miss.current!;
    if (this.state.ch !== 0) this.channel(0);
    cl.getAnimations({ subtree: true }).forEach((a) => a.cancel()); cl.style.visibility = "visible"; cl.style.opacity = "0";
    await this.cut(250); cl.style.opacity = "1"; miss.style.opacity = "1";
    await wait(3000); miss.style.opacity = "0"; await this.cut(250); cl.style.opacity = "0"; cl.style.visibility = "hidden";
  }
  async copyPrompt() {
    this.click(); const text = this.props.data.prompt;
    try { await navigator.clipboard.writeText(text); }
    catch { const t = document.createElement("textarea"); t.value = text; t.style.position = "fixed"; t.style.opacity = "0"; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); } catch { /* ignore */ } t.remove(); }
    this.setState({ copied: true }); clearTimeout(this.copyT); this.copyT = setTimeout(() => this.setState({ copied: false }), 2600);
  }

  // ---- view models
  // The big screen on the On air wall; auto-advances pass auto so the remote click stays quiet.
  featGo(i: number, auto = false) {
    const res = this.props.data.results, n = res.length; if (!n) return; if (!auto) this.click();
    const feat = ((i % n) + n) % n; this.featT = 0;
    this.setState({ feat }, () => { this.showThumb(feat); this.preload(feat + 1); });
  }
  preload(i: number) { const res = this.props.data.results; const r = res[i % res.length]; if (r) new Image().src = cdn(r.image); }
  // Keeps the featured thumbnail in view inside the wall (never the page), and carries keyboard focus along with it.
  showThumb(i: number) {
    const w = this.r.wall.current; const t = w?.querySelector<HTMLElement>(`[data-feat="${i}"]`); if (!w || !t) return;
    if (w.contains(document.activeElement)) t.focus({ preventScroll: true });
    const behavior: ScrollBehavior = this.reduced ? "auto" : "smooth";
    if (w.scrollWidth > w.clientWidth + 1) { if (t.offsetLeft < w.scrollLeft || t.offsetLeft + t.offsetWidth > w.scrollLeft + w.clientWidth) w.scrollTo({ left: t.offsetLeft - 8, behavior }); }
    else if (t.offsetTop < w.scrollTop || t.offsetTop + t.offsetHeight > w.scrollTop + w.clientHeight) w.scrollTo({ top: t.offsetTop - 8, behavior });
  }
  creditGroups() {
    const prs = this.props.data.prs, seen: Record<string, 1> = {}, groups: Record<string, { login: string; url: string; avatar: string }[]> = {};
    const add = (g: string, login: string, avatar?: string) => { groups[g] = groups[g] || []; const k = g + login; if (seen[k]) return; seen[k] = 1; groups[g].push({ login, url: "https://github.com/" + login, avatar: (avatar || `https://github.com/${login}.png`) + (avatar ? "&s=64" : "?size=64") }); };
    add("started", "Gathin23");
    prs.forEach((p) => { if (p.login !== "Gathin23") add(classify(p.title), p.login, p.avatar); });
    this.props.data.showcase.forEach((s) => { if (s.by) add("built", s.by); });
    const list = GROUPS.filter(([k]) => groups[k] && groups[k].length).map(([k, title]) => ({ title, people: groups[k], dup: false }));
    // The roll repeats the list once; the repeat stays out of the tab order and the accessibility tree.
    return this.reduced ? list : list.concat(list.map((g) => ({ ...g, dup: true })));
  }
  // ---- render
  render() {
    const s = this.state;
    return (
      <div ref={this.r.root} className={s.mobile && s.nudge ? "nudge-on" : undefined} style={S("position:fixed;inset:0;background:#070708;font-family:Outfit,sans-serif;color:rgba(255,255,255,.95);-webkit-font-smoothing:antialiased")}>
        <div className="m-bezel" style={S("position:absolute;inset:0;padding:clamp(8px,2.4vw,30px) clamp(8px,2.4vw,30px) max(64px,5vw);background:linear-gradient(180deg,#1c1c1f 0%,#121214 60%,#0b0b0c 100%);box-shadow:inset 0 1px 0 rgba(255,255,255,.07)")}>
          <div ref={this.r.screen} className="m-screen" style={S("position:relative;height:100%;border-radius:clamp(8px,1.5vw,22px);background:#000;overflow:hidden;container-type:inline-size;box-shadow:0 0 0 2px #000,0 0 0 3px #232326,inset 0 0 60px rgba(0,0,0,.9)")}>
            <div ref={this.r.scroll} className="m-scroll" style={S("position:absolute;inset:0;overflow-y:auto;overscroll-behavior:contain;scroll-snap-type:y proximity;scrollbar-width:none")}>
              {this.renderBoot()}
              {this.renderStory()}
              {this.renderWall()}
              {this.renderHowTo()}
              {this.renderMade()}
              {this.renderCredits()}
              <section id="ch-end" aria-label="End of transmission" className="m-end" style={S("position:relative;min-height:70%;scroll-snap-align:none;background:var(--page,#15181e);color:var(--ink,rgba(255,255,255,.95));display:grid;place-items:center;border-top:1px solid var(--line,rgba(255,255,255,.12))")}>
                <div ref={this.r.end} style={S("display:flex;flex-direction:column;align-items:center;gap:16px;text-align:center;padding:24px")}>
                  <div style={S("font-family:'VT323',monospace;font-size:28px;letter-spacing:.14em;color:var(--ink-dim,rgba(255,255,255,.6))")}>END OF TRANSMISSION</div>
                  <div className="mx-pullgauge" style={S("display:flex;flex-direction:column;gap:8px;width:min(320px,70vw);font-family:'VT323',monospace;font-size:18px;letter-spacing:.08em;color:var(--ink-dim,rgba(255,255,255,.6))")}>
                    <div ref={this.gaugeTextRef} aria-live="polite">KEEP SCROLLING TO TURN IT OFF</div>
                    <div style={S("position:relative;height:10px;background:repeating-linear-gradient(90deg,currentColor 0 5px,transparent 5px 8px);opacity:.25")} />
                    <div ref={this.gaugeRef} style={S("position:relative;height:10px;margin-top:-18px;width:0;background:repeating-linear-gradient(90deg,currentColor 0 5px,transparent 5px 8px);color:var(--ink,#fff);transition:width .08s linear")} />
                  </div>
                  <button onClick={() => this.onPower()} style={S("height:44px;padding:0 20px;border-radius:22px;border:0;background:var(--pill-bg,rgba(255,255,255,.12));box-shadow:inset 0 0 0 1px var(--pill-rim,rgba(255,255,255,.22));font-size:15px;font-weight:500")}>Turn it off</button>
                  <a href={COFFEE} target="_blank" rel="noopener" className="mx-coffee" style={S("font-size:14px;color:var(--ink-dim,rgba(255,255,255,.6))")}>Buy me a coffee</a>
                </div>
              </section>
            </div>
            <div ref={this.r.osd} aria-live="polite" style={S("position:absolute;top:clamp(6px,1cqw,14px);right:clamp(10px,1.6cqw,22px);z-index:5;font-family:'VT323',monospace;font-size:clamp(22px,3.2cqw,40px);line-height:1;letter-spacing:.06em;color:var(--osd,#CFFFCF);text-shadow:0 0 10px var(--osd-glow,rgba(140,255,140,.6)),1px 0 0 rgba(255,0,0,.25),-1px 0 0 rgba(0,160,255,.25);opacity:0;transition:opacity .3s;pointer-events:none")}>{s.osd}</div>
            {s.nudge && !s.mobile && this.renderNudge()}
            <canvas ref={this.staticRef} width={192} height={108} aria-hidden="true" style={S("position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated;opacity:0;z-index:6;pointer-events:none")} />
            <div ref={this.r.flash} aria-hidden="true" style={S("position:absolute;inset:0;background:#fff;opacity:0;z-index:7;pointer-events:none;transform-origin:center")} />
            <div ref={this.r.off} style={S("position:absolute;inset:0;z-index:8;display:none;flex-direction:column;align-items:center;justify-content:center;gap:clamp(14px,2cqw,24px);padding:6cqw;background:radial-gradient(80% 70% at 50% 40%,#0c0c0e,#050506);color:rgba(255,255,255,.88);text-align:center;font-size:clamp(14px,1.6cqw,19px);font-weight:400;opacity:0")}>
              <div style={S("display:flex;gap:clamp(14px,3cqw,40px);flex-wrap:wrap;justify-content:center;font-weight:400")}>
                <a href={GH} target="_blank" rel="noopener">GitHub</a>
                <a href={TWEET} target="_blank" rel="noopener">The tweet</a>
                <a href={GH + "/blob/main/LICENSE"} target="_blank" rel="noopener">MIT licence</a>
                <a href={COFFEE} target="_blank" rel="noopener">Buy me a coffee</a>
              </div>
              <p style={S("margin:0;max-width:34em;line-height:1.45;text-wrap:pretty")}>Started as one afternoon on my parents&apos; TV. Built with Claude Code.</p>
              <button onClick={() => this.powerOn()} className="hov-white" style={S("height:44px;padding:0 20px;border-radius:22px;border:0;background:rgba(255,255,255,.08);box-shadow:inset 0 0 0 1px rgba(255,255,255,.22);font-family:'VT323',monospace;font-size:clamp(18px,1.8cqw,22px);letter-spacing:.08em")}>TURN IT BACK ON</button>
            </div>
            {/* The CRT layers read as texture on the boot channel and as murk over text, so they fade once you scroll. */}
            <div aria-hidden="true" className="m-crt" style={{ ...S("position:absolute;inset:0;z-index:9;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(0,0,0,.16) 0 1px,rgba(0,0,0,0) 1px 3px);transition:opacity .6s"), opacity: s.ch === 0 ? 1 : 0.25 }} />
            <div aria-hidden="true" className="m-crt" style={{ ...S("position:absolute;inset:0;z-index:9;pointer-events:none;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 58%,rgba(0,0,0,.42) 100%),linear-gradient(112deg,rgba(255,255,255,.07) 0%,rgba(255,255,255,0) 38%);transition:opacity .6s"), opacity: s.ch === 0 ? 1 : 0.3 }} />
          </div>
          <div className="m-strip" style={S("position:absolute;left:0;right:0;bottom:0;height:max(64px,5vw);display:flex;align-items:center;justify-content:center;gap:16px;pointer-events:none")}>
            <div style={S("font-size:10px;font-weight:500;letter-spacing:.32em;text-transform:uppercase;color:rgba(255,255,255,.22)")}>cleanyour.tv</div>
            <div aria-hidden="true" style={S("width:6px;height:6px;border-radius:50%;background:var(--led,#4bff7a);box-shadow:0 0 6px var(--led,#4bff7a),0 0 1px #000")} />
          </div>
        </div>
        {s.mounted && !s.mobile && this.renderRemote()}
        {s.mounted && s.mobile && this.renderMobileBar()}
        {s.mounted && s.mobile && s.nudge && this.renderNudge()}
      </div>
    );
  }

  onPower() { if (this.state.power) this.powerOff(); else this.powerOn(); }

  renderNudge() {
    return (
      <div role="dialog" aria-label="New: add-ons, themes and settings" className="m-nudge">
        <span className="m-nudge-k">NEW</span>
        <span className="m-nudge-t">Themes, settings and add-ons for the launcher</span>
        <a href="/addons" className="m-nudge-go">Take a look</a>
        <button type="button" aria-label="Close" className="m-nudge-x" onClick={() => this.setState({ nudge: false })}>×</button>
      </div>
    );
  }

  renderBoot() {
    const s = this.state;
    const counters = s.counters.map((c) => ({ ...c, text: c.display.toLocaleString("en-US"), pct: s.booted ? Math.min(100, c.value / c.max * 100) : 0 }));
    const tile = "position:relative;width:clamp(64px,14cqw,180px);aspect-ratio:16/9;border-radius:clamp(8px,1.25cqw,16px);display:grid;place-items:center;font-weight:500;font-size:clamp(10px,1.4cqw,18px);letter-spacing:.02em;color:#fff;opacity:0;transition:transform .25s;cursor:default;background:";
    const name = "position:absolute;top:calc(100% + clamp(10px,1.4cqw,18px));left:0;right:0;text-align:center;font-size:clamp(9px,1.1cqw,14px);font-weight:500;letter-spacing:.02em;color:var(--ink,rgba(255,255,255,.95));opacity:0;transition:opacity .25s";
    const pill = "height:clamp(24px,3.3cqw,42px);padding:0 clamp(10px,1.5cqw,20px);border-radius:999px;background:var(--pill-bg,linear-gradient(180deg,rgba(255,255,255,.18),rgba(255,255,255,.08)));box-shadow:inset 0 0 0 1px var(--pill-rim,rgba(255,255,255,.22));display:flex;align-items:center;font-size:clamp(9px,1.15cqw,15px);font-weight:500";
    const zap = "flex-shrink:0;width:11cqw;aspect-ratio:16/9;border-radius:.8cqw;display:grid;place-items:center;";
    const chip = "flex-shrink:0;padding:.7cqw 1.6cqw;border-radius:.6cqw;background:rgba(255,255,255,.08);box-shadow:inset 0 0 0 1px rgba(255,255,255,.12)";
    const hoverTile = (e: React.MouseEvent<HTMLDivElement>) => { if (this.state.booted) this.focusTile(Number(e.currentTarget.dataset.tile)); };
    const clickTile = (e: React.MouseEvent<HTMLDivElement>) => { if (!this.state.booted) return; this.click(); e.currentTarget.animate([{ transform: "scale(1.06)" }, { transform: "scale(.98)" }, { transform: "scale(1.06)" }], { duration: 220, easing: "ease-out" }); };
    return (
      <section id="ch-00" data-ch="0" aria-label="Channel 00, Boot" className="m-hero" onClick={() => this.skip()} style={S("position:relative;height:100%;scroll-snap-align:start;overflow:hidden")}>
        <div ref={this.r.launcher} style={S("position:absolute;inset:0;background-color:var(--bg,#000);background-image:var(--wall,none);background-size:cover;background-position:center;color:var(--ink,rgba(255,255,255,.95))")}>
          <div ref={this.r.ambient} style={S("position:absolute;inset:0;background:radial-gradient(55% 50% at 30% 42%,var(--glow,rgba(0,0,0,0)) 0%,rgba(0,0,0,0) 70%);transition:opacity .6s;opacity:.9;pointer-events:none")} />
          <div className="m-hero-top" style={S("position:absolute;left:4.2cqw;right:4.2cqw;top:clamp(44px,5.6cqw,72px);display:flex;justify-content:space-between;align-items:flex-end;gap:12px")}>
            <div style={S("display:flex;flex-direction:column;gap:2px;min-width:0")}>
              <div className="mx-greet" style={S("font-size:clamp(9px,.95cqw,12px);font-weight:500;letter-spacing:.22em;text-transform:uppercase;opacity:.55;padding-left:2px")}>{s.greeting}</div>
              <div style={S("display:flex;align-items:flex-end;gap:clamp(6px,.8cqw,12px);white-space:nowrap")}>
                <div style={S("font-size:clamp(24px,4cqw,52px);font-weight:300;letter-spacing:-.04em;line-height:1")}>{s.clock}</div>
                <div className="mx-ampm" style={S("font-size:clamp(9px,1.15cqw,15px);font-weight:500;letter-spacing:.08em;text-transform:uppercase;opacity:.7;padding-bottom:2px")}>{s.ampm}</div>
                <div className="m-date" style={S("width:1px;height:clamp(14px,2cqw,26px);background:var(--ink-dim,rgba(255,255,255,.3));opacity:.5;margin:0 clamp(2px,.4cqw,6px) 3px")} />
                <div className="m-date" style={S("font-size:clamp(9px,1.1cqw,14px);letter-spacing:.14em;text-transform:uppercase;opacity:.65;padding-bottom:3px")}>{s.date}</div>
              </div>
            </div>
            <div className="m-pills" style={S("display:flex;gap:clamp(4px,.8cqw,10px);flex-shrink:0")}>
              {/* The launcher's Inputs / Wi-Fi / Settings pills, as the site's own navigation. */}
              <a href="/addons" onClick={(e) => e.stopPropagation()} className="m-navpill" style={S(pill)}>Add-ons</a>
              <a href="/app/android" onClick={(e) => e.stopPropagation()} className="m-navpill m-navpill-new" style={S(pill)}>App<span className="m-new" aria-label="new">NEW</span></a>
              <a href="/press" onClick={(e) => e.stopPropagation()} className="m-navpill" style={S(pill)}>Press</a>
              <a href="/faq" onClick={(e) => e.stopPropagation()} className="m-navpill" style={S(pill)}>FAQ</a>
            </div>
          </div>
          <div ref={this.r.dock} className="m-dock" style={S("position:absolute;left:50%;bottom:clamp(28px,5cqw,64px);transform:translateX(-50%);padding:clamp(8px,1.1cqw,14px);border-radius:clamp(16px,2cqw,26px);background:var(--band,#141416);box-shadow:inset 0 0 0 1px var(--band-rim,rgba(255,255,255,.12));display:flex;gap:clamp(8px,1.6cqw,22px)")}>
            {["Films", "Series", "Music", "Live TV"].map((label, i) => (
              <div key={label} data-tile={i} data-color={TILE_COLORS[i]} onMouseEnter={hoverTile} onClick={clickTile} style={S(tile + TILE_COLORS[i])}>
                {label}
                <div data-name style={S(name)}>{label}</div>
              </div>
            ))}
          </div>
          <div ref={this.r.glass} aria-hidden="true" className="m-glass" style={S("position:absolute;left:0;top:0;width:10px;height:10px;opacity:0;pointer-events:none;border-radius:clamp(10px,1.6cqw,22px);background:var(--glass-fill,linear-gradient(180deg,rgba(255,255,255,.26),rgba(255,255,255,.08)));box-shadow:inset 0 0 0 1.5px var(--glass-rim,rgba(255,255,255,.8)),0 0 0 1px rgba(255,255,255,.14),0 0 14px rgba(255,255,255,.28);will-change:transform,width,height")}>
            <div style={S("position:absolute;inset:0;border-radius:inherit;background:linear-gradient(180deg,rgba(255,255,255,.35),rgba(255,255,255,0) 45%)")} />
          </div>
        </div>
        <div ref={this.r.clutter} aria-hidden="true" className="m-clutter" style={S("position:absolute;inset:0;background:linear-gradient(180deg,#0B1220 0%,#05070C 100%);color:#fff;overflow:hidden")}>
          <div data-row="3" style={S("display:flex;justify-content:space-between;align-items:center;padding:clamp(44px,5cqw,66px) 4.2cqw 0;transform-origin:top;font-size:clamp(10px,1.6cqw,20px)")}>
            <div style={S("display:flex;gap:clamp(10px,2.6cqw,34px);align-items:center")}>
              <div style={S("display:flex;gap:6px;align-items:center")}><div style={S("display:flex;gap:2px")}><div style={S("width:.7cqw;height:.7cqw;border-radius:50%;background:#4285F4")} /><div style={S("width:.7cqw;height:.7cqw;border-radius:50%;background:#EA4335")} /><div style={S("width:.7cqw;height:.7cqw;border-radius:50%;background:#FBBC04")} /></div>Search</div>
              <div style={S("border-bottom:2px solid #fff;padding-bottom:2px")}>Home</div><div style={S("opacity:.8")}>Shop</div><div style={S("opacity:.8")}>Discover</div><div style={S("opacity:.8")}>Apps</div>
            </div>
            <div style={S("display:flex;gap:clamp(8px,1.6cqw,20px);align-items:center;opacity:.85")}><div style={S("width:1.4cqw;height:1.4cqw;border:1.5px solid #fff;border-radius:50%")} /><div style={S("width:1.4cqw;height:1.4cqw;border:1.5px solid #fff;border-radius:3px")} /><div style={S("width:1.4cqw;height:1.4cqw;border-radius:50%;background:#1E9E5A")} />11:54</div>
          </div>
          <div data-row="2" style={S("position:relative;margin:1.6cqw 4.2cqw 0;height:24cqw;border-radius:1cqw;overflow:hidden;background:repeating-linear-gradient(135deg,#1C2A4A 0 1.2cqw,#223558 1.2cqw 2.4cqw);transform-origin:top")}>
            <div style={S("position:absolute;inset:0;background:linear-gradient(90deg,#070B14 30%,rgba(7,11,20,.2) 70%)")} />
            <div style={S("position:absolute;left:3cqw;top:3cqw;right:40%;display:flex;flex-direction:column;gap:.8cqw")}>
              <div style={S("font-size:clamp(9px,1.3cqw,16px);font-weight:500;opacity:.8")}>Sponsored</div>
              <div style={S("font-size:clamp(14px,3cqw,38px);font-weight:500;line-height:1.05")}>Savings, now on your TV</div>
              <div style={S("font-size:clamp(9px,1.3cqw,16px);opacity:.75;line-height:1.3")}>Open an account from your sofa. Terms apply. Offer ends soon, probably.</div>
            </div>
            <div style={S("position:absolute;right:3cqw;top:2.4cqw;font-family:'VT323',monospace;font-size:clamp(10px,1.6cqw,20px);letter-spacing:.1em;padding:.2cqw .8cqw;border:1px solid rgba(255,255,255,.5);opacity:.8")}>AD</div>
            <div data-row="1" className="m-blur" style={S("position:absolute;left:0;right:0;bottom:0;padding:1.6cqw 3cqw;background:rgba(10,14,24,.78);backdrop-filter:blur(6px);display:flex;justify-content:space-between;align-items:center;gap:1cqw;transform-origin:top")}>
              <div style={S("display:flex;flex-direction:column;gap:.4cqw")}><div style={S("font-size:clamp(11px,2cqw,26px);font-weight:500")}>The Discover tab is going away soon</div><div style={S("font-size:clamp(9px,1.3cqw,16px);opacity:.8")}>Your recommendations and watchlist will move to the Home tab.</div></div>
              <div style={S("font-size:clamp(9px,1.3cqw,16px);padding:.6cqw 1.4cqw;border-radius:999px;background:rgba(255,255,255,.1);flex-shrink:0")}>Dismiss</div>
            </div>
          </div>
          <div style={S("margin:2cqw 4.2cqw 0;font-size:clamp(10px,1.5cqw,18px);font-weight:500")}>Favourite apps</div>
          <div style={S("display:flex;gap:1.2cqw;margin:1cqw 0 0 4.2cqw;overflow:hidden")}>
            <div data-zap="1" style={S(zap + "background:#1F5BFF;font-weight:500;font-size:clamp(9px,1.5cqw,18px)")}>streamr</div>
            <div data-zap="2" style={S(zap + "background:#1A73E8")}><div style={S("width:3cqw;height:2cqw;border:2px solid #fff;border-radius:.3cqw")} /></div>
            <div data-zap="3" style={S(zap + "background:#F2F2F2;color:#D22;font-weight:500;font-size:clamp(9px,1.5cqw,18px)")}>Vuu</div>
            <div data-zap="4" style={S(zap + "background:#FFFFFF;color:#333;font-weight:500;font-size:clamp(8px,1.2cqw,14px)")}>App Store</div>
            <div data-zap="5" style={S(zap + "background:#1A1A3E;font-weight:300;font-size:clamp(12px,2.2cqw,28px)")}>Z6</div>
            <div data-zap="6" style={S(zap + "background:linear-gradient(135deg,#2A1BB0,#C11C9C);font-weight:500;font-size:clamp(9px,1.4cqw,17px)")}>Kinoo+</div>
            <div data-zap="7" style={S(zap + "background:#EFEFEF;color:#C8102E;font-weight:500;font-size:clamp(9px,1.5cqw,18px);letter-spacing:.06em")}>FLIXA</div>
            <div data-zap="8" style={S(zap + "background:#FF7A1A;font-weight:500;font-size:clamp(9px,1.5cqw,18px)")}>ottr</div>
            <div data-zap="9" style={S(zap + "background:#C8102E;font-weight:500;font-size:clamp(9px,1.5cqw,18px)")}>bingee</div>
          </div>
          <div data-row="0" style={S("display:flex;gap:1cqw;margin:2cqw 0 0 4.2cqw;overflow:hidden;transform-origin:top;font-size:clamp(9px,1.3cqw,16px)")}>
            {["Play next", "Top-selling movies", "Popular movies and TV shows", "Trending", "For you"].map((t) => <div key={t} style={S(chip)}>{t}</div>)}
          </div>
          <div data-popup style={S("position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(36cqw,420px);padding:2cqw;border-radius:1.2cqw;background:#161B28;box-shadow:0 20px 60px rgba(0,0,0,.7),inset 0 0 0 1px rgba(255,255,255,.12);display:flex;flex-direction:column;gap:1cqw")}>
            <div style={S("font-size:clamp(12px,2cqw,24px);font-weight:500")}>Try Premium+ free</div>
            <div style={S("font-size:clamp(9px,1.3cqw,16px);opacity:.8;line-height:1.35")}>Three months on us, then a monthly fee. Cancel any time, from a menu you will not find.</div>
            <div style={S("display:flex;gap:.8cqw;margin-top:.4cqw;font-size:clamp(9px,1.3cqw,16px)")}><div style={S("padding:.7cqw 1.6cqw;border-radius:999px;background:#fff;color:#111;font-weight:500")}>Start trial</div><div style={S("padding:.7cqw 1.6cqw;border-radius:999px;background:rgba(255,255,255,.1)")}>Not now</div></div>
          </div>
          <div ref={this.r.miss} style={S("position:absolute;left:50%;bottom:4cqw;transform:translateX(-50%);font-family:'VT323',monospace;font-size:clamp(20px,3.4cqw,40px);color:#CFFFCF;text-shadow:0 0 10px rgba(140,255,140,.6);opacity:0;pointer-events:none")}>miss it?</div>
        </div>
        <div ref={this.r.title} className="m-title" style={S("position:absolute;left:0;right:0;top:0;bottom:clamp(90px,16cqw,200px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:clamp(14px,2cqw,28px);padding:clamp(60px,9cqw,110px) 5cqw 0;text-align:center;opacity:0;pointer-events:none;color:var(--ink,rgba(255,255,255,.95))")}>
          <div style={S("display:flex;flex-direction:column;align-items:center;gap:clamp(6px,.8cqw,12px)")}>
            {/* The community Android app (udhaykumarbala): a pill above the wordmark; narrow phones use the App pill instead. */}
            <a href="/app/android" onClick={(e) => e.stopPropagation()} className="m-applive no-border act-shrink" style={S("pointer-events:auto;display:inline-flex;align-items:center;gap:10px;height:clamp(32px,3cqw,40px);padding:0 clamp(14px,1.6cqw,20px);margin-bottom:clamp(4px,.6cqw,10px);border-radius:999px;background:#cfffcf;color:#0b2a14;font-size:clamp(13px,1.3cqw,16px);font-weight:600;letter-spacing:.02em;box-shadow:0 6px 24px rgba(140,255,140,.25)")}>
              New: clean your TV from your phone →
            </a>
            <h1 className="m-h1" aria-label="CleanYourTV" style={S("margin:0;display:flex;align-items:center;gap:.22em;font-family:var(--font-fredoka),'Fredoka',sans-serif;font-size:clamp(40px,min(8cqw,11vh),104px);font-weight:600;letter-spacing:-.01em;line-height:1;white-space:nowrap")}>
              <svg aria-hidden="true" viewBox="10 7 44 51" style={S("height:1.05em;width:auto;flex:none;margin-top:-.08em")}>
                <path d="M26 20 L19 9 M38 20 L45 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
                <circle cx="19" cy="9" r="2.6" fill="currentColor" />
                <circle cx="45" cy="9" r="2.6" fill="currentColor" />
                <rect x="10" y="20" width="44" height="32" rx="8" fill="currentColor" />
                <rect x="15" y="25" width="34" height="22" rx="4" fill="var(--brand,#cfffcf)" />
                <rect x="15" y="25" width="34" height="22" rx="4" fill="url(#h1g)" />
                <rect x="20" y="53" width="7" height="4" rx="2" fill="currentColor" />
                <rect x="37" y="53" width="7" height="4" rx="2" fill="currentColor" />
                <defs>
                  <linearGradient id="h1g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#ffffff" stopOpacity=".35" />
                    <stop offset=".45" stopColor="#ffffff" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              <span>CleanYour<span style={S("color:var(--brand,#cfffcf)")}>TV</span></span>
            </h1>
            <p className="m-tag" style={S("margin:0;font-size:clamp(15px,2.1cqw,26px);font-weight:300;opacity:.8")}>Your TV, minus the ads.</p>
            <p className="m-sub" style={S("margin:0;max-width:60em;font-size:clamp(13px,1.2cqw,16px);line-height:1.45;opacity:.75;text-wrap:balance")}>For Android TV and Google TV: an AI coding assistant removes the ads over Wi-Fi. No root, nothing uninstalled, free and open source.</p>
          </div>
          <div className="m-counters" style={S("width:min(86cqw,760px);display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:clamp(8px,1.4cqw,18px) clamp(14px,2.4cqw,32px);font-family:'VT323',monospace;font-size:clamp(18px,2.1cqw,28px);line-height:1")}>
            {counters.map((c) => (
              <div key={c.key} style={S("display:flex;flex-direction:column;gap:5px;text-align:left")}>
                <div style={S("display:flex;justify-content:space-between;gap:8px")}><span style={S("opacity:.7;letter-spacing:.06em")}>{c.label}</span><span>{c.text}</span></div>
                <div className="m-gauge" style={S("position:relative;height:clamp(9px,1cqw,13px);background:repeating-linear-gradient(90deg,currentColor 0 5px,transparent 5px 8px);opacity:1")}>
                  <div style={S("position:absolute;inset:0;background:repeating-linear-gradient(90deg,currentColor 0 5px,transparent 5px 8px);opacity:.22")} />
                  <div style={{ ...S("position:absolute;left:0;top:0;bottom:0;background:repeating-linear-gradient(90deg,currentColor 0 5px,transparent 5px 8px);transition:width 1.4s cubic-bezier(.2,.8,.2,1)"), width: c.pct + "%" }} />
                </div>
              </div>
            ))}
          </div>
          <div className="m-btns" style={S("display:flex;gap:10px;flex-wrap:wrap;justify-content:center")}>
            <button onClick={() => this.channel(3)} className="act-shrink" style={S("pointer-events:auto;height:44px;padding:0 24px;border-radius:22px;border:0;background:var(--ink,#fff);color:var(--bg,#000);font-size:15px;font-weight:500;letter-spacing:.01em;transition:transform .2s")}>Set up your TV</button>
            <a href={GH} target="_blank" rel="noopener" onClick={() => this.click()} className="hov-white act-shrink" style={S("pointer-events:auto;display:flex;align-items:center;gap:8px;height:44px;padding:0 20px;border-radius:22px;border:0;background:var(--pill-bg,linear-gradient(180deg,rgba(255,255,255,.18),rgba(255,255,255,.08)));box-shadow:inset 0 0 0 1px var(--pill-rim,rgba(255,255,255,.22));font-size:15px;font-weight:500;letter-spacing:.01em;color:inherit;transition:background .2s,transform .2s")}>
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" /></svg>
              Star on GitHub
            </a>
            {/* Launch week: the Product Hunt badge sits with the buttons. */}
            <a href={PH} target="_blank" rel="noopener" className="no-border m-phbadge" style={S("pointer-events:auto;display:flex;align-items:center;justify-content:center;line-height:0")}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1286319&theme=dark" alt="CleanYourTV on Product Hunt" width={204} height={44} style={S("width:204px;height:44px;display:block")} />
            </a>
          </div>
          {/* The press, scrolling under the buttons; hover pauses it, reduced motion keeps it still. The link after it opens the full list on /press; the duration grows with the list so the speed stays put. */}
          <div className="m-press" style={S("pointer-events:auto;width:min(90cqw,900px);display:flex;align-items:center;gap:clamp(10px,1.4cqw,18px)")}>
            <span style={S("flex-shrink:0;font-family:'VT323',monospace;font-size:clamp(18px,1.8cqw,22px);font-weight:700;letter-spacing:.14em;color:var(--ink,#fff)")}>FEATURED IN</span>
            <div style={S("flex:1;min-width:0;overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent);mask-image:linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent)")}>
              <div className="press-track" style={{ ...S("display:flex;width:max-content"), animation: this.state.mounted && this.reduced ? "none" : `tickerSlide ${PRESS.length * 3.6}s linear infinite` }}>
                {[0, 1].map((k) => (
                  <div key={k} aria-hidden={k === 1 ? true : undefined} style={S("display:flex;align-items:center;gap:clamp(20px,2.6cqw,34px);padding-right:clamp(20px,2.6cqw,34px)")}>
                    {PRESS.map(([slug, name, url]) => (
                      <a key={slug} href={url} target="_blank" rel="noopener" title={name} tabIndex={k === 1 ? -1 : undefined} className="no-border" style={S("line-height:0;flex-shrink:0")}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={cdn(`/press/${slug}.png`)} alt={k === 1 ? "" : name} width={Math.round((PRESS_LOGO_W[slug] ?? 88) * 28 / 88)} height={28} loading="lazy" style={S("height:clamp(24px,2.4cqw,32px);width:auto;display:block")} />
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <a href="/press" aria-label={`All ${this.props.pressTotal} articles about CleanYourTV`} className="hov-bright no-border mx-more" style={S("flex-shrink:0;font-family:'VT323',monospace;font-size:clamp(18px,1.8cqw,22px);letter-spacing:.08em;white-space:nowrap;color:var(--ink-dim,rgba(255,255,255,.8))")}>+{this.props.pressTotal - PRESS.length}<span className="press-more-word"> MORE</span> ▸</a>
          </div>
        </div>
        {s.mounted && !s.booted && s.power && (
          <button onClick={(e) => { e.stopPropagation(); this.skip(); }} className="hov-white m-skip" style={S("position:absolute;left:clamp(12px,2cqw,28px);bottom:clamp(12px,2cqw,28px);z-index:3;height:44px;padding:0 18px;border-radius:22px;border:0;background:rgba(0,0,0,.55);box-shadow:inset 0 0 0 1px rgba(255,255,255,.3);color:#fff;font-family:'VT323',monospace;font-size:22px;letter-spacing:.08em")}>SKIP INTRO ▸▸</button>
        )}
      </section>
    );
  }

  sectionStyle(gap = "clamp(22px,3cqw,40px)") {
    return S(`position:relative;min-height:100%;scroll-snap-align:start;background:linear-gradient(180deg,rgba(255,255,255,.035),rgba(255,255,255,0) 32%),var(--page,#15181e);color:var(--ink,rgba(255,255,255,.95));padding:clamp(56px,7cqw,96px) var(--pad-r,clamp(16px,6cqw,84px)) clamp(48px,6cqw,84px) clamp(16px,6cqw,84px);display:flex;flex-direction:column;gap:${gap};border-top:1px solid var(--line,rgba(255,255,255,.12))`);
  }
  header(kicker: string, title: string, blurb: string) {
    return (
      <header style={S("display:flex;flex-direction:column;gap:10px;max-width:1040px")}>
        <div style={S("font-family:'VT323',monospace;font-size:22px;letter-spacing:.12em;color:var(--ink-dim,rgba(255,255,255,.6))")}>{kicker}</div>
        <h2 style={S("margin:0;font-size:clamp(34px,min(5.2cqw,8vh),72px);font-weight:300;letter-spacing:-.03em;line-height:1")}>{title}</h2>
        <p style={S("margin:0;font-size:clamp(16px,1.5cqw,19px);line-height:1.5;color:var(--ink,rgba(255,255,255,.95));opacity:.9;text-wrap:pretty")}>{blurb}</p>
      </header>
    );
  }

  renderStory() {
    const d = this.props.data, tw = d.tweet;
    const stars = d.stars.toLocaleString("en-US");
    const ticker = `Oct 17, 2:21 PM: posted · 48 hours later: ${stars} stars, ${d.forks.toLocaleString("en-US")} forks, ${d.prCount.toLocaleString("en-US")} pull requests · ${d.tvs.length} TVs from ${brandsOf(d.tvs).length} brands`;
    return (
      <section id="ch-01" data-ch="1" aria-label="Channel 01, The story" className="m-section" style={this.sectionStyle()}>
        {this.header("CH 01 · THE STORY", "One afternoon, one tweet.", "It started on one TV. Then other people tried it on theirs.")}
        <div style={S("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));gap:clamp(18px,3cqw,40px)")}>
          <div style={S("position:relative;border-radius:16px;overflow:hidden;background:#0B0F16;color:rgba(255,255,255,.95);box-shadow:inset 0 0 0 1px rgba(255,255,255,.1);display:flex;flex-direction:column")}>
            <div style={S("display:flex;justify-content:space-between;align-items:center;padding:12px 16px;font-family:'VT323',monospace;font-size:20px;letter-spacing:.1em")}>
              <span style={S("background:#C8102E;color:#fff;padding:0 8px")}>NEWS</span>
              <span style={S("opacity:.75")}>OCT 17 · 2:21 PM</span>
            </div>
            <div style={S("flex:1;display:grid;place-items:center;padding:6px 18px 66px")}>
              <article style={S("width:100%;max-width:480px;background:#FFFFFF;color:#0F1419;border-radius:16px;padding:16px 18px;display:flex;flex-direction:column;gap:10px;box-shadow:0 18px 40px rgba(0,0,0,.5);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif")}>
                <div style={S("display:flex;gap:10px;align-items:center")}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cdn("/docs/avatar.jpg")} alt="" width={40} height={40} style={S("width:40px;height:40px;border-radius:50%;background:#E6E6E6")} />
                  <div style={S("display:flex;flex-direction:column;line-height:1.25")}><span style={S("font-weight:700;font-size:15px")}>Gathin</span><span style={S("font-size:14px;color:#536471")}>@gathint</span></div>
                </div>
                <p className="mx-tweet" style={S("margin:0;font-size:clamp(13px,1.2cqw,15px);line-height:1.35;white-space:pre-line;text-wrap:pretty")}>{tw.text}</p>
                <a href={TWEET} target="_blank" rel="noopener" className="no-border" style={S("display:block;border-radius:12px;overflow:hidden;background:#000")}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cdn("/docs/tweet-photo.jpg")} alt="Before: the stock home with a sponsored ad. After: the clean launcher." style={S("width:100%;height:clamp(80px,calc(100vh - 760px),220px);display:block;object-fit:contain;background:#000")} />
                </a>
                <div style={S("display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;font-size:14px;color:#536471")}>
                  <span><b style={S("color:#0F1419;font-weight:700")}>{tw.likes.toLocaleString("en-US")}</b> likes · <b style={S("color:#0F1419;font-weight:700")}>{tw.replies.toLocaleString("en-US")}</b> replies</span>
                  <a href={TWEET} target="_blank" rel="noopener" className="mx-hit" style={S("color:#1D5F9E;border-bottom:1px solid rgba(29,95,158,.35)")}>Read it on X</a>
                </div>
              </article>
            </div>
            <div style={S("position:absolute;left:0;right:0;bottom:0;display:flex;height:44px;background:#F2F2F2;color:#090E12;font-family:'VT323',monospace;font-size:22px;overflow:hidden")}>
              <div style={S("flex-shrink:0;padding:0 14px;display:flex;align-items:center;background:#C8102E;color:#fff;letter-spacing:.08em")}>LATEST</div>
              <div style={S("flex:1;overflow:hidden;display:flex;align-items:center")}>
                <div style={{ ...S("display:flex;white-space:nowrap"), animation: this.state.mounted && this.reduced ? "none" : "tickerSlide 40s linear infinite" }}>
                  <span style={S("padding:0 64px 0 20px")}>{ticker}</span>
                  <span aria-hidden="true" style={S("padding:0 64px 0 20px")}>{ticker}</span>
                </div>
              </div>
            </div>
          </div>
          <div style={S("border-radius:16px;background:#06120A;box-shadow:inset 0 0 0 1px rgba(140,255,140,.22),inset 0 0 50px rgba(0,0,0,.85);padding:16px;display:flex;flex-direction:column;gap:10px;color:#CFFFCF;font-family:'VT323',monospace;min-height:clamp(220px,22cqw,360px)")}>
            <div style={S("display:flex;justify-content:space-between;gap:10px;font-size:20px;letter-spacing:.08em")}><span>STARS · FIRST 48 H</span><span>{stars}</span></div>
            <canvas ref={this.scopeRef} aria-label="Star history: slow for the first hours, then a steep climb, levelling off by hour 48" style={S("flex:1;width:100%;min-height:180px;display:block")} />
            <div style={S("display:flex;justify-content:space-between;font-size:18px;opacity:.7")}><span>OCT 17 14:21</span><span>+24 H</span><span>+48 H</span></div>
          </div>
        </div>
      </section>
    );
  }

  renderWall() {
    const s = this.state, res = this.props.data.results, n = res.length, it = res[s.feat] || res[0];
    const rotating = !this.reduced && !s.held && n > 1;
    const round = "width:40px;height:40px;flex-shrink:0;border-radius:50%;border:0;padding:0;display:grid;place-items:center;background:var(--card,rgba(255,255,255,.05));box-shadow:inset 0 0 0 1px var(--line,rgba(255,255,255,.12));font-size:15px";
    const hold = (v: boolean) => () => this.setPause("w", v);
    return (
      <section id="ch-02" data-ch="2" aria-label="Channel 02, On air" className="m-section" style={this.sectionStyle()}>
        {this.header("CH 02 · ON AIR", "On air", `${n} TVs from people who ran it on their own set. Pick one to put it on the big screen.`)}
        {it && (
          <div className="onair" onMouseEnter={hold(true)} onMouseLeave={hold(false)} onFocus={hold(true)} onBlur={hold(false)} onTouchStart={hold(true)} onTouchEnd={() => this.setPause("w", false, true)}>
            <figure style={S("margin:0;min-width:0;padding:clamp(8px,1cqw,14px);border-radius:22px;background:linear-gradient(180deg,#26262a,#121214);box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 18px 40px rgba(0,0,0,.4);display:flex;flex-direction:column;gap:10px;color:rgba(255,255,255,.95)")}>
              <div style={S("position:relative;aspect-ratio:16/9;border-radius:12px;overflow:hidden;background:#000")}>
                {/* The same photo, blurred, fills the bars around portrait shots; the browser reuses the download. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cdn(it.image)} alt="" aria-hidden="true" style={S("position:absolute;inset:-10%;width:120%;height:120%;object-fit:cover;filter:blur(24px) brightness(.42) saturate(1.2)")} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img key={s.feat} src={cdn(it.image)} alt={`${it.handle}'s TV: ${it.tv}`} className="onair-in" style={S("position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block")} />
                <div aria-hidden="true" style={S("position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(0,0,0,.12) 0 1px,rgba(0,0,0,0) 1px 3px),radial-gradient(ellipse at center,rgba(0,0,0,0) 60%,rgba(0,0,0,.4))")} />
                <div aria-hidden="true" style={S("position:absolute;top:12px;left:12px;display:flex;align-items:center;gap:7px;padding:0 9px;background:#C8102E;color:#fff;font-family:'VT323',monospace;font-size:19px;letter-spacing:.1em;line-height:26px")}>
                  <span className={rotating ? "onair-dot" : undefined} style={S("width:7px;height:7px;border-radius:50%;background:#fff")} />ON AIR
                </div>
                <div aria-hidden="true" style={S("position:absolute;top:8px;right:14px;font-family:'VT323',monospace;font-size:clamp(22px,2.4cqw,32px);letter-spacing:.06em;color:#CFFFCF;text-shadow:0 0 10px rgba(140,255,140,.6),0 1px 2px rgba(0,0,0,.8)")}>{String(s.feat + 1).padStart(2, "0")}</div>
              </div>
              <figcaption aria-live={rotating ? "off" : "polite"} style={S("display:flex;flex-direction:column;gap:6px;padding:0 6px;min-width:0")}>
                <div className="onair-meta" style={S("display:flex;align-items:baseline;gap:2px 12px;min-width:0")}>
                  <span style={S("font-size:18px;font-weight:500;white-space:nowrap")}>{it.handle}</span>
                  <span className="onair-tv" style={S("flex:1;min-width:0;font-family:'VT323',monospace;font-size:19px;letter-spacing:.04em;color:rgba(255,255,255,.62);white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>{it.tv}</span>
                  <a href={it.link} target="_blank" rel="noopener" className="mx-hit" style={S("flex-shrink:0;font-size:14px")}>See the post ↗</a>
                </div>
                <p className="onair-quote" style={S("margin:0;font-size:15px;line-height:1.45;color:rgba(255,255,255,.82);text-wrap:pretty")}>“{it.quote}”</p>
              </figcaption>
              <div aria-hidden="true" style={S("height:2px;margin:0 6px 2px;border-radius:1px;background:rgba(255,255,255,.1);overflow:hidden")}>
                <div ref={this.r.featBar} style={{ ...S("height:100%;background:#CFFFCF;box-shadow:0 0 6px rgba(140,255,140,.7);transform-origin:left;transform:scaleX(0)"), opacity: rotating ? 1 : 0 }} />
              </div>
            </figure>
            <div className="onair-side" style={S("padding:clamp(14px,1.6cqw,22px);border-radius:24px;background:var(--panel,#1e222a);box-shadow:inset 0 0 0 1px var(--band-rim,rgba(255,255,255,.16));gap:14px")}>
              <div style={S("display:flex;align-items:center;gap:8px")}>
                <div style={S("flex:1;min-width:0;display:flex;flex-direction:column;line-height:1")}>
                  <span style={S("font-family:'VT323',monospace;font-size:20px;letter-spacing:.1em;color:var(--ink-dim,rgba(255,255,255,.6))")}>THE WALL</span>
                  <span style={S("font-family:'VT323',monospace;font-size:26px;letter-spacing:.06em")}>{String(s.feat + 1).padStart(2, "0")} / {n}</span>
                </div>
                <button onClick={() => this.featGo(s.feat - 1)} aria-label="Previous TV" className="mx-round" style={S(round)}>←</button>
                {!this.reduced && n > 1 && (
                  <button onClick={() => { this.click(); this.featT = 0; this.setState({ held: !s.held }); }} aria-label={s.held ? "Play the wall" : "Pause the wall"} className="mx-round" style={S(round)}>
                    {s.held ? <span aria-hidden="true" style={S("margin-left:3px;width:0;height:0;border-style:solid;border-width:6px 0 6px 10px;border-color:transparent transparent transparent currentColor")} /> : <span aria-hidden="true" style={S("width:10px;height:12px;border-left:3px solid currentColor;border-right:3px solid currentColor")} />}
                  </button>
                )}
                <button onClick={() => this.featGo(s.feat + 1)} aria-label="Next TV" className="mx-round" style={S(round)}>→</button>
              </div>
              <div className="onair-well">
                <div ref={this.r.wall} role="group" aria-label={`All ${n} TVs`} className="onair-wall">
                  {res.map((r, i) => (
                    <button key={r.image} data-feat={i} tabIndex={i === s.feat ? 0 : -1} aria-current={i === s.feat || undefined} aria-label={`${r.handle}, ${r.tv}`} onClick={() => this.featGo(i)} className="onair-thumb">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={cdn(thumb(r.image))} alt="" width={320} height={180} loading="lazy" decoding="async" onError={(e) => { const im = e.currentTarget; if (!im.dataset.full) { im.dataset.full = "1"; im.src = cdn(r.image); } }} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    );
  }

  renderCredits() {
    const d = this.props.data;
    return (
      <section id="ch-05" data-ch="5" aria-label="Channel 05, The community" className="m-section" style={this.sectionStyle()}>
        {this.header("CH 05 · THE COMMUNITY", "The credits", "Every TV on the list got there because someone wrote it down for the next person. Thank you.")}
        <div className="m-credits-grid" style={S("display:grid;gap:clamp(24px,4cqw,56px);align-items:center")}>
          <div style={S("border-radius:24px;background:var(--panel,#1e222a);box-shadow:inset 0 0 0 1px var(--band-rim,rgba(255,255,255,.16));padding:0 16px")}>
          <div style={{ ...S("position:relative;height:clamp(280px,min(40cqw,calc(100vh - 430px)),540px);scrollbar-width:none;-webkit-mask-image:linear-gradient(180deg,transparent 0,#000 16%,#000 84%,transparent 100%);mask-image:linear-gradient(180deg,transparent 0,#000 16%,#000 84%,transparent 100%)"), overflowY: this.reduced ? "auto" : "hidden" }}>
            <div ref={this.r.credits} style={S("display:flex;flex-direction:column;align-items:center;will-change:transform")}>
              {this.creditGroups().map((g, gi) => (
                <div key={g.title + gi} aria-hidden={g.dup || undefined} style={S("display:flex;flex-direction:column;align-items:center;gap:14px;padding:24px 0")}>
                  <div style={S("font-family:'VT323',monospace;font-size:22px;letter-spacing:.14em;color:var(--ink-dim,rgba(255,255,255,.6));text-transform:uppercase")}>{g.title}</div>
                  {/* Names run side by side and wrap, so the box fills up instead of one name per line. */}
                  <div style={S("display:flex;flex-wrap:wrap;justify-content:center;gap:10px 14px;max-width:100%")}>
                  {g.people.map((p) => (
                    <a key={p.login} href={p.url} target="_blank" rel="noopener" title={p.url} tabIndex={g.dup ? -1 : undefined} onMouseEnter={() => this.setPause("c", true)} onMouseLeave={() => this.setPause("c", false)} onFocus={() => this.setPause("c", true)} onBlur={() => this.setPause("c", false)} onTouchStart={() => this.setPause("c", true)} onTouchEnd={() => this.setPause("c", false, true)} className="hov-card" style={S("display:flex;align-items:center;gap:8px;font-size:16px;font-weight:400;border:0;padding:4px 12px 4px 4px;border-radius:999px;background:var(--card,rgba(255,255,255,.05))")}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.avatar} alt="" width={26} height={26} loading="lazy" style={S("width:26px;height:26px;border-radius:50%;background:var(--card,rgba(255,255,255,.06))")} />
                      <span>{p.login}</span>
                    </a>
                  ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>
          <div style={S("display:flex;flex-direction:column;gap:clamp(20px,3cqw,36px);padding:clamp(20px,2.6cqw,34px);border-radius:24px;background:var(--panel,#1e222a);box-shadow:inset 0 0 0 1px var(--band-rim,rgba(255,255,255,.16))")}>
            <div style={S("display:flex;flex-direction:column;gap:6px")}>
              <div style={S("font-size:clamp(64px,9cqw,128px);font-weight:200;line-height:.9;letter-spacing:-.04em")}>{d.prCount.toLocaleString("en-US")}</div>
              <div style={S("font-size:16px;color:var(--ink-dim,rgba(255,255,255,.6))")}>pull requests merged</div>
            </div>
            <div style={S("display:flex;flex-direction:column;gap:6px")}>
              <div style={S("font-size:clamp(64px,9cqw,128px);font-weight:200;line-height:.9;letter-spacing:-.04em")}>{d.contributors.toLocaleString("en-US")}</div>
              <div style={S("font-size:16px;color:var(--ink-dim,rgba(255,255,255,.6))")}>people who sent them</div>
            </div>
            <p style={S("margin:0;font-size:15px;line-height:1.5;color:var(--ink-dim,rgba(255,255,255,.6));max-width:30em")}><span className="mx-hover">Hover</span><span className="mx-tap">Tap</span> a name to stop the roll. Every name goes to their GitHub. Every pull request is read first by <a href="/bot">the review bot</a>.</p>
          </div>
        </div>
      </section>
    );
  }

  renderHowTo() {
    const s = this.state;
    const li = "display:flex;gap:12px;align-items:baseline;font-size:16px;line-height:1.4";
    const num = "font-family:'VT323',monospace;font-size:20px;color:var(--ink-dim,rgba(255,255,255,.6));width:18px;flex-shrink:0";
    const box = "width:16px;height:16px;flex-shrink:0;border-radius:4px;box-shadow:inset 0 0 0 1.5px currentColor";
    const navBtn = "height:44px;padding:0 18px;border-radius:22px;border:0;background:var(--pill-bg,rgba(255,255,255,.12));box-shadow:inset 0 0 0 1px var(--pill-rim,rgba(255,255,255,.22));font-size:15px;font-weight:500";
    const osBtn = "height:32px;padding:0 12px;border-radius:16px;border:0;font-size:13px;white-space:nowrap;color:#fff;background:";
    const setOs = (os: "mac" | "win") => { if (this.state.os !== os) this.setState({ os }, () => this.startTyping()); };
    return (
      <section id="ch-03" data-ch="3" aria-label="Channel 03, How to" className="m-section" style={this.sectionStyle()}>
        {this.header("CH 03 · HOW TO", "Set it up", "Three screens on two devices. The assistant does the typing; you answer its questions.")}
        <div style={S("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));gap:clamp(18px,3cqw,40px)")}>
          <div style={S("display:flex;flex-direction:column;gap:20px;padding:clamp(18px,2.4cqw,30px);border-radius:26px;background:var(--panel,#1e222a);box-shadow:inset 0 0 0 1px var(--band-rim,rgba(255,255,255,.16));min-height:440px")}>
            <div style={S("display:flex;gap:8px;align-items:center")}>
              {[0, 1, 2].map((i) => (
                <button key={i} aria-label={`Step ${i + 1} of 3`} onClick={() => this.wizGo(i)} className="mx-step" data-on={s.wiz === i || undefined} style={{ ...S("height:8px;border-radius:4px;border:0;padding:0;background:var(--ink,#fff);transition:width .25s,opacity .25s"), width: s.wiz === i ? "28px" : "8px", opacity: s.wiz === i ? 1 : 0.35 }} />
              ))}
              <span style={S("margin-left:auto;font-family:'VT323',monospace;font-size:20px;letter-spacing:.08em;color:var(--ink-dim,rgba(255,255,255,.6))")}>{s.wiz + 1} / 3</span>
            </div>
            <button onClick={() => this.copyPrompt()} className="act-shrink2" style={S("height:64px;border-radius:32px;border:0;background:var(--ink,#fff);color:var(--bg,#000);font-size:20px;font-weight:500;transition:transform .15s")}>{s.copied ? "Copied. Paste it in." : "Copy the prompt"}</button>
            {s.wiz === 0 && (
              <div style={S("display:flex;flex-direction:column;gap:16px")}>
                <h3 style={S("margin:0;font-size:clamp(24px,2.6cqw,34px);font-weight:300")}>On the TV</h3>
                <ol style={S("margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:12px")}>
                  <li style={S(li)}><span style={S(num)}>1</span><span>Settings → Device Preferences → About</span></li>
                  <li style={S(li)}><span style={S(num)}>2</span><span>Press OK on Build seven times.</span></li>
                  <li style={S(li)}><span style={S(num)}>3</span><span>Go back to Developer options.</span></li>
                  <li style={S(li)}><span style={S(num)}>4</span><span>Turn on USB debugging, and Network or ADB debugging if your TV shows it.</span></li>
                </ol>
                <p style={S("margin:0;font-size:14px;line-height:1.5;color:var(--ink-dim,rgba(255,255,255,.6))")}>Keep the TV on, on the same Wi-Fi as your computer.</p>
              </div>
            )}
            {s.wiz === 1 && (
              <div style={S("display:flex;flex-direction:column;gap:16px")}>
                <h3 style={S("margin:0;font-size:clamp(24px,2.6cqw,34px);font-weight:300")}>On your computer</h3>
                <p style={S("margin:0;font-size:16px;line-height:1.5")}>Paste the prompt into Claude Code, or another coding assistant with shell access. Put your TV model on the line that asks for it.</p>
                <p style={S("margin:0;font-size:14px;line-height:1.5;color:var(--ink-dim,rgba(255,255,255,.6))")}>Suggested: Claude Code on <a href="https://pc.0g.ai" target="_blank" rel="noopener">0G Private Computer</a>, one API key for 100+ models. Claude Code with an Anthropic plan, Codex or Gemini CLI work too.</p>
                <a href={GH} target="_blank" rel="noopener" style={S("align-self:center;font-size:15px")}>Open the repo</a>
              </div>
            )}
            {s.wiz === 2 && (
              <div style={S("display:flex;flex-direction:column;gap:16px")}>
                <h3 style={S("margin:0;font-size:clamp(24px,2.6cqw,34px);font-weight:300")}>Follow along</h3>
                <p style={S("margin:0;font-size:16px;line-height:1.5")}>Accept &quot;Allow USB debugging?&quot; on the TV when the assistant says it is coming. Then answer its checklist:</p>
                <div style={S("display:flex;flex-direction:column;gap:8px")}>
                  <div style={S("display:flex;gap:12px;align-items:center;font-size:15px")}><span style={S(box)} />Which apps you use</div>
                  <div style={S("display:flex;gap:12px;align-items:center;font-size:15px")}><span style={S(box)} />Which four go in the dock</div>
                  <div style={S("display:flex;gap:12px;align-items:center;font-size:15px")}><span style={S(box)} />Keep the voice assistant, Chromecast, updates?</div>
                </div>
                <p style={S("margin:0;font-size:14px;line-height:1.5;color:var(--ink-dim,rgba(255,255,255,.6))")}>When it is done, switch USB debugging off again.</p>
              </div>
            )}
            <div style={S("margin-top:auto;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap")}>
              <span style={S("font-size:14px;color:var(--ink-dim,rgba(255,255,255,.6))")}>Nothing uninstalled. One line restores it.</span>
              <div style={S("display:flex;gap:8px")}>
                <button onClick={() => this.wizGo(s.wiz - 1)} aria-label="Previous step" style={{ ...S(navBtn), opacity: s.wiz === 0 ? 0.4 : 1 }}>Back</button>
                <button onClick={() => (s.wiz === 2 ? this.channel(4) : this.wizGo(s.wiz + 1))} aria-label="Next step" style={S(navBtn)}>{s.wiz === 2 ? "Done" : "Next"}</button>
              </div>
            </div>
          </div>
          <div className="mx-term" style={S("display:flex;flex-direction:column;border-radius:16px;overflow:hidden;background:#0A0C0E;color:#D8F5DA;box-shadow:inset 0 0 0 1px rgba(255,255,255,.1);min-height:440px")}>
            <div style={S("display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 10px 8px 14px;border-bottom:1px solid rgba(255,255,255,.08)")}>
              <span style={S("min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:'VT323',monospace;font-size:18px;letter-spacing:.08em;opacity:.6")}>ASSISTANT · 192.168.1.50</span>
              <div role="group" aria-label="Command style" style={S("flex-shrink:0;display:flex;padding:3px;border-radius:999px;background:rgba(255,255,255,.07)")}>
                <button aria-pressed={s.os === "mac"} onClick={() => setOs("mac")} className="mx-os" style={S(osBtn + (s.os === "mac" ? "rgba(255,255,255,.18)" : "transparent"))}>macOS / Linux</button>
                <button aria-pressed={s.os === "win"} onClick={() => setOs("win")} className="mx-os" style={S(osBtn + (s.os === "win" ? "rgba(255,255,255,.18)" : "transparent"))}>Windows</button>
              </div>
            </div>
            <div ref={this.termRef} className="mx-term-lines" style={S("flex:1;padding:14px 16px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:14px;line-height:1.6;display:flex;flex-direction:column;gap:3px")}>
              {this.termView().map((l, i) => (
                <div key={i} style={S("display:flex;flex-direction:column;gap:6px")}>
                  <div style={{ ...S("white-space:pre-wrap;word-break:break-word"), color: l.color }}>{l.text}</div>
                  {l.img && <div role="img" aria-label={l.alt} style={{ ...S("width:min(220px,64%);aspect-ratio:16/9;border-radius:6px;background-size:cover;background-position:center;box-shadow:0 0 0 1px rgba(255,255,255,.18);margin:2px 0 6px;animation:thumbIn .35s cubic-bezier(.2,.8,.2,1) both"), backgroundImage: `url('${l.img}')` }} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  renderMade() {
    const s = this.state, sl = this.slides[s.slide];
    if (!sl) return null;
    const round = "width:44px;height:44px;border-radius:50%;border:0;background:var(--card,rgba(255,255,255,.05));box-shadow:inset 0 0 0 1px var(--line,rgba(255,255,255,.12));font-size:18px";
    return (
      <section id="ch-04" data-ch="4" aria-label="Channel 04, Built on it" className="m-section" style={this.sectionStyle()}>
        {this.header("CH 04 · BUILT ON IT", "What people built", "Launchers, ports and add-ons people built on top, plus the themes. Nothing here is reviewed by the repo: read each project's README before you sideload it.")}
        <nav aria-label="Showcase sections" className="mx-chips" style={S("display:flex;flex-wrap:wrap;gap:8px;margin:0 0 clamp(14px,1.8cqw,22px)")}>
          {Array.from(new Set(this.slides.map((x) => x.group))).map((g) => {
            const first = this.slides.findIndex((x) => x.group === g), on = sl.group === g;
            return (
              <button key={g} onClick={() => this.slideGo(first)} aria-pressed={on} style={S("height:36px;padding:0 14px;border-radius:18px;border:0;font-size:14px;font-weight:500;" + (on ? "background:var(--ink,#fff);color:var(--bg,#000)" : "background:var(--pill-bg,rgba(255,255,255,.12));box-shadow:inset 0 0 0 1px var(--pill-rim,rgba(255,255,255,.22))"))}>
                {g} <span style={S("opacity:.6;font-weight:400")}>{this.slides.filter((x) => x.group === g).length}</span>
              </button>
            );
          })}
          <a href={GH + "/blob/main/SHOWCASE.md"} target="_blank" rel="noopener" style={S("display:flex;align-items:center;height:36px;padding:0 14px;font-size:14px")}>Full index by TV brand →</a>
          <a href="/addons" style={S("display:flex;align-items:center;height:36px;padding:0 14px;font-size:14px")}>Add-ons, themes and settings →</a>
        </nav>
        <div style={S("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));gap:clamp(20px,3.4cqw,48px);align-items:center")}>
          <div onTouchStart={(e) => { this.tx = e.touches[0].clientX; }} onTouchEnd={(e) => { const dx = e.changedTouches[0].clientX - (this.tx || 0); if (Math.abs(dx) > 40) this.slideGo(s.slide + (dx < 0 ? 1 : -1)); }} style={S("padding:clamp(10px,1.2cqw,16px);border-radius:22px;background:linear-gradient(180deg,#26262a,#121214);box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 18px 40px rgba(0,0,0,.4)")}>
            <div style={{ ...S("position:relative;aspect-ratio:16/9;border-radius:12px;overflow:hidden;background-size:cover;background-position:center;transition:background-color .3s"), backgroundColor: sl.wall === "aurora" ? "#070A14" : "#000000", backgroundImage: sl.wall === "aurora" ? "url('/themes/aurora/wallpaper.jpg')" : "none" }}>
              {sl.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cdn(sl.image)} alt={sl.kind === "theme" ? "The " + sl.name.replace(/\/$/, "") + " theme on a TV" : sl.name + " on a TV"} style={S("position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block")} />
              ) : sl.kind === "theme" ? (
                <>
                  <div style={S("position:absolute;left:6%;right:6%;bottom:38%;color:#fff;font-size:clamp(18px,2.8cqw,40px);font-weight:200;letter-spacing:-.02em;line-height:1.05;text-wrap:balance")}>{sl.name}</div>
                  <div style={S("position:absolute;left:50%;bottom:9%;transform:translateX(-50%);width:66%;display:flex;gap:4%;padding:2%;border-radius:12px;background:rgba(20,20,22,.82);box-shadow:inset 0 0 0 1px rgba(255,255,255,.12)")}>
                    {TILE_COLORS.slice(0, sl.tiles).map((c, i) => (
                      <div key={c} style={{ ...S("flex:1;aspect-ratio:16/9;border-radius:5px"), background: c, boxShadow: i === 0 ? "0 0 0 1.5px rgba(255,255,255,.85),0 0 10px rgba(255,255,255,.3)" : "none", transform: i === 0 ? "scale(1.08)" : "none" }} />
                    ))}
                  </div>
                </>
              ) : (
                <div style={S("position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4%;color:#fff;text-align:center;padding:6%")}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://github.com/${sl.by}.png?size=160`} alt="" width={80} height={80} style={S("width:22%;max-width:96px;aspect-ratio:1;height:auto;border-radius:50%;box-shadow:0 0 0 2px rgba(255,255,255,.7),0 10px 30px rgba(0,0,0,.5);background:rgba(255,255,255,.1)")} />
                  <div style={S("font-size:clamp(16px,2.4cqw,34px);font-weight:200;letter-spacing:-.02em;line-height:1.05;text-wrap:balance")}>{sl.name}</div>
                  <div style={S("font-family:'VT323',monospace;font-size:clamp(12px,1.4cqw,18px);letter-spacing:.1em;opacity:.7")}>NO SCREENSHOT YET · {sl.by.toUpperCase()}</div>
                </div>
              )}
              <div style={S("position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(0,0,0,.16) 0 1px,rgba(0,0,0,0) 1px 3px),radial-gradient(ellipse at center,rgba(0,0,0,0) 58%,rgba(0,0,0,.4))")} />
            </div>
          </div>
          <div style={S("display:flex;flex-direction:column;gap:14px;padding:clamp(20px,2.6cqw,34px);border-radius:24px;background:var(--panel,#1e222a);box-shadow:inset 0 0 0 1px var(--band-rim,rgba(255,255,255,.16))")}>
            <div style={S("font-family:'VT323',monospace;font-size:20px;letter-spacing:.08em;color:var(--ink-dim,rgba(255,255,255,.6))")}>{sl.kicker}</div>
            {/* fixed-height text block: one-line title, description clamped to 4 lines (full text on hover), one-line meta, so the card keeps its size between slides */}
            <h3 title={sl.name} style={S("margin:0;font-size:clamp(24px,3cqw,40px);font-weight:300;line-height:1.15;letter-spacing:-.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>{sl.name}</h3>
            <p title={sl.what} style={S("margin:0;font-size:16px;line-height:1.5;color:var(--ink,rgba(255,255,255,.95));opacity:.9;text-wrap:pretty;height:6em;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden")}>{sl.what}</p>
            <div style={S("display:flex;flex-wrap:nowrap;gap:6px 20px;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}><span>{sl.meta}</span><span>by <a href={sl.byUrl} target="_blank" rel="noopener">{sl.by}</a></span></div>
            <div style={S("display:flex;flex-wrap:wrap;gap:10px;align-items:center")}>
              <a href={sl.url} target="_blank" rel="noopener" style={S("display:flex;align-items:center;height:44px;padding:0 18px;border-radius:22px;border:0;background:var(--pill-bg,rgba(255,255,255,.12));box-shadow:inset 0 0 0 1px var(--pill-rim,rgba(255,255,255,.22));font-size:15px;font-weight:500")}>Open the project</a>
              {sl.kind === "theme" && sl.site && (
                <>
                  <button onClick={() => { this.click(); this.setTheme(sl.site!); }} style={S("height:44px;padding:0 18px;border-radius:22px;border:0;background:var(--ink,#fff);color:var(--bg,#000);font-size:15px;font-weight:500")}>Wear this theme</button>
                  <span style={S("font-family:'VT323',monospace;font-size:18px;color:var(--ink-dim,rgba(255,255,255,.6))")}>OR PRESS INPUT</span>
                </>
              )}
            </div>
            <div style={S("display:flex;gap:10px;align-items:center;margin-top:6px")}>
              <button onClick={() => this.slideGo(s.slide - 1)} aria-label="Previous project" style={S(round)}>←</button>
              <span style={S("font-family:'VT323',monospace;font-size:22px;letter-spacing:.06em;min-width:72px;text-align:center")}>{String(s.slide + 1).padStart(2, "0")} / {this.slides.length}</span>
              <button onClick={() => this.slideGo(s.slide + 1)} aria-label="Next project" style={S(round)}>→</button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  renderRemote() {
    const s = this.state;
    const btn = "width:22px;height:22px;border-radius:50%;border:1px solid rgba(255,255,255,.08);background:linear-gradient(180deg,#2a2a2e,#19191b);box-shadow:0 2px 3px rgba(0,0,0,.5);padding:0;";
    const digit = btn + "font-size:10px;color:rgba(255,255,255,.75)";
    const arrow = "position:absolute;border:0;background:transparent;font-size:8px;color:rgba(255,255,255,.7);padding:0;";
    return (
      <div role="group" aria-label="Remote control" className="remote-grow" style={S("position:absolute;right:clamp(10px,2vw,28px);bottom:clamp(10px,2vw,28px);width:96px;padding:14px 10px 16px;border-radius:48px 48px 22px 22px;background:linear-gradient(180deg,#1d1d20,#0c0c0d);box-shadow:0 24px 50px rgba(0,0,0,.65),inset 0 1px 0 rgba(255,255,255,.09),0 0 0 1px rgba(0,0,0,.8);display:flex;flex-direction:column;align-items:center;gap:10px;z-index:20")}>
        <div style={S("display:grid;grid-template-columns:repeat(3,22px);gap:6px;justify-items:center;align-items:center")}>
          <button aria-label="Power" onClick={() => this.onPower()} className={"hov-bright act-down" + (s.power ? "" : " power-wait")} style={S(btn + "display:grid;place-items:center")}><div className="power-led" style={S("width:7px;height:7px;border-radius:50%;background:#ff5252;box-shadow:0 0 5px #ff5252")} /></button>
          <div />
          <button aria-label="Input: switch site theme" onClick={() => this.cycleTheme()} className="hov-bright act-down" style={S(btn + "font-size:7px;font-weight:500;letter-spacing:.04em;color:rgba(255,255,255,.75)")}>IN</button>
        </div>
        <div style={S("position:relative;width:72px;height:72px;border-radius:50%;background:radial-gradient(circle at 50% 35%,#2b2b2f,#161618);box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 2px 4px rgba(0,0,0,.6)")}>
          <button aria-label="Up" onClick={() => this.channel(s.ch - 1)} style={S(arrow + "left:50%;top:4px;transform:translateX(-50%);width:22px;height:16px")}>▲</button>
          <button aria-label="Down" onClick={() => this.channel(Math.min(5, s.ch + 1))} style={S(arrow + "left:50%;bottom:4px;transform:translateX(-50%);width:22px;height:16px")}>▼</button>
          <button aria-label="Left" onClick={() => this.side(-1)} style={S(arrow + "top:50%;left:4px;transform:translateY(-50%);width:16px;height:22px")}>◀</button>
          <button aria-label="Right" onClick={() => this.side(1)} style={S(arrow + "top:50%;right:4px;transform:translateY(-50%);width:16px;height:22px")}>▶</button>
          <button aria-label="OK" onClick={() => this.ok()} className="hov-bright act-ok" style={S("position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:30px;height:30px;border-radius:50%;border:1px solid rgba(255,255,255,.1);background:linear-gradient(180deg,#333338,#1b1b1e);box-shadow:0 2px 3px rgba(0,0,0,.6);font-size:8px;font-weight:500;color:rgba(255,255,255,.85);padding:0")}>OK</button>
        </div>
        <div style={S("display:grid;grid-template-columns:repeat(3,22px);gap:6px")}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button key={n} onClick={() => this.channel(n)} aria-label={`Channel ${n}`} className="hov-bright act-down" style={S(digit)}>{n}</button>
          ))}
          <button aria-label="Menu: open GitHub" onClick={() => { this.click(); window.open(GH, "_blank", "noopener"); }} className="hov-bright act-down" style={S(btn + "font-size:6px;font-weight:500;letter-spacing:.04em;color:rgba(255,255,255,.75)")}>MENU</button>
          <button onClick={() => this.channel(0)} aria-label="Channel 0" className="hov-bright act-down" style={S(digit)}>0</button>
          <button aria-label="Mute: toggle sound" aria-pressed={s.sound} onClick={() => this.toggleSound()} className="hov-bright act-down" style={S(btn + "font-size:6px;font-weight:500;letter-spacing:.04em;color:var(--mute-ink,rgba(255,255,255,.75))")}>MUTE</button>
        </div>
      </div>
    );
  }

  // Phones: a theme button and the channels as labelled tabs that scroll sideways (power and mute stay on the desktop remote).
  renderMobileBar() {
    const s = this.state;
    return (
      <div role="group" aria-label="Channels" className="m-bar" style={S("position:absolute;left:0;right:0;bottom:0;height:60px;padding:0 0 0 6px;background:#0d0d0e;border-top:1px solid rgba(255,255,255,.08);display:flex;align-items:center;gap:2px;z-index:20")}>
        <button aria-label={`Switch site theme (now ${THEMES[s.theme].label.toLowerCase()})`} onClick={() => this.cycleTheme()} className="m-theme">
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M10 2a8 8 0 0 1 0 16z" fill="currentColor" /></svg>
        </button>
        <div ref={this.tabsRef} className="m-tabs">
          {TABS.map((n, i) => (
            <button key={n} data-tab={i} aria-label={`Channel ${i}, ${NAMES[i].toLowerCase()}`} aria-current={s.ch === i || undefined} onClick={() => this.channel(i)} className="m-tab">
              <span className="m-tab-n">{String(i).padStart(2, "0")}</span>{n}
            </button>
          ))}
        </div>
      </div>
    );
  }
}
