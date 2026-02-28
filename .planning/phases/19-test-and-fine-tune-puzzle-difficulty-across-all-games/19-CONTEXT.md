# Phase 19: Puzzle Difficulty Testing & Fine-Tuning - Context

**Gathered:** 2026-02-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Play-test each game's puzzle generation across a sample of dates, identify where difficulty feels wrong, and tune the parameters that control it — word lists, path lengths, quote selection, grid word curation, and debug tooling. VOWEL is excluded (feels fine). No new gameplay mechanics beyond the pre-reveal tweak to Cipher.

</domain>

<decisions>
## Implementation Decisions

### Debug Date-Jumping (all games)
- All games get a consistent URL param to override the puzzle date: `?date=2026-03-01`
- Works on hunt.html, ladder.html, and cipher.html using the same pattern
- Mirrors how VOWEL already works in debug mode

### Cipher — Difficulty Tuning
- **Two levers, both applied:**
  1. Filter quote corpus to prefer quotes with higher letter repetition (more duplicate letters = each solved letter reveals more of the puzzle)
  2. Pre-reveal 2–3 letters at game start to give players a head start
- Order: tackle Cipher first (pre-reveal is a meaningful UX change worth validating early)

### Ladder — Difficulty Tuning
- Shorten target path length from 4–6 steps to **3–4 steps**
- Core problem: long paths create too many intermediate possibilities for players to reason about — it's cognitively overwhelming, not just time-consuming
- Word quality is secondary; path length is the primary fix

### Hunt — Hard Words
- Hard words (3 words in phase 2) should feel like a moderate stretch: words players recognize but don't use often, AND/OR words that are tricky to spot in the grid — not obscure or unknown
- Easy words (phase 1) felt appropriately calibrated; no change needed there

### Testing Method
- Date-based debug URL param added to all games (consistent pattern)
- Ladder: optimal path printed to console in debug mode, not shown on screen — allows self-testing without spoiling
- Validation target: play through ~5 dates per game after tuning to confirm consistency
- Hunt/Cipher: jump to different dates to sample variety; no need to force specific categories

### Execution Order
1. Cipher (pre-reveal is highest-impact UX change)
2. Ladder (clear, known fix — shorten path)
3. Hunt (word curation — more subjective, benefits from seeing Cipher/Ladder done first)

### VOWEL
- Skip — feels fine as-is

</decisions>

<specifics>
## Specific Ideas

- Ladder: "too many possibilities to calculate" — the problem isn't the words, it's that players can't hold the search space in their head across 5+ hops
- Cipher: letter-repetition filter should be applied at puzzle generation time, not by editing the corpus manually
- Hunt hard words: "words of moderate difficulty but not too easy" — the sweet spot is a mild stretch, not a vocabulary test

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 19-test-and-fine-tune-puzzle-difficulty-across-all-games*
*Context gathered: 2026-02-28*
