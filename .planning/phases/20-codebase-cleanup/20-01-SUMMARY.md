---
phase: 20-codebase-cleanup
plan: "01"
subsystem: pwa-manifest
tags: [pwa, manifest, icons, html, mobile]
dependency_graph:
  requires: []
  provides: [manifest.json, icons/lexicon-icon.svg, icons/favicon.svg, pwa-head-tags]
  affects: [index.html, vowel.html, ladder.html, cipher.html, hunt.html]
tech_stack:
  added: []
  patterns: [pwa-web-app-manifest, ios-standalone-meta-tags, svg-icon-tiles]
key_files:
  created:
    - manifest.json
    - icons/lexicon-icon.svg
    - icons/favicon.svg
  modified:
    - index.html
    - vowel.html
    - ladder.html
    - cipher.html
    - hunt.html
decisions:
  - "PNG icons referenced in manifest but not yet created — browser will skip install prompt until exported; SVG master is source of truth"
  - "All five pages unified to identical head tag structure — charset, viewport with viewport-fit=cover, theme-color, manifest, favicon, apple-touch-icon, apple meta tags"
  - "apple-mobile-web-app-title set to 'Lexicon' on all pages (was per-game name before) for consistent home screen branding"
metrics:
  duration_minutes: 8
  completed_date: "2026-03-03"
  tasks_completed: 2
  tasks_total: 2
  files_created: 3
  files_modified: 5
---

# Phase 20 Plan 01: PWA Manifest and Home Screen Icon Infrastructure Summary

**One-liner:** Web app manifest with Lexicon branding, SVG grid-of-tiles icon, and standardized PWA head tags across all five HTML pages enabling iOS/Android home screen pinning.

## Objective

Create the web app manifest and home screen icon infrastructure, then add the required PWA head tags to all five HTML pages so Lexicon can be pinned as a standalone app on iOS/Android home screens.

## Tasks Completed

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Create manifest.json and lexicon-icon.svg | 775811a | manifest.json, icons/lexicon-icon.svg, icons/favicon.svg |
| 2 | Add PWA head tags to all five HTML files | ef53c85 | index.html, vowel.html, ladder.html, cipher.html, hunt.html |

## What Was Built

### manifest.json
Valid PWA manifest at project root with:
- `name`: "Lexicon — Daily Word Games"
- `short_name`: "Lexicon"
- `theme_color`: "#D4A574" (amber)
- `background_color`: "#F8F7F4" (off-white)
- `display`: "standalone"
- References `/icons/lexicon-192.png` and `/icons/lexicon-512.png` (PNG exports from SVG, to be created manually)

### icons/lexicon-icon.svg
512x512 SVG containing a 4x2 grid of 8 letter tiles spelling L-E-X-I-C-O-N with a decorative star on the 8th tile. Color palette:
- Amber tiles (#D4A574): L, X, I, N
- Charcoal tiles (#2C2B28): E, star accent
- Off-white tile (#F5F0E8): C
- Sage tile (#8BAF7C): O

### icons/favicon.svg
32x32 single amber tile with "L" in charcoal for use as browser favicon.

### PWA Head Tags (all five HTML pages)
Each page now has the standardized head structure:
- `<meta name="viewport">` with `maximum-scale=1.0`, `user-scalable=no`, `viewport-fit=cover`
- `<meta name="theme-color" content="#D4A574">`
- `<link rel="manifest" href="/manifest.json">`
- `<link rel="icon" type="image/svg+xml" href="/icons/favicon.svg">`
- `<link rel="apple-touch-icon" href="/icons/lexicon-192.png">`
- `<meta name="apple-mobile-web-app-capable" content="yes">`
- `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`
- `<meta name="apple-mobile-web-app-title" content="Lexicon">`
- Per-page title: "Lexicon — Daily Word Games", "VOWEL — Lexicon", "Word Ladder — Lexicon", "Cipher — Lexicon", "Letter Hunt — Lexicon"

## Decisions Made

1. **PNG icons deferred**: The manifest references `.png` files that do not exist yet. The spec notes these need to be exported manually from the SVG master. The browser will simply not show an install prompt until the PNGs are present — this is acceptable for the current phase.

2. **Unified apple-mobile-web-app-title**: Changed from per-game names ("Vowel", "Word Ladder", "Letter Hunt") to "Lexicon" on all pages. When a user pins any game page, the home screen icon will say "Lexicon" rather than the individual game name.

3. **Cipher em dash**: Cipher's title was "Cipher - Lexicon" (hyphen) — updated to "Cipher — Lexicon" (em dash) for visual consistency with other game titles.

## Deviations from Plan

None — plan executed exactly as written.

## Verification Results

All plan verification criteria passed:
- `manifest.json` parses as valid JSON and prints "OK"
- All 5 HTML files contain exactly one `<link rel="manifest">` tag
- Zero `via.placeholder` references remain in any HTML file
- `icons/` contains `lexicon-icon.svg` and `favicon.svg`
- All 5 files have `<meta name="theme-color" content="#D4A574">`

## Self-Check: PASSED

Files created:
- manifest.json: FOUND
- icons/lexicon-icon.svg: FOUND
- icons/favicon.svg: FOUND

Commits:
- 775811a: FOUND (feat(20-01): add manifest.json and lexicon icon SVG assets)
- ef53c85: FOUND (feat(20-01): add PWA head tags to all five HTML files)
