# Draft prompts

Use with the `image-gen` skill. Quote cost before calling. Use the harder model for anything with text in the image (all page drafts). Pass the reference screenshot with `--ref` when matching a reference site's system. Don't write aspect words in prompts when `--size` is set.

Save each prompt as `tmp/design/vN/p/<nn>-<name>.txt` and generate with `--prompt-file`, so rounds are reproducible and diffs between rounds are visible.

## 1. Page-system block (paste into every prompt)

Adapt values, keep the structure:

```
Match the reference page system exactly: whole background near-black #0A0A0A; content sits in large rounded panels (#141414, 1px #262626 border, radius 24px); inside panels a short text block (small white title, two lines of gray text) and a flat product UI screenshot cropped so it bleeds off the panel edge; quiet uniform typography, section title medium weight, left-aligned, generous empty space. The product UI is always the same app: <theme>, <sidebar items>, thin borders, small crisp text, believable data. Strictly <palette>; no colour anywhere else. File names ALWAYS uppercase English with underscores and NO extensions (<EXAMPLES>), file type shown by a small icon only. No statistics, no testimonials, no slogans. <Language> text crisp sans-serif, rendered correctly.
```

## 2. Full-page long image

```
Full-length landing page design for "<Product>", one long vertical scroll screenshot scaled down. Follow the reference image's page system closely: it feels like ONE continuous piece because of these rules, apply them strictly:
- ONE background ... (page-system rules as bullets)
Sections top to bottom:
1. Nav: logo ..., links ..., button ...
2. Hero: exact headline copy, buttons, the one 3D element and what it shows (exact UI text and data).
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

## Review loop

- Show images with the file viewer, not by description.
- When the user says the page feels fragmented, the fix is the page system (one background, one panel module), not more decoration.
- Ask for a full-page image before per-panel detail when the overall direction changes.
