---
phase: 14-hub-vowel-migration
plan: "01"
subsystem: ui
tags: [css, design-tokens, custom-properties, typography, colors]

# Dependency graph
requires: []
provides:
  - Shared CSS custom properties file at styles/design-tokens.css
  - Color tokens (--color-bg, --color-primary, --color-secondary, --color-success, --color-warning)
  - Typography token (--font-serif with Playfair Display via Google Fonts)
  - Spacing scale (--spacing-xs through --spacing-xl)
  - Block sizing tokens (--block-size, --block-radius, --block-gap)
  - Shadow tokens (--shadow-sm, --shadow-md)
  - Transition tokens (--transition-fast, --transition-normal, --transition-slow)
affects:
  - 14-02 (hub index.html must import design-tokens.css)
  - 14-03 (vowel.html must import design-tokens.css and can alias tokens locally)
  - 15-word-ladder (Word Ladder imports design-tokens.css for visual consistency)
  - 16-letter-hunt (Letter Hunt imports design-tokens.css for visual consistency)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "CSS custom properties in :root for global design token sharing"
    - "Semantic token naming (--color-primary vs --color-vowel-bg) to decouple tokens from game-specific meaning"
    - "Google Fonts @import in shared token file to avoid duplication across game pages"

key-files:
  created:
    - styles/design-tokens.css
  modified: []

key-decisions:
  - "Token names normalized from VOWEL-specific (--color-vowel-bg) to semantic (--color-primary) so all games can use them without game-context coupling"
  - "Google Fonts @import placed in design-tokens.css so games only need one link tag for both font loading and token access"
  - "Block sizing variables included in shared file so future games can reference standard tile dimensions"

patterns-established:
  - "All game pages must <link rel='stylesheet' href='styles/design-tokens.css'> as first stylesheet"
  - "Game-specific color aliases declared locally (e.g. vowel.html can declare --color-vowel-bg: var(--color-primary))"

requirements-completed: [HUB-04]

# Metrics
duration: 1min
completed: 2026-02-26
---

# Phase 14 Plan 01: Shared CSS Design Tokens Summary

**Extracted VOWEL game's :root CSS block into styles/design-tokens.css with semantic token names (--color-primary, --color-secondary) so all Word Games Collection pages share one visual identity source**

## Performance

- **Duration:** ~1 min
- **Started:** 2026-02-26T07:19:20Z
- **Completed:** 2026-02-26T07:20:13Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments
- Created `styles/` directory and `styles/design-tokens.css` (42 lines)
- Mapped VOWEL-specific token names to semantic multi-game names (e.g. `--color-vowel-bg: #D4A574` -> `--color-primary: #D4A574`)
- All token categories covered: colors (7 tokens), typography (1), spacing scale (5), block sizing (3), shadows (2), transitions (3)
- Google Fonts @import included so games avoid duplicate font loading
- No game-specific selectors — pure `:root` variables only, no HTML/class/ID selectors

## Task Commits

Each task was committed atomically:

1. **Task 1: Create styles/design-tokens.css with shared CSS variables** - `8acfa68` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified
- `styles/design-tokens.css` - Shared CSS custom properties for entire Word Games Collection: colors, typography, spacing, block sizing, shadows, transitions

## Decisions Made
- Token names normalized from VOWEL-specific (`--color-vowel-bg`) to semantic multi-game names (`--color-primary`) — decouples shared tokens from a single game's conceptual model
- Google Fonts @import placed in design-tokens.css rather than individual game pages — reduces duplication and ensures font loads with tokens
- Block sizing vars (`--block-size`, `--block-radius`, `--block-gap`) kept in shared file even though currently VOWEL-specific — future games can reference standard tile dimensions

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- `styles/design-tokens.css` is ready to be imported by index.html (hub page) in Plan 02
- `styles/design-tokens.css` is ready to be imported by vowel.html in Plan 03
- Token names use semantic convention; vowel.html can add local aliases if needed (e.g. `--color-vowel-bg: var(--color-primary)`)

---
*Phase: 14-hub-vowel-migration*
*Completed: 2026-02-26*
