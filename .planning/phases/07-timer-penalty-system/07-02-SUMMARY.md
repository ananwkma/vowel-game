---
phase: 07-timer-penalty-system
plan: 02
subsystem: ui
tags: [timer, penalty, countdown, game-mechanic, javascript]

# Dependency graph
requires:
  - phase: 07-timer-penalty-system/07-01
    provides: elapsedTimer JS module with start/stop/setBase, timerElapsed in puzzleState
provides:
  - giveUpCountdown JS module (reset, stop, getPenalty) in index.html SECTION 5.9
  - Give Up button shows countdown "Give Up (N)" from 60 to 0 per word
  - Penalty accumulation in puzzleState.timerElapsed on Give Up press
  - elapsedTimer display jumps immediately on penalty via setBase re-anchor
affects:
  - 07-03 (reads puzzleState.timerElapsed for final results display)
  - 08 (results/share screen uses timerElapsed total including penalties)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - IIFE module pattern for giveUpCountdown (same as elapsedTimer from 07-01)
    - Penalty read before stop to capture current countdown value atomically
    - setBase re-anchors startTime so running timer remains accurate after jump

key-files:
  created: []
  modified:
    - index.html

key-decisions:
  - "Read penalty before calling stop() — ensures the countdown value captured is the value at press time, not after any potential final tick"
  - "elapsedTimer.setBase() updated to reset startTime — re-anchors the drift-free arithmetic so post-penalty elapsed counting remains accurate"
  - "giveUpCountdown module placed as SECTION 5.9 between elapsedTimer (5.8) and INIT (6) to follow logical dependency order"
  - "giveUpCountdown.stop() called in showPuzzleComplete() alongside elapsedTimer.stop() so no countdown ticks during final results"

patterns-established:
  - "Penalty pattern: getPenalty() → stop() → apply to state → setBase() to sync display → savePuzzleState()"
  - "Timer re-anchor pattern: setBase() resets startTime so running timer stays drift-free after base jump"

requirements-completed: [TIM-02, TIM-03, TIM-04, TIM-05]

# Metrics
duration: 2min
completed: 2026-02-24
---

# Phase 7 Plan 02: Give Up Penalty Countdown Summary

**Per-word Give Up countdown (60 to 0) with penalty accumulation — pressing Give Up while countdown shows N adds N seconds to puzzleState.timerElapsed and jumps the elapsed timer display immediately**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-02-24T07:43:13Z
- **Completed:** 2026-02-24T07:44:27Z
- **Tasks:** 1 of 1
- **Files modified:** 1

## Accomplishments
- giveUpCountdown IIFE module with reset(), stop(), getPenalty() methods in SECTION 5.9
- Give Up button updates text to "Give Up (N)" every second, shows "Give Up" (no number) when countdown reaches 0
- Give Up handler reads penalty atomically before stopping, adds to puzzleState.timerElapsed, calls elapsedTimer.setBase() to jump display
- giveUpCountdown.reset() called at end of initGame() ensuring fresh 60-second countdown per word
- giveUpCountdown.stop() called at top of showPuzzleComplete() alongside elapsedTimer.stop()
- elapsedTimer.setBase() updated to re-anchor startTime, keeping drift-free arithmetic accurate after base jump

## Task Commits

Each task was committed atomically:

1. **Task 1: Implement giveUpCountdown module** - `3e6e8e9` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified
- `index.html` - Added SECTION 5.9 giveUpCountdown module, updated Give Up click handler, updated elapsedTimer.setBase(), wired reset/stop into initGame and showPuzzleComplete

## Decisions Made
- Read penalty before stop() — ensures atomic capture at press time before any final interval tick can fire
- Re-anchored startTime in setBase() — without this, the penalty jump would cause the running offset arithmetic to over-count by the number of seconds since last start()
- giveUpCountdown placed in SECTION 5.9 (after 5.8 elapsedTimer, before SECTION 6 INIT) to respect logical dependency order in the single script block

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- puzzleState.timerElapsed now accumulates elapsed time + all Give Up penalties across the full puzzle session
- Phase 7 Plan 03 (if any) or Phase 8 results screen can read timerElapsed as the final authoritative total
- Penalty mechanic is fully functional: waiting longer reduces penalty, giving up at 0 is free

## Self-Check: PASSED

- FOUND: index.html (modified with giveUpCountdown module and all wiring)
- FOUND: .planning/phases/07-timer-penalty-system/07-02-SUMMARY.md
- FOUND: commit 3e6e8e9 (feat(07-02): implement giveUpCountdown module with penalty system)

---
*Phase: 07-timer-penalty-system*
*Completed: 2026-02-24*
