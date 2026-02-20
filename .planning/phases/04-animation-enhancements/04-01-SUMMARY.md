---
phase: 04-animation-enhancements
plan: 01
subsystem: ui
tags: [css-transitions, opacity, requestAnimationFrame, vowel-picker, fade-animation]

# Dependency graph
requires:
  - phase: 02-block-manipulation-and-vowel-selection
    provides: vowelPicker IIFE with show/hide API and CSS .vowel-picker class structure
provides:
  - Smooth 0.2s ease-in-out fade-in when vowel picker appears on drag start
  - Smooth 0.2s ease-in-out fade-out when vowel picker hides on drop/cancel
  - requestAnimationFrame-deferred class addition to guarantee CSS transition fires
affects: [04-02-animation-enhancements, 04-03-animation-enhancements]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "CSS opacity transition via class toggle: element starts at opacity:0, adding .visible triggers fade-in"
    - "requestAnimationFrame before classList.add to ensure browser registers start state before transition"

key-files:
  created: []
  modified:
    - game.html

key-decisions:
  - "Use requestAnimationFrame in vowelPicker.show() to defer adding 'visible' class so the opacity:0 start state is registered before transition fires"
  - "Keep picker in DOM at opacity:0 rather than removing it — simpler and avoids layout thrash on each drag"
  - "Fixed removeGuideColumn() bug: replaced dead code (wrong 'is-visible' class + stale guideEl reference) with vowelPicker.hide() call"

patterns-established:
  - "CSS fade pattern: opacity:0 + transition on base class; add/remove .visible class via JS to animate"

requirements-completed: [VIS-07]

# Metrics
duration: 2min
completed: 2026-02-20
---

# Phase 4 Plan 01: Vowel Picker Fade Animation Summary

**Vowel picker fades in/out smoothly via 0.2s ease-in-out CSS opacity transition triggered by requestAnimationFrame-deferred class toggle**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-02-20T13:56:02Z
- **Completed:** 2026-02-20T13:57:39Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments
- CSS: `.vowel-picker` now uses `transition: opacity 0.2s ease-in-out` (was `ease`) for smooth bidirectional fade
- JS: `vowelPicker.show()` positions the picker first, then defers `classList.add('visible')` via `requestAnimationFrame` to guarantee the CSS transition fires from `opacity:0`
- JS: `vowelPicker.hide()` removes the `visible` class, letting the CSS transition animate the fade-out
- Bug fix: `removeGuideColumn()` had dead code using wrong class `is-visible` (instead of `visible`) and a stale `guideEl` reference that was never populated; replaced with `vowelPicker.hide()` call

## Task Commits

Each task was committed atomically:

1. **Task 1: Add CSS for Vowel Guide Fade Animation** - `89f7ce1` (feat)
2. **Task 2: Integrate Fade Animation into Vowel Guide JavaScript** - `6eb3479` (feat)

**Plan metadata:** (docs commit pending)

## Files Created/Modified
- `game.html` - Updated `.vowel-picker` CSS transition to `ease-in-out`; updated `show()` to use `requestAnimationFrame`; cleaned up `removeGuideColumn()` dead code

## Decisions Made
- Used `requestAnimationFrame` in `show()` rather than direct class addition to reliably trigger the CSS opacity transition (browser needs to paint the `opacity:0` state first)
- Kept the vowel picker permanently in the DOM at `opacity:0` — toggling visibility via class is simpler and avoids the complexity of dynamic DOM insertion/removal timing
- Fixed the `removeGuideColumn()` bug under Rule 1 (wrong class name `is-visible` vs actual `visible`)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed removeGuideColumn() using wrong class name**
- **Found during:** Task 2 (Integrate Fade Animation into Vowel Guide JavaScript)
- **Issue:** `removeGuideColumn()` called `classList.remove('is-visible')` but the CSS and `vowelPicker.hide()` use `visible` (without the `is-` prefix). The `guideEl` variable was also always `null` making the function a no-op, hiding the bug.
- **Fix:** Replaced the entire dead-code body with a single `vowelPicker.hide()` call, which correctly removes the `visible` class and triggers the CSS fade-out.
- **Files modified:** `game.html`
- **Verification:** `removeGuideColumn()` now calls `vowelPicker.hide()` which matches the CSS class `visible`
- **Committed in:** `6eb3479` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - bug)
**Impact on plan:** The fix was essential for correctness — `removeGuideColumn()` was silently broken. No scope creep.

## Issues Encountered
- The plan references `createGuideColumn`/`removeGuideColumn` functions and a `.vowel-guide.is-visible` class, which describes an earlier design where the guide was dynamically created/destroyed. The current implementation uses a permanent DOM element toggled with the `visible` class. The plan's CSS intent (opacity:0 default, opacity:1 when active) was already implemented — only the `ease` to `ease-in-out` refinement and the `requestAnimationFrame` optimization were added.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Vowel picker fade animation complete and verified
- Pattern established: CSS opacity transition via class toggle with requestAnimationFrame for reliable triggering
- Ready for Plan 04-02 (Block Bounce animation)

---
*Phase: 04-animation-enhancements*
*Completed: 2026-02-20*
