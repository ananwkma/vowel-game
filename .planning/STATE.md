# Project State: Word Game Collection

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-25)

**Core value:** Players can instantly understand and interact with any puzzle — the mechanics are intuitive, the win/lose feedback is immediate and satisfying.
**Current focus:** Phase 15 — Word Ladder

## Current Position

Phase: 15 of 16 (Word Ladder)
Plan: 2 of 3 in current phase
Status: In progress — Plan 02 complete
Last activity: 2026-02-26 — 15-02 Word Ladder tile interaction, stamp animation, history, and give-up hold

Progress: [██░░░░░░░░] 20% (v2.0 — 2/3 phases partially complete)

## Performance Metrics

**Velocity (v2.0):**
- Total plans completed: 4
- Average duration: ~2.5 min
- Total execution time: ~12 min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 14. Hub + VOWEL Migration | 3 | ~8 min | ~2.3 min |
| 15. Word Ladder | 2/3 done | ~9 min | ~4.5 min |
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
- [15-01] seededRandom algorithm copied exactly from vowel.html (Math.imul Murmurhash variant) — consistency across games
- [15-01] DATE_SEED includes _ladder_v1 suffix — game-namespaced to avoid cross-game collisions; v1 enables future rotation
- [15-01] 5-letter word filter + minimum 2 adjacency neighbors — ensures non-isolated words with meaningful puzzle pairs
- [15-01] Path length constraint 4-10 (3-9 steps) with 20-attempt fallback loop before absolute STONE→CRANE fallback
- [15-01] DailyStatus.markCompleted follows vowel.html exact pattern — hub reads same wordGames_dailyStatus localStorage key
- [15-02] DOM references grabbed at script parse time (script at bottom of body, DOM already available)
- [15-02] submitWord awaits stampAnimation() Promise before state update — visual transition completes before tiles re-render
- [15-02] addToHistory(prevWord) called after candidate accepted — stamp metaphor: previous word printed as the completed step
- [15-02] showResults() stub (console.log only) — Plan 03 replaces with full results screen overlay

### Pending Todos

- None.

### Blockers/Concerns

- Phase 14 risk: Breaking VOWEL during hub migration. Mitigation: test vowel.html independently before integrating hub; validate on actual GitHub Pages URL.
- Phase 15 risk: BFS connected component gaps in 2710-word list. Mitigation: 20-attempt seeded fallback + STONE→CRANE absolute fallback now implemented; further union-find analysis can be done in plans 02/03 if needed.
- Phase 16 risk: Mobile lasso UX on budget devices. Mitigation: profile on Moto G4 equivalent; target >30 FPS over 30-minute session.

## Session Continuity

Last session: 2026-02-26
Stopped at: Completed 15-02-PLAN.md (Word Ladder tile interaction, stamp animation, history, give-up hold)
Resume file: .planning/phases/15-word-ladder/15-02-SUMMARY.md
