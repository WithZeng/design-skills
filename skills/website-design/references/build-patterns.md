# Build patterns

## Tokens

Define site colours once as Tailwind v4 tokens and use only them in page code:

```css
@theme inline {
  --color-site: #0a0a0a;          /* page background */
  --color-site-panel: #121212;    /* panel fill */
  --color-site-raised: #1a1a1a;
  --color-site-line: #262626;     /* panel border */
  --color-site-line-strong: #3a3a3a;
  --color-site-fg: #fafafa;
  --color-site-muted: #a3a3a3;
  --color-site-faint: #8a8a8a;    /* lowest text tone that still passes 4.5:1 on panel */
  --color-site-paper: #ffffff;    /* white pills/buttons */
  --color-site-ink: #0a0a0a;      /* text on paper */
}
```

If the app also has a light theme, scope the site look with a wrapper class (`.site-theme`) that overrides the component library variables, plus `html:has(.site-theme) body { background: ... }` so overscroll matches.

## Shared primitives

Build these once, then compose every page from them:

- `SitePage` (header, footer, scroll progress, back-to-top, `overflow-x-clip` root)
- `SiteContainer`, `SiteHero`, `SiteSection` (title + reveal), `SitePill`, `SiteCta`
- `SpotlightPanel` (the one panel module, with cursor spotlight on hover)
- `RevealTitle`, `CountUp`, `SlideTabs`, `ArticleToc`
- one `AppWindow` mock reused by every product screenshot section

Keep files under the repo's max-lines limit by splitting mock UIs (`hero-window`, `panel-ui`, `cloud-ui`, ...).

## Component sources: install

All of these install as source through the shadcn CLI, so they use the project's `components.json` aliases and tokens. Run from the app directory; review the diff and re-token hard-coded colours before committing.

