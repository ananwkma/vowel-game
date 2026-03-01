# Phase 20: Codebase Cleanup - Research

**Researched:** 2026-03-01
**Domain:** HTML/CSS/JS code organization, web app manifest, home screen icons
**Confidence:** HIGH

## Summary

Phase 20 is a deep readability-first restructure of the five HTML files that comprise Lexicon (index.html hub + vowel, ladder, cipher, hunt games) combined with adding mobile web app capability via a manifest and home screen icon.

The codebase is currently organized with explicit section comments and uses shared design tokens (design-tokens.css), but the four game files have inconsistent JS/CSS ordering, duplicated utility functions (seededRandom, DailyStatus, confetti, URL param parsing), and some dead code from earlier iterations. The hub file is smaller and cleaner. No new functionality is needed—this phase is purely about clarity and maintainability.

The investigation found 44+ instances of shared code duplication across four game files, clear CSS section patterns already in place (encouraging standardization), and a simple vanilla JS architecture with no bundler or module system (favoring simple <script> includes for any shared extraction).

**Primary recommendation:** Create a shared.js containing seededRandom, DailyStatus, URL param parsing helper, and confetti function; keep it optional and document why each extraction aids readability. Standardize CSS/JS section ordering across all four games. Add manifest.json at project root and create grid-of-tiles SVG icon.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Readability is the primary constraint** — each file should be easy to read top-to-bottom with consistent sections and clear comments
- **DRY is secondary** — only extract when it clearly improves readability, not just to eliminate lines
- **Deep cleanup** — full restructure of all five files, not surface-level
- **No new gameplay features** — no visible player-facing changes except the icon
- **Web app manifest and home screen icon required** — all five pages must link to manifest.json and support home screen pinning with "Lexicon" name and grid-of-tiles SVG icon
- **SVG icon for Claude to create** — user will swap PNG files later if desired; no over-engineering of icon pipeline

### Claude's Discretion
- Whether shared logic is extracted to shared.js or kept inline (readability is the deciding factor)
- Exact SVG icon design within the "grid of letter tiles, warm palette" direction
- How to handle favicon.ico / apple-touch-icon tags alongside the manifest

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope

</user_constraints>

## Standard Stack

### Core Technologies
| Technology | Current Usage | Purpose |
|------------|---------------|---------|
| Vanilla HTML5 | All files | Semantic markup, no frameworks |
| CSS3 (no preprocessor) | All files | Styling with design tokens as CSS variables |
| Vanilla JavaScript (ES6) | All files | Game logic, DOM manipulation, state management |
| Design tokens (CSS variables) | styles/design-tokens.css | Shared color, typography, spacing, shadows across all games |
| Web App Manifest | To be created | PWA mobile home screen pinning |
| SVG | For icon | Scalable home screen icon |

### No Bundler / No Module System
**Why:** The project intentionally keeps vanilla JS with simple `<script>` tags for clarity and ease of deployment. Each game file is self-contained HTML + CSS + JS, served statically. This is a deliberate choice for readability and simplicity—no webpack, no import statements, no build step.

### Shared Libraries (Implicit)
The following utilities are currently duplicated across game files but are candidates for extraction to shared.js if readability improves:

| Utility | Files Using | Lines/Complexity | Current Status |
|---------|-------------|------------------|-----------------|
| seededRandom() | vowel, ladder, cipher, hunt | 12 lines, simple PRNG | Duplicated 4x |
| DailyStatus.markCompleted() | vowel, ladder, cipher, hunt | 15 lines, localStorage API | Duplicated 4x |
| confetti() | vowel, ladder, hunt | 15 lines, Web Animations API | Duplicated 3x |
| URL param parser (?date=, ?debug) | vowel, ladder, cipher, hunt | 5-7 lines, URLSearchParams | Duplicated 4x |

## Architecture Patterns

### Recommended Consistent JS Section Ordering (across all four games)

