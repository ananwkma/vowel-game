# Phase 17: Cipher - Research

**Researched:** 2026-02-27
**Domain:** Vanilla JS/HTML browser game — number substitution cipher, daily quote engine, block interaction UI
**Confidence:** HIGH (self-contained pattern; all findings derived from existing codebase + first-principles game design)

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CIPH-01 | Every player on the same day sees the same famous quote encoded with the same number-to-letter mapping (daily seed) | Seeded PRNG pattern (copied from vowel.html / ladder.html): DATE_SEED includes `_cipher_v1` suffix; selects quote index + shuffles letter-to-number mapping deterministically |
| CIPH-02 | Player can tap a number block to select it, then type a letter to assign it; that letter fills in for every occurrence of that number across the entire quote | Hidden input + block click = same pattern as ladder.html tile interaction; "fill all" means iterating all DOM nodes with `data-number="N"` and updating their textContent |
| CIPH-03 | Correctly solved letters are visually distinguished from unsolved number blocks and incorrectly guessed letters | Three CSS classes: `.block--unsolved` (dark charcoal, shows number), `.block--correct` (sage green, shows letter), `.block--wrong` (dusty rose, shows guessed letter); state held in JS `guesses` map |
| CIPH-04 | When all numbers are correctly decoded, the full quote is revealed and the game is won | Win condition: `Object.keys(cipherMap).every(num => guesses[num] === cipherMap[num])` — checked after each letter assignment |
| CIPH-05 | Completed state is written to the hub's daily status so the Cipher card shows as done | `DailyStatus.markCompleted('cipher')` called on win — identical pattern to vowel.html and ladder.html |
</phase_requirements>

---

## Summary

Phase 17 is a self-contained vanilla HTML/CSS/JS game — no npm packages, no build tooling. The technical domain is identical to the existing Ladder game: the project's established seeded PRNG (Math.imul Murmurhash variant), the hidden-input + block-click interaction pattern, and the DailyStatus localStorage pattern. No external research into third-party libraries is needed or appropriate.

