# Yellow Blocks Word Game (VOWEL)

## What This Is

A browser-based word puzzle where the player sees a consonant sequence and must drag yellow vowel blocks into the correct positions to form a valid English word. The title reads "VOWEL" in large serif type.

Shipped v1.0 on 2026-02-23 (Single HTML file).
Shipped v1.1 on 2026-02-24 (Daily puzzles, Score, Streaks).

## Core Value

Players can instantly understand and interact with any puzzle — the drag mechanic is intuitive, the win/lose feedback is immediate and satisfying.

## Current Milestone: v1.2 Daily Leaderboard & Backend Stats

**Goal:** Implement a real backend (Node.js/Express) to store daily puzzle completion times and provide real-time percentile rankings and averages to users.

**Target features:**
- Node.js/Express server serving the game and API
- SQLite database for persisting daily scores
- API to submit scores and retrieve daily statistics
- Frontend displaying real percentile/average data instead of mock data

## Requirements

### Validated

- ✓ Word displayed center-screen with charcoal consonant blocks and amber vowel blank blocks — v1.0
- ✓ Dragging a yellow block reveals a vertical A/E/I/O/U picker column — v1.0
- ✓ Player selects a vowel by clicking it or dragging through the picker — v1.0
- ✓ All vowels correct → green flash + auto-advance — v1.0
- ✓ Give Up → salmon flash + correct vowels revealed + auto-advance — v1.0
- ✓ Infinite random common English words, one at a time, no immediate repeat — v1.0
- ✓ Vowel picker fades in on lift, fades out on release — v1.0 (animation)
- ✓ Blocks bounce/settle on drop; new word swipes in with stagger — v1.0 (animation)
- ✓ Touch-clean on mobile: no selection highlight, no zoom, no loupe — v1.0 (mobile)
- ✓ Single-line layout on 375px screen; max 7-letter words — v1.0 (mobile)
- ✓ Responsive block sizing (52px desktop → 42px mobile); picker scales with blocks — v1.0 (mobile)
- ✓ Smooth drag on mobile via RAF throttling + GPU compositor layer — v1.0 (mobile)
- ✓ Daily 5-word puzzle with deterministic PRNG — v1.1
- ✓ Timer and Give Up penalty system — v1.1
- ✓ Session score and streak persistence — v1.1
- ✓ Results screen with return-tomorrow prompt — v1.1

### Active (v1.2)

- [ ] **BE-01**: Node.js/Express server configured to serve static assets and API routes
- [ ] **BE-02**: SQLite database schema designed to store daily scores (date, time, userId/deviceId)
- [ ] **API-01**: `POST /api/scores` accepts daily completion time
- [ ] **API-02**: `GET /api/stats` returns average time and user's percentile for the current day
- [ ] **FE-01**: Frontend submits score to backend upon completing the daily puzzle
- [ ] **FE-02**: Frontend fetches and displays real stats (avg, percentile) on results screen

### Deferred

- [ ] **ENH-03**: Difficulty filter (short words vs. long words)
- [ ] **ENH-04**: Hint system (reveal one vowel)
- [ ] **ACC-01**: Allow user scaling (pinch-zoom) for visually impaired users

### Out of Scope

- User authentication/login (scores linked to anonymous device ID or just aggregate for now)
- Multiplayer/Social sharing (v2)
- Cloud deployment (v1.2 is local-only verification)

## Context

**Codebase:**
- Frontend: Single file `index.html` (vanilla HTML/CSS/JS)
- Backend: New `server/` directory (Node.js/Express)

**Word list:** 2,710 common English words embedded in JS array.

**Design:** Warm off-white background (#f5f0e8), amber/tan vowel blocks, charcoal consonant blocks.

## Constraints

- **Tech**: Vanilla frontend, Node/Express/SQLite backend.
- **Local First**: v1.2 focuses on local environment; deployment to cloud is a future step.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Single HTML file (v1.0) | No setup friction, works by double-clicking | ✓ Good — trivial deployment |
| SQLite for v1.2 | Simple, file-based, relational power for analytics | TBD |
| Local-only v1.2 | Validate backend logic without deployment complexity | TBD |

---
*Last updated: 2026-02-24 — v1.2 milestone started*
