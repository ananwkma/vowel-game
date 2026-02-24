# Phase 5: Mobile Optimization - Research

**Researched:** 2026-02-23
**Domain:** Mobile browser behavior suppression, responsive layout, touch UX
**Confidence:** HIGH

## Summary

Mobile optimization for this word puzzle game requires suppressing unwanted browser behaviors (text selection, tap flash, double-tap zoom, iOS callouts), fixing word wrapping to a single line, implementing responsive block sizing that scales with viewport, locking page scroll during gameplay, and ensuring the Give Up button is always accessible. The game has no external dependencies and uses CSS + vanilla JS, so all solutions use standard browser APIs and CSS properties. Key decisions are locked per CONTEXT.md; research confirms these approaches are well-established, cross-browser compatible, and have no performance pitfalls.

**Primary recommendation:** Implement suppression via global CSS rules (body + specific selectors), use `white-space: nowrap` on word container with max-width constraint, size blocks responsively using CSS viewport units (dvh for height accounting, fixed px or percentage for width), apply `overflow: hidden` to body to lock scroll, and use `position: fixed` or `sticky` for Give Up button with `bottom: 0` and appropriate z-index.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

1. **Unwanted Touch Behaviors** — Suppress globally on the entire page (not just blocks):
   - Remove text selection highlighting (no text is worth selecting)
   - Suppress iOS long-press loupe and callouts (`-webkit-touch-callout: none`)
   - Remove iOS tap-flash highlight (`-webkit-tap-highlight-color: transparent`)
   - Disable double-tap zoom (prevents accidental zoom during rapid block tapping)

2. **Word Layout — Single Line Constraint**
   - Words must fit on a single line (no two-line wrapping)
   - Maximum word length: 7 letters (may reduce to 6 after testing)
   - Blocks sized to fit 7-letter word comfortably on ~375px-wide screen (standard iPhone width)

3. **Block & Picker Sizing**
   - Claude picks exact block size optimized for 7-letter words on 375px screen with comfortable touch targets
   - Block size is **responsive** — shrinks on mobile, expands on desktop (not mobile-only)
   - Vowel picker scales **proportionally with blocks** — same responsive scaling, no separate mobile boost
   - Blocks and picker must always scale together (consistent visual relationship)

4. **Viewport & Scroll**
   - Lock page scroll entirely (`overflow: hidden` on body) — no accidental scrolling while dragging blocks
   - Lock viewport: `width=device-width, initial-scale=1, user-scalable=no` — prevents pinch-zoom during gameplay
   - Viewport height approach: use dvh units or JS-measured height to account for browser address bar
   - Give Up button always visible — fixed/sticky at bottom of screen on mobile

### Claude's Discretion

- Specific block size value (user says "Claude picks the exact block size")
- Whether to use dvh units or JS height measurement for viewport adjustment
- Implementation details of responsive scaling mechanism (CSS variables, media queries, or dynamic JS)

### Deferred Ideas (OUT OF SCOPE)

- Allow user scaling (accessibility) — `user-scalable=no` conflicts with pinch-zoom protection; revisit in future accessibility phase

</user_constraints>

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| CSS | 3 (CSS3/latest) | Suppress touch behaviors, responsive sizing | Native browser support; no dependencies needed |
| Vanilla JS | ES6+ | Dynamic height measurement if needed | Game already uses vanilla JS; no frameworks |
| HTML5 Viewport Meta | Standard | Disable zoom and set device scaling | Web standard for controlling mobile behavior |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| CSS Variables (custom properties) | CSS3 | Centralized block sizing | Already in use in current game.html; enables dynamic responsive scaling |
| CSS Media Queries | CSS3 | Breakpoint-specific layout adjustments | For large screens if needed (desktop optimization) |
| Dynamic viewport height measurement (JS) | Native API | Account for browser address bar | Alternative to dvh units for broader compatibility |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS `user-select: none` globally | Per-element suppression | Global approach simpler; less specific selectors; avoids repeating rules |
| `overflow: hidden` on body | `touch-action: none` on game elements | Overflow:hidden is more reliable for locking scroll; touch-action more granular but less tested on mobile |
| Responsive block sizing via CSS Variables | Media queries + fixed block sizes | CSS variables allow smooth scaling; media queries require multiple breakpoints |
| dvh (dynamic viewport height) units | JS-measured `window.innerHeight` | dvh now supported in modern browsers (iOS 15.4+, Chrome 108+); JS fallback for older devices |

**Installation:**
No packages needed. All solutions use native CSS and browser APIs.

