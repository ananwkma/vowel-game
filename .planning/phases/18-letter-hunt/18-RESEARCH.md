# Phase 18: Letter Hunt - Research

**Researched:** 2026-02-27
**Domain:** Vanilla JS word-search puzzle — CSS grid, Pointer Events drag selection, canvas lasso overlay, two-phase timer, daily seeded generation
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Grid & Word Placement**
- Size: Start with 10x10; fall back to 8x8 if cells are too small on mobile
- Directions: Horizontal, vertical, and diagonal — no reverse/backwards words
- Filler letters: Random (standard word-search approach)
- Word difficulty distinction: Easy and hard words are similar length; difficulty comes from word familiarity and placement, not length. Hard words are rarer/less obvious.

**Lasso Selection Mechanics**
- Interaction: Drag highlights individual letter cells one by one as finger/cursor passes over them (snaps to cells, not freeform)
- Visual feedback during drag: Both cells highlight (amber) AND a line traces the path simultaneously
- Correct word found: Letters lock in sage green (#8BAF7C), matching other games' success color
- Wrong selection: Selection shakes then dissolves/fades out silently (no score penalty, just visual feedback)
- Already-found words: Dim to a subtle tint after found (keep grid readable)

**Progress Indicator**
- Colored pips at top of game (like VOWEL) — grey for not found, green for found
- Red pips indicate words that were found using a hint
- 6 pips total (3 easy + 3 hard), or split into two groups of 3

**Two-Phase Flow & Category Reveal**
- No explicit "Phase 1 / Phase 2" UI — just 3 easy words and 3 hard words in one continuous game
- During easy words: category name shows as "???" — total mystery
- After all 3 easy words found: category name reveals with a big stamp/pop animation
- Hard phase timer starts immediately after reveal — no pause or interstitial button
- Easy timer and hard timer run independently

**Hint System**
- Interaction: Tap a hint button — briefly highlights the first letter of one unfound word
- Quantity: Unlimited hints, but each hint adds a time penalty to the score
- Results tracking: Words found after using a hint are indicated with red pips on the results screen

**Scoring**
- Score = time only — two separate times: time to find all 3 easy words, and time to find all 3 hard words
- Hint time penalties are added to whichever phase timer the hint was used in

**Results Screen**
- Matches exact layout and style of cipher/ladder: LEXICON top-left, HUNT title top-center, ? top-right, share button
- Content shows: easy time + hard time + revealed category name + all 6 words listed
- Pip summary showing which words were found cleanly (green) vs with hints (red)
- Hub completion: writing to `wordGames_dailyStatus` marks Hunt as complete for the day; finding all 6 words counts (hints allowed; even give-up counts)

### Claude's Discretion
- Exact pip layout (6 in a row vs split 3+3)
- Time penalty amount per hint
- Animation details for the category reveal stamp
- Exact color/style of the drag-trace line
- How "give up" manifests (since there's no hold button, likely a different interaction)

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| HUNT-01 | User can play a daily Letter Hunt puzzle — one word-search grid per day, same for all players | Seeded PRNG pattern from ladder/vowel; `DATE_SEED` with `_hunt_v1` suffix; hardcoded word/category corpus |
| HUNT-02 | The puzzle contains 6 hidden words belonging to a mystery category (3 easy + 3 hard) arranged in the grid | Grid placement algorithm; backtracking word placement; filler letter generation |
| HUNT-03 | User can click-and-drag to draw a lasso/bubble selection around letters; valid category words persist highlighted, invalid selections dissolve | Pointer Events API; CSS grid cell hit-detection via `document.elementFromPoint`; canvas overlay for trace line; shake+fade CSS animation |
| HUNT-04 | After all 3 easy words are found, the mystery category name is revealed before the hard phase begins | Phase state machine; stamp animation (CSS scale+opacity keyframe); category display toggles |
| HUNT-05 | Easy phase and hard phase are each timed independently, with separate scores recorded for each | Two independent `setInterval` timers; pause/resume pattern; localStorage result persistence matching `LadderResult` pattern |

</phase_requirements>

---

## Summary

Letter Hunt is the most technically complex game in the collection. The core challenge is a word-search puzzle with a drag-to-select mechanic, a two-phase structure (easy/hard words around a mystery category reveal), and per-phase timing. All prior games used pure CSS for interaction; Letter Hunt adds a canvas lasso-line overlay on top of a CSS grid — a hybrid approach locked in STATE.md for mobile performance.

The architecture splits cleanly into four systems: (1) puzzle generation — seeded word placement in a 10x10 grid, (2) drag selection — Pointer Events API hitting CSS grid cells via `elementFromPoint`, (3) phase management — a state machine tracking easy→reveal→hard transitions with independent timers, and (4) results/persistence — matching the established `DailyStatus` + results-screen pattern from cipher.html.

No external libraries are used. The project is plain vanilla JS/CSS/HTML with no build step. All patterns must follow the conventions established in vowel.html, ladder.html, and cipher.html.

**Primary recommendation:** Build hunt.html as a full replacement of the current placeholder, following the section-commented structure of cipher.html. Use CSS grid for the letter cells, canvas overlay (positioned absolute over the grid) for the drag-trace line, and Pointer Events for unified input. Mirror the DailyStatus pattern exactly.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vanilla JS | N/A | All game logic | No build step; project-wide convention |
| CSS Grid | N/A | 10x10 letter grid layout | Natural fit; easy cell sizing; responsive |
| Pointer Events API | Web standard | Drag input (touch + mouse unified) | Locked in STATE.md for Android budget device compat |
| Canvas 2D API | Web standard | Lasso trace line only | Locked in STATE.md; `isPointInPath()` native collision |
| `localStorage` | Web standard | Daily result + progress persistence | All other games use this; no backend needed for v2.0 |
| Web Animations API | Web standard | Stamp reveal, shake/fade, confetti | Already used in cipher.html (confetti, decode animation) |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `navigator.clipboard` | Web standard | Share result copy to clipboard | Share button on results screen; fallback to `prompt()` |
| `navigator.share` | Web standard | Native share sheet | cipher.html uses this pattern; fallback to clipboard |
| `design-tokens.css` | Project | Shared colors, fonts, spacing | Required for all game pages |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Canvas trace line | SVG overlay | SVG rejected in STATE.md; canvas chosen for mobile perf |
| CSS grid cells | Canvas grid | Canvas grid rejected; CSS is simpler and accessible |
| Pointer Events | Touch + Mouse events | Pointer Events unified; fewer edge cases on Android |

**Installation:** No npm install needed — all vanilla. The server dependencies (express, better-sqlite3) are backend only and not used by the game HTML files.

---

## Architecture Patterns

### Recommended File Structure

```
hunt.html               # Single-file game (all CSS + JS inline, matching cipher.html pattern)
styles/design-tokens.css  # Already exists — import as first stylesheet
```

All game logic lives in `hunt.html` as one file. This is the established project pattern (vowel.html, ladder.html, cipher.html are all self-contained).

### Recommended HTML Section Layout

```
<!-- HEAD: meta, viewport, design-tokens link, inline <style> -->
<!-- BODY structure: -->
<a id="back-link">          <!-- Fixed top-left, LEXICON text, same as all games -->
<div id="app">
  <div id="game-header">   <!-- HUNT title (center), help button (?), pip row -->
  <div id="game-content">  <!-- grid wrapper + canvas overlay -->
  <div id="game-footer">   <!-- hint button, category display (??? / revealed) -->
</div>
<div id="results-screen">  <!-- fixed overlay, hidden initially, matches cipher pattern -->
<div id="help-modal">      <!-- instructions modal -->
<script>                   <!-- all JS inline at bottom of body -->
```

### CSS Section Layout (mirror cipher.html section comments)

```css
/* SECTION: GOOGLE FONTS */
/* SECTION: CSS VARIABLES (bridge tokens to hunt-specific names) */
/* SECTION: GLOBAL RESET & BASE */
/* SECTION: BACK TO HUB */
/* SECTION: LAYOUT */
/* SECTION: TITLE */
/* SECTION: PROGRESS INDICATOR (pips) */
/* SECTION: GRID */
/* SECTION: CANVAS OVERLAY */
/* SECTION: CATEGORY DISPLAY */
/* SECTION: HINT BUTTON */
/* SECTION: RESULTS SCREEN */
/* SECTION: HELP MODAL */
/* SECTION: ANIMATIONS */
/* SECTION: BUTTONS */
```

### JS Section Layout

```js
/* SECTION: CONSTANTS & WORD DATA */
/* SECTION: SEEDED PRNG (copy from ladder.html verbatim) */
/* SECTION: DAILY SEED */
/* SECTION: GRID GENERATION */
/* SECTION: GAME STATE */
/* SECTION: TIMERS */
/* SECTION: DRAG SELECTION */
/* SECTION: PHASE MANAGEMENT */
/* SECTION: HINT SYSTEM */
/* SECTION: PROGRESS (pips) */
/* SECTION: DAILY STATUS (copy DailyStatus from cipher.html) */
/* SECTION: RESULT PERSISTENCE */
/* SECTION: RESULTS SCREEN */
/* SECTION: HELP MODAL */
/* SECTION: DOMCONTENTLOADED — boot */
```

### Pattern 1: CSS Grid for Letter Cells

**What:** The 10x10 grid is a CSS grid container; each cell is a `<div>` with a `data-row` and `data-col` attribute. No canvas for the cells themselves.

**When to use:** Cell layout, hit detection anchor, visual state (highlighted, found, found-with-hint, dimmed)

**Example:**
```html
<div id="grid-container" style="position: relative;">
  <div id="letter-grid"></div>  <!-- CSS grid -->
  <canvas id="lasso-canvas"></canvas>  <!-- absolute overlay -->
</div>
```

```css
#grid-container {
  position: relative;
  display: inline-block; /* shrink to fit grid */
}

#letter-grid {
  display: grid;
  grid-template-columns: repeat(10, var(--cell-size));
  grid-template-rows: repeat(10, var(--cell-size));
  gap: 2px;
  user-select: none;
  touch-action: none; /* prevent scroll during drag */
}

#lasso-canvas {
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* let events pass through to cells */
}

.grid-cell {
  width: var(--cell-size);
  height: var(--cell-size);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-serif);
  font-weight: 700;
  font-size: calc(var(--cell-size) * 0.45);
  border-radius: 3px;
  background: rgba(28, 27, 24, 0.06);
  cursor: default;
  transition: background-color 150ms ease-out;
}

.grid-cell.active {
  background-color: var(--color-primary); /* amber during drag */
  color: var(--color-primary-text);
}

.grid-cell.found {
  background-color: var(--color-success); /* sage green */
  color: white;
}

.grid-cell.found-hint {
  background-color: var(--color-warning); /* dusty rose — hint-assisted */
  color: white;
  opacity: 0.7;
}

.grid-cell.shake {
  animation: cell-shake 400ms ease-out forwards;
}

@keyframes cell-shake {
  0%   { transform: translateX(0); }
  20%  { transform: translateX(-4px); }
  40%  { transform: translateX(4px); }
  60%  { transform: translateX(-3px); }
  80%  { transform: translateX(3px); }
  100% { transform: translateX(0); opacity: 0; }
}
```

### Pattern 2: Cell Size Calculation (10x8 Responsive Fallback)

**What:** Cell size is computed from available viewport width. If the computed size is too small (< 28px on mobile), fall back to 8x8 grid.

**When to use:** `initGame()` after viewport size is known.

**Example:**
```javascript
const GRID_SIZES = [10, 8]; // try 10x10, fall back to 8x8

function chooseGridSize() {
  const availableWidth = Math.min(window.innerWidth, 500) - 32; // 16px padding each side
  for (const size of GRID_SIZES) {
    const cellSize = Math.floor((availableWidth - (size - 1) * 2) / size); // gap=2px
    if (cellSize >= 28) return { size, cellSize };
  }
  return { size: 8, cellSize: 36 }; // absolute fallback
}
```

### Pattern 3: Word Placement Algorithm

**What:** Place 6 words in the grid, then fill remaining cells with random letters. Try positions randomly (seeded), retry on conflict. Words go in horizontal, vertical, or diagonal directions only (no reverse).

**When to use:** `generateGrid()` during puzzle initialization.

**Example:**
```javascript
const DIRECTIONS = [
  [0, 1],   // right (horizontal)
  [1, 0],   // down (vertical)
  [1, 1],   // diagonal down-right
  [1, -1],  // diagonal down-left
];

function placeWords(words, gridSize, rng) {
  const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));
  const placements = []; // { word, cells: [{row, col}] }

  for (const word of words) {
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 200) {
      attempts++;
      const dir = DIRECTIONS[Math.floor(rng() * DIRECTIONS.length)];
      const [dr, dc] = dir;
      // Constrain start so word fits
      const maxRow = dr > 0 ? gridSize - word.length * Math.abs(dr) : (dr < 0 ? word.length - 1 : gridSize - 1);
      const maxCol = dc > 0 ? gridSize - word.length : (dc < 0 ? word.length - 1 : gridSize - 1);
      const minRow = dr < 0 ? word.length - 1 : 0;
      const minCol = dc < 0 ? word.length - 1 : 0;
      const row = minRow + Math.floor(rng() * (maxRow - minRow + 1));
      const col = minCol + Math.floor(rng() * (maxCol - minCol + 1));

      // Check all cells are free or already have the correct letter
      const cells = [];
      let conflict = false;
      for (let i = 0; i < word.length; i++) {
        const r = row + i * dr;
        const c = col + i * dc;
        if (grid[r][c] !== null && grid[r][c] !== word[i]) { conflict = true; break; }
        cells.push({ row: r, col: c });
      }

      if (!conflict) {
        cells.forEach(({ row: r, col: c }, i) => { grid[r][c] = word[i]; });
        placements.push({ word, cells });
        placed = true;
      }
    }
    if (!placed) return null; // signal retry with different seed attempt
  }

  // Fill remaining cells with random uppercase letters
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (grid[r][c] === null) grid[r][c] = letters[Math.floor(rng() * 26)];
    }
  }

  return { grid, placements };
}
```

### Pattern 4: Pointer Events Drag Selection

**What:** Track drag over grid cells using `pointermove`. Identify which cell the pointer is over using `document.elementFromPoint`. Accumulate cells into current selection.

**Why `elementFromPoint` not `getBoundingClientRect` per cell:** elementFromPoint handles the exact pixel under the finger without iterating all cells — O(1) per move event.

**Example:**
```javascript
let isDragging = false;
let selectedCells = []; // [{row, col, el}]

gridContainer.addEventListener('pointerdown', (e) => {
  if (gameOver) return;
  e.preventDefault();
  isDragging = true;
  selectedCells = [];
  gridContainer.setPointerCapture(e.pointerId); // keep tracking even if finger leaves grid
  const cell = getCellAt(e.clientX, e.clientY);
  if (cell) addCellToSelection(cell);
});

gridContainer.addEventListener('pointermove', (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const cell = getCellAt(e.clientX, e.clientY);
  if (cell && !isCellInSelection(cell)) {
    addCellToSelection(cell);
    drawTraceLine();
  }
});

gridContainer.addEventListener('pointerup', (e) => {
  if (!isDragging) return;
  isDragging = false;
  evaluateSelection();
});

gridContainer.addEventListener('pointercancel', (e) => {
  isDragging = false;
  clearSelection();
});

function getCellAt(clientX, clientY) {
  const el = document.elementFromPoint(clientX, clientY);
  if (el && el.classList.contains('grid-cell')) {
    return { row: parseInt(el.dataset.row), col: parseInt(el.dataset.col), el };
  }
  return null;
}
```

**Critical:** `touch-action: none` on `#letter-grid` prevents the browser from scrolling during drag. `setPointerCapture` ensures events continue if the finger moves off the grid element.

### Pattern 5: Canvas Trace Line

**What:** A `<canvas>` positioned absolute over the grid (pointer-events: none) draws the line connecting selected cells. Redrawn on every `pointermove`.

**Why canvas not SVG:** Locked in STATE.md. Canvas `clearRect` + `lineTo` is faster than DOM SVG manipulation on budget mobile.

**Example:**
```javascript
const canvas = document.getElementById('lasso-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  const rect = document.getElementById('letter-grid').getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
}

function drawTraceLine() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (selectedCells.length < 2) return;

  const gridRect = document.getElementById('letter-grid').getBoundingClientRect();

  ctx.beginPath();
  ctx.strokeStyle = 'rgba(212, 165, 116, 0.7)'; // amber, semi-transparent
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  selectedCells.forEach(({ el }, i) => {
    const cellRect = el.getBoundingClientRect();
    const x = cellRect.left - gridRect.left + cellRect.width / 2;
    const y = cellRect.top - gridRect.top + cellRect.height / 2;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });

  ctx.stroke();
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
```

### Pattern 6: Selection Evaluation

**What:** On `pointerup`, check if the sequence of selected cells spells out a target word. Order matters — cells must be consecutive in a straight line.

**Example:**
```javascript
function evaluateSelection() {
  const word = selectedCells.map(c => gridData[c.row][c.col]).join('');
  const reverseWord = word.split('').reverse().join('');

  // Check against unfound words (forward only — no reverse words per design)
  const match = unfoundWords.find(w => w.word === word);

  clearCanvas();

  if (match) {
    markWordFound(match);
  } else {
    shakeAndClear();
  }
}

function shakeAndClear() {
  selectedCells.forEach(({ el }) => el.classList.add('shake'));
  setTimeout(() => {
    selectedCells.forEach(({ el }) => el.classList.remove('shake'));
    clearSelection();
  }, 400);
}

function clearSelection() {
  selectedCells.forEach(({ el }) => {
    if (!el.classList.contains('found')) el.classList.remove('active');
  });
  selectedCells = [];
  clearCanvas();
}
```

### Pattern 7: Two-Phase Timer

**What:** Two independent `setInterval` counters. Easy timer runs from game start; stops when 3rd easy word is found. Hard timer starts immediately after category reveal.

**Example:**
```javascript
const gameState = {
  phase: 'easy', // 'easy' | 'reveal' | 'hard' | 'done'
  easyStartTime: null,
  easyElapsed: 0,     // ms, stopped when easy phase ends
  hardStartTime: null,
  hardElapsed: 0,
  hintPenaltyEasy: 0, // ms added to easy timer
  hintPenaltyHard: 0, // ms added to hard timer
  easyTimerInterval: null,
  hardTimerInterval: null,
  wordsFound: [],     // { word, usedHint }
};

function startEasyTimer() {
  gameState.easyStartTime = Date.now();
  gameState.easyTimerInterval = setInterval(() => {
    gameState.easyElapsed = Date.now() - gameState.easyStartTime;
    renderEasyTimer();
  }, 100);
}

function stopEasyTimer() {
  clearInterval(gameState.easyTimerInterval);
  gameState.easyElapsed = Date.now() - gameState.easyStartTime + gameState.hintPenaltyEasy;
}

function startHardTimer() {
  gameState.hardStartTime = Date.now();
  gameState.hardTimerInterval = setInterval(() => {
    gameState.hardElapsed = Date.now() - gameState.hardStartTime;
    renderHardTimer();
  }, 100);
}

function stopHardTimer() {
  clearInterval(gameState.hardTimerInterval);
  gameState.hardElapsed = Date.now() - gameState.hardStartTime + gameState.hintPenaltyHard;
}

function formatTime(ms) {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
```

### Pattern 8: Category Reveal Stamp

**What:** After 3rd easy word found, category shows as "???" → animates to the real name with a scale+bounce keyframe (the "stamp" moment). Hard timer starts immediately after.

**Example:**
```css
#category-display {
  font-family: var(--font-serif);
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-align: center;
  color: var(--color-primary-text);
  min-height: 2rem;
}

.category-stamp {
  animation: stamp-reveal 400ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes stamp-reveal {
  0%   { transform: scale(3) rotate(-6deg); opacity: 0; }
  60%  { transform: scale(0.95) rotate(1deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}
```

```javascript
function revealCategory() {
  gameState.phase = 'hard';
  stopEasyTimer();

  const el = document.getElementById('category-display');
  el.textContent = dailyPuzzle.category;
  el.classList.add('category-stamp');

  // Hard timer starts immediately (no user action needed)
  setTimeout(startHardTimer, 50);
}
```

### Pattern 9: Pip System (6 pips)

**What:** Six pip dots at top, split 3+3 (easy group | hard group). States: grey (unfound), green (found clean), red (found with hint). Mirror the vowel.html `.pip`, `.pip.solved`, `.pip.gaveup` pattern exactly.

**Example:**
```html
<div id="pip-row" aria-hidden="true">
  <div class="pip-group" id="pip-easy">
    <span class="pip" data-word="0"></span>
    <span class="pip" data-word="1"></span>
    <span class="pip" data-word="2"></span>
  </div>
  <div class="pip-separator"></div>
  <div class="pip-group" id="pip-hard">
    <span class="pip" data-word="3"></span>
    <span class="pip" data-word="4"></span>
    <span class="pip" data-word="5"></span>
  </div>
</div>
```

```css
#pip-row {
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: center;
}

.pip-group {
  display: flex;
  gap: 6px;
}

.pip-separator {
  width: 12px; /* visual gap between easy/hard groups */
}

.pip {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgba(28, 27, 24, 0.18);
  transition: background-color 0.3s ease;
}

.pip.solved  { background-color: var(--color-success); } /* sage green */
.pip.hinted  { background-color: var(--color-warning); } /* dusty rose */
```

### Pattern 10: Seeded PRNG (copy verbatim from ladder.html)

**What:** Murmurhash-inspired seeded PRNG. Identical copy from ladder.html (which copied from vowel.html). Game-namespaced seed.

**Example:**
```javascript
// Source: vowel.html → ladder.html → hunt.html (unchanged)
function seededRandom(seedStr) {
  let h = 0;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(31, h) + seedStr.charCodeAt(i) | 0;
  }
  let s = h >>> 0;
  return function() {
    s += 0x6D2B79F5;
    let t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

const DATE_SEED = (() => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return today + '_hunt_v1'; // _hunt_v1 suffix: game-namespaced, v1 enables future rotation
})();
```

### Pattern 11: DailyStatus (copy verbatim from cipher.html)

**What:** Writes completion record to `wordGames_dailyStatus` in localStorage. Hub reads this to show "completed" state on the card. Pattern is identical in ladder.html and cipher.html.

**Example:**
```javascript
// Source: cipher.html DailyStatus (identical pattern in ladder.html)
const DailyStatus = {
  KEY: 'wordGames_dailyStatus',
  markCompleted(gameId) {
    const today = new Date().toISOString().split('T')[0];
    let status = {};
    try {
      status = JSON.parse(localStorage.getItem(this.KEY) || '{}');
    } catch(e) {}
    status[gameId] = { completed: true, dateKey: today, timestamp: Date.now() };
    try {
      localStorage.setItem(this.KEY, JSON.stringify(status));
    } catch(e) {
      console.warn('[DailyStatus] Save error:', e);
    }
  }
};

// Call when all 6 words found (or give-up):
DailyStatus.markCompleted('hunt');
```

### Pattern 12: Hunt Result Persistence

**What:** Save today's result so revisiting shows results screen, not the game. Mirror LadderResult pattern.

**Example:**
```javascript
const HuntResult = {
  _key() { return `hunt_result_${new Date().toISOString().split('T')[0]}`; },
  save(data) {
    // data: { easyMs, hardMs, wordsFound: [{word, usedHint}], category, gaveUp }
    try { localStorage.setItem(this._key(), JSON.stringify(data)); } catch(e) {}
  },
  load() {
    try { return JSON.parse(localStorage.getItem(this._key())); } catch(e) { return null; }
  },
  clear() { try { localStorage.removeItem(this._key()); } catch(e) {} }
};
```

### Pattern 13: Results Screen (mirror cipher.html)

**What:** Fixed overlay (`position: fixed; inset: 0`), initially hidden (`display: none`), populated by JS innerHTML. Same structure as cipher.html results.

**Example:**
```javascript
function showResults({ gaveUp }) {
  const screen = document.getElementById('results-screen');
  const shareIcon = `<svg ...>...</svg>`;

  const easyTime = formatTime(gameState.easyElapsed);
  const hardTime = formatTime(gameState.hardElapsed);

  // Build pip summary HTML
  const pipSummary = dailyPuzzle.words.map((w, i) => {
    const found = gameState.wordsFound.find(f => f.word === w.word);
    if (!found) return `<span class="result-pip result-pip--missed"></span>`;
    return found.usedHint
      ? `<span class="result-pip result-pip--hint"></span>`
      : `<span class="result-pip result-pip--clean"></span>`;
  }).join('');

  screen.innerHTML = `
    <div class="results-game-title">Hunt</div>
    <div class="results-title ${gaveUp ? 'results-title--warning' : 'results-title--success'}">
      ${gaveUp ? 'Revealed' : 'Found'}
    </div>
    <p class="results-category">${dailyPuzzle.category}</p>
    <div class="results-pip-row">${pipSummary}</div>
    <div class="results-times">
      <div class="results-time-block">
        <div class="results-time-label">Easy</div>
        <div class="results-time-value">${easyTime}</div>
      </div>
      <div class="results-time-block">
        <div class="results-time-label">Hard</div>
        <div class="results-time-value">${hardTime}</div>
      </div>
    </div>
    <div class="results-words">
      ${dailyPuzzle.words.map(w => `<div class="result-word">${w.word}</div>`).join('')}
    </div>
    <div class="results-actions">
      <button class="btn-primary" id="share-btn" type="button">share ${shareIcon}</button>
    </div>`;

  screen.classList.add('visible');
  if (!gaveUp) spawnConfetti();

  screen.querySelector('#share-btn').addEventListener('click', shareResult);
}
```

### Pattern 14: Word Data Corpus

**What:** A hardcoded array of categories, each with 3 easy and 3 hard words. Seeded selection picks one category per day. All words should be uppercase for grid placement.

**Example structure:**
```javascript
const CATEGORIES = [
  {
    category: 'PLANETS',
    easy: ['MARS', 'EARTH', 'VENUS'],
    hard: ['SATURN', 'URANUS', 'NEPTUNE'],
  },
  {
    category: 'FRUITS',
    easy: ['APPLE', 'GRAPE', 'MANGO'],
    hard: ['PAPAYA', 'LYCHEE', 'GUAVA'],
  },
  // ... 20+ categories for daily rotation
];

function getDailyPuzzle() {
  const rng = seededRandom(DATE_SEED);
  const idx = Math.floor(rng() * CATEGORIES.length);
  const { category, easy, hard } = CATEGORIES[idx];
  const words = [...easy.map(w => ({ word: w, phase: 'easy' })),
                 ...hard.map(w => ({ word: w, phase: 'hard' }))];
  return { category, words, rng };
}
```

**Note on word length vs grid size:** Words must fit within the chosen grid. For 10x10, max word length is 10. For 8x8, max is 8. The corpus should keep all words ≤ 8 letters so it works regardless of which grid size is chosen.

### Pattern 15: Hub Card Activation

**What:** In `index.html`, the Hunt card is currently `<div class="game-card disabled" id="card-hunt">`. This must be changed to `<a href="hunt.html" ...>` when Hunt is deployed.

**Example (from index.html current):**
```html
<!-- BEFORE (placeholder): -->
<div class="game-card disabled" id="card-hunt" aria-disabled="true">

<!-- AFTER (activate): -->
<a href="hunt.html" class="game-card" id="card-hunt">
```

The hub JS already handles `hunt` in its daily status loop:
```javascript
['vowel', 'ladder', 'hunt', 'cipher'].forEach(function(gameId) { ... });
```
So no JS changes needed in index.html beyond the card element change.

### Anti-Patterns to Avoid

- **Using SVG for the trace line:** STATE.md explicitly chose canvas for mobile performance. Do not use `<svg>` overlay.
- **Separate touch/mouse events:** Always use Pointer Events API (`pointerdown`, `pointermove`, `pointerup`, `pointercancel`). Do not add `touchstart`/`touchmove`/`mousedown` separately.
- **Starting hard timer with a delay or button:** Hard timer starts automatically and immediately after category reveal. No interstitial.
- **Using `getBoundingClientRect` on every cell per move event:** Use `document.elementFromPoint` for O(1) hit detection.
- **Canvas for grid cells:** The grid cells are CSS divs. Only the trace line uses canvas.
- **Omitting `touch-action: none` on grid:** Without it, mobile browsers scroll instead of registering drag. Must be set on the grid container.
- **Omitting `setPointerCapture`:** Without it, `pointermove` events are lost when the finger moves off the element boundary before `pointerup`.
- **Words longer than 8 letters in corpus:** Must fit in 8x8 fallback grid.
- **Reverse/backwards words:** The spec explicitly says no reverse words. Word placement must only use the 4 DIRECTIONS constants (all moving forward).

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Seeded PRNG | Custom random | `seededRandom()` from ladder.html verbatim | Already tested; consistency across games |
| Timer formatting | Custom `mm:ss` logic | `formatTime(ms)` helper (see above) | Trivial but easy to off-by-one |
| Clipboard sharing | Custom share | `navigator.clipboard.writeText` + `navigator.share` fallback | cipher.html pattern already handles both |
| Confetti | CSS particle system | `spawnConfetti()` from cipher.html verbatim | Already tested; matches aesthetic |
| DailyStatus | Custom localStorage | `DailyStatus` object from cipher.html verbatim | Hub depends on exact key/format |
| Result persistence | Custom | `HuntResult` object (mirror `LadderResult`) | Pattern is proven; saves revisit state |
| Canvas resize | Manual | `resizeCanvas()` tied to window.resize | Canvas must match grid pixel dimensions |

**Key insight:** 80% of hunt.html is pattern repetition from the existing games. The novel work is grid generation + drag selection. Everything else — DailyStatus, seededRandom, confetti, results screen, share button, help modal, back link — has a direct template to copy.

---

## Common Pitfalls

### Pitfall 1: Touch Scroll Interfering with Drag
**What goes wrong:** On mobile, dragging over the grid triggers page scroll instead of cell selection. The drag never registers.
**Why it happens:** Browser's default touch-action is scroll. Pointer Events fire but the browser also scrolls.
**How to avoid:** Set `touch-action: none` on the grid container element AND call `e.preventDefault()` in `pointerdown`.
**Warning signs:** Works on desktop, fails on mobile; drag always registers as a scroll.

### Pitfall 2: Pointer Events Lost When Finger Leaves Grid Bounds
**What goes wrong:** Player drags fast and finger briefly leaves the grid container — `pointermove` stops firing, selection freezes.
**Why it happens:** Without pointer capture, events are only delivered to the element under the pointer.
**How to avoid:** Call `gridContainer.setPointerCapture(e.pointerId)` in `pointerdown`. This routes all events to the grid even when the pointer is outside it.
**Warning signs:** Drag "sticks" or selection stops mid-word when moving quickly.

### Pitfall 3: Canvas Size vs CSS Size Mismatch
**What goes wrong:** The trace line appears at wrong coordinates — offset or scaled incorrectly.
**Why it happens:** A canvas element has two sizes: CSS display size and canvas pixel buffer size (`canvas.width`/`canvas.height`). If they differ, coordinates are scaled wrong.
**How to avoid:** In `resizeCanvas()`, set `canvas.width = rect.width` and `canvas.height = rect.height` to match the CSS layout size. Also re-run `resizeCanvas()` on window resize.
**Warning signs:** Line appears to the right/below the actual cells; zooming changes line accuracy.

### Pitfall 4: Word Placement Fails on Small Corpus
**What goes wrong:** `placeWords()` returns null for some seeds because 6 words can't be arranged without conflicts.
**Why it happens:** Random placement with 200 attempts can fail with unlucky seeds, especially for longer words.
**How to avoid:** Wrap `generateGrid()` in a retry loop with a seed suffix (try `DATE_SEED + '_0'`, `'_1'`, up to 20 attempts). If all fail, log an error — this signals the corpus needs words trimmed.
**Warning signs:** Infinite loop or null return from `generateGrid()`; blank grid on some dates.

### Pitfall 5: `elementFromPoint` Returns Wrong Element
**What goes wrong:** `document.elementFromPoint` returns the canvas (which is on top of the grid), not the cell underneath.
**Why it happens:** The canvas overlay has no `pointer-events: none` so it intercepts the hit test.
**How to avoid:** Set `pointer-events: none` on the canvas element (CSS). This makes it invisible to `elementFromPoint`. Events still go to the grid.
**Warning signs:** `getCellAt()` always returns null; no cells ever highlight during drag.

### Pitfall 6: Hard Timer Starting Before Category Reveal Animation Completes
**What goes wrong:** Hard timer starts counting while the category stamp animation is still playing. Player loses time to an animation they can't control.
**Why it happens:** Calling `startHardTimer()` immediately without waiting for the CSS animation.
**How to avoid:** Start hard timer after a brief delay matching the animation duration. The stamp animation is ~400ms; use a 50ms grace after that. Or start it at animation completion using `animationend` event.
**Warning signs:** Hard timer starts showing immediately as category name animates in.

### Pitfall 7: Diagonal Cell Selection Gaps
**What goes wrong:** When dragging diagonally, `elementFromPoint` misses cells between positions because the finger moved too fast — cells between two detected positions are skipped.
**Why it happens:** `pointermove` fires at 60fps but a fast diagonal drag can skip cells on budget devices (30fps).
**How to avoid:** After adding each new cell, interpolate: if the new cell is not adjacent to the previous cell (not 1 step away), reject or clear the selection. This prevents accidental long-distance jumps. For diagonal moves, only the 8 adjacent cells of the last selected cell are valid next cells.
**Warning signs:** Words are "found" when they shouldn't be; diagonal selections jump over letters.

### Pitfall 8: Hint System Ambiguity (Which Word Gets Highlighted)
**What goes wrong:** Hint highlights the first letter of a random unfound word, but the highlighted cell might already be visible or could be the first letter of multiple unfound words in different positions.
**Why it happens:** Multiple words can share a starting letter.
**How to avoid:** Always highlight the specific cell in the grid that is the actual start of one specific unfound word. Rotate through unfound words round-robin so each tap reveals a different word's start. Make the highlight temporary (e.g., 1.5s amber pulse on that cell).
**Warning signs:** Hint always highlights the same cell; player can't tell which word the hint refers to.

### Pitfall 9: Give-Up with No Hold Button
**What goes wrong:** No "hold to give up" interaction defined — the CONTEXT.md says "how give-up manifests is Claude's discretion."
**Why it happens:** There's no hold-reveal target like cipher.html's decoding — the grid is always visible.
**How to avoid:** Implement give-up as a dedicated button that reveals all unfound words immediately (highlights them in warning/rose color). The button should still be intentional — use a double-tap or a "give up?" confirmation step, or place it in the help modal. Given the `hintPenalty` is the primary friction point, give-up simply stops both timers and shows results. No hold mechanic needed since there's no animation to trigger.
**Warning signs:** User has no way to exit a stuck game.

---

## Code Examples

### Complete `initGame()` Boot Sequence

```javascript
// Source: pattern from ladder.html DOMContentLoaded + cipher.html initGame()
document.addEventListener('DOMContentLoaded', () => {
  // 1. Check if already completed today
  const saved = !DEBUG && HuntResult.load();
  if (saved) {
    // Restore state and show results
    restoreGameState(saved);
    showResults({ gaveUp: saved.gaveUp });
    return;
  }

  // 2. Choose grid size based on viewport
  const { size: gridSize, cellSize } = chooseGridSize();

  // 3. Generate daily puzzle
  const puzzle = getDailyPuzzle();

  // 4. Place words in grid (with retry)
  let gridResult = null;
  for (let attempt = 0; attempt < 20 && !gridResult; attempt++) {
    const rng = seededRandom(DATE_SEED + '_grid_' + attempt);
    gridResult = placeWords(puzzle.words.map(w => w.word), gridSize, rng);
  }
  if (!gridResult) { console.error('[Hunt] Grid generation failed'); return; }

  // 5. Store puzzle state
  dailyPuzzle = puzzle;
  gridData = gridResult.grid;
  wordPlacements = gridResult.placements;

  // 6. Render grid
  renderGrid(gridSize, cellSize);
  resizeCanvas();

  // 7. Set up drag interaction
  setupDragSelection();

  // 8. Render initial pips and category display
  renderPips();
  renderCategoryDisplay(); // shows "???"

  // 9. Start easy timer
  startEasyTimer();
});
```

### Share Text Format

```javascript
// Source: pattern from ladder.html shareResult()
function shareResult() {
  const today = new Date().toISOString().split('T')[0];
  const easyTime = formatTime(gameState.easyElapsed);
  const hardTime = formatTime(gameState.hardElapsed);

  const pipEmoji = dailyPuzzle.words.map((w, i) => {
    const found = gameState.wordsFound.find(f => f.word === w.word);
    if (!found) return '⬜';
    return found.usedHint ? '🔴' : '🟢';
  }).join('');

  const text = `Lexicon Hunt ${today}\n${dailyPuzzle.category}\n${pipEmoji}\nEasy: ${easyTime}  Hard: ${hardTime}`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById('share-btn');
      const orig = btn.innerHTML;
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.innerHTML = orig; }, 1500);
    }).catch(() => prompt('Copy result:', text));
  } else {
    prompt('Copy result:', text);
  }
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| SVG for interactive overlays | Canvas for performance-critical overlays | PROJECT STATE.md (pre-Phase 18) | Canvas wins on budget mobile; SVG DOM manipulation too slow at 60fps |
| Separate touch/mouse events | Pointer Events API | PROJECT STATE.md | One code path; correct on all devices |
| 10x10 grid only | 10x10 with 8x8 fallback | CONTEXT.md Phase 18 decision | Mobile safety net for small screens |

**Deprecated/outdated:**
- `touchstart`/`touchmove`/`mousedown` split handling: Replaced by Pointer Events in this project.
- `SVG` overlay for the trace line: Explicitly replaced by canvas in STATE.md.

---

## Open Questions

1. **How many categories in the corpus?**
   - What we know: Daily rotation, seeded selection, ~20+ needed for reasonable variety before repeats
   - What's unclear: Exact number; planning must decide the initial corpus size
   - Recommendation: Start with 30 categories; each category has 3 easy + 3 hard words (all ≤ 8 letters). This gives ~1 month before repeats.

2. **Give-up interaction specifics**
   - What we know: No hold button; CONTEXT.md says "Claude's discretion"
   - What's unclear: Single tap vs confirmation vs hold
   - Recommendation: Single "give up" button in footer. On tap, show inline confirmation ("Give up? [Yes] [No]") to prevent accidental taps. On confirm, reveal all words and show results. No hold-bar animation needed since there's no timed-reveal effect like cipher.

3. **Hint penalty amount**
   - What we know: CONTEXT.md says "Claude's discretion"
   - What's unclear: Exact seconds per hint
   - Recommendation: 15 seconds per hint. This is meaningful but not punishing — a player using 2 hints adds 30 seconds to their phase time. Communicates clearly in the UI ("Each hint adds 15 seconds").

4. **Pip layout: 6-in-a-row vs 3+3 split**
   - What we know: CONTEXT.md says "Claude's discretion"
   - What's unclear: Visual preference
   - Recommendation: Split 3+3 with a visual gap. The two groups visually reinforce the two-phase structure. This also makes the red pips easier to attribute to easy vs hard phase.

5. **Word placement determinism if grid generation fails for a date**
   - What we know: Retry loop with seed suffix handles most cases
   - What's unclear: What happens if all 20 attempts fail for a particular date+category combination (e.g., very long words)
   - Recommendation: Log an error and fall back to a guaranteed-to-work hardcoded fallback puzzle (date-independent emergency backup).

---

## Sources

### Primary (HIGH confidence)
- `C:/Users/ananW/jacktest/.planning/STATE.md` — Canvas vs SVG decision, Pointer Events decision, mobile performance concern
- `C:/Users/ananW/jacktest/.planning/phases/18-letter-hunt/18-CONTEXT.md` — All locked decisions
- `C:/Users/ananW/jacktest/cipher.html` — DailyStatus pattern, results screen pattern, give-up pattern, confetti, share
- `C:/Users/ananW/jacktest/ladder.html` — seededRandom, DATE_SEED, LadderResult, hold-to-give-up, DailyStatus
- `C:/Users/ananW/jacktest/vowel.html` — pip system pattern (`.pip`, `.pip.solved`, `.pip.gaveup`, `renderProgress()`)
- `C:/Users/ananW/jacktest/styles/design-tokens.css` — All color/spacing tokens
- `C:/Users/ananW/jacktest/index.html` — Hub card activation pattern, DailyStatus consumption

### Secondary (MEDIUM confidence)
- MDN Pointer Events API — `setPointerCapture`, `pointermove`, `pointercancel` behavior; well-documented standard
- MDN `document.elementFromPoint` — confirmed returns element at CSS coordinates; pointer-events: none exclusion behavior

### Tertiary (LOW confidence)
- Canvas coordinate system with `getBoundingClientRect` offset — standard technique but specific to this layout; validate during implementation
- Diagonal drag interpolation approach — common word-search pattern but specific implementation requires validation

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all tools are browser standards; no external dependencies; project pattern is established
- Architecture: HIGH — directly mirrors cipher.html and ladder.html; 80% is proven pattern
- Grid generation: HIGH — standard word-search algorithm; retry loop is established pattern
- Drag selection: HIGH — Pointer Events + elementFromPoint is locked decision from STATE.md; MDN-verified
- Canvas trace: HIGH — locked decision; standard Canvas 2D API
- Pitfalls: HIGH — sourced from STATE.md decisions, MDN behavior docs, and direct code inspection
- Word corpus: MEDIUM — size/content is open question; structure is clear

**Research date:** 2026-02-27
**Valid until:** 2026-03-27 (stable web APIs; corpus content is evergreen)
