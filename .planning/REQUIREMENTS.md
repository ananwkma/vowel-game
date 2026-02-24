# Requirements: v1.1 — Score, Streaks & Mobile Polish

**Milestone:** v1.1
**Status:** Active
**Created:** 2026-02-24

---

## v1.1 Requirements

### Daily Puzzle

- [x] **DP-01**: Each calendar day provides exactly 5 puzzle words, deterministically chosen using the local date (YYYY-MM-DD) as a seed — the same 5 words appear all day on reload
- [x] **DP-02**: After the 5th word is completed (solved or given up), the game ends and the results screen is shown
- [x] **DP-03**: Today's completed result is saved to localStorage — revisiting after completing goes straight to the results screen

### Timer & Scoring

- [x] **TIM-01**: A visible elapsed timer runs from 0:00 when the first word appears, stopping when the puzzle is complete
- [x] **TIM-02**: The Give Up button displays a per-word penalty countdown starting at 60, decrementing by 1 per second
- [x] **TIM-03**: When the countdown reaches 0, the number disappears and Give Up is "free" (no penalty)
- [x] **TIM-04**: Pressing Give Up adds the currently displayed countdown value to the elapsed timer as a penalty, then advances to the next word
- [x] **TIM-05**: The Give Up countdown resets to 60 and restarts when each new word appears

### Results Screen

- [ ] **RES-01**: Results screen shows the player's final total time (elapsed + all accumulated penalties)
- [ ] **RES-02**: Results screen shows a "come back tomorrow" prompt (leaderboard/comparison is a future milestone)

### Mobile Fixes

- [ ] **FIX-01**: "VOWEL" title has top padding accounting for Dynamic Island / notch (`env(safe-area-inset-top)`)
- [ ] **FIX-02**: Dragged block center aligns with finger during drag — no vertical offset on mobile

---

## Future Requirements (Deferred)

- **ENH-03**: Difficulty filter (short words vs. long words)
- **ENH-04**: Hint system (reveal one vowel)
- **ACC-01**: Allow user scaling (pinch-zoom) for visually impaired users
- **LEA-01**: Results screen shows comparison against average time and percentile rank (requires backend)

---

## Out of Scope

- Real-time leaderboard or backend storage — single-file constraint, deferred to future milestone
- Streak counter across days — deferred; daily format makes session streaks less meaningful
- Shareable results (Wordle-style emoji grid) — future milestone
- Timer/countdown — adds stress without value *(note: the Give Up countdown is a penalty mechanic, not a deadline)*

---

## Traceability

| Requirement | Phase | Plan |
|-------------|-------|------|
| DP-01       | Phase 6   | 06-01  |
| DP-02       | Phase 6   | 06-02  |
| DP-03       | Phase 6   | 06-03  |
| TIM-01      | Phase 7   | 07-01  |
| TIM-02      | Phase 7   | TBD  |
| TIM-03      | Phase 7   | TBD  |
| TIM-04      | Phase 7   | TBD  |
| TIM-05      | Phase 7   | TBD  |
| RES-01      | Phase 8   | TBD  |
| RES-02      | Phase 8   | TBD  |
| FIX-01      | Phase 9   | TBD  |
| FIX-02      | Phase 9   | TBD  |
