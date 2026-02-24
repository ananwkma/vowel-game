---
phase: 02-block-manipulation-and-vowel-selection
plan: "04"
subsystem: ui
tags: [drag-drop, pointer-events, vowel-picker, verification, accessibility]

# Dependency graph
requires:
  - phase: 02-block-manipulation-and-vowel-selection
    provides: drag-and-drop blocks, vowel picker UI, integration logic (Plans 01-03)
provides:
  - Human-verified confirmation that block manipulation and vowel selection work as a cohesive whole
  - Documented known limitations (keyboard lift, Escape cancel) accepted for this phase
affects: [03-game-states-and-win-conditions]

# Tech tracking
tech-stack:
  added: []
  patterns: []

key-files:
  created: []
  modified:
    - game.html

key-decisions:
  - "Keyboard block-lifting and Escape-cancel-drag are accepted known limitations — not blocking, deferred to a future plan"
  - "Vowel picker now shown on pointerdown instead of first pointermove to fix picker appearing mid-drag"

patterns-established: []

requirements-completed: [CORE-03, CORE-04, CORE-05, CORE-06]

# Metrics
duration: ~10min
completed: 2026-02-23
---

# Phase 2 Plan 04: Verify Block Manipulation and Vowel Selection Summary

**Human-approved verification of pointer-based drag/drop and vowel picker interaction, with one auto-fix for picker-on-lift timing**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-02-23
- **Completed:** 2026-02-23
- **Tasks:** 1 (checkpoint:human-verify)
- **Files modified:** 1 (game.html — bug fix)

## Accomplishments

- User verified that all three test scenarios passed with mouse/touch interaction
- Bug found and fixed: vowel picker was appearing while the block was still being lifted (fix: trigger picker on `pointerdown`, not first `pointermove`)
- Known limitations documented and explicitly accepted: keyboard block-lifting (Enter/Space) and Escape-cancel-drag were never implemented in Plans 01-03
- CORE-03, CORE-04, CORE-05, and CORE-06 confirmed working as a cohesive whole

## Task Commits

1. **Bug fix: show vowel picker on pointerdown** - `ad2f0d8` (fix)

**Plan metadata:** (this summary — docs commit)

## Files Created/Modified

- `game.html` - Fixed picker-show timing: now triggered on `pointerdown` rather than first `pointermove` so picker does not appear mid-drag

## Decisions Made

- Keyboard block-lifting (Tab to focus, Enter/Space to lift) was never implemented in Plans 01-03. This is an accepted known limitation — a future plan can add the keyboard state machine from the research document.
- Escape-cancel-drag was similarly never explicitly implemented. Accepted as a known limitation, not blocking progress to Phase 3.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed vowel picker appearing during block lift**
- **Found during:** Checkpoint:human-verify (Scenario 1 — Mouse/Touch)
- **Issue:** The vowel picker was appearing as soon as the user started moving the block (on first `pointermove`), rather than after the block was placed. This created a confusing UX where the picker was visible mid-drag.
- **Fix:** Changed the trigger for `vowelPicker.show()` from the first `pointermove` handler to `pointerdown`, so the picker appears when the interaction begins but does not interfere with the drag flight path.
- **Files modified:** `game.html`
- **Verification:** Re-tested by user — picker now behaves correctly on drop.
- **Committed in:** `ad2f0d8` (fix(02-04): show vowel picker on pointerdown, not first pointermove)

---

**Total deviations:** 1 auto-fixed (Rule 1 — Bug)
**Impact on plan:** Auto-fix was necessary for correct UX. No scope creep.

## Issues Encountered

- Keyboard accessibility (Tab navigation, Enter/Space to lift blocks) is not implemented. This was noted in the verification plan as a known gap and was accepted by the user. Not a blocker.
- Escape-to-cancel-drag not implemented. Similarly accepted as a known limitation.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Block manipulation and vowel selection feature is fully verified and approved.
- Phase 3 (Game States & Win Conditions) can proceed with confidence that the interaction foundation is solid.
- If keyboard accessibility is required in the future, refer to the keyboard state machine documented in `02-RESEARCH.md`.

---
*Phase: 02-block-manipulation-and-vowel-selection*
*Completed: 2026-02-23*
