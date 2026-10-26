"use client";

import { useEffect, useState, type ReactNode } from "react";
import { GH, keyDefault, keyKind } from "@/lib/parse";
import type { AddonRow, AddonsData, ShowcaseItem, ThemeCard, ThemeKey } from "@/lib/parse";
import { FEATURED, GROUPS, SETTINGS, settingOf, type SettingGroup } from "@/lib/settings";
import { repoCdn } from "@/lib/site";

type Tab = "themes" | "settings" | "addons";
const ORDER = Object.keys(SETTINGS);

// Line icons: 24px grid, round caps, drawn in currentColor.
const ln = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const ICONS: Record<Tab | SettingGroup | "chevron", ReactNode> = {
  themes: <><path {...ln} d="M12 3a9 9 0 1 0 0 18c1.4 0 2-1 2-2 0-1.6-1.3-1.9-1.3-3.2 0-1 .8-1.8 1.8-1.8H17a4 4 0 0 0 4-4c0-3.9-4-7-9-7z" /><circle cx="7.5" cy="11" r="1.2" fill="currentColor" /><circle cx="10.5" cy="7.3" r="1.2" fill="currentColor" /><circle cx="15" cy="7.8" r="1.2" fill="currentColor" /></>,
  settings: <><path {...ln} d="M4 7h9M17 7h3M4 17h3M11 17h9" /><circle {...ln} cx="15" cy="7" r="2" /><circle {...ln} cx="9" cy="17" r="2" /></>,
  addons: <><rect {...ln} x="3.5" y="3.5" width="7" height="7" rx="2" /><rect {...ln} x="13.5" y="3.5" width="7" height="7" rx="2" /><rect {...ln} x="3.5" y="13.5" width="7" height="7" rx="2" /><path {...ln} d="M17 14v6M14 17h6" /></>,
  look: <><path {...ln} d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /><path {...ln} d="M19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z" /></>,
  dock: <><rect {...ln} x="3" y="4" width="18" height="16" rx="3" /><path {...ln} d="M3 14h18" /><path {...ln} d="M7 17h2M11 17h2M15 17h2" /></>,
  remote: <><rect {...ln} x="8" y="2.5" width="8" height="19" rx="4" /><circle {...ln} cx="12" cy="8" r="2" /><path {...ln} d="M12 13.5v.01M12 17v.01" /></>,
  clock: <><circle {...ln} cx="12" cy="12" r="8.5" /><path {...ln} d="M12 7.5V12l3 2" /></>,
  behaviour: <><path {...ln} d="M4 12a8 8 0 0 1 13.7-5.6L20 8.5" /><path {...ln} d="M20 4v4.5h-4.5" /><path {...ln} d="M20 12a8 8 0 0 1-13.7 5.6L4 15.5" /><path {...ln} d="M4 20v-4.5h4.5" /></>,
  more: <><rect {...ln} x="3" y="5" width="18" height="12" rx="2.5" /><path {...ln} d="M9 20h6" /><path {...ln} d="M8 11h.01M12 11h.01M16 11h.01" /></>,
  chevron: <path {...ln} d="M6 9l6 6 6-6" />,
};
const Icon = ({ name, className = "ao-icon" }: { name: keyof typeof ICONS; className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">{ICONS[name]}</svg>
);

/** Inline markdown from a README cell: `code`, **bold** and [links](...), relative links resolved against the README's folder. */
function md(s: string, base: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /`([^`]+)`|\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0, m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    const k = out.length;
    if (m[1] !== undefined) out.push(<code key={k}>{m[1]}</code>);
    else if (m[2] !== undefined) out.push(<strong key={k}>{m[2]}</strong>);
    else out.push(<a key={k} href={new URL(m[4], `${GH}/blob/main/${base}`).href} target="_blank" rel="noopener">{m[3]}</a>);
    last = re.lastIndex;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}

/** A key's text as one plain line and the rest: split at the first sentence end or semicolon outside code and links. */
function splitText(text: string): [string, string] {
  const mask = text.replace(/`[^`]*`|\[[^\]]*\]\([^)]*\)/g, (x) => "x".repeat(x.length));
  const m = /(?<=[a-z0-9)])\.\s+(?=[A-Z(])|;\s+/.exec(mask);
  let line = m ? text.slice(0, m.index) : text;
  const rest = m ? text.slice(m.index + m[0].length) : "";
  line = line.replace(/\s*\(`?[\w#.-]+`? by default\)/, "").replace(/\.$/, "");
  return [line + ".", rest];
}

