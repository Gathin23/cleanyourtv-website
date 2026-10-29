/**
 * The Halloween look (29 Oct to 1 Nov 2026). One switch: false gives today's site back exactly. After 1 Nov set it to
 * false, or revert the commit that added it. Everything themed hangs off this constant:
 *   lib/halloween.ts, components/Hw*.tsx and app/halloween-home.css, plus a small `HALLOWEEN &&` in
 *   app/page.tsx, components/Header.tsx, Footer.tsx, Logo.tsx and BeforeAfter.tsx.
 */
export const HALLOWEEN = true;
