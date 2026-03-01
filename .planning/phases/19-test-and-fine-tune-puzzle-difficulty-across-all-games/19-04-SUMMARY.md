---
phase: 19-test-and-fine-tune-puzzle-difficulty-across-all-games
plan: "04"
subsystem: ui
tags: [cipher, hunt, ladder, play-test, bug-fixes, polish]

# Dependency graph
requires:
  - "19-01": cipher tuning (pre-reveal, repetition filter, ?date= override)
  - "19-02": ladder tuning (3-4 step constraint, ?date= override)
  - "19-03": hunt tuning (moderate-stretch hard words, ?date= override)
provides:
  - "Play-test verdict: all three games approved"
  - "Cipher: anchor letter styling, undo/restart buttons, fresh-load, scaled pre-reveal, word spacing"
  - "Hunt: instructions rewrite, elegant category reveal animation, SEAS/SHARKS category fixes, mobile grid sizing, drag ghost fix"
  - "Ladder: COMMON_ADJACENCY BFS for all-recognizable intermediate words"
affects: []

key-files:
  created: []
  modified:
    - cipher.html
    - hunt.html
    - ladder.html

key-decisions:
  - "Anchor letters use var(--color-success) green — gold was too close to selected (amber) state"
  - "solved % excludes anchor (pre-revealed) letters — player only scored on what they actually solved"
  - "shakeAndClear clears selectedCells synchronously — delayed state mutation was causing ghost selection race"
  - "chooseGridSize() now height-aware — reserves 260px for chrome, forces cell ≥26px, prevents overflow on iPhone SE"
  - "give-up bar placed inside <button> as <span> child — overflow:hidden on button correctly clips bar"
  - "Ladder BFS for path measurement uses COMMON_ADJACENCY — guarantees no SLART-type obscure intermediates"
  - "Hunt category animation: letter-spacing expand→contract replaces scale-slam, ease-out-expo, no glow"
  - "OCEANS→SEAS (CORAL is a sea, not an ocean); SHARKS WHALE→BASKING (whale is not a shark)"

requirements-completed:
  - DIFF-VERIFY-01

# Metrics
duration: ~4 hours (multi-session play-test with iterative fixes)
completed: 2026-03-01
---

# Phase 19 Plan 04: Human Play-test Verification Summary

**All three games play-tested across multiple dates; 9 bugs and UX issues identified and fixed; difficulty verdict: approved**

## Performance

- **Duration:** Multi-session (~4 hours including iterative fixes)
- **Completed:** 2026-03-01
- **Tasks:** 13 fix commits across 3 files
- **Files modified:** 3 (cipher.html, hunt.html, ladder.html)

## Play-test Verdict

