---
name: website-design
description: Design and build a marketing site, landing page, product homepage, or an app's UI and login/signup pages end to end — reference screenshots and image-gen drafts the user approves first, then a unified page system, Next.js + Tailwind + Motion + Magic UI implementation, i18n, and accessibility/e2e verification. Use when the user asks to design, redesign, restyle or polish an official website, landing page, homepage or its subpages, an app's screens (workbench, chat/agent UI, dashboards) or its auth pages, asks for UI reference sites, or says the current design looks bad, fragmented or lacks motion.
---

# Website design

Lessons from the Scientify site redesign (2026-10): the design only landed after drafts were shown and approved, one page system was enforced on every section, and verification caught contrast and markup bugs that motion libraries introduce.

## Workflow and gates

1. **Brief.** Collect product, audience, sections, real sample data, and 1–2 reference sites the user likes. If they have none, pick 2–3 that fit the site type from [references/ui-references.md](references/ui-references.md) (galleries, real-product UI libraries, component sources) and show them for approval. Screenshot the references and save them as `--ref` images; when asked for recommendations, show numbered screenshots plus 2–3 combos to pick from (method: ui-references, "Capturing references").
2. **Drafts before code.** Never edit code for a visual change until the user approves a draft. Use the `image-gen` skill. Order:
   1. If the direction is open, one overview image per direction (usually 2); the user picks one before any detail work. Then one full-page long image (`1024x1536`) to fix the page system.
   2. One detail image per section/panel at full resolution.
   3. Subpages, then interaction storyboards (3–4 frames per interaction) for motion.
   Show each batch, collect feedback, iterate. Prompt templates: [references/draft-prompts.md](references/draft-prompts.md).
3. **Build** only the approved drafts, behind a preview route (e.g. `/home-v2`) until the user says to replace the live page. Patterns: [references/build-patterns.md](references/build-patterns.md).
4. **Verify** before any commit/PR: [references/verification.md](references/verification.md).
5. Keep drafts and screenshots in the repo's `tmp/design/vN/` (gitignored), one folder per round, prompts saved next to images.

## Page system (what removed the "割裂感")

A page feels like one piece when every section reuses the same module. Write these rules into every prompt and into the code tokens:

- ONE background colour top to bottom. No alternating white/gray bands, no section gradients.
- ONE panel module: same radius, fill, 1px border, padding, width. Inside: short text block + product UI crop that bleeds off the panel edge; alternate left/right.
- ONE heading size for all section titles, medium weight, left-aligned; small muted body text; generous spacing.
- Only the hero gets a special effect (e.g. a 3D tilted app window). Everything below stays flat.
- All product UI shown is the SAME app (same sidebar, theme, data), so the page reads as one product.
- Restrained palette (monochrome worked); logo keeps its original colours. Use the real brand logo everywhere (inline SVG), never a letter-in-a-square placeholder.
- Content details: realistic data (real paper titles, plausible numbers and timings); file names UPPERCASE_WITH_UNDERSCORES, no extensions, type shown by icon; no lorem, no fake testimonials or stats, no buzzword slogans.

## App UI and auth pages

The same gates apply inside a product, with different references and tokens:

- References come from real product UI (Refero, Linear/Cursor product shots, AI Elements for chat/agent screens), not landing-page galleries.
- Reuse the app's own tokens and components; don't import the marketing site's palette. Fix a small set of shared primitives first (panel, page container widths, dialog widths, segmented control), then restyle screens with them.
- Login/signup with a hosted auth widget (e.g. Clerk): style it through its appearance API and localization, and check the pitfalls in build-patterns ("Auth pages").

## Stack defaults

Use the project's stack. For new sites: Next.js + Tailwind v4 + shadcn/ui + lucide-react, **Motion** as the only animation library, Magic UI components **copied as source** (not a dependency). One component library, one animation library.

## Hard-won rules (details in build-patterns)

- Muted text must pass 4.5:1 on the panel fill (on #121212, faint gray ≥ #8a8a8a).
- No opacity fade on above-the-fold entrances and no opacity dimming for "inactive" states — axe audits mid-animation and flags contrast. Use transform-only entrances and colour changes.
- Motion wrappers must not sit between `<ul>/<ol>` and `<li>`; animate inside the `<li>`.
- Sliding pills: put the label in a `relative` span above an absolute pill; no `-z-10` + `isolate`.
- Counters render the final value on the server and animate only when in view.
- Every visible string goes through i18n, including demo UI inside mock windows and replayed sessions.
- Grids need `grid-cols-1` / `minmax(0,1fr)` and the page root `overflow-x-clip` to avoid mobile overflow.
