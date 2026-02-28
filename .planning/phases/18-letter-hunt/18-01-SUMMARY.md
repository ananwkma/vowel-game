---
phase: 18-letter-hunt
plan: "01"
subsystem: hunt.html
tags: [letter-hunt, word-search, css-grid, canvas, seeded-prng, two-phase-timer, daily-puzzle]
dependency_graph:
  requires: [styles/design-tokens.css]
  provides: [hunt.html — full game skeleton, puzzle engine, and daily grid render]
  affects: [index.html — hub reads wordGames_dailyStatus written by DailyStatus.markCompleted('hunt')]
tech_stack:
  added: [Canvas 2D API (lasso overlay), Pointer Events API (drag — wired in Plan 02)]
  patterns:
    - seededRandom (Math.imul Murmurhash variant) — copied from ladder.html
    - DATE_SEED with _hunt_v1 suffix — game-namespaced daily seed
    - DailyStatus — verbatim copy from cipher.html
    - HuntResult — mirrors LadderResult persistence pattern
    - placeWords — backtracking grid placement, 200 attempts/word, 20 grid retries
key_files:
  created: [hunt.html]
  modified: []
decisions:
  - key: GOBLIN replaces HAMMERHEAD in SHARKS category
    why: HAMMERHEAD is 10 chars, violates ≤8-char constraint required for 8x8 fallback grid
  - key: Tasks 1 and 2 combined in one commit (d5a7911)
    why: Both tasks write to the same file; splitting into two separate file states would require an intermediate partial-JS version that does not render correctly
metrics:
  duration: "~4 min"
  completed: "2026-02-27"
  tasks_completed: 2
  files_created: 1
  files_modified: 1
  commit_count: 2
---

# Phase 18 Plan 01: Letter Hunt HTML Skeleton, CSS, Corpus, and Puzzle Engine Summary

**One-liner:** Full hunt.html built — seeded 10x10 word-search grid with 22 categories, two-phase timer, pip progress, category mystery display, and daily deterministic puzzle generation.

## What Was Built

`hunt.html` replaces the "Coming soon" placeholder with a complete, fully structured single-file game implementation ready for Plan 02's drag selection wiring.

### HTML Structure
- `#back-link` — fixed top-left LEXICON link (matches cipher.html/ladder.html)
- `#app` — max-width 480px centered column
- `#game-header` — HUNT title, ? help button, 6 pips (3+separator+3)
- `#game-content` — `#grid-container` holding `#letter-grid` (CSS grid) + `#lasso-canvas` (absolute overlay)
- `#game-footer` — category display (??? on load), dual timer row (Easy/Hard), Hint + Give Up buttons
- `#results-screen` — fixed overlay (hidden), complete with times, word list, pip summary, share button
- `#help-modal` — instructions overlay

### CSS (all 14 sections with section comments)
- Google Fonts import (Playfair Display + Lato)
- CSS variable bridge from design-tokens.css to hunt-specific names
- Grid: `display: grid; grid-template-columns: repeat(var(--grid-size), var(--cell-size))` with `gap: 2px`
- Cell states: `.active` (amber), `.found` (sage green), `.found-hint` (dusty rose), `.dimmed` (opacity 0.45), `.shake` animation
- Pip states: `.solved` (sage green), `.hinted` (dusty rose), `.pip-pop` animation
- Animations: `stamp-reveal` (scale 3→1 bounce for category reveal), `cell-shake` (translateX wiggle), `pip-pop` (scale 0→1.3→1), `hint-pulse`

### Word Corpus (22 categories, all words ≤ 8 chars)
PLANETS, METALS, DANCES, FRUITS, COLORS, SPORTS, BIRDS, TREES, TOOLS, GEMS, OCEANS, MONTHS, SPICES, CHEESES, FLOWERS, CAPITALS, ANIMALS, INSECTS, FABRICS, RIVERS, SHARKS, CHEERS

### JS Engine
- `seededRandom(seedStr)` — Math.imul Murmurhash variant, copied verbatim from ladder.html
- `DATE_SEED` — `YYYY-MM-DD_hunt_v1` for deterministic daily puzzle
- `chooseGridSize()` — tries 10x10, falls back to 8x8 if cellSize < 28px
- `placeWords(words, gridSize, rng)` — backtracking placement, 200 attempts/word, random filler fill
- `getDailyPuzzle(rng)` — seeded category selection, returns `{category, words:[{word,phase}...]}`
- Timer system: `startEasyTimer`, `stopEasyTimer`, `startHardTimer`, `stopHardTimer`, `formatTime(ms)`
- `renderGrid`, `resizeCanvas`, `renderCategoryDisplay`, `renderPips` — DOM render functions
- `DailyStatus` — verbatim copy from cipher.html (key: `wordGames_dailyStatus`)
- `HuntResult` — localStorage save/load for daily result persistence
- Boot: DOMContentLoaded selects grid size → seeds puzzle → places words with 20 retries → renders grid/pips/category → starts easy timer

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Replaced HAMMERHEAD (10 chars) with GOBLIN in SHARKS category**
- **Found during:** Post-task word length verification
- **Issue:** Plan requires all words ≤ 8 characters (for 8x8 fallback grid fit). HAMMERHEAD is 10 characters.
- **Fix:** Replaced with GOBLIN (6 chars), a valid shark species
- **Files modified:** hunt.html
- **Commit:** 24ebb6d

### Scope Notes

- Tasks 1 and 2 committed together (d5a7911) — both modify hunt.html; a partial-JS intermediate commit would not render correctly. The fix commit (24ebb6d) serves as the Task 2 verification commit.
- `setupDragSelection()` is a stub (single comment) as specified — full Pointer Events wiring is Plan 02's scope.
- `setupHintButton()` is a stub — full hint logic is Plan 02's scope.
- Results screen is populated from `showResults()` but drag-to-select word matching is Plan 02's scope.

## Self-Check: PASSED

| Item | Status |
|------|--------|
| hunt.html exists | FOUND |
| 18-01-SUMMARY.md exists | FOUND |
| Commit d5a7911 (main impl) | FOUND |
| Commit 24ebb6d (word fix) | FOUND |
| All 22 categories ≤ 8 chars | VERIFIED |
| 1362 lines (≥ 200 min) | VERIFIED |
