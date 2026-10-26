// "Does it work on my TV?": where a typed brand or model goes, and the answers behind the brand chips.
// Client-safe (no Node imports): the home hero and the phone menu both use it.
import { PRIVACY_PATH } from "./site";

// Systems with no ADB, so nothing to switch off from outside: their owners get the privacy guide.
const NOT_ANDROID = /\b(samsung|tizen|lg|webos|roku|vizio|smartcast|vidaa|titan ?os|saphi|my home screen|firefox ?os)\b/i;

/** The page a search goes to: the privacy guide for TVs that are not Android, otherwise the TV list, searched. */
export function routeFor(query: string): string {
  const q = query.trim();
  if (!q) return "/tvs";
  if (NOT_ANDROID.test(q)) return PRIVACY_PATH;
  return `/tvs?q=${encodeURIComponent(q)}`;
}

export type Tone = "yes" | "maybe" | "no";

/** A brand chip: its dot (an Android brand or not), the answer it gives, and where that answer leads. */
export type BrandAnswer = { id: string; label: string; android: boolean; tone: Tone; body: string; cta: string; href: string };

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
      body: "Samsung TVs run Tizen, so CleanYourTV can't run on them. The privacy guide still turns off most tracking.",
      cta: "Fix my Samsung privacy", href: PRIVACY_PATH,
    },
    {
      id: "lg", label: "LG", android: false, tone: "no",
      body: "LG TVs run webOS, so CleanYourTV can't run on them. The privacy guide covers LG step by step.",
      cta: "Fix my LG privacy", href: PRIVACY_PATH,
    },
    {
      id: "roku", label: "Roku", android: false, tone: "no",
      body: "Roku runs its own system, not Android. You can still limit ad tracking in its settings.",
      cta: "Fix my Roku privacy", href: PRIVACY_PATH,
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
