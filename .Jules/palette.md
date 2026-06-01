## 2025-06-01 - Improving Search UX and Action Accessibility

**Learning:** Imperative DOM manipulation for filtering (hiding/showing elements via `display: none`) in React makes it difficult to implement associated UX features like "No results found" empty states and prevents consistent state management. Additionally, actions hidden behind hover (e.g., delete buttons) are inaccessible to keyboard users unless explicitly handled with `focus-within` or `focus-visible`.

**Action:** Always refactor imperative filtering to declarative React state. Use `group-focus-within:opacity-100` and `focus-visible:ring` to ensure hover-actions are discoverable and usable for keyboard-only users.
