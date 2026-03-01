# Milestones

## v1.0 MVP (Shipped: 2026-02-24)

**Phases completed:** 5 phases, 18 plans, 0 tasks

**Key accomplishments:**
- (none recorded)

---


## v1.2 Daily Leaderboard & Backend Stats (Shipped: 2026-02-25)

**Phases completed:** 4 phases (10–13), 6 plans
**Files changed:** 22 | **LOC:** ~2,455 (frontend + server) | **Timeline:** 2 days

**Key accomplishments:**
- Node.js/Express server with SQLite database for persisting daily puzzle scores
- POST /api/scores and GET /api/stats endpoints with smoothed percentile calculation
- Frontend real-time stats integration with graceful fallback to simulated percentile
- Full E2E local verification passed — 12/12 automated + human play-through checks
- Mobile gesture redesign: tap-to-pick vowel, drag-to-reposition (finger no longer obscures letters)
- Personal best tracking in localStorage with confetti burst on new record

---


## v2.0 Word Game Collection (Shipped: 2026-03-01)

**Phases completed:** Phases 14–19 (6 phases, 16 plans)
**Files changed:** 8 game files | **Timeline:** 4 days (2026-02-26 → 2026-03-01)

**Key accomplishments:**
- Game collection hub (index.html) with card-based navigation and daily completion status; VOWEL migrated to vowel.html with shared CSS design tokens
- Word Ladder game (ladder.html) — daily BFS-seeded puzzle, one-letter-change path from start→target, optimal path reveal, path history, personal best
- Cipher game (cipher.html) — daily famous quote as number-substitution cipher; pre-reveal anchor letters, undo/restart, give-up with progress bar
- Letter Hunt game (hunt.html) — daily word-search grid, drag-to-select mechanic, two-phase timed scoring with mystery category reveal
- Difficulty calibration across all 3 new games: Cipher repetition filter + scaled pre-reveal, Ladder 3–4 step paths via COMMON_ADJACENCY BFS, Hunt moderate-stretch hard words across 22 categories
- Play-test verification: 9 bugs found and fixed across all three games; all games approved as consistently challenging and mobile-ready

---

