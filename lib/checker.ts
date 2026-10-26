// "Does it work on my TV?": where a typed brand or model goes, and the answers behind the brand chips.
// Client-safe (no Node imports): the home hero and the phone menu both use it.
import { PRIVACY_LIVE, PRIVACY_PATH, PRIVACY_SOON } from "./site";

// Systems with no ADB, so nothing to switch off from outside: their owners get the privacy guide.
const NOT_ANDROID = /\b(samsung|tizen|lg|webos|roku|vizio|smartcast|vidaa|titan ?os|saphi|my home screen|firefox ?os)\b/i;

const NAMES: Record<string, string> = { samsung: "Samsung", tizen: "Tizen", lg: "LG", webos: "webOS", roku: "Roku", vizio: "Vizio", smartcast: "SmartCast", vidaa: "Hisense VIDAA", saphi: "Saphi", myhomescreen: "Panasonic My Home Screen" };

/** "Samsung" for "samsung qn90": the system or brand in a search that is not Android, or null. */
export function notAndroid(query: string): string | null {
  const m = NOT_ANDROID.exec(query);
  if (!m) return null;
  const k = m[1].toLowerCase().replace(/\s+/g, "");
  return NAMES[k] ?? (k.startsWith("titan") ? "Titan OS" : k.startsWith("firefox") ? "Firefox OS" : m[1]);
}

// The privacy guide's own tab for each system (#samsung opens its steps); the rest land on the brand picker.
const GUIDE_TAB: Record<string, string> = { samsung: "samsung", tizen: "samsung", lg: "lg", webos: "lg", roku: "roku", vizio: "vizio", smartcast: "vizio", vidaa: "hisense" };

/** The privacy guide, opened on the steps for the TV in a search when it has some. */
export function privacyHref(query: string): string {
  const m = NOT_ANDROID.exec(query);
  const tab = m ? GUIDE_TAB[m[1].toLowerCase()] : undefined;
  return tab ? `${PRIVACY_PATH}#${tab}` : PRIVACY_PATH;
}

/** The page a search goes to: the privacy guide for TVs that are not Android (while it is live), otherwise the TV list, searched. */
export function routeFor(query: string): string {
  const q = query.trim();
  if (!q) return "/tvs";
  if (PRIVACY_LIVE && NOT_ANDROID.test(q)) return privacyHref(q);
  return `/tvs?q=${encodeURIComponent(q)}`;
}

export type Tone = "yes" | "maybe" | "no";

/** A brand chip: its dot (an Android brand or not), the answer it gives, and where that answer leads. */
export type BrandAnswer = { id: string; label: string; android: boolean; tone: Tone; body: string; cta: string; href: string | null };

/** The chips' answers. `counts` is tested models per brand (lowercase), from the TV list; `total` is every tested model. */
export function brandAnswers(counts: Record<string, number>, total: number): BrandAnswer[] {
  const tested = (b: string) => (counts[b] ? ` ${counts[b]} ${counts[b] === 1 ? "model has" : "models have"} a tested list.` : "");
  return [
    {
      id: "sony", label: "Sony", android: true, tone: "yes",
      body: `Sony TVs run Google TV or Android TV.${tested("sony")}`,
      cta: "See tested Sony models", href: "/tvs?q=sony",
    },
    {
      id: "philips", label: "Philips", android: true, tone: "maybe",
      body: `Most Philips TVs run Google TV or Android TV. If yours runs Titan OS or Saphi, it is not Android.${tested("philips")}`,
      cta: "Check your Philips model", href: "/tvs?q=philips",
    },
    {
      id: "tcl", label: "TCL", android: true, tone: "maybe",
      body: `TCL sells Google TV and Roku TV sets. If your home screen says Google TV or Android TV, it works.${tested("tcl")}`,
      cta: "Check your TCL model", href: "/tvs?q=tcl",
    },
    {
      id: "samsung", label: "Samsung", android: false, tone: "no",
      body: `Samsung TVs run Tizen, so CleanYourTV can't run on them. ${PRIVACY_LIVE ? "The privacy guide still turns off most tracking." : PRIVACY_SOON}`,
      cta: "Fix my Samsung privacy", href: PRIVACY_LIVE ? `${PRIVACY_PATH}#samsung` : null,
    },
    {
      id: "lg", label: "LG", android: false, tone: "no",
      body: `LG TVs run webOS, so CleanYourTV can't run on them. ${PRIVACY_LIVE ? "The privacy guide covers LG step by step." : PRIVACY_SOON}`,
      cta: "Fix my LG privacy", href: PRIVACY_LIVE ? `${PRIVACY_PATH}#lg` : null,
    },
    {
      id: "roku", label: "Roku", android: false, tone: "no",
      body: `Roku runs its own system, not Android. ${PRIVACY_LIVE ? "You can still limit ad tracking in its settings." : PRIVACY_SOON}`,
      cta: "Fix my Roku privacy", href: PRIVACY_LIVE ? `${PRIVACY_PATH}#roku` : null,
    },
    {
      id: "other", label: "Other", android: true, tone: "maybe",
      body: `Search all ${total} tested models. If it runs Google TV or Android TV, it should work.`,
      cta: "Browse the TV list", href: "/tvs",
    },
  ];
}

export const TONE_LABEL: Record<Tone, string> = {
  yes: "Works on this TV",
  maybe: "Depends on the model",
  no: "Not Android · not supported",
};
