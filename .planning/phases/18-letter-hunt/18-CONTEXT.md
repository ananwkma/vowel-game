# Phase 18: Letter Hunt - Context

**Gathered:** 2026-02-27
**Status:** Ready for planning

<domain>
## Phase Boundary

A daily word-search puzzle where players drag to highlight letters and find 6 hidden words (3 easy + 3 hard) belonging to a mystery category. The category name is hidden during the easy words to avoid making them too easy — it reveals with a stamp animation after all 3 easy words are found, then helps the player find the 3 harder words. Each half is independently timed. A hint system lets players reveal one word's first letter at the cost of a time penalty.

</domain>

<decisions>
## Implementation Decisions

### Grid & Word Placement
- **Size:** Start with 10×10; fall back to 8×8 if cells are too small on mobile
- **Directions:** Horizontal, vertical, and diagonal — no reverse/backwards words
- **Filler letters:** Random (standard word-search approach)
- **Word difficulty distinction:** Easy and hard words are similar length; difficulty comes from word familiarity and placement, not length. Hard words are rarer/less obvious.

### Lasso Selection Mechanics
- **Interaction:** Drag highlights individual letter cells one by one as finger/cursor passes over them (snaps to cells, not freeform)
- **Visual feedback during drag:** Both cells highlight (amber) AND a line traces the path simultaneously
- **Correct word found:** Letters lock in sage green (#8BAF7C), matching other games' success color
- **Wrong selection:** Selection shakes then dissolves/fades out silently (no score penalty, just visual feedback)
- **Already-found words:** Dim to a subtle tint after found (keep grid readable); option to stay fully highlighted is open if dim feels hard to read

### Progress Indicator
- Colored pips at top of game (like VOWEL) — grey for not found, green for found
- Red pips indicate words that were found using a hint
- 6 pips total (3 easy + 3 hard), or split into two groups of 3

### Two-Phase Flow & Category Reveal
- No explicit "Phase 1 / Phase 2" UI — just 3 easy words and 3 hard words in one continuous game
- During easy words: category name shows as "???" — total mystery
- After all 3 easy words found: category name reveals with a big stamp/pop animation (consistent with collection's success moments)
- Hard phase timer starts immediately after reveal — no pause or interstitial button
- Easy timer and hard timer run independently (easy stops when 3rd easy word is found; hard starts from that moment)

### Hint System
- **Interaction:** Tap a hint button — briefly highlights the first letter of one unfound word
- **Quantity:** Unlimited hints, but each hint adds a time penalty to the score
- **Results tracking:** Words found after using a hint are indicated with red pips on the results screen

### Scoring
- **Score = time only** — two separate times: time to find all 3 easy words, and time to find all 3 hard words
- Hint time penalties are added to whichever phase timer the hint was used in

### Results Screen
- Matches exact layout and style of cipher/ladder: LEXICON top-left, HUNT title top-center, ? top-right, share button
- Content shows: easy time + hard time + revealed category name + all 6 words listed
- Pip summary showing which words were found cleanly (green) vs with hints (red)
- Hub completion: writing to `wordGames_dailyStatus` marks Hunt as complete for the day; finding all 6 words counts (hints allowed; even give-up counts)

### Claude's Discretion
- Exact pip layout (6 in a row vs split 3+3)
- Time penalty amount per hint
- Animation details for the category reveal stamp
- Exact color/style of the drag-trace line
- How "give up" manifests (since there's no hold button, likely a different interaction)

</decisions>

<specifics>
## Specific Ideas

- Pip system should feel similar to VOWEL's progress pips — familiar to players who've played that game
- The category reveal is a key "aha" moment — the stamp animation should feel earned and satisfying
- Grid interaction should feel natural on mobile (finger drag over cells)

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 18-letter-hunt*
*Context gathered: 2026-02-27*
