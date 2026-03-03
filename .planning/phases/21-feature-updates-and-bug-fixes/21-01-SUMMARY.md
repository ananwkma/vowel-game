---
phase: 21-feature-updates-and-bug-fixes
plan: "01"
subsystem: ui
tags: [cipher, backspace, corpus, seeding, anchor]

# Dependency graph
requires:
  - "20-04": cipher.html restructured with shared.js
provides:
  - "clearLetter() + Backspace/Delete support in Cipher"
  - "200-entry QUOTES corpus (was 42)"
  - "150-day rolling window no-repeat seeding"
  - "Anchor letter rejection with shake animation"
affects: []

key-files:
  created: []
  modified:
    - cipher.html

key-decisions:
  - "Version bump _cipher_v1 → _cipher_v2_offset_N is intentional — old seeding had consecutive-day collisions"
  - "Fisher-Yates shuffle keyed on window-offset seed; dayOfWindow = daysSinceEpoch % 150 for per-day determinism"
  - "anchorLetters tracked as Set<string> separate from preRevealNums (Set<number>) — simpler guard in input handler"
  - "block-rejected animation is horizontal shake (not color flash) — works regardless of selected/unselected block state"
  - "clearLetter() calls CipherProgress.save() to sync localStorage after clearing"

requirements-completed: []

# Metrics
duration: ~15 minutes (executed in main thread after agent rate-limit)
completed: 2026-03-03
---

# Phase 21 Plan 01: Cipher Feature Updates Summary

**Cipher: backspace/delete support, anchor letter protection, 200-quote corpus, 150-day no-repeat seeding**

## Performance

- **Duration:** ~15 minutes
- **Completed:** 2026-03-03
- **Tasks:** 4 tasks executed
- **Files modified:** 1 (cipher.html)
- **Commits:** 4 atomic commits

## What Was Built

### Task 1: clearLetter() + Backspace/Delete support
- `clearLetter(num)` function: deletes `gameState.guesses[num]`, reverts all matching blocks to unsolved state, saves progress, calls `checkWin()`
- Extended `keydown` listener to handle `Backspace` and `Delete` in addition to `Tab`
- Anchor protection: `blockEl.classList.contains('anchor')` guard — backspace on anchor is a no-op
- Undo integration: `guessHistory.push()` before `clearLetter()` so undo restores the cleared letter

### Task 2: QUOTES corpus expansion (42 → 200)
- Added 158 new famous quotes in 5 batches: classic wisdom, literary/philosophical, Churchill/Franklin, modern voices (C.S. Lewis, Mandela, Einstein, Oprah), proverbs/Emerson, Maya Angelou/Confucius/Nietzsche/MLK
- All 42 original quotes retained as first 42 entries

### Task 3: 150-day rolling window seeding
- Added `daysSinceEpoch()` helper (epoch: 2000-01-01 UTC)
- `CIPHER_DATE_SEED` changed from `DATE_SEED + '_cipher_v1'` to IIFE computing `_cipher_v2_offset_${windowOffset}`
- `initGame()` quote selection replaced with Fisher-Yates shuffle (seeded with `CIPHER_DATE_SEED + '_shuffle'`) + `dayOfWindow = daysSinceEpoch % 150` index

### Task 4: Anchor letter rejection
- `let anchorLetters = new Set()` declared alongside `preRevealNums`
- `anchorLetters.add(letter)` called in `preRevealLetters.forEach` alongside `preRevealNums.add(num)`
- `anchorLetters = new Set()` in `restartGame()`
- Input handler guards: if typed char is in `anchorLetters`, add `.block-rejected` CSS class to selected blocks (animationend removes it) and return
- `@keyframes block-rejected`: horizontal ±5px shake over 0.35s

## Issues Encountered

- Subagent hit API rate limit before starting — all 4 tasks executed directly in main thread

---
*Phase: 21-feature-updates-and-bug-fixes*
*Completed: 2026-03-03*
