## 2025-05-18 - Keyboard Discoverability for Hover-Only Card Actions
**Learning:** In glass-morphism cards, actions hidden by default (`opacity-0 group-hover:opacity-100`) lock out keyboard users unless explicitly revealed on keyboard focus using `focus-visible:opacity-100` and styled with high-contrast focus rings.
**Action:** Always combine `group-hover:opacity-100` with `focus-visible:opacity-100 focus-visible:ring-2` on card action buttons.
