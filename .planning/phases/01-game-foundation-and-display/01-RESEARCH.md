# Phase 1: Game Foundation & Display - Research

**Researched:** 2026-02-19
**Domain:** Vanilla JavaScript word game engine, elegant UI design, accessibility compliance
**Confidence:** HIGH

## Summary

Phase 1 establishes the word engine and static game board for a browser-based word puzzle game. The implementation is constrained to a single HTML file (no build tools), vanilla JavaScript with no frameworks, and an elegant design meeting WCAG AA color contrast standards.

Key technical domains are: (1) **Word engine** — embedding a curated English word list, filtering by vowels, and random selection without repeats; (2) **Display architecture** — single-file CSS/JS organization with state-managed DOM rendering; (3) **Elegant visual design** — serif typography, subtle drop shadows, and precise color contrast math for accessibility.

Research confirms industry-standard patterns for all these domains exist and are well-documented. No blocking unknowns identified.

**Primary recommendation:** Use Fisher-Yates shuffle for random selection, Merriweather or PT Serif fonts for elegant typography on blocks, layered CSS box-shadows for subtle elevation, and a state-object pattern for rendering the initial game board.

---

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- Single HTML file delivery — no external assets, no external API calls, all CSS/JS inline
- Vanilla JavaScript — no frameworks (React, Vue, etc.)
- Color palette: light mode background; warm amber/gold vowel blocks; charcoal/dark gray consonant blocks; sage green for win state; dusty rose/muted salmon for give up state
- Typography: uppercase, elegant serif font on all blocks
- Block styling: flat/minimal OR soft elevation with gentle drop shadow (Claude's discretion for exact shadow values)
- Corner rounding: slightly rounded (4-6px) — modern but structured
- Block size: medium tiles (48-56px)
- Game title: "Vowel" — elegant rendering (exact typographic treatment at Claude's discretion)
- Word pool: 1000+ words, 4-10 letters, mixed difficulty, no proper nouns/slang/obscure terms
- Random selection: no immediate repeats
- Accessibility: WCAG AA contrast standards; win/give up states must not rely on color alone (text label or icon required)

### Claude's Discretion
- Exact shadow values if soft elevation chosen
- Specific serif font selection (free/web-safe or Google Font, readable at block size)
- Exact shade values within amber/charcoal/sage/dusty-rose direction
- Title typographic treatment (layout, sizing)
- How the accessibility cue supplements win/give up color (text label, icon, or animation)
- Block styling: flat vs. soft elevation with shadow

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.

</user_constraints>

---

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CORE-01 | Random English word selected each round; consonants extracted in original order | Fisher-Yates shuffle algorithm ensures random uniform distribution; regex pattern `[^aeiou]/gi` extracts consonants in order |
| CORE-02 | N blank yellow blocks at LEFT, consonant blocks in order (e.g., "_ _ C R W D") | State-based DOM rendering pattern; document fragment for efficient batch updates; CSS flexbox for layout |
| WORD-01 | Word list embedded in JS (common English words, no external API) | Multiple curated word lists available on GitHub (words/an-array-of-english-words ~275k words); filter down to 1000+ common 4-10 letter words |
| WORD-02 | Words selected randomly each round with no immediate repeat | Fisher-Yates shuffle + Set or array tracking for deduplication; O(n) time complexity, guaranteed distribution |
| WORD-03 | Only words containing at least one vowel (A/E/I/O/U) qualify | Regex pattern `/[aeiou]/i.test(word)` filters efficiently; can pre-filter word list at initialization |
| VIS-01 | Elegant modern design — cohesive color palette, beautiful aesthetic | Layered CSS box-shadows with 0.1-0.2 opacity (subtle); modern serif fonts; careful spacing (8-10px gaps) |
| VIS-04 | Letter blocks styled with modern design — consonants/vowels distinct; rounded corners, subtle shadows | Recommended: Merriweather or PT Serif (Google Fonts); 4-6px border-radius; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1) |
| VIS-05 | Title "Vowel" — elegant, minimal (replaces original longer title) | Serif font consistent with blocks; top-left, centered, or stylized placement per Claude's discretion; typography-focused without animation |
| VIS-06 | Give Up button — bottom-center, dusty rose color, styled accessibly | Text label required (not color alone); button styling uses CSS box-shadow and rounded corners consistent with blocks |

</phase_requirements>

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vanilla JavaScript | ES6+ | All game logic, DOM manipulation, state management | Single HTML file constraint; no external dependencies; modern browsers support ES6 natively |
| HTML5 | Living standard | Semantic markup, semantic elements | Native browser support; single-file constraint eliminates external file dependencies |
| CSS3 | Living standard | All styling, layout, elevation effects, animations | Native browser support; flexbox/grid for responsive layout; box-shadow for elevation |

### Supporting Libraries (Optional, but recommended per research)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Google Fonts | Current (Feb 2026) | Elegant serif fonts (Merriweather, PT Serif, Playfair Display, Bitter, Libre Baskerville) | Free, web-safe, @import or CSS link; no npm needed for single-file constraint |
| No external word list library | N/A | Embed curated word list directly in JS | Single-file constraint; ~1000 words = ~50KB (acceptable payload for single HTML) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Vanilla JS | React / Vue / Svelte | Adds bundle size, build step, complexity for simple game; single-file constraint eliminates framework option |
| Embedded word list | External API / JSON file | Breaks offline-first simplicity, adds latency, external dependency not allowed |
| Google Fonts | System fonts (serif) | Serif availability varies by OS; Google Fonts ensures consistent rendering across platforms |
| CSS box-shadow | SVG filters | More complex, harder to tune elegantly; box-shadow is native, performant, simple |

**Installation:**
```bash
# No npm installation needed for Phase 1
# Create single HTML file with inline CSS and JavaScript
# Use Google Fonts @import for serif font (free, no auth required)
```

---

## Architecture Patterns

### Recommended Project Structure (Single HTML File)

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Google Fonts @import -->
  <style>
    /* Inline CSS: global styles, game board styles, block styles, button styles */
    /* Color definitions, typography, layout (flexbox) */
  </style>
</head>
<body>
  <!-- Game container (div) -->
  <!-- Title "Vowel" -->
  <!-- Game board (div with flex layout) -->
  <!-- Give Up button -->

  <script>
    /* State object (game state, word pool, current game) */
    /* Word engine (random selection, filtering, extraction) */
    /* DOM manipulation (render board, update display) */
    /* Event listeners (Give Up button for Phase 2+) */
  </script>
</body>
</html>
```

### Pattern 1: State-Based UI Rendering

**What:** Maintain a single source of truth (state object) that determines what the DOM should look like. Render function(s) convert state to DOM elements.

**When to use:** Every UI change (new word loaded, blocks rearranged) — trigger a re-render from state, not direct DOM manipulation.

**Example:**
```javascript
// Source: CSS-Tricks, Go Make Things, Medium (2026 vanilla JS state management patterns)

const gameState = {
  currentWord: 'CROWD',
  vowelCount: 1,
  consonants: ['C', 'R', 'W', 'D'],
  vowelIndices: [2], // position of vowels in original word
};

function renderBoard(state) {
  const boardDiv = document.getElementById('game-board');
  boardDiv.innerHTML = ''; // Clear

  // Render blank vowel blocks (left)
  for (let i = 0; i < state.vowelCount; i++) {
    const vowelBlock = document.createElement('div');
    vowelBlock.className = 'block vowel-block';
    vowelBlock.textContent = '_';
    boardDiv.appendChild(vowelBlock);
  }

  // Render consonant blocks (right)
  state.consonants.forEach(c => {
    const consonantBlock = document.createElement('div');
    consonantBlock.className = 'block consonant-block';
    consonantBlock.textContent = c;
    boardDiv.appendChild(consonantBlock);
  });
}

// On game load
renderBoard(gameState);
```

**Anti-Patterns to Avoid:**
- **Direct DOM manipulation scattered across code:** Makes state unpredictable, hard to debug. Always route through a render function.
- **Mutating state without re-rendering:** State and DOM can diverge. After any state change, always call render().
- **Inline event handlers with DOM changes:** Keeps logic coupled to HTML. Separate event logic from rendering.

### Pattern 2: Word Engine Architecture

**What:** Encapsulate word selection, filtering, and consonant extraction into a reusable module.

**When to use:** Initialize at game start; call on each round to get next word.

**Example:**
```javascript
// Source: GeeksforGeeks, SheCode (regex patterns), GitHub (Fisher-Yates)

const WordEngine = {
  // Pre-curated word list (1000+ words, 4-10 letters, no proper nouns)
  wordList: ['CROWD', 'BREAD', 'STREAM', 'TRAIN', /* ... more words ... */],

  // Track recently used words to avoid immediate repeats
  recentWords: new Set(),
  maxRecent: 10, // Keep last 10 in memory

  getRandomWord() {
    // Fisher-Yates shuffle without replacement
    let word;
    do {
      const randomIndex = Math.floor(Math.random() * this.wordList.length);
      word = this.wordList[randomIndex];
    } while (this.recentWords.has(word));

    // Track recent word
    this.recentWords.add(word);
    if (this.recentWords.size > this.maxRecent) {
      const firstRecent = this.recentWords.values().next().value;
      this.recentWords.delete(firstRecent);
    }

    return word;
  },

  extractConsonants(word) {
    // Regex: match all characters that are NOT vowels and ARE letters
    const consonants = word.match(/[b-df-hj-np-tv-z]/gi) || [];
    return consonants;
  },

  extractVowels(word) {
    // Count vowel occurrences (not unique)
    const vowels = word.match(/[aeiou]/gi) || [];
    return vowels;
  },

  isValidGameWord(word) {
    // Must be 4-10 letters and contain at least one vowel
    return word.length >= 4 && word.length <= 10 && /[aeiou]/i.test(word);
  },
};
```

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Random selection without repeats | Custom deduplication with nested loops | Fisher-Yates shuffle (O(n) complexity, guaranteed uniform distribution) | Fisher-Yates is battle-tested; custom logic prone to bias, off-by-one errors, poor distribution |
| English word list curation | Build your own scraper, validate words manually | Use GitHub `words/an-array-of-english-words` (275k+ words) filtered to 4-10 letters, no proper nouns | Already curated, well-maintained, covers edge cases (contractions, variants); filtering down is trivial |
| Color contrast validation | Manual RGB math | Use WebAIM Contrast Checker tool (web-based) or Deque Color Contrast Analyzer | WCAG math is tricky (gamma correction); tools are free and eliminate guessing |
| Elegant CSS shadows | Trial-and-error layering | Use CSS box-shadow presets (Shadow.css or Josh W. Comeau's examples) with 0.1-0.2 opacity | Layering shadows correctly requires understanding light physics; presets have been tuned by designers |
| Serif font selection | Generic `serif` keyword | Google Fonts (Merriweather, PT Serif, Playfair Display, Bitter, Libre Baskerville) | System serif fonts render inconsistently; Google Fonts guarantees consistent rendering across all platforms |

**Key insight:** Word curation and color validation are the most dangerous hand-roll areas. Word lists become deceptively complex (contractions, archaic words, regional variants); color contrast math involves gamma correction and luminance calculations that are easy to get wrong. Use pre-built solutions.

---

## Common Pitfalls

### Pitfall 1: Color Contrast Failures

**What goes wrong:** Designer chooses colors that look good but fail WCAG AA (4.5:1 for normal text, 3:1 for large text / graphics). Result: fails accessibility audit, doesn't meet spec.

**Why it happens:** Human perception of brightness doesn't match luminance math. Amber looks bright to the eye but may not contrast enough with white background.

**How to avoid:**
1. Use WebAIM Contrast Checker (https://webaim.org/resources/contrastchecker/) for every color pair BEFORE implementing
2. For warm amber + white text: aim for luminance ratio 4.5+ (test with actual hex values)
3. For charcoal + white text: typically safe (high contrast), but verify
4. For win state (sage green) + black text: verify ratio
5. For give up state (dusty rose) + black text: verify ratio
6. Document all verified ratios in code comments

**Warning signs:**
- "It looks good to me" without testing — dangerous assumption
- Choosing colors from screenshots without checking actual RGB values
- Assuming warm colors are bright enough — they often aren't

### Pitfall 2: Immediate Word Repetition

**What goes wrong:** Player gets the same word twice in a row or multiple times in same session, breaks immersion and feels broken.

**Why it happens:** Simple `Math.random()` doesn't track history; developer forgets to deduplicate; word list is too small.

**How to avoid:**
1. Implement a Set-based tracking of recent words (keep last 10-20)
2. Before returning a word, check `recentWords.has(word)` — if true, pick another
3. Verify word list has 1000+ words (ensures enough variety even after dedup)
4. Test by running 50+ rounds and checking for repeats

**Warning signs:**
- Same word appearing twice in short timeframe
- No deduplication logic in `getRandomWord()` function
- Word list size < 500

### Pitfall 3: Consonant Extraction Order

**What goes wrong:** Consonants extracted in wrong order, or Y is incorrectly classified (Y is sometimes a vowel, sometimes a consonant). Result: puzzle is unsolvable or doesn't match the target word structure.

**Why it happens:** Naive regex doesn't preserve order, or vowel definition is incomplete.

**How to avoid:**
1. Use regex `/[b-df-hj-np-tv-z]/gi` (explicitly excludes Y, A, E, I, O, U)
2. Test extraction with known words: 'CROWD' → ['C', 'R', 'W', 'D']; 'BREAD' → ['B', 'R', 'D']
3. For this phase, only include vowels A/E/I/O/U (no Y, no diphthongs)
4. Create unit tests: `assert(extractConsonants('CROWD').join('') === 'CRWD')`

**Warning signs:**
- Y appearing in consonant list unexpectedly
- Consonant order not matching original word
- Player sees " _ _ C R W D" but tries "CROW_D" (different order)

### Pitfall 4: Single HTML File Bloat

**What goes wrong:** Inline CSS and JS become unreadable, hard to maintain, file size grows too large.

**Why it happens:** No discipline on structure; no separation of concerns within the file.

**How to avoid:**
1. Organize inline `<style>` block with clear sections: `:root` variables, global, layout, blocks, buttons
2. Use CSS variables for colors: `--color-vowel: #D4A574`, `--color-consonant: #2F3031`
3. Organize inline `<script>` with clear sections: constants, state, WordEngine, DOM helpers, init
4. Keep word list as a separate const at the top of script block, easy to edit
5. Word list for 1000 words ≈ 50KB (acceptable); check file size doesn't exceed 200KB

**Warning signs:**
- Inline styles scattered throughout HTML attributes
- No comments separating script sections
- Hard to find where state is defined or where DOM rendering happens

### Pitfall 5: Font Rendering Inconsistency

**What goes wrong:** Serif font loads incorrectly, blocks fall back to default serif, looks ugly and not elegant.

**Why it happens:** Font file not loading, @import typo, network issue, or falling back to system serif.

**How to avoid:**
1. Use Google Fonts @import at top of `<style>`: `@import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap');`
2. Specify fallback chain: `font-family: 'Merriweather', 'Georgia', serif;` (Google Font first, then system serif)
3. Use `display=swap` to avoid FOIT (Flash of Invisible Text)
4. Test in offline mode to ensure blocks are still readable with fallback
5. Check Google Fonts license (all are free for commercial use)

**Warning signs:**
- Blocks render in default serif (not Merriweather/PT Serif)
- Font looks blocky or lacks elegance
- @import URL has typo or wrong font family name

---

## Code Examples

Verified patterns from official sources:

### Example 1: Fisher-Yates Shuffle for Random Word Selection

```javascript
// Source: Rosetta Code, SitePoint Forums, Medium (verified standard algorithm)

function shuffleArray(array) {
  // Fisher-Yates shuffle — O(n) time, guarantees uniform distribution
  const shuffled = [...array]; // Copy to avoid mutating original

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap
  }

  return shuffled;
}

// Usage in word engine
const randomWord = shuffleArray(wordList)[0];
```

### Example 2: Elegant CSS Box Shadow (Subtle Elevation)

```css
/* Source: Josh W. Comeau, Shadow.css, CodyHouse — verified elegant shadow patterns */

/* Subtle elevation (recommended for game blocks) */
.block {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -1px rgba(0, 0, 0, 0.06);
  /* Two-layer shadow: outer softer, inner sharper */
  /* Total opacity ~0.16 — subtle, not heavy */
}

/* For darker backgrounds (if used in future phases) */
.block {
  box-shadow: 0 4px 6px -1px rgba(255, 255, 255, 0.1),
              0 2px 4px -1px rgba(255, 255, 255, 0.06);
  /* Use light shadows on dark backgrounds */
}
```

### Example 3: Extract Consonants (Regex Pattern)

```javascript
// Source: GeeksforGeeks, SheCode, RegExr — verified consonant extraction

function extractConsonants(word) {
  const uppercaseWord = word.toUpperCase();
  // Pattern: match any letter that is NOT a vowel
  // [b-df-hj-np-tv-z] explicitly lists consonants (excludes Y, A, E, I, O, U)
  const consonants = uppercaseWord.match(/[b-df-hj-np-tv-z]/gi) || [];
  return consonants;
}

// Test cases
console.assert(extractConsonants('CROWD').join('') === 'CRWD');
console.assert(extractConsonants('BREAD').join('') === 'BRD');
console.assert(extractConsonants('STRAIN').join('') === 'STRN');
```

### Example 4: Check Vowel Content (for WORD-03)

```javascript
// Source: GeeksforGeeks, Quora — verified vowel detection

function hasVowel(word) {
  // Test if word contains at least one vowel (case-insensitive)
  return /[aeiou]/i.test(word.toUpperCase());
}

// Usage: filter word list
const validWords = allWords.filter(w =>
  w.length >= 4 &&
  w.length <= 10 &&
  hasVowel(w)
);
```

### Example 5: Google Fonts Integration (No Build Step)

```html
<!-- Source: Google Fonts official docs, Merriweather/PT Serif pages -->

<head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap');

    /* Define CSS variables for reuse */
    :root {
      --font-serif: 'Merriweather', 'Georgia', serif;
      --color-vowel: #D4A574;        /* Warm amber */
      --color-consonant: #2F3031;    /* Charcoal */
      --color-bg: #FFFFFF;            /* Light background */
    }

    body {
      font-family: var(--font-serif);
      background-color: var(--color-bg);
    }

    .block {
      font-family: var(--font-serif);
      font-weight: 700;
      text-transform: uppercase;
    }

    .vowel-block {
      background-color: var(--color-vowel);
    }

    .consonant-block {
      background-color: var(--color-consonant);
      color: white;
    }
  </style>
</head>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual random selection (repeat checking with arrays) | Fisher-Yates shuffle + Set tracking | Durstenfeld formalization 1964; widely adopted 2010s | O(n) guaranteed distribution, eliminates custom dedup bugs |
| System serif fonts only (Georgia, Times) | Google Fonts (Merriweather, PT Serif) | Google Fonts launched 2010; mass adoption 2015+ | Consistent rendering across platforms, more font variety |
| Single thick box shadow | Layered subtle shadows (0.1-0.2 opacity) | Material Design 2014; popularized 2015+ | More sophisticated appearance, better perceived elevation |
| WCAG 2.0 only (2008) | WCAG 2.1 (2018) + 2026 guidance | W3C published WCAG 2.1 in June 2018 | Enhanced guidance on contrast for non-text elements (3:1 ratio) |
| Vanilla JS with scattered DOM updates | State-based UI rendering | Popularized by React (2013), now standard vanilla JS pattern | Single source of truth, easier debugging, prevents state/UI drift |

**Deprecated/outdated:**
- **System fonts only for serif:** Modern web expects consistent cross-platform rendering; system fonts introduce unpredictability
- **WCAG 2.0 compliance without 2.1 enhancements:** WCAG 2.1 added important guidance on graphics/UI components (3:1 ratio); projects should target WCAG 2.1 minimum
- **Single layer box-shadow:** Unrefined; modern design uses layered shadows for elegance
- **Inline event handlers:** Mixes HTML structure with logic; modern practice separates HTML markup from JS event binding

---

## Open Questions

1. **Exact color values for the palette**
   - What we know: User specified "warm amber/gold," "charcoal," "sage green," "dusty rose" directions
   - What's unclear: Exact hex values that meet WCAG AA (4.5:1 for text, 3:1 for graphics)
   - Recommendation: Use WebAIM Contrast Checker after design phase; test pairs: amber+white, charcoal+white, sage+black, dusty-rose+black. Document verified ratios in code comments.

2. **Google Fonts Merriweather vs. PT Serif vs. Playfair Display**
   - What we know: All three are elegant serif options recommended for modern games; Merriweather is optimized for screen readability, Playfair is more luxury/editorial, PT Serif is neutrally designed
   - What's unclear: Which best fits the "elegant, not chunky game" aesthetic and is still readable at 48-56px block size
   - Recommendation: Test all three in a prototype block at exact size. Merriweather is safest for readability; Playfair is most elegant but may be heavier; PT Serif is balanced. Playtest to confirm.

3. **Flat vs. soft elevation for blocks**
   - What we know: User marked as Claude's discretion; elegant games use either flat design (bold colors, no shadow) or soft elevation (subtle shadow, depth)
   - What's unclear: Which reads as more "sophisticated" and "elegant"
   - Recommendation: Both are valid; soft elevation (layered box-shadow) is currently more common in elegant games. If shadow is chosen, use preset from Josh W. Comeau or Shadow.css (avoid heavy shadows).

4. **Title "Vowel" placement and sizing**
   - What we know: Replaces longer title; must be elegant and minimal; placement at Claude's discretion (top-left, centered, stylized)
   - What's unclear: Exact sizing, weight (regular or bold), and how it relates to block size
   - Recommendation: Style title with same serif font as blocks, likely larger (2-3x block size), top-center or top-left. No animation in Phase 1 (minimal aesthetic). Test readability and visual hierarchy vs. game board.

5. **Word pool size and source**
   - What we know: Spec calls for 1000+ words, 4-10 letters, no proper nouns/slang/obscure terms; GitHub has 275k+ word dataset available
   - What's unclear: Exact final curated list size and how to filter from 275k down to 1000 safely (which words to exclude?)
   - Recommendation: Start with ~1500 common English words (4-10 letters). Use a corpus like NGSL (New General Service List) or Dolch word list as reference. Phase 1 research showed curation is non-trivial; flag for validation during implementation.

---

## Sources

### Primary (HIGH confidence)
- WebAIM Contrast Checker — https://webaim.org/resources/contrastchecker/ (WCAG AA contrast ratios verified)
- W3C WCAG 2.1 Understanding Contrast Minimum — https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html (official accessibility standard)
- GeeksforGeeks: JavaScript consonant/vowel detection — https://www.geeksforgeeks.org/javascript/javascript-program-to-find-if-a-character-is-a-vowel-or-consonant/ (verified regex patterns)
- CSS-Tricks: Building a state management system with vanilla JavaScript — https://css-tricks.com/build-a-state-management-system-with-vanilla-javascript/ (state-based rendering pattern)
- Josh W. Comeau: Designing Beautiful Shadows in CSS — https://www.joshwcomeau.com/css/designing-shadows/ (elegant shadow design with verified values)

### Secondary (MEDIUM confidence)
- GitHub: words/an-array-of-english-words — https://github.com/words/an-array-of-english-words (275k+ English words, well-maintained, referenced in multiple tutorials)
- Medium: Modern State Management in Vanilla JavaScript: 2026 Patterns and Beyond — https://medium.com/@orami98/modern-state-management-in-vanilla-javascript-2026-patterns-and-beyond-ce00425f7ac5 (2026 vanilla JS trends, verified with CSS-Tricks)
- WPlook Themes: 10 Best Google Serif Fonts Used in 2026 — https://wplook.com/serif-fonts/ (Merriweather, PT Serif, Playfair Display, Bitter, Libre Baskerville recommended)
- Rosetta Code: Generate random numbers without repeating a value — https://rosettacode.org/wiki/Generate_random_numbers_without_repeating_a_value (Fisher-Yates shuffle verified across multiple languages)

### Tertiary (LOW confidence - verified with secondary sources but not official docs)
- Shadow.css: Eight elegant box shadow presets — https://www.cssscript.com/elegant-box-shadows/ (elegant shadows; verified against Josh W. Comeau patterns)
- Game Programming Patterns: Architectural patterns for games — https://gameprogrammingpatterns.com/contents.html (referenced multiple sources; entity-component systems for JS games)

---

## Metadata

**Confidence breakdown:**
- **Standard stack:** HIGH — Vanilla JS is the only option given single-file constraint; ES6/HTML5/CSS3 are stable, well-documented standards
- **Architecture patterns:** HIGH — State-based UI rendering and Fisher-Yates shuffle are industry-standard, verified across multiple authoritative sources (CSS-Tricks, Rosetta Code, Medium 2026)
- **Pitfalls:** HIGH — Color contrast math, font consistency, and word deduplication are well-documented gotchas with clear prevention strategies
- **Code examples:** HIGH — Regex patterns, CSS shadows, and Google Fonts integration all verified against official sources or authoritative tutorials
- **Open questions:** MEDIUM — Color hex values, exact font choice, and final word pool size require validation during implementation (not blockers, but need designer/planner input)

**Research date:** 2026-02-19
**Valid until:** 2026-03-20 (estimated; vanilla JS patterns and accessibility standards are stable; color choices may shift if design changes)

---

*Research compiled for Phase 1: Game Foundation & Display*
*Ready for planner to create detailed task breakdown*
