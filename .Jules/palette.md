## 2026-04-13 - Refactoring Search: Imperative to Declarative
**Learning:** Refactoring the dashboard search from imperative DOM manipulation (using `document.querySelectorAll`) to declarative React state ensures a more predictable and accessible UI. It allows for clean integration of "No results found" feedback and focus management (using `useRef`) that would be cumbersome with direct DOM manipulation.
**Action:** Always favor declarative state filtering for search/filter interfaces to enable robust accessibility features (like `aria-live` or focus return) and clear empty states.
