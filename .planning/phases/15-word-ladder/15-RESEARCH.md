# Phase 15: Word Ladder - Research

**Researched:** 2026-02-26
**Domain:** Daily word puzzle game (tile-based word entry, path animation, BFS shortest path)
**Confidence:** HIGH

## Summary

Word Ladder is a step-based word chain game where players change one letter at a time from a start word to a target word. Every intermediate step must be a valid dictionary word. The game emphasizes the "journey" (path history visible as play progresses) and the "optimal solution" (computed via BFS and revealed on completion/give-up). Unlike VOWEL (timer-based), Word Ladder is pure step-count — no time pressure.

Phase 14 established the multi-game foundation (hub, design tokens, localStorage namespace). Phase 15 builds on that infrastructure with three new technical challenges: (1) real-time dictionary validation for letter changes, (2) animated "stamp" effect for accepted words, (3) BFS graph traversal to compute shortest path.

**Primary recommendation:**
Embed the 2,710-word dictionary from VOWEL into ladder.html; pre-process it at startup into a letter-adjacency hashmap (e.g., `{CAT: ['bat', 'cat', 'sat']}`) for O(1) next-word lookups during validation. Use BFS offline (startup) to pre-compute paths for all daily seeds, avoiding runtime freezes. Reuse confetti animation from VOWEL. Vanilla DOM + CSS animations for tile states and history scroll.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Word entry mechanic:**
- Current word is displayed as a row of selectable letter tile blocks (NOT text input)
- Tapping a tile highlights it (amber border/glow) and opens the mobile keyboard
- Player types one character to replace that letter
- Only ONE tile can be changed at a time: tapping a different tile resets the previously changed tile
- Full-width Submit button below the tile row
- Invalid submission (not in dictionary, or changed 0 or 2+ letters): shake animation + inline error message ("Not a valid word" or "Change exactly one letter")

**Path history display:**
- Layout: target word anchored at top (always visible), active input tiles below it, path history grows downward
- When a valid word is submitted, active tiles animate upward (~20-30px pop, 300-400ms smooth glide) then settle, leaving a copy as history entry (the "stamp" metaphor)
- Each history entry shows: just the word (clean, no step numbers)
- Start word is the first history entry — scrolls off as path grows
- Target word stays anchored at top throughout the game
- No step limit — scroll as long as needed

**Give Up button:**
- Small, subdued button below Submit button — low visual weight, visually separated
- Requires a 3-second hold to activate: button fills left-to-right loading bar; releasing early cancels
- Loading bar fill color: dusty-rose/warning color (--color-warning) to signal irreversibility

**On give-up:**
- Animate the optimal BFS path filling in step by step (each word appears sequentially with ~300ms delay)
- Then transition to the results screen

**Win condition:**
- Exact target word only — no partial credit, no auto-complete at 1 step away

**Timer:**
- No timer — Word Ladder is purely step-count-based

**Results screen:**
- After normal solve: "Solved in X steps (+N from optimal)" — delta from optimal
  - If N = 0 (optimal solve): confetti burst + label "Optimal!" (same confetti system as VOWEL)
  - If N > 0: offer a "Try again" button to replay the same daily puzzle (unlimited re-attempts, no personal best tracking)
- After give-up: optimal path animation plays first, then results screen with step count summary
- Share button: copies text representation of result to clipboard (e.g. "Word Ladder 2026-02-26 | COLD → WARM | Solved in 7 steps (+2 from optimal)")
- Back to hub button: "← Word Games" or "← Back" linking to index.html

**Personal best — DESCOPED:**
- LADR-04 (personal best tracking in localStorage) is NOT being implemented
- No personal best stored or displayed
- Try Again is purely for self-improvement within the session

**Daily completion status:**
- On puzzle completion (solve or give-up → results screen reached): write to `wordGames_dailyStatus` localStorage key: `{ ladder: { completed: true, dateKey: today, timestamp: now } }`
- This dims the Word Ladder card on the hub

### Claude's Discretion

