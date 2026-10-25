import Link from "next/link";
import type { CSSProperties } from "react";
import JsonLd from "@/components/JsonLd";
import { loadBotStats } from "@/lib/data";
import { GH } from "@/lib/parse";
import { PERSON, SITE, breadcrumbs, pageMeta } from "@/lib/seo";

// The PR counts and the bot's runs are read from the GitHub API, re-fetched on every hourly build.
// The v3 → v4 results and the model costs are from the bot's own report (report/v4.md, 22 Oct 2026).

const BOT = "https://github.com/Gathin23/maintainer-bot";
const REPORT = `${BOT}/blob/v4/report/v4.md`;
const PC = "https://pc.0g.ai";

const title = "maintainer-bot · CleanYourTV";
const description =
  "Every CleanYourTV pull request is reviewed by maintainer-bot, an open-source bot that runs on 0G Private Computer: facts first, then a model decides, a critic checks, and anything unsure goes to the maintainer.";

export const metadata = pageMeta("/bot", title, description);

// body is overflow:hidden for the TV, so the page scrolls inside main, as /press and the blog do.
const page: CSSProperties = {
  height: "100dvh",
  overflowY: "auto",
  background: "#050505",
  color: "#e9e9e9",
  fontFamily: "var(--font-outfit), Outfit, sans-serif",
  fontWeight: 300,
  WebkitFontSmoothing: "antialiased",
};
const wrap: CSSProperties = { maxWidth: 1160, margin: "0 auto", padding: "40px 16px 120px", fontSize: 17, lineHeight: 1.5 };
const kicker: CSSProperties = { margin: "0 0 20px", fontSize: 15, letterSpacing: 2, textTransform: "uppercase", color: "#9a9a9a" };
const green = { color: "#cfffcf", borderBottomColor: "rgba(207,255,207,.35)" };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const day = (iso: string) => `${Number(iso.slice(8, 10))} ${MONTHS[Number(iso.slice(5, 7)) - 1]}`;
const n = (x: number) => x.toLocaleString("en-US");

// The pipeline, in the order a PR goes through it (README "How it decides", report/v4.md "What the policy does").
const STEPS: { step: string; model: string; text: string; ai?: boolean }[] = [
  { step: "Facts", model: "No model", text: "Folders, protected packages, conflicts with main, size, strings per locale, new permissions or network use." },
  { step: "Decide", model: "Claude Opus 5.5", ai: true, text: "The repo's written rules, a checklist for this kind of PR and the maintainer's past decisions on the most similar PRs." },
  { step: "Critic", model: "Claude Sonnet 5", ai: true, text: "Before a code or judgement-call merge: the strongest rule-backed reason not to merge?" },
  { step: "Second opinion", model: "GLM-5.3-flash", ai: true, text: "A cheaper model on every PR. If it points another way, the maintainer decides." },
  { step: "Hard rules", model: "No model", text: "Deterministic rules always win, and can only make a verdict more cautious." },
];

// Calls and spend per role in the v4 backtest (report/v4.md, "Cost").
const MODELS: { model: string; job: string; calls: number; usd: number }[] = [
  { model: "Claude Opus 5.5", job: "decides", calls: 206, usd: 9.6 },
  { model: "Claude Sonnet 5", job: "critic, only before a merge", calls: 33, usd: 0.6 },
  { model: "GLM-5.3-flash", job: "second opinion, every PR", calls: 167, usd: 0.43 },
];

// The verdicts, grouped as README's "every idea gets a home" table.
const VERDICTS: { group: string; tone: string; items: [string, string][] }[] = [
  { group: "Merged here", tone: "here", items: [
    ["merge", "Correct, in scope, nothing to change."],
    ["merge with fix", "Mergeable after one small fix, spelled out."],
    ["rework", "Worth having. One clear ask first."],
    ["close", "A duplicate, superseded or against the base rules. Kindly."],
  ] },
  { group: "A better home", tone: "home", items: [
    ["showcase", "A big or different idea: your fork plus a SHOWCASE.md row."],
    ["add-on", "Can be its own small app under addons/."],
    ["theme", "A new look that a themes/ folder can carry."],
  ] },
  { group: "The maintainer", tone: "you", items: [["needs maintainer", "Safety, scope or taste, or the bot is unsure."]] },
];

