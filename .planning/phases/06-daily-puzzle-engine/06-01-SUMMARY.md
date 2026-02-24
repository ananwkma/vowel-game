---
phase: 06-daily-puzzle-engine
plan: 01
subsystem: ui
tags: [prng, deterministic, daily-puzzle, word-engine, seeded-random]

# Dependency graph
requires:
  - phase: 02-block-manipulation-and-vowel-selection
    provides: WordEngine.wordList used as source for daily word selection
provides:
  - DailyEngine object with getDailyWords(), seededRandom(), DATE_SEED, IS_DEBUG
  - Deterministic 5-word daily selection seeded from local date (YYYY-MM-DD)
  - ?date= URL param for date override and ?debug flag for downstream debug UI
affects: [06-02-daily-state-persistence, 06-03-progress-ui]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Mulberry32-style PRNG: string-to-hash via Math.imul(31, h) + charCode, then s += 0x6D2B79F5 generator"
    - "Fisher-Yates shuffle with seeded RNG for deterministic shuffling of wordList"
    - "DATE_SEED computed once at load via IIFE using URLSearchParams or toLocaleDateString('en-CA')"
    - "DailyEngine as plain object holding pre-computed dailyWords array"

key-files:
  created: []
  modified:
    - index.html

key-decisions:
  - "Used Mulberry32-style PRNG over Math.random() for reproducible determinism across browsers and reloads"
  - "toLocaleDateString('en-CA') for consistent YYYY-MM-DD format without external libraries"
  - "Fisher-Yates shuffle over pick-with-rejection to guarantee exactly 5 unique words in O(n) time"
  - "DailyEngine is additive — WordEngine.getRandomWord() left intact for Plan 02 to rewire"
  - "dailyWords computed once at module load time, not on-demand, to ensure single consistent instance"

patterns-established:
  - "SECTION 2.5: DAILY ENGINE block placed between WordEngine sanity checks and SECTION 2.1 VOWEL PICKER"
  - "IS_DEBUG = new URLSearchParams(location.search).has('debug') — single source of truth for debug mode"

requirements-completed: [DP-01]

# Metrics
duration: 10min
completed: 2026-02-24
---

# Phase 6 Plan 01: Daily Puzzle Engine Summary

**Mulberry32-seeded PRNG with Fisher-Yates shuffle selects 5 unique daily words deterministically from WordEngine.wordList using local date as seed**

## Performance

- **Duration:** 10 min
- **Started:** 2026-02-24T00:00:00Z
- **Completed:** 2026-02-24T00:10:00Z
- **Tasks:** 1 of 1
- **Files modified:** 1

## Accomplishments
- Implemented `seededRandom(seedStr)` — Mulberry32-style PRNG that converts any date string to a stable 32-bit integer seed and produces uniform [0,1) values
- Implemented `getDailyWords()` — Fisher-Yates shuffles `WordEngine.wordList` with seeded RNG, returns first 5 for guaranteed uniqueness
- Implemented `DATE_SEED` — reads `?date=YYYY-MM-DD` URL param or falls back to `toLocaleDateString('en-CA')` for consistent YYYY-MM-DD local date
- Implemented `IS_DEBUG` — reads `?debug` URL param as boolean for downstream use in Plan 02
- Created `DailyEngine` object exposing `dateSeed`, `isDebug`, and pre-computed `dailyWords` array with console logging
- Verified determinism via Node.js simulation: same date seed = same 5 words, different date = different 5 words, no duplicates

## Task Commits

Each task was committed atomically:

1. **Task 1: Implement DailyEngine — PRNG, date seed, 5-word daily selection** - `76d51ae` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified
- `index.html` - Added SECTION 2.5: DAILY ENGINE block (51 lines) between WordEngine sanity checks and SECTION 2.1 VOWEL PICKER

## Decisions Made
- Used Mulberry32-style PRNG (s += 0x6D2B79F5 generator) over simpler LCG because it produces better statistical distribution with less pattern repetition across adjacent dates
- Used `toLocaleDateString('en-CA')` for YYYY-MM-DD format — locale 'en-CA' reliably returns ISO-like date format without needing date formatting libraries
- Fisher-Yates shuffle chosen over random-pick-with-deduplication rejection loop: O(n) guaranteed, no infinite-loop risk on small wordlists
- `DailyEngine` kept as additive addition — `WordEngine.getRandomWord()` intentionally preserved so existing game flow is unaffected until Plan 02 rewires initGame()
- `dailyWords` computed once at load (not lazily) to ensure single consistent array instance across the page lifetime

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - implementation followed the plan specification directly. Node.js simulation confirmed determinism before commit.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- DailyEngine is ready for Plan 02 to wire into `initGame()` — replace `WordEngine.getRandomWord()` call with iteration over `DailyEngine.dailyWords`
- `IS_DEBUG` flag available for Plan 02 debug UI (date display, word preview panel)
- `DailyEngine.dateSeed` available for localStorage key namespacing in Plan 02 state persistence

---
*Phase: 06-daily-puzzle-engine*
*Completed: 2026-02-24*
