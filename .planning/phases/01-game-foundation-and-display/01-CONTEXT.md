# Phase 1: Game Foundation & Display - Context

**Gathered:** 2026-02-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Set up the word engine (random word selection, vowel filtering, word list) and render the static game board: consonant blocks fixed in order, blank vowel placeholders grouped at the left, title, background, and Give Up button. No interactivity yet — that's Phase 2.

</domain>

<decisions>
## Implementation Decisions

### Color Palette & Mood
- Light mode — white or very light gray background, clean and airy
- Vowel blocks: warm amber/gold accent (refined, not flat yellow; richer than the original)
- Consonant blocks: charcoal/dark gray with white or light text
- Win state: elegant sage green (not harsh bright green)
- Give up state: dusty rose / muted salmon (not harsh red)
- **Accessibility requirement:** All color combinations must meet WCAG AA contrast standards; win/give up states must not rely on color alone to communicate outcome (use additional visual cue — e.g., iconography or text label)

### Block Visual Style
- Shape depth: flat & minimal OR soft elevation with gentle drop shadow — whichever reads as more sophisticated and elegant (Claude's discretion)
- Corner rounding: slightly rounded (4-6px) — modern but structured, not pill-shaped
- Block size: medium tiles (48-56px)
- Typography: uppercase, elegant serif font on all blocks — letters fill the tile confidently

### Layout & Composition
- Game title: **"Vowel"** — short, minimal, elegant (replaces "Move the Yellow Blocks to Form Words")
- Title placement: rendered elegantly to fit the modern design (exact typographic treatment at Claude's discretion — could be top-left, centered header, or stylized wordmark)
- Puzzle position: slightly above true center vertically, horizontally centered
- Block spacing: comfortable gap between blocks (8-10px)
- Give Up button: bottom-center, styled in the give up state color (dusty rose/muted salmon)

### Word Pool & Difficulty
- Word length: mixed (4–10 letters) — variety between quick solves and longer challenges
- Vocabulary: mixed difficulty — mostly common everyday words, occasional less common but still recognizable words
- Exclusions: no proper nouns, no slang or informal words, no obscure technical jargon
- Pool size: 1000+ words to minimize repeats over extended play sessions
- Selection: random with no immediate repeat

### Claude's Discretion
- Exact shadow values if soft elevation is chosen
- Specific serif font selection (should be free/web-safe or Google Font, readable at block size)
- Exact shade values within the amber/charcoal/sage/dusty-rose direction
- Title typographic treatment (exact layout and sizing)
- How the accessibility cue supplements win/give up color (text label, icon, or animation)

</decisions>

<specifics>
## Specific Ideas

- The user explicitly wants "elegant" and "sophisticated" — avoid anything that looks casual, flat-app, or game-y in a chunky way
- Serif font on blocks gives it a crossword/editorial quality — this is the key differentiator from the original
- The palette direction is warm neutrals + amber accent — think editorial word games, not casual mobile game

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-game-foundation-and-display*
*Context gathered: 2026-02-19*
