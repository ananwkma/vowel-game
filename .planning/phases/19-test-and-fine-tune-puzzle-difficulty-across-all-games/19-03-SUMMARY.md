---
phase: 19-test-and-fine-tune-puzzle-difficulty-across-all-games
plan: "03"
subsystem: ui
tags: [hunt, word-search, difficulty-tuning, seeded-random, debug]

# Dependency graph
requires:
  - phase: 18-letter-hunt
    provides: Hunt game with CATEGORIES array, DATE_SEED seeded random, grid placement logic
provides:
  - Hunt ?date= override for cross-date testing via URL param
  - Revised CATEGORIES array with moderate-stretch hard words across all 22 categories
  - Debug console logging for category and word inspection
affects: [19-04-PLAN, future Hunt difficulty adjustments]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - UTC date methods for DATE_SEED (avoids timezone drift) — mirrors cipher.html and ladder.html pattern
    - urlParams variable for URL param access, separate from existing DEBUG URLSearchParams call

key-files:
  created: []
  modified:
    - hunt.html

key-decisions:
  - "?date= override uses UTC methods (getUTCFullYear/Month/Date) — consistent with cipher.html (19-01) and ladder.html (19-02) pattern"
  - "urlParams variable added separately from existing DEBUG URLSearchParams call — keeps concerns isolated"
  - "Debug logging placed in getDailyPuzzle() after category selection — all three pieces (seed, category, words) logged together"
  - "YANGTZE (7 chars) accepted for RIVERS — fits within 8-char grid constraint"
  - "SHARKS: GOBLIN replaced by WHALE — GOBLIN was already a Phase 18 substitute; WHALE is more universally recognizable"
  - "CHEERS: SLAINTE+KANPAI replaced by SALUTE+BRAVO — removes non-English cheers unknown to most players"

patterns-established:
  - "Date override pattern: urlParams.get('date') + UTC methods in DATE_SEED IIFE — now consistent across cipher, ladder, hunt"

requirements-completed: [DIFF-HUNT-01]

# Metrics
duration: 1min
completed: 2026-02-28
---

# Phase 19 Plan 03: Hunt Difficulty Fine-Tuning Summary

**Hunt ?date= URL override added and all 22 CATEGORIES hard words replaced with moderate-stretch vocabulary (no more THRIPS, REAMER, SLAINTE, TUPELO, or KANPAI)**

## Performance

- **Duration:** ~1 min
- **Started:** 2026-02-28T22:13:00Z
- **Completed:** 2026-02-28T22:14:07Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments
- hunt.html now accepts `?date=YYYY-MM-DD` for deterministic cross-date puzzle testing
- Debug console logs `[Hunt] Date seed`, `[Hunt] Category`, `[Hunt] Easy words`, and `[Hunt] Hard words` when `?debug` is present
- All 22 categories now have hard words that are recognizable but infrequently used — removes all vocabulary-test obscurities

## Task Commits

Each task was committed atomically:

1. **Task 1: Add ?date= override and debug logging to hunt.html** - `031dca7` (feat)
2. **Task 2: Curate hard words to moderate-stretch difficulty across all 22 categories** - `234fcb8` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified
- `hunt.html` - Added urlParams + _overrideDate + UTC-based DATE_SEED IIFE; debug logging in getDailyPuzzle(); revised CATEGORIES array with 18 word changes across 18 categories

## Decisions Made
- `?date=` uses UTC methods to avoid timezone drift — same pattern as cipher.html (19-01) and ladder.html (19-02)
- `urlParams` declared separately from the existing `DEBUG` URLSearchParams call to keep concerns isolated
- Debug logging placed in `getDailyPuzzle()` immediately after category selection so seed, category, and both word lists are logged together
- YANGTZE (7 chars) accepted — within 8-char grid constraint; AMAZON (6 chars) also fine
- SHARKS: GOBLIN (Phase 18-01 substitute for HAMMERHEAD) replaced by WHALE — more universally recognizable shark
- CHEERS: SLAINTE replaced by SALUTE, KANPAI replaced by BRAVO — removes non-English cheers unknown to most casual players

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Hunt difficulty tuning complete — all 22 categories have moderate-stretch hard words
- ?date= override enables systematic play-testing across any date
- Phase 19 is now complete (all 3 plans done): cipher, ladder, and hunt all tuned with date override + revised difficulty

## Self-Check: PASSED

- hunt.html: FOUND
- 19-03-SUMMARY.md: FOUND
- Commit 031dca7 (Task 1): FOUND
- Commit 234fcb8 (Task 2): FOUND

---
*Phase: 19-test-and-fine-tune-puzzle-difficulty-across-all-games*
*Completed: 2026-02-28*
