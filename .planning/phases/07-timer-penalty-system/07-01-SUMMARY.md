---
phase: 07-timer-penalty-system
plan: 01
subsystem: ui
tags: [timer, localstorage, game-state, persistence]

# Dependency graph
requires:
  - phase: 06-daily-puzzle-engine
    provides: puzzleState with timerElapsed field, loadPuzzleState/savePuzzleState, DOMContentLoaded lifecycle
provides:
  - "#elapsed-timer DOM element displaying M:SS format counting up from 0"
  - "elapsedTimer IIFE module with start/stop/setBase API"
  - "puzzleState.timerElapsed accumulated and persisted to localStorage on each tick"
  - "Timer persists across page reloads via setBase() restore pattern"
affects:
  - 07-02-penalty-system
  - 08-results-screen

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "IIFE module pattern for encapsulating timer state (intervalId, baseSeconds, startTime)"
    - "Drift-free timing: Date.now() arithmetic instead of naive counter increment"
    - "Guard pattern: start() no-op if intervalId !== null — safe to call on every word load"
    - "Two-path setBase() in DOMContentLoaded covers complete-redirect and normal start"

key-files:
  created: []
  modified:
    - index.html

key-decisions:
  - "Use Date.now() arithmetic for drift-free elapsed counting rather than naive counter"
  - "start() guards with intervalId check — single call in initGame() is safe on words 2-5 without resetting the running timer"
  - "Store timerElapsed as integer seconds (not milliseconds) for simpler M:SS formatting"
  - "elapsedTimer.setBase() called in both DOMContentLoaded paths (complete-redirect and normal) to handle all reload scenarios"
  - "tick() writes puzzleState.timerElapsed on every interval — ensures savePuzzleState() always persists the latest value without extra coordination"

patterns-established:
  - "Timer module API: start()/stop()/setBase() — minimal surface for lifecycle hooks"
  - "SECTION 5.8 naming convention: decimal section numbers for features inserted between existing sections"

requirements-completed: [TIM-01]

# Metrics
duration: 2min
completed: 2026-02-24
---

# Phase 7 Plan 01: Elapsed Timer — Visible count-up timer persisting across word transitions and page reloads

**Drift-free count-up timer (M:SS) using Date.now() arithmetic, running continuously across all 5 words, stopping on puzzle complete, and restoring from localStorage on reload**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-02-24T21:38:46Z
- **Completed:** 2026-02-24T21:40:37Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments
- Added `#elapsed-timer` span element below pip row in the header, styled to match `#word-counter` visual weight (small, uppercase, 55% opacity)
- Implemented `elapsedTimer` IIFE module with `start()`, `stop()`, and `setBase()` methods using drift-free `Date.now()` arithmetic
- Wired timer into full game lifecycle: starts on first word (`initGame`), continues through transitions (no-op guard on words 2-5), stops on puzzle complete (`showPuzzleComplete`), restores from saved state on reload (`DOMContentLoaded`)
- `puzzleState.timerElapsed` written on every tick and on stop — `savePuzzleState()` always captures the latest elapsed value

## Task Commits

Each task was committed atomically:

1. **Task 1: Add elapsed timer UI element to game header** - `7d54ab4` (feat)
2. **Task 2: Implement elapsedTimer JS module and wire into game lifecycle** - `2b5629f` (feat)

**Plan metadata:** (pending docs commit)

## Files Created/Modified
- `index.html` - Added CSS for `#elapsed-timer`, HTML span in `#progress-bar`, SECTION 5.8 JS module, and four lifecycle hook calls

## Decisions Made
- Used `Date.now()` arithmetic instead of naive counter to avoid drift — the elapsed value stays accurate even if the tab is throttled by the browser
- `start()` guard (`if (intervalId !== null) return`) makes it safe to call unconditionally in `initGame()` — the timer runs continuously without any reset between words
- `timerElapsed` stored as integer seconds: simpler format math, consistent with M:SS display, no precision needed
- `setBase()` called in both `DOMContentLoaded` code paths to correctly handle all three reload scenarios: fresh start (0 base), mid-puzzle reload (non-zero base), already-complete redirect (final value displayed frozen)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None - implementation proceeded without obstacles.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- `puzzleState.timerElapsed` is populated with integer seconds from the moment the first word loads
- `elapsedTimer.stop()` is called before the results stub renders — the final elapsed value is available for Plan 02 penalty accumulation
- Plan 02 (penalty system) can read `puzzleState.timerElapsed` directly as the base elapsed value and add penalties on top

---
*Phase: 07-timer-penalty-system*
*Completed: 2026-02-24*
