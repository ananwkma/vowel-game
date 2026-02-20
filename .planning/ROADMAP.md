# Roadmap: Yellow Blocks Word Game

**Created:** 2026-02-19
**Depth:** Standard
**Coverage:** 15/15 v1 requirements mapped

---

## Phases

- [ ] **Phase 1: Game Foundation & Display** - Set up word engine, display puzzle structure with consonants and vowel slots
- [ ] **Phase 2: Block Manipulation & Vowel Selection** - Implement drag/click interaction and vowel picker
- [ ] **Phase 3: Game States & Win Conditions** - Validate words, handle win/lose states, auto-advance

---

## Phase Details

### Phase 1: Game Foundation & Display

**Goal:** Players see a playable puzzle with the correct word structure displayed (consonants locked as gray blocks, vowel count as yellow blocks).

**Depends on:** None (foundation)

**Requirements:** CORE-01, CORE-02, WORD-01, WORD-02, WORD-03, VIS-01, VIS-04, VIS-05, VIS-06

**Success Criteria** (observable user behaviors):
1. Random English word loads with consonants shown as gray blocks in order, vowel count as yellow blocks lined up (e.g., "_ _ C R W D")
2. Title "Move the Yellow Blocks to Form Words" displays top-left in bold black text
3. New word automatically loads when user completes previous puzzle (after win/give up state clears)
4. Only words with at least one A/E/I/O/U vowel appear in the rotation (no consonant-only words)
5. Teal/mint background (#4DC5C5 or similar) displays during active play (non-win, non-give-up states)

**Plans:** TBD

---

### Phase 2: Block Manipulation & Vowel Selection

**Goal:** Players can interactively drag/click yellow blocks into position and select vowels from a picker interface.

**Depends on:** Phase 1

**Requirements:** CORE-03, CORE-04, CORE-05, CORE-06

**Success Criteria** (observable user behaviors):
1. Player can drag a yellow block horizontally and drop it between, before, or after consonant blocks
2. On drop, a vertical A/E/I/O/U selection bar fades in adjacent to the dropped block
3. Player can click a vowel in the picker bar OR drag the block vertically to scroll through vowels and select one
4. When a vowel is selected, the bar fades out and the chosen letter appears in the yellow block (e.g., block shows "E")
5. Player can manipulate each yellow block independently (placing and selecting vowels in any order)

**Plans:** TBD

---

### Phase 3: Game States & Win Conditions

**Goal:** Game validates word constructions, provides immediate visual feedback (win/lose), and auto-advances to next puzzle.

**Depends on:** Phase 2

**Requirements:** CORE-07, CORE-08, CORE-09, WORD-04, VIS-02, VIS-03

**Success Criteria** (observable user behaviors):
1. When all yellow blocks are placed and contain selected vowels, game auto-checks if the constructed word is valid (any valid English word with the selected consonants in original order qualifies as a win)
2. Valid word match → background instantly flashes bright green, then auto-advances to the next random word after ~2 seconds
3. "Give Up" button press reveals the target word's correct vowels in yellow blocks, background turns salmon/red, then auto-advances after ~2 seconds
4. "Give Up" button is visible at bottom-center, styled with salmon/red color matching the give-up feedback state
5. Invalid word combinations (consonants in wrong order or no vowel selected) prevent auto-check and require player to rearrange blocks or press Give Up

**Plans:** TBD

---

## Progress Tracking

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Game Foundation & Display | 0/? | Not started | — |
| 2. Block Manipulation & Vowel Selection | 0/? | Not started | — |
| 3. Game States & Win Conditions | 0/? | Not started | — |

---

## Requirement Traceability

| Requirement | Phase | Category | Status |
|-------------|-------|----------|--------|
| CORE-01 | 1 | Core Gameplay | Pending |
| CORE-02 | 1 | Core Gameplay | Pending |
| CORE-03 | 2 | Core Gameplay | Pending |
| CORE-04 | 2 | Core Gameplay | Pending |
| CORE-05 | 2 | Core Gameplay | Pending |
| CORE-06 | 2 | Core Gameplay | Pending |
| CORE-07 | 3 | Core Gameplay | Pending |
| CORE-08 | 3 | Core Gameplay | Pending |
| CORE-09 | 3 | Core Gameplay | Pending |
| WORD-01 | 1 | Word Engine | Pending |
| WORD-02 | 1 | Word Engine | Pending |
| WORD-03 | 1 | Word Engine | Pending |
| WORD-04 | 3 | Word Engine | Pending |
| VIS-01 | 1 | Visuals | Pending |
| VIS-02 | 3 | Visuals | Pending |
| VIS-03 | 3 | Visuals | Pending |
| VIS-04 | 1 | Visuals | Pending |
| VIS-05 | 1 | Visuals | Pending |
| VIS-06 | 1 | Visuals | Pending |

**Coverage Summary:**
- Total v1 requirements: 15
- Mapped to phases: 15
- Unmapped: 0 ✓
- Orphaned requirements: 0 ✓

---

*Roadmap created: 2026-02-19*
