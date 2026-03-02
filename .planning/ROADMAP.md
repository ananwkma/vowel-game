# Roadmap: Word Game Collection

## Milestones

- ✅ **v1.0 MVP** — Phases 1–5 (shipped 2026-02-23)
- ✅ **v1.1 Score, Streaks & Mobile Polish** — Phases 6–9 (shipped 2026-02-24)
- ✅ **v1.2 Daily Leaderboard & Backend Stats** — Phases 10–13 (shipped 2026-02-25)
- ✅ **v2.0 Word Game Collection** — Phases 14–19 (shipped 2026-03-01)

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

<details>
<summary>✅ v2.0 Word Game Collection (Phases 14–19) — SHIPPED 2026-03-01</summary>

See .planning/milestones/v2.0-ROADMAP.md

- [x] **Phase 14: Hub + VOWEL Migration** — Portal hub with card navigation; VOWEL relocated to vowel.html with shared design tokens (completed 2026-02-26)
- [x] **Phase 15: Word Ladder** — Daily start-to-target word puzzle with BFS optimal path, path history, and results reveal (completed 2026-02-27)
- [x] **Phase 16: Ladder Polish** — Bug fixes and UX improvements to Word Ladder post-launch (completed 2026-02-27)
- [x] **Phase 17: Cipher** — Daily famous quote encoded as number substitution cipher; tap-and-type to decode (completed 2026-02-27)
- [x] **Phase 18: Letter Hunt** — Daily word-search grid with drag selection, mystery category reveal, two-phase timed scoring (completed 2026-02-28)
- [x] **Phase 19: Difficulty Calibration & Play-test** — ?date= testing override for all games, Cipher repetition filter + pre-reveal, Ladder 3–4 step paths, Hunt moderate-stretch hard words; 9 bugs found and fixed in play-test (completed 2026-03-01)

</details>

### Phase 20: Codebase Cleanup

**Goal:** Deep readability-first restructure of all five HTML files — consistent JS/CSS section ordering, dead code removed, shared logic extracted where it aids clarity; plus web app manifest + "Lexicon" home screen icon (grid-of-tiles SVG) added to all pages
**Depends on:** Phase 19
**Requirements:** —
**Plans:** 5 plans

Plans:
- [ ] 20-01-PLAN.md — Manifest + icons: create manifest.json, lexicon-icon.svg, and add PWA head tags to all 5 pages
- [ ] 20-02-PLAN.md — Create shared.js (seededRandom, DATE_SEED, IS_DEBUG, DailyStatus) + full restructure of vowel.html
- [ ] 20-03-PLAN.md — Full restructure of ladder.html (shared.js integration + standard section ordering)
- [ ] 20-04-PLAN.md — Full restructure of cipher.html (add CSS section markers + shared.js integration)
- [ ] 20-05-PLAN.md — Full restructure of hunt.html + minor cleanup of index.html

### Phase 21: Feature Updates & Bug Fixes

**Goal:** Cipher: backspace/delete clears a letter assignment (all occurrences, anchor-protected); Cipher + Ladder + Hunt fixed to guarantee no puzzle repeats within a 150-day rolling window (consecutive-day repeats reported); Cipher and Hunt corpora expanded to support the window
**Depends on:** Phase 20
**Requirements:** —
**Plans:** TBD

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1–5. Foundation → Mobile | v1.0 | 18/18 | Complete | 2026-02-23 |
| 6–9. Daily Engine → Mobile Fixes | v1.1 | 6/6 | Complete | 2026-02-24 |
| 10–13. Backend & Leaderboard | v1.2 | 6/6 | Complete | 2026-02-25 |
| 14. Hub + VOWEL Migration | v2.0 | 3/3 | Complete | 2026-02-26 |
| 15. Word Ladder | v2.0 | 3/3 | Complete | 2026-02-27 |
| 16. Ladder Polish | v2.0 | 1/1 | Complete | 2026-02-27 |
| 17. Cipher | v2.0 | 2/2 | Complete | 2026-02-27 |
| 18. Letter Hunt | v2.0 | 3/3 | Complete | 2026-02-28 |
| 19. Difficulty Calibration | v2.0 | 4/4 | Complete | 2026-03-01 |
| 20. Codebase Cleanup | — | 0/5 | Not started | — |
| 21. Feature Updates & Bug Fixes | — | 0/? | Not started | — |

---
*Roadmap created: 2026-02-19*
*Last updated: 2026-03-02 — Phase 21 Feature Updates & Bug Fixes added*
