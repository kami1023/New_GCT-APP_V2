## 2025-05-15 - [Search UX Refactoring]
**Learning:** Imperative DOM manipulation for search filtering (like `document.querySelectorAll`) is brittle and makes implementing accessible empty states difficult. Declarative React state for filtering enables predictable UI transitions and cleaner accessibility (ARIA labels, focus management).
**Action:** Always prefer deriving filtered lists from state in React and use `useRef` for refocusing inputs after destructive/reset actions like "Clear Search".
