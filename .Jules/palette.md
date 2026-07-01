## 2025-05-15 - [Search UX & Accessibility Refactor]
**Learning:** Refactoring legacy imperative search (direct DOM manipulation) to declarative React state enables much richer micro-interactions, such as "No results" states, keyboard shortcuts, and "Clear search" buttons, with minimal code overhead.
**Action:** Always favor derived state for filtering logic to ensure the UI stays in sync and remains accessible to screen readers and keyboard users.
