## 2025-05-22 - [Search UX & Declarative Refactoring]
**Learning:** Imperative DOM manipulation for search filtering makes it difficult to implement robust "No results found" empty states. Refactoring to declarative React state filtering enables clean conditional rendering of empty states and "Clear Search" actions. Adding a `[/]` hint in the placeholder improves discoverability of the global focus shortcut.
**Action:** Always prefer declarative state-based filtering for collections to ensure accessibility and consistent empty state handling. Include keyboard shortcut hints in placeholders.
