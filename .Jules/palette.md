## 2025-05-22 - Search Experience & Keyboard Accessibility

**Learning:** Replacing imperative DOM-based filtering with declarative React state allows for much richer UX patterns like empty states, clear-search actions, and global keyboard shortcuts without state synchronization issues. Focus-visible styles are essential for "hidden" actions (like hover-only delete buttons) to be discoverable by keyboard users.

**Action:** Always favor declarative filtering for search interfaces. Include a '/' keyboard shortcut with a placeholder hint '[/]' for better power-user efficiency. Use `focus-visible` to ensure interactive elements revealed on hover are also visible on focus.
