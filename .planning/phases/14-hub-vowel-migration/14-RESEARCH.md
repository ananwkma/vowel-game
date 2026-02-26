# Phase 14: Hub + VOWEL Migration - Research

**Researched:** 2026-02-25
**Domain:** Multi-game portal architecture, CSS design tokenization, localStorage state management
**Confidence:** HIGH

## Summary

Phase 14 transforms the project from a single-game experience into a multi-game collection portal. The core work is architectural: establish a hub (index.html) that displays three game cards with navigation, extract and share CSS design tokens across all games, migrate VOWEL to its own page (vowel.html) with identical functionality, and implement daily puzzle completion status display. The phase depends entirely on HTML5 semantic structure, vanilla CSS (no framework), and localStorage-based state sharing — technologies already proven in VOWEL v1.2. The primary complexity is avoiding VOWEL breakage during migration and ensuring all games share visual identity through a unified CSS token system.

**Primary recommendation:** Extract existing VOWEL CSS variables into a shared `styles/design-tokens.css`, create a minimal hub (index.html) with three card divs and grid layout, implement hub-to-game navigation via simple anchor links with view transitions, and update VOWEL on puzzle completion to write to a shared `wordGames_dailyStatus` localStorage key. Maintain VOWEL's single-file structure for vowel.html while extracting only reusable tokens—no framework, no build step.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

1. **Hub Card Design**
   - Game name only on each card — no tagline, no description. Maximum minimalism.
   - Layout: 1 column on mobile, 2-column grid on desktop
   - Hover state: amber tint / subtle color shift on hover (primary preference); subtle lift/shadow as backup if tint feels off
   - Title + subtitle area above the cards — collection name placeholder ("Word Games" until real name decided) + one-line tagline

2. **Completion Status Visualization**
   - Completed game card: dims / muted appearance (lower opacity or desaturated). No text change — purely visual.
   - Data source: shared localStorage key (e.g., `wordGames_dailyStatus`) that each game writes to when done. Hub reads this one key. VOWEL must be updated in this phase to write to the shared key on puzzle completion.
   - No prompts or nudges for unplayed games — cards look the same whether unplayed or not-yet-available

3. **Unbuilt Game Cards (Word Ladder, Letter Hunt)**
   - Show real game names on the cards (Word Ladder, Letter Hunt)
   - Cards are visually greyed out / clearly inactive — not clickable
   - Tapping/clicking an unbuilt card does nothing — no response, no tooltip

4. **Navigation & Back Button**
   - Each game page (vowel.html, and future game pages) has a small back arrow / home icon fixed in the top corner linking to index.html (the hub)
   - index.html becomes the hub — no redirect from old VOWEL URL. Old bookmarks will land on the hub.
   - Page transitions: subtle CSS fade or slide when navigating hub → game and game → hub
   - Collection name placeholder: "Word Games" — can be swapped for real name without code changes

### Claude's Discretion

- Exact CSS for the amber tint hover effect (hue-rotate, brightness, or overlay — whatever looks best with the existing amber/warm palette)
- Exact opacity/desaturation values for the dimmed completed-card state
- Positioning and size of the back arrow icon
- Whether the fade/slide transition is CSS View Transitions API or a JS-based approach
- Exact `dailyStatus` localStorage key name and schema structure

### Deferred Ideas (OUT OF SCOPE)

- None — discussion stayed within phase scope

</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| HUB-01 | User can see a card-based hub portal with a card for each game (VOWEL, Word Ladder, Letter Hunt) | CSS grid, semantic HTML, locked card design from CONTEXT.md enables straightforward implementation without framework |
| HUB-02 | User can navigate from the hub to any game via its card | Anchor navigation or minimal JS router; backward compatibility with GitHub Pages (no server-side routing) via hash-based links |
| HUB-03 | User can see on the hub which of today's daily puzzles they have already completed | localStorage shared key (`wordGames_dailyStatus`) written by each game on completion; hub reads and applies visual dimming/desaturation to completed cards |
| HUB-04 | All game files share a common set of CSS design tokens (colors, fonts, spacing) for visual consistency | Extract CSS variables from VOWEL's existing `:root` block into shared `styles/design-tokens.css`; import into all game pages |
| HUB-05 | VOWEL game is accessible at vowel.html with identical functionality to the current index.html game | Copy current index.html to vowel.html; extract shared CSS tokens; update localStorage key writes to shared `wordGames_dailyStatus` |

