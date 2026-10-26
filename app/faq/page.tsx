import Link from "next/link";
import type { ReactNode } from "react";
import JsonLd from "@/components/JsonLd";
import { loadFacts } from "@/lib/data";
import { GH } from "@/lib/parse";
import { SITE, breadcrumbs, pageMeta } from "@/lib/seo";
import { PRIVACY_PATH } from "@/lib/site";
import "./faq.css";

// The questions and answers are the README's "Questions people ask", re-read on every hourly build,
// so this page and the README never drift apart.

const title = "Questions people ask";
const description =
  "Answers to what people ask about CleanYourTV before they try it: whether it is safe, what firmware updates do, ADB security and more, the same as in the README.";

export const metadata = pageMeta("/faq", `${title} · CleanYourTV`, description);

const abs = (u: string) => (/^(https?:|mailto:)/.test(u) ? u : `${GH}/blob/main/${u.replace(/^\.\//, "")}`);

/** The README's answers are short Markdown: links, `code` and **bold** inside a line. */
function inline(md: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|`([^`]+)`|\*\*([^*]+)\*\*/g;
  let last = 0;
  for (let m = re.exec(md); m; m = re.exec(md)) {
    if (m.index > last) out.push(md.slice(last, m.index));
    if (m[1]) out.push(<a key={m.index} href={abs(m[2])}>{m[1]}</a>);
    else if (m[3]) out.push(<code key={m.index}>{m[3]}</code>);
    else out.push(<strong key={m.index}>{m[4]}</strong>);
    last = re.lastIndex;
  }
  out.push(md.slice(last));
  return out;
}

/** Paragraphs, and a numbered list where a block starts with "1. ". */
function answer(md: string): ReactNode[] {
  const line = (s: string) => s.replace(/\s*\n\s*/g, " ").trim();
  return md.split(/\n\s*\n/).map((block, i) =>
    /^\s*\d+\.\s/.test(block) ? (
      <ol key={i}>
        {block.trim().split(/\n(?=\s*\d+\.\s)/).map((item, j) => (
          <li key={j}>{inline(line(item.replace(/^\s*\d+\.\s/, "")))}</li>
        ))}
      </ol>
    ) : (
      <p key={i}>{inline(line(block))}</p>
    ),
  );
}

// Where most people are headed before they read a word: [label, answer, link, tile colour].
const QUICK: [string, string, string, string][] = [
  ["Which TVs?", "Android TV and Google TV. Check yours.", "/tvs", "t-green"],
  ["Samsung, LG or Roku?", "Not supported. Use the privacy guide.", PRIVACY_PATH, "t-amber"],
  ["No laptop?", "Use the Android phone app.", "/app/android", "t-blue"],
];

const num = (i: number) => String(i + 1).padStart(2, "0");

export default async function Faq() {
  const { faq } = await loadFacts();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "@id": `${SITE}/faq`,
        url: `${SITE}/faq`,
        name: title,
        isPartOf: { "@id": `${SITE}/#website` },
        about: { "@id": `${SITE}/#app` },
        mainEntity: faq.map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.a } })),
      },
      breadcrumbs(["FAQ", "/faq"]),
    ],
  };
  return (
    <main className="faq">
      <JsonLd data={jsonLd} />

      <section aria-labelledby="page-h" className="wrap page-head">
        <p className="kicker c-violet">CH 10 · FAQ</p>
        <h1 id="page-h" className="h1">{title}</h1>
        <p className="lede">
          The same answers as the <a href={`${GH}#questions-people-ask`}>README</a>, kept in step with it.
        </p>
      </section>

      <section aria-label="Quick answers" className="wrap faq-quick">
        <div className="grid-cards">
          {QUICK.map(([label, text, href, tone]) => (
            <Link key={label} href={href} className={`tile faq-tile ${tone}`}>
              <span className="faq-tile-q">{label}</span>
              <span className="faq-tile-a">{text}</span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-label="All questions" className="faq-all">
        <div className="wrap faq-cols">
          <nav aria-label="Jump to a question" className="faq-nav">
            <p className="ch faq-count">{faq.length} questions</p>
            {faq.map((x, i) => (
              <a key={x.q} href={`#q${i + 1}`}>
                <span className="ch">{num(i)}</span>
                <span>{x.q}</span>
              </a>
            ))}
          </nav>
          <div className="faq-list">
            {faq.map((x, i) => (
              <details key={x.q} id={`q${i + 1}`} open={i < 2}>
                <summary>
                  <span className="ch faq-n">{num(i)}</span>
                  <h2>{x.q}</h2>
                  <svg className="faq-plus" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </summary>
                <div className="faq-a">{answer(x.md)}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="stuck-h" className="wrap faq-stuck">
        <div className="faq-stuck-box">
          <div className="stack faq-stuck-text">
            <h2 id="stuck-h" className="faq-stuck-h">Still stuck?</h2>
            <p>Most problems are already in the troubleshooting guide. If not, ask: someone with the same TV has probably been there.</p>
          </div>
          <div className="btns">
            <a href={`${GH}/discussions`} className="btn btn-mint btn-md">Ask in GitHub Discussions</a>
            <a href={`${GH}/blob/main/docs/TROUBLESHOOTING.md`} className="btn btn-ghost btn-md">Troubleshooting</a>
          </div>
        </div>
      </section>
    </main>
  );
}
