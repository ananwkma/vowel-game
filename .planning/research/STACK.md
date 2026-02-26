# Stack Research: Word Ladder & Letter Hunt Features

**Project:** Word Game Collection v2.0 (VOWEL expansion)
**Researched:** 2026-02-25
**Confidence:** HIGH
**Scope:** Two new games (Word Ladder, Letter Hunt) built on existing vanilla HTML/CSS/JS + Node/Express/SQLite stack

## Executive Summary

Both new games can be built with **zero additional frontend dependencies**. Word Ladder's BFS pathfinding and Letter Hunt's lasso selection are standard algorithms that vanilla JavaScript handles efficiently. The backend requires one optional npm package for enhanced word list management, but the existing embedded word list (2,710 words) is sufficient for MVP.

**Key architectural decision:** Use Canvas (not SVG) for Letter Hunt's lasso mechanic because (1) lasso paths are continuous drawing, not discrete objects; (2) point-in-polygon detection is simpler with Canvas isPointInPath API; (3) word-search grids benefit from pixel-level rendering; (4) consistent with existing game's Canvas animations.

---

## Recommended Stack

### Frontend (Vanilla — No Changes Required)

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| HTML5 Canvas | Native | Word Ladder: path history visualization; Letter Hunt: grid + lasso drawing | Native API with isPointInPath() for collision detection; consistent with VOWEL's animation canvas |
| Vanilla JavaScript (ES6+) | Native | BFS pathfinding (Word Ladder), grid generation (Letter Hunt), lasso polygon detection | Seeded PRNG already implemented in codebase; no build step needed; proven performance with VOWEL |
| SVG (HTML overlay only) | Native | Word Ladder: interactive path nodes/edges visualization (optional enhancement) | Interactivity and DOM event handlers superior to Canvas for clickable elements; use HTML overlay, not drawing canvas |

### Backend — Core (No Changes Required)

| Technology | Current Version | Purpose | Notes |
|------------|---------|---------|-------|
| Node.js | ^18+ (implied from packages) | Server runtime, daily puzzle delivery, score persistence | Already validated in v1.2; all new features use same architecture |
| Express.js | ^5.2.1 | REST API framework, CORS, rate limiting | Existing implementation sufficient; reuse POST /api/scores, GET /api/stats patterns |
| SQLite + better-sqlite3 | 12.6.2 | Game state, user scores, daily puzzle metadata | Existing implementation; add tables for Word Ladder attempts, Letter Hunt grids if persisting daily state |

### Backend — Word List Enhancement (Optional but Recommended)

| Library | Version | Purpose | When to Use | Installation |
|---------|---------|---------|-------------|--------------|
| word-list-google | ^4.1.0 | 10,000 most common English words by frequency (Google Trillion Word Corpus) | Word Ladder: faster BFS with common words; reduces cognitive load on players | `npm install word-list-google` |
| an-array-of-english-words | ^1.3.0 | 370K+ English words (comprehensive dictionary) | Word Ladder: expand search space if basic 2,710-word list exhausts puzzle variety; adjacency list preprocessing | `npm install an-array-of-english-words` |

**Rationale for optional: existing 2,710-word embedded list is sufficient for MVP (5 daily puzzles). Add word-list-google only if UX testing shows insufficient puzzle variety or if BFS times out on difficult paths.**

### Development Tools (No Changes)

| Tool | Current Version | Purpose | Notes |
|------|---------|---------|-------|
| dotenv | 17.3.1 | Environment variable management | Existing; no changes needed |
| cors | 2.8.6 | Cross-origin requests for local dev | Existing; already configured |
| express-rate-limit | 8.2.1 | API rate limiting | Existing; sufficient for new endpoints |

---

## Algorithm-Specific Stack Decisions

### Word Ladder: BFS Pathfinding

**No external library needed.** Implement inline:

```javascript
// Backend: Preprocessing (run once, cache results)
function buildAdjacencyList(wordList) {
  const adjacency = {};

  for (const word of wordList) {
    for (let i = 0; i < word.length; i++) {
      const pattern = word.slice(0, i) + '*' + word.slice(i + 1);
      if (!adjacency[pattern]) adjacency[pattern] = [];
      adjacency[pattern].push(word);
    }
  }
  return adjacency;
}

// Frontend: BFS search (5-8 word puzzles, fast on modern hardware)
function bfsWordLadder(startWord, endWord, wordList) {
  const queue = [[startWord, [startWord]]];
  const visited = new Set([startWord]);

  while (queue.length > 0) {
    const [current, path] = queue.shift();
    if (current === endWord) return path;

    // Try changing each letter
    for (let i = 0; i < current.length; i++) {
      for (let c = 97; c <= 122; c++) { // a-z
        const letter = String.fromCharCode(c);
        const neighbor = current.slice(0, i) + letter + current.slice(i + 1);

        if (!visited.has(neighbor) && wordList.has(neighbor)) {
          visited.add(neighbor);
          queue.push([neighbor, [...path, neighbor]]);
        }
      }
    }
  }
  return null; // No path found
}
```

