## 2026-04-09 - Declarative Search with Empty State Feedback
**Learning:** Replacing imperative DOM search logic with declarative React state filtering ensures predictable rendering and enables clean integration of empty state UI (e.g., 'No matching products' message).
**Action:** When implementing search or filter features, always use React state to drive the visibility of elements and provide a dedicated "empty state" component with a clear call-to-action (like "Clear Search") when no matches are found.
