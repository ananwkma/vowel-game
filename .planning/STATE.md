# Project State: Word Game Collection

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-25)

**Core value:** Players can instantly understand and interact with any puzzle — the mechanics are intuitive, the win/lose feedback is immediate and satisfying.
**Current focus:** Phase 18 — Letter Hunt

## Current Position

Phase: 18 of 18 (Letter Hunt)
Plan: 2 of TBD in current phase
Status: In progress — 18-02 complete
Last activity: 2026-02-27 — 18-02 Drag selection (Pointer Events + canvas trace), word evaluation, phase state machine (easy→reveal→hard), two-phase timers, hint system, give-up

Progress: [████████░░] 80% (v2.0 — 4/5 phases complete)

## Performance Metrics

**Velocity (v2.0):**
- Total plans completed: 10
- Average duration: ~3.5 min
- Total execution time: ~35 min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 14. Hub + VOWEL Migration | 3 | ~8 min | ~2.3 min |
| 15. Word Ladder | 3 | ~10 min | ~3.3 min |
| 16. Ladder Polish | 1 | ~3 min | ~3.0 min |
| 17. Cipher | 2 | ~10 min | ~5.0 min |
| 18. Letter Hunt | 2+ | ~6 min | ~3 min |

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
- [15-03] showResults robust logic: Calculates steps, delta, and playerPath from gameState if not provided, allowing simple calls
- [15-03] Staggered reveal: async function with await new Promise(resolve => setTimeout(resolve, 300)) for optimal path
- [15-03] Result persistence: LadderResult object for saving/loading finished game data (solved, steps, playerPath)
- [15-03] Progress persistence: LadderProgress object for saving playerPath after every valid step/undo
- [15-03] Canvas-less confetti: Ported CSS-based confetti from vowel.html using fixed-position divs
- [15-03] Arrow connectors: Added ::after content with ↓ symbols for the optimal path to reinforce the "steps" metaphor.
- [16-01] Tightened optimal step range from 3–7 to 4–6 (path.length 5–7 words)
- [16-01] Added <=10 step cap on the common-word path (commonPath.length <= 11)
- [16-01] Replaced broken STONE→CRANE fallback with SCARE→STILL (verified 4-step common-word path)
- [16-01] Expanded PUZZLE_WORDS by ~230 net new words to densify common-word graph
- [17-01] Compact 38x38px blocks, word-group rendering, daily quote corpus, seeded mapping, subtle author hint (0.5 opacity)
- [17-02] Selection glow (amber #D4A574), letter assignment with duplicate clearing, auto-win detection, 3s hold-to-give-up, 1.5s animated decode, results overlay (Solved-sage vs Revealed-rose)
- [18-01] Tasks 1+2 committed together — intermediate partial-JS file would not render; fix commit captures word-length correction
- [18-01] GOBLIN replaces HAMMERHEAD in SHARKS category — HAMMERHEAD is 10 chars, violates ≤8-char grid constraint
- [18-01] DATE_SEED uses _hunt_v1 suffix — game-namespaced, mirrors _ladder_v1 pattern from Phase 15
- [Phase 18-02]: Tasks 1+2 committed together — drag/evaluate/phase logic interleaved through same call chain
- [Phase 18-02]: shakeAndClear snapshot pattern — selectedCells.slice() prevents race condition during 400ms async window
- [Phase 18-02]: endGame() calls showResults() directly — Plan 02 fully testable without Plan 03 results wiring

### Pending Todos

- None.

### Blockers/Concerns

- Phase 18 risk: Mobile lasso UX on budget devices. Mitigation: profile on Moto G4 equivalent; target >30 FPS over 30-minute session.

## Session Continuity

Last session: 2026-02-27
Stopped at: Completed 18-02 (Letter Hunt drag selection, phase state machine, hint system)
Resume file: .planning/phases/18-letter-hunt/18-03-PLAN.md