**Complexity:** O(m × n × 26) where m = word length, n = word list size, 26 = alphabet. For 2,710 words, 4-letter words: ~3M operations. Instant on modern hardware.

**Why no library:** BFS is 20-30 lines of code. Adding a dependency (e.g., `graph-traversal` npm package) creates unnecessary build complexity that violates vanilla constraint.

---

### Letter Hunt: Word-Search Grid Generation

**No external library needed.** Implement inline:

```javascript
// Backend: Generate grid + word positions (deterministic per date)
function generateWordSearchGrid(words, gridSize, seed) {
  const grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
  const positions = {};
  const directions = [
    [0, 1],   // right
    [1, 0],   // down
    [1, 1],   // down-right
    [0, -1],  // left
    [-1, 0],  // up
    [-1, -1], // up-left
    [1, -1],  // down-left
    [-1, 1]   // up-right
  ];

  const rng = seededRandom(seed); // Reuse existing PRNG from VOWEL

  for (const word of words) {
    let placed = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      const row = Math.floor(rng() * gridSize);
      const col = Math.floor(rng() * gridSize);
      const dir = directions[Math.floor(rng() * directions.length)];

      if (canPlace(grid, word, row, col, dir, gridSize)) {
        placeWord(grid, word, row, col, dir);
        positions[word] = { row, col, dir };
        placed = true;
        break;
      }
    }
    if (!placed) console.warn(`Could not place word: ${word}`);
  }

  // Fill empty cells with random letters
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = String.fromCharCode(97 + Math.floor(rng() * 26));
      }
    }
  }

  return { grid, positions };
}
```

**Why no library:** Custom implementation lets you control determinism (seed-based for daily puzzles), return word positions for answer validation, and optimize grid size. Libraries like `wordsearch.js` are overkill and reduce flexibility.

---

### Letter Hunt: Lasso Selection & Polygon Detection

**Canvas + vanilla geometry. No external library needed.**

**Key decision: Canvas over SVG** because:

1. **Continuous drawing:** Lasso is a path traced by the user, not discrete clickable shapes. Canvas `lineTo()` + `stroke()` is the natural fit.
2. **Collision detection:** Canvas provides `isPointInPath()` API which determines if a grid letter's center is inside the lasso polygon (exact algorithm: winding number or ray-casting, implemented by the browser).
3. **Grid rendering:** Word-search grid (10×10 or similar) is raster-friendly; Canvas rendering is faster than SVG for pixel-dense content.
4. **Consistency:** VOWEL already uses Canvas for block animations; Letter Hunt grid + lasso on the same canvas avoids layering complexity.

```javascript
// Frontend: Draw lasso and detect words
let lassoPath = [];
let isDrawing = false;

canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  lassoPath = [getMousePos(e)];
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDrawing) return;
  const pos = getMousePos(e);
  lassoPath.push(pos);
  redrawLasso();
});

canvas.addEventListener('mouseup', (e) => {
  isDrawing = false;
  const selectedLetters = detectLettersInLasso(lassoPath);
  const detectedWords = matchWordsInSelection(selectedLetters);
  handleWordMatch(detectedWords);
});

// Collision detection: use Canvas isPointInPath
function detectLettersInLasso(path) {
  const selected = [];

  // Build canvas path from lasso points
  ctx.beginPath();
  ctx.moveTo(path[0].x, path[0].y);
  for (let i = 1; i < path.length; i++) {
    ctx.lineTo(path[i].x, path[i].y);
  }
  ctx.closePath();

  // Check each letter's center point
  for (let r = 0; r < gridRows; r++) {
    for (let c = 0; c < gridCols; c++) {
      const letterCenterX = cellStartX + c * cellSize + cellSize / 2;
      const letterCenterY = cellStartY + r * cellSize + cellSize / 2;

      if (ctx.isPointInPath(letterCenterX, letterCenterY)) {
        selected.push({ row: r, col: c, letter: grid[r][c] });
      }
    }
  }

  return selected;
}

// Match lasso selection against answer words
function matchWordsInSelection(selectedLetters) {
  const found = [];
  for (const [word, { row, col, dir }] of Object.entries(positions)) {
    if (isWordInSelection(word, row, col, dir, selectedLetters)) {
      found.push(word);
    }
  }
  return found;
}
```

