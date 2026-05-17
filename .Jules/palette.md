## 2025-05-15 - [Declarative Search with Keyboard Shortcut]
**Learning:** Transitioning from imperative DOM manipulation to declarative React state for search results allows for clean implementation of empty states and focus management. Global keyboard shortcuts like '/' significantly improve UX for power users but must be guarded against triggering within input/textarea elements.
**Action:** Always prefer declarative state-based filtering for lists and provide a visible hint (like `[/]`) when implementing keyboard-driven focus.
