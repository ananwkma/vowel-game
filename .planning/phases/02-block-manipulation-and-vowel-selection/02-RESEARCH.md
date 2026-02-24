# Phase 2: Block Manipulation & Vowel Selection - Research

**Researched:** 2023-10-27
**Domain:** Vanilla JS Drag-and-Drop, Accessibility (A11y)
**Confidence:** HIGH

## Summary

This research focuses on implementing accessible drag-and-drop functionality for DOM elements in vanilla JavaScript. The primary recommendation is to **build a custom drag-and-drop solution using Pointer Events (`pointerdown`, `pointermove`, `pointerup`)** rather than using the native HTML5 Drag-and-Drop API. A custom implementation provides superior control over user experience, visual feedback, and cross-device compatibility (especially for touch), which are critical for this project. For accessibility, the implementation must follow WAI-ARIA patterns for keyboard-only operation, ensuring users can select, move, and drop elements without a mouse. A custom, accessible popup will be used for vowel selection upon dropping a block.

**Primary recommendation:** Use a custom Pointer Events-based implementation for drag-and-drop and a WAI-ARIA pattern for keyboard accessibility.

## User Constraints

There are no user constraints from a `CONTEXT.md` file for this phase. Research and recommendations are based on the phase goals.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---|---|---|---|
| Vanilla JS (ES6+) | n/a | Core Logic | No external dependencies are required. Modern JS provides all necessary APIs for DOM manipulation, event handling, and state management. |
| Pointer Events API | n/a | Drag-and-Drop | A modern, unified API for handling input from mouse, touch, and pen. Avoids the complexity and limitations of the HTML5 DnD API and provides a better foundation for mobile/touch support. |
| WAI-ARIA | 1.2 | Accessibility | Provides essential attributes (`aria-grabbed`, `aria-dropeffect`, `role="listbox"`) to make custom interactions understandable to assistive technologies. |

### Supporting
| Library | Version | Purpose | When to Use |
|---|---|---|---|
| n/a | n/a | n/a | This phase is focused on a self-contained vanilla JS implementation. No external libraries are necessary. |

## Architecture Patterns

### Pattern 1: Pointer-Event-Based Drag and Drop

**What:** A custom drag-and-drop implementation that manually tracks an element's state and position using pointer events. This avoids the clunky and desktop-centric native HTML5 DnD API.

**When to use:** For all in-page drag-and-drop interactions of DOM elements.

**Key Implementation Details:**
1.  **Initiation (`pointerdown`):**
    *   On `pointerdown` on a draggable element, set a flag (e.g., `isDragging = true`).
    *   Call `element.setPointerCapture(e.pointerId)` to ensure the element receives all subsequent pointer events for that finger/cursor, even if it leaves the element's bounds.
    *   Add a `.dragging` class for visual feedback (e.g., change cursor, add a shadow).
    *   Store the initial pointer coordinates and the offset of the pointer within the element.
2.  **Movement (`pointermove`):**
    *   If `isDragging` is true, update the element's position using `transform: translate(x, y)`. Calculating the position based on the initial offset prevents the element from "jumping" to the cursor.
    *   Check for intersection with drop targets to provide visual feedback (e.g., add a `.drag-over` class to the target).
3.  **Termination (`pointerup`, `pointercancel`):**
    *   On `pointerup`, the drag is complete. Check if the element is over a valid drop target.
    *   Perform the drop action (e.g., append element, trigger vowel picker).
    *   Reset state: `isDragging = false`, remove visual feedback classes.
    *   Call `element.releasePointerCapture(e.pointerId)`.
    *   The `pointercancel` event should also be handled to reset state if the browser interrupts the interaction (e.g., a system gesture).

### Pattern 2: Accessible Keyboard Drag-and-Drop

**What:** A state machine managed by keyboard events to allow non-mouse users to perform drag-and-drop operations.

**When to use:** This pattern MUST be implemented alongside the pointer-based pattern to meet accessibility requirements.

**Keyboard Interaction Model:**
1.  **Navigate & Select:** User navigates to draggable elements with `Tab`. `Space` or `Enter` initiates "drag mode".
2.  **State Change:** The element is marked as "grabbed" (`aria-grabbed="true"`). A screen reader announcement confirms the action (e.g., "Item grabbed. Use Tab to navigate to a drop target and press Enter to drop.").
3.  **Navigate Drop Targets:** While in drag mode, the user presses `Tab` to move focus between valid drop targets only.
4.  **Drop:** When a drop target is focused, pressing `Enter` or `Space` "drops" the element. An announcement confirms the successful drop.
5.  **Cancel:** Pressing `Escape` at any point cancels the drag mode, returns the element to its original position, and announces the cancellation.

### Pattern 3: Accessible Vowel Picker Popup

**What:** A custom, accessible popup that appears on drop, behaving like a `select` listbox.

**When to use:** After a block is successfully dropped on a target that requires vowel selection.

**Structure:**
-   **Trigger:** The `drop` event.
-   **Container:** A `div` with `role="dialog"` or a `ul` with `role="listbox"`.
-   **Options:** List items with `role="option"`.
-   **Keyboard Navigation:**
    -   `ArrowUp`/`ArrowDown` to navigate options.
    -   `Enter` or `Space` to select an option and close the popup.
    -   `Escape` to close the popup without selection.
