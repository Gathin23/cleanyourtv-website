// Static site content and small helpers used by the client component.
import type React from "react";

export const ORDER = ["black", "aurora", "paper"] as const;
export type ThemeName = (typeof ORDER)[number];

export const THEMES: Record<ThemeName, Record<string, string>> = {
  black: {
    label: "PITCH BLACK",
    "--bg": "#000000",
    "--page": "#15181e",
    "--panel": "#1e222a",
    "--wall": "none",
    "--ink": "rgba(255,255,255,.95)",
    "--brand": "#cfffcf",
    "--ink-dim": "rgba(255,255,255,.8)",
    "--line": "rgba(255,255,255,.22)",
    "--card": "rgba(255,255,255,.1)",
    "--band": "#1e222a",
    "--band-rim": "rgba(255,255,255,.16)",
    "--pill-bg": "linear-gradient(180deg,rgba(255,255,255,.18),rgba(255,255,255,.08))",
    "--pill-rim": "rgba(255,255,255,.22)",
    "--glass-fill": "linear-gradient(180deg,rgba(255,255,255,.26),rgba(255,255,255,.08))",
    "--glass-rim": "rgba(255,255,255,.8)",
  },
  aurora: {
    label: "AURORA",
    "--bg": "#070A14",
    "--page": "#111626",
    "--panel": "#1a2036",
    "--wall": "url('/themes/aurora/wallpaper.jpg')",
    "--ink": "rgba(255,255,255,.95)",
    "--brand": "#cfffcf",
    "--ink-dim": "rgba(255,255,255,.82)",
    "--line": "rgba(255,255,255,.22)",
    "--card": "rgba(255,255,255,.1)",
    "--band": "rgba(26,32,54,.92)",
    "--band-rim": "rgba(255,255,255,.18)",
    "--pill-bg": "linear-gradient(180deg,rgba(255,255,255,.18),rgba(255,255,255,.08))",
    "--pill-rim": "rgba(255,255,255,.22)",
    "--glass-fill": "linear-gradient(180deg,rgba(255,255,255,.26),rgba(255,255,255,.08))",
    "--glass-rim": "rgba(255,255,255,.8)",
  },
  paper: {
    label: "CREAM PAPER",
    "--bg": "#FDF3DD",
    "--page": "#F7EBD2",
    "--panel": "#FFF8E8",
    "--wall": "none",
    "--ink": "#090E12",
    "--brand": "#1E8A45",
    "--ink-dim": "rgba(9,14,18,.78)",
    "--line": "rgba(9,14,18,.14)",
    "--card": "rgba(9,14,18,.04)",
    "--band": "#F1E4C6",
    "--band-rim": "rgba(9,14,18,.12)",
    "--pill-bg": "rgba(9,14,18,.06)",
    "--pill-rim": "rgba(9,14,18,.18)",
    "--glass-fill": "linear-gradient(180deg,rgba(9,14,18,.10),rgba(9,14,18,.04))",
    "--glass-rim": "rgba(9,14,18,.7)",
  },
};

export const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
export const NAMES = ["BOOT", "THE STORY", "ON AIR", "HOW TO", "BUILT ON IT", "THE COMMUNITY"];
export const TILE_COLORS = ["#D13B3B", "#2256D9", "#1E9E5A", "#6B3FD1", "#C98A1B", "#2A8C9E"];

export type TermLine = [kind: "cmd" | "out" | "note", text: string] | [kind: "img", name: string, src: string, alt: string];

