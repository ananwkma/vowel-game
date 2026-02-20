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

- [ ] **VIS-01**: Elegant modern design — a cohesive color palette (not necessarily teal/salmon from screenshots); beautiful, clean aesthetic
- [ ] **VIS-02**: Distinct win state background color (e.g. soft green or equivalent celebratory tone)
- [ ] **VIS-03**: Distinct give up state background color (e.g. warm red/rose tone)
- [ ] **VIS-04**: Letter blocks styled with modern design — consonants and vowel slots visually distinct; smooth rounded corners, subtle shadows
- [ ] **VIS-05**: Title "Move the Yellow Blocks to Form Words" — top-left, bold, typography consistent with modern design language
- [ ] **VIS-06**: "Give Up" button — bottom-center, styled consistently with give up state color

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

**Coverage:**
- v1 requirements: 15 total
- Mapped to phases: 15
- Unmapped: 0 ✓

---

*Requirements defined: 2026-02-19*
*Last updated: 2026-02-19 after roadmap creation*
