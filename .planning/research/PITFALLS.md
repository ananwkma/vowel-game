# Pitfalls Research: Word Game Collection v2.0

**Domain:** Multi-game vanilla JavaScript word puzzle collection with mobile support
**Researched:** 2026-02-25
**Confidence:** HIGH (official docs verified) / MEDIUM (ecosystem patterns) / LOW (unverified migrations)
**Focus:** Critical mistakes when adding Word Ladder and Letter Hunt to existing VOWEL game

---

## Critical Pitfalls

### Pitfall 1: Breaking VOWEL Game During Hub Migration

**What goes wrong:**
When moving from single `index.html` to a hub (index.html) + game files (vowel.html, ladder.html, hunt.html), the VOWEL game stops working. Score persistence fails, localStorage keys conflict, API calls break due to new file paths, or GitHub Pages routing breaks the navigation.

**Why it happens:**
Single-file architecture makes hidden assumptions about document root and URL paths. `localStorage` keys lack namespace, so new games collide. API endpoints use relative paths (`/api/scores` works from index.html but may fail from subdirectories). GitHub Pages does not support SPA routing, so moving from index.html requires a routing workaround, and the 404.html trick isn't obvious to implement correctly.

**How to avoid:**
1. **Before** splitting files:
   - Namespace all localStorage keys: `vowel_user_id`, `vowel_scores`, `ladder_scores` (not shared)
   - Use absolute API paths: `https://domain.com/api/scores` or root-relative: `/api/scores`
   - Test VOWEL game works from a different path (e.g., create `test/vowel-copy.html`, verify it works)

2. **During** migration:
   - Keep vowel.html 100% identical to current index.html, copy-paste verbatim
   - Create hub index.html with navigation links only, no game logic
   - Test each game file independently before linking them together
   - Verify localStorage namespacing: open two games in separate tabs, confirm scores don't mix

