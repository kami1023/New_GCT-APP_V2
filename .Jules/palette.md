## 2025-06-12 - [Declarative Search & Keyboard Accessibility]
**Learning:** Imperative DOM manipulation for search filtering (using `querySelectorAll` and `style.display`) is brittle and prevents the implementation of advanced UX features like empty states or clear actions. Hover-only actions (like the Delete button) are inaccessible to keyboard and screen reader users unless explicitly handled with `focus-visible`.

**Action:** Always refactor imperative filtering to declarative React state. Ensure all hover-triggered actions include `focus-visible:opacity-100` and `aria-label` for accessibility.
