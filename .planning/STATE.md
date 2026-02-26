# Project State: Word Game Collection

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-25)

**Core value:** Players can instantly understand and interact with any puzzle — the mechanics are intuitive, the win/lose feedback is immediate and satisfying.
**Current focus:** Phase 14 — Hub + VOWEL Migration

## Current Position

Phase: 14 of 16 (Hub + VOWEL Migration)
Plan: 3 of TBD in current phase
Status: In progress — Plan 03 complete
Last activity: 2026-02-25 — 14-03 VOWEL game migrated to vowel.html

Progress: [░░░░░░░░░░] 0% (v2.0 — 0/3 phases complete)

## Performance Metrics

**Velocity (v2.0):**
- Total plans completed: 3
- Average duration: ~2.3 min
- Total execution time: ~8 min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 14. Hub + VOWEL Migration | 3 | ~8 min | ~2.3 min |
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
- [14-01] Token names normalized to semantic (--color-primary vs --color-vowel-bg) for multi-game decoupling
- [14-01] Google Fonts @import placed in design-tokens.css — one link tag covers both font and tokens for all game pages
- [14-02] VOWEL card uses native <a> anchor — no JS needed, works with browser history and accessibility
- [14-02] Inactive cards use <div> not <a> — avoids keyboard focus traps on non-activatable elements
- [14-02] Hub reads wordGames_dailyStatus from localStorage at load time — simple daily completion check
- [14-03] Bridge :root block maps shared tokens to VOWEL-specific names — avoids renaming 2300+ lines of CSS variable references
- [14-03] DailyStatus.markCompleted called at top of showPuzzleComplete() — ensures hub status write happens even if DOM rendering throws
- [14-03] Google Fonts @import kept in vowel.html as deliberate duplicate — resilience if design-tokens.css fails to load

### Pending Todos

- None.

### Blockers/Concerns

- Phase 14 risk: Breaking VOWEL during hub migration. Mitigation: test vowel.html independently before integrating hub; validate on actual GitHub Pages URL.
- Phase 15 risk: BFS connected component gaps in 2710-word list. Mitigation: run union-find analysis during Phase 15; validate 100 daily seeds produce solvable puzzles.
- Phase 16 risk: Mobile lasso UX on budget devices. Mitigation: profile on Moto G4 equivalent; target >30 FPS over 30-minute session.

## Session Continuity

Last session: 2026-02-25
Stopped at: Completed 14-03-PLAN.md (VOWEL game migrated to vowel.html)
Resume file: .planning/phases/14-hub-vowel-migration/14-03-SUMMARY.md
