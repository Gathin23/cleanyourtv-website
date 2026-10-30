// Everything the site reads from the cleanyourtv repo and GitHub, fetched at build time (the site is a
// static export, rebuilt hourly by .github/workflows/deploy-cloudflare.yml) with a static fallback for
// every value, so a build never fails on the GitHub rate limit and no request ever reaches GitHub.
import fs from "node:fs/promises";
import path from "node:path";
import { GH, REPO, THEMES_RAW, brandsOf, countLanguages, parseAddons, parseFaq, parsePushCommand, parseShowcase, parseSwitchImages, parseThemeKeys, parseTVs, parseThemes, starSeriesFallback, tweetToken } from "./parse";
import { SWITCH_IMAGES } from "./site";
import type { AddonsData, Faq, Pr, ResultItem, ShowcaseItem, SiteData, ThemeCard, ThemeItem, Tv, Tweet } from "./parse";

const RAW = `https://raw.githubusercontent.com/${REPO}/main/`;
const REVALIDATE = 3600;

function ghHeaders(): HeadersInit {
  const h: Record<string, string> = { Accept: "application/vnd.github+json", "User-Agent": "cleanyour.tv" };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

async function text(url: string): Promise<string | null> {
  try {
    const r = await fetch(url, { next: { revalidate: REVALIDATE } });
    return r.ok ? r.text() : null;
  } catch {
    return null;
  }
}

// Everyone with a commit on main, from GitHub's contributors list: one entry per page, so the last page number is the count.
async function contributorCount(): Promise<number | null> {
  try {
    const r = await fetch(`https://api.github.com/repos/${REPO}/contributors?per_page=1&anon=0`, { headers: ghHeaders(), next: { revalidate: REVALIDATE } });
    if (!r.ok) return null;
    const last = /[?&]page=(\d+)>; rel="last"/.exec(r.headers.get("link") || "");
    return last ? Number(last[1]) : ((await r.json()) as unknown[]).length;
  } catch {
    return null;
  }
}

async function json<T>(url: string): Promise<T | null> {
  try {
    const r = await fetch(url, { headers: ghHeaders(), next: { revalidate: REVALIDATE } });
    return r.ok ? ((await r.json()) as T) : null;
  } catch {
    return null;
  }
}

// ---- star history: hourly buckets over the first 48 hours, normalised 0..1 (falls back to a curve)

async function starSeries(total: number): Promise<number[]> {
  // Each page is 100 stargazers with timestamps; cap the walk so a huge repo cannot exhaust the limit.
  if (!process.env.GITHUB_TOKEN) return starSeriesFallback();
  const pages = Math.min(40, Math.ceil(total / 100));
  const times: number[] = [];
  for (let p = 1; p <= pages; p++) {
    try {
      const r = await fetch(`https://api.github.com/repos/${REPO}/stargazers?per_page=100&page=${p}`, {
        headers: { ...ghHeaders(), Accept: "application/vnd.github.star+json" },
        next: { revalidate: REVALIDATE * 6 },
      });
      if (!r.ok) break;
      const list = (await r.json()) as { starred_at: string }[];
      list.forEach((s) => times.push(Date.parse(s.starred_at)));
      if (list.length < 100) break;
    } catch {
      break;
    }
  }
  if (times.length < 50) return starSeriesFallback();
  times.sort((a, b) => a - b);
  const t0 = times[0], buckets = new Array(49).fill(0);
  for (const t of times) {
    const h = Math.floor((t - t0) / 3600000);
    if (h <= 48) buckets[h] += 1;
  }
  let acc = 0;
  const cum = buckets.map((n) => (acc += n));
  const max = cum[48] || 1;
  return cum.map((v) => v / max);
}

// ---- the launch tweet: text and counts from X's public syndication endpoint (the one embeds use)

const TWEET_ID = "2111379569030939102";

async function tweet(): Promise<Tweet> {
  try {
    const r = await fetch(`https://cdn.syndication.twimg.com/tweet-result?id=${TWEET_ID}&token=${tweetToken(TWEET_ID)}&lang=en`, {
      headers: { "User-Agent": "Mozilla/5.0 (cleanyour.tv)" },
      next: { revalidate: REVALIDATE },
    });
    if (!r.ok) return FALLBACK.tweet;
    const j = (await r.json()) as { text?: string; favorite_count?: number; conversation_count?: number; created_at?: string };
    const text = (j.text || "").replace(/\s*https?:\/\/t\.co\/\S+/g, "").trim();
    if (!text) return FALLBACK.tweet;
    return { text, likes: j.favorite_count ?? FALLBACK.tweet.likes, replies: j.conversation_count ?? FALLBACK.tweet.replies, date: j.created_at || FALLBACK.tweet.date };
  } catch {
    return FALLBACK.tweet;
  }
}

// ---- the one call page.tsx makes

export async function loadSiteData(): Promise<SiteData> {
  const [repo, examplesMd, showcaseMd, themesMd, prompt, tw] = await Promise.all([
    json<{ stargazers_count: number; forks_count: number }>(`https://api.github.com/repos/${REPO}`),
    text(RAW + "examples/README.md"),
    text(RAW + "SHOWCASE.md"),
    text(RAW + "themes/README.md"),
    text(RAW + "PROMPT.md"),
    tweet(),
  ]);

  const prs: Pr[] = [];
  for (let p = 1; p <= 3; p++) {
    const list = await json<{ merged_at: string | null; user: { login: string; avatar_url: string } | null; title: string }[]>(
      `https://api.github.com/repos/${REPO}/pulls?state=closed&per_page=100&page=${p}`,
    );
    if (!list) break;
    list.forEach((x) => {
      if (x.merged_at && x.user) prs.push({ login: x.user.login, avatar: x.user.avatar_url, title: x.title || "" });
    });
    if (list.length < 100) break;
  }

  const results = JSON.parse(await fs.readFile(path.join(process.cwd(), "content", "results.json"), "utf8")) as ResultItem[];
  const stars = repo?.stargazers_count ?? FALLBACK.stars;

  return {
    stars,
    forks: repo?.forks_count ?? FALLBACK.forks,
    prs,
    prCount: prs.length || FALLBACK.prCount,
    contributors: (await contributorCount()) ?? (prs.length ? new Set(prs.map((p) => p.login)).size : FALLBACK.contributors),
    tvs: examplesMd ? parseTVs(examplesMd) : parseTVs(FALLBACK.examples),
    results,
    showcase: showcaseMd ? parseShowcase(showcaseMd) : FALLBACK.showcase,
    themes: themesMd ? parseThemes(themesMd) : FALLBACK.themes,
    prompt: prompt || `Read and follow the prompt at ${GH}/blob/main/PROMPT.md\nMy TV model is: <MODEL NAME HERE>.`,
    tweet: tw,
    starSeries: await starSeries(stars),
    fetchedAt: new Date().toISOString(),
  };
}

// ---- every page: the header's GitHub pill. The same request as loadSiteData's, so a build sends it once.

export async function loadStars(): Promise<number> {
  const repo = await json<{ stargazers_count: number }>(`https://api.github.com/repos/${REPO}`);
  return repo?.stargazers_count ?? FALLBACK.stars;
}

// ---- /press: the launch post's likes, from the same syndication call as the home page's

export const loadTweet = (): Promise<Tweet> => tweet();

// ---- /tvs: the tested-model table from examples/README.md, on its own so the page skips the home page's GitHub calls

export async function loadTvs(): Promise<Tv[]> {
  const md = await text(RAW + "examples/README.md");
  return parseTVs(md || FALLBACK.examples);
}

// ---- /addons: one card per folder in themes/, the Keys table as switches, and the add-ons table

type Tree = { tree: { path: string; type: string }[] };
type Commit = { author: { login: string; html_url: string } | null; commit: { author: { name: string } } };

const shortDate = (d: string) => new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

async function themeCard(name: string, files: string[] | null, readmeRows: ThemeItem[], readme: string): Promise<ThemeCard> {
  const [raw, commits] = await Promise.all([
    text(`${RAW}themes/${name}/config.json`),
    json<Commit[]>(`https://api.github.com/repos/${REPO}/commits?path=themes/${name}&per_page=100`),
  ]);
  let config: Record<string, unknown> = {};
  try { config = raw ? (JSON.parse(raw) as Record<string, unknown>) : {}; } catch { /* a theme that doesn't parse shows no keys */ }
  // The folder's first commit is its author. Screenshots are only ever ones the folder has.
  const first = commits?.length ? commits[commits.length - 1] : null;
  const shot = files
    ? ["screenshot.jpg", "screenshot.png"].find((f) => files.includes(`${name}/${f}`))
    : readme.includes(`${name}/screenshot.jpg`) ? "screenshot.jpg" : undefined;
  const until = typeof config.festival_until === "string" && /^\d{4}-\d{2}-\d{2}$/.test(config.festival_until) ? config.festival_until : "";
  const ended = !!until && until < new Date().toISOString().slice(0, 10);
  return {
    name,
    what: readmeRows.find((t) => t.name === name)?.what || "",
    by: first ? first.author?.login || first.commit.author.name : "",
    byUrl: first?.author?.html_url || "",
    screenshot: shot ? `themes/${name}/${shot}` : "",
    keys: Object.keys(config),
    season: until ? `${ended ? "ended" : "until"} ${shortDate(until)}` : "",
    ended,
  };
}

export async function loadAddonsData(): Promise<AddonsData> {
  const [readmeRemote, addonsMd, showcaseMd, switchesMd, tree] = await Promise.all([
    text(RAW + "themes/README.md"),
    text(RAW + "addons/README.md"),
    text(RAW + "SHOWCASE.md"),
    text(RAW + "docs/switches.md"),
    json<Tree>(`https://api.github.com/repos/${REPO}/git/trees/main:themes?recursive=1`),
  ]);
  const readme = readmeRemote || (await fs.readFile(path.join(process.cwd(), "content", "themes-readme.md"), "utf8"));
  const rows = parseThemes(readme);
  // Folders come from the tree; without it, from the README's table. README order first, then any new folder.
  const files = tree ? tree.tree.filter((t) => t.type === "blob").map((t) => t.path) : null;
  const folders = tree ? tree.tree.filter((t) => t.type === "tree" && !t.path.includes("/")).map((t) => t.path) : rows.map((r) => r.name);
  const order = [...rows.map((r) => r.name).filter((n) => folders.includes(n)), ...folders.filter((n) => !rows.some((r) => r.name === n)).sort()];
  const themes = await Promise.all(order.map((n) => themeCard(n, files, rows, readme)));
  return {
    themes: [...themes.filter((t) => !t.ended), ...themes.filter((t) => t.ended)],
    push: parsePushCommand(readme),
    keys: parseThemeKeys(readme),
    // docs/switches.md is the list of key screenshots; until it exists or if it can't be read, the hand-kept fallback.
    keyImages: { ...SWITCH_IMAGES, ...(switchesMd ? parseSwitchImages(switchesMd) : {}) },
    addons: addonsMd ? parseAddons(addonsMd) : [],
    // Add-ons that live in their own repos: SHOWCASE.md's add-ons section (its table rows only).
    community: showcaseMd ? parseShowcase(showcaseMd).filter((i) => /add-ons/i.test(i.category || "")) : [],
  };
}

// ---- /llms.txt, the sitemap and the home page's structured data: the counts and the FAQ, live from the repo

export type Facts = { tvs: number; brands: [string, number][]; brandCount: number; languages: number; faq: Faq[]; readme: string; updated: string };

export async function loadFacts(): Promise<Facts> {
  const [examplesMd, readme, res, last] = await Promise.all([
    text(RAW + "examples/README.md"),
    text(RAW + "README.md"),
    json<Tree>(`https://api.github.com/repos/${REPO}/git/trees/main:launcher/app/src/main/res`),
    json<{ commit: { committer: { date: string } } }[]>(`https://api.github.com/repos/${REPO}/commits?per_page=1`),
  ]);
  const tvs = parseTVs(examplesMd || FALLBACK.examples);
  // Languages from the launcher's res/ folders; without the tree, from the README's "**24 languages**".
  const stated = readme?.match(/\*\*(\d+) languages\*\*/);
  const faq = readme ? parseFaq(readme) : [];
  const brands = brandsOf(tvs);
  // The README's count ("371 TV models · 100 brands"), from each tv.json's "brand": the table's first word
  // splits a re-badge (Coocaa, Strong, SEMP) from its maker.
  const statedBrands = readme?.match(/\d+ TV models · (\d+) brands/);
  return {
    tvs: tvs.length,
    brands,
    brandCount: statedBrands ? Number(statedBrands[1]) : brands.length,
    languages: res ? countLanguages(res.tree.filter((t) => t.type === "tree").map((t) => t.path)) : stated ? Number(stated[1]) : FALLBACK.languages,
    faq: faq.length ? faq : parseFaq(await fs.readFile(path.join(process.cwd(), "content", "readme-faq.md"), "utf8")),
    readme: readme || "",
    updated: last?.[0]?.commit.committer.date || new Date().toISOString(),
  };
}

// ---- /bot: the pull-request flood and the bot's own runs, live from the GitHub API

export type BotStats = {
  prs: number; merged: number; open: number; authors: number;
  peak: number; peakDay: string; // the most PRs open at once, and the UTC day it happened
  perDay: [string, number][]; // PRs opened per UTC day, oldest first
  runs: number; reviewed: number; // successful maintainer-bot workflow runs; PRs carrying its review comment
};

type PullRow = { user: { login: string; type: string }; created_at: string; closed_at: string | null; merged_at: string | null };

export async function loadBotStats(): Promise<BotStats> {
  const F = FALLBACK.bot;
  const [runs, reviewed] = await Promise.all([
    json<{ total_count: number }>(`https://api.github.com/repos/${REPO}/actions/workflows/maintainer-bot.yml/runs?status=success&per_page=1`),
    json<{ total_count: number }>(`https://api.github.com/search/issues?q=${encodeURIComponent(`repo:${REPO} type:pr "Reviewed by maintainer-bot" in:comments`)}&per_page=1`),
  ]);
  // Every PR, 100 a page: only with a token (the walk would use up the public limit), capped like the star walk.
  const pulls: PullRow[] = [];
  if (process.env.GITHUB_TOKEN) {
    for (let p = 1; p <= 30; p++) {
      const page = await json<PullRow[]>(`https://api.github.com/repos/${REPO}/pulls?state=all&per_page=100&page=${p}`);
      if (!page) { pulls.length = 0; break; }
      pulls.push(...page);
      if (page.length < 100) break;
    }
  }
  const live = { runs: runs?.total_count || F.runs, reviewed: reviewed?.total_count || F.reviewed };
  if (pulls.length < F.prs) return { ...F, ...live };
  // Walk the opens and closes in time order for the biggest backlog.
  const events = pulls.flatMap((x) => [[x.created_at, 1], ...(x.closed_at ? [[x.closed_at, -1]] : [])] as [string, number][]).sort((a, b) => a[0].localeCompare(b[0]));
  let open = 0, peak = 0, peakDay = "";
  for (const [t, d] of events) if ((open += d) > peak) [peak, peakDay] = [open, t.slice(0, 10)];
  const days = new Map<string, number>();
  for (const x of pulls) days.set(x.created_at.slice(0, 10), (days.get(x.created_at.slice(0, 10)) || 0) + 1);
  return {
    prs: pulls.length,
    merged: pulls.filter((x) => x.merged_at).length,
    open: pulls.filter((x) => !x.closed_at).length,
    authors: new Set(pulls.filter((x) => x.user.type === "User" && x.user.login !== REPO.split("/")[0]).map((x) => x.user.login)).size,
    peak,
    peakDay,
    perDay: [...days].sort((a, b) => a[0].localeCompare(b[0])),
    ...live,
  };
}

// ---- static fallbacks (snapshot of the repo on 2026-10-19, languages on 2026-10-22; /addons falls back to content/themes-readme.md
// and the FAQ to content/readme-faq.md, both 2026-10-22)

export const FALLBACK = {
  tweet: {
    text: "Vibe coded my parents' TV this afternoon!\n\nIt was showing a sponsored ad before you could even get to Netflix.\n\nGave Claude Code the model number, it found the TV on wifi, removed 25 Xiaomi packages and wrote a new launcher.\n\nLooks like an Apple TV now lol",
    likes: 26044,
    replies: 647,
    date: "2026-10-17T08:51:31.000Z",
  } as Tweet,
  // /bot, from the GitHub API on 2026-10-22 ~13:00 UTC (per day: whole days only)
  bot: {
    prs: 768, merged: 526, open: 100, authors: 374, peak: 174, peakDay: "2026-10-21",
    perDay: [["2026-10-18", 70], ["2026-10-19", 136], ["2026-10-20", 251], ["2026-10-21", 243]],
    runs: 222, reviewed: 150,
  } as BotStats,
  stars: 2780,
  forks: 331,
  prCount: 52,
  contributors: 29,
  languages: 24,
  examples: [
    "| `benq-e55-735/` | BenQ E55-735 (Changhong AI PONT, DVB96BQ) | Google TV 14 | Homwee store/help, Anoki ACR, Google TV recommendations; wireless-debugging pairing, setupwraith, deep-standby notes |",
    "| `chiq-ai-pont/` | CHiQ AI PONT (DVB93CQ) | Android TV 11 | Anoki ACR, FAST channels, AI PONT, Homwee services |",
    "| `google-chromecast-gtv-4k/` | Chromecast with Google TV 4K (sabrina) | Google TV 14 | Google telemetry and ad services, ambient mode, launcherx + setupwraith; wireless-debugging pairing, YouTube button remap |",
    "| `hisense-smarttv-4k-ffm/` | Hisense SmartTV 4K FFM (huangshan, MediaTek) | Android TV 10 | ACR (evservice), VIDAA preload, store/hotel mode, OTA; smartsense must stay enabled |",
    "| `insignia-ns55f301na25/` | Insignia 55\" F30 4K Fire TV (NS-55F301NA25, AFTDCT31, duckie) | Fire OS 7 / Android 9 | Amazon ACR telemetry, Fire TV ads/shopping, Alexa, OTA updates; AirPlay and TIF HDMI inputs kept |",
    "| `nvidia-shield-tv-pro-2019/` | NVIDIA SHIELD TV Pro 2019 (P2897, mdarcy) | Android TV 11 | NVIDIA telemetry, GameStream leftovers, sponsored rows, partner auto-installs |",
    "| `oneplus-tv-dubai/` | OnePlus TV (D00, Dubai) | Google TV 14 | HeyTap/OnePlus extras, OnePlus Connect, Smart Home |",
    "| `philips-smart-4k-google-tv/` | Philips Smart 4K TV (Skyworth, eleonas, MediaTek), India | Google TV 14 | Skyworth recommendations, after-sale/activation trackers, iCast; Chromecast, Assistant off by choice; wireless-debugging pairing, setupwraith |",
    "| `rca-ai-pont/` | RCA AI PONT SA (Changhong, redwood, ISDB92RC; also sold as realme 40-inch) | Android 14 | Homwee store and installers, Anoki ACR, FAST channels; 1 GB |",
    "| `sanyo-atv-r2/` | SANYO ATV R2 (SCBC, Realtek RTD285O) | Android TV 9 | S-Channels, E-SHOW demo, Vewd, TV Booster, SANYO OTA |",
    "| `sony-bravia-4k-ur2/` | Sony BRAVIA 4K UR2 (BRAVIA_UR2_4K, MediaTek) | Android TV 10 | Samba TV, Sony promos/Select, demo mode; Assistant, Chromecast, unused streaming apps off by choice |",
    "| `sony-xbr-x900e/` | Sony BRAVIA XBR-65X900E (2017, BRAVIA_ATV2) | Android TV 9 | Samba TV ACR, Sony Select, My BRAVIA promos, Discover, device agents; Chromecast, DLNA, mirroring off by choice |",
    "| `tcl-g10-google-tv/` | TCL 55\" 4K Google TV, 2023 (G10, G10_4K_US_NF) | Google TV 12 | TCL TV+, TCL Live, store demo, smartlink installer |",
    "| `tcl-65c725/` | TCL 65C725 (Smart TV Pro, BeyondTV4) | Android TV 11 | TCL analytics/promos, Google recommendation rows; voice off, OTA off by choice |",
    "| `tcl-ak30a5/` | TCL ak30a5 (China, Amlogic) | Android TV 9 | No Google services, TCL boot ad + analytics, no TvInputManager, installs via USB only; debloat only, third-party launchers cannot be installed on this firmware |",
    "| `tcl-beyondtv/` | TCL BeyondTV (India) | Android TV 9 | TCL analytics, content feed, TCL app store, Google recommendation rows; Jio/Airtel/Hotstar apps untouched |",
    "| `tcl-qm6k-google-tv/` | TCL QM6K Pro, 2025 (G08, MediaTek tcl9618) | Google TV 14 | Samba TV ACR (ttvs), TCL TV+, TCL Live, store/hotel demo; setupwraith must go for a custom launcher (also AU14, #23) |",
    "| `tcl-g05-google-tv/` | TCL Smart TV Pro (G05, G05_4K_US, MediaTek MT5889) | Google TV 11 | TCL Channel, waterfall, ttvs BI, TGuard; Quick Panel off by choice; setupwraith returned after a reboot, launcher half unverified |",
    "| `toshiba-fire-tv-aftha004/` | Toshiba Fire TV (AFTHA004, hazel) | Fire OS 7 / Android 9 | Amazon ACR, metrics, shopping, tutorials, Miracast sink; streaming preloads off by choice; debloat only |",
    "| `xiaomi-mi-box-s/` | Xiaomi Mi Box S (MIBOX4, oneday), streaming box | Android TV 9 | PatchWall, Mi analytics, Alphonso ad tracking, MiLink; voice, casting, phone remote off by choice |",
    "| `xiaomi-mitv-mooq0/` | Xiaomi Mi TV (MiTV-MOOQ0, croods) | Android TV 10 | PatchWall, Mi analytics, MiChannel, TV Manager, Alexa bridge; factory test app also claims HOME; notes from #81 |",
    "| `xiaomi-mi-tv-4a/` | Xiaomi Mi TV 4A (MiTV-MOOQ1) | Android TV 10 | PatchWall, Mi analytics, SmartShare, MiLink |",
    "| `xiaomi-mitv-aesp0/` | Xiaomi MiTV-AESP0 stick (aquaman, 1 GB) | Android TV 9 | No inputs; Home key sends ALL_APPS, needs `HOME_KEY_SERVICE=1`; Chromecast kept |",
    "| `xiaomi-mitv-axso0/` | Xiaomi MiTV-AXSO0 (dangal; Mi TV 4C Pro 2019 / 4A Pro) | Android TV 9 | PatchWall, Glance ads, Mi TV+, Sensara, Mi analytics, MiLink; voice, Chromecast, unused streaming apps off by choice |",
    "| `xiaomi-mitv-moor2/` | Xiaomi MiTV-MOOR2 (venom, MediaTek) | Google TV 11 | Mi ad row and PatchWall, Mi analytics, MiLink, store demo; setup wizard off so a third-party launcher can own Home |",
    "| `xiaomi-tv-a-pro-2026/` | Xiaomi TV A Pro 75\" 2026 (MiTV-MZTU0, river, MediaTek) | Google TV 14 | PatchWall/Mi Home tab, Mi analytics, TV Manager, updaters; setup wizard off, launcherx crash-loop notes |",
  ].join("\n"),
  showcase: [
    { name: "Stremio shelf, peek dock and calendar", what: "A fork of the launcher with a Stremio poster shelf, a dock that peeks over playing content, a frosted settings panel and a calendar overlay", builtOn: "Android TV", by: "benfirad", url: "https://github.com/benfirad/tv-vibehack/tree/feature/stremio-peek-settings-upstream" },
    { name: "Hisense restyle", what: "A six-column restyle with an app menu, a Wi-Fi picker in the header, daily greetings and four glass finishes", builtOn: "Hisense SmartTV 4K FFM, Android 12", by: "YouLop009", url: "https://github.com/YouLop009/tv-vibehack/tree/style-modifications" },
    { name: "webOS launcher", what: "The same Apple TV-style home rebuilt as a webOS web app for LG TVs, installed through LG's Developer Mode, with a Home-button watcher that runs on another device", builtOn: "LG OLED C6, webOS 26", by: "OmkarK97", url: "https://github.com/OmkarK97/tv-vibehack/tree/webos-launcher" },
    { name: "fire-tv-cleanup", what: "A fork aimed at Fire TV: debloat plus a launcher with a macOS-style dock", builtOn: "Fire TV", by: "itsmeterrylin", url: "https://github.com/itsmeterrylin/fire-tv-cleanup" },
    { name: "Fire OS 6 Home watcher", what: "Brings the launcher up over Amazon's home on a Fire TV Stick 4K, since Fire OS won't let it be replaced", builtOn: "Fire TV Stick 4K, Fire OS 6", by: "ljis120301", url: "https://github.com/ljis120301/tv-vibehack/tree/fire-tv-support" },
    { name: "Aurora screensaver and wallpaper", what: "A wallpaper behind the launcher and an \"Aurora Clock\" screensaver with drifting scenes and on-TV screensaver options", builtOn: "Xiaomi MiTV-AXSO0, Android TV 9", by: "rakshajag13", url: "https://github.com/rakshajag13/tv-vibehack/tree/xiaomi-mitv-axso0-debloat-wallpaper" },
    { name: "Control Center", what: "A sleep timer, turn-off button, memory cleaner and sound-output switch behind the Settings pill, on top of a dock editor", builtOn: "Xiaomi MSSP3, Android TV 11", by: "samdegan2311", url: "https://github.com/samdegan2311/tv-vibehack/tree/pr/control-center" },
    { name: "Navigation sounds", what: "The launcher with its own soft click and select sounds, synthesised from a script", builtOn: "BenQ E55-735, Google TV 14", by: "rocavence", url: "https://github.com/rocavence/tv-vibehack/tree/nav-sounds" },
    { name: "AirPlay receiver installer", what: "A script that builds and installs an open-source AirPlay receiver next to the launcher, for iPhone mirroring", builtOn: "Xiaomi MiTV-AESP0, Android TV 9", by: "nguyenduchoai", url: "https://github.com/nguyenduchoai/tv-vibehack/tree/feat/airplay-receiver" },
  ] as ShowcaseItem[],
  themes: [
    { name: "default", what: "The built-in look written out as JSON, as a starting point for your own", image: THEMES_RAW + "default/screenshot.jpg" },
    { name: "aurora", what: "A dark aurora wallpaper (teal and violet on navy, darker at the bottom) with a matching background colour", image: THEMES_RAW + "aurora/screenshot.jpg" },
    { name: "dussehra", what: "Festive skin for Dussehra (ends 21 Oct 2026): a marigold toran, a faint gold rangoli, a diya for Wi-Fi, a bell for Inputs, a marigold for Settings and a petal shower", image: THEMES_RAW + "dussehra/screenshot.jpg" },
    { name: "scenes", what: "14 dark illustrated landscapes in `wallpapers/`, a new one every hour; drawn from code by `tools/scenes_wallpapers.py`", image: THEMES_RAW + "scenes/screenshot.jpg" },
    { name: "six-columns", what: "Six smaller tiles per row and one grid row visible under the dock", image: THEMES_RAW + "six-columns/screenshot.jpg" },
  ] as ThemeItem[],
};
