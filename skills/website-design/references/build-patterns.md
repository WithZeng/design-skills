# Build patterns

## Tokens

Define colours once as tokens and use only them in page code. Example from a monochrome dark site (values come from the approved drafts, not from here):

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

Build the shared pieces once, then compose every page from them. Example set from one site:

- `SitePage` (header, footer, scroll progress, back-to-top, `overflow-x-clip` root)
- `SiteContainer`, `SiteHero`, `SiteSection` (title + reveal), `SitePill`, `SiteCta`
- `SpotlightPanel` (the one panel module, with cursor spotlight on hover)
- `RevealTitle`, `CountUp`, `SlideTabs`, `ArticleToc`
- one `AppWindow` mock reused by every product screenshot section

Keep files under the repo's max-lines limit by splitting mock UIs (`hero-window`, `panel-ui`, `cloud-ui`, ...).

## Choosing libraries

Choose per project; the tables list candidates, not requirements. Start from what the project already uses.

Criteria, in order: fits the framework and rendering model (SSR, RSC, Vue/Svelte); matches the base component system and token approach; covers the interactions in the approved storyboards; licence allows commercial use; maintained (recent commits, open issues answered); bundle cost and tree-shaking; accessibility (keyboard, focus, ARIA) and reduced-motion support.

| Need | Candidates (pick one that fits) |
| --- | --- |
| Base components | shadcn/ui (React), Radix / Base UI primitives, Ant Design (admin), shadcn-vue / Naive UI / Element Plus (Vue) |
| Animated marketing components | Magic UI, Aceternity UI, 21st.dev community components, Tailark sections |
| App / dashboard components | ReUI, Origin UI, Kibo UI, Tremor or Recharts for charts |
| AI chat / agent UI | AI Elements, or the project's own message components |
| UI animation | Motion (React/Vue/JS), CSS transitions and keyframes, AutoAnimate for simple list changes |
| Scroll-driven storytelling | GSAP + ScrollTrigger, Lenis for smooth scroll; Motion `useScroll` for lighter cases |
| 3D | React Three Fiber + Drei, Spline embeds, CSS 3D transforms for simple depth |
| Designer-made animation | Lottie / dotLottie, Rive |

Write the choice and the reason into the plan; the user confirms it with the drafts.

## Installing components

- Prefer installing as editable source: the base system's registry/CLI (e.g. `npx shadcn@latest add <registry>/<name>`) or copying the source. Take the exact command from the component's docs page; registries change.
- After install: point imports at the project's utils and animation library, replace hard-coded colours with tokens, add needed keyframes to the theme, and review the diff.
- Delete components you end up not using.

## Animation implementation

Library-agnostic; map each item to the chosen library's API.

- Setup: load the library once at the root with its lightest bundle option; set the global reduced-motion behaviour there.
- Tokens: durations and easings in one place, mirrored in CSS variables; no ad-hoc numbers in components.
- Presets: a few shared entrances/exits (rise, fade-up, scale-in, stagger) reused everywhere.
- Enter/exit: animate conditional UI out before it unmounts; swap content (tabs, spinner → result) without layout jumps.
- Layout: animate size/position changes and moving indicators (tabs, nav pills) with the library's layout/FLIP feature.
- Scroll: trigger reveals and counters once when in view; use scroll-linked values for progress, parallax and depth.
- Pointer: smooth pointer-driven effects (tilt, spotlight, magnetic) with springs or CSS variables.
- Springs for physical movement (pills, drawers, toggles); eased tweens for fades and reveals.

## Animation rules

- Global reduced-motion handling; CSS smooth scroll gets a `prefers-reduced-motion` override.
- Entrances above the fold: transform only, no opacity fade.
- Active/inactive states: change text colour, never lower opacity.
- Sliding pills: pill `absolute inset-0`, label in a `relative` span after it.
- Lists: animate inside `<li>`; overlays such as beam SVGs go in a wrapper next to the list, not inside it.
- Counters: initial state = final value (correct SSR and no-JS), reset and animate on first in-view.

## Building the signature piece

Implement the art direction chosen in the drafts (SKILL.md, "Art direction"):

- Build it from the same product mock and tokens as the rest of the page, so it reads as the same product.
- Separate the layers: static content, the motion driver (scroll, pointer, time, click) and the visual response, so each can be tuned or turned off.
- Tune values in the browser against the approved draft and storyboard; record the final values as named constants, not inline numbers.
- Content in demos is real and i18n'd; timed sequences pause off-screen and when the tab is hidden.
- Reduced motion and mobile get their own designed state (usually the finished, flat version), not a broken animation.
- Check performance: animate only transform/opacity/filters on composited layers, no layout thrash, no CLS.

Example from one project (for illustration only): a product window in perspective that played a real task, tilted with the pointer and flattened on scroll. Another product may need something entirely different.

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