**Why not a library:** Point-in-polygon algorithms are 10-20 lines and Canvas `isPointInPath()` handles the hard geometry. Libraries like `point-in-polygon` npm package are unnecessary overhead.

---

## Backend API Extensions

No new dependencies. Extend existing Express routes:

```javascript
// POST /api/daily-puzzle?game=wordladder|letterhunt
// Returns: { puzzle_id, startWord, endWord, gridSeed, category, ... }

// POST /api/attempts
// { userId, puzzleId, game, path (word ladder) or selectedWords (letter hunt), timeMs }

// Reuse existing: POST /api/scores (timeMs only) for leaderboard
```

Existing database schema suffices; add tables for game-specific metadata if persisting daily state (optional for MVP).

---

## Installation

```bash
# No frontend changes needed
# Backend: optional word list enhancements (skip for MVP)

npm install word-list-google

# OR comprehensive dictionary (if expanding to 10K+ word list)
npm install an-array-of-english-words
```

**For MVP:** Use existing embedded word list. Only install `word-list-google` if UX testing shows variety issues.

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Vanilla BFS | graph-traversal npm package | If building multiplayer real-time pathfinding with 100K+ nodes. For single-player daily 5-word puzzles, overhead not justified. |
| Canvas lasso + isPointInPath | SVG event handlers + path detection library | If lasso needs to be interactive UI element (e.g., resizable, editable). For static draw-once-per-game mechanic, Canvas is simpler. |
| Inline grid generation | wordsearch.js npm package | If building puzzle admin dashboard with customizable parameters. For deterministic daily puzzles, custom code maintains control over randomness. |
| Embedded word list (2,710) | word-list-google (10K) or an-array-of-english-words (370K) | Embedded list sufficient for 5 daily puzzles across ~years of content. Upgrade only if puzzle variety exhaustion detected in testing. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| React / Vue / Svelte | Breaks vanilla constraint; adds build step and 200K+ bundle bloat for simple games | Vanilla HTML/CSS/JS with modular functions in single index.html |
| D3.js for pathfinding visualization | Overkill for simple path history display; 200K library for 100 lines of DOM manipulation | Canvas or simple SVG DOM overlay (10 lines of JS) |
| Konva.js for Letter Hunt grid | Canvas library for complex scene graphs; Letter Hunt only needs single grid layer + lasso layer | Native Canvas API (isPointInPath, lineTo, fillText) |
| MongoDB / PostgreSQL backend | Adds DevOps complexity for local-only MVP; SQLite already validated | Stick with SQLite; upgrade to cloud DB only if deploying publicly |
| Three.js or Babylon.js for 3D | Completely out of scope; games are 2D puzzles | Canvas 2D context (native) |

---

## Stack Patterns by Variant

**If puzzle variety testing shows word exhaustion:**
- Install `word-list-google` (10K words, ranked by frequency)
- Rebuild adjacency list with larger word set
- BFS still O(m × n × 26); no performance issues up to 100K words on modern hardware

**If deploying beyond local dev:**
- Keep Node/Express/SQLite; consider Docker containerization
- Add environment variables for database path (already using dotenv)
- No code changes needed; infrastructure change only

**If adding hint system later (ENH-04):**
- Extend Word Ladder: reveal one word in path
- Extend Letter Hunt: highlight one word's letters
- Both implementable in existing architecture; no new dependencies

---

## Version Compatibility

| Package | Current | Notes |
|---------|---------|-------|
| express | 5.2.1 | Compatible with Node 18+; cors and rate-limit require no changes |
| better-sqlite3 | 12.6.2 | Requires node-gyp; no issues with Windows/Mac/Linux in existing setup |
| word-list-google | 4.1.0+ | Pure JS data; no native dependencies; drop-in replacement if installed |
| an-array-of-english-words | 1.3.0+ | Pure JS; ~5MB uncompressed; only install if needed |

**No breaking changes if adding optional packages.** Existing code runs unchanged.

---

## Frontend Architecture: Code Organization

Single `index.html` (vanilla) with modular structure:

