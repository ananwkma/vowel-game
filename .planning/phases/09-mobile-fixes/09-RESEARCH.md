# Research: Phase 09 (Mobile Fixes)

## Objective
Address two mobile UX regressions:
1. FIX-01: "VOWEL" title obscured by Dynamic Island/notch on some devices.
2. FIX-02: Dragged block has a vertical offset from the finger/pointer.

## Findings

### FIX-01: Dynamic Island Spacing
The current `#app` container uses fixed padding:
- Default: `32px 24px`
- `@media (max-width: 425px)`: `24px 12px`
- `@media (max-width: 360px)`: `20px 8px`

**Proposed Solution:**
Use CSS `env(safe-area-inset-top)` to ensure the title respects the device's "unsafe" areas while maintaining a reasonable minimum padding.

```css
#app {
  padding-top: max(24px, env(safe-area-inset-top));
  /* ... other padding ... */
}
```

### FIX-02: Dragged Block Vertical Offset
Analysis of the pointer event handling:
- `pointerdown` (lines 1209-1210):
  ```js
  dragStartX = event.clientX;
  dragStartY = event.clientY;
  ```
- `onPointerMove` -> `requestAnimationFrame` -> `processDragFrame` (line 1152):
  ```js
  const finalTranslateX = moveAt(ev.pageX, ev.pageY);
  ```
- `moveAt` (line 1122):
  ```js
  const translateY = pageY - dragStartY;
  ```

**The Bug:**
The code mixes `clientX/Y` (viewport-relative) and `pageX/Y` (document-relative). If the page is scrolled at all, `pageY` will be greater than `clientY`, creating a vertical offset proportional to the scroll position.

**Proposed Solution:**
Consistently use `clientX` and `clientY` in `moveAt`. Since the game is intended to be a fixed-height app (100vh) where scrolling is generally avoided but can happen on some mobile viewport configurations, `clientX/Y` is the safer and more standard choice for computing "delta" translations from a starting point.

## Strategy

### Task 1: Fix Title Spacing (FIX-01)
1. Update `#app` padding rules in all media queries to include `safe-area-inset` support.
2. Ensure `viewport` meta tag includes `viewport-fit=cover`.

### Task 2: Fix Drag Offset (FIX-02)
1. Modify `moveAt` to accept `clientX` and `clientY`.
2. Update `processDragFrame` to pass `ev.clientX` and `ev.clientY` to `moveAt`.

## Verification Plan

### Automated Verification
- Grep for `safe-area-inset` and `viewport-fit=cover`.
- Grep for `clientX` usage in `moveAt` calls.

### Human Verification
- Test on an iPhone with a notch/island to confirm title spacing.
- Test dragging after scrolling the page slightly (if possible) to confirm the block stays under the finger.
