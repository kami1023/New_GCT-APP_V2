## 2025-03-03 - Keyboard Visibility of Hover-Only Actions

**Learning:** Interactive elements revealed strictly on hover (e.g. Delete/Trash icons inside product cards) are completely inaccessible to keyboard-only and screen reader users. Simply adding `aria-label` is insufficient if the element remains physically hidden (`opacity-0`) during keyboard navigation.

**Action:** Ensure hover-revealed interactive elements always include `focus-visible:opacity-100` alongside existing hover opacity classes, and pair them with explicit focus rings (`focus-visible:ring-2`) to guide the focus indicator.