---

## Architecture Patterns

### Recommended Project Structure

No new files needed. All changes are CSS modifications and optional JS additions to existing game.html:

```
game.html
├── <meta> viewport tag (already present, will modify)
├── <style> section (will add/modify CSS rules)
│   ├── Global touch suppression rules (new)
│   ├── Body scroll lock rule (new)
│   ├── Word container single-line rule (new)
│   ├── Responsive block sizing rules (new/modified)
│   └── Give Up button sticky rule (new)
└── <script> section (optional JS additions)
    └── Viewport height measurement (optional, if dvh fallback needed)
```

### Pattern 1: Global Touch Suppression

**What:** Apply a single CSS ruleset to `body` (or `html, body`) that disables all touch-related browser behaviors at the page level.

**When to use:** When you want to suppress these behaviors everywhere, not just on interactive elements. This is the user's explicit requirement: suppress globally because the game has no text worth selecting and all interactions are drag-based.

**Example:**
```css
/* Suppress all unwanted touch behaviors at page level */
html, body {
  -webkit-touch-callout: none;           /* iOS long-press callout menu */
  -webkit-user-select: none;             /* iOS text selection */
  user-select: none;                     /* Standard text selection (Firefox, Chrome) */
  -webkit-tap-highlight-color: transparent; /* iOS/Android tap flash */
  -moz-user-select: none;                /* Firefox */
  -ms-user-select: none;                 /* IE/Edge (legacy) */
}
```

**Verification:** Test on iOS Safari (long-press, double-tap), Android Chrome (long-press), and desktop browsers. Confirm no selection highlight, no callout menu, no tap flash appear.

### Pattern 2: Word Container Single-Line Layout

**What:** Apply `white-space: nowrap` + `max-width` constraint to the game board to force all blocks (vowels + consonants) onto a single horizontal line, preventing two-line wrapping.

**When to use:** When word length + block spacing could exceed container width on mobile, causing wrapping that breaks drop-target positioning.

**Example:**
```css
#game-board {
  display: flex;
  flex-wrap: nowrap;        /* Force single line, no wrapping */
  white-space: nowrap;      /* Additional safety; prevents text wrapping */
  max-width: 100%;          /* Respect container width */
  overflow-x: auto;         /* Optional: allow horizontal scroll on tiny screens */
  justify-content: center;
  gap: var(--block-gap);
}
```

**Note:** Current game.html already has `flex-wrap: wrap`; will change to `nowrap`.

### Pattern 3: Responsive Block Sizing with CSS Variables

**What:** Define block size as a CSS variable and update it dynamically based on screen width, or use CSS units that scale proportionally (e.g., percentage or viewport-relative sizing).

**When to use:** When you need blocks to be large on desktop (e.g., 52px current) and smaller on mobile (e.g., 40px) to fit a 7-letter word on 375px screen, all while keeping picker proportionally scaled.

**Example:**
```css
:root {
  --block-size: 52px;  /* Desktop default */
}

/* Mobile breakpoint: 375px or narrower */
@media (max-width: 425px) {
  :root {
    --block-size: 44px;  /* Adjusted for mobile; allows 7-letter word + gaps to fit */
  }
}

@media (max-width: 360px) {
  :root {
    --block-size: 40px;  /* For small phones if needed */
  }
}

.block {
  width: var(--block-size);
  height: var(--block-size);
  /* ... rest of block styles ... */
}

.vowel-option {
  width: var(--block-size);  /* Picker scales with block */
  height: var(--block-size);
}
```

**Verification:** Calculate: For 7 blocks at 44px + 6 gaps at 9px = (7 × 44) + (6 × 9) = 308 + 54 = 362px. With padding (24px left/right per current game.html) = 362 + 48 = 410px. Target screen is 375px, so padding may need reduction on mobile. Plan accordingly.

### Pattern 4: Lock Page Scroll

**What:** Set `overflow: hidden` on `body` to prevent all scrolling while gameplay is active (or always, if game fits viewport).

**When to use:** When accidental scroll during drag/drop would interfere with gameplay or cause visual jank. User's explicit requirement.

**Example:**
```css
body {
  overflow: hidden;  /* Disable all scrolling */
  height: 100vh;     /* Ensure body fills viewport */
}
```

**Caveats:** If game content is taller than viewport, users cannot scroll to see it. Plan layout so game fits on mobile viewport (likely OK given current layout).

### Pattern 5: Sticky/Fixed Give Up Button

