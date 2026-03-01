# Phase 20: Codebase Cleanup - Context

**Gathered:** 2026-03-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Reduce duplication, improve readability, and standardize structure across all four game files (vowel.html, ladder.html, cipher.html, hunt.html) and the hub (index.html) — without changing any game behavior. Also add a web app manifest and home screen icon to all five pages so the collection can be pinned as "Lexicon" on a mobile home screen.

No new gameplay features. No visible player-facing changes except the icon.

</domain>

<decisions>
## Implementation Decisions

### Shared code extraction
- Claude decides whether to extract to a shared.js or keep inline — readability is the primary constraint
- If extracted, the shared file should be a simple script include (no bundler, no module syntax) consistent with the existing vanilla JS approach
- Key duplication candidates: `seededRandom()`, `DailyStatus` pattern, `confetti`, `?date=` URL param parsing

### Cleanup depth
- **Deep** — full restructure, not just surface removal
- Priority: **readability first** — each file should be easy to read top-to-bottom with consistent sections and clear comments
- DRY is secondary: only extract when it clearly improves readability, not just to eliminate lines

### What this means in practice
- Remove dead code, stale comments, unused CSS variables, leftover debug artifacts
- Consistent JS section ordering across all four game files (e.g. constants → state → DOM → engine → UI → event handlers → init)
- Consistent CSS section ordering (e.g. reset → tokens → layout → components → animations → responsive)
- Naming conventions aligned (e.g. camelCase JS, kebab-case CSS classes, consistent event handler naming)
- No regressions — every game must play identically after cleanup

### Web app manifest + home screen icon
- **Scope**: All five pages (index.html, vowel.html, ladder.html, cipher.html, hunt.html)
- **App name**: "Lexicon" (display name shown under icon on home screen)
- **Icon style**: Grid of letter tiles — references the games' block aesthetic, warm palette
- **Icon format**: SVG source created by Claude; user will swap PNG files later if desired
- **Sizes**: manifest references 192px and 512px PNGs; SVG master provided for export
- **Manifest**: `manifest.json` at project root, linked via `<link rel="manifest">` in each page's `<head>`

### Claude's Discretion
- Whether shared logic is extracted to shared.js or kept inline in each file (readability is the deciding factor)
- Exact SVG icon design within the "grid of letter tiles, warm palette" direction
- How to handle the `favicon.ico` / apple-touch-icon tags alongside the manifest

</decisions>

<specifics>
## Specific Ideas

- "Readability first" — the result should be code a developer can read cold without needing to trace cross-file dependencies
- User is happy to swap the SVG icon for custom PNG files later — don't over-engineer the icon pipeline
- Each game file has grown organically; the restructure is about making them feel like they were written with a plan, not patched over time

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 20-codebase-cleanup*
*Context gathered: 2026-03-01*
