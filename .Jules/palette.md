## 2024-05-24 - [Accessible Invisible Elements]
**Learning:** Elements that are visually hidden (e.g., `opacity-0`) but interactive must be made visible on focus (e.g., `focus-visible:opacity-100`) to be accessible to keyboard users.
**Action:** Always pair `group-hover:opacity-100` with `focus-visible:opacity-100` for interactive elements that are hidden by default.