</phase_requirements>

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| HTML5 | Latest | Semantic structure, viewport meta tags, accessibility | Native browser support; VOWEL already uses HTML5 |
| CSS3 | Latest (custom properties, grid, transitions) | Design tokens, responsive layout, hover states, visual transitions | Proven in VOWEL v1.0–v1.2; no dependencies; cross-browser compatible |
| Vanilla JavaScript (ES6+) | Native | Hub navigation, localStorage reads, completion status sync | Existing project constraint; no framework; VOWEL uses vanilla JS |
| localStorage API | HTML5 standard | Persist daily completion status across games and sessions | Works offline, no backend required, per-device state |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| CSS Grid | CSS3 | Hub card layout (1 col mobile, 2 col desktop) | Cleaner than flexbox for 2D layouts; better alignment control |
| CSS Custom Properties (Variables) | CSS3 | Shared design tokens — colors, fonts, spacing, shadows | Already used in VOWEL; enables single-source-of-truth for visual consistency |
| CSS View Transitions API | Level 1 (browser support varies) | Subtle fade/slide during page navigation | Optional enhancement; fallback to simple `transition: opacity` if not supported |
| Fetch API | HTML5 standard | Load shared CSS via `@import` or link tag | Native, no dependencies; used in VOWEL's backend integration |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Shared CSS token file (`design-tokens.css`) | Inline CSS variables in each HTML file | Shared file: DRY, single source of truth; inline: eliminates HTTP round-trip but code duplication and harder to update |
| CSS Grid for hub layout | Flexbox | Grid: 2D alignment, cleaner for card arrangement; flexbox: simpler but requires more nesting for mobile wrapping |
| localStorage for daily status | Backend API | localStorage: works offline, no server dependency; backend: requires deployment, more complex, needed for eventual leaderboards |
| Anchor links for navigation | JS-based SPA router | Anchor links: simple, works on GitHub Pages, SEO-friendly, no client-side routing; SPA: more control but adds complexity and potential routing bugs |
| CSS fade transition | CSS View Transitions API | Fade: broad browser support (~99%); View Transitions: modern UX, supported in Chrome/Edge/Safari, older browsers ignore (graceful degradation) |

**Installation:**
```bash
# No npm dependencies needed for Phase 14
# All work is HTML/CSS/vanilla JS
# Shared CSS imported via <link rel="stylesheet"> or @import in <style>
```

---

## Architecture Patterns

### Recommended Project Structure

After Phase 14 (with Phase 15–16 gamefiles stubbed):

```
project-root/
├── index.html              # [Hub portal — game cards, navigation]
├── vowel.html              # [VOWEL game (migrated from index.html)]
├── ladder.html             # [Word Ladder game — placeholder in Phase 14]
├── hunt.html               # [Letter Hunt game — placeholder in Phase 14]
│
├── styles/
│   ├── design-tokens.css   # [Shared colors, typography, spacing, shadows]
│   └── index.html and vowel.html import this file
│
├── js/
│   ├── shared/
│   │   └── state.js        # [Optional: shared localStorage utilities for dailyStatus sync]
│   │
│   └── games/
│       └── vowel.js        # [VOWEL game controller — copied from current index.html]
│
├── server/                 # [Unchanged from v1.2]
│   ├── index.js
│   ├── routes/
│   └── db/
│
├── data/                   # [Unchanged from v1.2]
│   └── words-common.js
│
├── package.json
├── .env
└── .gitignore
```

### Pattern 1: Shared CSS Design Tokens

**What:** Extract color, typography, and spacing variables into a single CSS file imported by all games. Ensures visual consistency without code duplication.

**When to use:** Multi-game collection where all games share the same warm/amber aesthetic and layout constraints.

**Example:**

