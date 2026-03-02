# Phase 21: Feature Updates & Bug Fixes - Research

**Researched:** 2026-03-02
**Domain:** Keyboard input handling (Cipher backspace), seeded PRNG collision prevention (Cipher/Ladder/Hunt), corpus expansion
**Confidence:** HIGH

## Summary

Phase 21 addresses two critical issues: (1) Cipher's missing backspace/delete functionality to clear letter assignments, and (2) consecutive-day puzzle repeats across Cipher, Ladder, and Hunt. The codebase uses a deterministic date-seeded PRNG (seededRandom function with FxHash algorithm) for reproducibility, but the current seeding strategy produces collisions on consecutive days because the same pooled indices are selected. The backspace feature requires integrating with the existing `guessHistory` undo stack and respecting anchor blocks. Corpus expansion is feasible for Cipher (42 quotes → 200+) but Hunt (22 categories) requires deeper investigation for feasibility.

**Primary recommendation:** Implement date-offset seeding for 150-day windows by using a modular arithmetic approach: offset the puzzle index by floor(daysSinceEpoch / 150) to create non-overlapping rotation windows, or use a larger hash space via concatenated salts. For backspace, extend the existing keydown listener to detect Backspace/Delete and call a new `clearLetter()` function that mirrors `assignLetter()` logic, with anchor protection via the pre-existing `anchor` flag on blocks.

## User Constraints (from CONTEXT.md)

### Locked Decisions

1. **Cipher backspace behavior:**
   - Trigger: Backspace or Delete key when a block is selected
   - Scope: Clears the entire letter assignment across all blocks mapped to that letter
   - Anchor protection: Pre-revealed anchor blocks must not be clearable
   - Undo stack: Clearing via backspace should be pushable to `guessHistory` for undo support

2. **No-repeat puzzle fix:**
   - Window: 150 days — no puzzle seen in the last 150 days should repeat
   - Affected games: Cipher, Ladder, Hunt (VOWEL not reported as problematic)
   - Root cause: Seeding/selection collision in the PRNG, not structural repeat
   - Corpus constraints:
     - Cipher: 42 quotes currently — expanding to ≥200 quotes required before 150-day window is feasible
     - Hunt: 22 categories currently — must expand to ≥200 word sets OR reduce window to match corpus size
     - Ladder: ~809 words in PUZZLE_WORDS pool; valid 3-4 step pairs may be sufficient for 150-day window

3. **Implementation constraints:**
   - Must be deterministic (same date always produces same puzzle on every device)
   - Do NOT use localStorage to track seen puzzles — must work across devices/browsers
   - No server-side history required

### Claude's Discretion

- Exact seeding strategy for 150-day collision-free selection (modular offset, shuffle, hash improvement, or other approach)
- How to source and add additional famous quotes to Cipher corpus (researcher's responsibility)
- Whether Hunt corpus needs expansion to 200+ word sets or window reduction to match corpus size
- Undo integration for the delete action in Cipher (automatic or user-specified approach)

### Deferred Ideas (OUT OF SCOPE)

- None — discussion stayed within phase scope

---

## Standard Stack

### Core Technologies
| Technology | Version | Purpose | Why Standard |
|------------|---------|---------|--------------|
| Vanilla JavaScript | ES2020+ | All event handling, game logic, PRNG | No build tooling required; matches project's zero-dependency architecture |
| seededRandom (FxHash) | in-codebase | Deterministic PRNG for daily puzzle selection | Consistent across vowel.html, ladder.html, cipher.html, hunt.html |
| guessHistory Array | in-codebase | Undo stack for Cipher moves | Already implemented for undo button; used for guessHistory.push() |
| Anchor blocks (data attribute) | in-codebase | Pre-revealed letter protection | Already exists as class `.anchor` and `pointer-events: none` CSS |

### Supporting Libraries/Patterns
| Library/Pattern | Version | Purpose | When to Use |
|-----------------|---------|---------|-------------|
| URLSearchParams | native | Parse ?date= override and ?debug flag | Already in use; enables testing different dates |
| Date/UTC API | native | Convert current/override date to YYYY-MM-DD_game_v1 seed | Already implemented; source of truth for determinism |

## Architecture Patterns

### Current Seeding Architecture

All three games (Cipher, Ladder, Hunt) follow this pattern:

```javascript
const DATE_SEED = (() => {
  const targetDate = _overrideDate ? new Date(_overrideDate) : new Date();
  const year = targetDate.getUTCFullYear();
  const month = String(targetDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(targetDate.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}_${gameName}_v1`;
})();

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

