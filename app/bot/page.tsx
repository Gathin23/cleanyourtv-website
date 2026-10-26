import JsonLd from "@/components/JsonLd";
import BotSamples from "@/components/BotSamples";
import { loadBotStats } from "@/lib/data";
import { PERSON, SITE, breadcrumbs, pageMeta } from "@/lib/seo";
import "./bot.css";

// The PR counts and the bot's runs are read from the GitHub API, re-fetched on every hourly build.
// The receipt's spend and timing are from the bot's own logs (see RECEIPT below).

const BOT = "https://github.com/Gathin23/maintainer-bot";
const REPORT = `${BOT}/blob/v4/report/v4.md`;
const PC = "https://pc.0g.ai";

const title = "maintainer-bot · CleanYourTV";
const description =
  "Every CleanYourTV pull request is reviewed by maintainer-bot, an open-source bot that runs on 0G Private Computer: facts first, then a model decides, a critic checks, and anything unsure goes to the maintainer.";

export const metadata = pageMeta("/bot", title, description);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const day = (iso: string) => `${Number(iso.slice(8, 10))} ${MONTHS[Number(iso.slice(5, 7)) - 1]}`;
const n = (x: number) => x.toLocaleString("en-US");
const WORDS = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"];

// The pipeline, in the order a PR goes through it (README "How it decides", report/v4.md "What the policy does").
const STEPS: { step: string; model: string; text: string; ai?: boolean }[] = [
  { step: "Facts", model: "No model", text: "Folders, protected packages, conflicts with main, size, strings per language, new permissions or network use." },
  { step: "Decide", model: "Claude Opus 5.5", ai: true, text: "The repo's written rules, a checklist for this kind of PR, and the maintainer's past calls on the most similar PRs." },
  { step: "Critic", model: "Claude Sonnet 5", ai: true, text: "Before a code or judgement-call merge: what is the strongest rule-backed reason not to merge?" },
  { step: "Second opinion", model: "GLM-5.3-flash", ai: true, text: "A cheaper model on every PR. If it points another way, the maintainer decides." },
  { step: "Hard rules", model: "No model", text: "Fixed rules always win, and can only make a verdict more cautious." },
];

// The verdicts, grouped as README's "every idea gets a home" table.
const VERDICTS: { group: string; tone: string; items: [string, string][] }[] = [
  { group: "Merged here", tone: "green", items: [
    ["merge", "correct, in scope, nothing to change"],
    ["merge with fix", "after one small fix, spelled out"],
    ["rework", "worth having, one clear ask first"],
    ["close", "duplicate, superseded or against the rules, kindly"],
  ] },
  { group: "A better home", tone: "blue", items: [
    ["showcase", "a big or different idea: your fork, plus a SHOWCASE.md row"],
    ["add-on", "can be its own small app under addons/"],
    ["theme", "a new look a themes/ folder can carry"],
  ] },
  { group: "The maintainer", tone: "amber", items: [["needs maintainer", "safety, scope or taste, or the bot is unsure"]] },
];

// The receipt. Review runs and PRs carrying a review are live (loadBotStats).
// The rest was recomputed read-only on 24 Oct 2026, 08:05 UTC: spend from each review's cost_usd in the bot's Actions
// logs (the 0G PC router's listed per-token prices), timing from the bot's sticky comments, calls from GitHub.
const RECEIPT_ASOF = "24 Oct 2026, 13:35 IST";
const RECEIPT = { spend: "$53.81", median: "87 s", agreed: 246, decided: 248, perReview: "5.5¢" };
// [day, axis label, spend]; the last day was still running when the receipt was read.
const RECEIPT_DAYS: [string, string, number][] = [
  ["21 Oct", "Wed 21", 15.64],
  ["22 Oct", "Thu 22", 20.25],
  ["23 Oct", "Fri 23", 14.23],
  ["24 Oct so far", "Sat 24, so far", 3.69],
];