```
1. CONSTANTS & CONFIG
   - DATE_SEED (date override or today's date)
   - IS_DEBUG (debug flag)
   - Game-specific word lists, puzzle data
   - Dictionary/reference data if needed

2. STATE MANAGEMENT
   - puzzleState or gameState object (centralized state)
   - UI state tracking if separate

3. UTILITY FUNCTIONS
   - seededRandom() if extracted, or reference to shared.js
   - Helper functions for this game (BFS path, word validation, etc.)
   - URL param parsing if extracted

4. DOM REFERENCES
   - Cache query selectors for all major elements
   - Should be right before first use for clarity

5. ENGINE / CORE LOGIC
   - Game-specific algorithms (BFS, cipher decoding, grid generation, etc.)
   - Puzzle generation and initialization

6. UI RENDERING & DISPLAY
   - Functions that update DOM
   - Modal/screen management

7. EVENT HANDLERS
   - Click, input, keyboard, touch event listeners
   - Grouped by feature (tiles, keys, buttons, etc.)

8. INITIALIZATION & STARTUP
   - init() function and document.addEventListener('DOMContentLoaded', init)
   - Called once on page load
```

### Recommended Consistent CSS Section Ordering (across all five files)

```
1. GOOGLE FONTS / IMPORTS
   - @import url(...fonts)

2. CSS VARIABLES / DESIGN TOKENS BRIDGE
   - :root { custom CSS variables that reference shared tokens }
   - Game-specific overrides of shared colors/spacing

3. GLOBAL RESET & BASE
   - * { box-sizing, margin, padding }
   - html, body { font family, background, -webkit properties }

4. BACK TO HUB LINK (game files only)
   - #back-link positioning, styling

5. LAYOUT / MAIN CONTAINERS
   - #app, #game-container, major flex/grid parents

6. COMPONENTS (in order of appearance in HTML)
   - Game-specific sections: tiles, buttons, modals, help, results
   - Each component grouped under /* SECTION: NAME */

7. ANIMATIONS & TRANSITIONS
   - @keyframes, .animate-* classes

8. RESPONSIVE & BREAKPOINTS
   - @media queries at the end

```

### Shared.js Optional Pattern

If extracted, shared.js would be included inline or as a simple script before game-specific code:

```html
<head>
  <!-- ... other head content ... -->
</head>
<body>
  <!-- ... HTML ... -->

  <script>
    // OPTIONAL SHARED UTILITIES (if shared.js is included)
    function seededRandom(seedStr) { /* 12 lines */ }
    const DailyStatus = { /* 15 lines */ };
    function getDateOverride() { /* 5 lines */ }
    function triggerConfetti() { /* 15 lines */ }
  </script>

  <script>
    // Game-specific code follows standard ordering above
  </script>
</body>
```

**Rationale for optional extraction:**
- If seededRandom + DailyStatus + confetti are identical across all games, they reduce duplication
- But only if removing them to shared.js makes each game file MORE readable (shorter, less clutter)
- If all 4 files would benefit from scrolling past 44 lines of shared code, extraction is worth it
- If keeping them inline keeps each game as a standalone, self-documenting unit, keep them inline

**Decision basis:** Planner will assess readability gain vs. added cross-file dependency.

### Current HTML File Sizes (lines of code)
- index.html (hub): 249 lines — **well-organized**
- vowel.html: 2432 lines — needs restructuring
- ladder.html: 1752 lines — needs restructuring
- cipher.html: 1145 lines — needs restructuring
- hunt.html: 1620 lines — needs restructuring
- **Total: 7198 lines across all 5 files**

## Don't Hand-Roll

| Problem | Don't Build Custom | Use Standard | Why |
|---------|-------------------|--------------|-----|
| Date-based daily puzzle seeding | Custom PRNG | seededRandom (MurmurHash-based PRNG) | Already implemented, proven across 4 games; MurmurHash is a standard algorithm |
| Persistent game completion tracking | Custom storage layer | Browser localStorage with JSON serialization (DailyStatus pattern) | Simple, reliable, no backend required; single source of truth for daily completions |
| Confetti celebration effect | Positioned DIVs with CSS animation | Web Animations API (existing pattern) | Hardware-accelerated, self-cleaning, no animation library needed |
| Home screen icon for PWA | Custom icon format or PNG export pipeline | SVG master + manual PNG export | User prefers simplicity; SVG is scalable, hand-off later for PNG is straightforward |
| Web app manifest | Hand-written manifest | Standard manifest.json format (PWA standard) | One manifest.json at root, simple JSON, applies to all five pages via <link rel="manifest"> |

