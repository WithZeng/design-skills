# Verification

Run all of these before committing; report failures with the raw error lines.

## Visual

- Compare each built section against its approved draft in the browser pane at 1440 wide.
- Viewports 390 / 1440 / 2048: `document.documentElement.scrollWidth === innerWidth` on every page (no horizontal scroll), `h1` visible, full-page screenshots into `tmp/`.
- Toggle reduced motion and confirm content is fully visible without animation.
- Check both locales on every page: no strings from the other language (mock windows and transcripts included).

## Accessibility (axe via Playwright)

Fail on `serious`/`critical`. Typical findings after a motion-heavy redesign:

| Rule | Cause | Fix |
| --- | --- | --- |
| color-contrast | faint text too dark | raise token until 4.5:1 on panel fill |
| color-contrast | element captured mid fade-in / opacity-dimmed | transform-only entrance; colour for state |
| color-contrast | label inside `isolate` button with `-z-10` pill | label in `relative` span above pill |
| list | motion `div` between `ol` and `li` | animate inside `li`; overlays outside list |

## E2E

- Update tests for replaced pages instead of deleting coverage; locale-specific assertions go to the prefixed routes.
- Smooth scrolling breaks immediate visibility checks: use `expect.poll(...)`.
- When a test fails on something the redesign didn't touch, check `git log` on the component; fix stale assertions, and spin off real bugs as separate tasks.
- A long screenshot test may time out under parallel load on the dev server; rerun it alone before treating it as a failure.

## Build and copy

- Type check, lint, production build.
- Run the project's wording/copy checker on changed copy files; only fix warnings introduced by this change.
- SEO: canonical/hreflang per route, sitemap URL count, robots disallow for app routes in every locale.
