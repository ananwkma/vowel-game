# Roadmap: Word Game Collection

## Milestones

- ✅ **v1.0 MVP** — Phases 1–5 (shipped 2026-02-23)
- ✅ **v1.1 Score, Streaks & Mobile Polish** — Phases 6–9 (shipped 2026-02-24)
- ✅ **v1.2 Daily Leaderboard & Backend Stats** — Phases 10–13 (shipped 2026-02-25)
- 🚧 **v2.0 Word Game Collection** — Phases 14–18 (in progress)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1–5) — SHIPPED 2026-02-23</summary>

See .planning/milestones/v1.0-ROADMAP.md

</details>

<details>
<summary>✅ v1.1 Score, Streaks & Mobile Polish (Phases 6–9) — SHIPPED 2026-02-24</summary>

See .planning/milestones/v1.1-ROADMAP.md

</details>

<details>
<summary>✅ v1.2 Daily Leaderboard & Backend Stats (Phases 10–13) — SHIPPED 2026-02-25</summary>

See .planning/milestones/v1.2-ROADMAP.md

</details>

### 🚧 v2.0 Word Game Collection (In Progress)

**Milestone Goal:** Expand from a single VOWEL game into a four-game collection with a unified portal hub, Word Ladder, Cipher, and Letter Hunt.

- [x] **Phase 14: Hub + VOWEL Migration** — Portal hub with card navigation; VOWEL relocated to vowel.html with shared design tokens and hash-based routing (completed 2026-02-26)
- [x] **Phase 15: Word Ladder** — Daily start-to-target word puzzle with BFS optimal path, path history, and results reveal (completed 2026-02-27)
- [x] **Phase 16: Ladder Polish** — Bug fixes and UX improvements to Word Ladder identified post-launch (completed 2026-02-27)
- [x] **Phase 17: Cipher** — Daily famous quote encoded as a number substitution cipher; players tap number blocks and type letters to decode the quote (completed 2026-02-27)
- [ ] **Phase 18: Letter Hunt** — Daily word-search grid with Canvas lasso selection, mystery category reveal, and two-phase timed scoring

## Phase Details

### Phase 14: Hub + VOWEL Migration
**Goal**: Players can access all three games from a central portal and play VOWEL from its new location
**Depends on**: Phase 13 (v1.2 complete)
**Requirements**: HUB-01, HUB-02, HUB-03, HUB-04, HUB-05
**Success Criteria** (what must be TRUE):
  1. User can open index.html and see three game cards (VOWEL, Word Ladder, Letter Hunt) in the same warm aesthetic as the current game
  2. User can tap or click any game card and land on that game's page
  3. User can see on the hub which of today's daily puzzles they have already completed, without logging in
  4. VOWEL loads from vowel.html and plays with identical functionality — same words, same timer, same scoring, same personal best — as the old index.html
  5. All game pages share the same CSS design tokens (colors, fonts, spacing) so the collection feels visually unified
**Plans**: 3 plans

Plans:
- [x] 14-01-PLAN.md — Extract shared CSS design tokens to styles/design-tokens.css
- [x] 14-02-PLAN.md — Build hub portal (index.html) with game cards and daily status; create ladder.html and hunt.html placeholders
- [x] 14-03-PLAN.md — Migrate VOWEL to vowel.html with back button and daily completion status write

### Phase 15: Word Ladder
**Goal**: Players can play a daily Word Ladder puzzle — changing one letter at a time from start to target — and see how their path compares to the optimal solution
**Depends on**: Phase 14
**Requirements**: LADR-01, LADR-02, LADR-03, LADR-05 (LADR-04 descoped per user decision)
**Success Criteria** (what must be TRUE):
  1. User can play today's Word Ladder puzzle and every player on the same day sees the same start and target words
  2. User's word entry is rejected if it is not a valid dictionary word or if it differs from the previous word by more or fewer than one letter
  3. User can see a scrollable path history of every word they have entered so far, in order from start toward target
  4. After solving or giving up, user can see the shortest possible solution computed by BFS alongside their own path
**Plans**: 3 plans

Plans:
- [x] 15-01-PLAN.md — HTML skeleton, CSS layout, dictionary engine (adjacency map, BFS, daily puzzle seed)
- [x] 15-02-PLAN.md — Tile interaction, word submission validation, stamp animation, path history, give-up hold
- [x] 15-03-PLAN.md — Results screen (win/give-up), optimal path animation, confetti, share, try again, hub integration

