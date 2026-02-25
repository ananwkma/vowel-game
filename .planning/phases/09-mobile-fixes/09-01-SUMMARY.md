# Summary: Phase 09, Plan 01 (Mobile Fixes)

Addressed two mobile-specific UX regressions related to layout and touch interaction.

## Progress

### Completed Tasks
- **Task 1: Fix Title Spacing (FIX-01)**
  - Added `viewport-fit=cover` to the `viewport` meta tag to enable safe-area utilization.
  - Updated `#app` container CSS to use `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)` for padding.
  - Ensured safe-area support across all responsive breakpoints (default, 425px, and 360px).
- **Task 2: Fix Drag Offset (FIX-02)**
  - Standardized coordinate handling in the drag-and-drop system by switching from `pageX/Y` to `clientX/Y`.
  - Updated `moveAt()` definition and its call site in `processDragFrame` to use `clientX/Y`, matching the initialization in `pointerdown`.
  - Resolved the vertical offset issue that occurred when the page was scrolled.

### Requirements Covered
- **FIX-01**: The "VOWEL" title is no longer obscured by Dynamic Island/notch and has visible space above it.
- **FIX-02**: When dragging on mobile, the block center aligns with the finger/pointer regardless of scroll position.

## Verification Results

### Automated Tests
- Verified via `Select-String`:
  - `viewport-fit=cover` is present in the meta tag.
  - `safe-area-inset-top` is used in 3 CSS rules for `#app`.
  - `moveAt(ev.clientX, ev.clientY)` is correctly called in the rAF loop.

### Manual Verification Required
- Confirm title spacing on a notched iOS/Android device.
- Confirm drag-center alignment on mobile, especially after vertical scrolling.

## Artifacts Created/Modified
- `index.html`: Updated meta tag, CSS layout rules, and pointer event logic.