**What:** Position Give Up button fixed or sticky at bottom of screen so it remains visible during scroll (if scroll is ever needed) or during drag.

**When to use:** User requirement: "Give Up button always visible" on mobile.

**Example (Fixed):**
```css
#give-up-btn {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;  /* Above game board and vowel picker */
  width: 100%;   /* Full width for mobile accessibility */
  padding: 12px 28px;
  /* ... rest of button styles ... */
}

/* Adjust footer padding to account for fixed button */
#game-footer {
  position: relative;
  height: 50px;  /* Placeholder for fixed button */
}
```

**Alternative (Sticky):**
```css
#game-footer {
  position: sticky;
  bottom: 0;
  background: var(--color-bg);
  z-index: 999;
}
```

**Note:** Sticky is simpler if content fits viewport; fixed is more reliable for ensuring button always visible in browser chrome.

### Anti-Patterns to Avoid
- **Global `user-select: none` without testing:** Some older browsers or assistive tech may be affected. Acceptable here because game has no text content worth selecting.
- **Setting `user-scalable=no` without fallback:** Some accessibility advocates disable this via browser settings. Lock via CSS `touch-action` as backup.
- **Hardcoded block pixel sizes:** Prevents responsive scaling. Always use CSS variables or percentage-based sizing.
- **Using `position: absolute` for Give Up button without z-index:** Button may be hidden behind game board. Always set explicit z-index.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Touch behavior suppression | Custom JS to intercept touch/mouse events | CSS user-select + webkit touch-callout + tap-highlight-color | CSS is declarative, reliable, and requires no JS overhead; browser handles natively |
| Scroll locking on mobile | JS event listeners on wheel/touch events | CSS overflow: hidden | CSS is more reliable; JS solutions often have edge cases on iOS Safari (body scroll still fires during modal open) |
| Responsive sizing for multiple screen sizes | Multiple hard-coded CSS rules for each breakpoint | CSS variables + media queries or viewport-relative units | Variables centralize values; media queries are standard; viewport units adapt automatically |
| Dynamic viewport height adjustment | Custom resize listeners and manual calculations | CSS dvh unit or single fallback JS measurement | dvh is native browser support (iOS 15.4+, Chrome 108+); single JS measurement is simpler than resize tracking |
| Button always-visible logic | JS scroll tracking + position recalculation | CSS position: fixed with z-index | Fixed positioning is native and performant; no JS overhead |

**Key insight:** This phase is pure CSS optimization. The game uses no external libraries, so all solutions leverage native browser APIs and CSS standards. Avoid custom JS except for optional fallback height measurement on older devices. CSS-first approach is simpler, more performant, and less prone to bugs.

---

## Common Pitfalls

### Pitfall 1: Overflow: Hidden Breaks iOS Safari Scroll

**What goes wrong:** Setting `overflow: hidden` on body works on most browsers, but iOS Safari (especially older versions pre-15.4) may still allow scroll during touch drag, or body may scroll unexpectedly when tapping inside a modal/interactive element.

**Why it happens:** iOS Safari has a different scroll model than other browsers. The scroll position is maintained separately from the DOM, and overflow rules may not fully suppress it during touch interactions.

**How to avoid:**
- Use `overflow: hidden` as primary method (works on modern iOS 15.4+).
- For older iOS support, add fallback: `position: fixed; width: 100%;` on body as backup.
- Test thoroughly on iOS Safari 14, 15, and latest (currently 18+).
- Note: User's CONTEXT.md defers accessibility phase, so `user-scalable=no` is acceptable for now.

**Warning signs:**
- Page scrolls during drag even with `overflow: hidden`.
- User reports body scroll on iOS.

### Pitfall 2: Block Sizing Calculation Ignores Padding/Margins

**What goes wrong:** Calculate that 7 blocks + 6 gaps = 362px, but fail to account for container padding (24px left/right) or block margin, resulting in overflow off the edge of a 375px screen.

**Why it happens:** Easy to forget that container width is not the full viewport width; padding reduces available space.

**How to avoid:**
- Always calculate: `available_width = viewport_width - (container_padding_left + container_padding_right)`.
- For the game: `375px - (24px + 24px) = 327px available`.
- Then: `block_size = (327px - gap_space) / block_count`.
- For 7 blocks at ~40px each + 6 gaps at 9px = 280 + 54 = 334px. Fits!
- Use `box-sizing: border-box` globally to simplify calculations.

**Warning signs:**
- Blocks overflow right edge on mobile.
- Horizontal scroll appears unexpectedly.

