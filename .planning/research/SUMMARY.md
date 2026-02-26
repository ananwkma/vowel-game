# Research Summary: Word Game Collection v2.0

**Project:** Word Game Collection v2.0 (VOWEL expansion with Word Ladder and Letter Hunt)
**Domain:** Multi-game daily puzzle web application, vanilla JavaScript with Node/Express backend
**Researched:** 2026-02-25
**Confidence:** HIGH

---

## Executive Summary

Word Game Collection v2.0 expands the existing VOWEL game into a three-game suite (VOWEL, Word Ladder, Letter Hunt) with a unified portal hub. The research validates that this expansion can be built using **zero new frontend dependencies** — all three games remain vanilla HTML/CSS/JavaScript with Canvas for rendering. The backend (Node/Express/SQLite) requires no structural changes, only schema extensions to track game type per score. The key architectural decision is **migrating from a single index.html to a multi-file structure with hash-based routing for GitHub Pages compatibility**, which introduces moderate migration risk but is manageable with careful state namespacing and lifecycle management.

The critical path for v2.0 is: (1) Hub migration without breaking VOWEL, (2) Word Ladder with robust BFS preprocessing to avoid mobile performance collapse, and (3) Letter Hunt with proven touch UX patterns (Pointer Events, Canvas-based lasso, not SVG). Daily puzzle generation, personal best persistence, and offline fallback are proven patterns from VOWEL v1.2 and extend seamlessly. The most significant risk is **state leakage across games during navigation and storage key collisions** — prevented through explicit namespacing and game lifecycle functions.

---

## Key Findings

### Recommended Stack

**Frontend:** Vanilla HTML/CSS/JavaScript (zero new dependencies). Canvas for both game rendering and animations (consistent with VOWEL v1.2). BFS pathfinding for Word Ladder uses inline algorithm (~50 lines), no graph library. Letter Hunt lasso selection uses Canvas `isPointInPath()` API for collision detection (no Point-in-Polygon npm package needed). Grid generation uses seeded PRNG from existing codebase.

**Core technologies:**
- **HTML5 Canvas** — Multi-layer rendering (game board, lasso path, animations). Faster than SVG for dynamic drawing; native `isPointInPath()` for collision detection.
- **Vanilla JavaScript (ES6+)** — BFS pathfinding, word search grid generation, PRNG seeding. Seeded random already implemented in VOWEL.
- **Node.js 18+ / Express.js 5.2.1** — Existing server validates for multi-game score submission. No new packages needed.
- **SQLite + better-sqlite3 12.6.2** — Extend schema with `game_id` column; single database handles all three games.

**Optional enhancements (not required for MVP):**
- `word-list-google` (10K common words) — Only if 2,710-word embedded list shows insufficient variety in testing.
- `an-array-of-english-words` (370K words) — Defer unless puzzle exhaustion detected.

**Why this stack:** Minimal dependencies keep deployment simple (GitHub Pages compatible, no build step). Canvas outperforms SVG for animation-heavy games. BFS is trivial to implement inline; word search grid generation similarly straightforward. Seeded PRNG ensures fair daily puzzle sync across games.

### Expected Features