// v3 as it ran → v4 as shipped, test split (22 Oct, 166 PRs): report/v4.md.
const RESULTS: { label: string; from: string; to: string; note: string }[] = [
  { label: "Decided without the maintainer", from: "15%", to: "31%", note: "24 of 162 → 52 of 166 PRs" },
  { label: "Right when it decides", from: "92%", to: "85%*", note: "*optimistic, see how we measured" },
  { label: "Launcher PRs decided", from: "0", to: "23", note: "of 100. Its 11 launcher merges were all right." },
  { label: "Wrong merges", from: "2", to: "2", note: "v4: #787 and #794, both sent back for changes" },
];

// The receipt. Review runs and PRs carrying a review are live (loadBotStats, the same counts as "Reviews run" below).
// The rest was recomputed read-only on 24 Oct 2026, 08:05 UTC: spend from each review's cost_usd in the bot's Actions
// logs (the 0G PC router's listed per-token prices), timing from the bot's sticky comments, calls from GitHub.
const RECEIPT_ASOF = "24 Oct 2026, 13:35 IST";
const RECEIPT_FIXED: { label: string; value: string }[] = [
  { label: "Model spend on 0G PC", value: "$53.81" },
  { label: "Median time to review", value: "87 s" },
  { label: "Same call as the maintainer*", value: "246 of 248" },
];
const RECEIPT_DAYS: [string, string][] = [
  ["Wed 21 Oct", "$15.64"],
  ["Thu 22 Oct", "$20.25"],
  ["Fri 23 Oct", "$14.23"],
  ["Sat 24 Oct, so far", "$3.69"],
];

const ROADMAP: { phase: string; name: string; status: string; live?: boolean; text: string }[] = [
  { phase: "Phase 1", name: "Suggest", status: "Live", live: true, text: "One comment and a few labels on every PR since 21 Oct." },
  { phase: "Phase 2", name: "/approve queue", status: "Built", text: "A daily queue issue. One /approve, and the bot merges, fixes, thanks and closes as suggested." },
  { phase: "Phase 3", name: "Automatic for proven classes", status: "Next", text: "Only kinds of PR with a long, clean record, such as TV lists." },
  { phase: "Goal", name: "Any repo", status: "Later", text: "A standalone bot any busy repo can use: its rules, its past decisions." },
];

// "Powered by" and the 0G logo (public/brand/0g.svg, white, from 0g.ai), as a glass pill to pc.0g.ai.
const POWERED = (
  <a href={PC} className="bot-0g" aria-label="Powered by 0G">
    <span>Powered by</span>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/brand/0g-purple.svg" alt="" width={46} height={22} />
  </a>
);

