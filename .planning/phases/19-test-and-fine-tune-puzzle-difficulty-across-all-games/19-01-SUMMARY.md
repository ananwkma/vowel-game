---
phase: 19-test-and-fine-tune-puzzle-difficulty-across-all-games
plan: "01"
subsystem: ui
tags: [cipher, puzzle, quote-corpus, seeded-rng, debug, pre-reveal]

# Dependency graph
requires:
  - phase: 17-cipher
    provides: cipher.html with seededRandom, DATE_SEED, assignLetter, CipherProgress
provides:
  - cipher.html with ?date= URL param override for date-specific puzzle testing
  - QUOTES corpus expanded from 22 to 42 entries
  - hasHighLetterRepetition() filter selecting quotes with ratio >= 0.35
  - Pre-reveal of 2-3 middle-frequency letters seeded deterministically by date
  - Debug logging (?debug param) for quote, repetition ratio, pre-reveal letters, pool size
affects:
  - 19-02-ladder (same ?date= pattern)
  - 19-03-hunt (same ?date= pattern)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "URL ?date= override for game testing: urlParams.get('date') replacing new Date() in DATE_SEED IIFE"
    - "UTC date methods (getUTCFullYear/Month/Date) to avoid timezone drift on ?date= string parsing"
    - "Letter-repetition filter: (letters.length - uniqueCount) / letters.length >= 0.35"
    - "Pre-reveal seeding: middle-frequency letters (slice(2,-3)) selected via rng() after quote pick"
    - "Pre-reveal applied after buildQuoteDOM(), before progress restore — avoids DOM-not-ready errors"

key-files:
  created: []
  modified:
    - cipher.html

key-decisions:
  - "UTC date methods used in DATE_SEED IIFE — new Date('2026-03-01') parses as UTC midnight, so local getDate() can drift by -1 in negative-offset timezones"
  - "Pre-reveal selects middle-frequency letters (not top-3 most common, not bottom-2 rarest) — avoids both trivial reveals and unhelpful rare-letter reveals"
  - "highRepQuotes fallback to full QUOTES if filter yields fewer than 5 quotes — prevents empty pool"
  - "Debug logging gated on ?debug param only — pre-reveal itself is not debug-only, it always runs"
  - "Pre-reveal placed before progress restore (step 7) — saved progress naturally overwrites with same correct values, no conflict"

patterns-established:
  - "Date override pattern: ?date=YYYY-MM-DD overrides DATE_SEED for any game, enabling cross-date testing without code changes"
  - "Letter-repetition quality filter applied at game-init time via hasHighLetterRepetition(), not by manual corpus curation"

requirements-completed:
  - DIFF-CIPHER-01

# Metrics
duration: 2min
completed: 2026-02-28
---

# Phase 19 Plan 01: Cipher Difficulty Tuning Summary

**Cipher date-override testing param, 42-quote corpus, repetition-ratio filter, and 2-3 seeded pre-reveal letters added to cipher.html**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-28T22:06:14Z
- **Completed:** 2026-02-28T22:07:36Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments
- Added `?date=YYYY-MM-DD` URL param to cipher.html — any date can be tested by visiting `cipher.html?date=2026-03-01`, producing deterministic, date-specific puzzles on reload
- Expanded QUOTES corpus from 22 to 42 entries — 20 new quotes chosen for longer text and higher letter repetition (E, T, A, I, O repeat frequently), giving the repetition filter meaningful material to work with
- Added `hasHighLetterRepetition()` filter selecting quotes where `(total_letters - unique_letters) / total_letters >= 0.35` — narrows the pool to quotes where each solved letter reveals more context, with fallback to full corpus if fewer than 5 qualify
- Pre-reveal system: 2-3 middle-frequency letters are selected from the quote's letter set (excluding top-3 most common and bottom-2 rarest), seeded by the same RNG as the puzzle — same date always reveals same letters on reload
- Debug logging (`?debug` param) logs quote text, repetition ratio, pre-reveal letters, and high-rep pool size to console for play-testing

## Task Commits

Each task was committed atomically:

1. **Task 1: Add ?date= override and expand QUOTES corpus** - `16b7185` (feat)
2. **Task 2: Add letter-repetition filter, pre-reveal, and debug logging** - `c188a25` (feat)

**Plan metadata:** (pending — final docs commit)

## Files Created/Modified
- `cipher.html` - DATE_SEED override, 42-entry QUOTES, hasHighLetterRepetition(), pre-reveal logic, debug logging

## Decisions Made
- Used UTC date methods (`getUTCFullYear`, `getUTCMonth`, `getUTCDate`) when parsing `?date=` override — `new Date('2026-03-01')` parses as UTC midnight, meaning `getDate()` would return the previous day in UTC-N timezones
- Pre-reveal targets middle-frequency letters: `letterFreqs.slice(2, -3)` excludes the 3 most common letters (revealing too much) and the 2 rarest (not helpful to the player)
- Pre-reveal is applied after `buildQuoteDOM()` and before progress restore (step 7) so the DOM exists and saved progress naturally overwrites the pre-revealed values without conflict
- `hasHighLetterRepetition()` falls back to full `QUOTES` array if the filtered pool has fewer than 5 quotes, preventing degenerate behavior on small corpora

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- cipher.html is ready for play-testing across multiple dates via `?date=` param
- Plan 02 (Ladder difficulty tuning) can proceed independently — same `?date=` override pattern to be applied to ladder.html
- Plan 03 (Hunt word curation) follows after Ladder

---
*Phase: 19-test-and-fine-tune-puzzle-difficulty-across-all-games*
*Completed: 2026-02-28*

## Self-Check: PASSED

- cipher.html: FOUND
- 19-01-SUMMARY.md: FOUND
- Commit 16b7185 (Task 1): FOUND
- Commit c188a25 (Task 2): FOUND
