# Project State: Word Game Collection

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-25)

**Core value:** Players can instantly understand and interact with any puzzle — the mechanics are intuitive, the win/lose feedback is immediate and satisfying.
**Current focus:** Phase 14 — Hub + VOWEL Migration

## Current Position

Phase: 14 of 16 (Hub + VOWEL Migration)
Plan: — of TBD in current phase
Status: Ready to plan
Last activity: 2026-02-25 — v2.0 roadmap created (phases 14–16)

Progress: [░░░░░░░░░░] 0% (v2.0 — 0/3 phases complete)

## Performance Metrics

**Velocity (v2.0):**
- Total plans completed: 0
- Average duration: —
- Total execution time: —

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 14. Hub + VOWEL Migration | TBD | — | — |
| 15. Word Ladder | TBD | — | — |
| 16. Letter Hunt | TBD | — | — |

*Updated after each plan completion*

## Accumulated Context

### Decisions

(Full log in PROJECT.md Key Decisions)

Recent decisions for v2.0:
- Hub first: index.html becomes portal; VOWEL relocates to vowel.html — prevents routing breakage if done mid-milestone
- Hash-based routing (#/vowel, #/ladder, #/hunt) — GitHub Pages has no server-side routing; hash approach avoids 404s on direct URL navigation
- Canvas (not SVG) for Letter Hunt lasso — better performance on budget mobile; native isPointInPath() for collision detection
- Pointer Events (not separate touch/mouse) for Letter Hunt input — unified handling, fewer edge cases on budget Android
- BFS preprocess at startup (pattern hashmap c*t → [cat,cut,cot]) — avoids 5-15s freeze on first puzzle generation on mobile
- Shared CSS design tokens in Phase 14 — foundation all subsequent games depend on

### Pending Todos

- None.

### Blockers/Concerns

- Phase 14 risk: Breaking VOWEL during hub migration. Mitigation: test vowel.html independently before integrating hub; validate on actual GitHub Pages URL.
- Phase 15 risk: BFS connected component gaps in 2710-word list. Mitigation: run union-find analysis during Phase 15; validate 100 daily seeds produce solvable puzzles.
- Phase 16 risk: Mobile lasso UX on budget devices. Mitigation: profile on Moto G4 equivalent; target >30 FPS over 30-minute session.

## Session Continuity

Last session: 2026-02-25
Stopped at: Roadmap created — ready to plan Phase 14
Resume file: None