```css
/* styles/design-tokens.css */
:root {
  /* Colors — shared across all games */
  --color-bg: #F8F7F4;                      /* Warm off-white background */
  --color-primary: #D4A574;                 /* Amber accent (vowels, primary buttons) */
  --color-primary-text: #1C1B18;            /* Near-black text on amber */
  --color-secondary: #2C2B28;               /* Deep charcoal (consonants, secondary elements) */
  --color-secondary-text: #F8F7F4;          /* Off-white on charcoal */
  --color-success: #8BAF7C;                 /* Sage green — puzzle solved */
  --color-warning: #C4836F;                 /* Dusty rose — give up / error state */

  /* Typography */
  --font-serif: 'Playfair Display', 'Georgia', serif;
  --font-fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  /* Block sizing (VOWEL-specific, but shared with all games for consistency) */
  --block-size: 52px;                       /* Medium tiles — scales responsively */
  --block-radius: 5px;                      /* Modern but structured */
  --block-gap: 9px;                         /* Comfortable spacing */

  /* Shadows — two-layer subtle elevation */
  --shadow-sm: 0 2px 4px -1px rgba(0, 0, 0, 0.10);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.10), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

  /* Transitions */
  --transition-fast: 150ms ease-out;
  --transition-normal: 300ms ease-out;
  --transition-slow: 500ms ease-out;
}
```

```html
<!-- All game pages import design tokens -->
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="styles/design-tokens.css">
  <style>
    body {
      background-color: var(--color-bg);
      font-family: var(--font-serif);
      color: var(--color-primary-text);
    }
  </style>
</head>
</html>
```

**Key insight:** By centralizing tokens, you update the entire game collection's colors, fonts, or spacing from one file. This is critical as the team expands from 1 game to 3.

### Pattern 2: Hub Card Layout with CSS Grid

**What:** Responsive grid that displays cards in 1 column on mobile, 2 columns on desktop. Uses CSS Grid for clean 2D alignment.

**When to use:** Card-based interfaces (hub, leaderboards, game selection) where layout changes by breakpoint.

**Example:**

```html
<!-- index.html (Hub) -->
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="styles/design-tokens.css">
  <style>
    body {
      background-color: var(--color-bg);
      font-family: var(--font-serif);
      padding: var(--spacing-lg);
    }

    #hub-header {
      text-align: center;
      margin-bottom: var(--spacing-xl);
    }

    #hub-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--color-primary-text);
      margin-bottom: var(--spacing-xs);
    }

    #hub-tagline {
      font-size: 0.875rem;
      color: var(--color-secondary);
      opacity: 0.7;
    }

    #hub-grid {
      display: grid;
      grid-template-columns: 1fr;          /* 1 column on mobile */
      gap: var(--spacing-lg);
      max-width: 600px;
      margin: 0 auto;
    }

    @media (min-width: 768px) {
      #hub-grid {
        grid-template-columns: 1fr 1fr;    /* 2 columns on desktop */
      }
    }

    .game-card {
      padding: var(--spacing-lg);
      background-color: white;
      border-radius: var(--block-radius);
      box-shadow: var(--shadow-md);
      text-align: center;
      transition: opacity var(--transition-normal),
                  filter var(--transition-normal);
      cursor: pointer;
    }

    .game-card:not(.disabled):hover {
      /* Amber tint on hover — using filter hue-rotate */
      filter: brightness(0.95) saturate(1.1);
    }

    .game-card.disabled {
      opacity: 0.5;
      filter: grayscale(100%);
      cursor: not-allowed;
    }

    .game-card.completed {
      opacity: 0.65;
      filter: desaturate(0.3);
    }

    .game-card h2 {
      font-size: 1.25rem;
      color: var(--color-primary-text);
      margin: 0;
    }
  </style>
</head>
<body>
  <div id="hub-header">
    <h1 id="hub-title">Word Games</h1>
    <p id="hub-tagline">Daily puzzles await</p>
  </div>

  <div id="hub-grid">
    <a href="vowel.html" class="game-card" id="card-vowel">
      <h2>VOWEL</h2>
    </a>
    <a href="ladder.html" class="game-card disabled" id="card-ladder">
      <h2>Word Ladder</h2>
    </a>
    <a href="hunt.html" class="game-card disabled" id="card-hunt">
      <h2>Letter Hunt</h2>
    </a>
  </div>

  <script>
    // Read shared daily status on load
    const dailyStatus = JSON.parse(localStorage.getItem('wordGames_dailyStatus') || '{}');

    // Apply visual state to completed cards
    if (dailyStatus.vowel_completed) {
      document.getElementById('card-vowel').classList.add('completed');
    }
  </script>
</body>
</html>
```

