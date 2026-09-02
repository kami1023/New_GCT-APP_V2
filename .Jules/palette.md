# Palette UX Journal

## 2025-05-10 - Focus Visibility for Hover Actions
**Learning:** Action buttons hidden on hover (`opacity-0`) in card layouts are inaccessible to keyboard-only users unless explicitly configured to reveal on focus (`group-focus-within:opacity-100` / `focus-visible:opacity-100`).
**Action:** Always combine hover opacity rules with `group-focus-within` or `focus-visible` to ensure keyboard accessibility.
