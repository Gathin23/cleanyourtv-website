// Site-wide constants: the nav, the links every page shares, and the image mirrors.

/** Where "Privacy guide" and every Samsung, LG and Roku answer points. The old /privacy redirects here (public/_redirects). */
export const PRIVACY_PATH = "/not-android";
/**
 * Whether the privacy guide is linked. While false it is "coming tonight": no nav, menu or footer link, and every
 * Samsung, LG and Roku answer says so instead of linking.
 */
export const PRIVACY_LIVE = true;
export const PRIVACY_SOON = "A no-root privacy guide for Samsung, LG and Roku is coming tonight.";

export const COFFEE = "https://buymeacoffee.com/gathint";
/** The day the repo went public, for "On air since". */
export const ON_AIR_SINCE = "2026-10-17";
/** Trendshift's weekly chart: #1 repo for 19 to 25 Oct 2026 (the badge is docs/trending-badge.png in the repo). */
export const TRENDSHIFT = { rank: 1, week: "Oct 19–25", url: "https://trendshift.io/repositories/310225" };

/** The channel guide: the phone menu lists every channel; the desktop bar and the footer pick from it. */
export const CHANNELS: { ch: string; label: string; href: string }[] = [
  { ch: "01", label: "Set up", href: "/#setup" },
  ...(PRIVACY_LIVE ? [{ ch: "02", label: "Privacy guide", href: PRIVACY_PATH }] : []),
  { ch: "05", label: "Press", href: "/press" },
  { ch: "06", label: "Add-ons", href: "/addons" },
  { ch: "07", label: "PR bot", href: "/bot" },
  { ch: "08", label: "Android app", href: "/app/android" },
  { ch: "09", label: "TV list", href: "/tvs" },
  { ch: "10", label: "FAQ", href: "/faq" },
];

/** 36512 -> "36.5k", for the GitHub pill. */
export const shortCount = (n: number) => (n >= 1000 ? `${(Math.floor(n / 100) / 10).toFixed(1).replace(/\.0$/, "")}k` : String(n));
/** 36512 -> "36,500+", 4312 -> "4,300+", 437 -> "430+": rounded down, for the stats band. */
export function roundedCount(n: number): string {
  if (n < 100) return String(n);
  const len = String(Math.floor(n)).length;
  const step = 10 ** (len - (len >= 5 ? 3 : 2));
  return `${(Math.floor(n / step) * step).toLocaleString("en-US")}+`;
}