```
index.html
├── <head>: Styles (existing for VOWEL, add Letter Hunt/Word Ladder)
├── <body>
│   ├── Game hub (nav cards)
│   ├── Game containers
│   │   ├── #vowel-game (existing)
│   │   ├── #word-ladder-game (new)
│   │   └── #letter-hunt-game (new)
│   └── <script>
│       ├── Shared utilities
│       │   └── seededRandom(), fetchAPI(), etc.
│       ├── VOWEL game (existing ~2K lines)
│       ├── Word Ladder game (~300 lines)
│       │   ├── BFS pathfinding
│       │   ├── Path history rendering (Canvas)
│       │   └── UI (results screen)
│       └── Letter Hunt game (~400 lines)
│           ├── Grid generation + rendering
│           ├── Lasso drawing + collision detection
│           └── Word matching
```

**Total new code:** ~700 lines JavaScript. No bundler, no build step.

---

## Testing Strategy (No New Dependencies)

Vanilla JS testing without a framework:

```javascript
// In browser console or simple HTML test page
function testBFS() {
  const result = bfsWordLadder('cat', 'dog', wordSet);
  console.assert(result && result.length <= 5, 'BFS path found');
}

function testGridGeneration() {
  const { grid } = generateWordSearchGrid(['cat', 'dog'], 10, 'seed');
  console.assert(grid.length === 10, 'Grid size correct');
}

function testLassoDetection() {
  const path = [{x: 100, y: 100}, {x: 150, y: 100}, {x: 150, y: 150}, {x: 100, y: 150}];
  const selected = detectLettersInLasso(path);
  console.assert(selected.length > 0, 'Letters detected');
}
```

No Jest, Mocha, or other test framework needed for MVP. Manual testing + browser console sufficient.

---

## Summary Table: Stack by Game

| Aspect | VOWEL (Existing) | Word Ladder (New) | Letter Hunt (New) |
|--------|------------------|-------------------|-------------------|
| Frontend | HTML/CSS/Vanilla JS | Same + BFS algorithm | Same + Canvas lasso + isPointInPath |
| Canvas | Animations (blocks, text) | Path history display | Grid + lasso drawing |
| Backend | Node/Express/SQLite | Reuse; optional word list upgrade | Reuse; optional grid metadata table |
| Dependencies | 5 npm packages | +0 (or +1 optional) | +0 (or +1 optional) |
| Build step | None | None | None |

---

## Sources

- **BFS Pathfinding:** [Word Ladder — BFS](https://natey37.medium.com/word-ladder-bfs-d8674fb1c4b8), [GeeksforGeeks Word Ladder Set 2](https://www.geeksforgeeks.org/dsa/word-ladder-set-2-bi-directional-bfs/), [CodePath Word Ladder](https://guides.codepath.org/compsci/Word-Ladder)
- **Word Search Grid Generation:** [wordsearch.js](https://github.com/bahamas10/wordsearch.js), [wordfind](https://github.com/bunkat/wordfind), [FreeCodeCamp Article](https://www.freecodecamp.org/news/build-a-word-search-game-using-html-css-and-javascript/)
- **Canvas Lasso Selection:** [akcyp/lasso-canvas-image](https://github.com/akcyp/lasso-canvas-image), [Observable Lasso Selection](https://observablehq.com/@fil/lasso-selection-canvas), [Tutsplus Canvas Drawing](https://webdesign.tutsplus.com/how-to-create-a-canvas-drawing-tool-with-vanilla-javascript--cms-108856t)
- **Point-in-Polygon Algorithms:** [Understanding point-in-polygon](https://observablehq.com/@tmcw/understanding-point-in-polygon), [metafloor/pointinpoly](https://github.com/metafloor/pointinpoly), [Wikipedia Point in polygon](https://en.wikipedia.org/wiki/Point_in_polygon)
- **Canvas vs SVG 2026:** [Augustine Fotech Blog](https://www.augustinfotech.com/blogs/svg-vs-canvas-animation-what-modern-frontends-should-use-in-2026/), [SitePoint Comparison](https://www.sitepoint.com/canvas-vs-svg/), [Boris Smus Performance](https://smus.com/canvas-vs-svg-performance/)
- **Word Lists & Corpus:** [word-list-google npm](https://www.npmjs.com/package/word-list-google), [an-array-of-english-words npm](https://www.npmjs.com/package/an-array-of-english-words), [Seeded Random](https://medium.com/@modos.m98/creating-a-seeded-random-string-generator-in-javascript-3165aae1c2d5)
- **Existing Project:** VOWEL v1.2 codebase (seeded PRNG, Canvas animations, Node/Express/SQLite backend validated)

---

**Stack research for:** Word Game Collection v2.0 expansion
**Researched:** 2026-02-25
**Status:** READY FOR IMPLEMENTATION