-   **Focus Management:** On opening, focus must be moved into the picker. On close, focus should return to a logical element (e.g., the dropped block).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---|---|---|---|
| Touch Event Handling | A separate set of `touchstart`, `touchmove`, `touchend` listeners. | The Pointer Events API | Pointer events provide a unified model for mouse, touch, and pen, reducing code duplication and simplifying cross-device support. |
| Native DnD API | An implementation using `draggable="true"` and `dragstart`, `drop` events. | The Pointer Events custom implementation. | The native API has poor touch support, inconsistent browser behavior, and limited control over visual feedback. It's not suitable for this project's requirements. |

## Common Pitfalls

### Pitfall 1: Forgetting `setPointerCapture`
**What goes wrong:** During a drag, if the user moves the mouse or finger too quickly, the cursor can leave the bounds of the draggable element. Without pointer capture, the element stops receiving `pointermove` events, and the drag "sticks" or behaves erratically.
**How to avoid:** Always call `element.setPointerCapture(e.pointerId)` in the `pointerdown` handler. Remember to release it with `releasePointerCapture` on `pointerup`.

### Pitfall 2: Blocking Default Touch Actions
**What goes wrong:** On touch devices, browsers handle gestures like scrolling and zooming. A drag interaction can conflict with this. If not handled, the page might scroll while the user is trying to drag an element.
**How to avoid:** Apply the CSS property `touch-action: none;` to draggable elements. This tells the browser to not perform its default touch actions (like scrolling) when an interaction starts on that element.

### Pitfall 3: Ignoring Accessibility (A11y)
**What goes wrong:** A mouse-only or touch-only drag-and-drop implementation is completely unusable for keyboard-only users and those relying on screen readers. This is a critical failure.
**How to avoid:** Implement the "Accessible Keyboard Drag-and-Drop" pattern from the start. Treat keyboard interaction as a first-class feature, not an afterthought. Use ARIA attributes (`aria-grabbed`, `aria-dropeffect`) to provide semantic information to assistive technologies.

## Code Examples

### Pointer Events Drag-and-Drop Skeleton
```typescript
// Source: Combination of best practices from multiple tutorials.
const draggable = document.getElementById('myDraggable');
let isDragging = false;

draggable.addEventListener('pointerdown', (e) => {
  if (e.button !== 0) return; // Only main button
  isDragging = true;
  draggable.classList.add('dragging');
  draggable.setPointerCapture(e.pointerId);

  // Optional: Calculate offset to prevent element jumping
  // let offsetX = e.clientX - draggable.getBoundingClientRect().left;
});

document.addEventListener('pointermove', (e) => {
  if (!isDragging) return;
  // This is where you update the element's position
  // e.g., draggable.style.transform = `translate(${e.clientX - offsetX}px, ...)`
});

document.addEventListener('pointerup', (e) => {
  if (!isDragging) return;
  isDragging = false;
  draggable.classList.remove('dragging');
  draggable.releasePointerCapture(e.pointerId);

  // Check for drop target and finalize
});
```

### Keyboard Drag-and-Drop State Management
```typescript
// Source: Conceptual pattern based on WAI-ARIA best practices.
let isGrabbing = false;
let grabbedItem = null;

function onKeyDown(e) {
    const activeElement = document.activeElement;

    if (e.key === 'Enter' || e.key === ' ') {
        if (!isGrabbing && activeElement.hasAttribute('data-draggable')) {
            e.preventDefault();
            // Enter "grab" mode
            isGrabbing = true;
            grabbedItem = activeElement;
            grabbedItem.setAttribute('aria-grabbed', 'true');
            // Announce to screen reader: "Item grabbed..."
        } else if (isGrabbing && activeElement.hasAttribute('data-dropzone')) {
            e.preventDefault();
            // Perform the drop
            console.log(`Dropped ${grabbedItem.id} onto ${activeElement.id}`);
            grabbedItem.setAttribute('aria-grabbed', 'false');
            isGrabbing = false;
            grabbedItem = null;
            // Announce to screen reader: "Item dropped."
        }
    } else if (e.key === 'Escape' && isGrabbing) {
        // Cancel grab mode
        grabbedItem.setAttribute('aria-grabbed', 'false');
        isGrabbing = false;
        grabbedItem = null;
        // Announce to screen reader: "Drag cancelled."
    }
}

document.addEventListener('keydown', onKeyDown);
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|---|---|---|---|
| Mouse Events (`mousedown`, etc.) | Pointer Events (`pointerdown`, etc.) | ~2015+ | Simplifies code by unifying mouse, touch, and pen input into a single event model. |
| HTML5 DnD API | Custom Pointer Event logic | n/a | For in-app UI manipulation, a custom implementation offers far greater control and better mobile support than the native API. |
| No A11y / Mouse-only | Keyboard-operable ARIA patterns | n/a | A legal and ethical requirement. Modern web development treats accessibility as a core feature, not an add-on. |

## Open Questions

1.  **Vowel Picker Animation**: What is the desired visual effect for the vowel picker appearing and disappearing?
    *   **What we know**: A popup will appear on drop.
    *   **What's unclear**: The specific animation (fade, slide, scale).
    *   **Recommendation**: Start with a simple fade-in/fade-out using CSS transitions. This can be refined later if needed.

## Sources

### Primary (HIGH confidence)
- General Web Searches on `google_web_search` with queries like:
  - "html5 drag and drop api vs mouse events for dom elements"
  - "vanilla js pointer events drag and drop tutorial"
  - "WAI-ARIA accessible drag and drop pattern keyboard"
  - "accessible custom select list popup vanilla js tutorial"
- Synthesis of numerous tutorials, MDN documentation, and accessibility guides (like WAI-ARIA practices). The patterns recommended are well-established in the front-end community.