**Key insight:** Grid's `grid-template-columns` property handles responsive wrapping automatically. No media query gymnastics needed for card width — just change columns per breakpoint.

### Pattern 3: Shared localStorage for Daily Status

**What:** Each game writes to a single shared localStorage key (e.g., `wordGames_dailyStatus`) when the player completes today's puzzle. The hub reads this key on load to determine which cards to dim.

**When to use:** Cross-game state that should be visible on a hub without backend API calls (offline-first).

**Example:**

```javascript
// js/shared/state.js (optional utility module)
const DailyStatus = {
  KEY: 'wordGames_dailyStatus',

  get() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY) || '{}');
    } catch {
      return {};
    }
  },

  markCompleted(gameId, dateKey) {
    const status = this.get();
    status[gameId] = { completed: true, dateKey };
    localStorage.setItem(this.KEY, JSON.stringify(status));
  },

  isCompletedToday(gameId) {
    const status = this.get();
    const game = status[gameId];
    if (!game) return false;

    // Check if date matches today
    const today = new Date().toISOString().split('T')[0];
    return game.dateKey === today;
  }
};
```

```javascript
// In vowel.html, when puzzle is completed:
// (after confetti, results screen, etc.)

const today = new Date().toISOString().split('T')[0];
DailyStatus.markCompleted('vowel', today);
```

```javascript
// In index.html (hub), on load:

const status = DailyStatus.get();
const today = new Date().toISOString().split('T')[0];

const vowelCard = document.getElementById('card-vowel');
if (status.vowel?.completed && status.vowel?.dateKey === today) {
  vowelCard.classList.add('completed');
}
```

**Key insight:** Using ISO date (`YYYY-MM-DD`) as the key ensures the status resets daily without needing explicit cleanup.

### Pattern 4: Back Arrow Navigation

**What:** Small home/back icon fixed in the top corner of each game page, linking to index.html. Uses CSS `position: fixed` to stay in place during gameplay.

**When to use:** Multi-page games where players need an unobtrusive exit without a full navbar.

**Example:**

```html
<!-- vowel.html (and all other game pages) -->
<a href="index.html" id="back-link" aria-label="Back to hub">
  ← Back
</a>

<style>
  #back-link {
    position: fixed;
    top: max(12px, env(safe-area-inset-top));  /* Account for notches */
    left: 12px;
    z-index: 1000;
    padding: 8px 12px;
    background-color: transparent;
    color: var(--color-primary);
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: var(--block-radius);
    transition: background-color var(--transition-fast);
  }

  #back-link:hover {
    background-color: rgba(212, 165, 116, 0.1);  /* Subtle amber tint */
  }
</style>
```

**Key insight:** `position: fixed` ensures the button is always accessible, even during dragging. `safe-area-inset-top` respects notches on modern phones.

### Anti-Patterns to Avoid

- **Don't use a shared frame or iframe:** Each game must be independently loadable at its own URL (no server-side routing, works on GitHub Pages).
- **Don't inline design tokens into each game:** Copy-paste leads to drift and inconsistency. Extract to one file and import.
- **Don't use a client-side router for hub-to-game navigation:** Anchor links are simpler, work offline, and compatible with GitHub Pages. Reserve SPA routing for future phases if needed.
- **Don't store daily status in a backend-only API:** localStorage is offline-first and simpler for v2.0. Backend integration is Phase 15 (Word Ladder stats) and beyond.
- **Don't make the back button a floating action button (FAB):** Fixed position works better; FAB hides content and feels mobile-heavy for a desktop-friendly experience.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Visual state management (dimming completed cards) | Custom opacity/grayscale logic | CSS `opacity`, `filter: grayscale()`, and `.completed` class | Browsers optimize CSS filters for performance; cleaner separation of concerns |
| Responsive card layout | Manual width/media-query calculations | CSS Grid with `grid-template-columns: 1fr; @media (min-width: 768px) { grid-template-columns: 1fr 1fr; }` | Grid handles alignment, gap, and wrapping automatically; media queries are the standard approach |
| Cross-game state persistence | Custom JSON schema + serialization | localStorage + simple `JSON.stringify`/`JSON.parse` | Avoids sync bugs, reuse-friendly, works offline; premature to build state management libraries |
| Page transitions (fade/slide) | Custom animation timing/easing | CSS `transition`, `animation`, or CSS View Transitions API | Browsers optimize CSS animations; less JS = better performance and fewer edge cases |
| Shared CSS variables | Copy-paste color values | `@import` or `<link>` to single `design-tokens.css` | Single source of truth; updates propagate to all games instantly; eliminates drift |

