# Project State: Word Game Collection

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-01)

**Core value:** Players can instantly understand and interact with any puzzle — the mechanics are intuitive, the win/lose feedback is immediate and satisfying.
**Current focus:** Planning next milestone (v2.1 or v3.0)

## Current Position

Phase: 20-codebase-cleanup — Plan 02 of N complete
Status: Phase 20 active — shared.js created; vowel.html restructured with standard section ordering
Last activity: 2026-03-03 — Phase 20, Plan 02 complete; shared.js extracted, vowel.html uses shared utilities

Progress: [██████████] Phase 20 in progress — Plans 20-01, 20-02 complete

## Accumulated Context

### Decisions

- [20-01] PNG icons deferred — manifest references lexicon-192.png and lexicon-512.png to be exported manually from SVG master
- [20-01] apple-mobile-web-app-title unified to "Lexicon" on all pages for consistent home screen branding
- [20-02] VOWEL_DATE_SEED = DATE_SEED (no _vowel_v1 suffix) — suffix not present in original; adding it would change daily word sequence for existing users
- [20-02] All ungated console.log calls in vowel.html gated behind IS_DEBUG for clean production console
- (Full log in PROJECT.md Key Decisions)

### Roadmap Evolution

- v2.0 shipped: Hub + VOWEL, Ladder, Cipher, Hunt, + difficulty calibration

### Pending Todos

- None.

### Blockers/Concerns

- None.

## Session Continuity

Last session: 2026-03-03
Stopped at: Completed 20-codebase-cleanup/20-02-PLAN.md
Resume: Continue with next plan in Phase 20 (codebase cleanup)
