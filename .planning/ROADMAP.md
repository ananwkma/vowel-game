# Roadmap: Yellow Blocks Word Game (VOWEL)

## Milestones

- ✅ **v1.0 MVP** — Phases 1–5 (shipped 2026-02-23)
- 🚧 **v1.1 Score, Streaks & Mobile Polish** — Phases 6–9 (in progress)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1–5) — SHIPPED 2026-02-23</summary>

- [x] **Phase 1: Game Foundation & Display** — completed 2026-02-20
- [x] **Phase 2: Block Manipulation & Vowel Selection** — completed 2026-02-23
- [x] **Phase 3: Game States & Win Conditions** — completed 2026-02-20
- [x] **Phase 4: Animation Enhancements** — completed 2026-02-23
- [x] **Phase 5: Mobile Optimization** — completed 2026-02-23

Full archive: `.planning/milestones/v1.0-ROADMAP.md`

</details>

### 🚧 v1.1 Score, Streaks & Mobile Polish (In Progress)

**Milestone Goal:** Replace infinite random mode with a daily 5-word puzzle, add a timer with penalty scoring, show a results screen on completion, and fix two mobile UX regressions.

- [ ] **Phase 6: Daily Puzzle Engine** - Replace infinite mode with deterministic daily 5-word structure and localStorage persistence
- [ ] **Phase 7: Timer & Penalty System** - Add elapsed timer, Give Up penalty countdown, and penalty accumulation
- [ ] **Phase 8: Results Screen** - Show final time and return-tomorrow prompt after puzzle completion
- [ ] **Phase 9: Mobile Fixes** - Fix Dynamic Island title spacing and dragged-block vertical offset

## Phase Details

### Phase 6: Daily Puzzle Engine
**Goal**: Players get exactly 5 deterministic puzzle words per day, with completed state persisted so revisiting shows the results screen
**Depends on**: Phase 5 (v1.0 complete)
**Requirements**: DP-01, DP-02, DP-03
**Success Criteria** (what must be TRUE):
  1. Opening the game on any given day always shows the same 5 words in the same order
  2. After completing the 5th word (win or give up), the game stops and does not advance to a 6th word
  3. Reloading the page mid-puzzle resumes at the correct word position with prior state intact
  4. Completing the puzzle and then reopening the page goes directly to the results screen without replaying
**Plans**: 3 plans

Plans:
- [ ] 06-01-PLAN.md — DailyEngine: deterministic PRNG + 5-word daily selection + debug URL flags
- [ ] 06-02-PLAN.md — puzzleState persistence + game-end condition + initGame() wired to daily words
- [ ] 06-03-PLAN.md — Progress indicator UI (Word X of 5 + pip dots) + already-played redirect + human verify

### Phase 7: Timer & Penalty System
**Goal**: Players can track their total solve time, and pressing Give Up costs them a penalty based on how long they waited
**Depends on**: Phase 6
**Requirements**: TIM-01, TIM-02, TIM-03, TIM-04, TIM-05
**Success Criteria** (what must be TRUE):
  1. A timer is visible and counting up from 0:00 when the first word appears
  2. The Give Up button shows a number counting down from 60 while it decrements each second
  3. When the countdown reaches 0, the number disappears and pressing Give Up adds no penalty
  4. Pressing Give Up while the countdown shows a number adds that number to the elapsed timer
  5. Each new word resets the Give Up countdown to 60 and starts it again
**Plans**: TBD

### Phase 8: Results Screen
**Goal**: Players see their final total time and a prompt to return tomorrow after completing all 5 puzzles
**Depends on**: Phase 7
**Requirements**: RES-01, RES-02
**Success Criteria** (what must be TRUE):
  1. After the 5th word completes, a results screen displays the total elapsed time including all penalties
  2. The results screen shows a message indicating the next puzzle is available tomorrow
**Plans**: TBD

### Phase 9: Mobile Fixes
**Goal**: The game title is fully visible on notch/Dynamic Island devices, and dragged blocks track the finger center precisely
**Depends on**: Phase 5 (independent of Phases 6–8, but executed last to avoid disrupting game loop work)
**Requirements**: FIX-01, FIX-02
**Success Criteria** (what must be TRUE):
  1. On a device with a Dynamic Island or notch, the "VOWEL" title is not obscured and has visible space above it
  2. When dragging a block on mobile, the block center aligns with the finger — no upward or downward offset
**Plans**: TBD

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Game Foundation & Display | v1.0 | 3/3 | Complete | 2026-02-20 |
| 2. Block Manipulation & Vowel Selection | v1.0 | 8/8 | Complete | 2026-02-23 |
| 3. Game States & Win Conditions | v1.0 | 2/2 | Complete | 2026-02-20 |
| 4. Animation Enhancements | v1.0 | 3/3 | Complete | 2026-02-23 |
| 5. Mobile Optimization | v1.0 | 2/2 | Complete | 2026-02-23 |
| 6. Daily Puzzle Engine | 1/3 | In Progress|  | - |
| 7. Timer & Penalty System | v1.1 | 0/TBD | Not started | - |
| 8. Results Screen | v1.1 | 0/TBD | Not started | - |
| 9. Mobile Fixes | v1.1 | 0/TBD | Not started | - |

---

*Roadmap created: 2026-02-19*
*v1.0 archived: 2026-02-23*
*v1.1 roadmap added: 2026-02-24*
