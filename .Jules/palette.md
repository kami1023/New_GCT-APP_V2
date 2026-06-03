## 2026-06-03 - Enhanced Search Experience
**Learning:** Implementing a global '/' shortcut for search significantly improves power-user efficiency, but it must include a check for the current active element to avoid hijacking text input in other fields. Additionally, providing a visual hint (like [/] in the placeholder) and a clear "No results" state with a quick reset action makes the search more intuitive and discoverable.
**Action:** When adding search-heavy interfaces, always include a global keyboard shortcut with proper focus-guarding and an explicit empty state UI.