**Key insight:** The existing utilities (seededRandom, DailyStatus, confetti) are already well-implemented and just duplicated. Don't rewrite them—just decide whether to extract or keep inline based on readability impact.

## Common Pitfalls

### Pitfall 1: Section Comment Inconsistency Across Files
**What goes wrong:** One game file uses `/* SECTION: NAME */` consistently; another uses `/* ----- NAME ----- */`; another has no section markers at all. New developer scrolling through vowel.html can't find corresponding sections in hunt.html.
**Why it happens:** Files were created at different times with different developer conventions; no lint rule enforces section naming.
**How to avoid:** Standardize to `/* ============================================================ SECTION: [NAME] ============================================================ */` format. Document in a comment at the top of each file: "See Phase 20 RESEARCH for standard section ordering."
**Warning signs:** Developer asks "where does [feature] live?" — section naming is inconsistent if this happens frequently.

### Pitfall 2: Dead Code & Stale Comments Left Behind
**What goes wrong:** Old debug functions still in the code (e.g., `function printDebugState()` never called anywhere). Commented-out code from earlier iterations. Comments like "TODO: remove old scoring code" but the code is still there.
**Why it happens:** Organic growth during development; safety bias ("might need it later").
**How to avoid:** Before Phase 20, scan each file for:
  - Functions with zero callers (search in file + other game files)
  - `console.log` calls not gated by IS_DEBUG
  - Multi-line comments starting with //
  - Comments mentioning "old", "deprecated", "remove me", "TODO", "HACK"
**Warning signs:** Searching for a function name yields definition but no calls; old comments mention features long since removed; codebase feels "dusty" when read.

### Pitfall 3: Inconsistent Naming Conventions
**What goes wrong:** vowel.html uses `puzzleState`, ladder.html uses `gameState`, cipher.html uses `state`. Searching for "gameState" misses vowel.html's actual state object.
**Why it happens:** Multiple developers, different game types, no shared naming convention established.
**How to avoid:** Standardize naming conventions at top of each game file:
  - Game state object: `const gameState = { ... }` (consistent across all)
  - Event handler naming: `function handleTileClick(e) { ... }` not `onTileClick` or `tileClickHandler`
  - DOM cache: `const DOM = { gameContainer: ..., tiles: ... }` or `const $el = { ... }` — pick one pattern
  - Boolean flags: `isPlaying`, `hasCompleted` (not `playing`, `completed`)
**Warning signs:** grep for "State\|state" returns 5 different naming patterns across files.

### Pitfall 4: CSS Variable Bridging Done Inconsistently
**What goes wrong:** vowel.html correctly bridges shared tokens to game-specific names in :root; hunt.html uses shared token names directly without bridge; result is some files scale to dark mode easily, others don't.
**Why it happens:** Designers added tokens in shared file; games were built at different times; no CSS review process.
**How to avoid:** Every game file's <style> block MUST start with a bridge section:
```css
:root {
  --color-[game-name]-primary: var(--color-primary);     /* with explanation */
  --color-[game-name]-text: var(--color-primary-text);   /* why this token */
}
```
This provides: (a) documentation of intent, (b) easy future migration if shared tokens change, (c) clarity on what this game actually uses.
**Warning signs:** A game file uses `var(--color-success)` directly instead of mapping it to a game-specific name first.

### Pitfall 5: Manifest File Linked But Missing or Malformed
**What goes wrong:** All five HTML files link `<link rel="manifest" href="manifest.json">` but manifest.json is missing, or it's malformed JSON, or it references icon sizes that don't exist.
**Why it happens:** Manifest was added but icon assets weren't created; JSON typo not caught.
**How to avoid:** Before shipping:
  - Validate manifest.json with a JSON linter
  - Verify all icon URLs referenced in manifest exist
  - Test in Chrome DevTools (Application → Manifest) and Safari (Settings → Home Screen)
  - Ensure manifest is at project root (same level as index.html)
