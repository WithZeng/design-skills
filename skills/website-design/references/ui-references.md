# UI reference sources

Pick 2–3 that match the site type: galleries for style and layout, real-product libraries for the UI crops inside panels, component sources for the build. Screenshot the chosen pages with the built-in browser and use them as `--ref` for image-gen drafts. Use references for style and structure only: never copy a site's layout pixel for pixel, its assets or its copy, and never put a reference screenshot on the live page.

Counts and prices come from 2026 roundups and vendor pages (found by search on 2026-10-10, not by visiting each site). Verify before recommending a paid plan.

## Web and landing page galleries (style, layout, motion)

| Site | Good for | Cost |
| --- | --- | --- |
| Awwwards | High-end, motion-heavy brand sites; judge scores are visible | Free; Pro ≈ $6.7/mo |
| Godly | ~1,000 hand-picked sites with animated thumbnails | Free |
| Siteinspire / Httpster | Filter by style or industry; clean, type-led | Free |
| Land-book | SaaS, agency, portfolio, pricing pages | PRO ≈ $9/mo |
| Lapa Ninja | ~6,000 landing pages | Free |
| Saaspo / SaaSUI / SaaS Landing Page | SaaS landing pages by industry and section; SaaSUI pairs each page with its product screens | Check site |
| Landingfolio / One Page Love | Section-level layouts / one-page sites | Check site |

## Real product UI (screens, flows, dashboards)

| Site | Good for | Cost |
| --- | --- | --- |
| Refero | Web and SaaS screens, strong filters (page type, pattern, element, industry) | Pro ≈ $8–14/mo (sources disagree) |
| Mobbin | Widest coverage, ~620K screens and ~140K flows across web, iOS, Android | Paid |
| Page Flows | Annotated user-flow videos, shows interaction in motion | Paid |
| Collect UI / Banani | Free references; Banani is mobile flows | Free |
| Linear / Cursor homepages | Real app UI in the hero: agent panel inside a task page (Linear), task queue + plan document (Cursor) | Free |

Access checked 2026-10-12 with an automated browser: Page Flows and Perplexity show a Cloudflare check, Mobbin needs login, Refero shows only a few results before login. Don't try to get past these; ask the user to browse them signed in.

## AI chat and agent UI

- **AI Elements** (elements.ai-sdk.dev): shadcn-registry components for AI apps: Tool (6 call states), Reasoning (auto-collapse after streaming), Plan, Confirmation (approve/reject), Artifact, Attachments, Prompt Input. Kibo UI's AI components now redirect here.
- Pair with Linear/Cursor shots for layout and Magic UI Animated List for items arriving one by one.

## Component sources (build)

- **21st.dev**: community marketplace for the shadcn ecosystem, with live previews.
- **shadcn.io** (6,000+ blocks), **Shadcnblocks** (has a Figma library).
- **Magic UI**: free animated components; this skill's default, copied as source.
- **Aceternity UI**: animation-forward; sources disagree on free vs paid, check its license.
- **Tailark**: marketing sections. **ReUI / Origin UI / Kibo UI**: app and dashboard components.
- **UINice** (uinice.com): curated directory of UI kits with real code (169 sites on 2026-10-10; weekly Hot 100 chart and Recipes were still empty). It only links out, so each kit's license applies.
- Rules: one base component system (shadcn) and one animation library (Motion) per project; the sources above add components into it as source, so mixing them is fine. Check the licence ("Free" does not mean commercial use is allowed) and the date of the last commit, not the star count.

## Interaction → component

Reach for these before hand-writing an effect. Install commands: build-patterns, "Component sources: install".

| Interaction | Use |
| --- | --- |
| Items arriving (deliverables, logs, notifications) | Magic UI Animated List; Motion `staggerChildren` |
| Running / in-progress | Magic UI Border Beam on the active card, Animated Shiny Text or AI Elements Shimmer for "Thinking…", spinner → check |
| Agent tool calls, reasoning, plans, approvals | AI Elements Tool, Reasoning, Plan, Confirmation |
| Generated output | AI Elements Artifact; file card entering with `AnimatePresence` |
| Numbers changing (usage, counts) | Magic UI Number Ticker / CountUp (render final value on the server) |
| Tabs, nav, segmented control | Motion `layoutId` sliding pill |
| Hover on cards and panels | cursor spotlight (CSS variables), border brighten; Aceternity 3D card for marketing only |
| Section reveal on scroll | Magic UI Blur Fade (transform only above the fold), `useInView` |
| Connections between steps or tools | Magic UI Animated Beam, Orbiting Circles |
| Scroll progress, reading position | Magic UI Scroll Progress, TOC ring |
| Logos, tags, examples in a row | Magic UI Marquee |
| Expand / collapse, drawers, dialogs | Motion `layout` + `AnimatePresence`; spring for drawers |
| Hero product demo | 3D tilted live window (build-patterns, "Hero art direction") |

## Helpers

Typewolf (type pairings), Coolors (palettes), Dribbble and Behance (community), Figma Community (UI kits), Muzli (trend feed).

## Suggested combos

- SaaS marketing site: Godly + Land-book for style, Refero for realistic product UI crops, Magic UI or 21st.dev for components.
- Bold or experimental look: Awwwards + Godly.
- Mobile app or flows: Mobbin or Page Flows.
- AI chat / agent workbench: Linear + Cursor product shots for structure, AI Elements for message parts, Magic UI Animated List for motion. Keep Aceternity and Awwwards-style effects out of work screens.

## Capturing references

When the built-in browser can't open a site, use Playwright with the system Chrome (`channel: 'chrome'`):

- Viewport 1440×900, `colorScheme: 'dark'` if the product is dark; `deviceScaleFactor: 2` for crops you will show.
- Wait for load plus 3–4 s, scroll to the product screenshot area (`page.mouse.wheel`), then capture. Decline cookie banners ("Reject all").
- Use the site's own pages for components (docs pages with a live preview), not search results.
- Paste all captures into one contact sheet (PIL grid) to pick from, then copy the chosen ones to `tmp/design/vN-refs/picks/` with numbered names (`1-linear.png`, …) and show them in the file viewer.
- Present: what each image shows and what to borrow, then 2–3 combos (references per area, effect, size of change) with one recommended.
