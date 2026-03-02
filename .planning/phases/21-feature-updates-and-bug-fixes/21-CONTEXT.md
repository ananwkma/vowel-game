# Phase 21: Feature Updates & Bug Fixes - Context

**Gathered:** 2026-03-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Two deliverables:

1. **Cipher delete** — Backspace/Delete key clears a letter assignment. Affects all blocks sharing that letter. Anchor (pre-revealed) blocks are protected and cannot be cleared.

2. **No-repeat daily puzzles** — Cipher, Ladder, and Hunt have been reported producing the same puzzle on consecutive days. Fix the seeding/selection logic so no puzzle repeats within a 150-day rolling window.

No other games, no new gameplay mechanics beyond these two items.

</domain>

<decisions>
## Implementation Decisions

### Cipher: Backspace/Delete to clear letter assignment

- **Trigger**: Backspace or Delete key when a block is selected
- **Scope**: Clears the entire letter assignment across **all blocks** mapped to that letter (since one number → one letter mapping, clearing one clears all occurrences)
- **Anchor protection**: Pre-revealed anchor blocks must **not** be clearable — keyboard delete on a selected anchor does nothing
- **Undo stack**: Clearing via backspace should be pushable to the existing `guessHistory` stack so it can be undone with the undo button

### No-repeat puzzle fix: 150-day rolling window

- **Affected games**: Cipher, Ladder, Hunt (VOWEL not reported)
- **Window**: 150 days — no puzzle seen in the last 150 days should repeat
- **Root cause**: Consecutive-day repeats reported — likely a seeding/selection collision in the PRNG rather than a structural repeat

#### Corpus size vs. window constraints (planner must address)

- **Cipher**: 42 quotes. A 150-day no-repeat window is impossible without expanding the corpus — if the corpus is smaller than the window, guaranteed uniqueness cannot be achieved. Planner should expand the quote corpus (to ≥ 200 quotes) and then enforce the 150-day window.
- **Hunt**: 22 categories. Same problem — 150-day window exceeds corpus size. Planner must expand categories (to ≥ 200 word sets) OR reduce the Hunt no-repeat window to match corpus size. User's intent is "no same puzzle the day after" at minimum.
- **Ladder**: PUZZLE_WORDS pool is ~809 words; valid 3–4 step pairs are a subset. 150-day window may be achievable depending on pair count — research required.

#### Implementation approach (Claude's discretion)

- The fix should be deterministic (no server/localStorage required) — same date always produces the same puzzle on every device
- Approach: use the date-seeded RNG to pick a puzzle index from a shuffled list where the shuffle is offset so no two consecutive indices within 150 positions map to the same puzzle. Or: use a larger hash space / better date seed to avoid collisions.
- Do NOT use localStorage to track seen puzzles — must work across devices/browsers without history

### Claude's Discretion

- Exact approach for the 150-day collision-free seeding (modular offset, shuffle, or hash improvement)
- How to expand Cipher corpus (additional famous quotes sourced by researcher)
- Whether Hunt corpus needs expansion or window reduction (make the call based on feasibility)
- Undo integration for the delete action in Cipher

</decisions>

<specifics>
## Specific Ideas

- "Clear all blocks with that letter" — deleting one occurrence clears the whole assignment, consistent with how assignment works (type a letter → fills all blocks with that number)
- "Anchor blocks cannot be deleted" — pre-revealed letters are immutable, same as current behavior where they're visually protected and pointer-events: none
- Repeats were observed "from the day before" — consecutive-day collision is the most critical case to fix

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 21-feature-updates-and-bug-fixes*
*Context gathered: 2026-03-02*
