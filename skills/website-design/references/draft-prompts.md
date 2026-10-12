# Draft prompts

Use with the `image-gen` skill. Use the harder model for anything with text in the image (all page drafts). Pass the reference screenshot with `--ref` when matching a reference site's system. Don't write aspect words in prompts when `--size` is set.

Save each prompt in the round's scratch folder (e.g. `tmp/design/vN/p/<nn>-<name>.txt`) and generate with `--prompt-file`, so rounds are reproducible and diffs between rounds are visible.

## 1. Page-system block (paste into every prompt)

Fill the placeholders from the approved direction; keep the structure:

```
Match the reference page system exactly: whole page background <background>; content sits in <section module: shape, fill, border, radius>; inside each module <layout: text block + product UI / illustration / ...>; <typography: title size and weight, alignment, spacing>. The product UI is always the same app: <theme>, <navigation items>, <density>, believable data. Strictly <palette>; no colour anywhere else. <Naming convention for files and objects, with examples>. No fake statistics, no testimonials, no slogans. <Language> text crisp, rendered correctly.
```

## 2. Full-page long image

```
Full-length landing page design for "<Product>", one long vertical scroll screenshot scaled down. Follow the reference image's page system closely: it feels like ONE continuous piece because of these rules, apply them strictly:
- ONE background ... (page-system rules as bullets)
Sections top to bottom:
1. Nav: logo ..., links ..., button ...
2. Hero: exact headline copy, buttons, the signature piece from the chosen art direction and what it shows (exact UI text and data).
3. ... one numbered line per section with exact copy and the UI each panel shows.
```

Exact copy in the prompt = legible copy in the image. Name every UI element and data row.

## 3. Section detail image

```
Section: <name>. <Exact layout, copy and UI content for this section only.>

Detailed desktop design of ONE section of the <Product> landing page, shown at full resolution, <page-system block>.
```

## 4. Subpage drafts

One image per page type (feature detail, article, comparison, tool list, case study, catalog). Reuse the same page-system block and header/footer description so subpages match the home page.

## 5. Interaction storyboards

One image per interaction, 3–4 frames left to right, each frame labelled with the trigger and what moves:

```
Interaction storyboard, 4 frames in a row, same section shown at successive moments, small caption under each frame. Frame 1 (<trigger, e.g. section enters view>): ... Frame 2: ... Frame 3: ... Frame 4 (rest state): ... <page-system block>
```

Useful interaction vocabulary: scroll-linked progress line, sticky scroll with swapping preview, typing prompt, step log advancing, count-up numbers, beam/connector flowing between cards, spotlight hover on panels, sliding tab pill, marquee of chips, orbiting tool icons, reading-progress TOC ring, back-to-top.

## Directions first

When the direction is open (new page, redesign), generate one overview image per direction (2 is usually enough, e.g. split layout vs centered card), let the user pick one, then generate detail images only for the chosen direction: desktop light/dark, mobile, key states. Don't detail every direction.

## Review loop

- Show images with the file viewer, not by description.
- When the user says the page feels fragmented, the fix is the page system (one background treatment, one section module, one type scale), not more decoration.
- Ask for a full-page image before per-panel detail when the overall direction changes.