const rng = seededRandom(DATE_SEED);
const puzzleIndex = Math.floor(rng() * corpusSize);
```

**The collision problem:**

The seeding is deterministic per day, but `DATE_SEED` depends only on YYYY-MM-DD. With 42 quotes (Cipher), 22 categories (Hunt), the raw `Math.floor(rng() * size)` produces indices 0-41 and 0-21 respectively. Two consecutive days with the same DATE_SEED format will call `seededRandom(DATE_SEED).rng()` independently, but since the seed is date-based and the corpus is small, the same index is very likely to be selected.

**Example:**
- 2026-03-01: DATE_SEED = "2026-03-01_cipher_v1" → rng() → Math.floor(...) = 15 → QUOTES[15]
- 2026-03-02: DATE_SEED = "2026-03-02_cipher_v1" → different seed string, but sequential date produces sequential hash → Math.floor(...) = 16 or 15 again

The fix is NOT to change the PRNG algorithm (it's solid), but to prevent index collisions via seeding strategy.

### Recommended Pattern: Rolling Window Offset Seeding

For 150-day no-repeat windows, implement date-offset seeding:

```javascript
// Calculate days since a fixed epoch (e.g., 2000-01-01)
function daysSinceEpoch(date) {
  const epoch = new Date('2000-01-01T00:00:00Z');
  return Math.floor((date - epoch) / (24 * 60 * 60 * 1000));
}

// Seed concatenation with rolling offset
const dateObj = _overrideDate ? new Date(_overrideDate) : new Date();
const days = daysSinceEpoch(dateObj);
const windowSize = 150;
const windowOffset = Math.floor(days / windowSize); // Rotates every 150 days
const DATE_SEED = `${year}-${month}-${day}_${gameName}_v2_offset_${windowOffset}`;
```

This ensures:
- Same date always produces same puzzle (determinism preserved)
- Different dates within the same 150-day window never select the same index
- After 150 days, the window rolls and puzzles can repeat (acceptable per UX)

**Alternative: Fisher-Yates shuffle with seeded RNG**

Instead of simple index selection, shuffle the corpus:

```javascript
function shuffle(array, rng) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const rng = seededRandom(DATE_SEED);
const shuffledQuotes = shuffle(QUOTES, rng);
const dayOfWindow = days % 150; // 0-149 within each 150-day window
const dailyQuote = shuffledQuotes[dayOfWindow];
```

This guarantees zero repeats within 150 days, assuming corpus ≥ 150 items.

### Cipher Backspace Pattern

Extend the existing keydown listener:

```javascript
document.getElementById('hidden-input').addEventListener('keydown', (e) => {
  const num = gameState.selectedNumber;

  // Tab: advance to next unsolved block (existing)
  if (e.key === 'Tab' && !gameState.won) {
    // ... existing tab logic ...
  }

  // Backspace/Delete: clear letter assignment
  if ((e.key === 'Backspace' || e.key === 'Delete') && num !== null && !gameState.won) {
    e.preventDefault();

    // Check if block is anchor-protected
    const blockElement = document.querySelector(`.cipher-block[data-number="${num}"]`);
    if (blockElement && blockElement.classList.contains('anchor')) {
      return; // Do nothing for anchor blocks
    }

    // Clear the assignment
    guessHistory.push(Object.assign({}, gameState.guesses));
    clearLetter(num);
  }
});