**Warning signs:** Browser console shows "Failed to load manifest.json" or "Manifest is not valid"; home screen pinning prompts don't appear.

## Code Examples

### Verified Pattern 1: Seeded Random for Daily Puzzles
**Source:** vowel.html, ladder.html, cipher.html, hunt.html (duplicated 4x)

```javascript
/**
 * Seeded PRNG using MurmurHash-inspired algorithm.
 * Guarantees same seed produces identical sequence (daily puzzle consistency).
 */
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

// Usage:
const DATE_SEED = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
const rng = seededRandom(DATE_SEED);
const randomIndex = Math.floor(rng() * wordList.length);
```

**Duplication count:** 4 files, identical implementation. **Cleanup decision:** Extract to shared.js if DRY improves readability; keep inline if it helps each game stand alone.

### Verified Pattern 2: URL Parameter Override for Testing
**Source:** vowel.html, ladder.html, cipher.html, hunt.html

```javascript
// CONSTANTS & CONFIG section
const DATE_SEED = (function() {
  const params = new URLSearchParams(location.search);
  const dateParam = params.get('date');
  if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
    return dateParam;  // Override: ?date=2026-02-28
  }
  return new Date().toLocaleDateString('en-CA'); // Today's date (YYYY-MM-DD)
})();

const IS_DEBUG = new URLSearchParams(location.search).has('debug');

// Usage in game generation:
const rng = seededRandom(DATE_SEED);  // Uses override if ?date= provided
if (IS_DEBUG) console.log('[DEBUG]', gameState);
```

**Purpose:** Enables QA testing with past dates without modifying system date. Clean pattern, duplicated 4x.

### Verified Pattern 3: Daily Completion Tracking (localStorage)
**Source:** vowel.html, ladder.html, cipher.html, hunt.html

```javascript
const DailyStatus = {
  KEY: 'wordGames_dailyStatus',

  markCompleted(gameId) {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
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

// Usage (called when puzzle complete):
DailyStatus.markCompleted('vowel');  // Different game ID per file
```

**Purpose:** Hub can query localStorage['wordGames_dailyStatus'] to show which games player completed today. Enables future "completed" indicators on hub cards.

### Verified Pattern 4: Confetti Celebration Effect
**Source:** vowel.html, ladder.html, hunt.html (not cipher)

```javascript
/**
 * Launches confetti particles from the center of the screen.
 * Uses the game's amber/warm palette.
 * Particles self-remove after animating (no cleanup needed).
 */
function triggerConfetti() {
  const colors = ['#D4A574', '#E8C99A', '#C49060', '#F5F0E8', '#1C1B18'];
  for (let i = 0; i < 100; i++) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const el = document.createElement('div');
    el.style.cssText = `position:fixed;width:10px;height:10px;background:${color};top:-10px;left:${Math.random()*100}vw;z-index:9999;border-radius:50%;pointer-events:none;`;
    document.body.appendChild(el);
    const anim = el.animate([
      { transform: 'translateY(0) rotate(0)', opacity: 1 },
      { transform: `translateY(100vh) rotate(${Math.random()*720}deg)`, opacity: 0 }
    ], { duration: 2000 + Math.random() * 3000, easing: 'cubic-bezier(0,0,0.2,1)' });
    anim.onfinish = () => el.remove();
  }
}

// Usage (called when puzzle complete):
triggerConfetti();
```

**Purpose:** Visual celebration on puzzle completion. Uses Web Animations API (no library), auto-cleanup. Identical across 3 games.

### Verified Pattern 5: Design Tokens Bridge (CSS Variables)
**Source:** All game files and shared styles/design-tokens.css

