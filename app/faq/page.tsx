import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import JsonLd from "@/components/JsonLd";
import { loadFacts } from "@/lib/data";
import { GH } from "@/lib/parse";
import { SITE, breadcrumbs, pageMeta } from "@/lib/seo";

// The questions and answers are the README's "Questions people ask", re-read on every hourly build,
// so this page and the README never drift apart.

const title = "Questions people ask";
const description =
  "Answers to what people ask about CleanYourTV before they try it: whether it is safe, what firmware updates do, ADB security and more, the same as in the README.";

export const metadata = pageMeta("/faq", `${title} · CleanYourTV`, description);

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
const wrap: CSSProperties = { maxWidth: 720, margin: "0 auto", padding: "40px 20px 120px", fontSize: 19, lineHeight: 1.6 };
const kicker: CSSProperties = { margin: "0 0 20px", fontSize: 15, letterSpacing: 2, textTransform: "uppercase", color: "#9a9a9a" };
const h2: CSSProperties = { fontSize: 28, fontWeight: 400, margin: "48px 0 12px", letterSpacing: -0.2, lineHeight: 1.25 };
const p: CSSProperties = { margin: "0 0 16px" };
const green = { color: "#cfffcf", borderBottomColor: "rgba(207,255,207,.35)" };
const code: CSSProperties = { fontSize: "0.85em", padding: "1px 6px", borderRadius: 6, background: "#15181e" };

const abs = (u: string) => (/^(https?:|mailto:)/.test(u) ? u : `${GH}/blob/main/${u.replace(/^\.\//, "")}`);

/** The README's answers are short Markdown: links, `code` and **bold** inside a line. */
function inline(md: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|`([^`]+)`|\*\*([^*]+)\*\*/g;
  let last = 0;
  for (let m = re.exec(md); m; m = re.exec(md)) {
    if (m.index > last) out.push(md.slice(last, m.index));
    if (m[1]) out.push(<a key={m.index} href={abs(m[2])} style={green}>{m[1]}</a>);
    else if (m[3]) out.push(<code key={m.index} style={code}>{m[3]}</code>);
    else out.push(<strong key={m.index} style={{ fontWeight: 500, color: "#fff" }}>{m[4]}</strong>);
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
      <ol key={i} style={{ paddingLeft: 22, margin: "0 0 16px" }}>
        {block.trim().split(/\n(?=\s*\d+\.\s)/).map((item, j) => (
          <li key={j} style={{ margin: "0 0 8px" }}>{inline(line(item.replace(/^\s*\d+\.\s/, "")))}</li>
        ))}
      </ol>
    ) : (
      <p key={i} style={p}>{inline(line(block))}</p>
    ),
  );
}

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
    <main className="page-main" style={page}>
      <JsonLd data={jsonLd} />
      <article style={wrap}>
        <p style={kicker}>
          <Link href="/" className="home-link" style={green}>cleanyour.tv</Link> &nbsp;·&nbsp; FAQ
        </p>
        <h1 style={{ fontSize: 44, lineHeight: 1.1, fontWeight: 400, margin: "0 0 14px", letterSpacing: -0.5 }}>{title}</h1>
        <p style={{ ...p, fontSize: 20, color: "#bdbdbd" }}>
          The same answers as the <a href={`${GH}#questions-people-ask`} style={green}>README</a>, kept in step with it.
        </p>

        {faq.map((x) => (
          <section key={x.q}>
            <h2 style={h2}>{x.q}</h2>
            {answer(x.md)}
          </section>
        ))}

        <p style={{ margin: "56px 0 0", color: "#9a9a9a", fontSize: 17 }}>
          Something else? Ask in <a href={`${GH}/discussions`} style={green}>GitHub Discussions</a>, or read the{" "}
          <a href={GH} style={green}>whole README</a>. Also: <Link href="/addons" style={green}>add-ons</Link>,{" "}
          <Link href="/press" style={green}>press</Link> and <Link href="/bot" style={green}>the review bot</Link>.
        </p>
      </article>
    </main>
  );
}
