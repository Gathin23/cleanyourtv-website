"use client";

import { useMemo, useState } from "react";
import { cdn } from "@/lib/site";
import { videoDate, videoEmbed, videoLength, videoSite, videoUrl, videoViews } from "@/lib/videos";
import { LANGS, type TutorialVideo } from "@/lib/tutorials";

const PAGE = 24;

/** One video: its thumbnail is a play button, and the player (youtube-nocookie, or Bilibili's) only loads once it is pressed. */
export function TutorialCard({ v, big = false }: { v: TutorialVideo; big?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const watch = videoUrl(v);
  const site = videoSite(v);
  return (
    <article className={big ? "tut-card tut-card-big" : "tut-card"}>
      <div className="tut-thumb">
        {playing ? (
          <iframe
            src={`${videoEmbed(v)}${v.site === "bilibili" ? "&autoplay=1" : "?autoplay=1&rel=0"}`}
            title={v.title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button type="button" className="tut-play" onClick={() => setPlaying(true)} aria-label={`Play “${v.title}” here (loads ${site})`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cdn(`/press/videos/${v.id}.jpg`)} alt="" width={480} height={360} loading="lazy" decoding="async" />
            <span className="tut-play-icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5.5v13l11-6.5z" />
              </svg>
            </span>
            {v.duration > 0 && <span className="tut-len ch">{videoLength(v.duration)}</span>}
          </button>
        )}
      </div>
      <div className="tut-body">
        <h3 className="tut-title">{v.title}</h3>
        <p className="tut-meta">
          <span>{[v.channel, videoDate(v.date)].filter(Boolean).join(" · ")}</span>
        </p>
        <p className="tut-row">
          <span className="tut-tags">
            <span className="tut-lang ch">{LANGS[v.lang] || v.lang}</span>
            {v.views > 0 && <span className="tut-views ch">{videoViews(v.views)}</span>}
          </span>
          <a href={watch} target="_blank" rel="noopener" className="tut-yt">
            Watch on {site}<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </p>
      </div>
    </article>
  );
}

/** The whole list: tutorials or everything, a language, most viewed or newest. */
export default function TutorialGrid({ videos }: { videos: TutorialVideo[] }) {
  const [kind, setKind] = useState<"tutorial" | "all">("tutorial");
  const [lang, setLang] = useState("all");
  const [sort, setSort] = useState<"views" | "new">("views");
  const [shown, setShown] = useState(PAGE);

  const byKind = useMemo(() => (kind === "all" ? videos : videos.filter((v) => v.kind === "tutorial")), [videos, kind]);
  const langs = useMemo(() => {
    const n = new Map<string, number>();
    for (const v of byKind) n.set(v.lang, (n.get(v.lang) || 0) + 1);
    return [...n].sort((a, b) => b[1] - a[1] || (LANGS[a[0]] || a[0]).localeCompare(LANGS[b[0]] || b[0]));
  }, [byKind]);
  const list = useMemo(() => {
    const l = lang === "all" ? byKind : byKind.filter((v) => v.lang === lang);
    return [...l].sort((a, b) => (sort === "views" ? b.views - a.views : b.date.localeCompare(a.date)));
  }, [byKind, lang, sort]);

  const pickKind = (k: "tutorial" | "all") => {
    setKind(k);
    setLang("all");
    setShown(PAGE);
  };

  return (
    <div className="tut-all">
      <div className="tut-controls">
        <div className="chips" role="group" aria-label="Which videos">
          <button type="button" className="chip" aria-pressed={kind === "tutorial"} onClick={() => pickKind("tutorial")}>
            Tutorials <span className="chip-n">{videos.filter((v) => v.kind === "tutorial").length}</span>
          </button>
          <button type="button" className="chip" aria-pressed={kind === "all"} onClick={() => pickKind("all")}>
            All videos <span className="chip-n">{videos.length}</span>
          </button>
        </div>
        <div className="tut-selects">
          <label className="tut-sort">
            <span className="ch tut-sel-l">Language</span>
            <select className="tut-sel" value={lang} onChange={(e) => (setLang(e.target.value), setShown(PAGE))}>
              <option value="all">Every language ({byKind.length})</option>
              {langs.map(([code, n]) => (
                <option key={code} value={code}>
                  {LANGS[code] || code} ({n})
                </option>
              ))}
            </select>
          </label>
          <label className="tut-sort">
            <span className="ch tut-sel-l">Sort</span>
            <select className="tut-sel" value={sort} onChange={(e) => setSort(e.target.value as "views" | "new")}>
              <option value="views">Most viewed</option>
              <option value="new">Newest</option>
            </select>
          </label>
        </div>
      </div>
      <ul className="plain tut-grid" aria-live="polite">
        {list.slice(0, shown).map((v) => (
          <li key={v.id}>
            <TutorialCard v={v} />
          </li>
        ))}
      </ul>
      {list.length > shown && (
        <button type="button" className="btn btn-ghost btn-sm tut-more" onClick={() => setShown((s) => s + PAGE)}>
          Show more <span className="ch">{list.length - shown} left</span>
        </button>
      )}
    </div>
  );
}
