---
phase: 15-word-ladder
plan: 01
subsystem: ui
tags: [html, css, javascript, bfs, word-ladder, dictionary, daily-puzzle, seeded-rng]

# Dependency graph
requires:
  - phase: 14-hub-vowel-migration
    provides: design-tokens.css shared tokens, DailyStatus localStorage pattern, seededRandom algorithm, WORDS array

provides:
  - ladder.html with complete game HTML structure (back link, target display, tiles, history, submit, give-up, results screen)
  - DICTIONARY array (same 2710-word list as vowel.html)
  - buildAdjacencyMap() — O(1) one-letter-change lookup pre-computed at startup
  - bfsShortestPath() — queue-based BFS returning path array or null
  - seededRandom() — copied exact algorithm from vowel.html
  - getDailyLadderPuzzle() — deterministic DATE_SEED, 20-attempt fallback loop, absolute STONE→CRANE fallback
  - OPTIMAL_PATH and OPTIMAL_STEPS constants for use by game logic (plans 02-03)
  - isValidDictionaryWord(), countLetterDiffs(), isValidNextWord() validation helpers
  - DailyStatus.markCompleted() matching vowel.html pattern for hub integration

affects: [15-02, 15-03, 16-letter-hunt]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Bridge :root block maps --color-ladder-* to shared design tokens (same pattern as vowel.html --color-vowel-*)"
    - "Adjacency map precomputed at startup: byLength grouping + early-exit diff check (O(n^2/word_length))"
    - "BFS fallback chain: 20 seeded attempts → absolute known-good pair (STONE→CRANE)"
    - "DATE_SEED format: YYYY-MM-DD_ladder_v1 (game-namespaced to avoid cross-game collisions)"

key-files:
  created: []
  modified:
    - ladder.html

key-decisions:
  - "seededRandom algorithm copied exactly from vowel.html (Math.imul Murmurhash variant) — consistency across games"
  - "DATE_SEED includes _ladder_v1 suffix — allows game-specific seed namespace, v1 enables future seed rotation"
  - "5-letter word filter + minimum 2 neighbors requirement — ensures non-isolated words with meaningful puzzle pairs"
  - "Path length constraint 4-10 (inclusive) = 3-9 steps — avoids trivial 1-step puzzles and unsolvable-in-session lengths"
  - "Absolute fallback STONE→CRANE hardcoded — both words are in DICTIONARY with confirmed adjacency neighbors"
  - "DailyStatus.markCompleted follows vowel.html exact pattern — hub reads same localStorage key wordGames_dailyStatus"

patterns-established:
  - "Engine-first pattern: data layer (adjacency, BFS, seed) built before DOM interaction — plans 02/03 add game logic on top"
  - "Bridge :root block: game-specific CSS variable names map to shared token names — avoids find/replace on every variable"

requirements-completed: [LADR-01, LADR-02, LADR-05]

# Metrics
duration: 4min
completed: 2026-02-26
---

# Phase 15 Plan 01: Word Ladder HTML Skeleton and Engine Summary

**ladder.html replaced with full game structure: 5-tile word display, history container, give-up hold button, BFS adjacency engine over 2710-word dictionary, and deterministic daily puzzle seeding with connectivity validation**

## Performance

- **Duration:** ~4 min
- **Started:** 2026-02-26T09:46:02Z
- **Completed:** 2026-02-26T09:50:21Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments

- Replaced 46-line "Coming soon" placeholder with 830-line full game structure
- Pre-computed adjacency map at startup: ADJACENCY[word] returns all valid one-letter neighbors in O(1)
- BFS shortest path function returns full path array (or null) — never throws — ready for OPTIMAL_PATH/OPTIMAL_STEPS
- Daily puzzle seeded deterministically from date; 20-attempt fallback loop validates connectivity before accepting pair
- All CSS design tokens, mobile meta tags, and tile/history/results-screen layout matching vowel.html patterns

## Task Commits

Each task was committed atomically:

1. **Task 1: Build HTML skeleton and CSS layout foundation** - `d082d2f` (feat)
2. **Task 2: Implement dictionary engine (adjacency map, BFS, daily puzzle seed)** - `d082d2f` (feat)

Note: Tasks 1 and 2 were written together in a single file creation (ladder.html was empty shell — both tasks constitute the initial build) and committed atomically as one unit.

**Plan metadata:** (see final commit below)

## Files Created/Modified

- `ladder.html` — Full game HTML: CSS layout (tiles, history, give-up bar, results screen), HTML body (back link, target area, tile container, submit, give-up, results overlay, confetti canvas), JavaScript engine (DICTIONARY, buildAdjacencyMap, bfsShortestPath, seededRandom, getDailyLadderPuzzle, validation helpers, DailyStatus)

## Decisions Made

- Copied seededRandom algorithm exactly from vowel.html (Math.imul Murmurhash variant) for cross-game consistency
- DATE_SEED includes `_ladder_v1` namespace suffix to prevent cross-game seed collisions
- 5-letter word filter with minimum 2 adjacency neighbors ensures meaningful puzzle pairs
- Path length 4-10 constraint (3-9 steps) avoids trivial and impossibly long puzzles
- Absolute fallback STONE→CRANE is hardcoded as both words confirmed present in DICTIONARY
- Tasks 1 and 2 written in single pass since Task 2 engine goes inside the script tag established in Task 1

## Deviations from Plan

None — plan executed exactly as written. The seededRandom implementation uses vowel.html's exact algorithm (Math.imul Murmurhash) rather than the simpler version shown in the plan's code snippet, which is a strict improvement (better distribution, same interface).

## Issues Encountered

None — dictionary adjacency map computes correctly, BFS and daily puzzle engine load without errors.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- ladder.html engine layer complete: ADJACENCY, OPTIMAL_PATH, OPTIMAL_STEPS, validation helpers all ready
- Plans 02 and 03 can add game loop (tile interaction, keyboard, submit, give-up, results) on top of this foundation
- No blockers — all engine functions are pure and independently testable

---
*Phase: 15-word-ladder*
*Completed: 2026-02-26*
