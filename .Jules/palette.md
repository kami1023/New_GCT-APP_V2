## 2025-05-23 - Declarative Search and Focus-Visible Accessibility

**Learning:** Imperative DOM manipulation for search filtering (e.g., `document.querySelectorAll`) in React apps leads to inconsistent UI states and makes implementing "No results" empty states difficult. Additionally, actions revealed only on hover (like delete buttons) are inaccessible to keyboard users unless explicitly handled with `focus-visible`.

**Action:** Always refactor imperative search to declarative state-based filtering. For hover-only actions, use `focus-visible:opacity-100` and clear focus rings to ensure they are discoverable and usable for keyboard-only users. Include ARIA labels with item-specific context for icon buttons.
