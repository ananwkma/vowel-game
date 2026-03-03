# Phase 20-04: Cipher Restructure (cipher.html)

Performed a readability-first restructure of `cipher.html` (1165 lines) following the standard section ordering established in Plan 02. Integrated `shared.js` to remove redundant utility code and enforced consistent naming conventions.

## Changes

### 1. Code Cleanup & Consistency (Audit)
- **Gated Console Logs:** All `console.log` calls in `cipher.html` (previously some were ungated) are now wrapped in `if (IS_DEBUG)`.
- **CSS Variables:** Added a bridge for shared CSS tokens to `cipher.html`.
- **Standardized State:** Verified the game state object is named `gameState`.

### 2. shared.js Integration
- **Removed Inline Utilities:**
    - Removed `seededRandom()` function (now provided by `shared.js`).
    - Removed `DailyStatus` object definition (now provided by `shared.js`).
    - Removed `IS_DEBUG` declaration (now provided by `shared.js`).
    - Removed URL parameter parsing IIFE for `DATE_SEED` (now provided by `shared.js`).
- **Standardized Seed:** Established `const CIPHER_DATE_SEED = DATE_SEED + '_cipher_v1';` to maintain the existing daily word sequence while using the shared date seed.

### 3. JS Section Ordering
The script block was reordered to match the project standard:
1.  **SECTION: CONSTANTS & CONFIG** (Seeds, optimal path calculations, persistence objects)
2.  **SECTION: QUOTE CORPUS** (the quotes/puzzle data array)
3.  **SECTION: STATE** (gameState)
4.  **SECTION: UTILITY FUNCTIONS** (BFS, word validation, UI helpers like shakeTiles/fireConfetti)
5.  **SECTION: DOM REFERENCES** (Cached querySelectors)
6.  **SECTION: ENGINE** (Daily puzzle generation)
7.  **SECTION: UI RENDERING** (renderTiles, addToHistory, showResults)
8.  **SECTION: EVENT HANDLERS** (Collected handle* functions and all addEventListener calls)
9.  **SECTION: INIT** (initGame, restoreProgress, DOMContentLoaded)

### 4. Verification Results
- **Shared Utils:** `shared.js` script tag confirmed present before game script.
- **Dead Code:** No inline `seededRandom` or `DailyStatus` remains.
- **Functionality:** Verified that `CIPHER_DATE_SEED` is correctly constructed and `DailyStatus.markCompleted('cipher')` is called on completion/give-up.
- **Regressions:** Restructure maintained identical behavior for tile interaction, path history, give-up hold mechanic, and results screen.

## Impact
- Removed ~44 lines of duplicated utility code.
- Significantly improved top-to-bottom readability of the 1165+ line file.
- Unified the Cipher codebase with the patterns established in `vowel.html` and `ladder.html`.
