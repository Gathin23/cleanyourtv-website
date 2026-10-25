# cleanyour.tv

The website for [cleanyourtv](https://github.com/Gathin23/cleanyourtv), formerly tv-vibehack: debloat any Android TV or Google TV over Wi-Fi and swap the ad-filled home screen for a clean launcher.

The whole site is one old television. Six channels, a remote in the corner, static between channels, and a power button that actually turns it off.

| Channel | What is on |
|---|---|
| 00 Boot | The stock home screen, the clean-up, then the launcher with live stars, forks and contributors |
| 01 The story | The tweet that started it and a 48-hour star oscilloscope |
| 02 On air | A big screen that cycles through the photos from people who ran it, beside a wall of every one (`content/results.json`) |
| 03 How to | Three-step wizard, copy-the-prompt button, a terminal that types itself |
| 04 The community | The credits roll: everyone whose pull request was merged, from the GitHub API |
| 05 Made with | Showcase projects from `SHOWCASE.md` and the themes from `themes/` |

Keys: `0`–`5` change channel, arrows move, `Enter` is OK, `I` switches the site theme, `M` toggles sound, `P` is power. The Konami code does something too.

## Run it

```sh
npm install
npm run dev
```

Content comes from the cleanyourtv repo and the GitHub API at build time. Every value has a static fallback, so the site builds without network access and never depends on the public GitHub rate limit.

Optional: set `GITHUB_TOKEN` in the environment (never in a file) to raise the API rate limit and turn on the real star history behind the oscilloscope. Without it the chart draws a placeholder curve.

## Deploy

The site is a fully static export (`output: "export"`): `npm run build` writes plain files to `out/`, and nothing runs on a server. `.github/workflows/deploy-cloudflare.yml` builds it and runs `wrangler deploy` on every push to `main` and once an hour, so the stars, the wall and the credits stay current. `wrangler.jsonc` serves `out/` as the static assets of the `cleanyourtv` Worker, with no Worker script. Response headers and the `/app` redirect are in `public/_headers` and `public/_redirects`, which Cloudflare reads from `out/`.

To preview the export locally with Cloudflare's own asset rules: `npm run build && npx wrangler dev`.

## Add a result screen

`content/results.json` is a list of `{ handle, quote, image, link, tv }`. Put the screenshot in `public/results/` and point `image` at it (`/results/name.png`). Keep the quote to one line, in the person's own words, with `link` going to their original post.

The wall shows a small copy from `public/results/thumbs/` (same file name, 320x180, centre-cropped) and falls back to the full photo if there is none. To make one on a Mac: `sips -Z 320 public/results/name.jpg --out public/results/thumbs/name.jpg` is close enough; a Pillow `ImageOps.fit(img, (320, 180))` at quality 70 is what the existing ones use.

## Layout

- `app/` page, layout, fonts (Outfit and VT323 via `next/font`), global CSS
- `components/TvSite.tsx` the television: one client component holding all channels, the remote and the effects
- `lib/parse.ts` parsers shared by server and client; `lib/data.ts` the server loader with fallbacks; `lib/site.ts` static copy and helpers
- `design/` the Claude Design prototype this was ported from
- `public/docs/` the tweet card and the before/after screenshots; `public/themes/aurora/` the wallpaper

MIT, like the main repo.
