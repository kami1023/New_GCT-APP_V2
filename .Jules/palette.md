# Palette UX Journal

## 2025-10-01 - Hover-only Action Buttons on Dark Inventory Cards
**Learning:** Icon-only action buttons hidden behind hover states (`opacity-0 group-hover:opacity-100`) in dark glassmorphism cards become completely inaccessible to keyboard navigation unless `group-focus-within:opacity-100` and `focus-visible:opacity-100` are applied alongside product-specific `aria-label`s.
**Action:** Always pair hover-revealed card actions with `group-focus-within:opacity-100 focus-visible:opacity-100` and descriptive ARIA labels incorporating the target item's name.