### Pitfall 3: Word Wrapping Still Occurs Despite `white-space: nowrap`

**What goes wrong:** Applied `white-space: nowrap` to #game-board, but flex-wrap is still set to `wrap`, so blocks wrap to a second line anyway.

**Why it happens:** `white-space: nowrap` controls text wrapping within an element; `flex-wrap: wrap` controls flex item wrapping. Both must be configured.

**How to avoid:**
- Change `flex-wrap: wrap` → `flex-wrap: nowrap` on #game-board.
- Optionally add `white-space: nowrap` for belt-and-suspenders.
- Test: Create a 7-letter word on 375px screen and verify blocks stay on one line.

**Warning signs:**
- Blocks on second line after long word.
- Drop targets misaligned because blocks aren't where expected.

### Pitfall 4: Give Up Button Overlaps Game Content

**What goes wrong:** Set Give Up button to `position: fixed; bottom: 0;` without accounting for its height, so button obscures the bottom part of the game board on mobile.

**Why it happens:** Fixed positioning removes button from layout flow; content underneath is not adjusted.

**How to avoid:**
- Add bottom padding or margin to #game-board-container equal to button height (~50px).
- Or: Use `position: sticky` with a positioned #game-footer parent (simpler if content fits viewport).
- Test: Ensure at least 20px clearance between lowest block and button on mobile.

**Warning signs:**
- Button overlaps blocks at bottom of board.
- Blocks are positioned behind button due to z-index issues.

### Pitfall 5: Double-Tap Zoom Still Triggers on Older Browsers

**What goes wrong:** Set `user-scalable=no` in viewport meta tag, but double-tap zoom still works on iOS Safari 14 or Android browsers that ignore the attribute.

**Why it happens:** Modern browsers (iOS 15.4+, Chrome 108+) respect viewport rules, but older browsers or specific browser versions may override or ignore `user-scalable=no` for accessibility reasons.

**How to avoid:**
- Primary: Use viewport meta tag `user-scalable=no` for modern browsers (covers ~95% of users).
- Fallback: Add CSS `touch-action: pan-y;` on body to disable all touch zoom except vertical pan (supported in Safari 13+).
- For maximum compatibility, combine both: viewport meta + touch-action CSS.
- Test on iOS 14, 15, and 18; Android Chrome 90+.

**Warning signs:**
- User reports double-tap zoom still works on old device.
- Accidental zoom during rapid block tapping.

### Pitfall 6: CSS Variables Not Updating on Breakpoint Change

**What goes wrong:** Define `--block-size: 52px` at :root, and `--block-size: 44px` in a media query, but blocks don't resize when screen width crosses the breakpoint (e.g., rotating device).

**Why it happens:** CSS variables are correctly updated by the browser, but the game may have cached computed values or the browser hasn't re-painted. Rare but possible with complex selectors.

**How to avoid:**
- Always reference the variable via `width: var(--block-size)` without fallback in normal cases.
- Test: Open game on mobile, rotate device, verify blocks resize smoothly.
- If issues, add explicit `transition: width 0.2s ease` on .block to see resize animation.

**Warning signs:**
- Blocks don't resize after rotating phone.
- Size is still 52px even on mobile viewport.

---

## Code Examples

Verified patterns from official sources:

### CSS: Suppress All Touch Behaviors

```css
/* Source: https://developer.mozilla.org/en-US/docs/Web/CSS/user-select, https://css-tricks.com/almanac/properties/u/user-select/ */
html, body {
  -webkit-touch-callout: none;           /* iOS long-press menu */
  -webkit-user-select: none;             /* iOS text selection */
  -moz-user-select: none;                /* Firefox */
  -ms-user-select: none;                 /* IE/Edge */
  user-select: none;                     /* Standard */
  -webkit-tap-highlight-color: transparent; /* iOS/Android tap flash */
}
```

### Viewport Meta Tag: Lock Zoom

```html
<!-- Source: https://www.w3schools.com/css/css_rwd_viewport.asp -->
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
```

### CSS: Lock Page Scroll

```css
/* Source: https://css-tricks.com/prevent-page-scrolling-when-a-modal-is-open/ */
body {
  overflow: hidden;
  height: 100vh;
}

/* Fallback for iOS Safari older versions */
body.scroll-locked {
  position: fixed;
  width: 100%;
}
```

### CSS: Single-Line Word Layout

