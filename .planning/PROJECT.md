# Yellow Blocks Word Game (VOWEL)

## What This Is

A browser-based word puzzle where the player sees a consonant sequence and must drag yellow vowel blocks into the correct positions to form a valid English word. The title reads "VOWEL" in large serif type. The game runs as a single HTML file — no build step, no server. Words play infinitely, auto-advancing after each win or give-up.

Shipped v1.0 on 2026-02-23 with 1,321 lines of HTML/CSS/JS in a single file.

## Core Value

Players can instantly understand and interact with any puzzle — the drag mechanic is intuitive, the win/lose feedback is immediate and satisfying.

## Requirements

### Validated

- ✓ Word displayed center-screen with charcoal consonant blocks and amber vowel blank blocks — v1.0
- ✓ Dragging a yellow block reveals a vertical A/E/I/O/U picker column — v1.0
- ✓ Player selects a vowel by clicking it or dragging through the picker — v1.0
- ✓ All vowels correct → green flash + auto-advance — v1.0
- ✓ Give Up → salmon flash + correct vowels revealed + auto-advance — v1.0
- ✓ Infinite random common English words, one at a time, no immediate repeat — v1.0
- ✓ Vowel picker fades in on lift, fades out on release — v1.0 (animation)
- ✓ Blocks bounce/settle on drop; new word swipes in with stagger — v1.0 (animation)
- ✓ Touch-clean on mobile: no selection highlight, no zoom, no loupe — v1.0 (mobile)
- ✓ Single-line layout on 375px screen; max 7-letter words — v1.0 (mobile)
- ✓ Responsive block sizing (52px desktop → 42px mobile); picker scales with blocks — v1.0 (mobile)
- ✓ Smooth drag on mobile via RAF throttling + GPU compositor layer — v1.0 (mobile)

### Active

- [ ] **ENH-01**: Score tracking (words solved vs. given up)
- [ ] **ENH-02**: Streak counter (consecutive wins)
- [ ] **ENH-03**: Difficulty filter (short words vs. long words)
- [ ] **ENH-04**: Hint system (reveal one vowel)
- [ ] **ACC-01**: Allow user scaling (pinch-zoom) for visually impaired users — deferred from mobile phase

### Out of Scope

- Scoring/points system beyond simple ENH-01 tracking — not in original design
- Timer/countdown — adds stress without value
- Multiplayer — single-player only
- Mobile native app — web browser with PWA is sufficient
- External dictionary API — word list embedded for offline-first simplicity
- Word category hints — user explicitly chose minimal UI
- Keyboard block lift / Escape-cancel drag — deferred known limitation from Phase 2

## Context

**Codebase:** Single file — `game.html` (1,321 lines, vanilla HTML/CSS/JS, no dependencies)
**Word list:** 2,710 common English words embedded in JS array, filtered to ≤7 letters for puzzle selection (full list kept for win validation)
**Design:** Warm off-white background (#f5f0e8), amber/tan vowel blocks, charcoal consonant blocks, dusty rose Give Up button, "VOWEL" title in Playfair Display serif
**Mobile:** Tested on 375px iPhone SE simulation — touch suppression, single-line layout, RAF-throttled drag

## Constraints

- **Tech**: Single HTML file — no framework, no build step, open in browser
- **Word source**: Built-in JS word list (no external API, offline-first)
- **Words must have vowels**: Only words containing at least one A/E/I/O/U qualify

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Single HTML file | No setup friction, works by double-clicking | ✓ Good — trivial deployment to GitHub Pages |
| Vowel picker as vertical drag column | Matches user's design specification | ✓ Good — natural drag-to-select feel |
| Auto-advance after win (2s) | Keeps game flowing without manual trigger | ✓ Good — satisfying rhythm |
| Embedded word list | Offline-first, no network dependency | ✓ Good — fast and self-contained |
| Any valid word wins (not target-specific) | Allows multiple solutions, increases replayability | ✓ Good — players surprised by alternatives |
| Picker triggered on pointerdown (not pointermove) | Shows picker on lift, not after drag begins | ✓ Good — fixed UX regression discovered in UAT |
| RAF throttling for drag | Eliminates 120Hz+ mobile pointermove lag | ✓ Good — eliminated drag lag reported in mobile UAT |
| Max 7-letter word filter | Single-line constraint on 375px screen | ✓ Good — visually clean on mobile |
| Keyboard lift / Escape-cancel deferred | Never implemented; accepted known limitation | ⚠️ Revisit — accessibility concern for keyboard-only users |
| user-scalable=no viewport | Prevents pinch-zoom during gameplay | ⚠️ Revisit — blocks accessibility for visually impaired |

---
*Last updated: 2026-02-23 after v1.0 milestone*