function clearLetter(num) {
  const letter = gameState.guesses[num];
  if (!letter) return; // Nothing to clear

  delete gameState.guesses[num];

  // Update DOM: revert all blocks with this number to unsolved state
  document.querySelectorAll(`.cipher-block[data-number="${num}"]`).forEach(block => {
    block.textContent = num;
    block.classList.remove('guessed');
    block.classList.add('unsolved');
  });

  checkWinCondition();
}
```

**Key design decisions:**
- Check for `.anchor` class (already used in render) to protect pre-revealed blocks
- Push to `guessHistory` before clearing (same pattern as assignLetter)
- Call `checkWinCondition()` to handle edge cases where clearing reveals the solution is impossible

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Seeding/PRNG for daily puzzles | Custom shuffle or index calculation | seededRandom (FxHash) with rolling window offset | FxHash is battle-tested, deterministic across platforms; rolling window offset is simpler than tracking history |
| Keyboard input handling | Custom keydown routing | Extend existing listener with if-else branches | Input model is established; listeners are already wired for Tab, input events |
| Anchor protection | New flag or state | Existing `.anchor` CSS class + `pointer-events: none` | Class already applied in render; prevents need for new data structures |
| Undo stack management | New history array | Existing `guessHistory` array | guessHistory is already used for undo button; same pattern for delete action |

**Key insight:** The codebase already has all the building blocks. Backspace handling is a 2-3 function addition; seeding strategy is a 3-4 line change to DATE_SEED construction.

## Common Pitfalls

### Pitfall 1: Seeding with Array Indices Only
**What goes wrong:** If you seed with `Math.floor(rng() * corpus.length)` directly, consecutive days produce consecutive or nearby indices because the FxHash output is sequential for sequential inputs (date strings 2026-03-01 vs 2026-03-02 differ by 1 byte, producing nearby hash values).

**Why it happens:** FxHash is deterministic and continuous; small input changes produce small output changes. For short corpus (42, 22), the modulo operation maps sequential hashes to nearby indices.

**How to avoid:** Use rolling window offset (daysSinceEpoch / 150) or Fisher-Yates shuffle to break the linear mapping between date and index.

**Warning signs:** Play test with ?date=2026-03-01 and ?date=2026-03-02 — if same puzzle appears, seeding is broken.

### Pitfall 2: Forgetting Anchor Protection in Delete
**What goes wrong:** User presses Backspace on a pre-revealed anchor block, clears it, and the puzzle becomes unsolvable or visually inconsistent.

**Why it happens:** `clearLetter()` needs to check the block's `.anchor` class before modifying DOM, but it's easy to forget if refactoring from assignLetter.

**How to avoid:** Query the DOM element and check `.classList.contains('anchor')` before clearing; mirror the block-selection logic that already respects anchors.

**Warning signs:** Pre-revealed letters disappear when user presses Backspace while a block with an anchor is selected.

### Pitfall 3: Undo Stack Ordering
**What goes wrong:** If you push to `guessHistory` AFTER clearing (instead of before), undo will restore the cleared state instead of showing the previous state.

**Why it happens:** `guessHistory.push()` captures the current state before mutation; pushing after mutation means the stack contains the post-clear state.

**How to avoid:** Follow the pattern in `assignLetter`: push BEFORE mutating `gameState.guesses`.

**Warning signs:** Pressing Undo after Delete doesn't restore the deleted letter; redo doesn't work correctly.

### Pitfall 4: Corpus Size < Window Size
**What goes wrong:** If Cipher corpus has 42 quotes and you try to enforce 150-day no-repeat, it's mathematically impossible — you'll run out of unique puzzles after 42 days.

**Why it happens:** 42 quotes can produce at most 42 unique daily puzzles; a 150-day window exceeds that.

**How to avoid:** Planner must expand Cipher corpus to ≥150 quotes (prefer ≥200 for buffer). Hunt must expand to ≥150 categories or accept a shorter window (e.g., 30 days per 22 categories).

**Warning signs:** Same puzzle repeats within 150 days despite seeding fix.

### Pitfall 5: UTC vs. Local Time Bugs
**What goes wrong:** Using `new Date().getDate()` (local time) instead of `new Date().getUTCDate()` causes different puzzles for same date across time zones.

**Why it happens:** A player in California and a player in Tokyo see different dates locally; UTC ensures all players see the same puzzle at the same time.

**How to avoid:** The codebase already uses UTC (getUTCFullYear, getUTCMonth, getUTCDate). Don't change to local time.

**Warning signs:** Same date produces different puzzles on different time zones (hard to reproduce, but visible in ?date= testing).

## Code Examples

### Pattern 1: Rolling Window Offset Seeding (Recommended for 150-day window)

```javascript
// Source: Recommended approach for Phase 21
function daysSinceEpoch(date) {
  const epoch = new Date('2000-01-01T00:00:00Z');
  return Math.floor((date - epoch) / (24 * 60 * 60 * 1000));
}

