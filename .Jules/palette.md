## 2026-03-24 - Inventory Card Focus Visibility and Action Labelling
**Learning:** Actions hidden until hover (like delete on inventory cards) are completely inaccessible to keyboard-only users unless explicitly revealed via `focus-visible:opacity-100` alongside high-contrast focus rings and accessible labels identifying the item by name rather than arbitrary IDs.
**Action:** When adding hover-only utility actions on dashboard cards, always pair them with `focus-visible:opacity-100`, distinct focus ring styles, and rich `aria-label`s containing the item's human-readable name.