```css
/* Source: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Text/Wrapping_breaking_text */
#game-board {
  display: flex;
  flex-wrap: nowrap;        /* Prevent flex item wrapping */
  white-space: nowrap;      /* Prevent text wrapping within flex items */
  max-width: 100%;
  overflow-x: auto;         /* Allow horizontal scroll on tiny screens */
}
```

### CSS: Responsive Block Sizing with Variables

```css
/* Source: https://developer.mozilla.org/en-US/docs/Web/CSS/--*, CSS custom properties */
:root {
  --block-size: 52px;
  --block-gap: 9px;
}

@media (max-width: 425px) {
  :root {
    --block-size: 44px;
  }
}

.block {
  width: var(--block-size);
  height: var(--block-size);
  gap: var(--block-gap);
}

.vowel-option {
  width: var(--block-size);
  height: var(--block-size);
}
```

### CSS: Viewport Dynamic Height with dvh

```css
/* Source: https://elementor.com/blog/vh/, https://medium.com/@tharunbalaji110/understanding-mobile-viewport-units-a-complete-guide-to-svh-lvh-and-dvh-0c905d96e21a */
html, body {
  height: 100dvh;  /* Dynamic viewport height: accounts for browser address bar */
}

#app {
  min-height: 100dvh;
}
```

**Browser support:** `dvh` is supported in iOS 15.4+, Chrome 108+. Fallback: use `100vh` with JS measurement for older browsers.

### CSS: Fixed Give Up Button

```css
/* Source: https://www.w3schools.com/howto/howto_css_fixed_footer.asp */
#give-up-btn {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  width: calc(100% - 48px);  /* Account for padding */
  padding: 12px 24px;
}

#game-footer {
  height: 50px;  /* Placeholder for fixed button */
}
```

### Optional JS: Fallback Viewport Height Measurement

```javascript
/* Source: https://stackoverflow.com/questions/58886797/css-vh-unit-100vh-inconsistent-results-mobile-browsers */
function setViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--viewport-height', `${vh}px`);
}

setViewportHeight();
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', setViewportHeight);
```

