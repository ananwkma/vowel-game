# Phase 5: Mobile Optimization - Context

**Gathered:** 2026-02-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Polish the game's touch experience on mobile browsers. The game already works on mobile — this phase removes rough edges: unwanted browser behaviors, layout issues (word wrapping to two lines), and sizing/scaling problems. No new game features.

</domain>

<decisions>
## Implementation Decisions

### Unwanted Touch Behaviors
- Suppress text selection, long-press loupe, and iOS callouts on the **entire page** (not just blocks) — the game has no text worth selecting (title, consonant letters, Give Up button)
- Remove iOS tap-flash highlight (`-webkit-tap-highlight-color: transparent`)
- Disable double-tap zoom (prevents accidental zoom during rapid block tapping)
- Suppress all iOS callouts and magnifying loupe (`-webkit-touch-callout: none`)

### Word Layout — Single Line Constraint
- Words must fit on a **single line** on mobile — two-line wrapping makes it impossible to drop blocks at the line break
- Filter the word list to a **maximum of 7 letters** (may reduce to 6 after user testing if 7 feels tight)
- Blocks must be sized so a 7-letter word fits comfortably on a ~375px-wide screen (standard iPhone width)

### Block & Picker Sizing
- Claude picks the exact block size optimized for 7-letter words on a 375px screen with comfortable touch targets
- Block size is **responsive** — shrinks on mobile, expands on desktop (not mobile-only)
- Vowel picker scales **proportionally with blocks** — same responsive scaling, no separate mobile boost
- Blocks and picker must always scale together (consistent visual relationship)

### Viewport & Scroll
- **Lock page scroll entirely** (`overflow: hidden` on body) — no accidental scrolling while dragging blocks
- **Lock viewport**: `width=device-width, initial-scale=1, user-scalable=no` — prevents pinch-zoom during gameplay (revisit for accessibility later)
- Claude handles viewport height approach (dvh units or JS-measured height to account for browser address bar)
- **Give Up button always visible** — fixed/sticky at bottom of screen on mobile

</decisions>

<specifics>
## Specific Ideas

- The blue selection highlight shown in testing covered the entire title + half the board — suppressing globally is the right fix
- The vowel picker should feel like a natural extension of the block (same scale), not a separate overlay that ignores sizing changes
- User may reduce max word length from 7 → 6 after mobile testing if 7 feels crowded

</specifics>

<deferred>
## Deferred Ideas

- **Allow user scaling (accessibility)** — `user-scalable=no` can harm visually impaired users who rely on pinch-zoom. Revisit in a future accessibility phase; for now locked for gameplay stability.

</deferred>

---

*Phase: 05-mobile-optimization*
*Context gathered: 2026-02-23*
