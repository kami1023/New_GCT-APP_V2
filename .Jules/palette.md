## 2025-05-14 - Search UI Modernization
**Learning:** Imperative DOM manipulation for search filtering in React applications leads to brittle code and makes it difficult to implement advanced features like global keyboard shortcuts or complex empty states.
**Action:** Always prefer declarative React state for filtering lists. Use `useRef` and `setTimeout` for programmatic focus management after tab switches or keyboard shortcuts to ensure the DOM is ready.
