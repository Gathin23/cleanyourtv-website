# Working in this repo

- Public repo. Nothing private goes in: no tokens, no device identifiers, no personal addresses. `GITHUB_TOKEN` comes from the deploy workflow's secrets, never a file.
- Commits are the owner's own. Never add a `Co-Authored-By` trailer or any generated-with line to commits or pull requests.
- The site is a port of `design/cleanyour.tv.dc.html`. When changing a channel, keep the design file as the reference for layout and motion; do not edit it to match the code.
- `components/TvSite.tsx` is deliberately one class component mirroring the prototype's `Component` class, with inline styles through `S()` from `lib/site.ts`. Keep it that way rather than splitting into hooks; the animation state lives on the instance.
- Content is fetched at build time in `lib/data.ts` with a static fallback for every value; the deploy workflow rebuilds hourly. Any new remote value needs a fallback too, so `npm run build` works offline.
- Sound is off by default and stays that way. Reduced motion must keep every channel readable.
- The fake clutter home on channel 00 uses invented app names only. No real brand logos or names there.
- `npm run build` must pass before a commit. The site is a static export (`output: "export"`, hosted on Cloudflare Pages): no `revalidate`, no `next.config` headers or redirects (use `public/_headers` and `public/_redirects`), no request-time APIs. Route handlers and metadata routes need `export const dynamic = "force-static"`.
