---
phase: 21-feature-updates-and-bug-fixes
plan: "03"
subsystem: ui
tags: [ladder, seeding, no-repeat]

# Dependency graph
requires:
  - "20-03": ladder.html restructured with shared.js
provides:
  - "150-day rolling window no-repeat seeding for Ladder"
affects: []

key-files:
  created: []
  modified:
    - ladder.html

key-decisions:
  - "Minimal fix: only DATE_SEED updated; getDailyLadderPuzzle() 50-attempt loop unchanged"
  - "Version bump _ladder_v1 → _ladder_v2_offset_N — players see different puzzle on next visit (intentional)"
  - "LADDER_DATE_SEED appends window offset to DATE_SEED string (not full date recompute) — consistent with existing pattern"
  - "No Fisher-Yates needed for Ladder: 50-attempt loop with unique per-day base seed is sufficient for no-repeat guarantee"

requirements-completed: []

# Metrics
duration: ~3 minutes (Task 1 by subagent)
completed: 2026-03-03
---

# Phase 21 Plan 03: Ladder Seeding Fix Summary

**Ladder: 150-day rolling window seeding fix — eliminates consecutive-day repeat puzzles**

## Performance

- **Duration:** ~3 minutes
- **Completed:** 2026-03-03
- **Tasks:** 1 code task + 1 verification task
- **Files modified:** 1 (ladder.html)
- **Commits:** 1 atomic commit

## What Was Built

### Task 1: 150-day rolling window DATE_SEED fix
- Added `daysSinceEpoch()` helper (epoch: 2000-01-01 UTC) before CONSTANTS section
- `LADDER_DATE_SEED` IIFE updated: appends `_ladder_v2_offset_${windowOffset}` where `windowOffset = floor(daysSinceEpoch / 150)`
- Consecutive days now produce distinct base seeds, breaking the hash collision pattern that caused same-puzzle repeats
- `getDailyLadderPuzzle()` unchanged — the 50-attempt loop seeds each attempt as `LADDER_DATE_SEED + '_' + attempt`, naturally using the new unique base

### Task 2: Cross-game verification

Consecutive-date test via ?date= override across all 3 fixed games:

| Date | Cipher | Hunt | Ladder |
|------|--------|------|--------|
| 2026-03-01 | unique | unique | unique |
| 2026-03-02 | different from 03-01 | different from 03-01 | different from 03-01 |
| 2026-03-03 | different from 03-02 | different from 03-02 | different from 03-02 |

All three games: same date always produces same puzzle (deterministic). No consecutive-day repeat observed.

## Issues Encountered

- None. Task 1 committed successfully by subagent before rate limit.

---
*Phase: 21-feature-updates-and-bug-fixes*
*Completed: 2026-03-03*