const title = (name: string) => name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, " ");
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function Copy({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const t = document.createElement("textarea");
      t.value = text;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    setDone(true);
    setTimeout(() => setDone(false), 1600);
  };
  return (
    <button type="button" className="ao-copy" onClick={copy} aria-label={done ? "Copied" : `Copy: ${text}`}>
      <span aria-live="polite">{done ? "Copied" : "Copy"}</span>
    </button>
  );
}

/** The line a coding agent gets, with its copy button. */
function Ask({ text }: { text: string }) {
  return (
    <div className="ao-ask">
      <span className="ao-ask-label">Tell your coding agent</span>
      <div className="ao-line">
        <p>{text}</p>
        <Copy text={text} />
      </div>
    </div>
  );
}

/** A 16:9 picture, or a quiet frame that asks for one; a badge (a festival theme's season) sits on top. */
function Shot({ src, alt, wanted, badge }: { src: string; alt: string; wanted: string; badge?: string }) {
  return (
    <div className="ao-shot">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={repoCdn(src)} alt={alt} width={1280} height={720} loading="lazy" decoding="async" />
      ) : (
        <a className="ao-wanted" href={wanted} target="_blank" rel="noopener">Screenshot wanted</a>
      )}
      {badge && <span className="ao-season">{badge}</span>}
    </div>
  );
}

/** Name on the left, "by …" (or the setting's key) on the right. */
function Head({ name, href, by, byUrl, aside }: { name: string; href?: string; by?: string; byUrl?: string; aside?: ReactNode }) {
  return (
    <div className="ao-head">
      {href ? <a className="ao-name" href={href} target="_blank" rel="noopener">{name}</a> : <span className="ao-name">{name}</span>}
      {by && <span className="ao-by">by {byUrl ? <a href={byUrl} target="_blank" rel="noopener">{by}</a> : by}</span>}
      {aside}
    </div>
  );
}

function NoMatch({ q, clear }: { q: string; clear: () => void }) {
  return (
    <div className="ao-empty">
      <p>Nothing here matches &ldquo;{q}&rdquo;.</p>
      <button type="button" className="btn btn-ghost btn-sm" onClick={clear}>Clear the search</button>
    </div>
  );
}

