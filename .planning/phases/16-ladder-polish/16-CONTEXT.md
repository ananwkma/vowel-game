# Phase 16: Ladder Polish - Context

**Gathered:** 2026-02-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Fix puzzle quality issues in Word Ladder identified after launch. Scope: expand the PUZZLE_WORDS common-word pool, tighten the optimal step range, and add a cap on the common-word path length. No new game features — only puzzle selection improvements.

</domain>

<decisions>
## Implementation Decisions

### Step Range
- Tighten optimal path length from 3–7 steps to **4–6 steps** (path.length 5–7 words)
- Removes trivially easy 3-step puzzles and marathon 7-step puzzles
- Fallback puzzle (STONE→CRANE) must also satisfy this range or be replaced

### Common-Word Path Cap
- The COMMON_ADJACENCY path (already required to exist) must be **≤10 steps**
- Prevents puzzles where the common-word route is technically possible but absurdly long
- Implementation: check `commonPath.length <= 11` (11 words = 10 steps)

### PUZZLE_WORDS Expansion
- Expand from ~350 to a larger pool of common 5-letter words
- Bar: any word a typical adult would know without hesitation (common nouns, verbs, adjectives — nothing needing a dictionary)
- No extra constraints on start/target words beyond being in PUZZLE_WORDS
- Goal: increase puzzle variety so the seeded search finds better pairs more reliably
- Claude decides the exact words to add using good judgment

### Attempt Limit
- Keep at 50 — fallback to STONE→CRANE is acceptable if no qualifying puzzle found

### Claude's Discretion
- Exact words to add to PUZZLE_WORDS (target a meaningful expansion, ~200+ additional words)
- Whether to update the STONE→CRANE fallback to a pair that better satisfies the new 4–6 step constraint
- Any minor code cleanup in getDailyLadderPuzzle() to reflect the new constraints

</decisions>

<specifics>
## Specific Ideas

- The common-word path guarantee was already shipped (COMMON_ADJACENCY check) — this phase tightens it with the ≤10 step cap
- Tightening step range to 4–6 is the primary difficulty fix; PUZZLE_WORDS expansion increases variety so the stricter filter still finds enough candidates

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 16-ladder-polish*
*Context gathered: 2026-02-27*
