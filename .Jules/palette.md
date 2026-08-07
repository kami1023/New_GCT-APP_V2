# Palette's Journal - Ganesh Clean Tech

## 2025-02-18 - [Accessibility & Keyboard Navigation on Dark Themes]
**Learning:** Actions revealed only on hover (like the delete/trash icon on product inventory cards) are completely inaccessible to keyboard-only and screen reader users. Additionally, on very dark backgrounds (such as `#0a0c10`), low-contrast text colors like `text-zinc-700` fall below contrast threshold standards, making the control hard to see even when hovered or active.
**Action:** When designing hover actions, ensure they are also revealed on focus (`group-focus-within:opacity-100` / `focus-visible:opacity-100`) with distinct focus indicators (`focus-visible:ring-2 focus-visible:ring-red-500`). Use more readable high-contrast neutral colors (e.g. `text-zinc-400`) on dark themes, and always include descriptive, product-specific `aria-label` properties.
