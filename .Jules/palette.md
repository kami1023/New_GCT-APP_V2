## 2025-08-22 - Focus-Visible Accessibility for Card Action Buttons
**Learning:** In dark-themed card components with hover-revealed action buttons (e.g. Delete), action buttons hidden behind `opacity-0 group-hover:opacity-100` are completely inaccessible to keyboard users unless paired with `focus-visible:opacity-100` and `group-focus-within:opacity-100`.
**Action:** When designing cards with actions revealed on hover, always combine hover opacity utilities with `focus-visible:opacity-100` and include descriptive item-specific `aria-label` props for screen reader clarity.
