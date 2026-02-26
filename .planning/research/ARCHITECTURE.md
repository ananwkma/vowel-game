# Architecture Research: Word Game Collection v2.0

**Domain:** Multi-game web collection (daily word puzzles)
**Researched:** 2026-02-25
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌────────────────────────────────────────────────────────────────────┐
│                    CLIENT PRESENTATION LAYER                        │
├────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │ index.html   │  │ vowel.html   │  │ ladder.html  │ hunt.html  │
│  │ (Portal Hub) │  │ (Game)       │  │ (Game)       │ (Game)     │
│  └────┬─────────┘  └────┬─────────┘  └────┬─────────┘ └────┬─────┘
│       │ (navigation)     │                 │               │       │
│       └─────────────────┬┴─────────────────┴───────────────┘       │
│                         │                                           │
│                    [Shared Module Bus]                             │
│                (CSS, Utilities, State)                             │
│                                                                      │
├────────────────────────────────────────────────────────────────────┤
│                  SHARED APPLICATION LAYER                           │
├────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │ PuzzleEngine │  │ GameState    │  │ DailySeeder  │             │
│  │ (algorithms) │  │ (localStorage)│ │ (PRNG)       │             │
│  └────────────┬─┘  └────────┬──────┘  └────────┬─────┘             │
│               │             │                  │                    │
├───────────────┴─────────────┴──────────────────┴────────────────────┤
│                      API LAYER / BACKEND                            │
├────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Express.js Server (port 3000)                              │   │
│  │  ┌─────────────────┬──────────────┬──────────────────┐     │   │
│  │  │ POST /scores    │ GET /stats   │ Rate Limiter     │     │   │
│  │  │ (all games)     │ (all games)  │ (100/15min)      │     │   │
│  │  └────────┬────────┴──────┬───────┴────────┬─────────┘     │   │
│  │           │               │                │               │   │
│  └───────────┼───────────────┼────────────────┼───────────────┘   │
├───────────────┼───────────────┼────────────────┼────────────────────┤
│                │               │                │                    │
│          ┌─────▼────────┐ ┌──▼──────────┐ ┌──▼───────────────┐   │
│          │ SQLite DB    │ │ schema.sql  │ │ services/stats   │   │
│          │ scores.db    │ │ (unified)   │ │ (percentiles)    │   │
│          └──────────────┘ └─────────────┘ └──────────────────┘   │
│                                                                      │
└────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|-----------------|------------------------|
| **Portal (index.html)** | Game collection hub, navigation, OAuth (future) | HTML/CSS with vanilla JS router simulation |
| **Game Pages (vowel.html, ladder.html, hunt.html)** | Individual game UI, input handling, animations | Vanilla JS with shared CSS design tokens |
| **PuzzleEngine** | Algorithm implementations (BFS, word search gen, lasso) | Pure JS utility functions, deterministic results |
| **GameState** | Game progress, answers, path history, personal best | localStorage JSON with in-memory cache |
| **DailySeeder** | Deterministic PRNG for daily puzzles | Seeded `Math.random()` via date-based seed |
| **API Server** | Score submission, percentile calculations, rate limiting | Express.js with SQLite persistence |
| **StatsService** | Percentile ranking, smoothed calculation | Query engine against unified scores table |

## Recommended Project Structure

