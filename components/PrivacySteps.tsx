import type { Brand, Item, Step, Variant } from "@/lib/privacy";
import { variantsFor } from "@/lib/privacy";

// One step's menu path drawn the way the TV draws it, shared by the guide (client), the no-JS list and the printout.
// No hooks here, so the server page can render it too.

const MARK: Record<Item["to"], string> = { off: "☐", on: "☑", press: "◉" };
const SAY: Record<Item["to"], string> = { off: "turn off or untick", on: "turn on or tick", press: "select" };

/** ⚙ Settings ▸ All Settings ▸ … ▸ ☐ Viewing Information Services. Several switches go one per line underneath. */
export function Crumbs({ v }: { v: Variant }) {
  const items = v.items || [];
  const one = items.length === 1;
  return (
    <>
      <ol className="pv2-crumbs" aria-label={v.label ? `Menu path, ${v.label}` : "Menu path"}>
        {v.crumbs.map((c, i) => (
          <li key={i} className="pv2-crumb">
            {i === 0 && /^(All )?Settings$|^Hold the Settings/.test(c) && <span aria-hidden="true">⚙&nbsp;</span>}
            {i === 0 && c === "Home" && <span aria-hidden="true">⌂&nbsp;</span>}
            {c}
          </li>
        ))}
        {one && <Switch it={items[0]} className="pv2-crumb pv2-target" />}
      </ol>
      {items.length > 1 && (
        <ul className="pv2-items" aria-label="On that screen">
          {items.map((it) => (
            <Switch key={it.name} it={it} className="pv2-target" />
          ))}
        </ul>
      )}
    </>
  );
}

function Switch({ it, className }: { it: Item; className: string }) {
  return (
    <li className={className} data-to={it.to}>
      <span aria-hidden="true">{MARK[it.to]}</span>
      {it.name}
      <span className="sr-only"> ({SAY[it.to]})</span>
    </li>
  );
}

/** Everything on one step's card below its title: the path (or paths), what to do, what changes, how to undo, sources. */
export function StepBody({ brand, step, year }: { brand: Brand; step: Step; year: number | null }) {
  const { list, noMatch } = variantsFor(brand, step, year);
  const many = list.length > 1;
  return (
    <div className="pv2-stepbody">
      {noMatch && year != null && (
        <p className="pv2-nomatch">We haven&rsquo;t checked a path for {year} TVs yet, so here are all of them. One of these should match.</p>
      )}
      {list.map((v, i) => (
        <div key={i} className="pv2-variant">
          {many && v.label && <p className="pv2-vlabel">{v.label === "Any year" && year != null && !noMatch ? "Or, on any year" : v.label}</p>}
          <Crumbs v={v} />
          {v.note && <p className="pv2-note">{v.note}</p>}
        </div>
      ))}
      {step.text && <p className="pv2-text">{step.text}</p>}
      {step.note && <p className="pv2-note">{step.note}</p>}
      <p className="pv2-undo">
        <strong>Undo:</strong> {step.undo}
      </p>
      {step.checks.length > 0 && (
        <ul className="pv2-checks">
          {step.checks.map((c) => (
            <li key={c.issue}>
              Checked on a {c.year} {brand.name} {c.model} by @{c.by}
            </li>
          ))}
        </ul>
      )}
      <p className="pv2-src">
        Source{step.sources.length > 1 ? "s" : ""}:{" "}
        {step.sources.map(([label, url], i) => (
          <span key={url}>
            {i > 0 && " · "}
            <a href={url} target="_blank" rel="noopener">{label}</a>
          </span>
        ))}
      </p>
    </div>
  );
}

/** Every step of one brand as a plain numbered list: the no-JS page and the printout. */
export function StepList({ brand, year }: { brand: Brand; year: number | null }) {
  return (
    <ol className="pv2-list">
      {brand.steps.map((s) => (
        <li key={s.id}>
          <h4>{s.title}</h4>
          <StepBody brand={brand} step={s} year={year} />
        </li>
      ))}
    </ol>
  );
}