The core game engine involves two data structures: a `cipherMap` (number → correct letter, derived from the quote) and a `guesses` object (number → player's typed letter). All display logic flows from comparing these two. The trickiest part is **layout**: a quote must render as wrapped lines of number blocks with word separators and punctuation handled correctly — this requires a deliberate rendering approach rather than a flat block grid.

The one genuine research question is the **quote corpus** strategy. With no backend, quotes must be embedded in the HTML file as a hardcoded array. A curated list of 50–100 famous quotes, filtered for length (20–50 unique letters to yield 8–26 cipher numbers), provides ~100 days of daily variety before recycling. The seeded PRNG picks one by index, then constructs the letter→number mapping.

**Primary recommendation:** Implement cipher.html as a single HTML file following the vowel.html/ladder.html structure exactly — shared design tokens, same seeded PRNG, same DailyStatus, same hidden input + block click pattern. Embed 60+ famous quotes as a hardcoded JS array.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vanilla JS | Native | Game engine, DOM manipulation, localStorage | No build step; matches all existing games in this project |
| CSS Custom Properties | Native | Design token consumption via `styles/design-tokens.css` | Project-mandated pattern; all games share tokens |
| Playfair Display | Google Fonts | Serif typeface | Project-mandated; loaded via design-tokens.css @import |

### No External Libraries

This game requires zero npm packages. All functionality is native browser APIs:
- `localStorage` for state persistence and hub integration
- `Date.toISOString()` for daily seed
- `Math.imul` for seeded PRNG (Murmurhash variant — already in project)
- DOM events (`click`, `input`) for interaction
- CSS `@keyframes` for animations

### Alternatives Considered

| Instead of | Could Use | Why Not |
|------------|-----------|---------|
| Hardcoded quote array | Fetch from JSON/API | No backend; GitHub Pages is static; adds failure mode |
| Hidden input capture | `keydown` on document | Hidden input is the established project pattern; better mobile keyboard support |
| CSS Grid for quote blocks | Flexbox wrap | Flexbox wrap is simpler and handles variable-width words naturally |
| Separate quote picker logic | Inline in engine | Separation has no benefit at this scale; single-file pattern matches existing games |

**Installation:** None required.

---

## Architecture Patterns

### Recommended File Structure

```
jacktest/
├── cipher.html              # Single-file game (CSS + HTML + JS inline)
├── styles/
│   └── design-tokens.css    # Already exists — import, do not modify
└── index.html               # Hub — add cipher card after Phase 17 ships
```

**The game is one file.** All CSS is in a `<style>` tag, all JS in a `<script>` tag at bottom of body. This is the established project pattern (vowel.html, ladder.html).

### Pattern 1: Cipher Engine — Quote to Number Mapping

**What:** The engine converts a quote string into a `cipherMap` (number → letter) and a `letterMap` (letter → number) using the seeded PRNG to shuffle the assignment. Spaces and punctuation are preserved but not encoded.

**When to use:** At page load, once per day.

**How it works:**

```javascript
// Source: project-established pattern (ladder.html seededRandom)

// 1. PRNG — copied exactly from vowel.html / ladder.html
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

// 2. Daily seed — same date = same puzzle for all players
const DATE_SEED = new Date().toISOString().split('T')[0] + '_cipher_v1';
const rng = seededRandom(DATE_SEED);

// 3. Pick quote by index
const quoteIndex = Math.floor(rng() * QUOTES.length);
const { text, author } = QUOTES[quoteIndex];

// 4. Extract unique letters from quote (A-Z only, uppercase)
const uniqueLetters = [...new Set(text.toUpperCase().replace(/[^A-Z]/g, '').split(''))].sort();
// e.g. ['A', 'B', 'E', 'H', 'I', 'N', 'O', 'R', 'S', 'T']

// 5. Shuffle assignment of numbers 1..N to those unique letters
// Numbers go 1 to uniqueLetters.length — each letter gets a unique number
const numbers = uniqueLetters.map((_, i) => i + 1);
// Fisher-Yates shuffle with seeded rng:
for (let i = numbers.length - 1; i > 0; i--) {
  const j = Math.floor(rng() * (i + 1));
  [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
}

// 6. Build bidirectional maps
const letterToNum = {};  // 'A' -> 3, 'B' -> 7, ...
const cipherMap = {};    // 3 -> 'A', 7 -> 'B', ... (this is the answer key)
uniqueLetters.forEach((letter, i) => {
  letterToNum[letter] = numbers[i];
  cipherMap[numbers[i]] = letter;
});

// 7. State — player's guesses
const guesses = {};  // number -> letter (player's assignment, may be wrong)
```

**Key design note:** Numbers range 1 to N where N = count of unique letters in the quote. A 26-letter quote has numbers 1–26. A 15-letter quote has numbers 1–15. This keeps numbers compact and readable.

### Pattern 2: Quote Rendering as Wrapped Blocks

**What:** The quote is rendered as a flex-wrap container of "words." Each word is a non-wrapping group of number blocks. Spaces become visual gaps between word groups. Punctuation (comma, period, apostrophe, exclamation, question mark) is displayed as small text after the last block of the word.

**Why this approach:** A flat list of all blocks would wrap mid-word, which is confusing. Grouping by word and using `white-space: nowrap` on each word group keeps words intact while allowing line breaks between words.

**Rendering structure:**

```html
<!-- Quote: "To be or not to be" -->
<div id="quote-display">         <!-- flex-wrap: wrap; gap between word-groups -->

  <div class="word-group">       <!-- white-space: nowrap; display: inline-flex -->
    <div class="cipher-block unsolved" data-number="7">7</div>
    <div class="cipher-block unsolved" data-number="3">3</div>
    <!-- word: "To" = T→7, o→3 -->
  </div>

  <div class="word-group">
    <div class="cipher-block unsolved" data-number="5">5</div>
    <div class="cipher-block unsolved" data-number="9">9</div>
    <!-- word: "be" = b→5, e→9 -->
  </div>

  <!-- ... more word-groups ... -->
</div>
```

**Algorithm to build word-groups:**

```javascript
function buildQuoteDOM(text, letterToNum) {
  const container = document.getElementById('quote-display');
  container.innerHTML = '';

  // Split quote into tokens: words and punctuation
  // Strategy: iterate char by char, group letters into words,
  // attach trailing punctuation to the previous word-group
  const tokens = tokenizeQuote(text);  // returns [{type:'word', chars:[...]}, {type:'punct', ch:','}]

  tokens.forEach(token => {
    if (token.type === 'word') {
      const group = document.createElement('div');
      group.className = 'word-group';

      token.chars.forEach(ch => {
        const upper = ch.toUpperCase();
        if (/[A-Z]/.test(upper)) {
          const num = letterToNum[upper];
          const block = document.createElement('div');
          block.className = 'cipher-block';
          block.dataset.number = num;
          block.textContent = num;
          group.appendChild(block);
        }
      });

      container.appendChild(group);
    } else if (token.type === 'punct') {
      // Append punctuation as a text span after the last word-group
      const lastGroup = container.lastElementChild;
      if (lastGroup) {
        const punct = document.createElement('span');
        punct.className = 'punct-mark';
        punct.textContent = token.ch;
        lastGroup.appendChild(punct);
      }
    }
  });
}
```

### Pattern 3: Block Selection and Letter Assignment

**What:** Tap a number block → it becomes selected (amber glow) + hidden input receives focus → player types a letter → ALL blocks with that number update to show the guessed letter + correct/wrong state applied.

**Key difference from Ladder:** In Ladder, selecting a tile and typing replaces just that tile. In Cipher, selecting ANY block with number N and typing assigns that letter to ALL blocks with number N simultaneously. The selected block is just the "entry point."

```javascript
// Source: derived from ladder.html tile selection pattern

let selectedNumber = null;  // currently selected cipher number

function selectBlock(number) {
  if (gameState.won) return;

  // Deselect previous
  document.querySelectorAll('.cipher-block.selected').forEach(b => b.classList.remove('selected'));

  selectedNumber = number;

  // Select ALL blocks with this number (highlight them all)
  document.querySelectorAll(`.cipher-block[data-number="${number}"]`).forEach(b => {
    b.classList.add('selected');
  });

  // Focus hidden input for keyboard capture
  const hiddenInput = document.getElementById('hidden-input');
  hiddenInput.value = '';
  hiddenInput.focus();
}

// Hidden input captures typed letter
document.getElementById('hidden-input').addEventListener('input', (e) => {
  if (selectedNumber === null) return;
  const char = e.target.value.slice(-1).toUpperCase();
  e.target.value = '';
  if (char && /[A-Z]/.test(char)) {
    assignLetter(selectedNumber, char);
  }
});

function assignLetter(number, letter) {
  guesses[number] = letter;
  const isCorrect = cipherMap[number] === letter;

  // Update ALL blocks with this number
  document.querySelectorAll(`.cipher-block[data-number="${number}"]`).forEach(block => {
    block.textContent = letter;
    block.classList.remove('unsolved', 'correct', 'wrong', 'selected');
    block.classList.add(isCorrect ? 'correct' : 'wrong');
  });

  selectedNumber = null;

  // Check win condition
  checkWin();
}

function checkWin() {
  const allCorrect = Object.keys(cipherMap).every(
    num => guesses[num] === cipherMap[num]
  );
  if (allCorrect) {
    gameState.won = true;
    DailyStatus.markCompleted('cipher');
    showWinScreen();
  }
}
```

### Pattern 4: Three Visual States for Blocks

**What:** Cipher blocks have three states: unsolved (shows number, dark charcoal), correct (shows letter, sage green), wrong (shows guessed letter, dusty rose).

**CSS mapping to design tokens:**

```css
.cipher-block {
  /* Base — shared across all states */
  width: 40px;
  height: 40px;
  border-radius: var(--block-radius);
  font-family: var(--font-serif);
  font-weight: 700;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: background-color var(--transition-fast), color var(--transition-fast);
}

.cipher-block.unsolved {
  background-color: var(--color-secondary);  /* #2C2B28 charcoal */
  color: var(--color-secondary-text);        /* #F8F7F4 off-white */
}

.cipher-block.correct {
  background-color: var(--color-success);    /* #8BAF7C sage green */
  color: var(--color-primary-text);          /* #1C1B18 near-black */
}

.cipher-block.wrong {
  background-color: var(--color-warning);    /* #C4836F dusty rose */
  color: var(--color-secondary-text);        /* #F8F7F4 off-white */
}

.cipher-block.selected {
  outline: 3px solid var(--color-primary);   /* #D4A574 amber — same as Ladder tile selection */
  outline-offset: 2px;
}
```

**Note:** "correct" and "wrong" are both assigned — a wrong guess can be overwritten by tapping that number again and typing a new letter.

### Pattern 5: DailyStatus Hub Integration

**What:** On win, write to the shared `wordGames_dailyStatus` localStorage key. Hub reads this on load to show completed state.

```javascript
// Source: identical pattern in vowel.html (line ~1989) and ladder.html (line ~970)
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
```

**Hub card key:** `'cipher'` — the hub reads `status['cipher']` and the existing game card array must include `'cipher'`.

### Pattern 6: Quote Corpus Strategy

**What:** 60–80 famous quotes embedded as a hardcoded JS array in cipher.html. Selected by seeded index.

**Quote selection criteria:**
- Length: 20–80 characters of letters (after stripping non-alpha) — ensures 8–26 unique letters = 8–26 cipher numbers
- Fame: instantly recognizable, no obscure references
- Avoids ambiguity: apostrophes, commas, and periods are visual punctuation only — do not participate in the cipher
- Author attribution included for display on win screen

**Example corpus structure:**

```javascript
const QUOTES = [
  { text: "To be or not to be, that is the question.", author: "Shakespeare" },
  { text: "Ask not what your country can do for you.", author: "Kennedy" },
  { text: "I have a dream.", author: "Martin Luther King Jr." },
  { text: "That's one small step for man, one giant leap for mankind.", author: "Neil Armstrong" },
  // ... 60+ entries
];
```

**Coverage math:** 60 quotes × 365 days = 6+ years before repeat (but index wraps with modulo, so after 60 days it cycles). For a v1 game this is entirely acceptable.

### Pattern 7: Persistence — Resume Mid-Game

**What:** If a player has started today's cipher but not finished, the guesses should be restored on page refresh. Match the Ladder pattern.

```javascript
const CipherProgress = {
  _key() { return `cipher_progress_${new Date().toISOString().split('T')[0]}`; },
  save(guesses) {
    try { localStorage.setItem(this._key(), JSON.stringify(guesses)); } catch(e) {}
  },
  load() {
    try {
      const raw = localStorage.getItem(this._key());
      return raw ? JSON.parse(raw) : null;
    } catch(e) { return null; }
  }
};
```

After computing `cipherMap`, call `CipherProgress.load()` and if guesses exist, replay them through `assignLetter()` to restore visual state.

### Anti-Patterns to Avoid

- **Assigning numbers sequentially (A=1, B=2, C=3):** Makes the cipher trivially solvable. The seeded shuffle is critical.
- **Including spaces and punctuation in the cipher:** Only letters are encoded. Spaces and punctuation are literal visual elements.
- **Using `keydown` on document for input:** Mobile keyboards don't reliably fire `keydown`. Use the hidden input `input` event — established project pattern.
- **Rendering each block independently without `data-number` attribute:** Makes the "fill all" operation O(n) DOM queries for each guess. The `data-number` attribute approach enables `querySelectorAll('[data-number="N"]')` efficiently.
- **Allowing duplicate letter assignments:** Two different numbers should not map to the same letter. Enforce: when a player types letter L for number N, check if L is already assigned to another number M. If so, either: (a) auto-clear M's assignment, or (b) show an error. Option (a) is more fluid. Document this decision in the plan.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Seeded randomness | Custom LCG | Math.imul Murmurhash from vowel.html / ladder.html | Already proven, consistent across all games; changing algorithm breaks cross-game consistency |
| Keyboard input on mobile | `keydown` listener | Hidden `<input>` + `input` event | Native iOS/Android virtual keyboard fires `input`, not reliably `keydown`; established project pattern |
| Animation framework | Custom JS transitions | CSS `transition` + class toggles | All existing animations in this project use this approach; `--transition-fast`/`--transition-normal` tokens already defined |
| Quote database | External API | Hardcoded JS array | No backend; GitHub Pages is static; API adds failure mode; 60 quotes = 60+ day coverage |

**Key insight:** Every hard problem in this game is already solved by the existing codebase. Reuse the established patterns verbatim.

---

## Common Pitfalls

### Pitfall 1: Mobile Keyboard Not Opening

**What goes wrong:** Player taps a number block, expects mobile keyboard — nothing appears.
**Why it happens:** Mobile browsers only open the virtual keyboard when a focusable input element receives focus. A `div` with a `click` listener is not focusable by the keyboard.
**How to avoid:** Use the hidden input pattern from ladder.html. Place `<input id="hidden-input" type="text" inputmode="text" autocomplete="off" autocorrect="off" autocapitalize="characters" aria-hidden="true" style="opacity:0;position:fixed;top:0;left:0;width:1px;height:1px;pointer-events:none;">` in the HTML. Call `.focus()` on it after every block click.
**Warning signs:** Testing only on desktop (keyboard events work fine) — always test on a real mobile device or Chrome DevTools mobile simulation.

### Pitfall 2: Wrong Guess Cannot Be Corrected

**What goes wrong:** Player assigns wrong letter to number 7, then tries to tap number 7 and retype — but the block ignores the click because wrong-state blocks have click disabled or state check prevents re-assignment.
**Why it happens:** Treating "wrong" guesses as immutable.
**How to avoid:** Wrong-state blocks must remain clickable. The `selectBlock()` function should work regardless of current block state. Only `gameState.won` should disable block interaction.

### Pitfall 3: Quote Has Only One Unique Letter (Edge Case)

**What goes wrong:** A quote like "Aaa!" has 1 unique letter, producing a trivial 1-number cipher. Not a real game.
**Why it happens:** No minimum-uniqueness filter on the quote corpus.
**How to avoid:** Filter QUOTES at build time — keep only quotes with 8+ unique letters. With the curated corpus of famous quotes this should never trigger, but defensive filtering is worthwhile.

### Pitfall 4: Cipher Numbers Collide With Punctuation Visually

**What goes wrong:** A number block containing "12" looks similar to the literal text "12" in an adjacent punctuation mark.
**Why it happens:** High-digit numbers (12+) in quotes with many unique letters look like dates or other text.
**How to avoid:** Style number blocks distinctly with background color. The dark charcoal block (`.unsolved`) makes it visually unambiguous that blocks are different from surrounding text. Keep font-size consistent.

### Pitfall 5: Quote Layout Breaks on Narrow Screens

**What goes wrong:** Long words with many letters become word-groups that are wider than the screen. The group cannot wrap because `word-group` has `white-space: nowrap` / `display: inline-flex`.
**Why it happens:** English words up to ~12 letters × ~42px per block = ~500px width, which exceeds 320px (iPhone SE) screen.
**How to avoid:** Cap block width at 36–38px (slightly smaller than the 52px Ladder tile). The cipher display needs to be space-efficient. Add `overflow-x: auto` as a safety valve. For words longer than 10 letters, consider splitting into two sub-groups (optional — document this decision in plan).

### Pitfall 6: Hub Card Not Updated

**What goes wrong:** Player wins, but the hub still shows the Cipher card without the "completed" checkmark.
**Why it happens:** `DailyStatus.markCompleted('cipher')` called but hub reads `wordGames_dailyStatus['cipher']` — different key name used.
**How to avoid:** Use exactly `'cipher'` as the game ID string. Verify hub `index.html` iterates `['vowel', 'ladder', 'hunt', 'cipher']` — currently it only does `['vowel', 'ladder', 'hunt']`. The hub must be updated to include `'cipher'` in its daily status check AND a cipher card must be added to `#hub-grid`.

### Pitfall 7: Duplicate Letter Assignments

**What goes wrong:** Player assigns 'E' to number 3, then assigns 'E' to number 7. Now two different numbers both claim 'E', but the cipher has only one letter per number.
**Why it happens:** No uniqueness enforcement in `assignLetter()`.
**How to avoid:** Before assigning letter L to number N, scan `guesses` for any existing key M where `guesses[M] === L`. If found, clear M's assignment: delete `guesses[M]`, reset all blocks with `data-number="M"` back to `.unsolved` showing the number. This is the most fluid UX — "you stole the E from number 3 to give to number 7."

---

## Code Examples

Verified patterns from existing codebase:

### DailyStatus Pattern (from ladder.html lines 970-986)

```javascript
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
// Usage: DailyStatus.markCompleted('cipher');
```

### Seeded PRNG Pattern (from ladder.html lines 876-888)

```javascript
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
// Usage: seededRandom(today + '_cipher_v1')
```

### Hidden Input Pattern (from ladder.html lines 1128-1144)

```javascript
// HTML: <input id="hidden-input" type="text" inputmode="text"
//        autocomplete="off" autocorrect="off" autocapitalize="characters"
//        aria-hidden="true"
//        style="opacity:0;position:fixed;top:0;left:0;width:1px;height:1px;pointer-events:none;">

hiddenInput.addEventListener('input', (e) => {
  if (selectedNumber === null) return;
  const raw = e.target.value;
  const char = raw.slice(-1).toUpperCase();
  if (char && /[A-Z]/.test(char)) {
    assignLetter(selectedNumber, char);
  }
  e.target.value = '';  // Reset so next keypress always triggers 'input'
});
```

### Hub Daily Status Check (from index.html lines 201-216)

```javascript
// Hub reads: wordGames_dailyStatus[gameId].completed && dateKey === today
// Must add 'cipher' to the game list:
['vowel', 'ladder', 'hunt', 'cipher'].forEach(function(gameId) {
  const record = status[gameId];
  if (record && record.completed && record.dateKey === today) {
    const card = document.getElementById('card-' + gameId);
    if (card) card.classList.add('completed');
  }
});
```

### Back Button Pattern (from ladder.html lines 61-89)

```html
<a id="back-link" href="index.html">LEXICON</a>
```

```css
#back-link {
  position: fixed;
  top: max(12px, env(safe-area-inset-top));
  left: 12px;
  z-index: 6000;
  padding: 6px 2px;
  background-color: transparent;
  color: var(--color-primary-text);
  text-decoration: none;
  font-family: var(--font-serif);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  opacity: 0.7;
  transition: opacity var(--transition-fast);
}
```

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| Letter substitution cipher (A→X, B→Q) | Number substitution cipher (A→7, B→3) | Numbers are visually distinct from guessed letters; players never confuse "the cipher symbol" with "my answer" |
| Flat grid of all blocks | Word-grouped flex-wrap layout | Words stay intact on line breaks; natural reading flow |
| Immediate wrong-guess lock | Wrong guess is correctable | Less frustrating; player can experiment and backtrack |

**No deprecated approaches:** This is a new game type in the project. No legacy patterns to migrate away from.

---

## Open Questions

1. **Should wrong guesses be auto-cleared when the same letter is typed for a different number?**
   - What we know: Two numbers cannot share the same letter in a valid cipher
   - What's unclear: UX preference — auto-clear the displaced number (fluid, less interruption) vs. show error and require manual correction (more explicit)
   - Recommendation: Auto-clear the displaced assignment. Simpler code, more satisfying UX. Implement in `assignLetter()` with a scan before assignment.

2. **Should punctuation (apostrophes, commas) be literal text or skipped entirely?**
   - What we know: The game description says number blocks represent letters; punctuation is visual decoration
   - What's unclear: Whether apostrophes in contractions (e.g., "That's") should show as `'` after the block group or be stripped from the display entirely
   - Recommendation: Render apostrophes and commas as literal small text adjacent to word-groups. Improves readability of the encoded quote without affecting game logic.

3. **How many cipher plans are needed?**
   - What we know: Ladder used 3 plans (skeleton+engine, interaction, results+hub). Vowel used ~3 plans.
   - What's unclear: Whether Cipher's simpler game loop (no BFS, no path history) means it can be done in 2 plans
   - Recommendation: 2 plans — Plan 01: HTML skeleton + CSS + engine (PRNG, quote corpus, cipher map, block rendering), Plan 02: interaction (block selection, letter assignment, win detection, results overlay, hub integration + hub card update).

4. **Should the hub card be added in Phase 17 or was it expected earlier?**
   - What we know: index.html currently only has vowel, ladder, hunt cards; hunt card is disabled. index.html iterates `['vowel', 'ladder', 'hunt']` for daily status.
   - What's unclear: Whether a disabled cipher card placeholder should have been added in Phase 14.
   - Recommendation: Add the cipher card (initially disabled) to index.html as part of Phase 17 Plan 01. Enable it (change `div.disabled` to `a[href="cipher.html"]`) in Plan 02 when the game is functional.

---

## Sources

### Primary (HIGH confidence)

- `ladder.html` lines 876–1024 — seededRandom, DATE_SEED, DailyStatus, LadderResult, LadderProgress patterns
- `vowel.html` lines 1–150 — HTML structure, CSS bridge pattern, back-link, design-tokens import
- `index.html` lines 196–216 — hub daily status check pattern, game card structure
- `styles/design-tokens.css` — all CSS custom property names, values, and shadows
- `.planning/STATE.md` — established project decisions (seededRandom algorithm, DailyStatus pattern, hidden input pattern)
- `.planning/REQUIREMENTS.md` — CIPH-01 through CIPH-05 defined in ROADMAP.md success criteria

### Secondary (MEDIUM confidence)

- Game design best practice: number substitution ciphers are established puzzle formats (NY Times Cryptoquote). Recommend 1-to-N number assignment rather than alphabetical (A=1) to increase difficulty. (Common knowledge, no single authoritative source.)
- CSS `flex-wrap` for word-group layout: well-established CSS pattern for wrapping groups of inline elements while keeping group internals intact.

### Tertiary (LOW confidence)

- Quote count estimate (60+ = sufficient): Based on first-principles math. Actual variety and re-encounter frequency depends on user engagement patterns. Not verified against any external study.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no external libraries; all patterns derived from existing project code
- Architecture: HIGH — directly mirrors established vowel.html / ladder.html patterns
- Game engine: HIGH — cipher algorithm is deterministic and well-understood
- Layout approach: MEDIUM — word-group flex-wrap is the right approach but block sizing on narrow screens requires empirical testing during implementation
- Pitfalls: HIGH — identified from first principles + mobile interaction experience

**Research date:** 2026-02-27
**Valid until:** Stable indefinitely (no external dependencies or versioned libraries)