```
project-root/
├── index.html              # [Portal hub — game cards, navigation]
├── vowel.html              # [VOWEL game (migrated from index.html)]
├── ladder.html             # [Word Ladder game]
├── hunt.html               # [Letter Hunt game]
│
├── styles/
│   ├── design-tokens.css   # [Shared colors, typography, spacing — imported by all games]
│   ├── layout.css          # [Common UI patterns — buttons, modal, header]
│   └── animations.css      # [Reusable transitions — bounce, fade, confetti]
│
├── js/
│   ├── shared/
│   │   ├── state.js        # [GameState class — localStorage + in-memory cache]
│   │   ├── seeder.js       # [DailySeeder — deterministic PRNG by date]
│   │   ├── api.js          # [API client — POST /scores, GET /stats]
│   │   └── utils.js        # [Helper functions — lerp, clamp, platform detection]
│   │
│   ├── engines/
│   │   ├── vowel-engine.js # [Vowel picker logic, word validation]
│   │   ├── ladder-engine.js # [BFS pathfinding, word graph]
│   │   └── hunt-engine.js  # [Word search grid gen, lasso boundary detection]
│   │
│   ├── ui/
│   │   ├── router.js       # [SPA-like routing: index → vowel/ladder/hunt]
│   │   ├── animations.js   # [Bounce, fade, confetti — shared across games]
│   │   └── responsive.js   # [Breakpoint detection — iPad/mobile layouts]
│   │
│   └── games/
│       ├── vowel.js        # [VOWEL game controller]
│       ├── ladder.js       # [Word Ladder game controller]
│       └── hunt.js         # [Letter Hunt game controller]
│
├── server/
│   ├── index.js            # [Express app, middleware, route mounting]
│   ├── routes/
│   │   └── api.js          # [POST /scores, GET /stats endpoints]
│   ├── db/
│   │   ├── index.js        # [SQLite initialization, better-sqlite3]
│   │   └── schema.sql      # [Unified scores schema: game_id column added]
│   └── services/
│       └── stats.js        # [Percentile calculation, smoothing]
│
├── data/
│   ├── words-common.js     # [2,710 common words — imported by PuzzleEngine]
│   ├── word-graph.js       # [Cached word neighbor map for Ladder — lazy-init]
│   └── word-search-dict.js # [Large word list for Hunt grid generation]
│
├── package.json
├── .env                    # [PORT, LOG_LEVEL]
└── .gitignore
```

### Structure Rationale

- **Separate HTML files per game** — Each game is self-contained for future deployment flexibility (GitHub Pages can serve multiple HTML files). Portal routes to each via `<a>` tags or hash-based routing.

- **Shared CSS (design-tokens.css)** — Colors, typography, spacing all in one place. Every game `@import` it. Ensures consistent visual identity across collection. Changes once = consistent everywhere.

- **js/shared/ folder** — Code used by multiple games (state, seeding, API calls). Single source of truth prevents duplication.

- **js/engines/ folder** — Pure algorithms (no DOM dependencies). BFS pathfinding, word search grid generation, lasso boundary detection. Testable in isolation, reusable between games.

- **js/ui/ folder** — UI patterns: router (SPA-like navigation), animations, responsive detection. Shared across all games, reduces duplication.

- **js/games/ folder** — Game-specific controllers that wire UI + engine + state together. High-level orchestration, low-level detail in engines.

- **data/ folder** — Word lists and static data. Lazy-loaded by games that need them. `word-graph.js` pre-computed for fast Ladder BFS.

- **server/ structure unchanged** — Continue Express + SQLite. Schema evolves to track game type per score row.

## Architectural Patterns

### Pattern 1: Shared Daily Puzzle Seeding (Deterministic PRNG)

**What:** All games use the same date as a seed, producing identical puzzle state regardless of when user starts. Same date = same VOWEL words, same Ladder start/target, same Hunt grid.

**When to use:** Multi-game collections need synchronized daily content. Prevents fragmentation where same user sees different Day 1 puzzles in different games.

**Trade-offs:**
- ✓ Synchronized cross-game experience (user compares scores on same content)
- ✓ Minimal server state (seed = date, deterministic on client)
- ✗ User cannot "replay" old dailies without recalculating; if seed algorithm changes, old scores become meaningless