export default async function Bot() {
  const s = await loadBotStats();
  // Whole days only, unless the newest is today: then it is drawn as "so far".
  const today = new Date().toISOString().slice(0, 10);
  const max = Math.max(...s.perDay.map(([, v]) => v), 1);
  const spendMax = Math.max(...RECEIPT_DAYS.map(([, , v]) => v));
  const labels = VERDICTS.reduce((a, g) => a + g.items.length, 0);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": `${SITE}/bot`, url: `${SITE}/bot`, name: title, description, isPartOf: { "@id": `${SITE}/#website` }, about: { "@id": `${SITE}/#bot` } },
      {
        "@type": ["SoftwareApplication", "SoftwareSourceCode"],
        "@id": `${SITE}/#bot`,
        name: "maintainer-bot",
        description: "An open-source pull-request review bot that suggests what should happen to each PR, from the maintainer's written rules and past decisions. It runs on 0G Private Computer.",
        url: `${SITE}/bot`,
        codeRepository: BOT,
        programmingLanguage: "Python",
        applicationCategory: "DeveloperApplication",
        license: "https://opensource.org/licenses/MIT",
        isAccessibleForFree: true,
        author: { "@id": PERSON["@id"] },
        sameAs: [BOT],
      },
      breadcrumbs(["Bot", "/bot"]),
    ],
  };
  return (
    <main>
      <JsonLd data={jsonLd} />

      <section aria-labelledby="page-h" className="wrap page-head bot-hero">
        <p className="kicker c-green">CH 07 · PR bot</p>
        <h1 id="page-h" className="h1">maintainer-bot</h1>
        <p className="lede bot-lede">Every pull request here is reviewed by an open-source bot that runs on 0G Private Computer.</p>
        <div className="btns">
          <a href={BOT} className="btn btn-mint btn-md">maintainer-bot on GitHub</a>
          <a href="#how" className="btn btn-ghost btn-md">How it decides</a>
          <span className="ch bot-mit">MIT licensed · runs on <a href={PC}>0G Private Computer</a></span>
        </div>
      </section>

      {/* The receipt: what it has done so far, and what it cost. */}
      <section aria-labelledby="receipt-h" className="band">
        <div className="stripe stripe-thin" aria-hidden="true" />
        <div className="wrap bot-receipt">
          <div className="spread">
            <div className="stack">
              <p className="kicker live">Receipt · since 21 Oct</p>
              <h2 id="receipt-h" className="h2 h2-sm">{RECEIPT.perReview} a review.</h2>
            </div>
            <span className="ch bot-asof">As of {RECEIPT_ASOF}</span>
          </div>
          <dl className="stats">
            <div className="stat"><dt>Review runs</dt><dd>{n(s.runs)}</dd></div>
            <div className="stat" style={{ "--bar": "#8EE08F" } as React.CSSProperties}><dt>PRs carry its review</dt><dd>{n(s.reviewed)}</dd></div>
            <div className="stat" style={{ "--bar": "#6FA8FF" } as React.CSSProperties}><dt>Median time to review</dt><dd>{RECEIPT.median}</dd></div>
            <div className="stat" style={{ "--bar": "#FFDC96" } as React.CSSProperties}>
              <dt>Same call as the maintainer*</dt>
              <dd>{RECEIPT.agreed}<span className="bot-of">/{RECEIPT.decided}</span></dd>
            </div>
          </dl>
          <div className="bot-spend">
            <div className="stack">
              <span className="num bot-total">{RECEIPT.spend}</span>
              <span className="dim">total model spend on 0G Private Computer. {RECEIPT.perReview} is the median cost of one review. Re-checking an unchanged push costs nothing.</span>
            </div>
            <figure className="bot-chart bot-chart-spend">
              <figcaption className="ch">Daily spend</figcaption>
              <div className="bot-bars" role="img" aria-label={`Daily spend: ${RECEIPT_DAYS.map(([d, , v]) => `${d} $${v.toFixed(2)}`).join(", ")}`}>
                {RECEIPT_DAYS.map(([d, , v], i) => (
                  <div key={d} className="bot-col">
                    <span className="ch">${v.toFixed(2)}</span>
                    <div className={i === RECEIPT_DAYS.length - 1 ? "bot-bar bot-bar-mint bot-sofar" : "bot-bar bot-bar-mint"} style={{ height: `${Math.max(6, (v / spendMax) * 100)}%` }} />
                  </div>
                ))}
              </div>
              <div className="bot-axis" aria-hidden="true">
                {RECEIPT_DAYS.map(([d, label]) => <span key={d}>{label}</span>)}
              </div>
            </figure>
          </div>
          <p className="bot-note">
            *When the bot made the call on its own, the maintainer later did the same thing {RECEIPT.agreed} times out of {RECEIPT.decided}. Not a blind test: the
            maintainer could see its suggestion. Review runs and reviewed PRs are live counts from GitHub; spend and time to review are from the bot&rsquo;s run logs.
          </p>
        </div>
      </section>

      {/* 01: the flood */}
      <section aria-labelledby="why-h" className="wrap sec bot-why">
        <div className="stack bot-why-text">
          <p className="kicker c-amber">01 · Why it exists</p>
          <h2 id="why-h" className="h2">{n(s.prs)} pull requests. {n(s.authors)} people. 1 maintainer.</h2>
          <p className="dim bot-why-p">
            Each one can switch off system packages on someone&rsquo;s TV, or touch a launcher that has to stay small. At the peak, {n(s.peak)} were waiting at
            once, on {day(s.peakDay)}.
          </p>
        </div>
        <figure className="bot-chart">
          <figcaption className="ch">Pull requests opened per day (UTC)</figcaption>
          <div
            className="bot-bars bot-bars-tall"
            role="img"
            aria-label={`Pull requests opened per day: ${s.perDay.map(([d, v]) => `${day(d)} ${v}${d === today ? " so far" : ""}`).join(", ")}`}
          >
            {s.perDay.map(([d, v]) => (
              <div key={d} className="bot-col">
                <span className="ch">{v}</span>
                <div className={d === today ? "bot-bar bot-sofar bot-sofar-amber" : "bot-bar"} style={{ height: `${Math.max(4, (v / max) * 100)}%` }} />
              </div>
            ))}
          </div>
          <div className="bot-axis" aria-hidden="true">
            {s.perDay.map(([d]) => <span key={d}>{d === today ? "today" : Number(d.slice(8, 10))}</span>)}
          </div>
        </figure>
      </section>

      {/* 02: the pipeline */}
      <section id="how" aria-labelledby="how-h" className="rule-top">
        <div className="wrap sec bot-how">
          <div className="stack">
            <p className="kicker c-blue">02 · How it decides</p>
            <h2 id="how-h" className="h2">Six checks, one comment.</h2>
          </div>
          <ol className="plain bot-steps">
            {STEPS.map((x, i) => (
              <li key={x.step} className="bot-step">
                <div className="bot-step-top">
                  <span className="ch bot-step-n">0{i + 1}</span>
                  <span className={x.ai ? "bot-pill bot-pill-ai" : "bot-pill"}>{x.model}</span>
                </div>
                <h3 className="h3">{x.step}</h3>
                <p>{x.text}</p>
              </li>
            ))}
            <li className="bot-step bot-step-out">
              <div className="bot-step-top">
                <span className="ch bot-step-n">0{STEPS.length + 1}</span>
                <span className="bot-pill">Output</span>
              </div>
              <h3 className="h3">One comment</h3>
              <p>A suggestion and a few labels, or &ldquo;needs maintainer&rdquo;.</p>
            </li>
          </ol>
          <ul className="plain bot-rails">
            <li>✓ Abstains when unsure</li>
            <li>✓ Some PRs always go to the maintainer</li>
            <li>✓ Unchanged pushes cost nothing</li>
          </ul>
        </div>
      </section>

      {/* 03: a sample review */}
      <section aria-labelledby="sample-h" className="band">
        <div className="wrap sec bot-sample">
          <BotSamples median={RECEIPT.median}>
            <p className="kicker c-pink">03 · A sample review</p>
            <h2 id="sample-h" className="h2">What lands on your PR.</h2>
            <p className="dim">It never merges or closes by itself. Phase 1 only suggests: one comment and a few labels. Gathin approves every decision.</p>
          </BotSamples>
        </div>
      </section>

      {/* 04: the labels */}
      <section aria-labelledby="labels-h" className="wrap sec bot-labels">
        <div className="stack">
          <p className="kicker c-violet">04 · What it can suggest</p>
          <h2 id="labels-h" className="h2">{WORDS[labels] || labels} labels.</h2>
        </div>
        <div className="bot-groups">
          {VERDICTS.map((g) => (
            <div key={g.group} className={`bot-group bot-${g.tone}`}>
              <h3 className="h3">{g.group}</h3>
              <dl>
                {g.items.map(([v, t]) => (
                  <div key={v}>
                    <dt>{v}</dt> <dd>{t}</dd>
                  </div>
                ))}
              </dl>
              {g.tone === "amber" && <a href={REPORT} className="bot-report">Read the full v4 report</a>}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
