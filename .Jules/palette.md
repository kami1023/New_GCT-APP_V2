# Palette's Journal - Critical Learnings

## 2025-05-15 - Inventory Card Accessibility & Focus States
**Learning:** Icon-only action buttons hidden behind hover states (e.g., delete buttons) must be made keyboard-accessible via `focus-visible:opacity-100` and `focus-visible:ring-2` focus indicators, along with descriptive `aria-label`s specifying the targeted item.
**Action:** Always complement `group-hover:opacity-100` with `focus-visible:opacity-100` and include descriptive ARIA attributes for screen reader support on item cards.