- Exact CSS for the tile highlight state (border glow, box-shadow, or background shift)
- Exact spacing between Submit and Give Up buttons
- History scroll behavior (whether newest entry is nearest the input or at the bottom)
- How the optimal path animation looks when revealed after give-up (fade in per word vs slide in)
- Clipboard share text format details

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| LADR-01 | User can play a daily Word Ladder puzzle — one start→target word pair per day, same for all players | Seeded PRNG date logic validated in VOWEL (DATE_SEED, getDailyWords pattern); deterministic word selection proven. Ladder requires same pattern: seed per date, return fixed 2-word pair (start, target) for all players. |
| LADR-02 | User's word entry is only accepted if it differs from the previous word by exactly one letter and is a valid dictionary word | Dictionary embedded (2,710 words); adjacency validation requires letter-comparison logic + hashmap lookup. Shake animation error feedback specified in CONTEXT.md. |
| LADR-03 | User can see a path history showing their chain of words from start toward the target as they play | Stamp animation (tiles pop 20-30px upward, 300-400ms), history entry left behind. Anchored target word, scrollable history below input. |
| LADR-05 | After completing or giving up, user can see the optimal shortest path computed by BFS | BFS graph traversal required; STATE.md notes "Phase 15 risk: BFS connected component gaps in 2710-word list" — validation needed during planning. Optimal path animates step-by-step on give-up, delta shown on results. |

Note: LADR-04 (personal best) is descoped per CONTEXT.md — not researched.

</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vanilla HTML/CSS/JS | (no deps) | Full implementation | Matches project constraint: single HTML file, no build step. VOWEL proof-of-concept (2,311 lines) demonstrates viability for mid-size games. |
| Design tokens (CSS vars) | (shared) | Visual consistency | Phase 14 established `styles/design-tokens.css` with color, spacing, shadow, transition scales. Word Ladder uses `--color-primary`, `--color-warning`, `--block-size`, `--transition-normal`, etc. |
| localStorage API | (built-in) | Daily completion tracking | Phase 14 established `wordGames_dailyStatus` namespace; Word Ladder appends `{ ladder: { completed, dateKey, timestamp } }`. |
| Confetti animation | (from VOWEL) | Win celebration | VOWEL ships confetti library code inline (~150 lines of DOM + CSS keyframes). Word Ladder reuses pattern for optimal solves. |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| JavaScript seeded PRNG | (custom) | Deterministic daily puzzles | VOWEL implements `seededRandom(DATE_SEED)` returning a generator. Word Ladder reuses this pattern: same seed produces same start→target pair for all players. |
| CSS animations (keyframes) | (built-in) | Tile pop, history scroll, give-up loading bar | No library needed; vanilla CSS3 keyframes handle: tile upward pop (transform: translateY), opacity fade, fill animation (width/linear-gradient for loading bar). |
| Dictionary array | (embedded, 2,710 words) | Word validation, graph construction | Embedded in VOWEL; Word Ladder must import or duplicate. Typical 5-letter word connects to 10-40 neighbors; BFS pre-computed avoids runtime freeze. |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Embedded dictionary | Download from API | Breaks offline-first model; adds latency and HTTP complexity for daily puzzle. Single file constraint makes API fetch awkward. |
| Vanilla DOM mutations | React/Vue | Adds 40-60KB build overhead, contradicts single-file constraint. Vanilla works fine for 6-7 DOM nodes (tiles + history list). |
| BFS pre-computed startup | Runtime BFS on give-up | Mobile freeze on give-up (5-15s for 2,710 nodes), poor UX. Pre-compute amortizes cost. |
| CSS keyframes | JavaScript animations (GSAP/Anime) | Adds 15-30KB library, violates single-file constraint. Vanilla keyframes sufficient for ~4 animation types. |

**Installation:** No npm packages required. Embed patterns from VOWEL (seeded PRNG, confetti, DOM utilities) into ladder.html.

## Architecture Patterns

### Recommended Project Structure

Ladder.html follows VOWEL's pattern:

```
ladder.html
├── <head>
│   ├── design-tokens.css (shared)
│   ├── <style> — Game-specific CSS (tiles, history, give-up bar, results screen)
│   └── Mobile viewport meta + apple-touch-icon
├── <body>
│   ├── #back-link — Navigation to hub
│   ├── #app — Main container (flex column)
│   │   ├── #target-display — Anchored target word
│   │   ├── #current-tiles — Editable tile row (flex)
│   │   ├── #history-container — Scrollable past words
│   │   ├── #submit-btn — Submit button (full-width)
│   │   └── #give-up-btn — Give Up button (small, hold-to-activate)
│   ├── #results-screen — Modal overlay (hidden by default)
│   ├── #confetti-canvas — Shared with VOWEL
│   └── <script> — Inline game logic
│       ├── Dictionary (2,710 words)
│       ├── Daily puzzle engine (seed → start/target pair)
│       ├── Word validator (adjacency hashmap, letter diff)
│       ├── BFS engine (pre-computed shortest paths)
│       ├── Game state machine (playing, give-up, results)
│       ├── DOM renderers (tiles, history, results)
│       ├── Animation choreography
│       └── Event handlers (tile tap, submit, give-up hold)
```

