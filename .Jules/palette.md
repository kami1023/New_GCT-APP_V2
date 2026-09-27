## 2025-05-20 - Hover Action Accessibility on Dark Card Components
**Learning:** Actions revealed only on hover in card containers (like delete icons) are completely hidden from keyboard users unless paired with `group-focus-within:opacity-100` and `focus-visible:opacity-100`. Furthermore, `text-zinc-700` has insufficient color contrast on dark `#0a0c10` backgrounds, requiring at least `text-zinc-400`.
**Action:** Always include focus-within/focus-visible opacity utility classes and ensure high contrast icon styling for hover-revealed card controls.
