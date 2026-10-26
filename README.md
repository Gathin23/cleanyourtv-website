# cleanyour.tv

The website for [cleanyourtv](https://github.com/Gathin23/cleanyourtv), formerly tv-vibehack: debloat any Android TV or Google TV over Wi-Fi and swap the ad-filled home screen for a clean launcher.

The site is "On air": a black set, a test-pattern stripe and channel labels. Every page is a channel.

| Channel | Page | What is on |
|---|---|---|
| 00 | `/` | Does it work on my TV? (search and brand chips), the four buttons, the live numbers from GitHub, set-up in three steps with the prompt to copy, Not Android, the On air wall (`content/results.json`), Is it safe |
| 02 | `/privacy` | Privacy steps for TVs that are not Android (`PRIVACY_PATH` in `lib/site.ts`) |
| 05 | `/press` | Every article and video (`lib/press.ts`, `lib/videos.ts`) |
| 06 | `/addons` | Themes, settings and add-ons from the repo |
| 07 | `/bot` | maintainer-bot, the pull-request reviewer |
| 08 | `/app/android` | The community-built phone app |
| 09 | `/tvs` | Every tested model, searchable (`/tvs?q=sony`) |
| 10 | `/faq` | The README's questions |

## Run it

```sh
npm install
npm run dev
```

Content comes from the cleanyourtv repo and the GitHub API at build time. Every value has a static fallback, so the site builds without network access and never depends on the public GitHub rate limit.

Optional: set `GITHUB_TOKEN` in the environment (never in a file) to raise the API rate limit; /bot's per-day pull-request counts need it.

## Deploy

The site is a fully static export (`output: "export"`): `npm run build` writes plain files to `out/`, and nothing runs on a server. `.github/workflows/deploy-cloudflare.yml` builds it and runs `wrangler deploy` on every push to `main` and once an hour, so the stars, the wall and the credits stay current. `wrangler.jsonc` serves `out/` as the static assets of the `cleanyourtv` Worker, with no Worker script. Response headers and the `/app` redirect are in `public/_headers` and `public/_redirects`, which Cloudflare reads from `out/`.

To preview the export locally with Cloudflare's own asset rules: `npm run build && npx wrangler dev`.

## Add a result screen

`content/results.json` is a list of `{ handle, quote, image, link, tv }`. Put the screenshot in `public/results/` and point `image` at it (`/results/name.png`). Keep the quote to one line, in the person's own words, with `link` going to their original post.

The home page shows the first four photos; "See the whole wall" loads the rest from `/wall.json` and shows a small copy from `public/results/thumbs/` (same file name, 320x180, centre-cropped), so every photo needs one. To make one on a Mac: `sips -Z 320 public/results/name.jpg --out public/results/thumbs/name.jpg` is close enough; a Pillow `ImageOps.fit(img, (320, 180))` at quality 70 is what the existing ones use.

## Layout

- `app/` the pages, each with its own CSS next to it; `app/layout.tsx` the fonts (Space Grotesk, IBM Plex Sans and Mono, VT323, Fredoka via `next/font`), the header and the footer; `app/globals.css` the shared design system
- `components/Header.tsx` the nav, and the channel guide behind the menu button on phones; `components/Footer.tsx`
- `lib/parse.ts` parsers shared by server and client; `lib/data.ts` the server loader with fallbacks; `lib/site.ts` the nav, shared links and image mirrors; `lib/checker.ts` where a "Does it work on my TV?" search goes
- `design/on-air/` the Claude Design artboards the pages follow (desktop and phone each); `design/cleanyour.tv.dc.html` the television the site was before
- `public/docs/` the tweet card and the before/after screenshots

MIT, like the main repo.
