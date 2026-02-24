# Phase 6: Daily Puzzle Engine - Context

**Gathered:** 2026-02-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace the infinite random word mode with a deterministic daily 5-word sequence. Words are selected using the local date (YYYY-MM-DD) as a seed — same 5 words all day on reload. Game state (current word index, timer elapsed, per-word outcomes) is persisted to localStorage. After the 5th word completes, the game stops and shows the results screen. Returning after completion shows results directly with no replay allowed.

Timer and penalty mechanics (TIM-01 through TIM-05) and the results screen (RES-01, RES-02) are implemented in Phases 7 and 8. This phase sets up the structural scaffolding (daily word engine, state persistence, game end condition) that those phases build on.

</domain>

<decisions>
## Implementation Decisions

### Progress Display
- Show a "Word X of 5" indicator below the VOWEL title, above the board
- Also show 5 pip/dot indicators alongside the counter
- Pips reflect each word's outcome: green for solved, salmon/red for given up, empty/neutral for not yet reached
- The current word's pip is neutral (not yet colored) until the word is completed

### Mid-Puzzle Restore
- On reload mid-puzzle: resume at the current unsolved word
- Timer resumes from the saved elapsed value (requires saving timestamp or elapsed ms to localStorage)
- Past completed words are NOT replayed — player lands directly on the current word
- Pip indicators DO reflect past words on restore (green/salmon for already-completed words)

### Already-Played Revisit
- If today's puzzle is already complete, go directly to the results screen on load
- No "you've already played" splash — results are shown immediately
- One attempt per day — no replay option; today's result is locked

### Word Selection
- Use local date (YYYY-MM-DD string) as seed for deterministic selection
- Select 5 unique words from the filtered word list (no duplicates within a day)
- Same date = same 5 words, regardless of how many times the page is reloaded

### Debug Mode
- A `?debug` URL flag bypasses the "already played" check and allows replaying the current day's puzzle
- An optional `?debug&date=YYYY-MM-DD` flag overrides the date seed so specific days can be tested
- Debug mode does NOT show any visible indicator in the UI — it's purely a developer convenience
- Hard refresh (Ctrl+Shift+R) alone does NOT reset the puzzle — localStorage persists through cache clears

</decisions>

<specifics>
## Specific Ideas

- Pips should match the existing win/give-up color palette: green (#success color) for solved, salmon/dusty rose for given up — same as the flash colors used in win/lose states
- "Word X of 5" text should be small and unobtrusive — not competing with the VOWEL title or the board

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 06-daily-puzzle-engine*
*Context gathered: 2026-02-24*
