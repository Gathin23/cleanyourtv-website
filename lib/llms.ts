// /llms.txt (llmstxt.org) and /llms-full.txt, written from the live counts and the README.
import { GH } from "./parse";
import type { Facts } from "./data";
import { SITE } from "./seo";
import { COVERAGE_COUNTRIES, COVERAGE_TOTAL } from "./press";
import { VIDEOS } from "./videos";

const BLOB = `${GH}/blob/main`;

export function llmsText(f: Facts): string {
  // Brands with one model are left out by name: their names are parsed from the TV's full name and can be cut short.
  const named = f.brands.filter(([, n]) => n > 1);
  const rest = f.brands.length - named.length;
  return `# CleanYourTV

> An open-source prompt and tested lists that remove the ads and bloat from Android TV and Google TV over ADB, plus a small Apple TV-style launcher. No root, nothing uninstalled, one line restores it.

CleanYourTV is free and MIT licensed. You paste one markdown prompt into a coding assistant with shell access (Claude Code, Codex or Gemini CLI); it finds the TV on your Wi-Fi, backs it up, disables the manufacturer's ad and telemetry packages, and installs the launcher. The repo has tested debloat lists for ${f.tvs} TV models from ${f.brands.length} brands, and the launcher is translated into ${f.languages} languages.

## Supported TVs

- Android TV and Google TV: the debloat and the launcher. The launcher needs Android 8.0 (API 26) or newer.
- Fire TV: the debloat only. Fire OS will not hand Home to a third-party launcher.
- A few China-market TCL sets refuse to install any launcher; their lists say so.
- Samsung (Tizen) and LG (webOS): not supported, since they are not Android. A community port for rooted LG webOS TVs lives at https://github.com/lasharor/cleanyourtv-WebOS.
- Tested brands: ${named.map(([b, n]) => `${b} (${n})`).join(", ")}${rest ? `, and ${rest} more with one model each` : ""}. The full list is ${GH}/tree/main/examples.

## How it works

- Turn on USB debugging (and Network or ADB debugging, if shown) in the TV's developer options, and allow your computer once.
- The assistant backs up the installed packages and settings first.
- It disables packages with \`pm disable-user\`. Nothing is ever uninstalled, so every step can be undone.
- It builds and installs the launcher (small, plain Java, no network permission) and makes it the home screen.
- \`tools/restore.sh\` undoes everything in one line. The TV's own Settings → Apps page can also re-enable packages.

## Links

- [GitHub repository](${GH}): the prompt, the lists, the launcher and the scripts
- [README](${BLOB}/README.md): the full guide, including the FAQ
- [PROMPT.md](${BLOB}/PROMPT.md): the prompt to paste into a coding assistant
- [SHOWCASE.md](${BLOB}/SHOWCASE.md): launchers, forks, add-ons and ports people built on top
- [PRESS.md](${BLOB}/docs/PRESS.md): every article written about it, and the videos
- [Questions people ask](${SITE}/faq): is it safe, firmware updates, ADB security and more
- [Non-Android TVs: stop your TV tracking you](${SITE}/not-android): no-root privacy steps for Samsung, LG, Roku, Vizio, Hisense VIDAA and other smart TVs
- [Add-ons, themes and settings](${SITE}/addons): optional extras for the launcher
- [Press](${SITE}/press): the press coverage: ${COVERAGE_TOTAL} articles, with outlets in ${COVERAGE_COUNTRIES} countries, and ${VIDEOS.length} YouTube videos
- [maintainer-bot](${SITE}/bot): the open-source bot that reviews every pull request, how it decides and how well; it runs on 0G Private Computer
- [Clean Your TV app for Android phones](${SITE}/app/android): a community-built phone app that does the same clean-up from an Android phone over Wi-Fi, with no computer or coding agent

## Optional

- [(Re)introducing CleanYourTV](${SITE}/blog/reintroducing-cleanyourtv): the launch story, 20 October 2026
- [Android app privacy policy](${SITE}/app/android/privacy): the phone app collects no data: no accounts, analytics, advertising or crash reporting, and no server of its own
- [llms-full.txt](${SITE}/llms-full.txt): this file followed by the whole README
`;
}

/** llms.txt, then the README with its badge header dropped and relative links made absolute. Without the README, the FAQ. */
export function llmsFullText(f: Facts): string {
  const head = llmsText(f);
  if (!f.readme) return `${head}\n## Questions people ask\n\n${f.faq.map((x) => `### ${x.q}\n\n${x.a}\n`).join("\n")}`;
  const body = f.readme
    .replace(/^(?:<p align="center">[\s\S]*?<\/p>\s*)+/, "")
    .replace(/\]\((?!https?:|#|mailto:)([^)\s]+)\)/g, (_, p: string) => `](${BLOB}/${p.replace(/^\.\//, "")})`);
  return `${head}\n---\n\n# README.md\n\nSource: ${BLOB}/README.md\n\n${body.trim()}\n`;
}
