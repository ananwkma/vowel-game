# Phase 14: Hub + VOWEL Migration - Context

**Gathered:** 2026-02-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the game collection portal (index.html) with card-based navigation, move VOWEL to vowel.html, establish shared CSS design tokens, and show daily completion status on the hub. This phase does NOT build Word Ladder or Letter Hunt — it only creates the structure and placeholder cards for them.

</domain>

<decisions>
## Implementation Decisions

### Hub card design
- Game name only on each card — no tagline, no description. Maximum minimalism.
- Layout: 1 column on mobile, 2-column grid on desktop
- Hover state: amber tint / subtle color shift on hover (primary preference); subtle lift/shadow as backup if tint feels off
- Title + subtitle area above the cards — collection name placeholder (use "Word Games" until real name decided) + one-line tagline

### Completion status
- Completed game card: dims / muted appearance (lower opacity or desaturated). No text change — purely visual.
- Data source: shared localStorage key (e.g. `wordGames_dailyStatus`) that each game writes to when done. Hub reads this one key. VOWEL must be updated in this phase to write to the shared key on puzzle completion.
- No prompts or nudges for unplayed games — cards look the same whether unplayed or not-yet-available

### Unbuilt game cards (Word Ladder, Letter Hunt)
- Show real game names on the cards (Word Ladder, Letter Hunt)
- Cards are visually greyed out / clearly inactive — not clickable
- Tapping/clicking an unbuilt card does nothing — no response, no tooltip

### Navigation & back button
- Each game page (vowel.html, and future game pages) has a small back arrow / home icon fixed in the top corner linking to index.html (the hub)
- index.html becomes the hub — no redirect from old VOWEL URL. Old bookmarks will land on the hub.
- Page transitions: subtle CSS fade or slide when navigating hub → game and game → hub
- Collection name placeholder: "Word Games" — can be swapped for real name without code changes

### Claude's Discretion
- Exact CSS for the amber tint hover effect (hue-rotate, brightness, or overlay — whatever looks best with the existing amber/warm palette)
- Exact opacity/desaturation values for the dimmed completed-card state
- Positioning and size of the back arrow icon
- Whether the fade/slide transition is CSS View Transitions API or a JS-based approach
- Exact `dailyStatus` localStorage key name and schema structure

</decisions>

<specifics>
## Specific Ideas

- The back arrow/home icon should be unobtrusive during gameplay — small and in a corner, not a nav bar that takes vertical space
- Hover tint should feel like the existing amber/tan color palette — not jarring
- The 2-column desktop grid should not feel cluttered — cards need breathing room
- The hub should feel like a calm landing page, not a busy game lobby

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 14-hub-vowel-migration*
*Context gathered: 2026-02-25*
