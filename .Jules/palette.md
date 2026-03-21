## 2024-05-22 - [Accessibility & Micro-UX]
**Learning:** Accessibility is a core part of UX. Interactive elements, especially icon-only buttons, should always have a descriptive `aria-label`. Furthermore, elements hidden by default (e.g., until hover) should be made visible when they receive keyboard focus using `focus-visible:opacity-100` to ensure a consistent experience for all users.
**Action:** Always check for icon-only buttons and add `aria-label`. Ensure focus states are visible for all interactive elements, even those that have hover-only visibility.
