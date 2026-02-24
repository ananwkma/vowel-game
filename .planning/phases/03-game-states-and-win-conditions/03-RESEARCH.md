# Phase 3: Game States & Win Conditions - Research

**Researched:** 2026-02-20
**Domain:** Game state management, word validation, visual feedback, auto-advance
**Confidence:** HIGH

## Summary

Phase 3 completes the game loop by adding win/lose state detection, visual feedback, and automatic progression. The phase requires:

1. **Word Validation Logic** — Check if the constructed word exists in the embedded word list (any valid word with consonants in original order wins, not just the target).
2. **State Machine** — Track game phases: `playing`, `won`, `gaveup`.
3. **Visual Feedback** — Background flash (sage green on win, dusty rose on give-up), with ~2 second delay before auto-advance.
4. **Give Up Mechanism** — Reveal target word's vowels in yellow blocks, trigger lose state.
5. **Auto-advance** — After feedback period, load next puzzle.

The technical approach is straightforward: enhance the existing `gameState` object with validation, add background transition logic, and wire the "Give Up" button to the reveal+advance sequence. The existing implementation in `game.html` already contains the core of these features, but research confirms they align with requirements and identifies minor polish areas.

**Primary recommendation:** Use a Set-based dictionary for O(1) lookups. Ensure validation triggers on every drop but only acts when all slots are filled. Reposition or re-render blocks during "Give Up" reveal to show the target word in its correct form.

<user_constraints>
## User Constraints (from CONTEXT.md / STATE.md)

### Locked Decisions
- **Embedded word list:** No external API; validation uses the same `WORDS` array embedded in JS (WORD-04).
- **Any valid word wins:** Not just the target word — any word in the dictionary with the provided consonants in order qualifies (CORE-07, WORD-04).
- **Auto-advance timing:** ~2 seconds after win or give-up before loading next puzzle (CORE-08, CORE-09).
- **Single HTML file:** All logic must be inline JavaScript, no external assets.
- **Color Palette:** Sage green (#8BAF7C) for win state, Dusty rose (#C4836F) for give-up state (VIS-02, VIS-03).
- **Give Up Button:** Bottom-center, styled with give-up state color (VIS-06).

### Claude's Discretion
- **Animation timing:** Transition vs. instant flash. Recommendation: 0.3s - 0.5s CSS transition for background-color.
- **Reveal logic:** Whether to just fill blocks or move them to correct positions. Recommendation: Re-render board to show correct word structure.

### Deferred Ideas (OUT OF SCOPE)
- **Score tracking / Streaks:** v2 Enhancement (ENH-01, ENH-02).
- **Difficulty filter:** v2 Enhancement (ENH-03).
- **Hint system:** v2 Enhancement (ENH-04).
- **Timer:** Not in original design.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CORE-07 | When all blank blocks are placed AND each has a vowel selected, auto-check word | `checkWinCondition()` logic with `allHaveVowels` check |
| CORE-08 | Valid word → background turns bright green; auto-advance ~2s | `applyStateVisuals('won')` + `scheduleAutoAdvance(2000)` |
| CORE-09 | Give Up button → background turns salmon/red, target word revealed | `give-up-btn` listener + vowel reveal logic |
| WORD-04 | Valid word check uses same embedded word list | `WordSet = new Set(WORDS)` for O(1) validation |
| VIS-02 | Distinct win state background color (soft green) | CSS variables and `body.style.backgroundColor` updates |
| VIS-03 | Distinct give-up state background color (warm red/rose) | CSS variables and `body.style.backgroundColor` updates |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vanilla JavaScript (ES6+) | Native | Game logic, validation, timing | Single-file constraint; no build step |
| HTML5/CSS3 | Native | UI and animations | Platform standard |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Set API | Native | O(1) word validation | Always use for dictionary lookups |
| setTimeout | Native | Auto-advance timing | For the 2-second delay |

## Architecture Patterns

### Pattern 1: Set-Based Dictionary Lookup
Convert the `WORDS` array to a `Set` on initialization for maximum performance during validation.
```javascript
const WordSet = new Set(WORDS);
function isValid(word) { return WordSet.has(word.toUpperCase()); }
```

### Pattern 2: State-Locked Interaction
Prevent players from interacting with blocks or the "Give Up" button during the 2-second feedback window.
```javascript
function onPointerDown(e) {
  if (gameState.phase !== 'playing') return;
  // ...
}
```

### Pattern 3: Clean Reveal Logic
When giving up, the word should be shown in its correct structure (vowels interleaved with consonants correctly).
```javascript
function revealTargetWord() {
  // Option A: Update existing block textContent (simple)
  // Option B: Re-render the board using gameState.currentWord (accurate)
}
```

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Word Lookup | Linear search (`includes`) | `Set.has()` | Performance on 1000+ words |
| Animation | JS-based position loops | CSS Transitions | Performance and smoother rendering |
| Timing Overlaps | Multiple independent timers | Single `advanceTimer` with `clearTimeout` | Prevents race conditions / double-advances |

## Common Pitfalls

### Pitfall 1: Overlapping Auto-Advances
**What goes wrong:** Multiple `initGame()` calls occur if a player manages to trigger win/lose states twice rapidly.
**Prevention:** Use a singleton `advanceTimer` and clear it before setting. Lock the `gameState.phase` immediately.

### Pitfall 2: Inaccurate Give-Up Reveal
**What goes wrong:** Filling yellow blocks in their current positions doesn't always "reveal the target word" correctly if blocks are in the wrong slots.
**Prevention:** Either re-render the board or calculate correct indices based on `gameState.currentWord`.

### Pitfall 3: Case Sensitivity
**What goes wrong:** Dictionary has 'APPLE', constructed word is 'apple' -> lookup fails.
**Prevention:** Always `.toUpperCase()` both dictionary and user input.

## Code Examples

### Word Validation Trigger
```javascript
function checkWinCondition() {
  if (gameState.phase !== 'playing') return;
  
  const blocks = Array.from(board.children);
  const word = blocks.map(b => b.textContent.trim()).join('').toUpperCase();
  
  if (!word.includes('_') && WordSet.has(word)) {
    transitionTo('won');
  }
}
```

### State Visuals
```javascript
function applyStateVisuals(phase) {
  const body = document.body;
  body.style.transition = 'background-color 0.5s ease';
  if (phase === 'won') body.style.backgroundColor = '#8BAF7C';
  else if (phase === 'gaveup') body.style.backgroundColor = '#C4836F';
  else body.style.backgroundColor = '#F8F7F4';
}
```

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Native APIs only.
- Architecture: HIGH - State machine pattern is robust.
- Pitfalls: HIGH - Well-known race conditions in game loops.

**Research date:** 2026-02-20
**Valid until:** 2026-03-20
