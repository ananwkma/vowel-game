# Requirements: Yellow Blocks Word Game

**Defined:** 2026-02-19
**Core Value:** Players can drag vowel blocks to construct any valid word from a consonant sequence

## v1 Requirements

### Core Gameplay

- [ ] **CORE-01**: Random English word selected each round; consonants extracted in their original order
- [ ] **CORE-02**: N blank yellow blocks shown at LEFT of the display string (N = vowel count of selected word), followed by consonant blocks in order (e.g. "_ _ C R W D")
- [ ] **CORE-03**: Player drags a blank yellow block horizontally only — it can be inserted between, before, or after consonant blocks
- [ ] **CORE-04**: On drop, a vertical A/E/I/O/U selection bar fades in next to the placed block
- [ ] **CORE-05**: Player selects a vowel by clicking it or dragging the block vertically through the bar
- [ ] **CORE-06**: Vowel bar fades out after a vowel is selected; yellow block shows the chosen letter
- [ ] **CORE-07**: When all blank blocks are placed AND each has a vowel selected, auto-check if the constructed string is a valid English word
- [ ] **CORE-08**: Valid word → background turns bright green; auto-advance to new word after ~2 seconds
- [ ] **CORE-09**: "Give Up" button → background turns salmon/red, target word revealed with correct vowels shown in yellow blocks; auto-advance to new word after ~2 seconds

### Word Engine

- [ ] **WORD-01**: Word list embedded in JS (common English words, no external API)
- [ ] **WORD-02**: Words selected randomly each round with no immediate repeat
- [ ] **WORD-03**: Only words containing at least one A/E/I/O/U vowel qualify as puzzle words
- [ ] **WORD-04**: Valid word check uses the same embedded word list (any valid word with those consonants in order wins, not just the target word)

### Visuals

- [ ] **VIS-01**: Teal/mint background (#4DC5C5 range) during active play
- [ ] **VIS-02**: Bright green background on win state
- [ ] **VIS-03**: Salmon/red background on give up state
- [ ] **VIS-04**: Gray square blocks for consonants (white text); yellow square blocks for vowel slots (black text)
- [ ] **VIS-05**: Title "Move the Yellow Blocks to Form Words" — top-left, bold black
- [ ] **VIS-06**: "Give Up" button — bottom-center, salmon/red colored

## v2 Requirements

### Enhancements

- **ENH-01**: Score tracking (words solved vs. given up)
- **ENH-02**: Streak counter (consecutive wins)
- **ENH-03**: Difficulty filter (short words vs. long words)
- **ENH-04**: Hint system (reveal one vowel)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Timer/countdown | Not in original design, adds stress without value |
| Multiplayer | Single-player concept |
| Mobile native app | Browser game is sufficient |
| Word category hints | User explicitly chose minimal UI |
| External dictionary API | Word list embedded for offline-first simplicity |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CORE-01 | Phase 1 | Pending |
| CORE-02 | Phase 1 | Pending |
| CORE-03 | Phase 2 | Pending |
| CORE-04 | Phase 2 | Pending |
| CORE-05 | Phase 2 | Pending |
| CORE-06 | Phase 2 | Pending |
| CORE-07 | Phase 3 | Pending |
| CORE-08 | Phase 3 | Pending |
| CORE-09 | Phase 3 | Pending |
| WORD-01 | Phase 1 | Pending |
| WORD-02 | Phase 1 | Pending |
| WORD-03 | Phase 1 | Pending |
| WORD-04 | Phase 3 | Pending |
| VIS-01 | Phase 1 | Pending |
| VIS-02 | Phase 3 | Pending |
| VIS-03 | Phase 3 | Pending |
| VIS-04 | Phase 1 | Pending |
| VIS-05 | Phase 1 | Pending |
| VIS-06 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 15 total
- Mapped to phases: 15
- Unmapped: 0 ✓

---
*Requirements defined: 2026-02-19*
*Last updated: 2026-02-19 after initial definition*