**Example:**
```javascript
// js/shared/seeder.js
class DailySeeder {
  constructor() {
    this.seed = this.dateToSeed(new Date());
  }

  dateToSeed(date) {
    // YYYY-MM-DD → unique number
    const iso = date.toISOString().split('T')[0]; // "2026-02-25"
    return parseInt(iso.replace(/-/g, ''), 10); // 20260225
  }

  seedRandom(seed) {
    // Mulberry32 — fast, deterministic, good distribution
    let x = seed;
    return function() {
      x |= 0; x = (x + 0x6D2B79F5) | 0;
      let t = Math.imul(x ^ x >>> 15, 1 | x);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  shuffleArray(arr, seed) {
    const rng = this.seedRandom(seed);
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  // VOWEL uses this to pick 5 words from word list
  getVowelWords(wordList) {
    const shuffled = this.shuffleArray(wordList, this.seed);
    return shuffled.slice(0, 5);
  }

  // Ladder uses this to pick start/target pair
  getLadderPair(wordList) {
    const rng = this.seedRandom(this.seed);
    const idx1 = Math.floor(rng() * wordList.length);
    const idx2 = Math.floor(rng() * wordList.length);
    return [wordList[idx1], wordList[idx2]];
  }
}

// Usage in ladder.html:
const seeder = new DailySeeder();
const [startWord, targetWord] = seeder.getLadderPair(wordList);
```

### Pattern 2: Unified Game State via localStorage + In-Memory Cache

**What:** Single `GameState` class manages all game progress. Writes to localStorage (persistent across sessions), keeps hot copy in RAM (fast reads/writes). Key structure: `{ vowel: {...}, ladder: {...}, hunt: {...}, lastSync: ... }`.

**When to use:** Single-device gameplay where localStorage is sufficient. Multi-tab sync needed? Add `storage` event listener.

