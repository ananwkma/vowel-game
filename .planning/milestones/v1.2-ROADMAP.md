# Roadmap: Yellow Blocks Word Game (VOWEL)

## Milestones

- ✅ **v1.0 MVP** — Phases 1–5 (shipped 2026-02-23)
- ✅ **v1.1 Score, Streaks & Mobile Polish** — Phases 6–9 (completed 2026-02-24)
- ✅ **v1.2 Daily Leaderboard** — Phases 10–13 (completed 2026-02-24)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1–5)</summary>
See .planning/milestones/v1.0-ROADMAP.md
</details>

<details>
<summary>✅ v1.1 Score, Streaks & Mobile Polish (Phases 6–9)</summary>
See .planning/milestones/v1.1-ROADMAP.md (to be archived)
</details>

### ✅ v1.2 Daily Leaderboard & Backend Stats (Complete)

**Milestone Goal:** Implement a real backend (Node.js/Express) to store daily puzzle completion times and provide real-time percentile rankings and averages.

- [x] **Phase 10: Research & Architecture** - Setup project structure for backend and define API spec
- [x] **Phase 11: Backend Implementation** - Build Express server, SQLite DB, and Score/Stats APIs
- [x] **Phase 12: Frontend Integration** - Connect game client to backend APIs and display real stats
- [x] **Phase 13: Local Verification** - Validate end-to-end flow in local environment

## Phase Details

### Phase 10: Research & Architecture
**Goal**: Define the technical foundation for the backend and API contracts
**Depends on**: v1.1 Complete
**Requirements**: BE-01 (Partial)
**Success Criteria** (what must be TRUE):
  1. A clear file structure is defined (separating frontend/backend)
  2. `package.json` dependencies are selected (express, sqlite3, etc.)
  3. API Specification is documented (endpoints, payloads, error codes)
  4. Migration strategy from single-file HTML to served static file is planned

### Phase 11: Backend Implementation
**Goal**: Functional API that persists data to SQLite and calculates stats
**Depends on**: Phase 10
**Requirements**: BE-01, BE-02, API-01, API-02
**Success Criteria** (what must be TRUE):
  1. Server starts and connects to SQLite database
  2. `POST /api/scores` successfully saves a record to the DB
  3. `GET /api/stats` returns correct average and count based on DB records
  4. Server serves the `index.html` static file correctly

### Phase 12: Frontend Integration
**Goal**: Game client communicates with the server to submit and fetch data
**Depends on**: Phase 11
**Requirements**: FE-01, FE-02, FE-03
**Plans**: 1 plan
- [x] 12-01-PLAN.md — Connect game client to backend APIs and display real stats

**Success Criteria** (what must be TRUE):
  1. Completing a daily puzzle triggers a network request to submit score
  2. Results screen displays data fetched from the server (not hardcoded)
  3. Game remains playable even if server is offline (graceful degradation)

### Phase 13: Local Verification
**Goal**: Confirm the entire system works as expected in a local dev environment
**Depends on**: Phase 12
**Requirements**: VER-01
**Plans**: 2 plans
- [x] 13-01-PLAN.md — Seed test data into SQLite and verify all API endpoints automated
- [x] 13-02-PLAN.md — Human gameplay verification: full end-to-end flow with real percentile

**Success Criteria** (what must be TRUE):
  1. User can play through the daily puzzle
  2. Score is accurately recorded in backend
  3. User sees their percentile rank compared to other local test data
  4. No regressions in existing gameplay (v1.0/v1.1 features)

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 10. Research & Architecture | v1.2 | 1/1 | Completed | 2026-02-24 |
| 11. Backend Implementation | v1.2 | 3/3 | Completed | 2026-02-24 |
| 12. Frontend Integration | v1.2 | Complete    | 2026-02-25 | 2026-02-25 |
| 13. Local Verification | v1.2 | Complete    | 2026-02-25 | 2026-02-24 |

---
*Roadmap created: 2026-02-19*
*v1.2 roadmap added: 2026-02-24*
