---
phase: 20-codebase-cleanup
plan: "02"
subsystem: shared-utilities, vowel-game
tags: [cleanup, shared-js, refactor, section-ordering]
dependency_graph:
  requires: ["20-01"]
  provides: ["shared.js globals: seededRandom, DATE_SEED, IS_DEBUG, DailyStatus"]
  affects: ["vowel.html", "ladder.html", "cipher.html", "hunt.html"]
tech_stack:
  added: []
  patterns: ["shared.js plain-script pattern for vanilla JS utilities"]
key_files:
  created:
    - shared.js
  modified:
    - vowel.html
decisions:
  - "VOWEL_DATE_SEED = DATE_SEED (no _vowel_v1 suffix) — suffix not present in original, adding it would change daily word sequence for existing users; behavior preserved"
  - "Merged two <script> blocks in vowel.html into one for cleaner structure"
  - "All ungated console.log calls gated behind if (IS_DEBUG) to keep console clean in production"
metrics:
  duration: "~17 minutes"
  completed: "2026-03-03"
  tasks_completed: 2
  files_changed: 2
---

# Phase 20 Plan 02: Shared.js Creation and Vowel.html Restructure Summary

shared.js extracted with seededRandom, DATE_SEED, IS_DEBUG, DailyStatus globals; vowel.html restructured with standard SECTION: NAME ordering, shared.js integration, and all ungated console.log calls gated behind IS_DEBUG.

## What Was Built

**Task 1 — Create shared.js:** A new 84-line plain script file at the project root providing four shared globals used by all game pages: `seededRandom` (MurmurHash PRNG), `DATE_SEED` (YYYY-MM-DD from URL or today), `IS_DEBUG` (boolean from ?debug param), and `DailyStatus` (localStorage completion tracking with `markCompleted` and `isCompleted`). Each utility has a JSDoc block explaining its purpose and design rationale.

**Task 2 — Restructure vowel.html:** Complete readability restructure of the 2440-line vowel.html:
- Added `<script src="/shared.js"></script>` before the game script block
- Removed inline `seededRandom()` function (22 lines)
- Removed inline `const DATE_SEED` IIFE (7 lines)
- Removed inline `const IS_DEBUG` declaration (1 line)
- Removed inline `const DailyStatus` object definition (18 lines)
- Replaced with `const VOWEL_DATE_SEED = DATE_SEED` (game-specific alias from shared.js value)
- Updated `DailyEngine.dateSeed` and `getDailyWords()` to use `VOWEL_DATE_SEED`
- Renamed all numbered JS section headers (`SECTION 1:`, `SECTION 2.5:`, `SECTION 3.5:`, etc.) to standard `SECTION: NAME` format
- Added `SECTION: RESPONSIVE` header before existing `@media` queries at end of `<style>` block
- Added `SECTION: CONSTANTS & CONFIG`, `SECTION: UTILITY FUNCTIONS`, `SECTION: DOM REFERENCES` stubs
- Gated 10 ungated `console.log` calls behind `if (IS_DEBUG)`
- Merged two `<script>` blocks into one

## Verification Results

```
shared.js: true
no inline seededRandom: true
no inline DailyStatus obj: true
has VOWEL_DATE_SEED: true
old section headers remaining: 0 []
SECTION: count: 41 (> 20 required)
ungated console.log: 0
```

Node eval test: `function string boolean object` — PASSED.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] VOWEL_DATE_SEED without _vowel_v1 suffix**
- **Found during:** Task 2
- **Issue:** Plan says "The `_vowel_v1` seed namespace suffix (already present, maintain it)" but no such suffix existed in the original file. Adding `_vowel_v1` would change the daily word sequence for all existing users.
- **Fix:** Used `const VOWEL_DATE_SEED = DATE_SEED` (exact same seed value, just renamed) to preserve behavior while eliminating the name collision with shared.js's `DATE_SEED` global.
- **Files modified:** vowel.html
- **Commit:** 9a60b7c

**2. [Rule 2 - Missing] Duplicate `const gameBoard` declaration**
- **Found during:** Task 2 (when adding DOM REFERENCES section)
- **Issue:** Adding `const gameBoard` in the new DOM REFERENCES section would create a duplicate declaration since the STATE section already had one.
- **Fix:** Removed the redundant declaration from the STATE section (kept the one in DOM REFERENCES).
- **Files modified:** vowel.html
- **Commit:** 9a60b7c

## Commits

| Hash | Message |
|------|---------|
| 06b9ff4 | feat(20-02): create shared.js with seededRandom, DATE_SEED, IS_DEBUG, DailyStatus |
| 9a60b7c | feat(20-02): restructure vowel.html to use shared.js and standard section ordering |

## Self-Check: PASSED

All files created and commits verified:
- shared.js: FOUND
- vowel.html: FOUND (modified)
- 20-02-SUMMARY.md: FOUND
- Commit 06b9ff4: FOUND
- Commit 9a60b7c: FOUND
