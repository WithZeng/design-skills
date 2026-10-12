---
name: image-gen
description: Generate or edit images with GPT Image models through the user's OpenAI-compatible relays. Use when any task needs generated images (illustrations, backgrounds, icons, sprites, mockup art). Not for charts or diagrams (draw those in code). If the current project ships its own image-generation skill (e.g. shorts-studio:shorts-image-gen), use that instead.
---

# Image generation (global)

`scripts/gen.mjs` in this skill is a standalone, dependency-free Node script. Credentials and per-relay prices live outside any repo (see Credentials).

## Rules
- Generate directly; no price confirmation is needed. The spend cap is `--budget <usd>` or, when omitted, `defaultBudget` in `config.json`; the script skips a relay whose price would push the estimated spend over it.
- Relays can differ a lot in price (see `config.json`); the backup is used only if the budget allows it. Add `--primary-only` to stay on the primary relay.
- Errors: 404/429/5xx move on to the next relay; a network error retries the same relay once. Relays may bill failed requests, so they count against the budget.
- Never print, echo, commit or paste the key; never copy it into a repo, manifest or shell profile. If the user shares a key in chat, say it is now in the transcript. Some setups have hooks that block any shell command mentioning env files: edit credential and config files with the Write/Edit tools, not heredocs or `echo`.
- One image per call (`n=1`). After a batch, report calls made and estimated cost from `~/.config/image-gen/requests.jsonl`.
- Generation is offline: save outputs in the project and commit them; never call the API at runtime or render time.

## Use
```bash
node ~/.claude/skills/image-gen/scripts/gen.mjs --models                      # free: list image models per relay
node ~/.claude/skills/image-gen/scripts/gen.mjs --prompt "…" --out assets/hero.png
```
Options: `--budget <usd>`, `--model`, `--size 1024x1024|1024x1536|1536x1024`, `--quality low|medium|high`, `--transparent`, `--ref <file>` (repeatable; edit/reference mode), `--prompt-file`, `--primary-only`, `--force`, `--probe`.

- Models: run `--models` first and use the newest image models the relays offer; a model may not exist on every relay. Don't use older generations unless the user asks.
  - Pick by task difficulty: the stronger model for characters, identity consistency, `--ref` edits, complex compositions and text inside the image; the lighter one for backgrounds, props, icons and simple scenes. If the lighter one misses, retry with the stronger one.
  - The script uses `--model`, else `defaultModel` in `config.json`. At the time of writing these were `gpt-image-2.5-sunburst` (stronger) and `gpt-image-2.5-flare` (lighter).
  - Per-request price is set by the relay, not the model: see `config.json`.
- Don't put aspect words ("9:16", "portrait") in the prompt when `--size` is set; the model follows the words over `size`.
- `--transparent`: check the result really has alpha, not a painted checkerboard. A 4xx about `background` means the model has no transparency support: generate on a flat color and key it out.
- Look at the output (Read the PNG) before reporting it done.

## Credentials
First-time setup: copy `config.example.json` to `config.json` (gitignored) and fill in relay hosts and prices.
Read from the first file found: `$IMAGE_GEN_ENV`, `~/.config/image-gen/.env`, then `envFile` in `config.json`. Variables: `OPENAI_BASE_URL`, `OPENAI_API_KEY`, fallbacks `_2` … `_4`. After measuring real prices from `requests.jsonl`, update `config.json`.