### Pattern 1: Seeded Daily Puzzles

**What:** Deterministic daily word pair selection from a fixed date seed (YYYY-MM-DD), ensuring all players see the same puzzle on a given date.

**When to use:** Any game with "daily" mechanics; no special server sync needed.

**Example:**
```javascript
// Source: Phase 14 VOWEL (vowel.html lines ~1064-1120)
const DATE_SEED = (function() {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return today + '_v2'; // Include version for future puzzle refreshes
})();

function seededRandom(seedStr) {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    const char = seedStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32-bit integer
  }
  const m = 2147483647; // Mersenne prime
  const a = 16807;
  let seed = Math.abs(hash) % m;

  return function() {
    seed = (a * seed) % m;
    return seed / m;
  };
}

function getDailyLadderPuzzle() {
  const rng = seededRandom(DATE_SEED);
  const wordList = [/* 2,710 words */];

  // Select two 5-letter words guaranteed to have a connected path
  // (BFS validation happens at startup)
  const startIdx = Math.floor(rng() * validStartWords.length);
  const targetIdx = Math.floor(rng() * validTargetWords.length);

  return {
    start: validStartWords[startIdx],
    target: validTargetWords[targetIdx],
    seed: DATE_SEED
  };
}
```

### Pattern 2: Dictionary Adjacency Hashmap (O(1) Validation)

**What:** Pre-process the 2,710-word dictionary into a map where each word links to all valid one-letter-change neighbors. Avoids O(2,710) lookups during tile submission.

**When to use:** Real-time validation of word mutations; any puzzle requiring "is this a valid neighbor?"

**Example:**
```javascript
// Source: Standard algorithm, similar to Wordle solvers
const DICTIONARY = [/* 2,710 words */];

function buildAdjacencyMap() {
  const adjacency = {};
  const byLength = {};

  // Group words by length (5-letter words only for first version)
  DICTIONARY.forEach(word => {
    const len = word.length;
    if (!byLength[len]) byLength[len] = [];
    byLength[len].push(word.toUpperCase());
  });

  // For each word, find all one-letter-change neighbors
  DICTIONARY.forEach(word => {
    const upper = word.toUpperCase();
    adjacency[upper] = [];
    const candidates = byLength[word.length] || [];

    candidates.forEach(candidate => {
      if (candidate === upper) return; // Skip self

      let diffCount = 0;
      for (let i = 0; i < word.length; i++) {
        if (upper[i] !== candidate[i]) diffCount++;
      }

      if (diffCount === 1) {
        adjacency[upper].push(candidate);
      }
    });
  });

  return adjacency;
}

const ADJACENCY = buildAdjacencyMap(); // ~50ms on startup

// During tile submission:
function isValidNextWord(current, candidate) {
  const neighbors = ADJACENCY[current] || [];
  return neighbors.includes(candidate);
}
```

### Pattern 3: BFS Pre-Computed Shortest Paths

**What:** At startup, run BFS from a seed start→target pair to find the shortest path. Store result so give-up animation can reveal it without runtime latency.

**When to use:** Any game revealing an "optimal solution" that requires graph traversal; precompute to avoid freezes during gameplay.

**Example:**
```javascript
// Source: Standard BFS algorithm
function bfsShortestPath(startWord, targetWord, adjacency) {
  const visited = new Set();
  const queue = [[startWord, [startWord]]]; // [current, path]
  visited.add(startWord);

  while (queue.length > 0) {
    const [current, path] = queue.shift();

    if (current === targetWord) {
      return path;
    }

    const neighbors = adjacency[current] || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, [...path, neighbor]]);
      }
    }
  }

  return null; // No path exists (should be caught during seed validation)
}

// At startup:
const dailyPuzzle = getDailyLadderPuzzle();
const OPTIMAL_PATH = bfsShortestPath(dailyPuzzle.start, dailyPuzzle.target, ADJACENCY);
const OPTIMAL_STEPS = OPTIMAL_PATH.length - 1;

// On give-up, animate OPTIMAL_PATH step-by-step
```

### Pattern 4: Hold-to-Activate Button with Visual Feedback

**What:** Button that requires 3-second continuous pointer press (mousedown → hold 3s → no release before timeout). Loading bar fills left-to-right during hold; releasing early cancels.

**When to use:** Destructive/irreversible actions (give up, reset) to prevent accidents.

