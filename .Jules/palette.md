# Palette UX & Accessibility Journal

## 2025-05-15 - Inventory Card Keyboard Discoverability & ARIA Labels
**Learning:** Card action buttons hidden with `opacity-0 group-hover:opacity-100` are completely inaccessible to keyboard-only users who tab through elements, and icon-only buttons (like delete, restock, or dialog close) lack accessible names for screen reader users.
**Action:** Always combine `group-focus-within:opacity-100` / `focus-visible:opacity-100` with hover styles on hidden card actions, use readable text colors (avoiding low-contrast `text-zinc-700` on dark backgrounds), and provide descriptive `aria-label`s specifying the target item name for icon-only actions.