const ARROW = (
  <svg className="bot-arrow" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default async function Bot() {
  const s = await loadBotStats();
  // Whole days only, unless the newest is today: then it is drawn as "so far".
  const today = new Date().toISOString().slice(0, 10);
  const max = Math.max(...s.perDay.map(([, v]) => v), 1);
  const busiest = s.perDay.reduce((a, b) => (b[1] > a[1] ? b : a), s.perDay[0]);
  const perCall = MODELS.map((m) => m.usd / m.calls);
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
    <main className="page-main" style={page}>
      <JsonLd data={jsonLd} />
      <div style={wrap}>
        <p style={kicker}>
          <Link href="/" className="home-link" style={green}>cleanyour.tv</Link> &nbsp;·&nbsp; Bot
        </p>
        <h1 className="bot-title">maintainer-bot</h1>
        <p className="bot-lede">
          Every pull request here is reviewed by an open-source bot that runs on <a href={PC} style={{ ...green, whiteSpace: "nowrap" }}>0G Private Computer</a>.
        </p>
        <div className="bot-cta">
          <a href={BOT} className="bot-btn bot-btn-main">maintainer-bot on GitHub</a>
          <a href="#how" className="bot-btn">How it decides</a>
          {POWERED}
        </div>
        <p className="bot-cta-note">MIT licensed</p>

        {/* The receipt: what it has done so far, and what it cost. */}
        <section aria-labelledby="receipt" className="bot-receipt">
          <div className="bot-rcpt">
            <h2 id="receipt" className="bot-rcpt-head">
              <span>CLEANYOURTV · maintainer-bot</span>
              <span>Receipt · since 21 Oct</span>
            </h2>
            <ul className="bot-rcpt-lines">
              {[
                { label: "Review runs", value: n(s.runs) },
                { label: "PRs carry its review", value: n(s.reviewed) },
                ...RECEIPT_FIXED,
              ].map((r) => (
                <li key={r.label}><span>{r.label}</span><i aria-hidden="true" /><b>{r.value}</b></li>
              ))}
            </ul>
            <ul className="bot-rcpt-lines bot-rcpt-days" aria-label="Model spend per day">
              {RECEIPT_DAYS.map(([d, v]) => (
                <li key={d}><span>{d}</span><i aria-hidden="true" /><span>{v}</span></li>
              ))}
              <li><span>Unchanged pushes</span><i aria-hidden="true" /><span>$0.00</span></li>
            </ul>
            <p className="bot-rcpt-foot">Runs on 0G Private Computer</p>
          </div>
          <div className="bot-rcpt-notes">
            <p><b>5.5¢ a review</b> is the median model cost of one review on 0G PC. Re-checking an unchanged push costs nothing.</p>
            <p><b>*Same call as the maintainer:</b> when the bot made the call on its own, the maintainer later did the same thing 246 times out of 248. Not a blind test: the maintainer could see its suggestion. Both misses were duplicates of another PR, which it now checks for. Its merge calls: 230 of 232 merged.</p>
            <p className="bot-small">Review runs and PRs carrying its review are live counts from GitHub. Spend, time to review and calls as of {RECEIPT_ASOF}. Time to review: from a PR opening to the bot&rsquo;s comment, median. Spend: each review&rsquo;s cost in the bot&rsquo;s run logs, at the 0G PC router&rsquo;s listed prices.</p>
          </div>
        </section>

        {/* 01: the flood */}
        <section aria-labelledby="why">
          <h2 id="why" className="bot-h2"><span>01</span>Why it exists</h2>
          <ul className="bot-stats">
            <li><b>{n(s.prs)}</b><span>pull requests since the repo opened on 17 Oct</span><em>{n(s.merged)} merged · {n(s.open)} open</em></li>
            <li><b>{n(s.authors)}</b><span>people sent them</span></li>
            <li><b>{n(s.peak)}</b><span>waiting at once, at the peak</span><em>{day(s.peakDay)}</em></li>
            <li><b>1</b><span>maintainer to read them all</span></li>
          </ul>
          <figure className="bot-card bot-days">
            <figcaption>Pull requests opened per day <span>(UTC)</span></figcaption>
            <ol aria-label="Pull requests opened per day">
              {s.perDay.map(([d, v]) => (
                <li key={d} title={`${day(d)}: ${v} pull requests${d === today ? " so far" : ""}`} className={d === today ? "bot-today" : undefined}>
                  <span className="bot-bar-v">{v}</span>
                  <span className="bot-bar" style={{ height: `${Math.max(4, (v / max) * 100)}%` }} />
                  <span className="bot-bar-d">{d === today ? "today" : day(d)}</span>
                </li>
              ))}
            </ol>
            <p className="bot-small">{busiest[1]} on the busiest day, {day(busiest[0])}. Each one can disable system packages on someone&rsquo;s TV or touch a launcher that has to stay small.</p>
          </figure>
        </section>

        {/* 02: the pipeline */}
        <section aria-labelledby="how">
          <h2 id="how" className="bot-h2"><span>02</span>How it decides</h2>
          <ol className="bot-flow">
            {STEPS.map((x, i) => (
              <li key={x.step} className={x.ai ? "bot-node bot-ai" : "bot-node"}>
                {i > 0 && ARROW}
                <span className="bot-node-n">{i + 1}</span>
                <span className="bot-node-step">{x.step}</span>
                <span className="bot-node-model">{x.model}</span>
                <span className="bot-node-text">{x.text}</span>
              </li>
            ))}
            <li className="bot-node bot-out">
              {ARROW}
              <span className="bot-node-step">One comment</span>
              <span className="bot-node-text">A suggestion, or &ldquo;needs maintainer&rdquo;.</span>
            </li>
          </ol>
          <ul className="bot-rails">
            <li><b>Abstains when unsure.</b> Below its confidence bar, or when the second opinion disagrees, the PR goes to the maintainer.</li>
            <li><b>Some PRs always go to the maintainer.</b> Safety rules and PROMPT.md, workflows, protected packages: no model call at all.</li>
            <li><b>Unchanged pushes cost nothing.</b> A rebase or a main merge re-runs the facts and rules on the earlier review, without a model call.</li>
          </ul>

          <div className="bot-card bot-models">
            <div className="bot-models-head">
              <h3>The right model for each step</h3>
              <p>Depth where it matters, speed and cost where it doesn&rsquo;t. Claude Opus 5.5, Claude Sonnet 5 and GLM-5.3-flash all run on{" "}
                <a href={PC} style={{ ...green, whiteSpace: "nowrap" }}>0G Private Computer</a>, through one router key.{" "}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/0g-purple.svg" alt="" width={25} height={12} className="bot-0g-inline" />
              </p>
            </div>
            <ul>
              {MODELS.map((m, i) => (
                <li key={m.model}>
                  <span className="bot-m-name">{m.model} <span className="bot-small">on 0G PC</span></span>
                  <span className="bot-m-job">{m.job}</span>
                  <span className="bot-m-bar" aria-hidden="true"><span style={{ width: `${Math.max(2, (perCall[i] / perCall[0]) * 100)}%` }} /></span>
                  <span className="bot-m-cost">{(perCall[i] * 100).toFixed(1)}¢ a call</span>
                </li>
              ))}
            </ul>
            <p className="bot-small">Cost per call in the v4 backtest: {MODELS.map((m) => `${m.calls} calls for $${m.usd.toFixed(2)}`).join(", ")}.</p>
          </div>
        </section>

        {/* 03: the verdicts */}
        <section aria-labelledby="suggests">
          <h2 id="suggests" className="bot-h2"><span>03</span>What it suggests</h2>
          <div className="bot-verdicts">
            {VERDICTS.map((g) => (
              <div key={g.group} className={`bot-vgroup bot-${g.tone}`}>
                <h3>{g.group}</h3>
                <ul>
                  {g.items.map(([v, t]) => (
                    <li key={v}><span className="bot-chip">{v}</span><span>{t}</span></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="bot-note">
            <b>It never merges or closes by itself.</b> Phase 1 only suggests: one comment and a few labels. Gathin approves every decision.
          </p>
        </section>

        {/* 04: results */}
        <section aria-labelledby="results">
          <h2 id="results" className="bot-h2"><span>04</span>Results, v3 → v4</h2>
          <ul className="bot-results">
            {RESULTS.map((r) => (
              <li key={r.label} className="bot-card">
                <span className="bot-r-label">{r.label}</span>
                <span className="bot-r-nums"><s>{r.from}</s>{ARROW}<b>{r.to}</b></span>
                <span className="bot-small">{r.note}</span>
              </li>
            ))}
            <li className="bot-card">
              <span className="bot-r-label">Cost per review</span>
              <span className="bot-r-nums"><b>5.5¢</b></span>
              <span className="bot-small">median, live; $0 to re-check an unchanged push</span>
            </li>
            <li className="bot-card">
              <span className="bot-r-label">Reviews run</span>
              <span className="bot-r-nums"><b>{n(s.runs)}</b></span>
              <span className="bot-small">successful runs since 21 Oct; {n(s.reviewed)} PRs carry its review</span>
            </li>
          </ul>
          <div className="bot-card bot-method">
            <h3>How we measured</h3>
            <p>
              A time-split backtest on the maintainer&rsquo;s real decisions: 219 PRs decided on 21 and 22 Oct. Thresholds were tuned on the 53 decided on 21 Oct,
              then the bot ran once on the 166 decided on 22 Oct, each PR as it looked at the time, with only earlier decisions as memory. The v3 numbers are the
              reviews v3 actually posted.
            </p>
            <p>
              Read 85% as optimistic: one guard was added after seeing the test (without it, 37% decided at 71% right), and the policy was written from the same
              days&rsquo; decisions. <a href={REPORT} style={green}>The full report</a>.
            </p>
          </div>
        </section>

        {/* 05: roadmap */}
        <section aria-labelledby="next">
          <h2 id="next" className="bot-h2"><span>05</span>Where it goes</h2>
          <ol className="bot-road">
            {ROADMAP.map((r) => (
              <li key={r.phase} className={r.live ? "bot-card bot-live" : "bot-card"}>
                <span className="bot-road-top"><span>{r.phase}</span><span className="bot-badge">{r.status}</span></span>
                <span className="bot-road-name">{r.name}</span>
                <span className="bot-small">{r.text}</span>
              </li>
            ))}
          </ol>
        </section>

        <div className="bot-foot">
          <span>maintainer-bot runs on <a href={PC} style={{ ...green, whiteSpace: "nowrap" }}>0G Private Computer</a>.</span>
        </div>
        <p style={{ margin: "16px 0 0", color: "#9a9a9a" }}>
          The code, the rules and the reports are on <a href={BOT} style={green}>GitHub</a>, MIT licensed. Also: <Link href="/faq" style={green}>the FAQ</Link>,{" "}
          <Link href="/press" style={green}>press</Link>, <Link href="/addons" style={green}>add-ons</Link> and <a href={GH} style={green}>CleanYourTV on GitHub</a>.
        </p>
      </div>
    </main>
  );
}