Then use in CSS:
```css
body {
  height: calc(var(--viewport-height, 100vh) * 100);
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `-webkit-user-select: none` alone | Combined with `user-select: none` + `-moz-user-select` | ~2015 | Better browser coverage; more reliable suppression |
| `overflow: hidden` JS workarounds | Pure CSS `overflow: hidden` (iOS 15.4+) | 2021-2022 | iOS improved; reduced JS complexity; fewer edge cases |
| Fixed pixel block sizes | CSS variables + media queries | ~2018 | Responsive, maintainable; easier to adjust at scale |
| `100vh` for full height | `100dvh` dynamic viewport height | 2023-2024 | Accounts for mobile address bar; better UX on mobile |
| `position: fixed` footers | Combination of `position: fixed` + `position: sticky` | 2020s | Better semantics; sticky is more accessible for some use cases |
| JavaScript scroll locks | CSS `overflow: hidden` + optional JS fallback | 2023 | Native CSS is simpler; JS only for older browser fallback |

**Deprecated/outdated:**
- `position: absolute` for fixed-position elements — Modern browsers prefer `position: fixed` or `sticky` for better semantics and performance.
- Manual viewport height calculations in JS — Modern browsers support `dvh` units natively; JS calculation only needed for fallback on older devices.
- `-webkit-user-select: none` without standard `user-select: none` — Standard property now widely supported; webkit prefix still useful for some older browsers but not primary.

---

## Open Questions

1. **Exact block size for 7-letter words on 375px screen**
   - What we know: Need to fit 7 blocks + 6 gaps on ~327px available width (375px - 48px padding).
   - What's unclear: Optimal block size that balances touch target size (minimum 44px per WCAG) with fitting word width.
   - Recommendation: Start with 44px and test with real 7-letter words. If too tight, reduce padding to 12px/side (game.html currently has 24px). Calculate: (7 × 44) + (6 × 9) = 362px; with 12px padding = 386px (still tight). May need 40px blocks. Plan to iterate.

2. **dvh vs. JS height measurement**
   - What we know: `dvh` is modern standard (iOS 15.4+, Chrome 108+) and accounts for address bar. JS measurement is a fallback.
   - What's unclear: Should we implement dvh-only or provide JS fallback for older devices?
   - Recommendation: Use dvh units as primary (covers ~95% of users). If user testing shows issues on older devices, add optional JS fallback. Game currently doesn't measure viewport height, so start with dvh-only.

3. **Word list filtering for 7-letter max**
   - What we know: CONTEXT.md requires max 7 letters (may reduce to 6 after testing).
   - What's unclear: Should research include word list filtering logic, or is that implementation work for planner?
   - Recommendation: Out of scope for research; planner will filter WORDS array to exclude words longer than 7 letters.

4. **Mobile breakpoint value (375px or 425px)**
   - What we know: User mentioned "standard iPhone width" (~375px). Current style uses no media queries.
   - What's unclear: Should breakpoint be exactly 375px, or a safe range (e.g., max-width: 425px) to account for larger phones?
   - Recommendation: Use `max-width: 425px` to cover iPhone 6-15, SE. Provides margin for edge cases.

---

## Sources

### Primary (HIGH confidence)
- [MDN: user-select CSS property](https://developer.mozilla.org/en-US/docs/Web/CSS/user-select) - Text selection suppression
- [MDN: CSS Custom Properties (--)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) - Responsive sizing with variables
- [MDN: Viewport Meta Tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag) - Viewport and zoom control
- [MDN: Text Wrapping and Breaking](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Text/Wrapping_breaking_text) - white-space and word wrapping
- [W3Schools: CSS Responsive Viewport](https://www.w3schools.com/css/css_rwd_viewport.asp) - Viewport meta setup
- [W3Schools: Fixed Footers](https://www.w3schools.com/howto/howto_css_fixed_footer.asp) - Fixed button positioning

### Secondary (MEDIUM confidence)
- [CSS-Tricks: user-select](https://css-tricks.com/almanac/properties/u/user-select/) - Text selection browser support
- [Elementor: What Is VH In CSS 2026](https://elementor.com/blog/vh/) - Viewport units including dvh
- [Medium: Understanding Mobile Viewport Units (svh, lvh, dvh)](https://medium.com/@tharunbalaji110/understanding-mobile-viewport-units-a-complete-guide-to-svh-lvh-and-dvh-0c905d96e21a) - Modern viewport units
- [LogRocket: vh and vw Guide to CSS Viewport Units](https://blog.logrocket.com/improving-mobile-design-latest-css-viewport-units/) - Viewport unit best practices
- [CSS-Tricks: Prevent Page Scrolling When Modal is Open](https://css-tricks.com/prevent-page-scrolling-when-a-modal-is-open/) - Scroll locking techniques
- [makandra: Disable Text Selection on iOS and Android](https://makandracards.com/makandra/1354-disable-text-selection-ios-android-devices) - iOS/Android-specific suppression
- [GeeksforGeeks: Disable Zoom on Mobile Web Page](https://www.geeksforgeeks.org/html/how-to-disable-zoom-on-a-mobile-web-page-using-css/) - Double-tap zoom prevention
- [CSS-Tricks: Sticky Footers](https://css-tricks.com/couple-takes-sticky-footer/) - Sticky positioning patterns
- [MDN: Sticky Footers](https://developer.mozilla.org/en-US/docs/Web/CSS/How_to/Layout_cookbook/Sticky_footers) - Layout cookbook for sticky elements

### Tertiary (LOW confidence, informational)
- [egghead.io: Disable Text Selection and Callouts in PWA on iOS](https://egghead.io/lessons/react-disable-text-selection-and-touch-callouts-in-a-pwa-on-ios) - iOS-specific patterns
- [DEV Community: Mobile Touch Hover Event & Disable Text Selection](https://dev.to/richmondgozarin/mobile-touch-hover-event-disable-text-selection-copy-cut-paste-1od1) - Community practices
- [Medium: Scroll Blocking Overlays](https://weser.io/blog/scroll-blocking-overlays) - Advanced scroll management
- [PQINA: Prevent Scrolling on iOS Safari 15](https://pqina.nl/blog/how-to-prevent-scrolling-the-page-on-ios-safari) - iOS-specific workarounds

---

## Metadata

**Confidence breakdown:**
- Standard stack (CSS + HTML5 viewport meta): HIGH — All techniques are native browser features, well-documented, widely tested.
- Architecture patterns (single-line layout, responsive sizing, scroll lock, fixed button): HIGH — Standard CSS practices, documented in MDN and CSS-Tricks.
- Common pitfalls (overflow edge cases, sizing calculations, button overlap): HIGH — Well-known issues documented in browser dev forums and blogs.
- Specific block size recommendation: MEDIUM — Calculation is sound, but final value should be validated during implementation/testing with real word list.

**Research date:** 2026-02-23
**Valid until:** 2026-04-23 (CSS is stable; revisit if new viewport units or browser behavior changes occur)

---

*Phase: 05-mobile-optimization*
*Research completed: 2026-02-23*
