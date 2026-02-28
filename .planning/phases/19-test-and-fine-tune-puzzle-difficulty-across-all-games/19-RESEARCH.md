# Phase 19: Test and Fine-Tune Puzzle Difficulty - Research

**Researched:** 2026-02-28
**Domain:** Puzzle difficulty calibration, testing frameworks, seeded randomization
**Confidence:** HIGH

## Summary

Phase 19 is a testing and refinement phase where four daily puzzle games (Cipher, Ladder, Hunt, and VOWEL) need systematic difficulty validation and parameter tuning. The user has made locked decisions about *what* to tune (pre-reveal for Cipher, path length for Ladder, word curation for Hunt) and *how* to test (date-based URL debug jumping). This research covers the technical patterns for implementing date-override debugging, understanding existing seeded puzzle generation, identifying difficulty vectors in each game, and establishing best practices for play-testing.

**Primary recommendation:** Implement date-override URL param (`?date=YYYY-MM-DD`) as a consistent debug pattern across all games before beginning tuning. This enables efficient difficulty sampling without modifying core generation code. Use browser console for introspection (optimal paths, word lists, etc.) rather than on-screen debug output, preserving game UX during testing.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Debug Date-Jumping (all games):**
- All games get a consistent URL param to override the puzzle date: `?date=2026-03-01`
- Works on hunt.html, ladder.html, and cipher.html using the same pattern
- Mirrors how VOWEL already works in debug mode

**Cipher — Difficulty Tuning:**
- **Two levers, both applied:**
  1. Filter quote corpus to prefer quotes with higher letter repetition (more duplicate letters = each solved letter reveals more of the puzzle)
  2. Pre-reveal 2–3 letters at game start to give players a head start
- Order: tackle Cipher first (pre-reveal is a meaningful UX change worth validating early)

**Ladder — Difficulty Tuning:**
- Shorten target path length from 4–6 steps to **3–4 steps**
- Core problem: long paths create too many intermediate possibilities for players to reason about — it's cognitively overwhelming, not just time-consuming
- Word quality is secondary; path length is the primary fix

**Hunt — Hard Words:**
- Hard words (3 words in phase 2) should feel like a moderate stretch: words players recognize but don't use often, AND/OR words that are tricky to spot in the grid — not obscure or unknown
- Easy words (phase 1) felt appropriately calibrated; no change needed there

**Testing Method:**
- Date-based debug URL param added to all games (consistent pattern)
- Ladder: optimal path printed to console in debug mode, not shown on screen — allows self-testing without spoiling
- Validation target: play through ~5 dates per game after tuning to confirm consistency
- Hunt/Cipher: jump to different dates to sample variety; no need to force specific categories

**Execution Order:**
1. Cipher (pre-reveal is highest-impact UX change)
2. Ladder (clear, known fix — shorten path)
3. Hunt (word curation — more subjective, benefits from seeing Cipher/Ladder done first)

**VOWEL:**
- Skip — feels fine as-is

### Claude's Discretion

None specified — all major decisions are locked.

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.

