# Yellow Blocks Word Game (VOWEL)

## What This Is

A browser-based daily word puzzle where the player sees a consonant sequence and must place yellow vowel blocks into the correct positions to form a valid English word. Five words per day, timed with penalties for giving up. Tracks personal best across sessions. Works on mobile and desktop with separate optimised interaction models — tap-to-pick on touch, drag-hover on desktop.

Shipped v1.0 on 2026-02-23 (Single HTML file, core gameplay).
Shipped v1.1 on 2026-02-24 (Daily puzzles, timer, score, streaks).
Shipped v1.2 on 2026-02-25 (Backend stats, personal best, mobile gesture redesign).

## Core Value

Players can instantly understand and interact with any puzzle — the mechanics are intuitive, the win/lose feedback is immediate and satisfying.

## Requirements

### Validated

- ✓ Word displayed center-screen with charcoal consonant blocks and amber vowel blank blocks — v1.0
- ✓ Dragging a yellow block reveals a vertical A/E/I/O/U picker column — v1.0
- ✓ Player selects a vowel by clicking it or dragging through the picker — v1.0
- ✓ All vowels correct → green flash + auto-advance — v1.0
- ✓ Give Up → salmon flash + correct vowels revealed + auto-advance — v1.0
- ✓ Infinite random common English words, one at a time, no immediate repeat — v1.0
- ✓ Vowel picker fades in on lift, fades out on release — v1.0
- ✓ Blocks bounce/settle on drop; new word swipes in with stagger — v1.0
- ✓ Touch-clean on mobile: no selection highlight, no zoom, no loupe — v1.0
- ✓ Single-line layout on 375px screen; max 7-letter words — v1.0
- ✓ Responsive block sizing (52px desktop → 42px mobile) — v1.0
- ✓ Smooth drag on mobile via RAF throttling + GPU compositor layer — v1.0
- ✓ Daily 5-word puzzle with deterministic PRNG — v1.1
- ✓ Timer and Give Up penalty system — v1.1
- ✓ Session score and streak persistence — v1.1
- ✓ Results screen with return-tomorrow prompt — v1.1
- ✓ Node.js/Express server with SQLite for daily score persistence — v1.2
- ✓ POST /api/scores and GET /api/stats endpoints with percentile — v1.2
- ✓ Frontend integrates real backend stats with graceful fallback — v1.2
- ✓ Full E2E local verification — v1.2
- ✓ Mobile: tap-to-pick vowel, drag-to-reposition (separate gestures) — v1.2
- ✓ Personal best tracking in localStorage with confetti on new record — v1.2

### Active

(Next milestone — to be defined with `/gsd:new-milestone`)

### Deferred

- [ ] **ENH-03**: Difficulty filter (short words vs. long words)
- [ ] **ENH-04**: Hint system (reveal one vowel)
- [ ] **ACC-01**: Allow user scaling (pinch-zoom) for visually impaired users

### Out of Scope

- User authentication/login — anonymous play is sufficient
- Multiplayer/Social sharing — v2+
- Cloud deployment — deferred; local backend validated in v1.2; deployment is a strong next candidate

## Context

**Codebase:**
- Single `index.html` (vanilla HTML/CSS/JS, ~2,311 lines) — serves as both GitHub Pages frontend and local Express frontend
- `server/` (Node.js/Express, ~144 lines) — API routes, SQLite service, rate limiting
- `server/db/scores.db` — SQLite file, local only

**Word list:** 2,710 common English words embedded in JS array.

**Design:** Warm off-white background (#f5f0e8), amber/tan vowel blocks, charcoal consonant blocks, serif font.

**Deployment:** GitHub Pages serves `index.html` statically. Local backend runs via `npm start`. No cloud deployment yet.

**Known gaps from v1.2:**
- Backend is local-only — leaderboard/percentile stats require server running; users on GitHub Pages see personal best only
- Phase 11 has no VERIFICATION.md (tech debt, non-blocking — verified by Phase 13 E2E)

## Constraints

- **Tech**: Vanilla frontend (no build step), Node/Express/SQLite backend
- **Single file frontend**: Must remain a single `index.html` — no bundler, no framework
- **Mobile-first**: Touch interactions must be polished and distinct from desktop

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Single HTML file (v1.0) | No setup friction, works by double-clicking | ✓ Good — trivial deployment, maintained through v1.2 |
| SQLite for v1.2 | Simple, file-based, relational power for analytics | ✓ Good — worked well locally; deployment deferred |
| Local-only v1.2 | Validate backend logic before cloud deployment | ✓ Good — E2E verified, cloud deployment is clear next step |
| Smoothed percentile `(slower + 0.5) / total` | Avoids 0% and 100% edge cases with small samples | ✓ Good |
| `crypto.randomUUID()` for user identity | Persistent anonymous ID without login | ✓ Good |
| Fire-and-forget score submission | Score submit doesn't block results screen render | ✓ Good |
| Personal best in localStorage (not backend) | No deployment needed, works offline, per-device | ✓ Good — replaced leaderboard after v1.2 |
| Separate mobile gestures (tap=pick, drag=position) | Finger obscures letters during hover-select on touch | ✓ Good — shipped post-v1.2 audit |

---
*Last updated: 2026-02-25 after v1.2 milestone*
