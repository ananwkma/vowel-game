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


## v2.1 Cleanup & Stability (Shipped: 2026-03-03)

**Phases completed:** Phases 20–21 (2 phases, 9 plans)
**Files changed:** 17 | **LOC:** +1,170 / −263 | **Timeline:** 2 days (2026-03-02 → 2026-03-03)

**Key accomplishments:**
- PWA manifest + PNG home screen icons — all 5 pages installable to iOS/Android; full-bleed amber "L" icon
- `shared.js` extracted — `seededRandom`, `DATE_SEED`, `IS_DEBUG`, `DailyStatus` shared across all games; eliminates duplication
- All 5 HTML files restructured with consistent `SECTION: NAME` CSS/JS ordering and dead code removed
- Cipher: backspace/delete clears letter assignment (all occurrences, anchor-protected); QUOTES corpus 42→200
- Hunt CATEGORIES corpus 22→60; Cipher + Ladder + Hunt all on 60–150-day Fisher-Yates no-repeat seeding
- Post-launch polish: 10+ bugs fixed including give-up score restore, drag backtrack, footer spacing, PWA safe area, iOS callout suppression, anchor count by word length, and hard-words-first game completion

---

