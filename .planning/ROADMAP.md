# Roadmap: Yellow Blocks Word Game

**Created:** 2026-02-19
**Depth:** Standard
**Coverage:** 22/22 v1 requirements mapped

---

## Phases

- [x] **Phase 1: Game Foundation & Display** - Set up word engine, display puzzle structure with consonants and vowel slots
- [x] **Phase 2: Block Manipulation & Vowel Selection** - Implement drag/click interaction and vowel picker
- [x] **Phase 3: Game States & Win Conditions** - Validate words, handle win/lose states, auto-advance
- [x] **Phase 4: Animation Enhancements** - Introduce subtle animations for key interactions (1/3 plans complete)

---

## Phase Details

### Phase 1: Game Foundation & Display

**Goal:** Players see an elegant puzzle display — title "Vowel" in serif, warm off-white background, amber vowel placeholder blocks on the left, charcoal consonant blocks on the right, dusty rose Give Up button at bottom.

**Depends on:** None (foundation)

**Requirements:** CORE-01, CORE-02, WORD-01, WORD-02, WORD-03, VIS-01, VIS-04, VIS-05, VIS-06

**Success Criteria** (observable user behaviors):
1. Random English word loads with consonants shown as charcoal blocks in order, vowel count as amber placeholder blocks on the left (e.g., "_ _ C R W D")
2. Title "VOWEL" displays in elegant Playfair Display serif font
3. Only words with at least one A/E/I/O/U vowel appear in the rotation (no consonant-only words)
4. Warm off-white background (#F8F7F4 or similar) displays during active play
5. All color combinations meet WCAG AA contrast standards (4.5:1 minimum for text)

**Plans:** 3 plans

Plans:
- [x] 01-01-PLAN.md — Word engine: HTML skeleton, 1000+ word list, WordEngine module (WORD-01, WORD-02, WORD-03)
- [x] 01-02-PLAN.md — Visual display: CSS design system, game state, board rendering, init (CORE-01, CORE-02, VIS-01, VIS-04, VIS-05, VIS-06)
- [x] 01-03-PLAN.md — Human verification: confirm elegant display before Phase 2

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

**Plans:** 8 plans

Plans:
- [x] 02-01-PLAN.md — Core drag-and-drop mechanics using Pointer Events (CORE-03)
- [x] 02-02-PLAN.md — Accessible Vowel Picker UI component (CORE-05)
- [x] 02-03-PLAN.md — Integrate Drag-and-Drop with Vowel Picker (CORE-04, CORE-06)
- [x] 02-04-PLAN.md — Human verification of the complete interaction flow
- [x] 02-05-PLAN.md — Refine drag movement and picker activation (CORE-03, CORE-04, CORE-05)
- [x] 02-06-PLAN.md — Fix block snapping, vertical movement, and vowel display (CORE-03, CORE-04, CORE-05)
- [x] 02-07-PLAN.md — Activate picker on drop & overlay (CORE-04, CORE-05)
- [x] 02-08-PLAN.md — Vertical scroll refinement and interaction polish (CORE-03, CORE-04, CORE-05)

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

**Plans:** 2/2 plans complete

Plans:
- [x] 03-01-PLAN.md — Implement word validation, win/lose states, Give Up button, and auto-advance (CORE-07, CORE-08, CORE-09, WORD-04, VIS-02, VIS-03)
- [x] 03-02-PLAN.md — Final verification and QA (CORE-01 through VIS-06)

---

### Phase 4: Animation Enhancements

**Goal:** Introduce subtle animations for key interactions to enhance polish and user feedback.

**Depends on:** Phase 3

**Requirements:** VIS-07, VIS-08, VIS-09

**Success Criteria** (observable user behaviors):
1. Vowel picker appears and disappears with a smooth fade-in/fade-out animation.
2. Dropped vowel blocks subtly "bounce" or settle into place instead of snapping rigidly.
3. New game words "swipe" or transition in smoothly instead of an instant appearance.

**Plans:** 3 plans

Plans:
- [x] 04-01-PLAN.md — Vowel picker fades in/out (VIS-07)
- [x] 04-02-PLAN.md — Vowel blocks bounce on snap (VIS-08)
- [x] 04-03-PLAN.md — New words swipe in (VIS-09)

---

## Progress Tracking

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Game Foundation & Display | 3/3 | Complete | 2026-02-19 |
| 2. Block Manipulation & Vowel Selection | 8/8 | Complete | 2026-02-19 |
| 3. Game States & Win Conditions | 2/2 | Complete   | 2026-02-20 |
| 4. Animation Enhancements | 3/3 | Complete | 2026-02-20 |

---

## Requirement Traceability

| Requirement | Phase | Category | Status |
|-------------|-------|----------|--------|
| CORE-01 | 1 | Core Gameplay | Implemented |
| CORE-02 | 1 | Core Gameplay | Implemented |
| CORE-03 | 2 | Core Gameplay | Implemented |
| CORE-04 | 2 | Core Gameplay | Implemented |
| CORE-05 | 2 | Core Gameplay | Implemented |
| CORE-06 | 2 | Core Gameplay | Implemented |
| CORE-07 | 3 | Core Gameplay | Implemented |
| CORE-08 | 3 | Core Gameplay | Implemented |
| CORE-09 | 3 | Core Gameplay | Implemented |
| WORD-01 | 1 | Word Engine | Implemented |
| WORD-02 | 1 | Word Engine | Implemented |
| WORD-03 | 1 | Word Engine | Implemented |
| WORD-04 | 3 | Word Engine | Implemented |
| VIS-01 | 1 | Visuals | Implemented |
| VIS-02 | 3 | Visuals | Implemented |
| VIS-03 | 3 | Visuals | Implemented |
| VIS-04 | 1 | Visuals | Implemented |
| VIS-05 | 1 | Visuals | Implemented |
| VIS-06 | 1 | Visuals | Implemented |
| VIS-07 | 4 | Visuals | Implemented |
| VIS-08 | 4 | Visuals | Implemented |
| VIS-09 | 4 | Visuals | Implemented |

**Coverage Summary:**
- Total v1 requirements: 22
- Mapped to phases: 22
- Unmapped: 0 ✓
- Orphaned requirements: 0 ✓

---

*Roadmap created: 2026-02-19*
*Updated: 2026-02-20 — Phase 3 plans created, Phase 3 completed, Phase 4 added*
*Updated: 2026-02-21 — Phase 4 plans created*