3. **For GitHub Pages**:
   - Use hash-based routing (#/vowel, #/ladder, #/hunt) to avoid 404.html workaround, OR
   - Implement 404.html redirect with localStorage path passthrough (document the approach clearly)
   - Test back button, forward button, direct URL navigation on GitHub Pages before v2.0 ships

**Warning signs:**
- VOWEL game works locally but not on GitHub Pages
- Submitting a score in VOWEL loads `undefined` or wrong leaderboard
- localStorage shows duplicate keys across games
- API calls show 404 errors when game is in a subdirectory
- Back/forward buttons don't navigate between games

**Phase to address:**
Phase 1 (Hub + Migration) — Must prevent this before adding new games. This is the foundation for v2.0.

---

### Pitfall 2: Shared State Leakage Across Games

**What goes wrong:**
A global timer object, event listener registry, or gameState variable is used by VOWEL, then Word Ladder reuses the same variable name or doesn't clean up listeners, causing one game's state to leak into another. Player answers a VOWEL puzzle, then opens Word Ladder and the old VOWEL state is still active (e.g., auto-advance on wrong answer affects Word Ladder).

**Why it happens:**
Vanilla JS with a single event listener system makes it easy to attach global handlers (`document.addEventListener('keydown', ...)`) that don't get removed. If each game file declares `let gameState = {}` at module scope and games are loaded in the same document context (not iframes), mutations to gameState in one game persist into the next game. No framework like React auto-cleans state per route.

**How to avoid:**
1. **Explicit game lifecycle:**
   - Each game has `init()`, `teardown()`, `reset()` functions
   - Hub calls `currentGame.teardown()` before switching to a new game
   - teardown removes ALL event listeners, clears timers, nulls out gameState

2. **Isolate state per game:**
   - Avoid global gameState; use namespaced objects: `vowelGame.state`, `ladderGame.state`
   - Avoid shared event listeners; each game creates its own listener closure
   - Use `const` for immutable game references, reduce mutable globals

3. **Test state isolation:**
   - Open VOWEL, play a puzzle, check localStorage and console for gameState
   - Navigate to Word Ladder, verify VOWEL state is gone
   - Play Word Ladder, navigate back to VOWEL, verify fresh state

**Warning signs:**
- Playing VOWEL, then opening Word Ladder causes unexpected animation or timer behavior
- localStorage shows stale data from previous game
- Keyboard shortcuts (Enter to confirm) work in wrong context
- Scores appear in both games' leaderboards after playing one

**Phase to address:**
Phase 1 (Hub + Migration) — Implement explicit game lifecycle before adding new games.

---

### Pitfall 3: Word Ladder BFS Performance Collapse with 2710-Word Dictionary

**What goes wrong:**
Word Ladder puzzle generation uses BFS to find a path from start word to target word. With a 2710-word dictionary and naive BFS (check every word against every other word for one-letter difference), the first puzzle takes 5–15 seconds to generate, or the browser freezes. On mobile, the lag is unbearable, draining battery.

**Why it happens:**
Naive BFS explores ~26 transformations per word (change each letter position to a–z), then for each transformation checks if it's in the dictionary. With 2710 words, this is O(m × n × 26) where m = word length and n = dictionary size. No caching, no preprocessing — the pathfinding is re-run every day instead of being pre-computed.

**How to avoid:**
1. **Preprocess the dictionary once at startup:**
   - Build a hashmap of "pattern → words": `{ "c*t": ["cat", "cut", "cot"], "c*ts": ["cats", "cuts"] }`
   - Use wildcard * to match any letter at that position
   - When searching neighbors, use pattern to find all adjacent words in O(1) hashmap lookups

2. **Cache or pre-generate daily puzzles:**
   - Pre-generate all possible daily Word Ladder puzzles ahead of time (off-peak)
   - Store them in a small JSON file or embed in JS
   - On client, fetch and serve the puzzle of the day (no BFS at runtime)

3. **Validate path exists before daily generation:**
   - When creating a daily puzzle, test with BFS **once** to confirm a valid path exists
   - If no path exists, regenerate start/target pair, try again

4. **Use bidirectional BFS for runtime fallback:**
   - If dynamic generation is unavoidable, use bidirectional BFS (search from both start and target simultaneously)
   - This reduces the search space significantly compared to unidirectional BFS

**Warning signs:**
- Daily puzzle load time > 2 seconds
- Mobile browser tab becomes unresponsive during puzzle load
- Puzzle generation blocks score submission or hub navigation
- BFS spins indefinitely if start/target are disconnected

**Phase to address:**
Phase 2 (Word Ladder) — Implement preprocessing + caching during feature development. Performance testing required before mobile release.

---

### Pitfall 4: No Valid Path Exists Between Start and Target Words

**What goes wrong:**
The BFS search completes with no path found, but the daily puzzle is already displayed to the user. The puzzle is unsolvable. User gives up immediately, leaving a 0-score game. Or worse, you silently generate a puzzle the user can't solve, breaking trust.

**Why it happens:**
The 2710-word dictionary is not a fully connected graph. Words like "ordo", "orzo", and "ouzo" form their own isolated subgraph. If you randomly pick a start word from one component and a target word from a disconnected component, no path exists. You don't validate this before generation.

**How to avoid:**
1. **Preprocess graph connectivity:**
   - At startup, compute connected components of the word graph (union-find or DFS)
   - Store which words are in which component

2. **Generate only within a component:**
   - When generating daily puzzle, pick start and target from the same connected component
   - This guarantees a valid path exists

3. **Fallback validation:**
   - Run BFS to verify path exists before serving the puzzle
   - If no path, pick a new start/target and retry
   - Only serve puzzle after BFS confirms a solution

4. **Show user feedback if puzzle is impossible:**
   - If you can't find any valid puzzle (all attempts fail), show an error message
   - Don't silently serve an unsolvable puzzle

**Warning signs:**
- Player solves Word Ladder but path doesn't match any edge in word graph (logic error)
- BFS returns empty array, but puzzle is still displayed
- Some users report "impossible" puzzles; others never see those puzzles (randomness exposed)

**Phase to address:**
Phase 2 (Word Ladder) — Implement graph preprocessing and validation during feature development. Required before any user-facing release.

---

### Pitfall 5: Incorrect One-Letter-Difference Validation

**What goes wrong:**
Player enters a guess like "cat" → "bat", which is one letter different. But the validation logic fails to recognize this (counts two differences, rejects it, or crashes), breaking core gameplay. Or validation passes when it shouldn't (e.g., "cat" → "car" shouldn't match if "car" isn't in the dictionary).

**Why it happens:**
Naive letter-difference counting fails on edge cases: comparing words of different lengths (should fail), off-by-one errors in loop indices, or forgetting to check if the new word is in the dictionary. Common bug: iterate over all characters but forget that one word might be shorter.

**How to avoid:**
1. **Unit test the validation function heavily:**
   ```javascript
   // Test cases:
   // isValidNextWord("cat", "bat", dictionary) → true
   // isValidNextWord("cat", "car", {}) → false (not in dictionary)
   // isValidNextWord("cat", "c", {c: 1}) → false (different length)
   // isValidNextWord("cat", "cats", {cats: 1}) → false (2 changes)
   // isValidNextWord("cat", "cat", {cat: 1}) → false (0 changes)
   ```

2. **Two-step validation:**
   - Step 1: Confirm guess is in dictionary (exact match)
   - Step 2: Confirm exactly one letter differs from current word

3. **Explicit character-by-character comparison:**
   ```javascript
   function countDifferences(word1, word2) {
     if (word1.length !== word2.length) return Infinity;
     let differences = 0;
     for (let i = 0; i < word1.length; i++) {
       if (word1[i] !== word2[i]) differences++;
     }
     return differences;
   }
   ```

**Warning signs:**
- Player reports valid moves are rejected
- Player skips valid words in the ladder
- Invalid words are accepted (words not in dictionary)
- Crash when words have different lengths

**Phase to address:**
Phase 2 (Word Ladder) — Implement and test validation logic as part of feature development.

---

### Pitfall 6: Letter Hunt Grid Generation Produces Unsolvable Puzzles

**What goes wrong:**
The word placement algorithm places all words into the grid successfully, but the resulting puzzle is either:
1. Trivial (words are perfectly horizontal with huge gaps, easy to spot), or
2. Impossible (words are hidden so well that no human can find them without playing for an hour)
3. Overlapping words are placed incorrectly, creating false letter matches

The difficulty is unpredictable because the algorithm has no quality metrics.

**Why it happens:**
Word placement uses a greedy or random algorithm (shuffle words, try random positions/directions until all fit). This works mechanically but produces wild variance in difficulty. Overlapping words can be placed such that the overlap check doesn't catch invalid configurations (e.g., overlapping with correct letters in wrong grid cells). No scoring function evaluates puzzle difficulty before serving it.

**How to avoid:**
1. **Implement a quality score for generated grids:**
   - Metric 1: Average distance between letters of the same word (tighter = harder)
   - Metric 2: Fraction of overlapping cells (more overlap = less surface area = harder)
   - Metric 3: Directionality distribution (all horizontal = easier; mix of 8 directions = harder)
   - Reject grids outside acceptable difficulty band

2. **Validate overlapping words correctly:**
   - When placing a word, check that overlapping cells have **exactly** the same letter
   - Build a 2D grid array, check grid[row][col] before placing
   - Never allow letter mismatches in overlaps

3. **Test with human solvers:**
   - Generate daily puzzles offline, have a person solve them
   - Measure average solve time per puzzle
   - Adjust parameters (grid size, word count, directionality) to target 3–5 minute solve time

4. **Use priority-based placement for harder grids:**
   - Place longest words first (larger surface area = easier to spot early)
   - Place shorter words last in tight gaps (harder to find)
   - This naturally produces puzzles of consistent difficulty

**Warning signs:**
- All daily puzzles are solved in under 30 seconds (trivial)
- Users report "I can't find any words" (impossible)
- Found words don't match the actual grid (overlap validation bug)
- Difficulty varies wildly between days

**Phase to address:**
Phase 3 (Letter Hunt) — Implement quality scoring and human playtesting before release.

---

### Pitfall 7: Mobile Touch Lasso Selection UX Breaks on Different Devices

**What goes wrong:**
The lasso selection mechanic (drawing a path around letters to select them) works on desktop but on mobile:
1. The touchscreen doesn't detect the path accurately (jitter, dropped points)
2. Finger obscures the canvas while drawing, user can't see what they're selecting
3. Touch events fire unpredictably (some devices don't support `pointerdown`, others don't support `touch`)
4. SVG path rendering lags, user feels a delay between drawing and visual feedback

**Why it happens:**
Desktop lasso uses mouse events with high precision. Mobile touch has lower precision and the finger is much thicker than a mouse cursor. Touch event handling requires separate code from mouse events (or use Pointer Events, but browser support varies). SVG redrawing on every touch event (to show the path) is expensive on mobile because it repaints the entire SVG tree.

**How to avoid:**
1. **Use Pointer Events, not Touch or Mouse separately:**
   - `pointerdown`, `pointermove`, `pointerup` work for touch, mouse, and pen
   - Single code path replaces fragmented touch/mouse logic
   - Includes pressure sensitivity for future features

2. **Collect points at RAF frequency, not every event:**
   ```javascript
   let pendingPoints = [];
   window.addEventListener('pointermove', (e) => {
     pendingPoints.push({x: e.clientX, y: e.clientY});
   });
   requestAnimationFrame(() => {
     if (pendingPoints.length > 0) {
       updatePath(pendingPoints);
       pendingPoints = [];
     }
   });
   ```

3. **Use Canvas, not SVG, for the lasso path:**
   - Canvas redraws only the lasso line, not the entire grid
   - Renders 60 FPS on mobile without jank
   - SVG is great for static UI, not for real-time drawing

4. **Use `touch-action: none` in CSS:**
   - Prevents browser defaults (scrolling, pinch-zoom) during lasso selection
   - Gives your handler exclusive control over touch events

5. **Simplify path rendering on mobile:**
   - Downsample points (keep every 5th point instead of all points)
   - Draw with thicker stroke width so imprecision is less visible
   - Limit redraw rate to 30 FPS on mobile, 60 on desktop

**Warning signs:**
- Mobile users report "the selection doesn't work"
- Lasso path disappears or becomes disconnected when drawing
- Touch events fire but pointer doesn't move on screen
- Pinch-zoom or scroll interferes with lasso drawing
- Path updates stutter (visible lag between drawing and feedback)

**Phase to address:**
Phase 3 (Letter Hunt) — Implement Pointer Events and Canvas-based lasso during feature development. Mobile testing required before release.

---

### Pitfall 8: SVG/Canvas Path Performance Degrades on Low-End Mobile

**What goes wrong:**
The lasso drawing path (SVG or Canvas) redraws 60 times per second while the user draws, and it works fine on a desktop or iPhone 15. But on an older Android device or budget tablet, the frame rate drops to 10–15 FPS, making the drawing feel sluggish and unresponsive. Battery drains rapidly.

**Why it happens:**
Path redrawing triggers full SVG repaints (expensive on mobile) or Canvas is redrawn with accumulated history (memory and CPU intensive). No throttling, no layer optimization, no GPU hint. Mobile devices have 1–2 GB RAM and CPU is 50% weaker than desktop; frame rate directly reflects GPU saturation.

**How to avoid:**
1. **Use Canvas (not SVG) for dynamic lasso drawing:**
   - Canvas path drawing is faster than SVG DOM manipulation
   - SVG works best for static grid background

2. **Optimize Canvas redrawing:**
   - Clear only the region where the path was (not entire canvas)
   - Use `canvas.clearRect(x, y, width, height)` not `clearRect(0, 0, width, height)`
   - Maintain two canvases: grid (static) + lasso (dynamic)

3. **Throttle redraw rate on mobile:**
   - Detect device (navigator.maxTouchPoints > 0)
   - Use 30 FPS cap on mobile, 60 FPS on desktop
   - `requestAnimationFrame` runs 60 FPS by default; skip every other frame on mobile

4. **Simplify path complexity:**
   - Downsample points: store every 5th touch event instead of all
   - Reduce stroke resolution (fewer bezier curves)
   - This reduces memory footprint and redraw cost

5. **Add GPU hint for transforms:**
   ```css
   canvas {
     will-change: transform;
     transform: translateZ(0);
   }
   ```

**Warning signs:**
- Older phones show frame rate drop during lasso drawing
- Battery usage spikes while playing Letter Hunt
- Canvas / SVG memory usage grows over time (leak?)
- Touch input is delayed or feels sluggish

**Phase to address:**
Phase 3 (Letter Hunt) — Profile performance on low-end devices during development. Required test: 60+ minute gaming session on Moto G4 or equivalent (budget Android).

---

### Pitfall 9: Lasso Selection False Positives (Boundary Detection)

**What goes wrong:**
The player draws a lasso around the letters H, O, M, E forming "HOME". The boundary detection logic incorrectly identifies an adjacent letter (e.g., T from "THEME" that's nearby) as inside the lasso, adding T to the selection. Or the logic misses a letter that's actually inside the path.

**Why it happens:**
Lasso boundary detection (point-in-polygon test) is subtle. Common bugs:
1. Using bounding-box detection instead of actual path containment (fast but inaccurate)
2. Ray-casting algorithm has off-by-one errors at grid boundaries
3. Floating-point precision errors in polygon calculations
4. Grid letter positions are approximated (center of cell) but selection checks corners

**How to avoid:**
1. **Use a robust point-in-polygon library:**
   - Implement or use established library for ray-casting (winding number algorithm)
   - Test extensively with edge cases (point on boundary, point at vertex)

2. **Test with grid positions, not continuous coordinates:**
   ```javascript
   // Instead of checking if (x, y) is inside path,
   // check if all four corners of the grid cell are inside:
   function isCellInLasso(cellRow, cellCol, lassoPath) {
     const corners = [
       {x: cellCol * cellSize, y: cellRow * cellSize},
       {x: (cellCol + 1) * cellSize, y: cellRow * cellSize},
       {x: cellCol * cellSize, y: (cellRow + 1) * cellSize},
       {x: (cellCol + 1) * cellSize, y: (cellRow + 1) * cellSize},
     ];
     return corners.every(corner => isPointInPolygon(corner, lassoPath));
   }
   ```

3. **Use center point only, with clear tolerance:**
   - Check if the letter's center (e.g., grid cell center) is inside the lasso
   - Add visual feedback: highlight grid cells as you draw, show which letters are selected

4. **Unit test boundary cases:**
   ```javascript
   // Test selection with letters right at the boundary
   // Test with tight lasso vs loose lasso
   // Test with adjacent letters in different directions (8-connectivity)
   ```

**Warning signs:**
- Player selects HOME but T gets included accidentally
- Selection misses a letter that's clearly inside the drawn path
- Different behavior when lasso is drawn clockwise vs counter-clockwise
- Boundary letters (at edge of grid) always have issues

**Phase to address:**
Phase 3 (Letter Hunt) — Unit test boundary detection before gameplay release.

---

### Pitfall 10: GitHub Pages Routing Breaks Multi-Game Navigation

**What goes wrong:**
The hub works on localhost (`npm start`), showing all three games. But on GitHub Pages, clicking the Word Ladder link does nothing, or the page doesn't load, or the back button shows the hub again (URL is still index.html).

**Why it happens:**
GitHub Pages is a static file server. It has no backend to rewrite URLs. If you use clean URLs (#/ladder), the hash is ignored by the server (only client sees it). If you use path-based routing (/ladder), GitHub Pages returns 404 because there's no actual `ladder/index.html` file to serve. The 404.html workaround (redirect 404s to index.html) is technically possible but complex and now shows a warning in Brave browser.

**How to avoid:**
1. **Use hash-based routing (#) instead of path-based routing:**
   ```javascript
   // Good for GitHub Pages:
   window.location.hash = '#/vowel';  // URL: domain.com/repo/#/vowel

   // Bad for GitHub Pages:
   window.history.pushState({}, '', '/repo/vowel');  // URL: domain.com/repo/vowel (404)
   ```

2. **Implement simple hash router:**
   ```javascript
   window.addEventListener('hashchange', () => {
     const route = window.location.hash.slice(1) || '/';
     if (route === '/vowel') loadVowelGame();
     else if (route === '/ladder') loadLadderGame();
     else if (route === '/hunt') loadLetterHuntGame();
   });
   ```

3. **Test on GitHub Pages branch before merging:**
   - Push to `gh-pages` branch or enable Pages for `main`
   - Open the actual GitHub Pages URL (not localhost)
   - Test all links, back button, direct URL navigation

4. **If 404.html workaround is required (unlikely):**
   - Only use if hash routing isn't viable
   - Document clearly that this is a GitHub Pages limitation
   - Be aware of Brave browser warning

**Warning signs:**
- Links work locally but not on GitHub Pages
- Clicking "Word Ladder" shows hub again (no change)
- Direct URL to game (github.com/user/repo/ladder) returns 404
- Back button behavior is inconsistent

**Phase to address:**
Phase 1 (Hub + Migration) — Decide routing strategy early. Hash-based routing is simplest and most compatible.

---

### Pitfall 11: Split-Phase Scoring Complexity (Easy vs Hard)

**What goes wrong:**
Letter Hunt has "easy" and "hard" scoring phases (or daily challenge). The implementation swaps out the scoring logic mid-game, but:
1. A word found in easy phase is scored at 1 point, but the code counts it as 5 points in hard phase
2. User's score jumps unexpectedly when switching phases
3. Replay logic can't track which words were found in which phase
4. Personal best comparison fails (comparing easy best against hard best)

**Why it happens:**
Split-phase scoring couples the word found (letter positions) with the scoring context (which phase was active). If you store only the found words without phase metadata, you lose information needed for scoring or replay. Or you store metadata but forget to use it when calculating scores. The UI doesn't clearly communicate "you're in hard phase now" so users don't realize scoring rules changed.

**How to avoid:**
1. **Store phase context with each word found:**
   ```javascript
   const wordsFound = [
     { word: 'HELLO', phase: 'easy', points: 1 },
     { word: 'WORLD', phase: 'hard', points: 5 },
   ];
   ```

2. **Calculate scores deterministically from stored data:**
   - Never use runtime phase to score stored words
   - Recalculate from wordsFound array: `sum(word.points for word in wordsFound)`

3. **Display phase prominently during play:**
   - Show "EASY PHASE" or "HARD PHASE" header at top of screen
   - When phase changes, show a 2-second modal or toast: "Now in HARD PHASE — 5 points per word"

4. **Store phase timestamps for replay:**
   - Track when phase changed: `{phase: 'easy', endedAt: 12000}` (12 seconds)
   - Replay can show the transition visually

5. **Test score calculations heavily:**
   - Generate test cases: 3 words in easy (3 points), 2 words in hard (10 points), total = 13
   - Verify score matches between live play and replay
   - Verify personal best comparison works across phase changes

**Warning signs:**
- Player plays easy phase, finds 5 words, score shows 25 (but should be 5)
- Switching to hard phase causes score to jump randomly
- Replay shows different score than original game
- Personal best for easy game (5 points) is shown as worst hard game (25 points)

**Phase to address:**
Phase 3 (Letter Hunt) — Design phase-scoring architecture before implementation. Test extensively before release.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Store game state in global variables | Fast to code, obvious structure | Hard to isolate games, leaks state, refactoring nightmare | Never — use namespaced objects or explicit lifecycle |
| Inline scoring logic in game update loop | Ship feature quickly | Can't replay or audit scores, hard to debug, phase-switching breaks | MVP only, refactor before multi-phase scoring |
| Precompute daily puzzles in Python, hardcode in JS | Guaranteed valid paths, no runtime perf issues | Can't adjust difficulty, static content, harder to maintain | Acceptable for v2.0 if Python script is documented and reproducible |
| Use SVG for lasso drawing | Easy to implement with existing grid | Slow on mobile, causes jank, drains battery | Never for dynamic drawing; SVG is fine for static grid background |
| Assume touch works like mouse | Fewer lines of code | Breaks on ~50% of mobile devices, poor UX | Never — use Pointer Events from the start |
| No boundary detection unit tests | Save 1–2 hours of work | False positives/negatives in production, user confusion, support burden | Never — boundary detection is too critical |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|-----------------|
| localStorage keys | Reuse same keys across games (vowel_scores) | Namespace keys per game: vowel_score, ladder_score, hunt_score |
| API endpoints | Use relative paths from game HTML files | Use root-relative paths: `/api/scores` or full domain |
| Game state on page load | Assume games start fresh every time | Load saved state from localStorage if it exists, provide "continue" or "new game" option |
| Touch events | Listen to `touchstart`, `touchmove`, `touchend` separately | Use `pointerdown`, `pointermove`, `pointerup` for unified touch/mouse/pen handling |
| Hub navigation | Hardcode game file paths in HTML | Use hash routing (#/vowel, #/ladder, #/hunt) for GitHub Pages compatibility |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| BFS on every puzzle load | First puzzle takes 5–15 seconds, mobile freezes | Preprocess dictionary, cache puzzles, validate path exists before serving | Immediately (v2.0 day 1 on mobile) |
| SVG redraw on every touch | Lasso drawing is jittery, frame rate drops to 10 FPS | Use Canvas for lasso, reduce redraw region, throttle to 30 FPS on mobile | Low-end Android devices (widespread issue) |
| Unbounded state objects | Memory grows over game session, slowness after 20+ puzzles | Clear game state in teardown(), use const for immutable references | After 1–2 hours of play (end-of-session) |
| High-complexity word placement algorithm | Grid generation takes 10+ seconds, blocks daily puzzle load | Use priority placement or off-peak precomputation, set retry limit | With large grids (15x15+) or 20+ words |
| Full canvas redraw every frame | Canvas animation at 10 FPS on budget mobile | Partial canvas redraw, downsample path points, use will-change CSS | Budget Android devices (Moto G series) |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Hardcode daily puzzle in client code | Users can cheat by viewing source, puzzles are discoverable in advance | Fetch daily puzzle from server (even offline first), or use deterministic PRNG with date-based seed (transparent but fair) |
| Store session tokens in localStorage without expiry | Token can be stolen and reused indefinitely if device is compromised | Add expiry time to token, clear localStorage on logout, use httpOnly cookies for sensitive data (if applicable) |
| Submit score without validation | User can hack client, change score, POST fake score to backend | Validate score on backend: check word validity, check letter positions, verify score calculation matches server rules |
| Skip bounds checking on lasso coordinates | User can pass out-of-bounds coords, cause index errors or crashes | Clamp all coordinates to grid bounds before storing, test with synthetic edge cases |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No visual feedback that phase changed | User is confused by scoring rule change mid-game | Show modal or toast when phase changes: "Now in HARD PHASE — 5 points per word" with 2-second delay before gameplay resumes |
| Lasso selection doesn't show which letters are selected | User draws selection but doesn't know if it worked | Highlight grid cells as they're selected, show selected letter count in real-time |
| No "invalid word" error message | User thinks they found a word but it's not in dictionary, feels broken | Show toast: "ZXYZ not in dictionary" in red, let them try again |
| No difficulty indicator for Letter Hunt | User plays puzzle, can't tell if they should find 5 or 15 words | Show word count at start: "11 words hidden" and update as they find them |
| Back button doesn't work on GitHub Pages | User expects back button to go to hub, but nothing happens | Use hash-based routing and implement `hashchange` listener for back button |
| No clear indication of game state (loading, error, ready) | User thinks app is broken when it's actually loading daily puzzle | Show loading spinner, error modal, or "Game Ready" screen clearly |

---

## "Looks Done But Isn't" Checklist

- [ ] **Word Ladder pathfinding:** Often missing graph connectivity validation — verify connected components are computed at startup and puzzles are generated only within valid components
- [ ] **Letter Hunt grid:** Often missing quality scoring and human playtesting — verify puzzle difficulty is measured and within acceptable range before release
- [ ] **Mobile touch selection:** Often missing Pointer Events implementation — verify app works with touch, mouse, and pen using unified Pointer API, not separate Touch/Mouse handlers
- [ ] **Game state isolation:** Often missing explicit teardown() function — verify each game clears all event listeners, timers, and state when switching games
- [ ] **localStorage namespacing:** Often missing per-game prefixes — verify vowel_scores, ladder_scores, and hunt_scores are separate and don't collide
- [ ] **GitHub Pages routing:** Often missing hash-based routing test on actual Pages URL — verify all links work on GitHub Pages (not just localhost), back button works, direct URLs don't 404
- [ ] **Phase-scoring architecture:** Often missing metadata on found words — verify each word stores phase context and replays show correct scoring
- [ ] **Boundary detection:** Often missing unit tests for edge cases — verify lasso selection works correctly at grid edges and with adjacent letters

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| VOWEL game broken after hub migration | MEDIUM | Rollback to single-file version, rebuild hub more carefully, test each game independently before linking |
| Shared state leaking into new game | MEDIUM | Add explicit teardown() calls, review localStorage for orphaned keys, test with DevTools: open two games in tabs, verify no cross-contamination |
| BFS performance collapse | HIGH | Implement preprocessing + caching, test on actual mobile device, profile with DevTools Performance tab |
| Unsolvable daily puzzle generated | MEDIUM | Validate path exists with BFS before serving, implement graph connectivity preprocessing, regenerate puzzle if no path found |
| False positive lasso selection | MEDIUM | Implement proper point-in-polygon test, unit test boundary cases, add visual feedback showing selected cells in real-time |
| SVG/Canvas jank on mobile | MEDIUM | Switch to Canvas for lasso, implement RAF-throttled redrawing, profile frame rate with DevTools, test on budget Android device |
| GitHub Pages routing broken | MEDIUM | Migrate to hash-based routing, test on actual GitHub Pages URL, implement hashchange listener |
| Phase-scoring broken | HIGH | Audit data model: add phase metadata to all stored words, recalculate all scores from stored metadata, rebuild replay from scratch |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Breaking VOWEL game during hub migration | Phase 1 (Hub + Migration) | VOWEL game loads from vowel.html, scores persist, API calls work, GitHub Pages routing tested |
| Shared state leakage across games | Phase 1 (Hub + Migration) | Play VOWEL, switch to Word Ladder, verify VOWEL state is cleared (no event listeners active, no timers running) |
| BFS performance collapse | Phase 2 (Word Ladder) | First puzzle generates in <500ms on desktop, <1s on mobile; no browser freeze |
| Disconnected word graphs | Phase 2 (Word Ladder) | Daily puzzle is generated from same connected component; BFS confirms path exists before serving |
| Incorrect one-letter-difference validation | Phase 2 (Word Ladder) | Unit tests for edge cases (different lengths, non-dictionary words) all pass |
| Letter Hunt grid quality | Phase 3 (Letter Hunt) | Daily puzzles solve in 3–5 minutes on average; no trivial or impossible grids; human playtesting confirms |
| Mobile lasso UX | Phase 3 (Letter Hunt) | Pointer Events used; lasso works on iOS, Android, desktop; 30+ minute playtesting session on low-end Android device (Moto G4 or equivalent) |
| SVG/Canvas performance on mobile | Phase 3 (Letter Hunt) | Canvas used for lasso drawing; frame rate stays above 30 FPS during 30-minute gameplay on budget mobile |
| Boundary detection false positives | Phase 3 (Letter Hunt) | Unit tests for point-in-polygon with edge cases all pass; visual feedback shows selected cells correctly |
| GitHub Pages routing broken | Phase 1 (Hub + Migration) | All links work on actual GitHub Pages URL; back button works; direct URLs don't 404 |
| Phase-scoring complexity | Phase 3 (Letter Hunt) | Each word stores phase context; replayed games show identical scores; personal best comparison works across phases |

---

## Sources

- [Word Ladder pathfinding — Brad FieldCS](https://bradfieldcs.com/algos/graphs/word-ladder/)
- [Bidirectional BFS optimization — GeeksforGeeks](https://www.geeksforgeeks.org/dsa/word-ladder-set-2-bi-directional-bfs/)
- [Word search grid generation algorithms — Baeldung](https://www.baeldung.com/cs/generate-crossword-puzzle)
- [Word search puzzle generation guide — Jamis Buck](https://weblog.jamisbuck.org/2015/9/26/generating-word-search-puzzles.html)
- [SVG performance optimization 2026 — Augustine FoTech](https://www.augustinfotech.com/blogs/svg-vs-canvas-animation-what-modern-frontends-should-use-in-2026/)
- [Lasso selection implementations — Observable / Fil](https://observablehq.com/@fil/lasso-selection)
- [Pointer Events best practices — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events)
- [Touch event pitfalls — Borstch Blog](https://borstch.com/blog/javascript-touch-events-and-mobile-specific-considerations)
- [GitHub Pages SPA routing — GitHub Community Discussions](https://github.com/orgs/community/discussions/64096)
- [Vanilla JS state management 2026 — Medium](https://medium.com/@chirag.dave/state-management-in-vanilla-js-2026-trends-f9baed7599de)
- [Deterministic PRNG for daily puzzles — nullprogram](https://nullprogram.com/blog/2013/03/25/)
- [SVG animation performance — SVG AI Encyclopedia](https://www.svgai.org/blog/research/svg-animation-encyclopedia-complete-guide)
- [Disconnected word graph components — Runestone Academy](https://runestone.academy/ns/books/published/pythonds/Graphs/BuildingtheWordLadderGraph.html)

---

*Pitfalls research for: Word Game Collection v2.0 (Multi-game vanilla JS word puzzles)*
*Researched: 2026-02-25*
*Focus: Adding Word Ladder and Letter Hunt to existing VOWEL game, mobile-first, vanilla JS*
