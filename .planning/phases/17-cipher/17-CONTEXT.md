# Phase 16: Cipher - Context

**Gathered:** 2026-02-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Build cipher.html: a daily famous quote encoded as a number substitution cipher. Players tap numbered blocks and type letters to decode the quote. Phase includes full interaction, results screen, give-up mechanic, and hub integration (4th game card). Quote corpus and daily seeding are part of this phase.

</domain>

<decisions>
## Implementation Decisions

### Wrong Guess Handling
- Wrong guesses show the letter in the block — no color change, all filled blocks look the same whether right or wrong
- Win is auto-detected: when ALL numbers have letters assigned, the game checks correctness automatically
- Any block (filled or empty) can be tapped to reassign — corrections always possible
- Duplicate enforcement: assigning letter L to number N auto-clears any other number that previously had L (smooth, no error messages)
- Filled-but-unverified blocks use a lighter charcoal/medium tone (distinct from dark unsolved blocks) to show they have a guess
- Selected block(s) use the same amber (#D4A574) as VOWEL's selected tiles

### Block Layout & Sizing
- 38×38px compact blocks (start here; can scale up to ~52px if mobile usability proves poor)
- Number displayed centered and large inside block; no subscript number after letter fill — the letter replaces the number completely
- Word groups separated by flex gap only (no explicit slash or separator)
- Words wrap naturally at word boundaries (flex-wrap on quote container; word-group is nowrap)

### Give-Up & End States
- Same hold-to-give-up mechanic as Ladder (3-second press-and-hold button)
- No try-again — one shot per day, results are final
- Results screen follows same layout as Ladder: fixed overlay, CIPHER title pinned at top, result title colored (Solved = sage green, Revealed = dusty rose), full quote + author + share button
- **Win:** title "Solved", sage green, confetti, full quote + author revealed on results screen
- **Give-up:** title "Revealed", dusty rose, NO confetti; animated decode — all correct letters fill in left-to-right across the quote in ~1.5 seconds before results overlay appears
- Game fully locks on give-up (controls disabled) then animated reveal happens on the game board, then results overlay
- After give-up, hub marks cipher as completed (DailyStatus.markCompleted)

### Author Attribution
- Author shown from the start of gameplay as a subtle hint below the quote blocks
- Format: `— Author name` (em dash prefix)
- Style: very small, low opacity (~0.5), matching the muted label style from Ladder's step count labels
- Author is always plaintext — never part of the cipher encoding
- Author shown prominently again on the results screen after win/give-up

### Claude's Discretion
- Exact confetti implementation (can copy from Ladder)
- Give-up bar fill color and animation speed (copy Ladder pattern)
- Exact timing of the animated letter reveal on give-up (start with ~1.5s sweep, adjust if too fast)
- Results screen padding and spacing details (follow Ladder's established pattern)

</decisions>

<specifics>
## Specific Ideas

- Amber selection color must match VOWEL's selected tile color (#D4A574) — user explicitly referenced VOWEL's orange
- Give-up animated decode: letters fill in left-to-right, ~1.5s total duration; if it feels too fast, slow to ~2-3s with per-letter bounce
- Results screen should feel identical to Ladder's (same fixed overlay pattern, same title color logic)
- Block sizing: start at 38px, keep 52px option in mind if mobile testing shows tap targets are too small

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 17-cipher*
*Context gathered: 2026-02-27*
