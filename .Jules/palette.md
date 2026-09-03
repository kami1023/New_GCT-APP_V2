## 2025-05-18 - Inventory Card Keyboard Accessibility and Screen Reader Labels
**Learning:** Actions revealed only on hover in card components (like delete buttons) remain hidden from keyboard-only users unless focus-within/focus-visible styles are applied, and icon-only controls require explicit ARIA labels specifying the target item name for screen readers.
**Action:** Always pair `group-hover` with `group-focus-within` or `focus-visible` for card action triggers, and format ARIA labels using `[Action] [item name]` (e.g. `aria-label={`Delete ${product.name}`}`).
