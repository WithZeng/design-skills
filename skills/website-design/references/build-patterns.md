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

## Magic UI

Copy component source into `components/magicui/`, rewrite the `cn` import to the project's utils path, add needed keyframes (marquee, orbit) to `@theme`. Delete components you end up not using. Useful set: animated-beam, border-beam, marquee, orbiting-circles, blur-fade, scroll-progress.

## Motion

- Wrap pages in `<MotionConfig reducedMotion="user">`; CSS smooth scroll gets a `prefers-reduced-motion` override.
- Entrances above the fold: transform only (`slide-in-from-bottom`), no opacity fade.
- Active/inactive states: change text colour, never lower opacity.
- Shared-layout pills (`layoutId`): pill `absolute inset-0`, label `<span className="relative">` after it.
- Lists: `<ol><li><BlurFade>…</BlurFade></li></ol>`; overlays such as beam SVGs go in a wrapper `div` next to the list, not inside it.
- `CountUp`: initial state = final value (correct SSR and no-JS), reset to 0 and animate on first in-view.
- Scroll-linked effects (`useScroll`) for hero flatten/parallax; springs for timeline fills.

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