export const TERM: Record<"mac" | "win", TermLine[]> = {
  mac: [
    ["cmd", "adb connect 192.168.1.50:5555"],
    ["out", "connected to 192.168.1.50:5555"],
    ["note", 'Accept "Allow USB debugging?" on the TV.'],
    ["cmd", "adb shell pm list packages > backup/packages.txt"],
    ["out", "backup/  412 packages, settings, getprop, restore.sh"],
    ["img", "before.png", "/docs/stock-home.jpg", "The stock home screen before"],
    ["cmd", "adb shell pm disable-user --user 0 com.vendor.recommendations"],
    ["out", "Package com.vendor.recommendations new state: disabled-user"],
    ["note", "37 more, five at a time, a screenshot after each batch."],
    ["cmd", "./gradlew assembleRelease"],
    ["out", "BUILD SUCCESSFUL in 41s"],
    ["cmd", "adb install -r app/build/outputs/apk/release/app-release.apk"],
    ["out", "Success"],
    ["cmd", "adb exec-out screencap -p > home.png"],
    ["img", "home.png", "/docs/new-home.jpg", "The new launcher after"],
    ["note", "To undo everything: tools/restore.sh backup/debloat.txt"],
  ],
  win: [
    ["cmd", "adb connect 192.168.1.50:5555"],
    ["out", "connected to 192.168.1.50:5555"],
    ["note", 'Accept "Allow USB debugging?" on the TV.'],
    ["cmd", "adb shell pm list packages > backup\\packages.txt"],
    ["out", "backup\\  412 packages, settings, getprop, restore.ps1"],
    ["img", "before.png", "/docs/stock-home.jpg", "The stock home screen before"],
    ["cmd", "adb shell pm disable-user --user 0 com.vendor.recommendations"],
    ["out", "Package com.vendor.recommendations new state: disabled-user"],
    ["note", "37 more, five at a time, a screenshot after each batch."],
    ["cmd", ".\\gradlew.bat assembleRelease"],
    ["out", "BUILD SUCCESSFUL in 41s"],
    ["cmd", "adb install -r app\\build\\outputs\\apk\\release\\app-release.apk"],
    ["out", "Success"],
    ["cmd", "adb shell screencap -p /sdcard/home.png; adb pull /sdcard/home.png"],
    ["img", "home.png", "/docs/new-home.jpg", "The new launcher after"],
    ["note", "To undo everything: powershell -File tools\\restore.ps1 backup\\debloat.txt"],
  ],
};

export const termCost = (l: TermLine) => (l[0] === "cmd" ? l[1].length + 6 : l[0] === "img" ? 16 : 10);
export const TERM_TOTAL = { mac: TERM.mac.reduce((a, l) => a + termCost(l), 0), win: TERM.win.reduce((a, l) => a + termCost(l), 0) };

export function classify(title: string): string {
  const t = title.toLowerCase();
  if (/setupwraith|launcherx|google tv.*(fix|bug|home|crash)|(fix|bug).*google tv/.test(t)) return "gtv";
  if (/example|debloat|tv list|\b(tcl|xiaomi|mi box|sony|bravia|hisense|philips|oneplus|benq|chiq|rca|sanyo|nvidia|shield|toshiba|insignia|chromecast)\b/.test(t)) return "tv";
  if (/launcher|dock|glass|focus|tile|grid|clock|wallpaper|theme|ui\b/.test(t)) return "launcher";
  return "other";
}
export const GROUPS: [string, string][] = [
  ["started", "started it"],
  ["tv", "sent a TV list"],
  ["launcher", "fixed the launcher"],
  ["gtv", "found the Google TV bug"],
  ["other", "made it better"],
  ["built", "built something on it"],
];