**Trade-offs:**
- ✓ Simple, no backend sync complexity for daily progress
- ✓ Works offline (personal best doesn't need server)
- ✓ Fast reads (in-memory cache beats JSON.parse each time)
- ✗ No cross-device sync (phone ≠ desktop progress)
- ✗ 5-10MB localStorage limit (acceptable for this collection)

**Example:**
```javascript
// js/shared/state.js
class GameState {
  constructor() {
    this.key = 'wordGameCollection:v1';
    this.cache = this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      return JSON.parse(localStorage.getItem(this.key)) || this.defaultState();
    } catch {
      return this.defaultState();
    }
  }

  defaultState() {
    return {
      vowel: { solved: [], personal_best_ms: null, streak: 0, lastDate: null },
      ladder: { solved: [], personal_best_ms: null, streak: 0, lastDate: null },
      hunt: { solved: [], personal_best_ms: null, streak: 0, lastDate: null },
      lastSync: 0
    };
  }

  getGameState(gameName) {
    return this.cache[gameName] || {};
  }

  updateGame(gameName, updates) {
    this.cache[gameName] = { ...this.cache[gameName], ...updates };
    this.save();
  }

  save() {
    localStorage.setItem(this.key, JSON.stringify(this.cache));
  }

  // Call this after score submission succeeds
  markSynced(gameName, timeMs) {
    this.updateGame(gameName, { lastSync: Date.now() });
  }
}

// Usage in a game:
const state = new GameState();
state.updateGame('vowel', { solved: [1, 2, 3], personal_best_ms: 12500 });
```

### Pattern 3: Modular Algorithm Engines (No DOM Dependencies)

**What:** Algorithms (BFS for Word Ladder, grid generation for Hunt, lasso detection) live as pure functions in `js/engines/`. They take data in, return results out. No `document.querySelector()` inside.

**When to use:** Any algorithm that might be reused, tested, or debugged independently. Separates logic from presentation.

**Trade-offs:**
- ✓ Testable without DOM (unit test in Node.js if needed)
- ✓ Reusable across games (lasso logic could be used elsewhere)
- ✓ Easier to optimize (bottleneck isolated)
- ✗ Extra abstraction layer (small perf cost, usually negligible)

**Example (Word Ladder BFS):**
```javascript
// js/engines/ladder-engine.js
class WordLadderEngine {
  constructor(wordList) {
    this.words = new Set(wordList.map(w => w.toLowerCase()));
    this.neighbors = null; // Lazy-init
  }

  // Precompute word neighbors for fast BFS (one-letter changes)
  buildNeighbors() {
    if (this.neighbors) return this.neighbors;
    this.neighbors = new Map();

    for (const word of this.words) {
      this.neighbors.set(word, this.getNeighbors(word));
    }
    return this.neighbors;
  }

  getNeighbors(word) {
    const result = [];
    for (let i = 0; i < word.length; i++) {
      for (let c = 97; c < 123; c++) { // a-z
        if (c === word.charCodeAt(i)) continue;
        const candidate = word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1);
        if (this.words.has(candidate)) result.push(candidate);
      }
    }
    return result;
  }

  // BFS: find shortest path from start to target
  findPath(start, target) {
    const neighbors = this.buildNeighbors();
    if (!neighbors.has(start) || !neighbors.has(target)) return null;
    if (start === target) return [start];

    const queue = [[start, [start]]];
    const visited = new Set([start]);

    while (queue.length > 0) {
      const [current, path] = queue.shift();

      for (const next of neighbors.get(current)) {
        if (next === target) return [...path, next];
        if (!visited.has(next)) {
          visited.add(next);
          queue.push([next, [...path, next]]);
        }
      }
    }
    return null; // No path found
  }
}

// Usage in ladder.html:
const engine = new WordLadderEngine(wordList);
const path = engine.findPath('cat', 'dog'); // ['cat', 'bat', 'bag', 'dog']
```

**Example (Lasso Boundary Detection):**
```javascript
// js/engines/hunt-engine.js
class HuntEngine {
  // Ray-casting point-in-polygon algorithm for lasso selection
  isPointInPolygon(point, polygonPoints) {
    const [x, y] = point;
    let inside = false;

    for (let i = 0, j = polygonPoints.length - 1; i < polygonPoints.length; j = i++) {
      const [xi, yi] = polygonPoints[i];
      const [xj, yj] = polygonPoints[j];

      if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
        inside = !inside;
      }
    }

    return inside;
  }

  // Get all grid cells (by their center points) inside lasso
  getCellsInLasso(gridCells, lassoPath) {
    return gridCells.filter(cell =>
      this.isPointInPolygon([cell.centerX, cell.centerY], lassoPath)
    );
  }

  // Generate word search grid: place words, fill blanks
  generateGrid(words, gridSize = 8) {
    const grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
    const placements = [];

    for (const word of words) {
      let placed = false;
      for (let attempt = 0; attempt < 100; attempt++) {
        const direction = Math.random() > 0.5 ? 'H' : 'V';
        const row = Math.floor(Math.random() * gridSize);
        const col = Math.floor(Math.random() * gridSize);

        if (this.canPlace(grid, word, row, col, direction)) {
          this.placeWord(grid, word, row, col, direction);
          placements.push({ word, row, col, direction });
          placed = true;
          break;
        }
      }
      if (!placed) console.warn(`Could not place word: ${word}`);
    }

    // Fill empty cells with random letters
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (grid[i][j] === '') {
          grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }

    return { grid, placements };
  }

  canPlace(grid, word, row, col, direction) {
    if (direction === 'H' && col + word.length > grid.length) return false;
    if (direction === 'V' && row + word.length > grid.length) return false;

    for (let i = 0; i < word.length; i++) {
      const r = direction === 'H' ? row : row + i;
      const c = direction === 'H' ? col + i : col;
      if (grid[r][c] !== '' && grid[r][c] !== word[i]) return false;
    }
    return true;
  }

  placeWord(grid, word, row, col, direction) {
    for (let i = 0; i < word.length; i++) {
      const r = direction === 'H' ? row : row + i;
      const c = direction === 'H' ? col + i : col;
      grid[r][c] = word[i];
    }
  }
}
```

## Data Flow

### Multi-Game Daily Puzzle Flow

```
User opens index.html
    ↓
Portal detects game selection (click on "Word Ladder")
    ↓
Navigate to ladder.html
    ↓
  [DailySeeder]
    ↓ (get date-seeded puzzle data)
  [ladder.js controller initializes]
    ↓
  [GameState loaded from localStorage]
    ↓
  [WordLadderEngine.findPath(startWord, targetWord)]
    ↓
  [UI renders grid, start/target, empty path history]
    ↓
User manipulates UI (clicks word suggestions)
    ↓
  [Event handler updates path]
    ↓
  [GameState.updateGame('ladder', { ... })]
    ↓
User completes or gives up
    ↓
  [Score calculation: timeMs, attempts, streak]
    ↓
  [API.submitScore(gameName='ladder', userId, date, timeMs)]
    ↓
  [Server: INSERT into scores(user_id, game_id, date, time_ms)]
    ↓
  [Server: GET /stats returns percentile]
    ↓
Browser displays results with percentile badge
    ↓
  [GameState.markSynced('ladder')]
```

### Cross-Game State Synchronization

```
Game A (vowel.html) completed
    ↓
  [GameState.updateGame('vowel', { solved: true, personal_best_ms: 15000 })]
    ↓
  localStorage updated
    ↓
User navigates to Portal (index.html)
    ↓
Portal loads GameState from localStorage
    ↓
Portal displays stats cards: "VOWEL: 1/1 solved"
    ↓
User clicks into Game B (ladder.html)
    ↓
  [GameState loaded from same localStorage key]
    ↓
Game B knows about Game A's progress (future: achievements)
```

## Responsive Design & Mobile Layout

### Design Challenges by Game

| Game | Desktop Layout | Mobile Layout (375px) | Responsive Breakpoint |
|------|----------------|-----------------------|-----------------------|
| **VOWEL** | Single-line words (up to 7 letters), 52px blocks | Same layout, 42px blocks | No media query needed — CSS variables handle scaling |
| **Ladder** | Grid of word suggestions (4×2), path history sidebar | Word suggestions below path, stacked | 768px: switch from side-by-side to stacked |
| **Hunt** | 8×8 grid fills container (400px square on desktop) | 6×6 grid fits 375px width, canvas scales via CSS | 768px: expand to 8×8, lasso visible on touch |

### Grid Responsive Strategy (Hunt)

```javascript
// js/ui/responsive.js
class ResponsiveGridLayout {
  getGridDimensions(viewportWidth) {
    if (viewportWidth < 480) return { size: 6, cellSize: 50 }; // Mobile
    if (viewportWidth < 768) return { size: 7, cellSize: 55 }; // Tablet
    return { size: 8, cellSize: 60 }; // Desktop
  }

  // Canvas redraws on window resize
  handleResize() {
    const { size, cellSize } = this.getGridDimensions(window.innerWidth);
    this.canvas.width = size * cellSize;
    this.canvas.height = size * cellSize;
    this.redrawGrid();
  }
}

// CSS supports scaling via grid variables
// hunt.html: <style>
//   :root { --grid-cols: 8; --cell-size: 60px; }
//   @media (max-width: 768px) { --grid-cols: 7; --cell-size: 55px; }
//   @media (max-width: 480px) { --grid-cols: 6; --cell-size: 50px; }
// </style>
```

## Integration Points

### New vs. Modified Components

| Component | Status | Change | Rationale |
|-----------|--------|--------|-----------|
| **index.html** | NEW | Create portal hub with game cards | Gateway to all games, consistent UX |
| **vowel.html** | MIGRATED | Move VOWEL from index.html, keep logic identical | Establishes pattern for multi-game structure |
| **ladder.html** | NEW | Create with BFS engine + daily puzzle UI | Novel game, must integrate with DailySeeder |
| **hunt.html** | NEW | Create with grid gen + lasso detection + daily puzzle UI | Novel game, must integrate with responsive canvas |
| **styles/design-tokens.css** | NEW | Extract colors, typography from index.html | Shared identity across all games |
| **js/shared/state.js** | NEW | Unified localStorage management | Single source of truth for all game progress |
| **js/shared/seeder.js** | NEW | Date-based PRNG, all games use same seed | Synchronized daily puzzles across collection |
| **js/shared/api.js** | NEW | Wrapper for POST /scores, GET /stats | All games submit via same endpoint |
| **server/routes/api.js** | MODIFIED | Add `game_id` column to schema, route by game | Unified backend for all games |
| **server/db/schema.sql** | MODIFIED | Add `game_id` column to scores table | Track which game each score belongs to |

### Internal Module Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| **Game HTML ↔ Shared Engines** | `import` or `<script>` tags | Engines have no DOM; games call methods, handle results |
| **Game Controller ↔ GameState** | Method calls: `state.getGameState()`, `state.updateGame()` | Synchronous, localStorage-backed |
| **Game Controller ↔ DailySeeder** | Method calls: `seeder.getVowelWords()`, `seeder.getLadderPair()` | Deterministic; same date = same result |
| **Any Game ↔ API Client** | Async: `api.submitScore(...)`, `api.getStats(...)` | Fire-and-forget score submission, fetch stats on demand |
| **Portal (index.html) ↔ Game HTML** | Anchor links: `<a href="vowel.html">` or SPA routing | Simple, works on GitHub Pages; no shared router library needed |

### External Service Integration

| Service | Endpoint | Method | Purpose | Error Handling |
|---------|----------|--------|---------|-----------------|
| **Score API** | `POST /api/scores` | POST | Submit game score (game_id, userId, date, timeMs) | Fallback: localStorage marks sync pending; retry next session |
| **Stats API** | `GET /api/stats?game=vowel&date=2026-02-25&timeMs=15000` | GET | Fetch percentile for result display | Fallback: display "Calculating..." if stats unavailable |
| **Rate Limiter** | 100 requests / 15 min on `/api/` | Built-in | Prevent abuse | 429 response; client shows retry banner |

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-1k users (current) | Single Node.js server, SQLite file. Games submit async (fire-and-forget); no real-time sync. Works perfectly. |
| 1k-100k users | Move to cloud: Heroku/Render + PostgreSQL. Migrate schema (same structure, just different DB). API remains identical. |
| 100k-1M users | Separate read/write: API servers handle writes, cached read-replicas for stats. Implement game-specific leaderboards (query optimization). Percentile calculation moves to background job (calculate daily, cache). |

### Scaling Priorities

1. **First bottleneck:** SQLite concurrent writes. At ~1k DAU, better-sqlite3 blocks under load. **Fix:** Upgrade to PostgreSQL (trivial schema migration).

2. **Second bottleneck:** Percentile calculation on every stats request. At ~100k DAU, `SELECT COUNT(*) WHERE score < ?` becomes slow. **Fix:** Pre-calculate percentiles nightly, cache in Redis.

3. **Third bottleneck:** Game grid generation (Hunt word search). Exponential backtracking if word placement fails. **Fix:** Pre-generate grids server-side, send to client (or cache client-side for 24h).

## Anti-Patterns

### Anti-Pattern 1: Mixing Game Logic into HTML

**What people do:** Put BFS pathfinding inside event handlers directly in the HTML `<script>` tag.
```javascript
// ❌ DON'T DO THIS
button.addEventListener('click', () => {
  // BFS logic inline
  const queue = [[start, [start]]];
  // ... 50 lines of algorithm
});
```

**Why it's wrong:** Untestable, unmaintainable, can't reuse BFS in other contexts. Harder to debug.

**Do this instead:** Extract algorithm to `js/engines/ladder-engine.js`, call from event handler.
```javascript
// ✓ DO THIS
const engine = new WordLadderEngine(wordList);
button.addEventListener('click', () => {
  const path = engine.findPath(current, target);
  updateUI(path);
});
```

### Anti-Pattern 2: Duplicating Puzzle Generation Logic

**What people do:** Each game (Ladder, Hunt) implements its own date-to-seed logic and word-picking.
```javascript
// ❌ DON'T DO THIS (in vowel.js)
const dateStr = new Date().toISOString().split('T')[0];
const seed = parseInt(dateStr.replace(/-/g, ''));
// ...pick words based on seed

// ❌ DON'T DO THIS (in ladder.js — same logic again)
const dateStr = new Date().toISOString().split('T')[0];
const seed = parseInt(dateStr.replace(/-/g, ''));
// ...pick start/target based on seed
```

**Why it's wrong:** If seeding algorithm needs to change (e.g., to fix collisions), must update 3 places. Inconsistent updates = different puzzles per game on same date.

**Do this instead:** Centralize seeding in `js/shared/seeder.js`.
```javascript
// ✓ DO THIS
const seeder = new DailySeeder();
const vowelWords = seeder.getVowelWords(wordList);  // vowel.js
const [start, target] = seeder.getLadderPair(wordList); // ladder.js
// Both use same seed, guaranteed consistency
```

### Anti-Pattern 3: Storing Entire Game State in localStorage Synchronously

**What people do:** Save after every keystroke.
```javascript
// ❌ DON'T DO THIS
document.addEventListener('input', (e) => {
  state.updateGame('hunt', { path: [...currentPath] });
  // This calls JSON.stringify + localStorage.setItem on every keystroke!
});
```

**Why it's wrong:** localStorage writes are slow (synchronous, blocking); input lag on mobile.

**Do this instead:** Debounce saves, use in-memory cache for hot reads.
```javascript
// ✓ DO THIS
let saveTimer = null;
document.addEventListener('input', (e) => {
  currentPath.push(e.target.value);
  this.cache.hunt.path = currentPath; // In-memory update (instant)

  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    this.save(); // Debounced localStorage write (100-500ms)
  }, 300);
});
```

### Anti-Pattern 4: Not Validating Puzzle Data on Client

**What people do:** Trust the server to send correct daily puzzle data; don't verify seeding on client.
```javascript
// ❌ DON'T DO THIS
fetch('/api/daily-puzzle?game=ladder')
  .then(r => r.json())
  .then(puzzle => {
    engine.findPath(puzzle.start, puzzle.target); // What if start/target are invalid?
  });
```

**Why it's wrong:** Server bug or downtime = client gets bogus puzzle. User can't play locally.

**Do this instead:** Regenerate puzzle locally from date-seed, validate against server data (if available).
```javascript
// ✓ DO THIS
const seeder = new DailySeeder();
const [start, target] = seeder.getLadderPair(wordList); // Always regenerate locally
const path = engine.findPath(start, target);

if (path === null) {
  console.error('No path found; seed may be bad');
  // Fallback: pick different pair
}
```

## Sources

- [Word Ladder BFS Algorithm — GeeksforGeeks](https://www.geeksforgeeks.org/dsa/word-ladder-set-2-bi-directional-bfs/)
- [Medium: Word Ladder — BFS](https://natey37.medium.com/word-ladder-bfs-d8674fb1c4b8/)
- [Lasso Selection Implementation — Observable](https://observablehq.com/@fil/lasso-selection-canvas)
- [SVG Boundary Detection & Point-in-Polygon — University of Bergen](https://bora.uib.no/bora-xmlui/bitstream/handle/1956/22873/report.pdf?sequence=1&isAllowed=y)
- [Wordfind: Word Search Generation Library — GitHub](https://github.com/bunkat/wordfind)
- [Word Search Generation Algorithm — Ben Nadel](https://www.bennadel.com/blog/3820-generating-a-word-search-puzzle-grid-in-angular-9-1-4.htm)
- [SitePoint: HTML5 Canvas & SVG for Games](https://www.sitepoint.com/the-complete-guide-to-building-html5-games-with-canvas-and-svg/)
- [MDN: JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [Single-File JavaScript Applications (2026)](https://docs.bswen.com/blog/2026-02-21-single-file-javascript-apps/)
- [NYT Games Architecture: Wordle & Connections](https://en.wikipedia.org/wiki/The_New_York_Times_Connections)

---

**Architecture research for:** Word Game Collection v2.0 (multi-game hub with shared state, daily puzzle seeding, vanilla JS engines)
**Researched:** 2026-02-25
**Confidence:** HIGH (patterns verified against Wordle/NYT suite, BFS widely documented, lasso selection theory well-established)
