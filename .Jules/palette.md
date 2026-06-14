## 2025-05-15 - [Refactoring Search to Declarative State]
**Learning:** The inventory dashboard used imperative DOM manipulation (`document.querySelectorAll`) for product filtering, which is brittle and misses features like empty states. Refactoring to declarative React state allows for more robust filtering, easy implementation of "No results found" views, and better accessibility.
**Action:** Always prefer declarative state-driven filtering over imperative DOM manipulation in React applications to ensure consistency and support rich empty-state UIs.

## 2025-05-15 - [Global Search Shortcuts with Tabbed Interfaces]
**Learning:** In a tabbed dashboard, a global search shortcut (like `/`) should not only focus the input but also switch to the correct tab if the input is not currently rendered. Using `setTimeout(..., 0)` ensures the DOM is updated before the focus attempt.
**Action:** When implementing global shortcuts, verify if the target element is visible and programmatically navigate to the required view if necessary before focusing.