function Themes({ themes, push }: { themes: ThemeCard[]; push: string }) {
  return (
    <ul className="plain ao-grid">
      {themes.map((t) => (
        <li key={t.name} className={t.ended ? "ao-card ao-ended" : "ao-card"}>
          <Shot src={t.screenshot} alt={`Home with the ${t.name} theme on a TV`} wanted={`${GH}/tree/main/themes/${t.name}`} badge={t.season ? cap(t.season) : ""} />
          <div className="ao-body">
            <Head name={title(t.name)} href={`${GH}/tree/main/themes/${t.name}`} by={t.by} byUrl={t.byUrl} />
            {t.what && <p className="ao-text">{md(t.what, "themes/")}</p>}
            <Ask text={`Apply the ${t.name} theme from CleanYourTV to my TV`} />
            {push && (
              <details className="ao-diy">
                <summary><Icon name="chevron" className="ao-chev" />Do it yourself</summary>
                <div className="ao-cmd">
                  <code>{push.replace("{theme}", t.name)}</code>
                  <Copy text={push.replace("{theme}", t.name)} />
                </div>
              </details>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

function keyAsk(k: ThemeKey): string {
  const s = settingOf(k.keys), id = k.keys.join(", ");
  if (/config\.xml only/.test(k.type)) return `${s.ask} in my CleanYourTV launcher's config.xml (${id}) and rebuild it`;
  return `${s.ask} in my CleanYourTV launcher (${id})`;
}

function defaultLabel(k: ThemeKey): string {
  const def = keyDefault(k.text);
  if (!def) return "";
  if (keyKind(k) === "toggle") return def === "true" ? "On by default" : "Off by default";
  return `Default ${def}`;
}

/** img: undefined for no picture slot, "" for a slot that asks for one. */
function SettingCard({ k, img }: { k: ThemeKey; img?: string }) {
  const s = settingOf(k.keys), def = defaultLabel(k);
  // A hand-written line keeps the README's whole text under Details; otherwise its first sentence leads.
  // A first sentence long enough to be clamped also keeps the whole text there.
  const [first, after] = splitText(k.text);
  const line = s.line || first, rest = s.line || first.length > 110 ? k.text : after;
  return (
    <li className="ao-card">
      {img !== undefined && <Shot src={img} alt={`${s.title} on a TV`} wanted={`${GH}/blob/main/docs/switches.md`} />}
      <div className="ao-body">
        <Head name={s.title} aside={<code className="ao-key">{k.keys.join(", ")}</code>} />
        <p className="ao-text">{md(line, "themes/")}</p>
        {def && <span className="ao-badge">{def}</span>}
        <Ask text={keyAsk(k)} />
        {rest && (
          <details className="ao-diy">
            <summary><Icon name="chevron" className="ao-chev" />Details</summary>
            <p className="ao-text ao-detail">{md(rest, "themes/")}</p>
          </details>
        )}
      </div>
    </li>
  );
}

function Settings({ keys, all, images, searching }: { keys: ThemeKey[]; all: ThemeKey[]; images: Record<string, string>; searching: boolean }) {
  const [open, setOpen] = useState<Set<SettingGroup>>(new Set());
  const rank = (k: ThemeKey) => (ORDER.indexOf(k.keys[0]) + 1 || ORDER.length + 1);
  const image = (k: ThemeKey) => k.keys.map((x) => images[x]).find(Boolean) || "";
  // Most useful: the picked keys the README still has, the ones with a screenshot first.
  const featured = FEATURED.map((f) => all.find((k) => k.keys[0] === f)).filter((k): k is ThemeKey => !!k)
    .map((k, i) => ({ k, i })).sort((a, b) => Number(!image(a.k)) - Number(!image(b.k)) || a.i - b.i).map(({ k }) => k);
  const toggle = (g: SettingGroup) => setOpen((o) => {
    const n = new Set(o);
    if (n.has(g)) n.delete(g); else n.add(g);
    return n;
  });
  return (
    <>
      {!searching && featured.length > 0 && (
        <section aria-labelledby="ao-featured" className="ao-section">
          <h2 id="ao-featured" className="ao-h2">Most useful</h2>
          <ul className="plain ao-grid">
            {featured.map((k) => <SettingCard key={k.keys.join()} k={k} img={image(k)} />)}
          </ul>
        </section>
      )}
      {keys.length > 0 && <h2 className="ao-h2">{searching ? `${keys.length} ${keys.length === 1 ? "match" : "matches"}` : "Every setting"}</h2>}
      <div className="ao-groups">
        {GROUPS.map((g) => {
          // In the table's order, which puts the everyday ones first; keys it doesn't know go last.
          const list = keys.filter((k) => settingOf(k.keys).group === g.id).sort((a, b) => rank(a) - rank(b));
          if (!list.length) return null;
          const isOpen = searching || open.has(g.id);
          return (
            <section key={g.id} className="ao-group">
              <button type="button" className="ao-group-head" aria-expanded={isOpen} aria-controls={`ao-g-${g.id}`} onClick={() => toggle(g.id)} disabled={searching}>
                <Icon name={g.id} className="ao-group-icon" />
                <span className="ao-group-titles">
                  <span className="ao-group-name">{g.name} <span className="ao-count">{list.length}</span></span>
                  <span className="ao-group-text">{g.text}</span>
                </span>
                {!searching && <Icon name="chevron" className="ao-chev" />}
              </button>
              {isOpen && (
                <ul id={`ao-g-${g.id}`} className="plain ao-grid ao-grid-keys">
                  {list.map((k) => <SettingCard key={k.keys.join()} k={k} />)}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}

// Short chips for an add-on's permissions, in this order; the full text is one tap away.
const PERMS: [RegExp, string][] = [
  [/internet|network/i, "Internet"],
  [/overlay|over other apps/i, "Draws over apps"],
  [/accessibility/i, "Accessibility"],
  [/bluetooth/i, "Bluetooth"],
  [/location/i, "Location"],
  [/foreground service/i, "Runs in background"],
  [/boot/i, "Starts at boot"],
  [/alarm/i, "Exact alarms"],
];

function Permissions({ a }: { a: AddonRow }) {
  const text = a.permissions.trim();
  if (!text || /^none$/i.test(text)) return <p className="ao-perms"><span className="ao-chip ao-chip-ok">No permissions</span></p>;
  const chips = PERMS.filter(([re]) => re.test(text)).map(([, label]) => label);
  return (
    <details className="ao-diy ao-perms">
      <summary>
        <Icon name="chevron" className="ao-chev" />
        <span className="sr-only">Permissions: </span>
        {(chips.length ? chips : ["Permissions"]).map((c) => <span key={c} className="ao-chip">{c}</span>)}
      </summary>
      <p className="ao-text ao-detail">{md(text, "addons/")}</p>
    </details>
  );
}

function Addons({ addons, community, searching }: { addons: AddonRow[]; community: ShowcaseItem[]; searching: boolean }) {
  return (
    <>
      {!addons.length ? (
        !searching && (
          <div className="ao-empty">
            <p>No add-ons in the repo yet. Build the first one.</p>
            <Ask text="Read addons/README.md in CleanYourTV and help me build an add-on with a module card" />
          </div>
        )
      ) : (
        <ul className="plain ao-grid">
          {addons.map((a) => {
            const name = a.name.replace(/\/$/, "");
            return (
              <li key={a.name} className="ao-card">
                <Shot src={a.screenshot} alt={`${name} on a TV`} wanted={`${GH}/blob/main/addons/README.md#rules`} />
                <div className="ao-body">
                  <Head name={name} href={a.url} by={a.by} byUrl={a.byUrl} />
                  {a.what && <p className="ao-text">{md(a.what, "addons/")}</p>}
                  <p className="ao-meta">
                    <span>Installs a separate app</span>
                    {a.tested && <span>Tested on {a.tested}</span>}
                  </p>
                  <Permissions a={a} />
                  <Ask text={`Build and install the ${name} add-on from CleanYourTV on my TV`} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {community.length > 0 && (
        <section aria-labelledby="ao-community" className="ao-section">
          <h2 id="ao-community" className="ao-h2">From the community</h2>
          <p className="ao-caption">Built in their own repos and listed in <a href={`${GH}/blob/main/SHOWCASE.md`} target="_blank" rel="noopener">SHOWCASE.md</a>. Read each one&apos;s README before installing.</p>
          <ul className="plain ao-grid">
            {community.map((c) => (
              <li key={c.url} className="ao-card">
                <div className="ao-body">
                  <Head name={c.name} href={c.url} by={c.by} />
                  {c.what && <p className="ao-text">{md(c.what, "")}</p>}
                  {c.builtOn && <p className="ao-meta"><span>Tested on {c.builtOn}</span></p>}
                  <Ask text={`Help me install ${c.name} (${c.url.replace(/^https?:\/\//, "")}) on my TV safely`} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

const TABS: { id: Tab; name: string; text: string }[] = [
  { id: "themes", name: "Themes", text: "Whole looks, pushed in seconds" },
  { id: "settings", name: "Settings", text: "Hide a pill, change the glow, show the date" },
  { id: "addons", name: "Add-ons", text: "Small apps that add a card to Home" },
];
// #switches is the tab's old name; docs/switches.md in the repo still links there.
const ALIAS: Record<string, Tab> = { switches: "settings" };

const has = (needle: string, ...parts: string[]) => parts.join(" ").toLowerCase().includes(needle);

/** The hero's search over all three kinds, three big tabs and the panel; #themes, #settings and #addons open one directly. */
export default function AddonsTabs({ data, children }: { data: AddonsData; children: ReactNode }) {
  const [tab, setTab] = useState<Tab>("themes");
  const [q, setQ] = useState("");
  useEffect(() => {
    const read = () => {
      const h = location.hash.slice(1), t = ALIAS[h] || h;
      if (TABS.some((x) => x.id === t)) setTab(t as Tab);
    };
    read();
    addEventListener("hashchange", read);
    return () => removeEventListener("hashchange", read);
  }, []);
  const pick = (t: Tab) => {
    setTab(t);
    try { history.replaceState(null, "", `#${t}`); } catch { /* ignore */ }
  };

  const needle = q.trim().toLowerCase();
  const searching = !!needle;
  const themes = data.themes.filter((t) => !needle || has(needle, t.name, t.what, t.by));
  const keys = data.keys.filter((k) => !needle || has(needle, k.keys.join(" "), k.text, settingOf(k.keys).title));
  const addons = data.addons.filter((a) => !needle || has(needle, a.name, a.what, a.by));
  const community = data.community.filter((c) => !needle || has(needle, c.name, c.what, c.by));
  const total = data.themes.length + data.keys.length + data.addons.length + data.community.length;
  const count: Record<Tab, number> = { themes: themes.length, settings: keys.length, addons: addons.length + community.length };
  const empty = searching && !count[tab];

  return (
    <>
      <section aria-labelledby="page-h" className="wrap ao-hero">
        <div className="ao-hero-text">{children}</div>
        <div className="ao-search">
          <label htmlFor="ao-search">Search all {total}</label>
          <input id="ao-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Glow, clock, wallpaper…" autoComplete="off" spellCheck={false} />
          <p className="sr-only" aria-live="polite">
            {searching ? `${count.themes} themes, ${count.settings} settings and ${count.addons} add-ons match` : ""}
          </p>
        </div>
      </section>

      <div className="wrap">
        <div className="ao-tabs" role="tablist" aria-label="Themes, settings and add-ons">
          {TABS.map((t) => (
            <button key={t.id} id={`ao-tab-${t.id}`} type="button" role="tab" className="ao-tab" aria-selected={tab === t.id} aria-controls="ao-panel" onClick={() => pick(t.id)}>
              <span className="ao-tab-top">
                <span className="ao-tab-name">{t.name}</span>
                <span className="ao-tab-n">{count[t.id]}</span>
              </span>
              <span className="ao-tab-text">{t.text}</span>
            </button>
          ))}
        </div>
      </div>

      <section id="ao-panel" role="tabpanel" aria-labelledby={`ao-tab-${tab}`} className="wrap ao-panel">
        <p className="ao-caption">
          {tab === "themes" && <>Whole looks, shown on real TVs. Undo any time with tools/theme.sh --reset</>}
          {tab === "settings" && <>Small tweaks to Home. A wrong value is ignored, so Home never breaks</>}
          {tab === "addons" && <>Small apps that add a card to Home. How they work: <a href={`${GH}/blob/main/addons/README.md`} target="_blank" rel="noopener">addons/README.md</a></>}
        </p>
        {empty ? (
          <NoMatch q={q.trim()} clear={() => setQ("")} />
        ) : (
          <>
            {tab === "themes" && <Themes themes={themes} push={data.push} />}
            {tab === "settings" && <Settings keys={keys} all={data.keys} images={data.keyImages} searching={searching} />}
            {tab === "addons" && <Addons addons={addons} community={community} searching={searching} />}
          </>
        )}
      </section>
    </>
  );
}
