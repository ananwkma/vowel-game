---
phase: 20-codebase-cleanup
plan: "05"
subsystem: ui
tags: [hunt, index, cleanup, shared-js, section-markers]

# Dependency graph
requires:
  - "20-01": PWA head tags in place
  - "20-02": shared.js created
provides:
  - "hunt.html restructured: shared.js integrated, SECTION markers, IS_DEBUG gating"
  - "index.html minor cleanup: shared.js script tag added"
  - "ladder.html: additional shared.js integration and section marker audit"
affects: []

key-files:
  created: []
  modified:
    - hunt.html
    - ladder.html
    - index.html

key-decisions:
  - "hunt.html and ladder.html both migrated to shared.js — game-specific seeds (HUNT_DATE_SEED, LADDER_DATE_SEED) alias shared DATE_SEED as base"
  - "All console.log calls in hunt.html gated behind IS_DEBUG — production silent"
  - "Standard SECTION: [NAME] markers applied throughout hunt.html for engine, state, and UI sections"
  - "node_modules accidentally committed in this plan's commit — removed in follow-up chore commit"

requirements-completed: []

# Metrics
duration: ~8 minutes
completed: 2026-03-02
---

# Phase 20 Plan 05: hunt.html + index.html Restructure Summary

**hunt.html and index.html restructured; shared.js integrated into hunt and ladder; section markers standardized**

## Performance

- **Duration:** ~8 minutes
- **Completed:** 2026-03-02
- **Tasks:** 2 tasks executed
- **Files modified:** 3 (hunt.html, ladder.html, index.html)

## What Was Built

### hunt.html
- `<script src="/shared.js"></script>` added before game script block
- Inline `seededRandom`, `DATE_SEED`, `IS_DEBUG`, `DailyStatus` removed (~44 lines)
- `HUNT_DATE_SEED` updated to use `DATE_SEED + '_hunt_v1'` alias pattern
- All `console.log` calls gated behind `if (IS_DEBUG)` — production silent
- Standard `SECTION: [NAME]` markers applied throughout (engine, state, UI, events, init)

### ladder.html (additional audit)
- Shared.js integration completed — `seededRandom`, `DATE_SEED`, `IS_DEBUG` removed inline
- `LADDER_DATE_SEED` aliased from shared `DATE_SEED`
- Debug log ordering fixed; `SECTION: RESPONSIVE` marker added

### index.html
- Minor cleanup: `<script src="/shared.js"></script>` added; stale comments removed

## Issues Encountered

- Agent hit API rate limit before writing SUMMARY.md — summary written manually post-session
- `node_modules/` accidentally included in the refactor commit (`f6aa99a`) — removed in follow-up `chore` commit (`40add0d`)

---
*Phase: 20-codebase-cleanup*
*Completed: 2026-03-02*
