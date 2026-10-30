"use client";

import { useState } from "react";
import { cdn } from "@/lib/site";
import { type Video, videoDate, videoLength, videoSite, videoUrl, videoViews } from "@/lib/videos";

/** Video cards linking out to YouTube or Bilibili (no embeds): the most watched first, the rest one tap away. */
export default function VideoGrid({ videos, shown = 4 }: { videos: Video[]; shown?: number }) {
  const [all, setAll] = useState(false);
  const list = all ? videos : videos.slice(0, shown);
  return (
    <>
      <ul id="video-list" className="plain vids">
        {list.map((v) => (
          <li key={v.id}>
            <a href={videoUrl(v)} target="_blank" rel="noopener" className="vid">
              <span className="vid-thumb">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cdn(`/press/videos/${v.id}.jpg`)} alt="" width={480} height={360} loading="lazy" decoding="async" />
                {v.duration > 0 && <span className="vid-len ch">{videoLength(v.duration)}</span>}
              </span>
              <span className="vid-title">{v.title}</span>
              <span className="vid-meta">
                <span>{[v.channel, videoDate(v.date)].filter(Boolean).join(" · ")}</span>
                <span className="vid-views ch">{videoViews(v.views)}</span>
              </span>
              <span className="sr-only"> ({videoSite(v)}, opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
      {videos.length > shown && (
        <button type="button" className="btn btn-ghost btn-sm press-more" aria-expanded={all} aria-controls="video-list" onClick={() => setAll((a) => !a)}>
          {all ? "Show fewer videos" : `Show all ${videos.length} videos`}
        </button>
      )}
    </>
  );
}