| Source | Command (from the component's docs page) | Lands in |
| --- | --- | --- |
| Magic UI | `npx shadcn@latest add @magicui/border-beam` | `components/magicui/` (set the path when prompted) |
| AI Elements | `npx ai-elements@latest add tool` or `npx shadcn@latest add @ai-elements/tool` | `components/ai-elements/` |
| Aceternity UI | `npx shadcn@latest add @aceternity/3d-card` | `components/ui/` (check the licence first) |
| 21st.dev | copy the `npx shadcn@latest add "https://21st.dev/r/…"` command shown on the component page | `components/ui/` |

- If the CLI can't run, copy the source by hand: rewrite the `cn` import to the project's utils path and add the keyframes it needs (marquee, orbit, shine) to `@theme`.
- Delete components you end up not using. Proven Magic UI set: animated-beam, animated-list, border-beam, marquee, orbiting-circles, blur-fade, scroll-progress, number-ticker, animated-shiny-text.
- Components that animate with Motion must use the project's import (`motion/react`, `m.*` under `LazyMotion`); rewrite them if they import `framer-motion`.

## Motion basics

- Setup: `LazyMotion features={domAnimation}` once at the root and `m.div` etc. in components (smaller bundle); `<MotionConfig reducedMotion="user">` around pages.
- Tokens: keep durations and easings in one file (e.g. `fast 150ms / base 250ms / slow 400ms`, `ease-standard cubic-bezier(0.22, 1, 0.36, 1)`) and mirror them in CSS variables; don't write ad-hoc numbers.
- Presets: define a few variants once (`fadeUp`, `staggerRise` with a 40 ms step, `scaleIn`) and reuse them; lists use a parent `staggerChildren` + child variants.
- Enter/exit: wrap conditional UI in `AnimatePresence` (`mode="wait"` for swaps such as tab content or a result card replacing a spinner).
- Layout: `layout` for size/position changes (expanding cards, reordering); `layoutId` for an indicator moving between items (tabs, nav, segmented control).
- Scroll: `useInView` (once) to trigger reveals and counters; `useScroll` + `useTransform` for scroll-linked progress, parallax and flattening.
- Pointer: `useMotionValue` + `useSpring` for tilt, spotlight and magnetic effects; CSS variables (`--spot-x`) for cheap per-panel spotlights.
- Springs for physical things (pills, drawers, toggles: `stiffness ~380, damping ~32`); tweens with the standard ease for fades and reveals.

## Motion rules

- Wrap pages in `<MotionConfig reducedMotion="user">`; CSS smooth scroll gets a `prefers-reduced-motion` override.
- Entrances above the fold: transform only (`slide-in-from-bottom`), no opacity fade.
- Active/inactive states: change text colour, never lower opacity.
- Shared-layout pills (`layoutId`): pill `absolute inset-0`, label `<span className="relative">` after it.
- Lists: `<ol><li><BlurFade>…</BlurFade></li></ol>`; overlays such as beam SVGs go in a wrapper `div` next to the list, not inside it.
- `CountUp`: initial state = final value (correct SSR and no-JS), reset to 0 and animate on first in-view.
- Scroll-linked effects (`useScroll`) for hero flatten/parallax; springs for timeline fills.

## Hero art direction: 3D, live product window

The hero is the one place for a dimensional, moving piece. The recipe that worked (a tilted app window running a real task):

- **Stage**: wrapper with `perspective: 2200px`; inner `m.div` with `transformStyle: 'preserve-3d'` holding the shared `AppWindow` mock (traffic lights, title "Research task · Example", the product's real sidebar).
- **Tilt**: resting angle from scroll, `rotateX` 14°→2° and `rotateY` -16°→-3° over `scrollYProgress` 0–0.7 (`useScroll({ target, offset: ['start start', 'end start'] })`), plus `scale` 1→0.96, so the window flattens as the user scrolls.
- **Parallax**: window-level `pointermove` → normalized `px/py` motion values → `useSpring(stiffness 120, damping 20)` → add ±6° to the rotation.
- **Light**: a 520px radial glow (`rgba(255,255,255,0.10)` → transparent) behind the window that follows the same springs; a soft long shadow (`0 60px 120px -40px rgba(255,255,255,0.12)`). No coloured gradients in a monochrome system.
- **Live content**: type the prompt character by character (~28 ms), then complete steps one by one (~1.1 s each: spinner → check that scales in → timing), then the deliverable card enters with `AnimatePresence`, hold ~3 s and switch to the next example task. Step labels in mono, file names UPPERCASE_WITH_UNDERSCORES.
- **Control**: example-task tabs under the window with a `layoutId` pill; clicking one restarts the sequence.
- **Reduced motion**: rotation 0, full prompt, all steps done, no timers.
- **Draft prompt**: describe it as "the one 3D element: the app window tilted in perspective, floating, soft glow behind it", with the exact UI text inside.

Below the hero, dimension comes from subtle means only: spotlight panels, border beams on the highlighted card, scroll-linked progress lines, marquees of chips.

## i18n (next-intl)

- All copy in message files, including mock UI labels, demo tasks (`t.raw` arrays) and translated demo transcripts (`conversation.en.json` next to the original; keep commands, outputs and file names unchanged and say so in one line).
- Inline emphasis via rich tags: `"Screened <n>24</n> / 186"` + `t.rich(key, { n: c => <CountUp/> })`. Passing a function as a plain value fails.
- Typed `useTranslations` namespaces only resolve two levels deep; use `useTranslations('Marketing.home')` with dotted keys.
- Switching the default locale touches: locale config and prefixes, middleware/proxy redirects (old prefixes 308, cookie-preferred locale 307), client runtime locale (read `<html lang>`), localized links helper, hreflang `x-default`, sitemap, robots, and every e2e path.

## Brand mark

- One `BrandMark` component with the logo as inline SVG (same source as the logo file), sizes `md`/`lg`, optional wordmark. Inline means no image request, so it also renders on root error pages.
- A black logo tile disappears on a dark background: add a 1px ring in dark mode only (`dark:ring-1 dark:ring-(--control-border)`).
- Grep for letter placeholders (`>S<`, initials in rounded squares) and replace them all.

## Auth pages (Clerk)

- Locale-prefixed routes (`/zh-CN/signin`): pass the localized `path` and the localized `signUpUrl`/`signInUrl` to `<SignIn>`/`<SignUp>`. If `path` doesn't match the browser URL, the form renders blank.
- Input borders are drawn with `box-shadow`, and Clerk's own style wins: override with `boxShadow: '0 0 0 1px var(--control-border) !important'` (focus: `var(--ring) !important`).
- Mobile without a card border: give the card 1px horizontal padding and `overflow: visible`, or the input shadows get clipped at the edges.
- Element styles accept media queries (`'@media (max-width: 639px)': {...}`) for a borderless, transparent card on phones.
- Change titles, subtitles, placeholders and "use phone/email" links through `localization` (`signIn.start.*`, `signUp.start.*`, `formFieldInputPlaceholder__*`), with copy from the app's message files; hide `logoBox` when the page shows its own logo.
- Layout that worked: header (logo + back to site), centered logo + form card, one-line pitch below, footer. Transform-only entrance (`translateY(8px)`), disabled under reduced motion.

## Dev pitfalls

- Turbopack can serve stale global CSS after token edits: stop the dev server, delete `.next/dev` and `.next/cache`, restart.
- Don't run `next build` while the dev server writes `.next`.
- Lint rules that ban hard-coded colours: use tokens, not `bg-white`/`gray-*`.
