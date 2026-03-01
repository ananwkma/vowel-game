# Word Game Collection

## What This Is

A browser-based daily word puzzle collection with four games: VOWEL (place vowels into consonant sequences), Word Ladder (change one letter at a time from start to target), Cipher (decode a famous quote from number-substitution), and Letter Hunt (find hidden words in a grid before time runs out). A central hub (index.html) tracks which daily puzzles the player has completed. All games share a warm typographic aesthetic, work on mobile and desktop, and produce a new puzzle every day.

Shipped v1.0 on 2026-02-23 (Single HTML file, core VOWEL gameplay).
Shipped v1.1 on 2026-02-24 (Daily puzzles, timer, score, streaks).
Shipped v1.2 on 2026-02-25 (Backend stats, personal best, mobile gesture redesign).
Shipped v2.0 on 2026-03-01 (Four-game collection hub with Ladder, Cipher, Hunt).

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
- ✓ Game collection hub (index.html portal, card-based, same aesthetic) — v2.0
- ✓ VOWEL migrated to vowel.html with shared CSS design tokens — v2.0
- ✓ Word Ladder game (daily, start→target, one-letter changes, path history, personal best) — v2.0
- ✓ Letter Hunt game (daily word-search grid, drag selection, mystery category reveal, timed easy/hard scoring) — v2.0
- ✓ Cipher game (daily famous-quote number substitution, pre-reveal anchor letters, undo/restart) — v2.0 (added during v2.0)
- ✓ Difficulty calibration: Ladder 3–4 step paths, Cipher repetition filter + scaled pre-reveal, Hunt moderate-stretch hard words — v2.0

### Deferred

- [ ] **ENH-03**: Difficulty filter (short words vs. long words) for VOWEL
- [ ] **ENH-04**: Hint system (reveal one vowel) for VOWEL
- [ ] **ACC-01**: Allow user scaling (pinch-zoom) for visually impaired users
- [ ] Cloud deployment — local backend validated in v1.2; deployment is a strong next candidate

### Out of Scope

- User authentication/login — anonymous play is sufficient
- Multiplayer/Social sharing — post-v2.0
- VOWEL leaderboard on GitHub Pages — backend is local-only; personal best covers the solo experience

## Context

**Codebase:**
- `index.html` — game collection hub (~220 lines)
- `vowel.html` — VOWEL game (~2,350 lines)
- `ladder.html` — Word Ladder game (~900 lines)
- `cipher.html` — Cipher game (~1,050 lines)
- `hunt.html` — Letter Hunt game (~1,100 lines)
- `styles/design-tokens.css` — shared CSS custom properties (colors, fonts, spacing)
- `server/` (Node.js/Express, ~144 lines) — API routes, SQLite service, rate limiting
- `server/db/scores.db` — SQLite file, local only

**Word list:** 2,710 common English words in VOWEL/Ladder; 809 common words as Ladder PUZZLE_WORDS; 42 famous-quote Cipher corpus; 22 word-search Hunt categories.

**Design:** Warm off-white background (#f5f0e8), amber/tan accents, sage green success, charcoal text, Playfair Display serif. Shared via design-tokens.css across all games.

**Deployment:** GitHub Pages serves static HTML. Local backend runs via `npm start`. No cloud deployment yet.

**Known gaps from v2.0:**
- Backend is local-only — VOWEL leaderboard/percentile stats require server running; GitHub Pages users see personal best only
- Cipher, Ladder, Hunt have no backend stat tracking — standalone local state only
- Phase 11 has no VERIFICATION.md (tech debt, non-blocking — verified by Phase 13 E2E)

## Constraints

- **Tech**: Vanilla frontend (no build step), Node/Express/SQLite backend
- **Single file per game**: Each game is a self-contained HTML file — no bundler, no framework
- **Mobile-first**: Touch interactions must be polished and distinct from desktop

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Single HTML file per game (v1.0→v2.0) | No setup friction, works by double-clicking | ✓ Good — trivial deployment, maintained through v2.0 |
| SQLite for v1.2 | Simple, file-based, relational power for analytics | ✓ Good — worked well locally; deployment deferred |
| Local-only v1.2 | Validate backend logic before cloud deployment | ✓ Good — E2E verified, cloud deployment is clear next step |
| Smoothed percentile `(slower + 0.5) / total` | Avoids 0% and 100% edge cases with small samples | ✓ Good |
| `crypto.randomUUID()` for user identity | Persistent anonymous ID without login | ✓ Good |
| Fire-and-forget score submission | Score submit doesn't block results screen render | ✓ Good |
| Personal best in localStorage (not backend) | No deployment needed, works offline, per-device | ✓ Good — replaced leaderboard after v1.2 |
| Separate mobile gestures (tap=pick, drag=position) | Finger obscures letters during hover-select on touch | ✓ Good — shipped post-v1.2 audit |
| Shared CSS design tokens (design-tokens.css) | Multi-game visual consistency without duplication | ✓ Good — all v2.0 games share one source of truth |
| Hash-based routing (#/vowel etc.) for hub | GitHub Pages has no server-side routing; hash avoids 404s | ✓ Good |
| BFS precomputed adjacency map at startup | Avoids 5–15s freeze on first puzzle generation on mobile | ✓ Good |
| Cipher added to v2.0 scope mid-milestone | User request during planning; fit the collection theme | ✓ Good — fourth game strengthens collection |
| COMMON_ADJACENCY BFS for Ladder path length | Ensures all intermediate words in optimal path are recognizable | ✓ Good — SLART-type obscure words eliminated |
| Anchor letters (pre-reveal) for Cipher | Gives players a foothold; scaled by quote length | ✓ Good — accessibility without trivialization |
| shakeAndClear clears state synchronously | Async clear caused race with new drag; synchronous eliminates race entirely | ✓ Good — drag ghost bug eliminated |
| chooseGridSize() height-aware in Hunt | Window width alone caused grid overflow on iPhone SE | ✓ Good — fits all tested mobile sizes |
| SEAS/SHARKS category corrections in Hunt | CORAL is a sea (not ocean), WHALE is not a shark | ✓ Good — factual accuracy + BASKING shark is well-known |

---
*Last updated: 2026-03-01 after v2.0 milestone*