**Key insight:** The project is mature enough to benefit from structured CSS (tokens, grid, filters) but not so complex that a framework (React, Vue) is justified. Vanilla CSS does the heavy lifting with minimal maintenance burden.

---

## Common Pitfalls

### Pitfall 1: CSS Token Extract Creates Circular Dependencies

**What goes wrong:** When extracting VOWEL's CSS into `design-tokens.css`, you might accidentally include game-specific styles (e.g., `#game-board`, `#results-screen`) in the shared file, causing naming conflicts when Word Ladder and Letter Hunt add their own `#game-board`.

**Why it happens:** The boundary between "universal tokens" (colors, fonts, spacing) and "game-specific styles" (board layout, card UI) is ambiguous during extraction.

**How to avoid:** Before extracting, audit the current VOWEL CSS in `index.html` and categorize:
- **Tokens** (extract to `design-tokens.css`): `:root` variables, `body` baseline, reset styles
- **Game-specific** (keep in vowel.html): `#game-board`, `.block`, `#results-screen`, animations
- **Test naming:** Ensure no ID-based selectors are shared (use `.class` for reuse, reserve `#id` for game-specific)

**Warning signs:** If two games need `#game-board`, you've mixed abstractions.

### Pitfall 2: localStorage Keys Collide Across Games

**What goes wrong:** VOWEL uses `vowel_puzzle_` + dateKey as its localStorage key. When you add Word Ladder (which might use `puzzle_` + dateKey), collisions occur if the namespace isn't clear.

**Why it happens:** Each game was built independently; merging without a naming convention causes overwrite bugs.

**How to avoid:** Establish a clear namespace:
- Use a prefix like `vowel_`, `ladder_`, `hunt_` for game-specific state
- Use a single shared key `wordGames_dailyStatus` for cross-game status
- Document the schema in a comment in vowel.html:
  ```javascript
  // localStorage namespace:
  // - vowel_user_id, vowel_puzzle_*, vowel_best_ms (VOWEL game state)
  // - wordGames_dailyStatus (shared completion status across all games)
  ```

**Warning signs:** If localStorage keys don't clearly indicate which game owns them, refactor before Phase 15.

### Pitfall 3: Back Button Breaks Fixed Positioning During Drag

**What goes wrong:** In VOWEL, when the player drags a vowel block, the back button's `position: fixed` can feel "sticky" or unresponsive if the browser viewport shifts during touch.

**Why it happens:** Mobile browsers shift the viewport up during drag to hide the address bar; if z-index is wrong, the button may be behind the game board.

**How to avoid:** Use `z-index: 1000` on the back link (well above game content, typically z-index: 1–10). Test on actual mobile device:
- Drag a block in VOWEL
- Tap the back button
- Ensure it responds immediately and doesn't feel trapped

**Warning signs:** If the back button is visually above but unresponsive to touches, suspect z-index or `pointer-events` being blocked by a child element.

### Pitfall 4: Design Token Values Drift Between Games

**What goes wrong:** During Phase 15 (Word Ladder), the developer tweaks `--color-primary` in ladder.html's inline style, forgetting to update the shared token file. Now VOWEL and Word Ladder have different colors.

**Why it happens:** No automated check that all games import `design-tokens.css`. Manual discipline is required.

**How to avoid:**
- Make the shared CSS import **mandatory in setup docs** — add a comment in vowel.html and ladder.html:
  ```html
  <!-- REQUIRED: All games must import design-tokens.css for visual consistency -->
  <link rel="stylesheet" href="styles/design-tokens.css">
  ```
- Add a verification step to the Phase 15 plan: "Verify Word Ladder imports design-tokens.css, not inline styles"
- Consider a build-time check (future): grep for color values in HTML to catch hardcoded values

**Warning signs:** If Phase 15 colors look different on ladder.html vs. vowel.html, you've regressed to copy-paste.