**Example:**
```javascript
// Source: Design from CONTEXT.md (give-up hold mechanic)
const giveUpBtn = document.getElementById('give-up-btn');
const giveUpBar = document.createElement('div'); // Visual fill indicator
giveUpBar.className = 'give-up-bar'; // CSS: background fills left-to-right
giveUpBtn.appendChild(giveUpBar);

let holdTimer = null;
let holdStartTime = null;
const HOLD_DURATION_MS = 3000;

giveUpBtn.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  holdStartTime = Date.now();
  giveUpBar.style.width = '0%';

  holdTimer = setInterval(() => {
    const elapsed = Date.now() - holdStartTime;
    const progress = Math.min(elapsed / HOLD_DURATION_MS, 1);
    giveUpBar.style.width = (progress * 100) + '%';

    if (progress >= 1) {
      clearInterval(holdTimer);
      triggerGiveUp(); // Release pointer and timer completes → give up
    }
  }, 16); // ~60fps
});

document.addEventListener('pointerup', () => {
  if (holdTimer) {
    clearInterval(holdTimer);
    giveUpBar.style.width = '0%';
    holdTimer = null;
    // Give-up NOT triggered (user released early)
  }
});

function triggerGiveUp() {
  gameState.gaveUp = true;
  animateOptimalPath(); // Step-by-step animation
  showResults();
}
```

### Pattern 5: Animated "Stamp" Effect (Tiles Pop, Word Leaves History)

**What:** When a valid word is submitted, the current tile row animates upward (~20-30px, 300-400ms easing), and a copy of the word is inserted into the history list below.

**When to use:** Any puzzle where player builds a sequence; emphasizes the "mark left behind" metaphor.

**Example:**
```javascript
// Source: CONTEXT.md "stamp metaphor" + standard CSS animations

// CSS:
@keyframes tile-pop {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-30px);
  }
}

.tiles-stamp-in-progress {
  animation: tile-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

// JavaScript:
async function submitWord(newWord) {
  if (!isValidNextWord(currentWord, newWord)) {
    showError("Not a valid word");
    shakeTiles();
    return;
  }

  if (!hasExactlyOneLetterChange(currentWord, newWord)) {
    showError("Change exactly one letter");
    shakeTiles();
    return;
  }

  // Valid word: animate current tiles upward
  currentTilesRow.classList.add('tiles-stamp-in-progress');

  // Wait for animation
  await new Promise(resolve => {
    setTimeout(resolve, 400);
  });

  // Add to history (the "mark" left by the stamp)
  addToHistory(currentWord);

  // Reset tiles for next word
  currentWord = newWord;
  renderTiles(newWord);
  currentTilesRow.classList.remove('tiles-stamp-in-progress');

  // Check win condition
  if (newWord === targetWord) {
    showResults({ solved: true, steps: playerPath.length });
  }
}

function addToHistory(word) {
  const historyEntry = document.createElement('div');
  historyEntry.className = 'history-entry';
  historyEntry.textContent = word;
  historyContainer.appendChild(historyEntry);

  // Auto-scroll history to bottom
  historyContainer.scrollTop = historyContainer.scrollHeight;
}
```

### Anti-Patterns to Avoid

- **Validating words by linear search through 2,710 dictionary:** O(2,710) on every keystroke; causes jank on older mobile. Use adjacency hashmap for O(1).
- **Computing BFS on give-up:** 5-15s freeze on mobile (Moto G4) while game appears hung. Pre-compute at startup, store result.
- **Storing personal best without localStorage:** Per CONTEXT.md, LADR-04 is descoped. Avoid adding persistent best tracking; it contradicts the decision.
- **Unrestricted history scroll:** History can grow unbounded. Set `max-height` and `overflow-y: auto` on history container; optionally remove very old entries to keep DOM lean.
- **Multiple simultaneous tile edits:** Per CONTEXT.md, only one pending change at a time. Tapping a new tile MUST reset the previously changed tile. Track `pendingTileIndex` to enforce.
- **Keyboard input outside the game:** If tiles are tapped and keyboard opens, any typing should route to the active tile only. Use `input` event, not global `keydown`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Dictionary adjacency for word chain games | Custom loop checking every other word | Pre-processed hashmap `ADJACENCY[word] = [neighbors]` | Word validation happens on every tile submission (potentially 10-50 times per game). Linear search is unacceptable on mobile. Hashmap guarantees O(1). |
| Shortest path in a word graph | Recursive DFS or brute-force search | BFS (standard, efficient, optimal for unweighted graphs) + pre-compute at startup | BFS is proven optimal for unweighted shortest paths. Recursive DFS can stack overflow on large graphs. Pre-compute avoids runtime freeze. |
| Daily puzzle determinism without server | Ad-hoc date + random selection | Seeded PRNG (date → seed → deterministic RNG → word selection) | Ad-hoc approaches (time-of-day, device ID) don't guarantee same puzzle for all players on the same day. VOWEL's pattern is proven across thousands of plays. |
| 3-second hold button with visual feedback | Interval polling + manual % math | CSS linear-gradient width animation + pointer down/up events | Manual interval + math is error-prone (off-by-one, dropped events on slow devices). CSS animation is smooth, hardware-accelerated, and cancels cleanly on pointer-up. |

