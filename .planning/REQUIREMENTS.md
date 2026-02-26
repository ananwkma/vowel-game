# Requirements: Word Game Collection

**Defined:** 2026-02-25
**Core Value:** Players can instantly understand and interact with any puzzle — the mechanics are intuitive, the win/lose feedback is immediate and satisfying.

## v2.0 Requirements

Requirements for the Word Game Collection milestone. Each maps to roadmap phases.

### Hub

- [ ] **HUB-01**: User can see a card-based hub portal with a card for each game (VOWEL, Word Ladder, Letter Hunt)
- [ ] **HUB-02**: User can navigate from the hub to any game via its card
- [ ] **HUB-03**: User can see on the hub which of today's daily puzzles they have already completed
- [ ] **HUB-04**: All game files share a common set of CSS design tokens (colors, fonts, spacing) for visual consistency
- [ ] **HUB-05**: VOWEL game is accessible at vowel.html with identical functionality to the current index.html game

### Word Ladder

- [ ] **LADR-01**: User can play a daily Word Ladder puzzle — one start→target word pair per day, same for all players
- [ ] **LADR-02**: User's word entry is only accepted if it differs from the previous word by exactly one letter and is a valid dictionary word
- [ ] **LADR-03**: User can see a path history showing their chain of words from start toward the target as they play
- [ ] **LADR-04**: User's personal best (fewest steps) for each daily puzzle is persisted in localStorage
- [ ] **LADR-05**: After completing or giving up, user can see the optimal shortest path computed by BFS

### Letter Hunt

- [ ] **HUNT-01**: User can play a daily Letter Hunt puzzle — one word-search grid per day, same for all players
- [ ] **HUNT-02**: The puzzle contains 6 hidden words belonging to a mystery category (3 easy + 3 hard) arranged in the grid
- [ ] **HUNT-03**: User can click-and-drag to draw a lasso/bubble selection around letters; valid category words persist highlighted, invalid selections dissolve
- [ ] **HUNT-04**: After all 3 easy words are found, the mystery category name is revealed before the hard phase begins
- [ ] **HUNT-05**: Easy phase and hard phase are each timed independently, with separate scores recorded for each

## Future Requirements

Acknowledged but deferred to a future milestone.

### Platform

- **PLAT-01**: Backend tracks Word Ladder and Letter Hunt scores (currently localStorage only)
- **PLAT-02**: Cloud deployment of backend so stats are shared across all players
- **PLAT-03**: Multi-game daily streak (reward for completing all three daily games)

### Enhancements

- **ENH-03**: Difficulty filter (carried over from v1.x deferred list)
- **ENH-04**: Hint system (carried over from v1.x deferred list)

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Multiplayer / social sharing | High complexity, breaks offline model — v3+ |
| User authentication / login | Anonymous play sufficient; crypto.randomUUID() identity in use |
| Cloud deployment | Backend still local; validated in v1.2; deploy is a v2.1 candidate |
| Difficulty filter for Word Ladder | Breaks daily fairness model (all players same puzzle) |
| User-generated puzzles | Moderation burden, out of scope for curated daily experience |
| Audio / sound effects | Not part of the minimalistic aesthetic |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| HUB-01 | Phase 14 | Pending |
| HUB-02 | Phase 14 | Pending |
| HUB-03 | Phase 14 | Pending |
| HUB-04 | Phase 14 | Pending |
| HUB-05 | Phase 14 | Pending |
| LADR-01 | Phase 15 | Pending |
| LADR-02 | Phase 15 | Pending |
| LADR-03 | Phase 15 | Pending |
| LADR-04 | Phase 15 | Pending |
| LADR-05 | Phase 15 | Pending |
| HUNT-01 | Phase 16 | Pending |
| HUNT-02 | Phase 16 | Pending |
| HUNT-03 | Phase 16 | Pending |
| HUNT-04 | Phase 16 | Pending |
| HUNT-05 | Phase 16 | Pending |

**Coverage:**
- v2.0 requirements: 15 total
- Mapped to phases: 15
- Unmapped: 0 ✓

---
*Requirements defined: 2026-02-25*
*Last updated: 2026-02-25 — traceability mapped to phases 14-16*