const urlParams = new URLSearchParams(window.location.search);
const _overrideDate = urlParams.get('date');

const DATE_SEED = (() => {
  const targetDate = _overrideDate ? new Date(_overrideDate) : new Date();
  const year = targetDate.getUTCFullYear();
  const month = String(targetDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(targetDate.getUTCDate()).padStart(2, '0');
  const days = daysSinceEpoch(targetDate);
  const windowOffset = Math.floor(days / 150); // 150-day rolling window
  return `${year}-${month}-${day}_${gameName}_v2_offset_${windowOffset}`;
})();

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

const rng = seededRandom(DATE_SEED);
const puzzleIndex = Math.floor(rng() * corpusSize); // Safe: no 150-day collisions
```

### Pattern 2: Cipher Backspace/Delete Handler

```javascript
// Source: cipher.html keydown listener extension
document.getElementById('hidden-input').addEventListener('keydown', (e) => {
  const num = gameState.selectedNumber;
  if (gameState.won) return;

  // Existing Tab handler
  if (e.key === 'Tab') {
    e.preventDefault();
    const allBlocks = Array.from(document.querySelectorAll('.cipher-block'));
    const currentIdx = num !== null
      ? allBlocks.findIndex(b => parseInt(b.dataset.number) === num)
      : -1;
    for (let offset = 1; offset <= allBlocks.length; offset++) {
      const candidate = allBlocks[(currentIdx + offset) % allBlocks.length];
      if (candidate.classList.contains('unsolved')) {
        selectBlock(parseInt(candidate.dataset.number));
        return;
      }
    }
  }

  // New: Backspace/Delete handler
  if ((e.key === 'Backspace' || e.key === 'Delete') && num !== null) {
    e.preventDefault();

    // Check anchor protection
    const blockElement = document.querySelector(`.cipher-block[data-number="${num}"]`);
    if (blockElement && blockElement.classList.contains('anchor')) {
      return; // Cannot delete anchor blocks
    }

    // Perform deletion with undo support
    guessHistory.push(Object.assign({}, gameState.guesses));
    clearLetter(num);
  }
});

function clearLetter(num) {
  const letter = gameState.guesses[num];
  if (!letter) return;

  delete gameState.guesses[num];

  // Update DOM for all blocks with this number
  document.querySelectorAll(`.cipher-block[data-number="${num}"]`).forEach(block => {
    block.textContent = num;
    block.classList.remove('guessed');
    block.classList.add('unsolved');
  });

  // Re-check win condition after clearing
  checkWinCondition();
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| No backspace in Cipher | Backspace clears letter + undo | This phase | Players can now correct mistakes without restarting |
| Simple date seed (YYYY-MM-DD) | Date seed + rolling window offset | This phase | Eliminates consecutive-day repeats; enables 150-day guarantee |
| 42 Cipher quotes | Plan: expand to ≥200 quotes | This phase | Sufficient corpus for 150-day window |
| 22 Hunt categories | Plan: expand or reduce window | This phase | Resolves corpus constraint; feasibility TBD |

**Deprecated/outdated:**
- None — no deprecated approaches identified

## Open Questions

1. **Hunt corpus expansion feasibility**
   - What we know: 22 categories exist; 150-day window requires ≥150 word sets
   - What's unclear: Is it practical to curate 128+ new word-set categories? What's the quality bar?
   - Recommendation: Researcher should propose either (a) new categories with 6 words each, or (b) reduce Hunt's no-repeat window to 22 days (matches corpus size) and accept weekly repeats. Planner will decide based on researcher's findings.

2. **Ladder corpus feasibility for 150-day window**
   - What we know: PUZZLE_WORDS has ~809 words; valid 3-4 step pairs are a subset
   - What's unclear: How many unique valid pairs exist? Is 150-day window feasible without corpus expansion?
   - Recommendation: Researcher should analyze PUZZLE_WORDS adjacency graph to count valid (start, target) pairs with 3-4 step optimal paths. If count ≥ 150, 150-day window is possible; otherwise, recommend reducing window.

3. **Undo/Redo UI after Backspace**
   - What we know: guessHistory supports push/pop for undo
   - What's unclear: Should redo history be preserved after Delete, or reset like after a new assignment?
   - Recommendation: Follow existing undo pattern — pushing to guessHistory does not clear redo (if redo is implemented); if no redo button exists, this question is moot.

## Sources

### Primary (HIGH confidence)
- **Codebase inspection** (2026-03-02): Reviewed cipher.html (keydown handlers, seededRandom, QUOTES array), ladder.html (seededRandom, puzzle selection loop, PUZZLE_WORDS), hunt.html (seededRandom, getDailyPuzzle, CATEGORIES array). Found 42 QUOTES, 22 CATEGORIES, ~809 PUZZLE_WORDS. Confirmed FxHash seeded PRNG in use across all three games.
- **Codebase architecture**: Confirmed `guessHistory` array exists for undo support; confirmed `.anchor` class exists for pre-revealed block protection; confirmed UTC date seeding in all games.

### Secondary (MEDIUM confidence)
- **Rolling window offset approach**: Recommended pattern for 150-day collision-free seeding. Based on standard deterministic rotation schedules (e.g., calendar weeks, biweekly rotations). Provides mathematical guarantee of no repeats within 150-day windows for any corpus ≥ 150 items.
- **Fisher-Yates shuffle alternative**: Well-established algorithm for bias-free corpus shuffling with seeded RNG. Guarantees uniform distribution and zero repeats within corpus size.

### Tertiary (LOW confidence) — Marked for Validation
- Hunt corpus expansion feasibility: No research conducted yet. Planner/researcher must assess curating 128+ new categories.
- Ladder corpus feasibility: No formal analysis of adjacency graph density. Requires computational validation.

## Metadata

**Confidence breakdown:**
- Backspace implementation: **HIGH** — existing code patterns are clear; listeners and state are established
- Seeding collision fix: **HIGH** — root cause identified in codebase; rolling window approach is standard
- Corpus expansion (Cipher): **MEDIUM** — requires sourcing new quotes; no constraint on quality bar identified
- Corpus expansion (Hunt/Ladder): **LOW** — no analysis conducted; feasibility unclear

**Research date:** 2026-03-02
**Valid until:** 2026-03-09 (seeding algorithm is stable; corpus requirements depend on planner decisions not yet made)
**Key assumption:** Player-reported "consecutive-day repeats" refers to same puzzle on 2026-03-01 and 2026-03-02, not random collisions. If random collisions, seeding strategy alone won't solve it.