/** Coverage, in the order the logos show: [logo file in public/press, outlet, article]. The full list is COVERAGE in lib/press.ts. */
export const PRESS: [string, string, string][] = [["techcrunch", "TechCrunch", "https://techcrunch.com/2026/10/19/people-are-using-ai-to-make-their-smart-tvs-dumb-again/"], ["techradar", "TechRadar", "https://www.techradar.com/entertainment/streaming/your-tv-should-do-what-you-paid-for-people-are-vibe-coding-apps-to-banish-ads-from-their-smart-tvs-and-android-tv-and-its-catching-on"], ["tomsguide", "Tom's Guide", "https://www.tomsguide.com/ai/people-are-using-ai-to-turn-their-smart-tvs-into-dumb-tvs-and-you-might-want-to-do-the-same"], ["mashable", "Mashable", "https://mashable.com/tech/smart-tv-ads-claude-code-ai-cleanup"], ["androidauthority", "Android Authority", "https://www.androidauthority.com/android-tv-vibe-hacking-remove-ads-bloatware-3725338/"], ["xda", "XDA", "https://www.xda-developers.com/people-are-now-vibe-coding-their-smart-tvs-to-strip-them-of-ads-and-unwanted-features/"], ["flatpanelshd", "FlatpanelsHD", "https://flatpanelshd.com/news.php?id=1792478262&subaction=showfull"], ["itsfoss", "It's FOSS", "https://itsfoss.com/news/debloat-smart-tv/"], ["phandroid", "Phandroid", "https://phandroid.com/2026/10/20/smart-tv-owners-are-using-ai-to-strip-the-ads-off-their-sets/"], ["gigazine", "GIGAZINE", "https://gigazine.net/gsc_news/en/20261020-smart-tv-no-ads-tool/"], ["xataka", "Xataka", "https://www.xataka.com/televisores/ultima-sensacion-viral-ia-eliminar-anuncios-bloatware-smart-tv-he-tontificado-mi-chromecast-maravilloso"], ["winfuture", "WinFuture", "https://winfuture.de/news,162070.html"], ["frandroid", "Frandroid", "https://www.frandroid.com/android/google-tv/3290159_google-tv-lent-et-envahi-par-les-pubs-le-projet-tv-vibehack-corrige-tout-ca-grace-a-lia-jai-tente-lexperience"], ["macitynet", "Macitynet", "https://www.macitynet.it/rendere-le-tv-meno-smart/"], ["techaeris", "Techaeris", "https://techaeris.com/2026/10/18/android-tv-debloat-tvos-style-makeover/"], ["techpp", "TechPP", "https://techpp.com/2026/10/18/speed-up-android-tv-claude-code/"], ["thedailystar", "The Daily Star", "https://www.thedailystar.net/news/technology/news/smart-tv-owners-are-using-ai-get-rid-ads-report-4303291"], ["detikinet", "detikINET", "https://inet.detik.com/consumer/d-8713172/kesal-tv-xiaomi-banyak-iklan-pria-ini-sulap-jadi-apple-tv-pakai-ai"], ["techtimes", "Tech Times", "https://www.techtimes.co.uk/ai-smart-tv-bloatware-performance-fix-1809233"], ["gadgetreview", "Gadget Review", "https://tech.yahoo.com/ai/meta-ai/articles/developers-using-ai-strip-ads-185856468.html"], ["lesjoiesducode", "Les Joies du Code", "https://lesjoiesducode.fr/retirer-pub-android-tv-claude-code"], ["xboxygen", "Xboxygen", "https://www.xboxygen.com/News/371393-sa-tv-xiaomi-affichait-des-pubs-partout-il-donne-son-modele-a-claude-code-qui-refait-toute-linterface"], ["itavisen", "ITavisen", "https://itavisen.no/2026/10/19/vibekodet-bort-reklame-smart-tv/"], ["pplware", "Pplware", "https://pplware.sapo.pt/inteligencia-artificial/nem-as-smart-tv-escaparam-a-febre-do-vibe-coding-a-televisao-a-medida-de-cada-utilizador/"], ["insmart", "Insmart", "https://insmart.cz/android-tv-bez-reklam-ai-claude-code/"], ["tbreak", "tbreak", "https://tbreak.com/debloat-smart-tv-ai-dumbtv-cleanyourtv/"], ["iphonemod", "iPhoneMod", "https://www.iphonemod.net/clean-your-tv-android-tv-debloat-launcher.html"]];

/** Widths of the logos above (public/press/<slug>.png, all 88 px tall), so a strip can reserve each logo's space before it loads. */
export const PRESS_LOGO_W: Record<string, number> = { techcrunch: 279, techradar: 265, tomsguide: 285, mashable: 243, androidauthority: 377, xda: 163, flatpanelshd: 308, itsfoss: 231, phandroid: 254, gigazine: 254, xataka: 206, winfuture: 256, frandroid: 248, macitynet: 249, techaeris: 243, techpp: 208, thedailystar: 314, detikinet: 246, techtimes: 267, gadgetreview: 329, lesjoiesducode: 366, xboxygen: 248, itavisen: 220, pplware: 219, insmart: 213, tbreak: 194, iphonemod: 267 };

/**
 * Site images (wall photos, showcase shots, press logos, blog figures) are served from jsDelivr's free
 * mirror of this public repo instead of the site's own host, so a traffic spike stays off it.
 * Pages, scripts and Open Graph images come from Cloudflare.
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
// The fallback for docs/switches.md, which lists them in the repo; the site reads that file first.
export const SWITCH_IMAGES: Record<string, string> = {
  sky_intensity: "docs/sky-sunset.jpg",
  home_idle_clock_minutes: "docs/clock-screensaver.png",
  settings_key_panel: "docs/quick-settings-panel.jpg",
  columns: "themes/six-columns/screenshot.jpg",
  festival: "themes/dussehra/screenshot.jpg",
  wallpaper_rotation_minutes: "themes/scenes/screenshot.jpg",
};