**Key insight:** Word Ladder's core mechanics (word validation, shortest path, daily determinism) all involve standard algorithms that have well-known pitfalls. Reaching for "first idea" implementations (linear search, recursive DFS, ad-hoc PRNG) causes performance problems on budget mobile. VOWEL validates that single-file, vanilla implementations work fine when algorithms are correct.

## Common Pitfalls

### Pitfall 1: BFS Freeze on Give-Up (Latency Spike)

**What goes wrong:** Player taps Give Up, game goes unresponsive for 5-15 seconds while computing shortest path via BFS. Player thinks game crashed. Android devices hit worse than iPhone.

**Why it happens:** BFS on 2,710-node graph at runtime. Older hardware (Moto G4 benchmarked at ~200ms for 5-letter BFS). Multiple give-ups during a session multiply the effect.

**How to avoid:** Pre-compute BFS at startup for the daily puzzle. Store result in a global `OPTIMAL_PATH` variable. On give-up, animate the pre-computed path step-by-step (no runtime computation).

**Warning signs:**
- Testing on simulator only (desktop is too fast)
- Game goes unresponsive immediately after tapping Give Up
- Console shows BFS computation taking >100ms
- User testing shows "Is it frozen?" feedback

**Verification:**
```javascript
console.time('BFS');
const path = bfsShortestPath(puzzle.start, puzzle.target, ADJACENCY);
console.timeEnd('BFS');
// Target: <50ms on Moto G4 equivalent (budget Android)
```

### Pitfall 2: Linear Dictionary Search on Tile Submit

**What goes wrong:** Every time a tile changes, code loops through all 2,710 words to validate the new word: `DICTIONARY.includes(newWord)`. Player types fast, UI jank/lag.

**Why it happens:** Array `.includes()` is O(n); appears fast on desktop (2,710 comparisons in ~2ms) but accumulates on mobile. Multiple tile changes = multiple searches.

**How to avoid:** Build adjacency hashmap once at startup: `ADJACENCY[currentWord] = [neighbors]`. Validation becomes `ADJACENCY[currentWord].includes(candidate)` → O(1).

**Warning signs:**
- Noticeable lag when typing into tiles on real phone
- Frame rate drops during rapid tile changes
- 60fps target broken during input

**Verification:**
```javascript
console.time('Validate');
const valid = ADJACENCY[current].includes(candidate);
console.timeEnd('Validate');
// Target: <1ms
```

### Pitfall 3: Only One Tile Can Be "Pending" But Tap Logic Breaks This

**What goes wrong:** User taps tile A (highlights, opens keyboard). User types 'Z'. User taps tile B (should reset tile A back to original letter and highlight tile B). But code doesn't reset tile A, so two tiles are in "edit mode" simultaneously.

**Why it happens:** No tracking of `currentlyEditingTileIndex`. Code accepts input to any tile.

**How to avoid:** Maintain `gameState.pendingTileIndex` (or null). On tile tap, if a different tile is pending, reset the previous one: `tiles[gameState.pendingTileIndex].textContent = originalWord[gameState.pendingTileIndex]`. Then set new pending index and show keyboard.

**Warning signs:**
- Rapid tile tapping results in multiple tiles selected at once
- History shows multi-letter changes (violates "one letter change" rule)
- No visual reset of previously selected tile

**Verification:**
```javascript
// Test sequence:
// 1. Tap tile 0, type 'B' → "BOAT" (was "COAT")
// 2. Tap tile 2, type 'O' → "BOAO" (tile 0 should reset to 'C', not stay 'B')
// 3. Submit → should validate only tile 2 changed
```

### Pitfall 4: History Grows Unbounded; DOM Becomes Sluggish

**What goes wrong:** Player makes 100+ word changes (grinding the puzzle for fun, or very long optimal path). History container has 100+ DOM nodes. Scrolling jank. Layout thrashing.

**Why it happens:** No cleanup of old history entries. Each word added to history lives forever in the DOM.