**Must have (table stakes):**
- Single daily puzzle per game (fairness: all players solve same puzzle each day)
- Personal best tracking per game (validated pattern from VOWEL v1.2)
- Mobile-first touch interaction (VOWEL proven this is non-negotiable; games must work single-handed on 375px screens)
- Clear visual feedback (win/lose/progress; VOWEL's green/salmon flashes extend to Ladder/Hunt)
- Results screen with stats (score, time, percentile badge)
- Playable offline with graceful backend fallback
- Game portal hub (card-based navigation to all three games)
- VOWEL migration to separate file without breaking existing gameplay

**Should have (differentiators):**
- Word Ladder: Optimal path comparison (show minimum steps vs. player's steps; validates problem-solving efficiency)
- Word Ladder: Path history visualization (breadcrumb trail; mobile: scrollable 5-word window)
- Letter Hunt: Mystery category reveal (category hidden until first word found; cosmetic but high psychological impact)
- Personal best confetti celebration (extending VOWEL v1.2 pattern to new games)
- Daily puzzle variety across three game types (prevents login fatigue)

**Defer to v2.1+ (not MVP):**
- Hint system (creates balance questions; validate core gameplay first)
- Difficulty settings (breaks fairness; different users solve different puzzles on same day)
- Cloud leaderboard (requires auth, privacy policy; defer until deployment infrastructure proven)
- Sound effects (mobile audio autoplay blocked; focus on visual feedback first)

### Architecture Approach

Portal hub (index.html) routes to three game files (vowel.html, ladder.html, hunt.html) using hash-based routing (#/vowel, #/ladder, #/hunt) for GitHub Pages compatibility. Each game is self-contained but shares:

- **DailySeeder** — Date-to-PRNG-seed conversion; ensures identical puzzle on same date across all three games
- **GameState** — Unified localStorage management with per-game namespacing (vowel: {...}, ladder: {...}, hunt: {...})
- **PuzzleEngine** — Algorithm implementations (BFS, grid generation, lasso boundary detection)
- **API Client** — Wrapper for score submission and stats fetching; graceful offline fallback

Backend (Express.js) adds `game_id` column to scores table but otherwise uses existing patterns. No websockets, no real-time multiplayer — asynchronous personal best comparison is sufficient.

**Major components:**
1. **Portal Hub (index.html)** — Game discovery, navigation, cross-game stats display
2. **Game Controllers** — Per-game lifecycle: init(), render(), teardown() to prevent state leakage
3. **Shared Engine Layer** — BFS, grid generation, collision detection (pure functions, testable)
4. **Unified State (GameState class)** — localStorage + in-memory cache; fires save on 300ms debounce (prevents input lag on mobile)
5. **Backend (Express + SQLite)** — Score submission, percentile calculation, rate limiting (100 req/15min)

### Critical Pitfalls

1. **Breaking VOWEL during hub migration** — Moving from single index.html to multi-file structure risks API path failures, localStorage key collisions, and GitHub Pages routing breakage. **Prevention:** Namespace all localStorage keys (`vowel_scores`, `ladder_scores`, not shared); use absolute API paths (`/api/scores`); test VOWEL independently from vowel.html before integrating hub; validate on actual GitHub Pages URL before shipping.

2. **Shared state leakage across games** — Global event listeners, timers, or gameState variables persist when navigating between games, causing one game's state to affect another. **Prevention:** Implement explicit game lifecycle (init, teardown); teardown removes all listeners, clears timers, nulls gameState; test by playing Game A, switching to Game B, verifying no Game A timers fire.

3. **BFS performance collapse with 2710-word dictionary** — Naive BFS on first puzzle generation takes 5–15 seconds on mobile, causing freezes. **Prevention:** Preprocess dictionary once at startup into pattern→words hashmap (c*t → [cat, cut, cot]); lookup neighbors in O(1); validate path exists with BFS before serving puzzle (not at runtime); use bidirectional BFS if dynamic generation necessary.

4. **No valid path exists between start/target words** — Dictionary is not fully connected graph; random start/target pairs may be in disconnected components. **Prevention:** Preprocess connected components (union-find); generate start/target only from same component; fallback: run BFS to validate path exists, regenerate if no path found; never serve unsolvable puzzle.

5. **Mobile lasso selection UX broken** — Touch precision issues, finger occlusion, event handling fragmentation, SVG/Canvas jank on budget devices. **Prevention:** Use Pointer Events (not separate Touch/Mouse); use Canvas for lasso drawing (not SVG); throttle redraw to 30 FPS on mobile; downsample touch points; add CSS `touch-action: none`; test on actual budget Android (Moto G4 equivalent) for 30+ minute session.

---

## Implications for Roadmap

Based on research dependencies and architectural patterns, suggested phase structure:

### Phase 1: Hub + VOWEL Migration
**Rationale:** Foundation for all subsequent phases. Cannot add new games until VOWEL migration is proven. Requires careful state management and routing setup.
**Delivers:**
- Game portal hub with card-based navigation
- VOWEL game relocated to vowel.html with 100% identical functionality
- Namespaced localStorage schema (vowel_*, ladder_*, hunt_* keys)
- Hash-based routing for GitHub Pages compatibility
- Unified GameState class with per-game buckets

**Addresses (FEATURES.md):**
- Table stakes: Game portal hub, VOWEL migration, personal best persistence (extend to new structure)
- Mobile UX: Hub navigation must work single-handed on 375px screens

**Avoids (PITFALLS.md):**
- Pitfall 1: Breaking VOWEL during migration (validate locally + on GitHub Pages)
- Pitfall 2: Shared state leakage (implement explicit lifecycle: init/teardown)
- Pitfall 10: GitHub Pages routing breakage (hash-based routing tested before merge)

**Test criteria:** VOWEL loads from vowel.html, scores persist in localStorage under `vowel_*` namespace, API calls return correct percentiles, hub navigation works on GitHub Pages, back/forward buttons work, no localStorage key collisions.

---

### Phase 2: Word Ladder
**Rationale:** Extends hub with first new game type. Validates BFS pathfinding architecture and daily puzzle seeding. Graph algorithms are well-researched; risk is performance, not design.
**Delivers:**
- Daily puzzle generation (start word → target word)
- BFS pathfinding with optimal path display
- Path history visualization (breadcrumb trail, scrollable on mobile)
- Personal best tracking independent of VOWEL
- Score submission via unified API

**Uses (STACK.md):**
- Canvas for path history visualization
- Seeded PRNG from DailySeeder (same date seed as VOWEL ensures sync)
- Inline BFS algorithm (~50 lines); no graph library
- Word pattern preprocessing (c*t → [cat, cut, cot] for O(1) neighbor lookup)

**Implements (ARCHITECTURE.md):**
- WordLadderEngine class (pure function BFS, neighbor precomputation, connected component validation)
- Game controller with lifecycle (init loads daily puzzle, teardown clears any timers)
- Integration with GameState: separate `ladder` bucket for scores/streak/lastDate

**Avoids (PITFALLS.md):**
- Pitfall 3: BFS performance collapse (preprocess pattern hashmap; validate path exists before serving)
- Pitfall 4: Disconnected word graphs (precompute connected components; generate only within valid component)
- Pitfall 5: One-letter-difference validation (unit test edge cases: different lengths, non-dictionary words)

**Test criteria:** First puzzle generates in <500ms on desktop, <1s on mobile. No browser freezing on low-end mobile. Daily puzzle from 2026-02-25 is deterministic (same puzzle every day in feb 25). BFS finds valid path or returns null (never serves unsolvable). Path history renders correctly on desktop (horizontal) and mobile (scrollable). Personal best updates independently without affecting VOWEL scores.

---

### Phase 3: Letter Hunt
**Rationale:** Most complex game (grid generation, lasso selection, mobile touch). Validates responsive Canvas rendering and pointer event handling. Risk is UX (mobile touch precision) and performance (low-end devices).
**Delivers:**
- Word search grid generation with 8-directional placement
- Lasso selection via Pointer Events and Canvas collision detection
- Mystery category reveal (hidden until first word found)
- Found word count with timer
- Personal best and percentile scoring
- Mobile touch UX validated on low-end devices

**Uses (STACK.md):**
- Canvas for grid rendering + lasso drawing (not SVG for lasso)
- Pointer Events (unified touch/mouse/pen handling)
- Seeded PRNG for deterministic daily grid
- Canvas `isPointInPath()` for lasso boundary detection

**Implements (ARCHITECTURE.md):**
- HuntEngine class (grid generation with quality scoring, lasso boundary detection via ray-casting)
- Responsive grid layout (8x8 on desktop, 6x6 on mobile, 7x7 on tablet)
- Game controller with lasso event handling (RAF-throttled, pointer events unified)
- Integration with GameState: separate `hunt` bucket

**Avoids (PITFALLS.md):**
- Pitfall 6: Unsolvable or trivial grids (implement quality score: average letter distance, overlap%, directionality; reject grids outside acceptable band)
- Pitfall 7: Mobile lasso UX broken (Pointer Events, Canvas drawing, RAF throttling to 30 FPS on mobile, CSS `touch-action: none`)
- Pitfall 8: SVG/Canvas performance jank (Canvas only, partial redraw, downsample touch points, `will-change: transform`)
- Pitfall 9: Lasso false positives (unit test boundary detection: center-point-in-polygon, edge cases at grid boundaries)

**Test criteria:** Daily grid generates in <1s on desktop, <2s on mobile (validated with seed for reproducibility). 30+ minute gameplay session on Moto G4 equivalent maintains >30 FPS. Lasso selection works correctly on iOS, Android, desktop. No false positives in boundary detection (unit tested). Grid difficulty is consistent (3–5 minute average solve time).

---

### Phase Ordering Rationale

- **Phase 1 first (Hub + Migration):** Foundation for all subsequent work. Cannot test new games until hub and routing are proven. Risk is catastrophic if broken (entire v2.0 delayed).
- **Phase 2 second (Word Ladder):** Graph algorithms are well-studied; risk is performance, not design. Extends existing daily puzzle seeding pattern. Simpler than Letter Hunt (no touch UX complexity).
- **Phase 3 third (Letter Hunt):** Most complex due to mobile touch and Canvas performance. Benefits from Phase 1 and 2 patterns being validated. Can reuse DailySeeder and GameState patterns.
- **Dependency graph:** Phase 1 → Phase 2,3 (parallel possible, but sequential safer for scope management).

### Research Flags

**Phases likely needing deeper research:**
- **Phase 2 (Word Ladder):** Graph connectivity analysis — Research whether 2710-word embedded list has significant disconnected components that invalidate puzzles. May need custom analysis or academic source validation. **Recommendation:** Generate a test set of 100 daily seeds and validate all produce solvable puzzles before Phase 2 completion.
- **Phase 3 (Letter Hunt):** Quality scoring metrics — Research human playtesting data for word search difficulty. Define acceptable solve time range. **Recommendation:** Generate offline puzzle set, have 5+ testers solve independently, measure time/difficulty distribution, adjust algorithm parameters.

**Phases with standard patterns (skip research-phase):**
- **Phase 1 (Hub + Migration):** Hash-based routing for GitHub Pages is well-established pattern. localStorage namespacing is standard practice. Lifecycle management (init/teardown) is basic patterns, well-documented.
- **Phase 2 (Word Ladder):** BFS algorithm is extensively documented (GeeksforGeeks, Bradfield CS). Connected components via union-find is standard. No novel research needed.
- **Phase 3 (Letter Hunt):** Pointer Events is MDN-documented standard. Canvas lasso selection has Observable.js examples. Point-in-polygon via ray-casting is academic algorithm, well-researched.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|-----------|-------|
| **Stack** | HIGH | Zero new frontend dependencies validated against VOWEL v1.2 proven patterns. Canvas choice justified by performance (STACK.md verified against 2026 benchmarks). Backend extensions require no new libraries. Optional packages (word-list-google) well-documented; only needed if testing reveals puzzle exhaustion. |
| **Features** | HIGH | Table stakes (daily puzzles, personal best, mobile UX) are proven patterns from VOWEL v1.2. Differentiators (optimal path, category reveal, confetti) are low-complexity UX enhancements. Anti-features (multiplayer, hint system) are correctly identified as scope creep. MVP definition aligns with competitor analysis (Wordle, Connections daily model). |
| **Architecture** | HIGH | Multi-file structure with hash-based routing is standard pattern for GitHub Pages static sites. Component responsibilities clearly delineated (engines pure functions, controllers lifecycle, state centralized). Scaling path identified (SQLite → PostgreSQL at 1k DAU). Patterns verified against NYT Games architecture (Wordle/Connections). |
| **Pitfalls** | HIGH | Pitfalls drawn from common patterns in game development (state management, performance optimization, mobile UX). Graph connectivity issue researched via Runestone Academy. Touch event pitfalls verified against MDN and 2026 mobile UX guidelines. BFS performance trap documented across multiple algorithms sources. GitHub Pages routing issue known from GitHub community discussions. |

**Overall confidence: HIGH**

### Gaps to Address

1. **Graph connectivity of 2710-word list** — Research assumes connected components exist but doesn't verify 2710-word embedded list is sufficiently connected for daily puzzle generation. **How to handle:** Phase 2 includes preprocessing analysis; run union-find on embedded list, measure largest component size, validate puzzle generation against 100 daily seeds. Flag to team if >5% of seeds produce no valid path (may need word-list-google upgrade).

2. **Mobile performance baseline for Letter Hunt** — Research specifies 30 FPS target on budget devices but no baseline data for current implementation. **How to handle:** Phase 3 includes device profiling (Moto G4 or equivalent). If frame rate drops below 30 FPS, implement point downsampling or reduce grid size. Measure battery impact over 30-minute session.

3. **Human playtesting puzzle difficulty** — Research identifies quality scoring need but doesn't specify exact metrics or difficulty band. **How to handle:** Phase 3 includes 5+ tester sessions. Measure average solve time, word find rate, difficulty distribution. Adjust placement algorithm parameters to target 3–5 minute solve time.

4. **GitHub Pages hash-based routing edge cases** — Research recommends hash routing but doesn't cover all edge cases (direct URL navigation, bookmark persistence, share URL). **How to handle:** Phase 1 includes testing on actual Pages URL (not localhost). Test: bookmark #/ladder, come back tomorrow, verify page loads to ladder game. Test share URL with friend.

5. **User onboarding for three-game hub** — Research covers multi-game architecture but minimal discussion of how to guide new users to understand three distinct games. **How to handle:** Design phase should include onboarding flow (which game to start with, brief rules per game). Defer to Phase 1 design iteration if time-boxed.

---

## Sources

### Primary (HIGH confidence)
- **STACK.md** — Vanilla stack validated against VOWEL v1.2 proven patterns, Canvas vs SVG benchmarks from 2026 sources, word list recommendations from npm registries
- **FEATURES.md** — Table stakes features derived from Wordle/Connections competitor analysis, VOWEL v1.2 user validation, daily puzzle model well-established
- **ARCHITECTURE.md** — Multi-file GitHub Pages routing from official GitHub Pages documentation, localStorage state management standard practice, BFS patterns from GeeksforGeeks and Bradfield CS, Wordle/NYT Games architecture reference
- **PITFALLS.md** — Game state lifecycle antipatterns from vanilla JS best practices, BFS performance from algorithm complexity analysis, graph connectivity from Runestone Academy, touch event handling from MDN and 2026 mobile UX guidelines, point-in-polygon from academic sources

### Secondary (MEDIUM confidence)
- Canvas vs SVG performance trade-offs (Augustine FoTech 2026, SitePoint)
- Pointer Events API adoption rates (MDN browser support data)
- Word search puzzle difficulty metrics (Jamis Buck, Baeldung)
- Lasso selection UX patterns (Observable.js examples)

### Tertiary (LOW confidence, needs validation)
- Exact difficulty band for word search puzzles (no authoritative source; requires user testing)
- Graph connectivity characteristics of 2710-word list (assumed well-connected; needs preprocessing analysis)
- Mobile performance target for Letter Hunt (30 FPS specified; needs device profiling)

---

*Research completed: 2026-02-25*
*Ready for roadmap: yes*