### Cipher — APPROVED (with fixes)
- Pre-reveal letters present on all dates; repetition ratio ≥ 0.35 confirmed
- **Issues found and fixed:**
  - Anchor letter color (#C8A96E gold) too close to selected (amber) → changed to `var(--color-success)` sage green
  - Solved % included pre-revealed letters, inflating score → anchors excluded from numerator and denominator
  - Give-up progress bar overflowed button bounds → moved `<span>` inside `<button>` where `overflow:hidden` applies correctly
  - Page load restored previous session's progress → removed `CipherProgress.load()` restore block; every load now starts fresh
  - No way to undo a wrong guess → added `guessHistory` stack, ↩ undo button
  - No way to reset the puzzle → added ↺ restart button (clears localStorage + DailyStatus entry, re-inits)
  - Pre-reveal count was fixed at 3 regardless of quote length → scaled: <60 chars→max 2, 60-100→max 3, >100→max 4
  - Word spacing too tight → `#quote-display` gap 14px → 24px

### Ladder — APPROVED (with fix)
- 3–4 step optimal paths confirmed across tested dates
- **Issue found and fixed:**
  - BFS for path-length measurement used full 15,921-word ADJACENCY — obscure intermediate words (e.g. SLART) could appear in the "optimal" path → switched to COMMON_ADJACENCY (809 words) for BFS; all intermediate words now recognizable

### Hunt — APPROVED (with fixes)
- Hard words across tested categories rated recognizable-but-challenging
- **Issues found and fixed:**
  - Instructions step 4 said "Tap ?" — hint button is labelled "hint" not "?" → updated text
  - No direction note in instructions → added step 3: "Words run left-to-right or top-to-bottom only"
  - Category reveal animation slammed in from scale(5) with bounce — didn't fit the calm aesthetic → replaced with letter-spacing contract animation (0.45em → 0.12em, 700ms ease-out-expo)
  - OCEANS category contained CORAL (not an ocean) → renamed to SEAS; words: NORTH/RED/BLACK + CORAL/BERING/AEGEAN
  - SHARKS category contained WHALE (not a shark) → replaced with BASKING; this also fixed a reported win-screen bug
  - Grid overflowed viewport on mobile (iPhone SE) — `chooseGridSize()` only considered width → added height constraint (window.innerHeight - 260px reserved), cells down to 26px min
  - Quick drag after wrong guess left cells stuck in `active` state → root cause: `shakeAndClear` 400ms timeout set `selectedCells=[]` mid-drag; fix: clear state synchronously on wrong guess, timeout is animation-only

## Task Commits

1. `fix(cipher): anchor styling, undo/restart, fresh-load, scaled pre-reveal, wider word spacing` — 3cf9552
2. `fix(hunt): instructions, category animation, SEAS/SHARKS fix, subtitle reveal` — a696a88
3. `fix(ladder): use COMMON_ADJACENCY for BFS optimal path measurement` — 8451950
4. `fix(cipher): anchor color green, exclude anchors from solved %` — b254cdc
5. `fix(hunt): replace slamming category animation with elegant letter-spacing reveal` — 3cfc3e9
6. `fix(cipher): clip give-up progress bar to button bounds` — 1dffa9c
7. `fix(hunt): height-aware grid sizing + drag ghost letters bug` — a217b12
8. `fix(cipher): move give-up bar inside button element` — e95cef2
9. `fix(hunt): clear drag selection state immediately on wrong guess` — 77a18e3

## Files Created/Modified

- `cipher.html` — anchor class, guessHistory, undo/restart buttons, fresh-load, scaled pre-reveal, word gap, give-up bar fix, anchor % exclusion
- `hunt.html` — instructions rewrite, category animation, SEAS/SHARKS, subtitle, height-aware grid, drag state fix
- `ladder.html` — COMMON_ADJACENCY in BFS path measurement

## Decisions Made

- Anchor letters green (`var(--color-success)`) — semantically correct (pre-revealed = "known/solved") and visually distinct from amber selected state
- `calculatePercent()` filters `preRevealNums` from both numerator and denominator — anchors were free, shouldn't count toward score
- `shakeAndClear` clears game state synchronously — no delayed `selectedCells=[]`; avoids the race where a new drag's state gets wiped by a prior timeout
- `chooseGridSize()` subtracts 260px for non-grid chrome — conservative estimate that prevents overflow on both iPhone SE (URL bar visible) and iPhone 12
- Give-up `<span>` inside `<button>` — `position:absolute; height:100%` resolves correctly against the button's own padding box; container `overflow:hidden` was unreliable without explicit height
- SEAS is factually accurate for all 6 words (Coral Sea is a named sea); BASKING shark is well-known and 7 chars (fits 8×8 grid)
- Letter-spacing animation fits the Lexicon typographic aesthetic; scale-slam was too dramatic

## Deviations from Plan

Plan 04 was a human verification checkpoint only. The play-test revealed 9 actionable issues that were fixed iteratively during the session. All fixes are within Phase 19's difficulty-calibration scope.

## Issues Encountered

All issues were resolved within this plan. No blockers remain.

## Overall Phase 19 Verdict

**APPROVED.** All three games produce consistent, appropriately-challenging daily puzzles:
- Cipher: accessible start (anchor letters + pre-reveal), meaningful challenge, satisfying completion
- Ladder: 3-4 step paths, all intermediate words recognizable common English words
- Hunt: hard words create "oh right!" recognition moment without vocabulary frustration; grid fits mobile

Phase 19 complete. v2.0 Word Game Collection ready to ship.

---
*Phase: 19-test-and-fine-tune-puzzle-difficulty-across-all-games*
*Completed: 2026-03-01*