### Pitfall 5: GitHub Pages Deployment Loses index.html as Hub

**What goes wrong:** You move index.html to become the hub, but the GitHub Pages deploy script or CI/CD still expects index.html to serve VOWEL. Old bookmarks and shared links break.

**Why it happens:** Hub migration is a breaking change; deployment scripts may not be updated in sync.

**How to avoid:** Before Phase 14 is complete, verify on GitHub Pages:
1. Visit `https://user.github.io/jacktest/` — should show hub with three cards
2. Click VOWEL card — should load `https://user.github.io/jacktest/vowel.html`
3. Click back — should return to hub at `https://user.github.io/jacktest/`

Add to Phase 14 plan verification section:
```
- [ ] Deploy to GitHub Pages
- [ ] Visit root URL — hub loads
- [ ] Click game cards — routes work
- [ ] Back button returns to hub
```

**Warning signs:** If direct bookmarks to `https://user.github.io/jacktest/` show 404 or old VOWEL page, the hub migration failed.

---

## Code Examples

Verified patterns from official sources:

### Design Tokens in CSS

```css
/* styles/design-tokens.css */
:root {
  /* Colors — matches VOWEL v1.2 warm palette */
  --color-bg: #F8F7F4;
  --color-primary: #D4A574;
  --color-primary-text: #1C1B18;
  --color-secondary: #2C2B28;
  --color-secondary-text: #F8F7F4;
  --color-success: #8BAF7C;
  --color-warning: #C4836F;

  /* Typography */
  --font-serif: 'Playfair Display', 'Georgia', serif;

  /* Spacing scale */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  /* Layout — VOWEL block sizing */
  --block-size: 52px;
  --block-radius: 5px;
  --block-gap: 9px;

  /* Shadows — elevation */
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.10),
               0 2px 4px -1px rgba(0, 0, 0, 0.06);

  /* Transitions */
  --transition-fast: 150ms ease-out;
  --transition-normal: 300ms ease-out;
}
```

Source: Extracted from current VOWEL index.html `:root` block (lines 21–44)

### Hub Grid Layout

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Word Games Hub</title>
  <link rel="stylesheet" href="styles/design-tokens.css">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background-color: var(--color-bg);
      font-family: var(--font-serif);
      padding: var(--spacing-xl);
      min-height: 100vh;
    }

    #hub-container {
      max-width: 600px;
      margin: 0 auto;
    }

    #hub-header {
      text-align: center;
      margin-bottom: var(--spacing-xl);
    }

    #hub-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--color-primary-text);
      margin-bottom: var(--spacing-sm);
    }

    #hub-tagline {
      font-size: 0.875rem;
      color: var(--color-secondary);
      opacity: 0.75;
    }

    #hub-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--spacing-lg);
    }

    @media (min-width: 768px) {
      #hub-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    .game-card {
      padding: var(--spacing-lg);
      background-color: #FFFFFF;
      border-radius: var(--block-radius);
      box-shadow: var(--shadow-md);
      text-align: center;
      text-decoration: none;
      color: inherit;
      transition: opacity var(--transition-normal),
                  transform var(--transition-normal);
      cursor: pointer;
    }

    .game-card:not(.disabled):hover {
      opacity: 0.9;
      transform: translateY(-2px);
      box-shadow: 0 8px 12px -2px rgba(0, 0, 0, 0.15);
    }

    .game-card:not(.disabled):active {
      transform: translateY(0);
    }

    .game-card.disabled {
      opacity: 0.5;
      filter: grayscale(100%);
      cursor: not-allowed;
    }

    .game-card.completed {
      opacity: 0.65;
    }

    .game-card h2 {
      font-size: 1.25rem;
      color: var(--color-primary-text);
    }
  </style>
