# Phase 15: Word Ladder - Context

**Gathered:** 2026-02-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the daily Word Ladder game (ladder.html). Player changes one letter at a time from a start word to a target word. Every intermediate step must be a valid dictionary word. Shows path history as play progresses, animated stamp-style. After completing or giving up, reveals the BFS optimal path. No timer — pure step count.

</domain>

<decisions>
## Implementation Decisions

### Word entry mechanic
- Current word is displayed as a row of selectable letter tile blocks
- Tapping a tile highlights it (amber border/glow) and opens the mobile keyboard — player types one character to replace that letter
- Only ONE tile can be changed at a time: tapping a different tile resets the previously changed tile back to its original letter (only one pending change at any moment)
- Full-width Submit button below the tile row — easy tap target on mobile
- Invalid submission (not in dictionary, or somehow changed 0 or 2+ letters): shake animation on the tile row + inline error message below tiles (e.g. "Not a valid word" or "Change exactly one letter")

### Path history display
- Layout: target word anchored at top (always visible), active input tiles below it, path history grows downward below the input
- When a valid word is submitted, the active tiles animate upward briefly (~20-30px pop, 300-400ms smooth glide) then settle, leaving a copy of the accepted word as a new history entry below the input
- The "stamp" metaphor: tiles press upward, the mark they leave behind is the history entry
- Each history entry shows: just the word (clean, no step numbers)
- Start word is the first history entry — scrolls off as the path grows
- Target word stays anchored at the top throughout the game
- No step limit — scroll as long as needed

### Give Up button
- Small, subdued button below the Submit button — low visual weight (muted text or secondary color)
- Visually separated from Submit (adequate spacing — not adjacent/easily confused)
- Requires a 3-second hold to activate: button fills left-to-right like a loading bar during hold; releasing early cancels without triggering give-up
- Loading bar fill color: a warm dusty-rose/warning color (--color-warning from design tokens) to signal irreversibility
- No confirmation modal needed — the hold mechanic IS the confirmation

### On give-up
- Animate the optimal BFS path filling in step by step (each word appears sequentially with brief delay ~300ms each)
- Then transition to the results screen

### Win condition
- Exact target word only — no partial credit, no auto-complete at 1 step away

### Timer
- No timer — Word Ladder is purely step-count-based. Untimed, relaxed pace.

### Results screen
- After normal solve: "Solved in X steps (+N from optimal)" — shows delta from optimal
  - If N = 0 (optimal solve): confetti burst + label "Optimal!" — same confetti system as VOWEL
  - If N > 0: offer a "Try again" button to replay the same daily puzzle (re-attempts allowed, no personal best tracking — just for fun/self-improvement)
- After give-up: optimal path animation plays first, then results screen with "X steps remaining" or step count summary
- Share button: copies a text representation of the result to clipboard (e.g. "Word Ladder 2026-02-26 | COLD → WARM | Solved in 7 steps (+2 from optimal)")
- Back to hub button: "← Word Games" or "← Back" linking to index.html

### Personal best — DESCOPED
- LADR-04 (personal best tracking in localStorage) is NOT being implemented. No personal best stored or displayed. Try Again is purely for self-improvement within the session.

### Daily completion status
- On puzzle completion (solve or give-up → results screen reached): write to `wordGames_dailyStatus` localStorage key: `{ ladder: { completed: true, dateKey: today, timestamp: now } }` so the hub dims the Word Ladder card

### Claude's Discretion
- Exact CSS for the tile highlight state (border glow, box-shadow, or background shift)
- Exact spacing between Submit and Give Up buttons
- History scroll behavior (whether newest entry is nearest the input or at the bottom)
- How the optimal path animation looks when revealed after give-up (fade in per word vs slide in)
- Clipboard share text format details

</decisions>

<specifics>
## Specific Ideas

- The "stamp" animation is a key UX moment: tiles pop upward like pressing a stamp, and the word is "printed" into the history below. Should feel satisfying and weighty — not just a list append.
- The 3-second hold to give up eliminates accidental taps without a modal interruption. The loading bar fill is the visual feedback.
- Word Ladder is the more relaxed of the three games (no timer) — animations can be slightly slower/more deliberate than VOWEL's snappy transitions.

</specifics>

<deferred>
## Deferred Ideas

- Share buttons for VOWEL (Phase 14 — already shipped) and Letter Hunt (Phase 16) — noted for a future cleanup/enhancement phase
- Personal best tracking (LADR-04 descoped) — could be revisited in a future milestone if the mechanic proves interesting
- Try-again tracking (how many attempts today) — not in scope, just allow unlimited replays

</deferred>

---

*Phase: 15-word-ladder*
*Context gathered: 2026-02-26*
