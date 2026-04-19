## 2025-05-15 - Enhancing Dashboard Search UX
**Learning:** Replacing imperative DOM manipulation with declarative React state for search filtering improves reliability and enables better UX features like empty states and "clear search" actions. Using 'useRef' to manage focus after clearing search improves keyboard navigation. Global keyboard shortcuts like '/' for search are intuitive power-user features.
**Action:** Always prefer declarative filtering in React. When adding search, implement an empty state and a way to clear the search that restores focus to the input.