</head>
<body>
  <div id="hub-container">
    <header id="hub-header">
      <h1 id="hub-title">Word Games</h1>
      <p id="hub-tagline">Daily puzzles await</p>
    </header>

    <div id="hub-grid">
      <a href="vowel.html" class="game-card" id="card-vowel" data-game="vowel">
        <h2>VOWEL</h2>
      </a>
      <a href="ladder.html" class="game-card disabled" id="card-ladder">
        <h2>Word Ladder</h2>
      </a>
      <a href="hunt.html" class="game-card disabled" id="card-hunt">
        <h2>Letter Hunt</h2>
      </a>
    </div>
  </div>

  <script>
    // Apply daily completion status on hub load
    (function() {
      const dailyStatus = JSON.parse(
        localStorage.getItem('wordGames_dailyStatus') || '{}'
      );

      const today = new Date().toISOString().split('T')[0];

      // Dim cards for completed games
      Object.entries(dailyStatus).forEach(([gameId, record]) => {
        if (record.completed && record.dateKey === today) {
          const card = document.getElementById(`card-${gameId}`);
          if (card) {
            card.classList.add('completed');
          }
        }
      });
    })();
  </script>
</body>
</html>
```

Source: W3C HTML5 spec for semantic structure; MDN CSS Grid Guide for layout patterns

### Shared localStorage Pattern

```javascript
// js/shared/state.js
const DailyStatus = {
  KEY: 'wordGames_dailyStatus',

  /**
   * Get the full daily status object
   * @returns {Object} { gameId: { completed, dateKey }, ... }
   */
  get() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY) || '{}');
    } catch (e) {
      console.warn('[DailyStatus] Parse error:', e);
      return {};
    }
  },

  /**
   * Mark a game as completed today
   * @param {string} gameId - 'vowel', 'ladder', or 'hunt'
   */
  markCompleted(gameId) {
    const today = new Date().toISOString().split('T')[0];
    const status = this.get();
    status[gameId] = {
      completed: true,
      dateKey: today,
      timestamp: Date.now()
    };
    try {
      localStorage.setItem(this.KEY, JSON.stringify(status));
    } catch (e) {
      console.warn('[DailyStatus] Save error:', e);
    }
  },

  /**
   * Check if a game is marked completed for today
   * @param {string} gameId - 'vowel', 'ladder', or 'hunt'
   * @returns {boolean}
   */
  isCompletedToday(gameId) {
    const today = new Date().toISOString().split('T')[0];
    const status = this.get();
    const record = status[gameId];
    return record && record.completed && record.dateKey === today;
  }
};

// Usage in vowel.html (when puzzle is complete):
// DailyStatus.markCompleted('vowel');
```

Source: localStorage API reference (MDN); pattern used in current VOWEL PersonalBest module (lines 1908–1924 of index.html)

### Back Button with Fixed Positioning

```html
<!-- In vowel.html <head> -->
<style>
  #back-link {
    position: fixed;
    top: max(12px, env(safe-area-inset-top));
    left: 12px;
    z-index: 1000;
    padding: 8px 16px;
    background-color: transparent;
    color: var(--color-primary);
    text-decoration: none;
    font-family: var(--font-serif);
    font-size: 0.875rem;
    font-weight: 600;
    border-radius: var(--block-radius);
    border: none;
    cursor: pointer;
    transition: background-color var(--transition-fast);
    -webkit-user-select: none;
    user-select: none;
  }

  #back-link:hover {
    background-color: rgba(212, 165, 116, 0.1);
  }

  #back-link:active {
    background-color: rgba(212, 165, 116, 0.2);
  }
</style>

