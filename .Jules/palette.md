## 2025-05-15 - Declarative Search & Keyboard Accessibility
**Learning:** Transitioning from imperative DOM manipulation (manually toggling styles) to declarative React state filtering significantly improves maintainability and enables cleaner UX patterns like "No results found" empty states.
**Action:** Always use declarative state for filtering lists. Implement a global '/' keyboard shortcut for search focus, ensuring focus is returned after clearing and handling tab switches if necessary.
