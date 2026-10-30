import type { Brand, Item, Pick, Step, Variant } from "@/lib/privacy";
import { variantsFor } from "@/lib/privacy";

// One step's menu path and its switches in one box, shared by the guide (client), the no-JS list and the printout.
// No hooks here, so the server page can render it too.

const TAG: Record<Item["to"], [string, string, string]> = { off: ["Off", "Turn off", "tg-off"], on: ["On", "Turn on", "tg-on"], press: ["Select", "Select", "tg-sel"] };

/** Settings › All Settings › … as one line of text, the last menu name stressed. */
export function Keys({ crumbs, label }: { crumbs: string[]; label?: string }) {
  return (
    <ol className="na-keys" aria-label={label ? `Menu path, ${label}` : "Menu path"}>
      {crumbs.map((c, i) => (
        <li key={i}>
          {i > 0 && <span className="na-sep" aria-hidden="true">›</span>}
          <span className={i === crumbs.length - 1 ? "na-key na-key-last" : "na-key"}>{c}</span>
        </li>
      ))}
    </ol>
  );
}

/** One row per switch: the setting's name, then where to set it (OFF / ON / SELECT). */
export function Toggles({ items }: { items: Item[] }) {
  if (!items.length) return null;
  return (
    <ul className="na-toggles" aria-label="On that screen">
      {items.map((it) => (
        <li key={it.name}>
          <strong>{it.name}</strong>
          <span className={`na-tg ${TAG[it.to][2]}`} aria-label={TAG[it.to][1]}>{TAG[it.to][0]}</span>
        </li>
      ))}
    </ul>
  );
}

/** The path and the switches at the end of it, in one box. */
export function MenuBox({ crumbs, items, label }: { crumbs?: string[]; items: Item[]; label?: string }) {
  return (
    <div className="na-menu">
      {crumbs && <Keys crumbs={crumbs} label={label} />}
      <Toggles items={items} />
    </div>
  );
}

function Path({ v, many }: { v: Variant; many: boolean }) {
  const label = v.label;
  return (
    <div className="na-variant">
      {many && label && <p className="na-vlabel">{label}</p>}
      <MenuBox crumbs={v.crumbs} items={v.items || []} label={v.label} />
      {v.note && <p className="na-note">{v.note}</p>}
    </div>
  );
}

/** A step's paths for a pick, with the any-year one (Samsung's Home › Privacy Choices) split off once the year is known. */
export function pathsFor(brand: Brand, step: Step, pick: Pick): { list: Variant[]; anyYear?: Variant; noMatch: boolean } {
  const { list: all, noMatch } = variantsFor(brand, step, pick);
  const anyYear = pick && pick !== "all" && !noMatch && all.length > 1 ? all.find((v) => v.label === "Any year") : undefined;
  return { list: anyYear ? all.filter((v) => v !== anyYear) : all, anyYear, noMatch };
}

/** Everything on one step below its title: the path (or paths), what to do, a note, how to undo, the sources. */
export function StepBody({ brand, step, pick, extra }: { brand: Brand; step: Step; pick: Pick; extra?: React.ReactNode }) {
  const { list, anyYear, noMatch } = pathsFor(brand, step, pick);
  const many = list.length > 1;
  return (
    <div className="na-body">
      {step.text && <p className="na-text">{step.text}</p>}
      {noMatch && <p className="na-nomatch">We haven&rsquo;t checked a path for that one yet, so here are all of them. One of these should match.</p>}
      {list.map((v, i) => (
        <Path key={i} v={v} many={many} />
      ))}
      {anyYear && (
        <div className="na-alt">
          <span>Can&rsquo;t find it? On any year:</span>
          <Keys crumbs={anyYear.crumbs} label="any year" />
        </div>
      )}
      {!list.length && (step.items || []).length > 0 && <MenuBox items={step.items || []} />}
      {step.note && <p className="na-note">{step.note}</p>}
      <div className="na-foot">
        <details className="na-undo">
          <summary>Undo</summary>
          <p>{step.undo}</p>
        </details>
        <p className="na-src">
          Source{step.sources.length > 1 ? "s" : ""}:{" "}
          {step.sources.map(([label, url], i) => (
            <span key={url}>
              {i > 0 && " · "}
              <a href={url} target="_blank" rel="noopener">{label}</a>
            </span>
          ))}
        </p>
        {extra}
      </div>
      {step.checks.length > 0 && (
        <ul className="na-checks">
          {step.checks.map((c) => (
            <li key={c.issue}>
              Checked on a {c.year ? `${c.year} ${brand.name}` : `${brand.name}${/TV$/.test(brand.name) ? "" : " TV"},`} {c.model} by @{c.by}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Every step of one brand as a plain numbered list: the no-JS page and the printout. */
export function StepList({ brand, pick }: { brand: Brand; pick: Pick }) {
  return (
    <ol className="na-list">
      {brand.steps.map((s, i) => (
        <li key={s.id}>
          <h4>
            <span className="ch">Step {i + 1}</span> {s.title}
            {s.tag && <span className="na-tag">{s.tag}</span>}
          </h4>
          <p className="na-does">{s.does}</p>
          <StepBody brand={brand} step={s} pick={pick} />
        </li>
      ))}
    </ol>
  );
}