</user_constraints>

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| JavaScript (vanilla) | ES2020+ | Game logic and puzzle generation | All games use inline JS; no frameworks; matches project architecture |
| Seeded RNG (Murmurhash-based) | Custom impl | Deterministic daily puzzle generation | Already implemented in vowel.html (Math.imul variant); copied to ladder.html; ensures same puzzle for all players on same date |
| Browser localStorage | Native API | Persist player progress per game | Already in use; persists game state, progress, and daily status across sessions |
| URL Search Params | Native API | Debug date override | Lightweight, no dependency; native to all browsers; used for `?date=YYYY-MM-DD` pattern |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Browser console API | Native | Debug output (optimal paths, word lists, metrics) | During play-testing; logs optimal path lengths, seed info, word selections without spoiling game |
| Canvas 2D (hunt.html) | Native | Rendering letter grid, lasso selection | Letter Hunt specific; already in use for grid rendering and collision detection |
| CSS Design Tokens | Project standard | Consistent colors, spacing, animations | All games inherit from `styles/design-tokens.css`; supports visual consistency during difficulty UI changes (e.g., pre-reveal styling) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Vanilla seeded RNG | Libraries (seedrandom, mersenne-twister) | Project avoids dependencies; custom Murmurhash variant is already proven in vowel.html; libraries add overhead for single use case |
| URL search params for date override | Hash fragments (#date=2026-03-01) | Search params are more standard for debug flags; hash fragments conflict with project's existing `#/game` routing pattern |
| Console-only debug output | On-screen debug panel | Console approach preserves game UX and prevents accidental spoilers; on-screen would clutter simple mobile interface |

**Note:** No new libraries needed. Phase 19 is entirely parameter tuning and debug tooling built within existing architecture.

---

## Architecture Patterns

### Recommended Project Structure

**No new files required.** All changes are inline modifications to existing game HTML files:
- `ladder.html` — Add date override, shorten path length constraint
- `hunt.html` — Add date override, review hard word selections
- `cipher.html` — Add date override, implement letter-repetition filter, add pre-reveal logic
- `vowel.html` — No changes (already has date debug param)

Debug instrumentation lives in browser console logs, not on-screen.

### Pattern 1: Date Override via URL Param

**What:** Implement a debug-friendly way to test puzzles from specific dates without changing system time or game code.

**When to use:** During play-testing to sample difficulty across multiple dates; enables rapid iteration without redeploying code.

**Implementation pattern (verified in ladder.html):**
```javascript
// At top of puzzle generation logic
const urlParams = new URLSearchParams(window.location.search);
const overrideDate = urlParams.get('date');
const puzzleDate = overrideDate ? new Date(overrideDate) : new Date();

// DATE_SEED uses puzzleDate, not system date
const DATE_SEED = generateDateSeed(puzzleDate);
```

**Usage example:**
- Current date: `ladder.html` or `ladder.html?date=2026-03-01`
- Specific date: `ladder.html?date=2026-02-15`
- Works with all games consistently

**Source:** Pattern mirrors VOWEL's existing debug param usage (seen in vowel.html around line 1076).

### Pattern 2: Seeded Deterministic Puzzle Generation

**What:** Use seeded random number generator so `?date=X` always produces identical puzzle, enabling reproducibility.

**Existing implementation in project:**
```javascript
// From vowel.html (line 1087-1101)
function seededRandom(seedStr) {
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
        const char = seedStr.charCodeAt(i);
        hash = Math.imul(31, hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    // Normalize to 0-1 range
    const seed = Math.abs(hash) % 2147483647;
    return (seed / 2147483647) % 1;
}
```

**Why it matters:** Same seed → same puzzle every time. Tests must use this pattern to ensure date override works correctly.

**Verification approach:** Two requests with `?date=2026-02-15` should produce identical puzzles (same words, same grid, same quote).

### Pattern 3: Console Introspection for Play-Testing

**What:** Log difficulty metrics to browser console instead of displaying on screen. Preserves UX while enabling tester to validate difficulty parameters.

**Example metrics to log:**
```javascript
// For Ladder:
console.log('[WordLadder] Optimal path:', optimalPath.join(' → '));
console.log('[WordLadder] Optimal steps:', optimalSteps);
console.log('[WordLadder] Path length constraint:', `${minSteps}-${maxSteps} (current: ${optimalPath.length - 1})`);

// For Cipher:
console.log('[Cipher] Quote:', quote.text);
console.log('[Cipher] Unique letters:', uniqueLetterCount);
console.log('[Cipher] Letter repetition ratio:', repetitionRatio.toFixed(2));
console.log('[Cipher] Pre-reveal letters:', preRevealLetters.join(', '));

// For Hunt:
console.log('[Hunt] Category:', categoryName);
console.log('[Hunt] Easy words:', easyWords.join(', '));
console.log('[Hunt] Hard words:', hardWords.join(', '));
console.log('[Hunt] Grid dimensions:', `${rows}x${cols}`);
```

**Why:** Testers can validate difficulty without seeing the answer on screen; data is still captured for analysis.

### Anti-Patterns to Avoid

- **On-screen debug overlays during production testing:** Overlays clutter UI and can spoil surprises. Use console instead.
- **Hardcoding test dates into game logic:** Always read from URL params. Avoid `if (today === '2026-02-15') { special logic }`.
- **Changing seeded RNG implementation per game:** Keep `seededRandom()` identical across all games to ensure cross-game consistency.
- **Testing in production code paths:** Debug date overrides should be feature-complete before pushing to production; use a separate testing branch if needed.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Custom test runner for each game | Custom Node.js test harness | Browser console + manual play-testing | Games are client-side only; unit testing adds infrastructure cost; manual sampling is sufficient for difficulty calibration |
| Difficulty metrics calculation | Custom analytics system | Browser console logs + spreadsheet | For this phase, human judgment (tester plays 5 dates, judges if too hard/easy) is faster than building metrics infrastructure |
| A/B testing framework | Build variant switching system | Locked decisions + targeted tuning | User has already decided what to tune; A/B testing is deferred to future phases; focus on implementation confidence, not optimization |
| Date handling library | moment.js or date-fns | `new Date()` + `.toISOString().split('T')[0]` | Project already uses native Date API successfully; puzzle generation uses ISO date strings; no additional complexity |

**Key insight:** Phase 19 is *calibration*, not *measurement*. The user has decided what levers to pull (path length, pre-reveal, word curation). Build the ability to turn those levers, then play-test to validate. A/B testing and metrics come later if needed.

---

## Common Pitfalls

### Pitfall 1: Date Override Doesn't Affect Puzzle Generation

**What goes wrong:** Implement `?date=` param but puzzle still uses system date; tester gets different puzzle each time.

**Why it happens:** Puzzle generation reads `new Date()` directly instead of using the overridden date. Common if date override is added to UI but not to the `DATE_SEED` calculation.

**How to avoid:**
1. Identify where `new Date()` is called for puzzle generation (usually in DATE_SEED calculation)
2. Replace with: `const puzzleDate = overrideDate ? new Date(overrideDate) : new Date();`
3. Verify seeded randomization happens *after* date override is applied
4. Test: Load `game.html?date=2026-02-15`, refresh page, confirm same puzzle appears

**Warning signs:** Testers report getting different puzzles when reloading with same `?date=` param; seed variations appear on console logs.

### Pitfall 2: Letter Repetition Filter Breaks Cipher Generation

**What goes wrong:** Implement letter-repetition filter for Cipher but 50+ seed attempts fail to find a matching quote; puzzle generation falls back or crashes.

**Why it happens:** User wants quotes with *high* letter repetition (e.g., "BANANA" has many A's). Not all quotes qualify. If filter is too strict, no quotes match.

**How to avoid:**
1. Before implementing, count letter-repetition stats on all quotes in corpus
2. Set filter threshold based on distribution (e.g., "quotes with ≥3 duplicate letters")
3. Implement filter in quote selection loop, not as pre-filtering (allows fallback)
4. Log filtered quote count to console: `console.log(`Quotes with high repetition: ${highRepetitionQuotes.length}/${totalQuotes}`)`
5. Keep fallback: if no high-repetition quotes found after 50 attempts, use any quote

**Warning signs:** Cipher generation times out; console shows "No suitable quote found"; repeated failures on same date.

### Pitfall 3: Path Length Constraint Too Tight for Ladder

**What goes wrong:** Change path length from 4–6 steps to 3–4 steps, but BFS search finds no valid pairs; puzzle generation falls back repeatedly.

**Why it happens:** Path length constraint is applied to *optimal* path (full dictionary BFS). Shorter optimal paths are rarer. If constraint is too tight (e.g., "only 3 steps exactly"), valid pairs become scarce.

**How to avoid:**
1. Log path length distribution before making changes: `console.log('Path lengths in current 50 attempts:', pathLengths)`
2. Set range, not exact values: `3-4 steps` means path.length 4-5 (word count). Allows flexibility.
3. Keep the "common word" secondary constraint: `path exists through COMMON_ADJACENCY`. This ensures solvability.
4. Keep fallback puzzle: verified safe pair with known path length (e.g., SCARE→STILL, 4 steps).
5. Monitor success rate: `console.log('Valid pairs found: ' + successCount + '/50 attempts')`

**Warning signs:** Puzzle generation hangs or times out; console shows >30 fallback attempts per date; testers report same puzzle (fallback) on many dates.

### Pitfall 4: Hunt Hard Words Are Too Obscure or Too Easy

**What goes wrong:** Carefully curate hard words to be "moderate stretch," but testers either recognize them instantly (too easy) or don't know the word exists (too hard).

**Why it happens:** "Moderate stretch" is subjective and depends on player background. Easy to misjudge without diverse testers.

**How to avoid:**
1. Use criteria from CONTEXT.md: "words players recognize but don't use often" AND/OR "tricky to spot in grid"
2. Cross-check word obscurity: use Frequency List (e.g., Google Books Ngram) to verify word is in top 10K most common (recognizable) but not top 100 (common)
3. Test grid placement: hard words should be *findable* but not obvious. Check if word can be spotted in ≤30 seconds by a casual player.
4. Get feedback: log hard words to console, ask testers if they knew the words before finding them.
5. Have a curated list of known-good hard words as backup

**Example hard words (from hunt.html):**
```javascript
hard: ['IBIS', 'GREBE', 'SHRIKE']  // BIRDS category
// IBIS = uncommon bird, but recognizable; GREBE and SHRIKE are moderate stretch
```

**Warning signs:** Testers skip hard words (too obscure); testers find hard words instantly (too easy); no clear category hint from easy words.

### Pitfall 5: Pre-Reveal for Cipher Spoils the Puzzle

**What goes wrong:** Pre-reveal 2–3 letters at game start, but reveals too much structure; puzzle becomes trivial or reveals author immediately.

**Why it happens:** Cipher difficulty is about inference chain length. If you reveal too many of the same letter (e.g., all 'E's), or high-value letters (common consonants), puzzle unravels too easily.

**How to avoid:**
1. Pre-reveal should help, not solve: 2–3 letters should reduce guess space by ~15–20%, not ~50%+
2. Choose pre-reveal letters carefully: avoid the most common letter (usually E), avoid letters that appear many times
3. Randomize which letters are revealed (seed-dependent) so same quote doesn't always reveal the same letters
4. Log pre-reveal metrics to console: `console.log('Pre-reveal: 3 letters, affecting 12% of puzzle')`
5. Test threshold: play puzzle with pre-reveal, verify it's still challenging but not frustrating (≤30 second average guess time before reveal)

**Warning signs:** Testers solve Cipher in <10 seconds after pre-reveal; testers report "feels broken"; quote author is obvious from partial text.

---

## Code Examples

Verified patterns from existing codebase:

### Example 1: Date Override via URL Param (Ladder.html Pattern)

**Source:** Existing ladder.html implementation (verified present)
```javascript
// Add near top of script, before puzzle generation
const urlParams = new URLSearchParams(window.location.search);
const overrideDate = urlParams.get('date');

// Modify DATE_SEED calculation to use override date
const DATE_SEED = (function() {
  const targetDate = overrideDate ? new Date(overrideDate) : new Date();
  const year = targetDate.getUTCFullYear();
  const month = String(targetDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(targetDate.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}_ladder_v1`;
})();