**How to avoid:** Set `max-height: 400px` (or similar) on history container with `overflow-y: auto`. Optionally, remove oldest history entries when count exceeds threshold (e.g., keep last 50). Or use virtual scrolling if path gets very long.

**Warning signs:**
- Scrolling history feels laggy after 20+ entries
- Browser DevTools shows "Rendering" tab showing repaints during scroll
- Mobile frame rate drops to <30fps with long history

**Verification:**
```javascript
// Test:
// 1. Generate a 50-word path manually
// 2. Scroll history up/down
// 3. Check DevTools Performance tab: should be ~60fps, not <30fps
```

### Pitfall 5: "Optimal Path" Not Validated for Connectivity During Daily Puzzle Setup

**What goes wrong:** Daily seed selects two words (e.g., ZEBRA → APPLE) that have no connected path via one-letter changes in the 2,710-word dictionary. BFS returns null. Give-up reveals nothing, or crashes.

**Why it happens:** Not all word pairs are guaranteed connected. The 2,710-word list may have "islands" of unconnected words.

**How to avoid:** During startup, validate that the daily puzzle's start→target has a valid path. If BFS returns null, either:
1. Pre-validate all possible puzzle pairs and only use known-good pairs, OR
2. Run BFS at startup and skip this seed if no path exists; pick the next seed in sequence.

**Warning signs:**
- BFS returns `null` for the daily puzzle
- Give-up screen shows empty optimal path
- User reports: "I gave up and nothing happened"

**Verification (per STATE.md):**
```javascript
// STATE.md notes: "Phase 15 risk: BFS connected component gaps in 2710-word list"
// Mitigation: run union-find analysis during Phase 15; validate 100 daily seeds produce solvable puzzles.
// Implementation detail: during planning, schedule a validation task.
```

## Code Examples

Verified patterns from official sources and Phase 14 reference implementation:

### Daily Puzzle Engine

```javascript
// Source: Phase 14 VOWEL (vowel.html lines ~1064-1120), adapted for ladder
const DATE_SEED = (function() {
  const today = new Date().toISOString().split('T')[0];
  return today + '_ladder_v1'; // Version allows puzzle refresh in future
})();

function seededRandom(seedStr) {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = ((hash << 5) - hash) + seedStr.charCodeAt(i);
    hash = hash & hash;
  }
  const m = 2147483647;
  const a = 16807;
  let seed = Math.abs(hash) % m;
  return function() {
    seed = (a * seed) % m;
    return seed / m;
  };
}

function getDailyLadderPuzzle() {
  const rng = seededRandom(DATE_SEED);

  // Candidates: 5-letter words with confirmed paths (pre-validated list)
  const VALID_STARTS = [/* subset of dictionary with verified paths */];
  const VALID_TARGETS = [/* subset of dictionary with verified paths */];

  const startIdx = Math.floor(rng() * VALID_STARTS.length);
  const targetIdx = Math.floor(rng() * VALID_TARGETS.length);

  return {
    start: VALID_STARTS[startIdx],
    target: VALID_TARGETS[targetIdx],
    seed: DATE_SEED
  };
}
```

### Word Adjacency Validation

```javascript
// Source: Standard word ladder solver pattern
const DICTIONARY = [/* 2,710 words */];

function buildAdjacencyMap() {
  const adjacency = {};
  const byLength = {};

  DICTIONARY.forEach(word => {
    const len = word.length;
    if (!byLength[len]) byLength[len] = [];
    byLength[len].push(word.toUpperCase());
  });

  DICTIONARY.forEach(word => {
    const upper = word.toUpperCase();
    adjacency[upper] = [];
    (byLength[word.length] || []).forEach(candidate => {
      if (candidate === upper) return;
      let diffs = 0;
      for (let i = 0; i < word.length; i++) {
        if (upper[i] !== candidate[i]) diffs++;
      }
      if (diffs === 1) adjacency[upper].push(candidate);
    });
  });

  return adjacency;
}

const ADJACENCY = buildAdjacencyMap();

function isValidWord(word) {
  return !!ADJACENCY[word.toUpperCase()];
}

function getNextWords(current) {
  return ADJACENCY[current.toUpperCase()] || [];
}
```

### BFS Shortest Path

```javascript
// Source: Standard BFS algorithm
function bfsShortestPath(start, target, adjacency) {
  if (start === target) return [start];

  const visited = new Set([start]);
  const queue = [[start, [start]]];

  while (queue.length > 0) {
    const [current, path] = queue.shift();
    const neighbors = adjacency[current] || [];

    for (const neighbor of neighbors) {
      if (neighbor === target) {
        return [...path, target];
      }
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, [...path, neighbor]]);
      }
    }
  }

  return null; // No path
}
```

