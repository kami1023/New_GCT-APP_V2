## 2026-03-19 - Declarative Search UX Pattern
**Learning:** Transitioning search logic from imperative DOM manipulation to declarative React state enables more robust UX features such as 'No results' empty states and programmatic focus management while keeping the codebase concise.
**Action:** When designing a search field, implement it declaratively using `useState`, expose an inline 'X' clear action when non-empty (with appropriate padding to avoid overlapping input text), and use `useRef` to return focus to the input on clear or reset.