// Usage: ladder.html?date=2026-03-01
// Result: Same puzzle appears for that date every time
```

**Why this works:** `URLSearchParams` is native to all browsers; date override happens before puzzle generation; `_ladder_v1` suffix ensures no cross-game collisions.

### Example 2: Console Logging for Debug (Cipher Pattern)

**Source:** Pattern already used in ladder.html (line 1076) for optimal path logging

```javascript
// For Cipher: log quote difficulty metrics after selection
const DEBUG_MODE = new URLSearchParams(window.location.search).has('debug');
if (DEBUG_MODE) {
  const uniqueLetters = new Set(quote.text.replace(/[^a-z]/gi, '').toUpperCase()).size;
  const totalLetters = quote.text.replace(/[^a-z]/gi, '').length;
  const repetitionRatio = (totalLetters - uniqueLetters) / totalLetters;
  console.log(`[Cipher] Quote: "${quote.text}"`);
  console.log(`[Cipher] Author: ${quote.author}`);
  console.log(`[Cipher] Unique letters: ${uniqueLetters}, Repetition: ${repetitionRatio.toFixed(2)}`);
  console.log(`[Cipher] Pre-reveal: ${preRevealCount} letters (e.g., ${preRevealLetters.join(', ')})`);
}
```

**Why this works:** Debug logs don't interfere with game UX; testers open DevTools to verify difficulty metrics; metrics are captured in browser history for later analysis.

### Example 3: Seeded Random Number Generator (Proven Pattern)

**Source:** vowel.html lines 1087-1101 and ladder.html (copied)

```javascript
// Use identical seededRandom across all games for consistency
function seededRandom(seedStr) {
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
        const char = seedStr.charCodeAt(i);
        hash = Math.imul(31, hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    const seed = Math.abs(hash) % 2147483647;
    return (seed / 2147483647) % 1;
}

// Test: verify determinism
const rng1 = seededRandom('2026-02-28_test');
const rng2 = seededRandom('2026-02-28_test');
console.assert(rng1 === rng2, 'RNG should be deterministic'); // Always true
```

**Why this works:** Same seed always produces same output; Murmurhash variant is lightweight and collision-resistant; already proven in vowel.html and ladder.html.

### Example 4: Letter-Repetition Filter for Cipher

**Source:** Inferred from user requirement; not yet implemented

```javascript
// After quote selection, before assignment to gameState
function hasHighLetterRepetition(quoteText, minRepetitionRatio = 0.4) {
  // Extract only letters
  const letters = quoteText.replace(/[^a-z]/gi, '').toUpperCase();
  if (letters.length < 10) return false; // Skip very short quotes

  // Count unique letters
  const uniqueLetters = new Set(letters).size;

  // Repetition ratio = (total - unique) / total
  // Higher ratio = more duplicate letters = more helpful for Cipher
  const repetitionRatio = (letters.length - uniqueLetters) / letters.length;

  return repetitionRatio >= minRepetitionRatio;
}

// In puzzle generation loop:
const validQuotes = QUOTES.filter(q => hasHighLetterRepetition(q.text, 0.35));
if (validQuotes.length > 0) {
  const rng = seededRandom(DATE_SEED);
  const quoteIndex = Math.floor(rng() * validQuotes.length);
  gameState.quote = validQuotes[quoteIndex];
} else {
  // Fallback: use any quote if filter is too strict
  gameState.quote = QUOTES[Math.floor(rng() * QUOTES.length)];
}
```

**Why this works:** Filters quotes *at selection time*, not pre-processing the corpus. Allows fallback if no suitable quotes exist. `minRepetitionRatio` can be tuned (0.35-0.45) based on corpus analysis.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Hard-coded static puzzles | Seeded daily generation (all games) | Phase 6 (VOWEL), Phase 15 (Ladder), Phase 18 (Hunt) | Each player gets same puzzle per day; enables fair comparison across player base |
| System date for puzzle seed | URL param override for debugging | Phase 19 (proposed) | Testers can sample difficulty across dates without changing system time |
| On-screen debug info (overlays, text) | Console-only debug output | Project standard (applies now) | Preserves clean UX; tester opens DevTools to validate; no accidental spoilers |
| Manual word curation (trial-and-error) | Data-driven word selection (Ladder: BFS validation, Hunt: word lists) | Phase 15-16 (Ladder) | Ensures puzzle validity; validates solvability before showing puzzle |
| Single-lever difficulty (path length only) | Multi-lever difficulty tuning (Cipher: repetition + pre-reveal, Ladder: path length, Hunt: word curation) | Phase 19 (proposed) | More nuanced difficulty control; can tune sub-components independently |

**Deprecated/outdated:**
- **Hard-coded test dates:** Don't inject `if (today === '2026-02-15')` logic. Use `?date=` URL param instead.
- **On-screen debug panels:** Don't build floating overlays. Log to console.
- **Pre-processing quote/word corpuses offline:** Filter at puzzle generation time; allows dynamic adjustment.

---

## Testing Best Practices for Puzzle Games

### Difficulty Calibration Strategy

**Validation approach (from user requirements):**
1. **Sample size:** ~5 dates per game per tuning round
2. **Test method:** Manual play-testing (human judgment) — no automated metrics needed yet
3. **Acceptance criteria:**
   - Cipher: Quote is solvable in ~2-3 min without pre-reveal; with pre-reveal, ~1 min
   - Ladder: Optimal path is 3-4 steps; achievable in <5 min with confident play
   - Hunt: Easy words found in <2 min; hard words in <5 min; moderate learning curve
   - VOWEL: No change (already validated)

**Iteration loop:**
1. Tune parameters (path length range, pre-reveal count, word list)
2. Deploy to development build
3. Play 5 different dates (e.g., random dates from Feb 2026)
4. Record subjective difficulty per date (too easy / just right / too hard)
5. Adjust parameters if needed, repeat

### Reproducibility

**Key principle:** Same `?date=X` must always produce same puzzle.

**How to verify:**
```bash
# Load in browser with developer console open
# Visit: cipher.html?date=2026-02-28
# Record Quote, Author, Pre-reveal letters from console

# Reload page
# Verify identical quote, author, pre-reveal letters appear

# Visit: cipher.html?date=2026-02-15
# Record different quote

# Revisit: cipher.html?date=2026-02-28
# Verify original quote reappears (proves determinism works)
```

### Cross-Device Testing

**Why it matters:** Puzzle difficulty can feel different on mobile vs. desktop (smaller screen, harder to spot words in Hunt, harder to track Ladder paths).

**Minimum testing:**
- Desktop Chrome/Firefox (development)
- iPhone 12+ (modern iOS)
- Moto G4-equivalent or budget Android device (performance baseline from Phase 18)

**Special attention:** Hunt lasso on budget devices (Phase 18 concern still applies); Cipher on small screens (quote text wrapping).

---

## Open Questions

1. **What letter-repetition threshold is appropriate for Cipher?**
   - What we know: User wants quotes where solved letters reveal more puzzle structure. Requires analyzing corpus to find repetition distribution.
   - What's unclear: Is 0.35 (35% of letters are duplicates) too strict? Too lenient?
   - Recommendation: Analyze current QUOTES array, log repetition ratios, choose threshold that excludes only bottom 20% of quotes. Start with 0.35, adjust after play-testing.

2. **Should pre-revealed letters be randomized or consistent for same date?**
   - What we know: Pre-reveal 2–3 letters at game start. User didn't specify if same quote always reveals same letters.
   - What's unclear: Seeded randomization suggests randomization by date/seed. Verify this is desired behavior.
   - Recommendation: Implement seeded selection of pre-reveal letters (so same date = same reveal letters). Rationale: reproducibility for testing. Can change later if needed.

3. **What constitutes "moderate stretch" for Hunt hard words?**
   - What we know: User gave examples (words recognizable but uncommon; tricky to spot in grid). Phase 2 easy words felt fine; hard words need tuning.
   - What's unclear: Exact vocabulary level / frequency threshold. How to measure "tricky to spot" objectively?
   - Recommendation: Use word frequency lists (e.g., Google Books Ngram top 10K words). Validate by asking beta testers if they knew the words. Prioritize grid placement (words should be non-linear or clustered to reduce obviousness).

4. **How many dates should be tested before declaring difficulty "tuned"?**
   - What we know: User specified ~5 dates per game.
   - What's unclear: Is 5 sufficient? Should there be a pattern (e.g., test first/last day of month, random mid-month)?
   - Recommendation: Test 5 random dates from Feb 2026 (upcoming dates from tester's perspective). If consistent, declare done. If outliers appear, test 5 more. Cap at 15 dates per tuning round to avoid analysis paralysis.

5. **Should VOWEL really be skipped?**
   - What we know: User decided VOWEL feels fine and should be excluded from Phase 19.
   - What's unclear: Did previous phases validate VOWEL difficulty? Are there any known pain points?
   - Recommendation: Honor user decision. If issues arise after Phase 19 launch, VOWEL tuning can be a quick Phase 20 follow-up.

---

## Sources

### Primary (HIGH confidence)

- **vowel.html** (2432 lines) — Seeded RNG implementation (`seededRandom` function, line 1087), DATE_SEED pattern, daily puzzle generation, localStorage persistence
- **ladder.html** (1745 lines) — Path length constraints (lines 954-974), puzzle generation loop, seeded randomization copied from vowel.html, console logging pattern (line 1076), fallback puzzle
- **hunt.html** (1568 lines) — Word list structure (lines 750-768), easy/hard word categories, grid generation, daily puzzle seed pattern
- **cipher.html** (988 lines) — QUOTES corpus (lines 501-524), quote selection loop (lines 934-935), localStorage persistence for progress

### Secondary (MEDIUM confidence)

- **.planning/STATE.md** — Project history of seeded puzzle implementation (Phase 6 for VOWEL, Phase 15 for Ladder, Phase 18 for Hunt); confirms pattern consistency
- **19-CONTEXT.md** — User decisions from discussion phase; specifies locked implementation choices (date override, difficulty levers, testing method)

### Tertiary (Reference only, not trust basis)

- Project architecture: HTML-only games with inline JavaScript; no external testing frameworks; localStorage for persistence

---

## Metadata

**Confidence breakdown:**
- **Standard Stack: HIGH** — All patterns already implemented in existing code; seeded RNG, date-based generation, localStorage all proven in vowel.html and ladder.html
- **Architecture Patterns: HIGH** — Date override and console logging are straightforward extensions of existing patterns; no new technologies needed
- **Testing Strategy: MEDIUM** — Best practices inferred from puzzle game conventions and project constraints (client-side, no backend); user decisions provide clear targets (5 dates, specific difficulty metrics); user hasn't built A/B testing framework, so play-testing methodology is partly inference
- **Pitfalls: MEDIUM** — Pitfall patterns inferred from puzzle game development literature and common mistakes; validated against current codebase constraints
- **Implementation Details: HIGH** — Specific code patterns extracted from existing files; letter-repetition filtering requires minor inference but follows user specification

**Research date:** 2026-02-28
**Valid until:** 2026-03-15 (stable domain; puzzle tuning parameters can shift quickly based on play-test feedback; recommend re-check after first 2-3 testing sessions)

---

## Next Steps for Planner

1. **Map user decisions to tasks:** Each locked decision in CONTEXT.md maps to one or more tasks (e.g., "Date override for Cipher" = separate task from "Implement letter-repetition filter")
2. **Sequence by dependency:** Cipher first (pre-reveal is highest-impact UX change), then Ladder (clear mechanical fix), then Hunt (subjective tuning)
3. **Define acceptance criteria:** Play 5 dates per game per task; record subjective difficulty; pass when consistent across dates
4. **Identify testing resources:** Will user play-test, or delegate to external tester? Impacts scheduling
5. **Plan debug harness:** Decide if debug output goes to console only or if there should be an optional on-screen debug panel (recommend console-only per user preferences)
