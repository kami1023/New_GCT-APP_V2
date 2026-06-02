## 2026-06-02 - Advanced Search UX & Declarative Filtering

**Learning:** Transitioning from imperative DOM manipulation to declarative React state for filtering enables complex UI states like "No results found" and simplifies side effects like the '/' global shortcut and input clearing. Imperative styles made it difficult to manage the visibility of multiple components simultaneously.

**Action:** Always prefer declarative state for list filtering to easily support empty states and programmatic focus management. Include a visual hint (e.g., `[/]`) in placeholders when implementing keyboard shortcuts to improve discoverability.
