---
phase: 14-hub-vowel-migration
plan: "03"
subsystem: ui
tags: [html, css, localstorage, design-tokens, hub-integration, vowel-game]

# Dependency graph
requires:
  - phase: 14-01
    provides: styles/design-tokens.css with shared CSS custom properties (--color-primary, --color-secondary, etc.)
provides:
  - Fully functional VOWEL game at vowel.html
  - design-tokens.css imported in vowel.html with local bridge :root block
  - Fixed back link (← Back) to index.html visible during gameplay
  - wordGames_dailyStatus localStorage write on puzzle completion (hub can detect VOWEL done)
  - All original VOWEL localStorage keys preserved (vowel_user_id, vowel_puzzle_*, vowel_best_ms, vowel_introduced)
affects:
  - 14-02 (hub index.html — VOWEL card completion detection reads wordGames_dailyStatus)
  - 14-04 (any further hub/game integration plans)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Game-specific :root bridge block aliases shared tokens (--color-vowel-bg: var(--color-primary)) so existing CSS references work unchanged"
    - "DailyStatus module writes to shared wordGames_dailyStatus namespace; each game key is isolated (status['vowel'] = {...})"
    - "markCompleted is idempotent — safe to call multiple times (DOMContentLoaded re-triggers showPuzzleComplete on already-complete puzzles)"

key-files:
  created:
    - vowel.html
  modified: []

key-decisions:
  - "Bridge :root block maps shared semantic token names to VOWEL-specific names (--color-vowel-bg: var(--color-primary)) — avoids renaming 2300+ lines of CSS variable references throughout the game"
  - "DailyStatus.markCompleted called at top of showPuzzleComplete() before any DOM work — ensures status is always written even if subsequent rendering throws"
  - "Google Fonts @import kept in vowel.html style block even though design-tokens.css also imports it — intentional duplicate ensures fonts load correctly if design-tokens.css fails"
  - "Back link uses fixed positioning with z-index 1000 — stays visible over all game states including dragging and help modal (modal itself uses 10000)"

patterns-established:
  - "All game pages import styles/design-tokens.css then declare a local :root bridge mapping shared tokens to game-specific variable names"
  - "All game pages write to wordGames_dailyStatus localStorage key via DailyStatus.markCompleted(gameId) on puzzle completion"
  - "Back-to-hub link uses id='back-link' with fixed positioning in top-left corner"

requirements-completed: [HUB-05, HUB-04]

# Metrics
duration: 5min
completed: 2026-02-25
---

# Phase 14 Plan 03: VOWEL Game Migration to vowel.html Summary

**VOWEL game migrated from index.html to vowel.html with shared design token import, bridge :root block, fixed back-to-hub link, and wordGames_dailyStatus localStorage write on puzzle completion**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-02-25T11:00:00Z
- **Completed:** 2026-02-25T11:05:00Z
- **Tasks:** 1
- **Files modified:** 1 (created)

## Accomplishments
- Created `vowel.html` (2361 lines) as fully functional VOWEL game — identical rules, words, timer, scoring, and personal best as index.html
- Added `<link rel="stylesheet" href="styles/design-tokens.css">` to head, importing shared CSS variables
- Replaced hardcoded `:root` block with bridge block that maps shared token names to VOWEL-specific variable names already used throughout the CSS (no other CSS changes needed)
- Added fixed `← Back` link in top-left corner linking to index.html, visible during all game states
- Added `DailyStatus` module and called `DailyStatus.markCompleted('vowel')` in `showPuzzleComplete()` to write to `wordGames_dailyStatus` localStorage key
- All original localStorage keys preserved: `vowel_user_id`, `vowel_puzzle_*`, `vowel_best_ms`, `vowel_introduced`

## Task Commits

Each task was committed atomically:

1. **Task 1: Create vowel.html from current index.html with hub integration** - `2a04f5e` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified
- `vowel.html` - Fully functional VOWEL game at its new URL: imports design-tokens.css, bridges shared token names, has fixed back link to index.html, writes hub completion status on puzzle finish

## Decisions Made
- Bridge :root block chosen over full CSS variable renaming — renaming 2300+ lines would be error-prone and risk breaking the game; bridge is a minimal 9-line addition
- DailyStatus.markCompleted called at the very top of showPuzzleComplete(), immediately after timers stop — ensures write happens even if DOM rendering has errors
- Kept Google Fonts @import in vowel.html style block (duplicate from design-tokens.css) — deliberate redundancy for resilience if shared CSS file fails to load

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- `vowel.html` is fully functional and ready for use as the dedicated VOWEL game URL
- Hub (index.html) can read `wordGames_dailyStatus.vowel.completed` to show VOWEL card as dimmed/completed
- Pattern established for future games: import design-tokens.css + local bridge :root + DailyStatus.markCompleted(gameId)

---
*Phase: 14-hub-vowel-migration*
*Completed: 2026-02-25*
