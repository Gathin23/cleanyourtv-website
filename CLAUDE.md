# Working in this repo

- Public repo. Nothing private goes in: no tokens, no device identifiers, no personal addresses. `GITHUB_TOKEN` comes from the deploy workflow's secrets, never a file.
- Commits are the owner's own. Never add a `Co-Authored-By` trailer or any generated-with line to commits or pull requests.
- The pages follow the artboards in `design/on-air/` (desktop and phone for each page, plus the phone menu). Keep them as the reference for layout and copy; do not edit them to match the code.
- Styles are classes, not inline style objects: the shared design system in `app/globals.css`, each page's own layout in a CSS file next to its `page.tsx`. Inline styles land in the HTML twice (markup and RSC payload), so they cost page weight.
- Links to the privacy guide use `PRIVACY_PATH` from `lib/site.ts`, never a literal path.
- Content is fetched at build time in `lib/data.ts` with a static fallback for every value; the deploy workflow rebuilds hourly. Any new remote value needs a fallback too, so `npm run build` works offline.
- The drawn before/after home in the hero uses no app names or logos.
- `npm run build` must pass before a commit. The site is a static export (`output: "export"`, served as Cloudflare Workers static assets, see `wrangler.jsonc`): no `revalidate`, no `next.config` headers or redirects (use `public/_headers` and `public/_redirects`), no request-time APIs. Route handlers and metadata routes need `export const dynamic = "force-static"`.