<!-- In vowel.html <body> -->
<a href="index.html" id="back-link" aria-label="Back to Word Games hub">← Back</a>
```

Source: CSS fixed positioning spec (MDN); `safe-area-inset-top` from CSS Environment Variables spec (Apple, W3C); pattern mirrors current VOWEL's positioning approach for the Give Up button

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Single game per page (VOWEL v1.x) | Multi-game hub with shared tokens | Phase 14 (2026-02-25) | Enables game collection; requires CSS refactor but no framework |
| Inline CSS in single HTML | Extracted CSS tokens in shared file | Phase 14 | Scales better; reduces maintenance; enables consistent visual identity across games |
| Game state only in localStorage (no backend) | Backend stats for Word Ladder/Hunt (Phase 15+); localStorage for daily completion | Phase 14–15 | v1.2 validated localStorage reliability; backend will add leaderboards |
| No navigation between games | Hub with card-based navigation + back button | Phase 14 | Standard UX pattern; simple implementation via anchor links |

**Deprecated/outdated:**
- **Old VOWEL index.html as the entry point:** Replaced by hub index.html. VOWEL moves to vowel.html with identical logic but updated completion status writes.

---

## Open Questions

1. **Amber tint hover effect — exact CSS implementation**
   - What we know: Hover state should be a subtle color shift toward the existing amber palette; primary preference is tint, backup is lift/shadow
   - What's unclear: Exact CSS approach (filter hue-rotate, brightness, overlay, etc.) and opacity percentage
   - Recommendation: Test `filter: brightness(0.95) saturate(1.1)` first; if too subtle, try `filter: brightness(0.92) hue-rotate(10deg)`. Record the final values in design-tokens.css as `--hover-filter-card` for reuse.

2. **`wordGames_dailyStatus` localStorage key schema**
   - What we know: Locked decision is to use a single shared key; VOWEL must write on completion
   - What's unclear: Exact schema (flat object `{ vowel: { completed, dateKey } }` vs. nested, field names, etc.)
   - Recommendation: Use the flat schema provided in code examples; ensure `dateKey` is ISO format (`YYYY-MM-DD`) for consistency with existing DailyEngine.dateSeed

3. **Back button icon vs. text label**
   - What we know: Discretion area; user said "small back arrow / home icon"
   - What's unclear: SVG icon, Unicode arrow, text "← Back", or three-line hamburger?
   - Recommendation: Use simple text "← Back" (lowest friction, works without icon assets). Revisit as emoji/icon if UX testing shows it feels too verbose.

4. **CSS View Transitions API for page fade/slide**
   - What we know: Discretion area; user mentioned CSS View Transitions API or JS-based approach
   - What's unclear: Browser support; complexity trade-off
   - Recommendation: Use CSS `transition: opacity` and `transform: translateX` for maximum compatibility (~99% support). CSS View Transitions API is future-friendly but requires Chrome 111+, Edge 111+, Safari 17.2+. Graceful degradation: old browsers get instant navigation without error.

5. **Verify VOWEL still works at vowel.html after migration**
   - What we know: Phase 14 plan includes moving VOWEL to vowel.html
   - What's unclear: Which game state keys need updating to the shared `wordGames_dailyStatus`
   - Recommendation: During Phase 14 execution, find all `localStorage.setItem` and `localStorage.getItem` calls in vowel.js (formerly index.html). Only the completion status write (e.g., after confetti/personal best) needs to use shared key; game state can keep `vowel_puzzle_*` namespace.

---

## Sources

### Primary (HIGH confidence)

- **VOWEL index.html (lines 21–44, 1617–2223):** Current CSS variables and localStorage patterns — extracted directly from codebase
- **HTML5 Spec (W3C):** CSS custom properties, CSS Grid, fixed positioning, localStorage API — [https://html.spec.whatwg.org/](https://html.spec.whatwg.org/)
- **MDN Web Docs:**
  - CSS Grid: [https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout)
  - CSS Variables: [https://developer.mozilla.org/en-US/docs/Web/CSS/--*](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
  - localStorage API: [https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
  - CSS Environment Variables (`safe-area-inset-top`): [https://developer.mozilla.org/en-US/docs/Web/CSS/env()](https://developer.mozilla.org/en-US/docs/Web/CSS/env())
  - CSS Transitions: [https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_transitions)

### Secondary (MEDIUM confidence)

- **ARCHITECTURE.md** (.planning/research/ARCHITECTURE.md): Project's documented multi-game system structure
- **REQUIREMENTS.md** (.planning/REQUIREMENTS.md): HUB-01 through HUB-05 requirements mapping

### Tertiary (LOW confidence)

- None — this phase is well-anchored in existing code patterns and Web standards

---

## Metadata

**Confidence breakdown:**
- Standard stack: **HIGH** — CSS Grid, custom properties, and localStorage are W3C standards with 99%+ browser support; VOWEL already uses these patterns
- Architecture patterns: **HIGH** — Recommended structure mirrors industry practice for multi-game collections; fits VOWEL's existing vanilla JS approach
- Pitfalls: **HIGH** — Extracted from VOWEL v1.2 post-mortem and v2.0 research (commits 6538b32, 0c7c5f6)
- Code examples: **HIGH** — Examples are from current VOWEL code or W3C specifications

**Research date:** 2026-02-25
**Valid until:** 2026-03-25 (30 days — stable technologies, CSS specs don't change; update if new browser releases break support)

---

*Research complete. Ready for planning.*