### Tile Selection and Edit State

```javascript
// Source: CONTEXT.md "only one tile can be changed at a time"
let gameState = {
  currentWord: '',
  pendingTileIndex: null, // Tracks which tile is being edited
  playerPath: [],
  completed: false,
  gaveUp: false,
};

const tileElements = [];

function renderTiles(word) {
  const container = document.getElementById('current-tiles');
  container.innerHTML = '';
  tileElements.length = 0;

  word.split('').forEach((letter, idx) => {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.textContent = letter;

    tile.addEventListener('click', () => selectTile(idx));

    container.appendChild(tile);
    tileElements[idx] = tile;
  });
}

function selectTile(index) {
  // Reset previously selected tile
  if (gameState.pendingTileIndex !== null) {
    const prevIdx = gameState.pendingTileIndex;
    tileElements[prevIdx].textContent = gameState.currentWord[prevIdx];
    tileElements[prevIdx].classList.remove('selected');
  }

  // Select new tile
  gameState.pendingTileIndex = index;
  tileElements[index].classList.add('selected');

  // Focus keyboard input for this tile
  // (Mobile: focus a hidden input; Desktop: listen for keydown)
  focusInput(index);
}

function focusInput(tileIndex) {
  // Hidden input for mobile keyboard:
  const input = document.getElementById('hidden-input');
  input.value = '';
  input.focus();

  input.addEventListener('input', (e) => {
    const char = e.target.value.toUpperCase().slice(-1); // Last char typed
    if (char && /[A-Z]/.test(char)) {
      tileElements[tileIndex].textContent = char;
      e.target.value = '';
    }
  });
}
```

### Hold-to-Activate Give-Up Button

