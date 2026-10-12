---
name: website-design
description: Design and build a marketing site, landing page, product homepage, or an app's UI and login/signup pages end to end — reference screenshots and image-gen drafts the user approves first, then a unified page system, an art direction and motion plan derived from the brief, component and animation libraries chosen to fit the project, i18n, and accessibility/e2e verification. Use when the user asks to design, redesign, restyle or polish an official website, landing page, homepage or its subpages, an app's screens (workbench, chat/agent UI, dashboards) or its auth pages, asks for UI reference sites, or says the current design looks bad, fragmented or lacks motion.
---

# Website design

Lessons from a real product site redesign (2026-10): the design only landed after drafts were shown and approved, one page system was enforced on every section, and verification caught contrast and markup bugs that motion libraries introduce.

## Workflow and gates

1. **Brief.** Collect product, audience, sections, real sample data, and 1–2 reference sites the user likes. If they have none, pick 2–3 that fit the site type from [references/ui-references.md](references/ui-references.md) (galleries, real-product UI libraries, component sources) and show them for approval. Screenshot the references and save them as `--ref` images; when asked for recommendations, show numbered screenshots plus 2–3 combos to pick from (method: ui-references, "Capturing references").
2. **Drafts before code.** Never edit code for a visual change until the user approves a draft. Use the `image-gen` skill. Order:
   1. If the direction is open, one overview image per direction (usually 2); the user picks one before any detail work. Then one full-page long image (`1024x1536`) to fix the page system.
   2. One detail image per section/panel at full resolution.
   3. Subpages, then interaction storyboards (3–4 frames per interaction) for motion.
   Show each batch, collect feedback, iterate. Prompt templates: [references/draft-prompts.md](references/draft-prompts.md).
3. **Build** only the approved drafts, behind a preview route until the user says to replace the live page. Patterns: [references/build-patterns.md](references/build-patterns.md).
4. **Verify** before any commit/PR: [references/verification.md](references/verification.md).
5. Keep drafts and screenshots in the project's gitignored scratch folder (e.g. `tmp/design/vN/`), one folder per round, prompts saved next to images.

## Page system (what removed the "割裂感")

A page feels like one piece when every section reuses the same system. Decide the system's values from the approved drafts, then write it into every prompt and into the code tokens:

- One background treatment for the whole page; avoid sections that each invent their own bands or gradients.
- One section module (container, radius, fill, border, padding, width) and a small set of layouts inside it, reused section after section.
- One type scale: the same size and weight for every section title, one body style, consistent spacing.
- One signature piece carries the art direction (usually in the hero); everything else stays quieter in layout but still responds to interaction. What that piece is comes from the brief, not a template: see "Art direction" below.
- All product UI shown is the SAME app (same navigation, theme, data), so the page reads as one product.
- A palette restrained enough to keep the system coherent (one site used pure monochrome); the logo keeps its original colours. Use the real brand logo everywhere, never a letter-in-a-square placeholder.
- Content: realistic data from the product's domain (plausible names, numbers and timings) and one naming convention for files and objects, decided per project; no lorem, no fake testimonials or stats, no buzzword slogans.

## App UI and auth pages

The same gates apply inside a product, with different references and tokens:

- References come from real product UI (e.g. Refero, product screenshots on comparable products' sites, component docs for chat/agent screens), not landing-page galleries.
- Reuse the app's own tokens and components; don't import the marketing site's palette. Fix a small set of shared primitives first (panel, page container widths, dialog widths, segmented control), then restyle screens with them.
- Login/signup with a hosted auth widget (e.g. Clerk): style it through its appearance API and localization, and check the pitfalls in build-patterns ("Auth pages").

## Art direction (dimension and motion)

Design the dimensional and moving parts from the site's own requirements, then draft them like any other visual. Don't reuse a previous site's recipe or fixed values.

1. **Derive it from the brief.** What is the one idea a visitor must get (the product in action, a transformation, scale, precision, calm)? Who is the audience, what is the brand tone, what devices and performance budget? The signature piece should show that idea, ideally with the real product.
2. **Explore 2–3 options** that fit the page system and tone, e.g. a product window in perspective, layered depth with parallax, a scroll-driven scene that tells the workflow, an illustration or 3D object, a data/visual metaphor, or a calm flat page with rich micro-interaction. Draft each as an image and, for motion, as a storyboard; the user picks.
3. **Specify, then build.** Write down for the chosen option: what moves, what triggers it (load, scroll, pointer, time, click), the resting state, the reduced-motion version, and the mobile version. Tune angles, timings and intensities against the approved drafts in the browser, not from a template.
4. **Check the cost.** It must not hurt readability, contrast, layout stability or load time; it must degrade gracefully without JS and under reduced motion.

## Rich interaction, from libraries

Static pages feel cheap. Use component and animation libraries actively to make every interaction feel alive:

- Every state gets feedback: hover, press, focus, loading/running, success/error, appear/disappear, layout change. Plan these in the interaction storyboards, not as an afterthought.
- Prefer a well-built ready component over a hand-written effect. Map each interaction to a pattern, then pick the component from the libraries chosen for this project ([references/ui-references.md](references/ui-references.md), "Interaction patterns").
- Product demos move: real tasks progressing, results arriving, numbers changing, scenes switching.
- Keep it purposeful: motion explains state or draws the eye to what changed. Heavy decorative effects belong on marketing pages, not in work screens. Respect reduced motion everywhere.

## Choosing libraries

Pick component and animation libraries for the project; none is mandatory.

- Existing project: use what it already has; add a library only for a gap, and never one that overlaps an existing one.
- New project: choose by project type, framework and needs (criteria and candidates in [references/build-patterns.md](references/build-patterns.md), "Choosing libraries"). Keep one base component system and one main animation library unless there is a clear reason.
- Prefer sources that install as editable source into the project (registry/CLI or copy) over opaque packages, so components follow the project's tokens.

## Hard-won rules (details in build-patterns)

- Every text tone must pass 4.5:1 on the surface it sits on; check the faintest token on the panel fill, not only on the page background.
- No opacity fade on above-the-fold entrances and no opacity dimming for "inactive" states — axe audits mid-animation and flags contrast. Use transform-only entrances and colour changes.
- Animation wrappers must not sit between `<ul>/<ol>` and `<li>`; animate inside the `<li>`.
- Sliding pills: put the label in a `relative` span above an absolute pill; no `-z-10` + `isolate`.
- Counters render the final value on the server and animate only when in view.
- On multilingual sites every visible string goes through i18n, including demo UI inside mock windows and replayed sessions.
- Grids need an explicit single column / `minmax(0,1fr)` tracks and the page root needs horizontal overflow clipped to avoid mobile overflow.