/** Turns a CSS declaration string (as written in the design) into a React style object. */
const cache = new Map<string, React.CSSProperties>();
export function S(decl: string): React.CSSProperties {
  const hit = cache.get(decl);
  if (hit) return hit;
  const out: Record<string, string> = {};
  for (const part of decl.split(";")) {
    const i = part.indexOf(":");
    if (i < 0) continue;
    const k = part.slice(0, i).trim();
    let v = part.slice(i + 1).trim();
    if (!k) continue;
    if (k === "font-family") v = v.replace("'VT323',monospace", "var(--font-vt323),'VT323',monospace").replace(/^Outfit,sans-serif/, "var(--font-outfit),Outfit,sans-serif");
    if (k.startsWith("--")) out[k] = v;
    else out[k.replace(/^-webkit-/, "Webkit").replace(/^-moz-/, "Moz").replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = v;
  }
  const obj = out as React.CSSProperties;
  cache.set(decl, obj);
  return obj;
}

export const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** Coverage, in the order the logos show: [logo file in public/press, outlet, article]. The full list is COVERAGE in lib/press.ts. */
export const PRESS: [string, string, string][] = [["techcrunch", "TechCrunch", "https://techcrunch.com/2026/10/19/people-are-using-ai-to-make-their-smart-tvs-dumb-again/"], ["techradar", "TechRadar", "https://www.techradar.com/entertainment/streaming/your-tv-should-do-what-you-paid-for-people-are-vibe-coding-apps-to-banish-ads-from-their-smart-tvs-and-android-tv-and-its-catching-on"], ["tomsguide", "Tom's Guide", "https://www.tomsguide.com/ai/people-are-using-ai-to-turn-their-smart-tvs-into-dumb-tvs-and-you-might-want-to-do-the-same"], ["mashable", "Mashable", "https://mashable.com/tech/smart-tv-ads-claude-code-ai-cleanup"], ["androidauthority", "Android Authority", "https://www.androidauthority.com/android-tv-vibe-hacking-remove-ads-bloatware-3725338/"], ["xda", "XDA", "https://www.xda-developers.com/people-are-now-vibe-coding-their-smart-tvs-to-strip-them-of-ads-and-unwanted-features/"], ["flatpanelshd", "FlatpanelsHD", "https://flatpanelshd.com/news.php?id=1792478262&subaction=showfull"], ["itsfoss", "It's FOSS", "https://itsfoss.com/news/debloat-smart-tv/"], ["phandroid", "Phandroid", "https://phandroid.com/2026/10/20/smart-tv-owners-are-using-ai-to-strip-the-ads-off-their-sets/"], ["gigazine", "GIGAZINE", "https://gigazine.net/gsc_news/en/20261020-smart-tv-no-ads-tool/"], ["xataka", "Xataka", "https://www.xataka.com/televisores/ultima-sensacion-viral-ia-eliminar-anuncios-bloatware-smart-tv-he-tontificado-mi-chromecast-maravilloso"], ["winfuture", "WinFuture", "https://winfuture.de/news,162070.html"], ["frandroid", "Frandroid", "https://www.frandroid.com/android/google-tv/3290159_google-tv-lent-et-envahi-par-les-pubs-le-projet-tv-vibehack-corrige-tout-ca-grace-a-lia-jai-tente-lexperience"], ["macitynet", "Macitynet", "https://www.macitynet.it/rendere-le-tv-meno-smart/"], ["techaeris", "Techaeris", "https://techaeris.com/2026/10/18/android-tv-debloat-tvos-style-makeover/"], ["techpp", "TechPP", "https://techpp.com/2026/10/18/speed-up-android-tv-claude-code/"], ["thedailystar", "The Daily Star", "https://www.thedailystar.net/news/technology/news/smart-tv-owners-are-using-ai-get-rid-ads-report-4303291"], ["detikinet", "detikINET", "https://inet.detik.com/consumer/d-8713172/kesal-tv-xiaomi-banyak-iklan-pria-ini-sulap-jadi-apple-tv-pakai-ai"], ["techtimes", "Tech Times", "https://www.techtimes.co.uk/ai-smart-tv-bloatware-performance-fix-1809233"], ["gadgetreview", "Gadget Review", "https://tech.yahoo.com/ai/meta-ai/articles/developers-using-ai-strip-ads-185856468.html"], ["lesjoiesducode", "Les Joies du Code", "https://lesjoiesducode.fr/retirer-pub-android-tv-claude-code"], ["xboxygen", "Xboxygen", "https://www.xboxygen.com/News/371393-sa-tv-xiaomi-affichait-des-pubs-partout-il-donne-son-modele-a-claude-code-qui-refait-toute-linterface"], ["itavisen", "ITavisen", "https://itavisen.no/2026/10/19/vibekodet-bort-reklame-smart-tv/"], ["pplware", "Pplware", "https://pplware.sapo.pt/inteligencia-artificial/nem-as-smart-tv-escaparam-a-febre-do-vibe-coding-a-televisao-a-medida-de-cada-utilizador/"], ["insmart", "Insmart", "https://insmart.cz/android-tv-bez-reklam-ai-claude-code/"], ["tbreak", "tbreak", "https://tbreak.com/debloat-smart-tv-ai-dumbtv-cleanyourtv/"], ["iphonemod", "iPhoneMod", "https://www.iphonemod.net/clean-your-tv-android-tv-debloat-launcher.html"]];

/** Widths of the logos above (public/press/<slug>.png, all 88 px tall), so a strip can reserve each logo's space before it loads. */
export const PRESS_LOGO_W: Record<string, number> = { techcrunch: 279, techradar: 265, tomsguide: 285, mashable: 243, androidauthority: 377, xda: 163, flatpanelshd: 308, itsfoss: 231, phandroid: 254, gigazine: 254, xataka: 206, winfuture: 256, frandroid: 248, macitynet: 249, techaeris: 243, techpp: 208, thedailystar: 314, detikinet: 246, techtimes: 267, gadgetreview: 329, lesjoiesducode: 366, xboxygen: 248, itavisen: 220, pplware: 219, insmart: 213, tbreak: 194, iphonemod: 267 };

/** Screenshots for Made-with projects, keyed by the author's GitHub login (from their fork or PR). */
export const SHOWCASE_IMAGES: Record<string, string> = {
  youlop009: "/showcase/youlop009.jpg",
  omkark97: "/showcase/omkark97.jpg",
  itsmeterrylin: "/showcase/itsmeterrylin.jpg",
  samdegan2311: "/showcase/samdegan2311.jpg",
  rakshajag13: "/showcase/rakshajag13.jpg",
  benfirad: "/showcase/benfirad.jpg",
  ivantrj: "/showcase/ivantrj.jpg",
  roninriddle: "/showcase/roninriddle.jpg",
  eddysangalli: "/showcase/eddysangalli.jpg",
  majnioui: "/showcase/majnioui.jpg",
  alafazam: "/showcase/alafazam.jpg",
  griffincockfoster56: "/showcase/griffincockfoster56.jpg",
  egyjs: "/showcase/egyjs.jpg",
  itsmevizz: "/showcase/itsmevizz.jpg",
  glidiandev: "/showcase/glidiandev.jpg",
  oliverjwroberts: "/showcase/oliverjwroberts.jpg",
  thayford: "/showcase/thayford.jpg",
  jolan94: "/showcase/jolan94.jpg",
  gethari: "/showcase/gethari.jpg",
  hoangtran0410: "/showcase/hoangtran0410.jpg",
  faustinoaq: "/showcase/faustinoaq.jpg",
  "0x006e": "/showcase/0x006e.jpg",
  sethihq: "/showcase/sethihq.jpg",
  ashfaqhaq: "/showcase/ashfaqhaq-widgetv.jpg",
};

/**
 * Site images (wall photos, showcase shots, press logos, blog figures) are served from jsDelivr's free
 * mirror of this public repo instead of Vercel, so a traffic spike does not use up the CDN-request quota.
 * Pages, scripts and Open Graph images still come from Vercel.
 */
export const CDN_BASE = "https://cdn.jsdelivr.net/gh/Gathin23/cleanyourtv-website@main/public";
export const cdn = (path: string): string => (path && path.startsWith("/") ? CDN_BASE + path : path);
/** The On air wall's small copy of a photo: public/results/thumbs/, 320x180, centre-cropped. */
export const thumb = (path: string): string => path.replace(/^\/results\//, "/results/thumbs/");
/** The same mirror of the cleanyourtv repo itself, for images that live there (theme screenshots, docs/). */
export const repoCdn = (path: string): string => `https://cdn.jsdelivr.net/gh/Gathin23/cleanyourtv@main/${path}`;

/**
 * /addons: real TV screenshots in the cleanyourtv repo that show a theme key at work, keyed by the key.
 * The keys themselves come from themes/README.md; this only pairs some of them with a picture.
 */
export const SWITCH_IMAGES: Record<string, string> = {
  sky_intensity: "docs/sky-sunset.jpg",
  home_idle_clock_minutes: "docs/clock-screensaver.png",
  settings_key_panel: "docs/quick-settings-panel.jpg",
  columns: "themes/six-columns/screenshot.jpg",
  festival: "themes/dussehra/screenshot.jpg",
  wallpaper_rotation_minutes: "themes/scenes/screenshot.jpg",
};
