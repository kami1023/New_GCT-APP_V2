# Palette's Journal

## 2025-02-14 - Keyboard Discoverability for Hover-Only Controls
**Learning:** Actions revealed only on hover (such as a 'Delete' button in a card) must also be made visible on focus (using tailwind `focus-visible:opacity-100` or `group-focus-within:opacity-100`) and include a clear focus ring to ensure discoverability for keyboard-only or screen reader users.
**Action:** Always combine hover states with `focus-visible` or `group-focus-within` visibility for contextual actions, and ensure all icon-only buttons include a descriptive, dynamic `aria-label` utilizing domain object names (e.g., `product.name`) rather than dry system IDs.
