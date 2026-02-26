---
phase: 14-hub-vowel-migration
plan: "02"
subsystem: ui
tags: [hub, navigation, index-html, placeholder, game-cards, css-grid, localStorage]

# Dependency graph
requires:
  - styles/design-tokens.css (from 14-01)
provides:
  - Hub portal at index.html with three game cards
  - VOWEL card linking to vowel.html
  - Word Ladder and Letter Hunt inactive placeholder cards
  - ladder.html stub page (Phase 15 target)
  - hunt.html stub page (Phase 16 target)
  - wordGames_dailyStatus localStorage integration for card dimming
affects:
  - 14-03 (vowel.html must be created at the path the VOWEL card links to)
  - 15-word-ladder (ladder.html will be replaced with actual game)
  - 16-letter-hunt (hunt.html will be replaced with actual game)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "CSS Grid 1-column mobile / 2-column desktop layout for game card collection"
    - "Disabled non-anchor cards (div instead of a) with pointer-events: none to prevent click navigation"
    - "localStorage wordGames_dailyStatus key for cross-game daily completion status"
    - "CSS @keyframes fadeIn on body for smooth navigation return animation"
    - "data-collection-name attribute on h1 for collection title without code changes"

key-files:
  created:
    - ladder.html
    - hunt.html
  modified:
    - index.html

key-decisions:
  - "VOWEL card uses <a href='vowel.html'> so native browser navigation handles click without JS"
  - "Word Ladder and Letter Hunt cards use <div> not <a> — pointer-events: none alone would prevent clicks but using div avoids keyboard/accessibility focus traps on inactive items"
  - "Hub reads localStorage at load time (not on storage event) — simple and sufficient for daily status check"
  - "fadeIn animation applied to body via CSS only — no JS, no View Transitions API, broad browser compatibility"
  - "placeholder pages (ladder.html, hunt.html) created now to prevent 404 if URL accessed directly"

requirements-completed: [HUB-01, HUB-02, HUB-03]

# Metrics
duration: ~2min
completed: 2026-02-26
---

# Phase 14 Plan 02: Hub Portal — index.html + Placeholders Summary

**Replaced VOWEL game index.html with a three-card Word Games hub portal that links to vowel.html and shows inactive cards for upcoming games; created ladder.html and hunt.html stub pages**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-02-26T07:22:35Z
- **Completed:** 2026-02-26T07:24:08Z
- **Tasks:** 2
- **Files modified:** 1 (index.html — overwritten)
- **Files created:** 2 (ladder.html, hunt.html)

## Accomplishments

- Replaced 2258-line VOWEL game index.html with 122-line hub portal
- Hub shows "Word Games" h1 with `data-collection-name` attribute and "Daily puzzles await" tagline
- VOWEL card is a clickable `<a href="vowel.html">` with amber hover effect (brightness + saturation + lift)
- Word Ladder and Letter Hunt cards are `<div class="game-card disabled">` with `pointer-events: none` — non-clickable, greyed out
- CSS Grid: 1-column on mobile (< 768px), 2-column on desktop (>= 768px)
- Daily completion status script reads `wordGames_dailyStatus` from localStorage and adds `.completed` class (opacity 0.65) to completed game cards
- `@keyframes fadeIn` on body for smooth 0.3s fade-in when returning from a game
- Max-width 600px container via `#hub-container` so layout doesn't sprawl on ultra-wide screens
- Created ladder.html: minimal placeholder with "Word Ladder" h1, "Coming soon", back link to hub
- Created hunt.html: minimal placeholder with "Letter Hunt" h1, "Coming soon", back link to hub
- Both placeholders import design-tokens.css and use fixed-position back link with amber hover

## Task Commits

Each task was committed atomically:

1. **Task 1: Replace index.html with hub portal** - `217508b` (feat)
2. **Task 2: Create ladder.html and hunt.html placeholders** - `27b729d` (feat)

## Files Created/Modified

- `index.html` — Replaced with Word Games hub portal (84 insertions, 2258 deletions)
- `ladder.html` — New placeholder page for Phase 15 Word Ladder game
- `hunt.html` — New placeholder page for Phase 16 Letter Hunt game

## Decisions Made

- VOWEL card uses native `<a>` anchor — no JavaScript needed for navigation, works with browser history and accessibility tools
- Inactive cards use `<div>` not `<a>` — avoids keyboard focus traps on elements that cannot be activated; `pointer-events: none` prevents mouse/touch interaction
- Hub reads localStorage synchronously at page load — adequate for daily status check, no need for event listeners
- `fadeIn` animation via CSS `@keyframes` only — no JS, compatible with all modern browsers without needing View Transitions API
- Placeholder pages created in Plan 02 (not Plan 03+) — avoids 404 errors if URLs accessed directly during any phase of migration

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- `index.html` hub is live; VOWEL card links to `vowel.html` which Plan 03 will create
- `ladder.html` and `hunt.html` stubs are in place; will be replaced in Phase 15 and 16 respectively
- All three hub files import `styles/design-tokens.css` — consistent visual identity established

## Self-Check: PASSED

Files confirmed present:
- index.html: FOUND (hub portal, 122 lines)
- ladder.html: FOUND (placeholder, 46 lines)
- hunt.html: FOUND (placeholder, 46 lines)

Commits confirmed:
- 217508b: feat(14-02): replace index.html with Word Games hub portal — FOUND
- 27b729d: feat(14-02): create ladder.html and hunt.html placeholder pages — FOUND

---
*Phase: 14-hub-vowel-migration*
*Completed: 2026-02-26*
