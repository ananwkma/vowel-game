# Requirements: v1.2 — Daily Leaderboard & Backend Stats

**Milestone:** v1.2
**Status:** Active
**Created:** 2026-02-24

---

## v1.2 Requirements

### Backend Infrastructure

- [ ] **BE-01**: Server setup using Node.js and Express to serve the game and API endpoints
- [ ] **BE-02**: Persistence layer using SQLite to store daily puzzle results (date, secondsTaken, timestamp)

### API Endpoints

- [ ] **API-01**: `POST /api/scores`
    - Accepts: `{ date: "YYYY-MM-DD", seconds: integer }`
    - Validates input
    - Stores record in SQLite
    - Returns: 201 Created or error
- [ ] **API-02**: `GET /api/stats?date=YYYY-MM-DD`
    - Returns: `{ average: float, count: integer, percentiles: { p50: int, p90: int } }`
    - Calculates stats from stored records for that date

### Frontend Integration

- [x] **FE-01**: Frontend submits completion time to `POST /api/scores` when the daily puzzle is finished
- [x] **FE-02**: Frontend requests `GET /api/stats` and displays the real average time and user's percentile on the results screen
- [x] **FE-03**: Frontend handles API failures gracefully (e.g., shows "Stats unavailable" or falls back to local view if server unreachable)

### Verification

- [x] **VER-01**: Full end-to-end flow works in local environment (Play → Win → Post → Get Stats → View Results)

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| BE-01       | Phase 10 | Pending |
| BE-02       | Phase 11 | Pending |
| API-01      | Phase 11 | Pending |
| API-02      | Phase 11 | Pending |
| FE-01       | Phase 12 | Complete |
| FE-02       | Phase 12 | Complete |
| FE-03       | Phase 12 | Complete |
| VER-01      | Phase 13 | Complete |