### Phase 16: Ladder Polish
**Goal**: Puzzle engine produces consistently playable Word Ladder puzzles with 4–6 step difficulty, a guaranteed common-word solution path of ≤10 steps, and a working fallback pair
**Depends on**: Phase 15
**Requirements**: LADR-POLISH-01, LADR-POLISH-02, LADR-POLISH-03, LADR-POLISH-04
**Success Criteria** (what must be TRUE):
  1. Word Ladder puzzles are consistently 4-6 steps in optimal length (path.length 5-7)
  2. Every puzzle has a guaranteed common-word solution path of ≤ 10 steps (commonPath.length <= 11)
  3. Fallback puzzle (SCARE -> STILL) is valid and playable
  4. Puzzle variety is increased due to expanded word pool (~437 to ~667 words)
**Plans**: 1 plan

Plans:
- [x] 16-01-PLAN.md — Expand PUZZLE_WORDS (~437→667 words), tighten step range to 4–6, add common-path ≤10 step cap, replace broken STONE→CRANE fallback with SCARE→STILL

### Phase 17: Cipher
**Goal**: Players decode a daily famous quote presented as a number substitution cipher — each unique letter maps to a unique number — by selecting number blocks and typing the corresponding letters until the full quote is revealed
**Depends on**: Phase 16
**Requirements**: CIPH-01, CIPH-02, CIPH-03, CIPH-04, CIPH-05
**Success Criteria** (what must be TRUE):
  1. Every player on the same day sees the same famous quote encoded with the same number-to-letter mapping (daily seed)
  2. Player can tap a number block to select it, then type a letter to assign it; that letter fills in for every occurrence of that number across the entire quote
  3. Correctly solved letters are visually distinguished from unsolved number blocks and incorrectly guessed letters
  4. When all numbers are correctly decoded, the full quote is revealed and the game is won
  5. Completed state is written to the hub's daily status so the Cipher card shows as done
**Plans**: 2 plans

Plans:
- [x] 17-01-PLAN.md — cipher.html skeleton, CSS, quote corpus, daily-seeded engine, DOM rendering; disabled Cipher hub card
- [x] 17-02-PLAN.md — Block selection, letter assignment, win detection, win screen, hub integration (enable Cipher card)

### Phase 18: Letter Hunt
**Goal**: Players can play a daily word-search puzzle — circling hidden words with a lasso — with a mystery category that reveals itself mid-game and separate scores for the easy and hard phases
**Depends on**: Phase 16
**Requirements**: HUNT-01, HUNT-02, HUNT-03, HUNT-04, HUNT-05
**Success Criteria** (what must be TRUE):
  1. User can play today's Letter Hunt puzzle and every player on the same day sees the same grid and words
  2. User can click-and-drag to draw a lasso around letters; correctly encircled category words stay highlighted, incorrect selections dissolve without penalty
  3. After finding all 3 easy words, the mystery category name is revealed before the hard phase begins
  4. User can see separate timers and scores for the easy phase and the hard phase
  5. The grid contains exactly 6 hidden words (3 easy + 3 hard) belonging to a shared mystery category
**Plans**: 3 plans

Plans:
- [ ] 18-01-PLAN.md — hunt.html skeleton, CSS, 20+ word category corpus, seeded puzzle engine, grid generation and initial render
- [ ] 18-02-PLAN.md — Drag selection (Pointer Events + canvas trace), phase state machine, category reveal stamp, two-phase timers, hint system
- [ ] 18-03-PLAN.md — Results screen, persistence, confetti, share, hub card activation, end-to-end human verification

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1–5. Foundation → Mobile | v1.0 | 18/18 | Complete | 2026-02-23 |
| 6–9. Daily Engine → Mobile Fixes | v1.1 | 6/6 | Complete | 2026-02-24 |
| 10. Research & Architecture | v1.2 | — | Complete | 2026-02-24 |
| 11. Backend Implementation | v1.2 | 3/3 | Complete | 2026-02-24 |
| 12. Frontend Integration | v1.2 | 1/1 | Complete | 2026-02-25 |
| 13. Local Verification | v1.2 | 2/2 | Complete | 2026-02-25 |
| 14. Hub + VOWEL Migration | v2.0 | 3/3 | Complete | 2026-02-26 |
| 15. Word Ladder | v2.0 | 3/3 | Complete | 2026-02-27 |
| 16. Ladder Polish | v2.0 | Complete    | 2026-02-27 | 2026-02-27 |
| 17. Cipher | v2.0 | 2/2 | Complete | 2026-02-27 |
| 18. Letter Hunt | 2/3 | In Progress|  | - |

### Phase 19: Test and fine-tune puzzle difficulty across all games

**Goal:** [To be planned]
**Depends on:** Phase 18
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd:plan-phase 19 to break down)

---
*Roadmap created: 2026-02-19*
*Last updated: 2026-02-27 — Phase 18 = Letter Hunt (planned, 3 plans)*
