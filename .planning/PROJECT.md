# Yellow Blocks Word Game

## What This Is

A browser-based word puzzle game where consonants are shown as fixed gray letter blocks and vowel positions appear as blank yellow draggable blocks. Players drag or click the yellow blocks to scroll through A/E/I/O/U and fill in the correct vowels to form the word. Infinite words play one at a time, auto-advancing after each win.

## Core Value

Players can instantly understand and interact with any puzzle — the drag mechanic is intuitive, the win/lose feedback is immediate and satisfying.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Word displayed center-screen with gray consonant blocks and yellow vowel blank blocks
- [ ] Clicking or dragging a yellow block reveals a vertical A/E/I/O/U picker column
- [ ] Player can drag up/down to scroll through vowels OR click directly on a vowel to select it
- [ ] All vowels correct → background flashes green (win), then auto-advances to next random word
- [ ] "Give Up" button reveals correct vowels in yellow blocks and turns background red/salmon
- [ ] Infinite random common English words, one at a time
- [ ] New word loads automatically a few seconds after winning

### Out of Scope

- Scoring/points system — not mentioned, keep it simple for v1
- Timer/countdown — not in the original design
- Multiplayer — single player only
- Mobile-specific native app — web browser is sufficient

## Context

- Single-page browser game (HTML + CSS + JS, no build tools needed)
- Visual design: teal/mint background (#4DC5C5 range), gray consonant blocks, yellow vowel blocks
- Consonant blocks: gray background, white text
- Vowel blocks: yellow background, black text; darker gold border when revealed (give up state)
- Win state: bright green full-screen background
- Give up state: salmon/red full-screen background
- Title "Move the Yellow Blocks to Form Words" top-left, bold black

## Constraints

- **Tech**: Single HTML file preferred — no framework, no build step, just open in browser
- **Word source**: Built-in JS word list of common English words (no external API)
- **Words must have vowels**: Only words containing at least one vowel (A/E/I/O/U) qualify

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Single HTML file | No setup friction, works by double-clicking | — Pending |
| Vowel picker as vertical drag column | Matches the design shown in screenshots | — Pending |
| Auto-advance after win | User specified, keeps the game flowing | — Pending |

---
*Last updated: 2026-02-19 after initialization*