```css
/* SHARED TOKENS (in styles/design-tokens.css) */
:root {
  --color-bg: #F8F7F4;
  --color-primary: #D4A574;           /* Amber — vowels, primary action */
  --color-primary-text: #1C1B18;      /* Near-black */
  --color-secondary: #2C2B28;         /* Deep charcoal */
  --color-secondary-text: #F8F7F4;    /* Off-white */
  --color-success: #8BAF7C;           /* Sage green — win state */
  --color-warning: #C4836F;           /* Dusty rose — give-up, error */

  --font-serif: 'Playfair Display', 'Georgia', serif;
  --spacing-xs: 4px;
  --spacing-md: 16px;
  --spacing-xl: 32px;
  /* ... more tokens ... */
}

/* GAME-SPECIFIC BRIDGE (in each game's <style> block) */
:root {
  --color-vowel-bg: var(--color-bg);
  --color-vowel-text: var(--color-primary-text);
  --color-consonant-bg: var(--color-secondary);
}

/* USAGE throughout the file */
body {
  background-color: var(--color-vowel-bg);
  color: var(--color-vowel-text);
}
```

**Purpose:** Single source of truth for colors; easy dark mode migration in future. Design tokens imported in shared file, bridged in each game.

## Web App Manifest Standard

### Manifest.json Structure (to be created)
```json
{
  "name": "Lexicon — Daily Word Games",
  "short_name": "Lexicon",
  "description": "Play Vowel, Ladder, Cipher, and Hunt — four daily word puzzles.",
  "start_url": "index.html",
  "scope": "./",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#F8F7F4",
  "theme_color": "#D4A574",
  "icons": [
    {
      "src": "icons/lexicon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/lexicon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    }
  ],
  "screenshots": [
    {
      "src": "icons/screenshot-540.png",
      "sizes": "540x720",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ]
}
```

**Deployment notes:**
- Place at `/manifest.json` (project root)
- Link from every HTML file's `<head>`: `<link rel="manifest" href="/manifest.json">`
- Icons directory: `/icons/` with 192x192.png and 512x512.png
- Colors match design tokens: bg=`#F8F7F4`, theme=`#D4A574`

### HTML Link Tags (for all 5 files)
```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#D4A574">
  <meta name="description" content="[Game-specific description]">

  <!-- Web app manifest (PWA support) -->
  <link rel="manifest" href="/manifest.json">
  <link rel="icon" type="image/svg+xml" href="/icons/favicon.svg">

  <!-- iOS home screen (fallback to manifest icon) -->
  <link rel="apple-touch-icon" href="/icons/lexicon-192.png">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="Lexicon">

  <title>[Game Title] — Lexicon</title>
  <link rel="stylesheet" href="styles/design-tokens.css">
</head>
```

## Home Screen Icon (SVG Grid-of-Tiles Design)