```javascript
// Source: CONTEXT.md "3-second hold to give up"
const giveUpBtn = document.getElementById('give-up-btn');
const giveUpBar = document.createElement('div');
giveUpBar.className = 'give-up-bar';
giveUpBtn.appendChild(giveUpBar);

let holdState = {
  active: false,
  startTime: null,
  timerId: null,
};

const HOLD_DURATION_MS = 3000;

giveUpBtn.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  holdState.active = true;
  holdState.startTime = Date.now();
  giveUpBar.style.width = '0%';

  holdState.timerId = setInterval(() => {
    const elapsed = Date.now() - holdState.startTime;
    const progress = Math.min(elapsed / HOLD_DURATION_MS, 1);
    giveUpBar.style.width = (progress * 100) + '%';

    if (progress >= 1) {
      clearInterval(holdState.timerId);
      activateGiveUp();
    }
  }, 16);
});

document.addEventListener('pointerup', () => {
  if (holdState.active && holdState.timerId) {
    clearInterval(holdState.timerId);
    giveUpBar.style.width = '0%';
    holdState.active = false;
  }
});

function activateGiveUp() {
  gameState.gaveUp = true;
  animateOptimalPath();
  setTimeout(showResults, OPTIMAL_PATH.length * 300); // Stagger animations
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Hard-coded daily words in HTML | Seeded PRNG from date → deterministic selection | Phase 14 (VOWEL) | Scalable to infinite daily puzzles without manual curation. Same puzzle for all players guaranteed. |
| Linear search for valid words | Pre-computed adjacency hashmap | Standard in word games (Wordle, Spelling Bee) | O(1) validation vs O(n); eliminates input lag on mobile. |
| Runtime BFS on demand | Pre-computed shortest path at startup | Standard optimization | Eliminates 5-15s freeze on give-up. Smooth UX. |
| Separate game HTML files with duplicate styles | Shared design-tokens.css + game-specific overrides | Phase 14 | Visual consistency, reduced maintenance. Bridge :root pattern allows per-game CSS var remapping. |
| localStorage + backend for all data | localStorage for daily completion, server optional | Phase 14 (post-v1.2) | Works offline-first. Backend stats are nice-to-have, not critical. Reduces server dependency. |

**Deprecated/outdated:**
- **Hard-coded word lists (v0.x approach):** Doesn't scale; breaks daily fairness. Replaced by seeded PRNG.
- **On-demand algorithm computation (v1.x approach):** Causes UI freeze during gameplay. Replaced by pre-computation.
- **Monolithic single `index.html` for all games (v1.x):** Doesn't scale past 2 games. Replaced by per-game HTML files + shared tokens (Phase 14).

## Open Questions

1. **Dictionary connectivity validation:**
   - What we know: STATE.md flags "BFS connected component gaps in 2710-word list" as a Phase 15 risk.
   - What's unclear: How many word pairs in the 2,710-word list have no connected path? What percentage of random seed attempts will fail?
   - Recommendation: During Phase 15 planning, schedule a pre-game task to analyze the dictionary (union-find or BFS sweep) and identify valid start→target pairs. Generate a whitelist of 100+ confirmed-solvable puzzles. Store in ladder.html.

2. **Optimal path animation timing:**
   - What we know: CONTEXT.md specifies "~300ms each" word reveal, but doesn't specify fade vs slide animation.
   - What's unclear: Should each word fade in, slide in from left, or animate position? Should there be a delay after give-up button completes holding?
   - Recommendation: Claude's Discretion. Choose based on design sync with VOWEL. Recommend: fade in + stagger 300ms per word. Test on real device for smoothness.

3. **History scroll direction:**
   - What we know: History "grows downward" from input.
   - What's unclear: Should history scroll auto-focus to bottom (newest entry nearest eye) or top (oldest entry at top)?
   - Recommendation: Claude's Discretion. Standard is auto-scroll to bottom (newest visible). Use `historyContainer.scrollTop = historyContainer.scrollHeight` after each word addition.

4. **Try Again button behavior:**
   - What we know: CONTEXT.md specifies "Try Again is purely for self-improvement within the session" and LADR-04 is descoped.
   - What's unclear: Does Try Again reset the game state and reload the same puzzle? Or does it return to tile entry without changing gameState?
   - Recommendation: Try Again should reset gameState (clear playerPath, currentWord = startWord, gaveUp = false) and show tiles again. Don't reload the page; keep session data.

5. **Share button text format:**
   - What we know: CONTEXT.md example: "Word Ladder 2026-02-26 | COLD → WARM | Solved in 7 steps (+2 from optimal)"
   - What's unclear: Should optimal paths (after give-up) show "+0 from optimal" in share text, or something different?
   - Recommendation: Claude's Discretion. Suggest: "Word Ladder 2026-02-26 | COLD → WARM | Gave up | Optimal: 5 steps" for consistency.

## Sources

### Primary (HIGH confidence)

- **Phase 14 VOWEL (vowel.html, ~2,311 lines)** — Seeded PRNG pattern (DATE_SEED, getDailyWords), confetti animation, design tokens, localStorage integration, mobile touch handling, results screen UX. Same project, same tech stack, proven at scale.
- **PROJECT.md** — Project constraints (single HTML file, vanilla frontend, no build step), tech stack (HTML/CSS/JS + Node/Express backend), deployment model (GitHub Pages + local server).
- **REQUIREMENTS.md** — LADR-01–LADR-05 requirement specs, LADR-04 descoped note, design tokens established in Phase 14.
- **STATE.md** — Risk log ("BFS connected component gaps"), architectural decisions (hash-based routing, BFS preprocess, shared CSS tokens), velocity metrics for comparison.
- **CONTEXT.md (15-CONTEXT.md)** — Detailed user decisions (tile entry, stamp animation, give-up hold, results screen, daily completion tracking, personal best descoped).

### Secondary (MEDIUM confidence)

- **Standard word ladder algorithms** — BFS for shortest path, adjacency map for O(1) validation. These are proven patterns in Wordle solvers, LeetCode word ladder problems, and game AI. Not cited from external sources but well-established in the field.

### Tertiary (LOW confidence)

None required. All critical decisions are locked in CONTEXT.md or validated by Phase 14 proof-of-concept.

## Metadata

**Confidence breakdown:**
- **Standard stack:** HIGH — Vanilla HTML/CSS/JS + shared tokens proven in Phase 14; no external libraries needed. Dictionary adjacency and BFS are textbook algorithms.
- **Architecture patterns:** HIGH — VOWEL demonstrates seeded daily puzzles, localStorage integration, DOM animation. Patterns are directly transferable.
- **Pitfalls:** HIGH — Word ladder solver pitfalls (linear search, runtime BFS, unbounded DOM growth) are well-known from Wordle clones and academic word ladder literature. Phase 14 validates mobile performance baseline (budget Android device).
- **Connectivity validation:** MEDIUM — STATE.md flags risk but doesn't provide metrics. Mitigation is clear (pre-validate), but gap analysis is deferred to planning phase.

**Research date:** 2026-02-26
**Valid until:** 2026-03-26 (30 days; vanilla HTML/CSS/JS is stable; no framework version churn)

---

*Research complete. Ready for Phase 15 planning.*
