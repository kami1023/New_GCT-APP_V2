## 2025-05-15 - [Search UX & Accessibility Overhaul]
**Learning:** Declarative React state filtering is vastly superior to imperative DOM manipulation for search, as it enables predictable rendering of "No results found" states and easier integration of keyboard shortcuts.
**Action:** Always refactor legacy imperative DOM manipulation to declarative React state when improving search interfaces. Ensure global keyboard shortcuts (like `/`) check for existing focus on inputs/textareas to avoid focus hijacking.
