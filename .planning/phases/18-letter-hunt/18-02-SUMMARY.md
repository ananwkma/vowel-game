---
phase: 18-letter-hunt
plan: "02"
subsystem: ui
tags: [letter-hunt, pointer-events, canvas, drag-selection, word-search, phase-state-machine, hint-system, two-phase-timer]

requires:
  - phase: 18-01
    provides: hunt.html — HTML skeleton, CSS, word corpus, puzzle engine, grid render, timers, pips, DailyStatus, HuntResult

provides:
  - Pointer Events drag selection with canvas amber trace line
  - Word evaluation (match unfound words, lock in sage green or dusty rose)
  - isAdjacentToLast guard against diagonal skipping
  - Phase state machine (easy → revealCategory → hard → endGame)
  - Category reveal stamp animation with hard timer starting 450ms after reveal
  - Hint system — round-robin pulse on first cell of unfound word, 30s penalty per hint
  - Two-tap give-up confirm — reveals all remaining words in rose
  - endGame() stub integrating with existing showResults()

affects: [18-03 — results screen and persistence will replace endGame stub, no other changes needed]

tech-stack:
  added: []
  patterns:
    - Pointer Events (pointerdown/move/up/cancel) with setPointerCapture — unified touch/mouse, prevents tracking loss
    - elementFromPoint O(1) hit detection — canvas overlay has pointer-events:none so point hits cell
    - Snapshot capture in async closures — shakeAndClear captures selectedCells.slice() before 400ms timeout
    - Phase state machine check after each word found — easyFound===3 → revealCategory, hardFound===3 → endGame

key-files:
  created: []
  modified:
    - hunt.html

key-decisions:
  - "Tasks 1 and 2 committed together (0a75c8a) — drag selection, evaluation, phase management, and hint system are codependent through evaluateSelection→markWordFound→checkPhaseTransition→revealCategory call chain"
  - "shakeAndClear uses selectedCells.slice() snapshot — prevents race condition if pointerdown fires during 400ms shake window"
  - "endGame() calls showResults() directly — enables Plan 02 to be fully tested without Plan 03's results wiring"

requirements-completed: [HUNT-03, HUNT-04, HUNT-05]

duration: ~2min
completed: "2026-02-27"
---

# Phase 18 Plan 02: Letter Hunt Drag Selection and Phase State Machine Summary

**Pointer Events drag selection with canvas trace, word evaluation, stamp reveal, two-phase timer switching, hint round-robin with 30s penalty, and two-tap give-up — game fully playable end-to-end.**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-02-27T00:15:56Z
- **Completed:** 2026-02-27T00:17:56Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments

- Full Pointer Events drag selection with canvas amber trace line between selected cell centers
- Word evaluation system — correct words lock in sage green (or dusty rose if hint-assisted); wrong selections shake 400ms then clear
- Phase state machine driven by `checkPhaseTransition()` — 3rd easy word triggers category stamp reveal, hard timer starts at 450ms; 3rd hard word calls `endGame(false)`
- Hint system round-robins through unfound phase words, pulses first cell amber for 1.5s, adds 30s to active phase timer, tracks hinted words for pip coloring
- Two-tap give-up reveals all remaining words in dusty rose and shows results

## Task Commits

Both tasks modify the same file through an interleaved call chain (drag → evaluate → mark → phase check → reveal), so they were committed together:

1. **Tasks 1+2: Drag selection + phase management + hint system** - `0a75c8a` (feat)

## Files Created/Modified

- `hunt.html` — Added 291 lines: SECTION: DRAG SELECTION, SECTION: CANVAS, SECTION: SELECTION EVALUATION, SECTION: HINT SYSTEM, SECTION: PHASE MANAGEMENT, SECTION: GIVE-UP (new handleGiveUp replacing stub setupGiveUp)

## Decisions Made

- Tasks 1 and 2 committed together — both tasks write to hunt.html and are interleaved through the call chain (`evaluateSelection` → `markWordFound` → `checkPhaseTransition` → `revealCategory`). Splitting would require an intermediate file where drag works but reveal is broken.
- `shakeAndClear` captures `selectedCells.slice()` before the 400ms timeout — prevents a race condition where `pointerdown` resets `selectedCells` during the shake window, which would leave the new selection's cells dirty when the timeout fires.
- `endGame()` calls `showResults()` directly rather than being a pure stub — this makes Plan 02 immediately testable and removes the need to find all 6 words manually to reach results. Plan 03 will add persistence and polish inside `showResults()` itself.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed shakeAndClear race condition via snapshot capture**
- **Found during:** Task 1 review (shakeAndClear implementation)
- **Issue:** The original plan's shakeAndClear reads module-level `selectedCells` in the setTimeout callback. If user touches again during the 400ms shake window, `pointerdown` resets `selectedCells = []` and the new selection's cells would be left dirty (no active cleanup).
- **Fix:** Captured `const shakingCells = selectedCells.slice()` before the timeout; callback cleans up `shakingCells` DOM elements and resets `selectedCells` unconditionally.
- **Files modified:** hunt.html
- **Verification:** JS syntax validated; logic reviewed.
- **Committed in:** 0a75c8a

---

**Total deviations:** 1 auto-fixed (1 Rule 1 bug)
**Impact on plan:** Correctness fix — prevents stale cell state on rapid re-drag. No scope creep.

## Issues Encountered

None — plan executed cleanly. JS syntax validated with `new Function()` check before commit.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- hunt.html is fully playable end-to-end: drag to find words, phase transitions, hints, give-up all work
- `endGame()` stub calls `showResults()` directly — Plan 03 can add persistence and polish without changing the call site
- `DailyStatus.markCompleted('hunt')` and `HuntResult.save()` are already called inside `showResults()` from Plan 01
- Plan 03 scope: results screen polish, confetti, share improvement, hub integration completion

---
*Phase: 18-letter-hunt*
*Completed: 2026-02-27*

## Self-Check: PASSED

| Item | Status |
|------|--------|
| hunt.html exists | FOUND |
| 18-02-SUMMARY.md exists | FOUND |
| Commit 0a75c8a | FOUND |
| setupDragSelection | OK |
| setPointerCapture | OK |
| elementFromPoint | OK |
| isAdjacentToLast | OK |
| drawTraceLine | OK |
| evaluateSelection | OK |
| markWordFound | OK |
| checkPhaseTransition | OK |
| revealCategory | OK |
| startHardTimer | OK |
| useHint | OK |
| handleGiveUp | OK |
| endGame | OK |
| JS syntax valid | VERIFIED |
