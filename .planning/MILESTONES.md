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