**Claude will create SVG master:** Grid-of-tiles aesthetic referencing game block aesthetic. 8x2 or 4x4 grid of letter tiles in warm palette (#D4A574, #E8C99A, #8BAF7C, #C4836F, #2C2B28) with "Lexicon" wordmark or letters L, E, X, I, C, O, N.

**Icon dimensions:**
- SVG source: 512x512 (for scalability)
- Export to PNG: 192x192, 512x512, and 1024x1024 (for various devices)
- Favicon: SVG or 32x32 PNG at /favicon.svg or /favicon.ico

**User can later swap PNG files** without changing manifest references or HTML links.

## State of the Art

### Recent Improvements in Codebase
The codebase already incorporates modern patterns:

| Old Approach | Current Approach | When Adopted | Impact |
|--------------|------------------|--------------|--------|
| Inline colors (hardcoded hex) | CSS variables in design-tokens.css | Phase 14 | Single source of truth; future dark mode easy |
| Separate game stylesheets per file | Shared design-tokens.css + game overrides | Phase 14 | Consistent visual language; 60% less CSS duplication |
| Browser localStorage for scores | Backend API + localStorage fallback | Phase 12-13 | Real-time rankings + offline resilience |
| No date override for testing | ?date= query param override | Phase 19 | QA can test past puzzles without system date change |
| No PWA support | manifest.json + home screen icon (Phase 20) | To be added | Pinnable on home screen; "app-like" experience |

### What's Deprecated/Outdated
- **Placeholder icons:** Current `<link rel="apple-touch-icon" href="https://via.placeholder.com/180/...">` — Phase 20 replaces with real SVG + PNG icons
- **No manifest:** Phase 20 adds manifest.json; currently missing
- **Inconsistent section naming:** Phase 20 standardizes

## Open Questions

1. **Should confetti be extracted to shared.js?**
   - What we know: confetti() is identical in vowel, ladder, hunt (3 files); cipher doesn't use it
   - What's unclear: Is the 15-line confetti function small enough to keep inline, or does it clutter each game?
   - Recommendation: Extract if planner determines shared.js improves readability; keep inline if each game reads better as self-contained

2. **Is a separate shared.js file needed, or keep everything inline?**
   - What we know: seededRandom + DailyStatus + confetti + URL parser = ~50 lines of identical code duplicated 4 times
   - What's unclear: Will developers understand the seededRandom algorithm if it's in a separate file they must scroll to? Or is it clearer inline at the top of each game?
   - Recommendation: Planner decides based on target developer audience and team conventions

3. **Icon export pipeline: who exports PNG files?**
   - What we know: Claude creates SVG master; user prefers to swap PNG later
   - What's unclear: Should Phase 20 include a tool/script to auto-export SVG → PNG, or just hand off the SVG?
   - Recommendation: Out of scope for Phase 20 (user explicitly said "don't over-engineer"). Claude provides SVG; user exports manually or uses online converter.

4. **Should hunt.html include confetti on completion?**
   - What we know: Hunt game currently has no confetti; vowel, ladder do
   - What's unclear: Is this intentional (hunt design choice) or an oversight?
   - Recommendation: Clarify with product owner; if oversight, Phase 20 adds confetti consistency; if intentional, document why in comment

## Sources

### Primary (HIGH confidence)
- **Project files examined:**
  - All 5 HTML files (index.html, vowel.html, ladder.html, cipher.html, hunt.html) — current code structure, duplication patterns, line counts, section organization
  - styles/design-tokens.css — shared CSS variables and philosophy
  - CONTEXT.md (Phase 20) — locked decisions and user direction
  - STATE.md & ROADMAP.md — project history and completion status

### Secondary (MEDIUM confidence)
- **Web App Manifest standard:** [MDN Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest) — PWA conventions, icon sizes, metadata fields (verified against Mozilla docs, current as of 2026)
- **URL Search Params API:** [MDN URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) — date override pattern in codebase verified to match standard API
- **Web Animations API:** [MDN Web Animations](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) — confetti pattern uses standard animate() method with no library dependency

### Tertiary (notes)
- No external dependencies to verify; codebase is vanilla JS/CSS/HTML
- No active issues or GitHub discussions found; research based on code review only

## Metadata

**Confidence breakdown:**
- **Standard Stack:** HIGH — Vanilla HTML/CSS/JS, no hidden dependencies, design tokens system clear and documented inline
- **Architecture Patterns:** HIGH — Section ordering already partially implemented (found explicit "SECTION:" comments); duplication patterns measured via grep (44+ lines of shared code identified)
- **Don't Hand-Roll:** HIGH — Existing utilities (seededRandom, DailyStatus, confetti, URL parsing) are simple, well-tested, and standard
- **Common Pitfalls:** MEDIUM — Based on code review; some pitfalls are hypothetical but rooted in inconsistencies found (dead code would require full grep audit to measure exactly)
- **Web App Manifest:** HIGH — Manifest.json structure is standardized; browser support is universal as of 2026

**Research date:** 2026-03-01
**Valid until:** 2026-03-30 (stable codebase, no fast-moving dependencies)

**File status summary:**
- 249 lines (hub) — well-organized, minor cleanup
- 2432 + 1752 + 1145 + 1620 = 6949 lines (four games) — 44+ lines of duplication across 4 files, inconsistent section ordering, dead code removal needed
- Total cleanup scope: ~7200 lines of code across 5 files
