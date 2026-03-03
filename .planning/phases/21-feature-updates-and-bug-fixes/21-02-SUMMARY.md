---
phase: 21-feature-updates-and-bug-fixes
plan: "02"
subsystem: ui
tags: [hunt, corpus, seeding, categories]

# Dependency graph
requires:
  - "20-05": hunt.html restructured with shared.js
provides:
  - "60-entry CATEGORIES corpus (was 22)"
  - "60-day rolling window no-repeat seeding with Fisher-Yates"
affects: []

key-files:
  created: []
  modified:
    - hunt.html

key-decisions:
  - "Window size set to 60 days matching corpus size — every day in the window shows a unique category"
  - "Version bump _hunt_v1 → _hunt_v2_offset_N intentional — old seeding had consecutive-day collision risk"
  - "HUNT_DATE_SEED IIFE reconstructs date from DATE_SEED string (not _overrideDate) — consistent with existing hunt.html date pattern"
  - "Fisher-Yates shuffle keyed on HUNT_DATE_SEED + '_shuffle'; dayOfWindow = daysSinceEpoch % 60"
  - "rng parameter kept in getDailyPuzzle signature (used by grid generation downstream)"

requirements-completed: []

# Metrics
duration: ~10 minutes (Task 1+partial Task 2 by subagent; Task 2 Fisher-Yates fix by main thread)
completed: 2026-03-03
---

# Phase 21 Plan 02: Hunt Feature Updates Summary

**Hunt: 60-category corpus expansion + 60-day no-repeat rolling window seeding**

## Performance

- **Duration:** ~10 minutes
- **Completed:** 2026-03-03
- **Tasks:** 2 tasks executed
- **Files modified:** 1 (hunt.html)
- **Commits:** 2 atomic commits (subagent: corpus + DATE_SEED; main thread: Fisher-Yates)

## What Was Built

### Task 1: CATEGORIES corpus expansion (22 → 60)
Added 38 new categories in 4 thematic batches:
- **Batch 2 — Food & drink (23-32):** NUTS, PASTA, BREAD, CAKES, HERBS, TEA, FISH, GRAINS, BEANS, MUSHROOMS
- **Batch 3 — Animals (33-42):** DOGS, CATS, HORSES, PRIMATES, REPTILES, WHALES, SPIDERS, BEETLES, FROGS, PENGUINS
- **Batch 4 — Geography (43-52):** DESERTS, VOLCANOES, ISLANDS, MOUNTAINS, LAKES, OCEANS, FORESTS, BAYS, CAPES, STRAITS
- **Batch 5 — Knowledge (53-60):** COMETS, ELEMENTS, BALLET, MARTIAL, MUSIC, DYES, FIBERS, SCRIPTS

No duplicate category names (used COMETS/BALLET/MARTIAL/FIBERS instead of duplicating existing PLANETS/DANCES/SPORTS/FABRICS).

### Task 2: 60-day rolling window seeding
- Added `daysSinceEpoch()` helper (epoch: 2000-01-01 UTC)
- `HUNT_DATE_SEED` IIFE updated to compute `_hunt_v2_offset_${windowOffset}` (rotates every 60 days)
- `getDailyPuzzle()` updated: Fisher-Yates shuffle with `HUNT_DATE_SEED + '_shuffle'` seed, picks `shuffledCategories[dayOfWindow]` where `dayOfWindow = daysSinceEpoch % 60`

## Cross-game Verification

Consecutive-date test (?date= override):
- 2026-03-01 → 2026-03-02 → 2026-03-03: different categories confirmed
- Same date repeated: same category (deterministic)

## Issues Encountered

- Subagent hit API rate limit after committing corpus and DATE_SEED changes; Fisher-Yates getDailyPuzzle fix applied in main thread

---
*Phase: 21-feature-updates-and-bug-fixes*
*Completed: 2026-03-03*
